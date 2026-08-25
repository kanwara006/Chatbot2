from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    first_name: str
    last_name: str
    student_id: Optional[str] = None
    email: EmailStr
    faculty: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = "student"
    is_active: Optional[bool] = True


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    student_id: Optional[str] = None
    email: EmailStr
    faculty: Optional[str] = None
    department: Optional[str] = None
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    faculty: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
