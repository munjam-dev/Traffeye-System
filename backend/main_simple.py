from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import uuid

app = FastAPI(
    title="TraffEye API",
    description="AI-Powered Smart Traffic Violation Detection System",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data for demonstration
mock_violations = [
    {
        "id": "1",
        "vehicle_number": "MH12AB1234",
        "violation_type": "no_helmet",
        "date": "2024-04-04",
        "time": "14:30:25",
        "location": "Main Street & 5th Avenue",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "image_url": "/violations/sample1.jpg",
        "fine_amount": 500,
        "status": "unpaid",
        "confidence_score": 0.95
    },
    {
        "id": "2", 
        "vehicle_number": "MH15CD5678",
        "violation_type": "triple_riding",
        "date": "2024-04-04",
        "time": "14:31:15",
        "location": "Highway 20, Exit 15",
        "latitude": 19.0850,
        "longitude": 72.8850,
        "image_url": "/violations/sample2.jpg",
        "fine_amount": 1000,
        "status": "unpaid",
        "confidence_score": 0.88
    }
]

mock_cameras = [
    {
        "id": "1",
        "camera_id": "CAM001",
        "location": "Main Street & 5th Avenue",
        "latitude": 19.0760,
        "longitude": 72.8777,
        "status": "active"
    },
    {
        "id": "2",
        "camera_id": "CAM002", 
        "location": "Highway 20, Exit 15",
        "latitude": 19.0850,
        "longitude": 72.8850,
        "status": "active"
    }
]

# Pydantic Models
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
    daily_violations: List[dict]
    peak_hours: List[dict]
    location_heatmap: List[dict]
    violation_categories: dict

# API Routes
@app.get("/")
async def root():
    return {"message": "TraffEye API is running", "version": "1.0.0"}

@app.get("/violations")
async def get_violations():
    """Get all violations"""
    return {"violations": mock_violations, "total": len(mock_violations)}

@app.get("/violations/{violation_id}")
async def get_violation(violation_id: str):
    """Get specific violation"""
    violation = next((v for v in mock_violations if v["id"] == violation_id), None)
    if not violation:
        raise HTTPException(status_code=404, detail="Violation not found")
    return violation

@app.post("/upload-video")
async def upload_video():
    """Mock video upload endpoint"""
    return {
        "video_id": str(uuid.uuid4()),
        "status": "processing",
        "message": "Video uploaded successfully. AI processing started."
    }

@app.get("/admin/dashboard")
async def get_admin_dashboard():
    """Get admin dashboard statistics"""
    return DashboardStats(
        total_violations=len(mock_violations),
        helmet_violations=1,
        triple_riding=1,
        signal_violations=0,
        paid_challans=0,
        unpaid_challans=2
    )

@app.get("/admin/analytics")
async def get_analytics():
    """Get analytics data"""
    return AnalyticsData(
        daily_violations=[
            {"date": "2024-04-01", "count": 5},
            {"date": "2024-04-02", "count": 8},
            {"date": "2024-04-03", "count": 6},
            {"date": "2024-04-04", "count": 12}
        ],
        peak_hours=[
            {"hour": 8, "count": 15},
            {"hour": 12, "count": 25},
            {"hour": 18, "count": 20}
        ],
        location_heatmap=[
            {"latitude": 19.0760, "longitude": 72.8777, "count": 5},
            {"latitude": 19.0850, "longitude": 72.8850, "count": 3}
        ],
        violation_categories={
            "no_helmet": 1,
            "triple_riding": 1,
            "signal_violation": 0
        }
    )

@app.get("/admin/cameras")
async def get_cameras():
    """Get all camera locations"""
    return {"cameras": mock_cameras}

@app.post("/admin/cameras")
async def add_camera(camera_data: dict):
    """Add new camera"""
    new_camera = {
        "id": str(len(mock_cameras) + 1),
        "camera_id": camera_data.get("camera_id"),
        "location": camera_data.get("location"),
        "latitude": camera_data.get("latitude"),
        "longitude": camera_data.get("longitude"),
        "status": "active"
    }
    mock_cameras.append(new_camera)
    return {"message": "Camera added successfully", "camera": new_camera}

# Mock authentication endpoints
@app.post("/auth/google-login")
async def google_login():
    """Mock Google OAuth login"""
    return {
        "access_token": "mock_token_12345",
        "user": {
            "id": "user_123",
            "name": "Demo User",
            "email": "demo@traffeye.com",
            "vehicles": ["MH12AB1234", "MH15CD5678"]
        }
    }

@app.get("/user/challans")
async def get_user_challans():
    """Get user's challans"""
    return {"challans": mock_violations}

@app.get("/user/profile")
async def get_user_profile():
    """Get user profile"""
    return {
        "id": "user_123",
        "name": "Demo User",
        "email": "demo@traffeye.com",
        "vehicles": ["MH12AB1234", "MH15CD5678"]
    }

@app.post("/user/add-vehicle")
async def add_vehicle(vehicle_number: str):
    """Add vehicle to user profile"""
    return {"message": f"Vehicle {vehicle_number} added successfully"}

@app.put("/violations/{violation_id}/pay")
async def pay_challan(violation_id: str):
    """Mark challan as paid"""
    for violation in mock_violations:
        if violation["id"] == violation_id:
            violation["status"] = "paid"
            return {"message": "Challan marked as paid"}
    raise HTTPException(status_code=404, detail="Violation not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
