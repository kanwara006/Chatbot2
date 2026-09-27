from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from app.core.timezone import now_th
from app.core.database import Base


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    student_id = Column(String(30), nullable=True)
    email = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=now_th, nullable=False)

    admin_reply = Column(Text, nullable=True)
    replied_at = Column(DateTime, nullable=True)
    replied_by = Column(String(200), nullable=True)
