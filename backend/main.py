from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import uuid
import json
from datetime import datetime, timedelta
from bson import ObjectId
import asyncio
from contextlib import asynccontextmanager

# AI Module Imports
from ai_module.traffic_detector import TrafficViolationDetector
from ai_module.plate_recognition import NumberPlateRecognizer

# Database Models
from database.models import User, Violation, Camera, ViolationCreate, UserCreate
from database.database import get_database, init_db

# Auth
from auth.auth_handler import AuthHandler
from auth.google_auth import GoogleAuth

# Configuration
from config.settings import Settings

settings = Settings()
auth_handler = AuthHandler()
google_auth = GoogleAuth()

# AI Detector
detector = TrafficViolationDetector()
plate_recognizer = NumberPlateRecognizer()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    await init_db()
    # Initialize AI models
    await detector.load_models()
    yield

app = FastAPI(
    title="TraffEye API",
    description="AI-Powered Smart Traffic Violation Detection System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://traffeye.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/violations", StaticFiles(directory="uploads/violations"), name="violations")

# Pydantic Models
class VideoUploadResponse(BaseModel):
    video_id: str
    status: str
    message: str

class ViolationResponse(BaseModel):
    id: str
    vehicle_number: str
    violation_type: str
    date: str
    time: str
    location: str
    latitude: float
    longitude: float
    image_url: str
    fine_amount: int
    status: str
    confidence_score: float

class DashboardStats(BaseModel):
    total_violations: int
    helmet_violations: int
    triple_riding: int
    signal_violations: int
    paid_challans: int
    unpaid_challans: int

class AnalyticsData(BaseModel):
    daily_violations: List[Dict[str, Any]]
    peak_hours: List[Dict[str, Any]]
    location_heatmap: List[Dict[str, Any]]
    violation_categories: Dict[str, int]

# API Routes

@app.get("/")
async def root():
    return {"message": "TraffEye API is running", "version": "1.0.0"}

