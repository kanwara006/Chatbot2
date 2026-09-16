from pydantic import BaseModel, EmailStr
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    first_name: str
    last_name: str
    email: str
    student_id: Optional[str] = None


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class AdminRegisterRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    staff_code: str
