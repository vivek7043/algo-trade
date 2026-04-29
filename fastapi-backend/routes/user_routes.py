from fastapi import APIRouter, HTTPException
from database.mongodb import MongoDB
from models.user_model import UserModel
from bson import ObjectId


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

# CREATE
@router.post("/signup")
async def create_user(userData: UserModel):
    user = userData.dict()
    result = await MongoDB.db.users.insert_one(user)
    return {
        "message": "User created",
        "id": str(result.inserted_id)
    }

# READ
@router.get("/")
async def get_users():
    users = []
    cursor = MongoDB.db.users.find()

    async for user in cursor:
        user["_id"] = str(user["_id"])
        users.append(user)

    return users

# READ BY ID
# @router.get("/{user_id}")
# async def get_user(user_id: str):
#     try:
#         user = await MongoDB.db.users.find_one(
#             {"_id": ObjectId(user_id)}
#         )

#         if not user:
#             raise HTTPException(status_code=404, detail="User not found")

#         user["_id"] = str(user["_id"])
#         return user

#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid user id")


@router.get("/{user_id}")
async def get_user(user_id: str):

    user = await MongoDB.db.users.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        return {"error": "User not found"}

    user["_id"] = str(user["_id"])

    return user


@router.get("/signup")
async def get_users():
    users = []

    async for user in MongoDB.db.users.find():
        user["_id"] = str(user["_id"])
        user.pop("password", None)   # 🔐 remove password
        users.append(user)

    return users


@router.put("/toggle-user/{user_id}")
async def toggle_user(user_id: str):
    user = await MongoDB.db.users.find_one({"_id": ObjectId(user_id)})

    new_status = not user.get("status", True)

    await MongoDB.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"status": new_status}}
    )

    return {"message": "Updated"}