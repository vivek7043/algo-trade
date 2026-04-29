from fastapi import APIRouter
from database.mongodb import MongoDB
from models.user_model import Configuration

router = APIRouter(prefix="/config", tags=["Configuration"])

@router.post("/save")
async def save_config(config: Configuration):
    await MongoDB.db.config.insert_one(config.dict())
    return {"message": "Configuration saved successfully"}

