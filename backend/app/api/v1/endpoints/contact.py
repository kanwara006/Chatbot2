from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.models.contact import ContactMessage
from app.models.user import User
from app.schemas.contact import ContactMessageCreate, ContactMessageResponse

router = APIRouter()


@router.post("/", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_message(payload: ContactMessageCreate, db: Session = Depends(get_db)):
    contact_msg = ContactMessage(**payload.model_dump())
    db.add(contact_msg)
    db.commit()
    db.refresh(contact_msg)
    return contact_msg


@router.get("/", response_model=List[ContactMessageResponse])
def get_contact_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    return db.query(ContactMessage).order_by(
        ContactMessage.created_at.desc()
    ).offset(skip).limit(limit).all()


@router.put("/{message_id}/read", response_model=ContactMessageResponse)
def mark_contact_message_read(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found")
    item.is_read = True
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_message(
    message_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(ContactMessage).filter(ContactMessage.id == message_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact message not found")
    db.delete(item)
    db.commit()
    return None
