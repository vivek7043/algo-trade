from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
from database.mongodb import MongoDB
from models.user_model import UserModel, LoginModel,ForgotPasswordModel,ResetPasswordModel,AdminRegisterModel
from auth.jwt_handler import create_access_token, verify_token
from fastapi.security import OAuth2PasswordBearer
import random, os, smtplib, datetime
from email.message import EmailMessage

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ---------- PASSWORD UTILS ----------
def hash_password(password: str):
    return pwd_context.hash(password.encode("utf-8")[:72])

def verify_password(password: str, hashed: str):
    return pwd_context.verify(password.encode("utf-8")[:72], hashed)

# ---------- EMAIL OTP UTILS ----------
def generate_otp():
    return str(random.randint(100000, 999999))

def send_email_otp(to_email: str, otp: str):
    msg = EmailMessage()
    msg["Subject"] = "Password Reset OTP"
    msg["From"] = os.getenv("EMAIL_USER")
    msg["To"] = to_email
    msg.set_content(f"""
Your OTP for password reset is: {otp}

This OTP is valid for 5 minutes.
Do not share this OTP with anyone.
""")

    server = smtplib.SMTP(os.getenv("EMAIL_HOST"), int(os.getenv("EMAIL_PORT")))
    server.starttls()
    server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASS"))
    server.send_message(msg)
    server.quit()

# ---------- REGISTER ----------
@router.post("/register")
async def register(user: UserModel):
    exists = await MongoDB.db.users.find_one({"email": user.email})
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)

    await MongoDB.db.users.insert_one(user_dict)
    return {"message": "User registered successfully"}

# ---------- LOGIN ----------

@router.post("/login")
async def login(user: LoginModel):

    db_user = await MongoDB.db.users.find_one({"email": user.email})

    if not db_user.get("status", True):
     raise HTTPException(status_code=403, detail="Account disabled by admin")

    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 🔴 ADD THIS LINE
    if not db_user.get("status", True):
        raise HTTPException(status_code=403, detail="Account disabled by admin")

    config = await MongoDB.db.config.find_one({
        "user_id": str(db_user["_id"])
    })

    has_configuration = True if config else False

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "role": db_user.get("role", "user")   # 🔥 add role in token
    })

    return {
        "access_token": token,
        "hasConfiguration": has_configuration
    }



# ---------- FORGOT PASSWORD : SEND OTP ----------
@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordModel):
    email = data.email

    user = await MongoDB.db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not registered")

    otp = generate_otp()
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)

    await MongoDB.db.otp.delete_many({"email": email})
    await MongoDB.db.otp.insert_one({
        "email": email,
        "otp": otp,
        "expires_at": expiry
    })

    send_email_otp(email, otp)
    return {"message": "OTP sent to your email"}

# ---------- VERIFY OTP & RESET PASSWORD ----------
@router.post("/reset-password")
async def reset_password(data: ResetPasswordModel):
    email = data.email
    otp = data.otp
    new_password = data.new_password

    record = await MongoDB.db.otp.find_one({
        "email": email,
        "otp": otp
    })

    if not record:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if record["expires_at"] < datetime.datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP expired")

    # 🔑 HASH NEW PASSWORD
    hashed = hash_password(new_password)

    # ✅ UPDATE PASSWORD (CRITICAL LINE)
    result = await MongoDB.db.users.update_one(
        {"email": email},
        {"$set": {"password": hashed}}
    )

    # DEBUG (optional)
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Password not updated")

    # OTP cleanup
    await MongoDB.db.otp.delete_many({"email": email})

    return {"message": "Password reset successfully"}

# ---------- PROTECTED ROUTE ----------
@router.get("/me")
async def get_me(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"user_id": payload["user_id"]}

