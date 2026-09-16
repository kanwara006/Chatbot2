import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_admin_user, get_current_user_optional
from app.models.announcement import Announcement
from app.models.user import User
from app.schemas.announcement import (
    AnnouncementCreate,
    AnnouncementUpdate,
    AnnouncementResponse
)

router = APIRouter()


def index_announcement_task(announcement_id: int):
    """Background worker: ทำ embedding เนื้อหาประกาศ (เฉพาะที่เผยแพร่แล้ว) ลง document_chunks"""
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        item = db.query(Announcement).filter(Announcement.id == announcement_id).first()
        if not item:
            return
        from app.services.rag import get_rag_service
        get_rag_service().index_announcement(db, item)
    finally:
        db.close()

ALLOWED_IMAGE_TYPES = {"image/png", "image/jpeg", "image/gif"}


@router.post("/upload-image")
async def upload_announcement_image(
    file: UploadFile = File(...),
    admin: User = Depends(get_current_admin_user)
):
    ext = file.filename.split(".")[-1].lower() if file.filename and "." in file.filename else ""
    if ext not in {"png", "jpg", "jpeg", "gif"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="รองรับเฉพาะไฟล์ PNG, JPG, GIF"
        )

    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ไฟล์ใหญ่เกิน 10MB")

    filename = f"announcement_{uuid.uuid4().hex}.{ext}"
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    with open(file_path, "wb") as f:
        f.write(content)

    return {"url": f"/uploads/{filename}"}


@router.get("/", response_model=List[AnnouncementResponse])
def get_announcements(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    year: Optional[str] = None,
    search: Optional[str] = None,
    is_published: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Announcement)

    # If not admin, only show published announcements
    if not current_user or current_user.role != "admin":
        query = query.filter(Announcement.is_published == True)
    elif is_published is not None:
        query = query.filter(Announcement.is_published == is_published)

    if category_id is not None:
        query = query.filter(Announcement.category_id == category_id)
    if year and year != "ทั้งหมด":
        query = query.filter(Announcement.academic_year == year)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (Announcement.title.ilike(s)) |
            (Announcement.content.ilike(s))
        )

    return query.order_by(Announcement.published_at.desc()).offset(skip).limit(limit).all()


@router.get("/{announcement_id}", response_model=AnnouncementResponse)
def get_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    item = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found")
    if not item.is_published and (not current_user or current_user.role != "admin"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found")
    return item


@router.post("/", response_model=AnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    announcement_in: AnnouncementCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    announcement = Announcement(**announcement_in.model_dump())
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    background_tasks.add_task(index_announcement_task, announcement.id)
    return announcement


@router.put("/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(
    announcement_id: int,
    announcement_in: AnnouncementUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found")

    for field, value in announcement_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    background_tasks.add_task(index_announcement_task, item.id)
    return item


@router.delete("/{announcement_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(
    announcement_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(Announcement).filter(Announcement.id == announcement_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found")

    db.delete(item)
    db.commit()
    return None
