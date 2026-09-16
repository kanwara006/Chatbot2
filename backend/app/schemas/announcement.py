from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnnouncementBase(BaseModel):
    title: str
    content: str
    category_id: Optional[int] = None
    academic_year: str = "2569"
    attachment_url: Optional[str] = None
    is_published: bool = True
    event_date: Optional[datetime] = None


class AnnouncementCreate(AnnouncementBase):
    pass


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None
    academic_year: Optional[str] = None
    attachment_url: Optional[str] = None
    is_published: Optional[bool] = None
    event_date: Optional[datetime] = None


class AnnouncementResponse(AnnouncementBase):
    id: int
    published_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
