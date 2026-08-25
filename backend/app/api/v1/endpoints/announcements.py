from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
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


@router.get("/", response_model=List[AnnouncementResponse])
def get_announcements(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
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

    if category and category != "ทั้งหมด":
        query = query.filter(Announcement.category == category)
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
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    announcement = Announcement(**announcement_in.model_dump())
    db.add(announcement)
    db.commit()
    db.refresh(announcement)
    return announcement


@router.put("/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(
    announcement_id: int,
    announcement_in: AnnouncementUpdate,
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