@app.post("/auth/google-login")
async def google_login(token: str):
    """Google OAuth login"""
    try:
        user_info = await google_auth.verify_token(token)
        db = await get_database()
        
        # Check if user exists
        user = await db.users.find_one({"email": user_info["email"]})
        
        if not user:
            # Create new user
            user_data = UserCreate(
                name=user_info["name"],
                email=user_info["email"],
                picture=user_info.get("picture", "")
            )
            user_dict = user_data.dict()
            user_dict["created_at"] = datetime.utcnow()
            user_dict["vehicles"] = []
            
            result = await db.users.insert_one(user_dict)
            user = await db.users.find_one({"_id": result.inserted_id})
        
        # Generate JWT token
        access_token = auth_handler.encode_token(str(user["_id"]))
        
        return {
            "access_token": access_token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "vehicles": user.get("vehicles", [])
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authentication failed")

@app.post("/upload-video", response_model=VideoUploadResponse)
async def upload_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    camera_id: str = None,
    location: str = None,
    latitude: float = None,
    longitude: float = None
):
    """Upload video for AI processing"""
    try:
        # Validate file type
        if not file.content_type.startswith("video/"):
            raise HTTPException(status_code=400, detail="File must be a video")
        
        # Generate unique video ID
        video_id = str(uuid.uuid4())
        
        # Save video file
        video_path = f"uploads/videos/{video_id}.mp4"
        os.makedirs("uploads/videos", exist_ok=True)
        
        with open(video_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Save video metadata
        db = await get_database()
        video_metadata = {
            "video_id": video_id,
            "filename": file.filename,
            "camera_id": camera_id,
            "location": location,
            "latitude": latitude,
            "longitude": longitude,
            "status": "processing",
            "uploaded_at": datetime.utcnow(),
            "processed_at": None
        }
        
        await db.videos.insert_one(video_metadata)
        
        # Start AI processing in background
        background_tasks.add_task(
            process_video_for_violations,
            video_id,
            video_path,
            camera_id,
            location,
            latitude,
            longitude
        )
        
        return VideoUploadResponse(
            video_id=video_id,
            status="processing",
            message="Video uploaded successfully. AI processing started."
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

async def process_video_for_violations(
    video_id: str,
    video_path: str,
    camera_id: str,
    location: str,
    latitude: float,
    longitude: float
):
    """Process video and detect violations"""
    try:
        # Run AI detection
        violations = await detector.detect_violations(video_path)
        
        # Process each violation
        db = await get_database()
        
        for violation in violations:
            # Extract number plate
            plate_number = await plate_recognizer.extract_plate(violation["image_path"])
            
            # Create violation record
            violation_data = ViolationCreate(
                vehicle_number=plate_number or "UNKNOWN",
                violation_type=violation["type"],
                date=datetime.utcnow().strftime("%Y-%m-%d"),
                time=datetime.utcnow().strftime("%H:%M:%S"),
                location=location,
                latitude=latitude,
                longitude=longitude,
                image_url=violation["image_path"],
                fine_amount=get_fine_amount(violation["type"]),
                confidence_score=violation["confidence"]
            )
            
            violation_dict = violation_data.dict()
            violation_dict["camera_id"] = camera_id
            violation_dict["video_id"] = video_id
            violation_dict["created_at"] = datetime.utcnow()
            
            await db.violations.insert_one(violation_dict)
        
        # Update video status
        await db.videos.update_one(
            {"video_id": video_id},
            {
                "$set": {
                    "status": "completed",
                    "processed_at": datetime.utcnow(),
                    "violations_count": len(violations)
                }
            }
        )
        
    except Exception as e:
        # Update video status to failed
        db = await get_database()
        await db.videos.update_one(
            {"video_id": video_id},
            {
                "$set": {
                    "status": "failed",
                    "error": str(e),
                    "processed_at": datetime.utcnow()
                }
            }
        )

def get_fine_amount(violation_type: str) -> int:
    """Get fine amount based on violation type"""
    fine_amounts = {
        "no_helmet": 500,
        "triple_riding": 1000,
        "signal_violation": 1000,
        "overspeeding": 2000
    }
    return fine_amounts.get(violation_type, 500)

@app.get("/violations")
async def get_violations(
    skip: int = 0,
    limit: int = 100,
    violation_type: str = None,
    status: str = None,
    date_from: str = None,
    date_to: str = None
):
    """Get violations with filters"""
    try:
        db = await get_database()
        
        # Build filter
        filter_dict = {}
        if violation_type:
            filter_dict["violation_type"] = violation_type
        if status:
            filter_dict["status"] = status
        if date_from or date_to:
            filter_dict["date"] = {}
            if date_from:
                filter_dict["date"]["$gte"] = date_from
            if date_to:
                filter_dict["date"]["$lte"] = date_to
        
        # Get violations
        cursor = db.violations.find(filter_dict).sort("created_at", -1).skip(skip).limit(limit)
        violations = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for violation in violations:
            violation["id"] = str(violation["_id"])
            del violation["_id"]
        
        return {"violations": violations, "total": len(violations)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get violations: {str(e)}")

@app.get("/user/challans")
async def get_user_challans(user_id: str = Depends(auth_handler.auth_wrapper)):
    """Get user's challans"""
    try:
        db = await get_database()
        
        # Get user's vehicles
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_vehicles = user.get("vehicles", [])
        
        # Get violations for user's vehicles
        cursor = db.violations.find({
            "vehicle_number": {"$in": user_vehicles}
        }).sort("created_at", -1)
        
        violations = await cursor.to_list(length=100)
        
        # Convert ObjectId to string
        for violation in violations:
            violation["id"] = str(violation["_id"])
            del violation["_id"]
        
        return {"challans": violations}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get challans: {str(e)}")

@app.get("/user/profile")
async def get_user_profile(user_id: str = Depends(auth_handler.auth_wrapper)):
    """Get user profile"""
    try:
        db = await get_database()
        
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user["id"] = str(user["_id"])
        del user["_id"]
        
        return user
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

@app.post("/user/add-vehicle")
async def add_vehicle(
    vehicle_number: str,
    user_id: str = Depends(auth_handler.auth_wrapper)
):
    """Add vehicle to user profile"""
    try:
        db = await get_database()
        
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"vehicles": vehicle_number}}
        )
        
        return {"message": "Vehicle added successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add vehicle: {str(e)}")

