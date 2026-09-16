from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.security import get_current_admin_user, get_current_user_optional
from app.models.category import Category
from app.models.faq import FAQ
from app.models.document import Document
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse, CategoryWithCounts

router = APIRouter()


@router.get("/", response_model=List[CategoryWithCounts])
def get_categories(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Category)
    if not current_user or current_user.role != "admin":
        query = query.filter(Category.is_active == True)
    categories = query.order_by(Category.display_order.asc(), Category.id.asc()).all()

    results = []
    for cat in categories:
        faq_count = db.query(func.count(FAQ.id)).filter(FAQ.category_id == cat.id).scalar() or 0
        document_count = db.query(func.count(Document.id)).filter(Document.category_id == cat.id).scalar() or 0
        item = CategoryWithCounts.model_validate(cat)
        item.faq_count = faq_count
        item.document_count = document_count
        results.append(item)
    return results


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    category = Category(**category_in.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(Category).filter(Category.id == category_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    for field, value in category_in.model_dump(exclude_unset=True).items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(Category).filter(Category.id == category_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    db.delete(item)
    db.commit()
    return None
