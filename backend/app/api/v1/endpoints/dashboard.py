from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.models.user import User
from app.models.chat import Conversation, Message, MessageFeedback
from app.models.document import Document
from app.models.announcement import Announcement
from app.models.faq import FAQ

router = APIRouter()


@router.get("/stats", response_model=Dict[str, Any])
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    user_count = db.query(User).filter(User.role == "student").count()
    conversation_count = db.query(Conversation).count()
    message_count = db.query(Message).count()
    document_count = db.query(Document).filter(Document.status == "ready").count()
    total_document_count = db.query(Document).count()
    announcement_count = db.query(Announcement).filter(Announcement.is_published == True).count()
    faq_count = db.query(FAQ).filter(FAQ.is_active == True).count()

    total_feedbacks = db.query(MessageFeedback).count()
    like_feedbacks = db.query(MessageFeedback).filter(MessageFeedback.rating == "like").count()
    positive_rate = round((like_feedbacks / total_feedbacks * 100), 1) if total_feedbacks > 0 else 90.0

    return {
        "users": user_count,
        "conversations": conversation_count,
        "messages": message_count,
        "documents": document_count,
        "total_documents": total_document_count,
        "announcements": announcement_count,
        "faqs": faq_count,
        "positive_rate": positive_rate,
    }
