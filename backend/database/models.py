from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class UserBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    picture: Optional[str] = None
    vehicles: List[str] = []

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class ViolationBase(BaseModel):
    vehicle_number: str
    violation_type: str  # no_helmet, triple_riding, signal_violation
    date: str
    time: str
    location: str
    latitude: float
    longitude: float
    image_url: str
    fine_amount: int
    status: str = "unpaid"  # paid, unpaid
    confidence_score: float

class ViolationCreate(ViolationBase):
    pass

class Violation(ViolationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    camera_id: Optional[str] = None
    video_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    paid_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class CameraBase(BaseModel):
    camera_id: str
    location: str
    latitude: float
    longitude: float

class CameraCreate(CameraBase):
    status: str = "active"

class Camera(CameraBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class VideoMetadata(BaseModel):
    video_id: str
    filename: str
    camera_id: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    status: str = "processing"  # processing, completed, failed
    violations_count: Optional[int] = 0
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    processed_at: Optional[datetime] = None
    error: Optional[str] = None

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
