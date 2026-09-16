from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    categories,
    announcements,
    faq,
    documents,
    chat,
    dashboard,
    contact
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(announcements.router, prefix="/announcements", tags=["Announcements"])
api_router.include_router(faq.router, prefix="/faq", tags=["FAQs"])
api_router.include_router(documents.router, prefix="/documents", tags=["Knowledge Base"])
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chatbot"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Admin Dashboard"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
