from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)
from app.models.user import User
from app.schemas.auth import Token, LoginRequest
from app.schemas.user import UserCreate, UserResponse

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if email exists
    if db.query(User).filter(User.email == user_in.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )
    # Check if student_id exists if provided
    if user_in.student_id:
        if db.query(User).filter(User.student_id == user_in.student_id).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Student ID is already registered."
            )

    user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        student_id=user_in.student_id,
        email=user_in.email,
        faculty=user_in.faculty,
        department=user_in.department,
        password_hash=get_password_hash(user_in.password),
        role="student",
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == login_data.username_or_email) |
        (User.student_id == login_data.username_or_email)
    ).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is inactive/suspended"
        )

    access_token = create_access_token(subject=user.id)
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        role=user.role,
        first_name=user.first_name,
        last_name=user.last_name
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
