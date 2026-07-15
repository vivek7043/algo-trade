from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    def connect(cls):
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        db_name = os.getenv("MONGODB_DB_NAME", "fastapi_db")
        
        cls.client = AsyncIOMotorClient(mongodb_url)
        cls.db = cls.client[db_name]
        print("✅ MongoDB Connected")

    @classmethod
    def close(cls):
        cls.client.close()
        print("❌ MongoDB Disconnected")


