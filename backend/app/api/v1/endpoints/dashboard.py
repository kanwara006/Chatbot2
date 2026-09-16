from typing import Dict, Any, List
from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.core.timezone import now_th
from app.models.user import User
from app.models.chat import Conversation, Message, MessageSource, MessageFeedback
from app.models.document import Document
from app.models.announcement import Announcement
from app.models.faq import FAQ
from app.models.category import Category

router = APIRouter()

THAI_WEEKDAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"]


def _satisfaction_rate(db: Session) -> float:
    total = db.query(MessageFeedback).count()
    if total == 0:
        return 0.0
    likes = db.query(MessageFeedback).filter(MessageFeedback.rating == "like").count()
    return round(likes / total * 100, 1)


@router.get("/stats", response_model=Dict[str, Any])
def get_dashboard_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    user_count = db.query(User).filter(User.role == "student").count()
    conversation_count = db.query(Conversation).count()
    message_count = db.query(Message).filter(Message.role == "user").count()
    answered_count = db.query(Message).filter(Message.role == "assistant").count()
    document_count = db.query(Document).filter(Document.status == "ready").count()
    total_document_count = db.query(Document).count()
    announcement_count = db.query(Announcement).filter(Announcement.is_published == True).count()
    faq_count = db.query(FAQ).filter(FAQ.is_active == True).count()

    return {
        "users": user_count,
        "conversations": conversation_count,
        "messages": message_count,
        "answered": answered_count,
        "documents": document_count,
        "total_documents": total_document_count,
        "announcements": announcement_count,
        "faqs": faq_count,
        "positive_rate": _satisfaction_rate(db),
    }


