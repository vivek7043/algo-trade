from motor.motor_asyncio import AsyncIOMotorClient

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    def connect(cls):
        cls.client = AsyncIOMotorClient(
            "mongodb://localhost:27017"
        )
        cls.db = cls.client["fastapi_db"]
        print("✅ MongoDB Connected")

    @classmethod
    def close(cls):
        cls.client.close()
        print("❌ MongoDB Disconnected")


