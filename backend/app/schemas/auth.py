from pydantic import BaseModel, EmailStr
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    role: str
    first_name: str
    last_name: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None


class LoginRequest(BaseModel):
    username_or_email: str
    password: str
