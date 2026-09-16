from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.timezone import now_th
from app.core.database import Base


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    academic_year = Column(String(10), default="2569", nullable=False)
    attachment_url = Column(String(500), nullable=True)
    is_published = Column(Boolean, default=True, nullable=False)
    # วันที่ของกิจกรรม/ประกาศจริง (แสดงผลให้ผู้ใช้เห็น) — คนละเรื่องกับ published_at ที่เป็นเวลาที่กดเผยแพร่
    event_date = Column(DateTime, nullable=True)
    published_at = Column(DateTime, default=now_th, nullable=False)
    created_at = Column(DateTime, default=now_th, nullable=False)
    updated_at = Column(DateTime, default=now_th, onupdate=now_th, nullable=False)

    # Relationships
    category = relationship("Category", back_populates="announcements")
    chunks = relationship("DocumentChunk", back_populates="announcement", cascade="all, delete-orphan")
