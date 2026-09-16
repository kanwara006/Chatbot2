from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ContactMessageCreate(BaseModel):
    full_name: str
    student_id: Optional[str] = None
    email: EmailStr
    subject: Optional[str] = None
    message: str


class ContactMessageResponse(BaseModel):
    id: int
    full_name: str
    student_id: Optional[str] = None
    email: str
    subject: Optional[str] = None
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
