import secrets
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.timezone import now_th
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user
)
from app.models.user import User
from app.schemas.auth import (
    Token, LoginRequest, AdminRegisterRequest,
    ForgotPasswordRequest, ResetPasswordRequest, MessageResponse,
)
from app.schemas.user import UserCreate, UserResponse
from app.services.email import send_email

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


@router.post("/register-admin", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_admin(payload: AdminRegisterRequest, db: Session = Depends(get_db)):
    if payload.staff_code != settings.ADMIN_REGISTER_CODE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="รหัสเจ้าหน้าที่ไม่ถูกต้อง"
        )
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered."
        )

    user = User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        password_hash=get_password_hash(payload.password),
        role="admin",
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
        last_name=user.last_name,
        email=user.email,
        student_id=user.student_id
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    generic_message = "หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งรหัส OTP สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว กรุณาตรวจสอบกล่องข้อความ (รวมถึง Junk/Spam)"

    user = db.query(User).filter(User.email == payload.email).first()
    if user:
        otp = f"{secrets.randbelow(1_000_000):06d}"
        user.reset_token = otp
        user.reset_token_expires = now_th() + timedelta(minutes=settings.RESET_PASSWORD_OTP_EXPIRE_MINUTES)
        user.reset_attempts = 0
        db.commit()

        subject = "รหัส OTP ตั้งรหัสผ่านใหม่ — PSU SLF AI"
        body = (
            f"เรียน คุณ{user.first_name} {user.last_name}\n\n"
            "มีคำขอตั้งรหัสผ่านใหม่สำหรับบัญชีของท่านในระบบ PSU SLF AI\n"
            f"รหัส OTP ของท่านคือ: {otp}\n"
            f"(รหัสนี้ใช้ได้ภายใน {settings.RESET_PASSWORD_OTP_EXPIRE_MINUTES} นาที และใช้ได้ครั้งเดียว)\n\n"
            "หากท่านไม่ได้เป็นผู้ขอตั้งรหัสผ่านใหม่ กรุณาเพิกเฉยต่ออีเมลฉบับนี้ รหัสผ่านเดิมของท่านจะยังคงใช้งานได้ตามปกติ\n\n"
            f"{settings.SMTP_FROM_NAME}"
        )
        send_email(user.email, subject, body)

    # คืนข้อความเดียวกันเสมอไม่ว่าจะเจออีเมลนี้ในระบบหรือไม่ เพื่อไม่ให้รู้ว่าอีเมลไหนมีบัญชีอยู่จริง
    return MessageResponse(message=generic_message)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    invalid_error = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="รหัส OTP ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอรหัสใหม่อีกครั้ง"
    )

    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.reset_token or not user.reset_token_expires or user.reset_token_expires < now_th():
        raise invalid_error

    if user.reset_attempts >= settings.RESET_PASSWORD_MAX_ATTEMPTS:
        user.reset_token = None
        user.reset_token_expires = None
        db.commit()
        raise invalid_error

    if user.reset_token != payload.otp:
        user.reset_attempts += 1
        db.commit()
        remaining = settings.RESET_PASSWORD_MAX_ATTEMPTS - user.reset_attempts
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"รหัส OTP ไม่ถูกต้อง (พิมพ์ผิดได้อีก {max(remaining, 0)} ครั้ง)"
        )

    user.password_hash = get_password_hash(payload.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    user.reset_attempts = 0
    db.commit()

    return MessageResponse(message="ตั้งรหัสผ่านใหม่สำเร็จแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่")
