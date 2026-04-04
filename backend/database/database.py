from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings

# Global database client
client = None
database = None

async def get_database():
    """Get database instance"""
    global database
    if database is None:
        client = AsyncIOMotorClient(settings.MONGODB_URL)
        database = client[settings.DATABASE_NAME]
    return database

async def init_db():
    """Initialize database with indexes"""
    db = await get_database()
    
    # Create indexes for better performance
    await db.users.create_index("email", unique=True)
    await db.violations.create_index("date")
    await db.violations.create_index("vehicle_number")
    await db.violations.create_index("violation_type")
    await db.violations.create_index("status")
    await db.violations.create_index("location")
    await db.cameras.create_index("camera_id", unique=True)
    await db.videos.create_index("video_id", unique=True)
    
    print("Database initialized with indexes")

async def close_db():
    """Close database connection"""
    global client
    if client:
        client.close()
        client = None
        database = None
