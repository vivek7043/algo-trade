from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone, timedelta
from typing import Optional

IST = timezone(timedelta(hours=5, minutes=30))

class UserModel(BaseModel):
    name: str
    contact: str
    email: EmailStr
    password: str
    isdemo: bool = True
    isusbcribe: bool = True
    status: bool = True   # 🔥 main control
    role: str = "user" 
    created_at: datetime = Field(default_factory=lambda: datetime.now(IST))
    last_login: datetime = Field(default_factory=lambda: datetime.now(IST))
    

class LoginModel(BaseModel):
    email:EmailStr
    password: str

class ForgotPasswordModel(BaseModel):
 email: EmailStr


class ResetPasswordModel(BaseModel):
    email: EmailStr
    otp: str
    new_password: str

class Configuration(BaseModel):
    consumerkey: str
    mobile: str
    ucc: str
    mpin: str
    totp: str
    telegramapikey: Optional[str] = None
    user_id: str


class AdminRegisterModel(BaseModel):
    contact: str
    email: EmailStr 
    password: str
    
class AdminLoginModel(BaseModel):
    contact: str
    password: str