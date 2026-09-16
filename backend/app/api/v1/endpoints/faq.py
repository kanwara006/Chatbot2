from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin_user, get_current_user_optional
from app.models.faq import FAQ
from app.models.user import User
from app.schemas.faq import FAQCreate, FAQUpdate, FAQResponse

router = APIRouter()


@router.get("/", response_model=List[FAQResponse])
def get_faqs(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(FAQ)

    # Public/students only see active FAQs
    if not current_user or current_user.role != "admin":
        query = query.filter(FAQ.is_active == True)
    elif is_active is not None:
        query = query.filter(FAQ.is_active == is_active)

    if category_id is not None:
        query = query.filter(FAQ.category_id == category_id)
    if search:
        s = f"%{search}%"
        query = query.filter((FAQ.question.ilike(s)) | (FAQ.answer.ilike(s)))

    return query.order_by(FAQ.order_num.asc(), FAQ.id.asc()).offset(skip).limit(limit).all()


@router.get("/{faq_id}", response_model=FAQResponse)
def get_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    item = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
    if not item.is_active and (not current_user or current_user.role != "admin"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")
    return item


@router.post("/", response_model=FAQResponse, status_code=status.HTTP_201_CREATED)
def create_faq(
    faq_in: FAQCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    faq = FAQ(**faq_in.model_dump())
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq


@router.put("/{faq_id}", response_model=FAQResponse)
def update_faq(
    faq_id: int,
    faq_in: FAQUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")

    for field, value in faq_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(
    faq_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(FAQ).filter(FAQ.id == faq_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="FAQ not found")

    db.delete(item)
    db.commit()
    return None