@router.get("/usage-trend", response_model=List[Dict[str, Any]])
def get_usage_trend(
    days: int = 7,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """จำนวนคำถาม (user) และคำตอบสำเร็จ (assistant) แยกตามวัน ย้อนหลัง N วัน"""
    start_date = (now_th() - timedelta(days=days - 1)).date()

    rows = (
        db.query(
            func.date(Message.created_at).label("day"),
            Message.role,
            func.count(Message.id).label("count"),
        )
        .filter(func.date(Message.created_at) >= start_date)
        .group_by(func.date(Message.created_at), Message.role)
        .all()
    )

    by_day: Dict[str, Dict[str, int]] = {}
    for i in range(days):
        d = (start_date + timedelta(days=i)).isoformat()
        by_day[d] = {"total": 0, "success": 0}

    for row in rows:
        day_str = row.day.isoformat() if hasattr(row.day, "isoformat") else str(row.day)
        if day_str not in by_day:
            continue
        if row.role == "user":
            by_day[day_str]["total"] = row.count
        elif row.role == "assistant":
            by_day[day_str]["success"] = row.count

    return [{"date": d, **v} for d, v in sorted(by_day.items())]


@router.get("/category-breakdown", response_model=List[Dict[str, Any]])
def get_category_breakdown(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    """สัดส่วนคำถามที่อ้างอิงเอกสารในแต่ละหมวดหมู่ (นับจาก MessageSource -> Document -> Category)"""
    rows = (
        db.query(Category.id, Category.name, func.count(MessageSource.id).label("count"))
        .join(Document, Document.category_id == Category.id)
        .join(MessageSource, MessageSource.document_id == Document.id)
        .group_by(Category.id, Category.name)
        .order_by(func.count(MessageSource.id).desc())
        .all()
    )
    total = sum(r.count for r in rows) or 1
    return [
        {
            "category_id": r.id,
            "category_name": r.name,
            "count": r.count,
            "percentage": round(r.count / total * 100, 1),
        }
        for r in rows
    ]


@router.get("/recent-questions", response_model=List[Dict[str, Any]])
def get_recent_questions(
    limit: int = 5,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    messages = (
        db.query(Message)
        .filter(Message.role == "user")
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {"id": m.id, "content": m.content, "created_at": m.created_at.isoformat()}
        for m in messages
    ]


@router.get("/recent-documents", response_model=List[Dict[str, Any]])
def get_recent_documents(
    limit: int = 5,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    docs = db.query(Document).order_by(Document.updated_at.desc()).limit(limit).all()
    return [
        {
            "id": d.id,
            "original_name": d.original_name,
            "status": d.status,
            "updated_at": d.updated_at.isoformat(),
        }
        for d in docs
    ]


@router.get("/reports", response_model=Dict[str, Any])
def get_reports(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    total_questions = db.query(Message).filter(Message.role == "user").count()
    answered = db.query(Message).filter(Message.role == "assistant").count()
    success_rate = round(answered / total_questions * 100, 1) if total_questions else 0.0

    start_date = (now_th() - timedelta(days=6)).date()
    rows = (
        db.query(func.date(Message.created_at).label("day"), func.count(Message.id).label("count"))
        .filter(Message.role == "user", func.date(Message.created_at) >= start_date)
        .group_by(func.date(Message.created_at))
        .all()
    )
    counts_by_day = {(r.day.isoformat() if hasattr(r.day, "isoformat") else str(r.day)): r.count for r in rows}
    usage_trend = []
    for i in range(7):
        d = start_date + timedelta(days=i)
        usage_trend.append({
            "weekday": THAI_WEEKDAYS[d.weekday()],
            "date": d.isoformat(),
            "count": counts_by_day.get(d.isoformat(), 0),
        })

    top_categories_rows = (
        db.query(Category.id, Category.name, func.count(MessageSource.id).label("count"))
        .join(Document, Document.category_id == Category.id)
        .join(MessageSource, MessageSource.document_id == Document.id)
        .group_by(Category.id, Category.name)
        .order_by(func.count(MessageSource.id).desc())
        .limit(5)
        .all()
    )
    top_categories = [
        {"category_id": r.id, "name": r.name, "count": r.count, "satisfaction": _satisfaction_rate(db)}
        for r in top_categories_rows
    ]

    return {
        "total_questions": total_questions,
        "success_rate": success_rate,
        "avg_satisfaction": _satisfaction_rate(db),
        "usage_trend": usage_trend,
        "top_categories": top_categories,
    }


@router.get("/evaluations", response_model=Dict[str, Any])
def get_evaluations(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    total_evaluations = db.query(MessageFeedback).count()
    avg_satisfaction = _satisfaction_rate(db)
    suggestion_count = db.query(MessageFeedback).filter(
        MessageFeedback.comment.isnot(None), MessageFeedback.comment != ""
    ).count()

    start_date = (now_th() - timedelta(days=6)).date()
    rows = (
        db.query(
            func.date(MessageFeedback.created_at).label("day"),
            MessageFeedback.rating,
            func.count(MessageFeedback.id).label("count"),
        )
        .filter(func.date(MessageFeedback.created_at) >= start_date)
        .group_by(func.date(MessageFeedback.created_at), MessageFeedback.rating)
        .all()
    )
    by_day: Dict[str, Dict[str, int]] = {}
    for i in range(7):
        d = start_date + timedelta(days=i)
        by_day[d.isoformat()] = {"like": 0, "dislike": 0}
    for r in rows:
        day_str = r.day.isoformat() if hasattr(r.day, "isoformat") else str(r.day)
        if day_str in by_day:
            by_day[day_str][r.rating] = r.count

    daily_trend = []
    for d, counts in sorted(by_day.items()):
        total = counts["like"] + counts["dislike"]
        rate = round(counts["like"] / total * 100, 1) if total else 0.0
        weekday = THAI_WEEKDAYS[date.fromisoformat(d).weekday()]
        daily_trend.append({"date": d, "weekday": weekday, "satisfaction_rate": rate})

    recent = (
        db.query(MessageFeedback)
        .join(Message, Message.id == MessageFeedback.message_id)
        .order_by(MessageFeedback.created_at.desc())
        .limit(10)
        .all()
    )
    recent_evaluations = []
    for fb in recent:
        question_msg = (
            db.query(Message)
            .filter(Message.conversation_id == fb.message.conversation_id, Message.role == "user", Message.id < fb.message_id)
            .order_by(Message.id.desc())
            .first()
        )
        recent_evaluations.append({
            "id": fb.id,
            "question": question_msg.content if question_msg else "-",
            "rating": fb.rating,
            "comment": fb.comment,
            "created_at": fb.created_at.isoformat(),
        })

    return {
        "total_evaluations": total_evaluations,
        "avg_satisfaction": avg_satisfaction,
        "suggestion_count": suggestion_count,
        "daily_trend": daily_trend,
        "recent_evaluations": recent_evaluations,
    }
