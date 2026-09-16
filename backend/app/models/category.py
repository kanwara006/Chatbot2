from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.timezone import now_th
from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), default="graduation-cap", nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=now_th, nullable=False)
    updated_at = Column(DateTime, default=now_th, onupdate=now_th, nullable=False)

    # Relationships
    faqs = relationship("FAQ", back_populates="category")
    documents = relationship("Document", back_populates="category")
    announcements = relationship("Announcement", back_populates="category")
