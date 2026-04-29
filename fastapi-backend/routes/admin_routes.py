from fastapi import APIRouter, HTTPException
from database.mongodb import MongoDB
from models.user_model import AdminRegisterModel
from models.user_model import AdminLoginModel
from routes.auth_routes import hash_password
from routes.auth_routes import verify_password
router = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/register")
async def register(admin: AdminRegisterModel):

    # check duplicate email
    exists = await MongoDB.db.admin.find_one({"email": admin.email})
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    admin_dict = admin.dict()

    # 🔐 hash password
    admin_dict["password"] = hash_password(admin.password)

    await MongoDB.db.admin.insert_one(admin_dict)

    return {"message": "Admin registered successfully"}


@router.post("/login")
async def admin_login(data: AdminLoginModel):

    admin = await MongoDB.db.admin.find_one({"contact": data.contact})

    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    # 🔐 password check
    if not verify_password(data.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid password")

    return {
        "message": "Login successful",
        "admin_id": str(admin["_id"])
    }