from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime, timezone
from app.core.database import Base


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), default="การกู้ยืม", nullable=False)
    academic_year = Column(String(10), default="2569", nullable=False)
    attachment_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    published_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