@app.get("/admin/dashboard")
async def get_admin_dashboard(user_id: str = Depends(auth_handler.auth_wrapper)):
    """Get admin dashboard statistics"""
    try:
        db = await get_database()
        
        # Get total violations
        total_violations = await db.violations.count_documents({})
        
        # Get violations by type
        helmet_violations = await db.violations.count_documents({"violation_type": "no_helmet"})
        triple_riding = await db.violations.count_documents({"violation_type": "triple_riding"})
        signal_violations = await db.violations.count_documents({"violation_type": "signal_violation"})
        
        # Get paid/unpaid status
        paid_challans = await db.violations.count_documents({"status": "paid"})
        unpaid_challans = await db.violations.count_documents({"status": "unpaid"})
        
        return DashboardStats(
            total_violations=total_violations,
            helmet_violations=helmet_violations,
            triple_riding=triple_riding,
            signal_violations=signal_violations,
            paid_challans=paid_challans,
            unpaid_challans=unpaid_challans
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard: {str(e)}")

@app.get("/admin/analytics")
async def get_analytics():
    """Get analytics data"""
    try:
        db = await get_database()
        
        # Daily violations (last 30 days)
        daily_violations = []
        for i in range(30):
            date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            count = await db.violations.count_documents({"date": date})
            daily_violations.append({"date": date, "count": count})
        
        # Peak hours
        peak_hours = []
        for hour in range(24):
            count = await db.violations.count_documents({
                "time": {"$regex": f"^{hour:02d}:"}
            })
            peak_hours.append({"hour": hour, "count": count})
        
        # Location heatmap
        location_heatmap = await db.violations.aggregate([
            {
                "$group": {
                    "_id": {"latitude": "$latitude", "longitude": "$longitude"},
                    "count": {"$sum": 1}
                }
            },
            {"$limit": 100}
        ]).to_list(100)
        
        # Violation categories
        pipeline = [
            {
                "$group": {
                    "_id": "$violation_type",
                    "count": {"$sum": 1}
                }
            }
        ]
        categories = await db.violations.aggregate(pipeline).to_list(10)
        violation_categories = {cat["_id"]: cat["count"] for cat in categories}
        
        return AnalyticsData(
            daily_violations=daily_violations,
            peak_hours=peak_hours,
            location_heatmap=location_heatmap,
            violation_categories=violation_categories
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

@app.get("/admin/cameras")
async def get_cameras():
    """Get all camera locations"""
    try:
        db = await get_database()
        
        cursor = db.cameras.find({})
        cameras = await cursor.to_list(100)
        
        for camera in cameras:
            camera["id"] = str(camera["_id"])
            del camera["_id"]
        
        return {"cameras": cameras}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cameras: {str(e)}")

@app.post("/admin/cameras")
async def add_camera(
    camera_id: str,
    location: str,
    latitude: float,
    longitude: float
):
    """Add new camera"""
    try:
        db = await get_database()
        
        camera_data = {
            "camera_id": camera_id,
            "location": location,
            "latitude": latitude,
            "longitude": longitude,
            "status": "active",
            "created_at": datetime.utcnow()
        }
        
        await db.cameras.insert_one(camera_data)
        
        return {"message": "Camera added successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add camera: {str(e)}")

@app.put("/violations/{violation_id}/pay")
async def pay_challan(
    violation_id: str,
    user_id: str = Depends(auth_handler.auth_wrapper)
):
    """Mark challan as paid"""
    try:
        db = await get_database()
        
        await db.violations.update_one(
            {"_id": ObjectId(violation_id)},
            {"$set": {"status": "paid", "paid_at": datetime.utcnow()}}
        )
        
        return {"message": "Challan marked as paid"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update challan: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
