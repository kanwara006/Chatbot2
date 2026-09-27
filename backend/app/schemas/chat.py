from pydantic import BaseModel, model_validator
from typing import Optional, List, Any
from datetime import datetime


class MessageSourceResponse(BaseModel):
    id: int
    document_id: Optional[int] = None
    filename: str
    page_number: Optional[str] = None
    page: Optional[str] = None
    similarity_score: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def populate_page_field(cls, data: Any) -> Any:
        if hasattr(data, "page_number") and getattr(data, "page_number"):
            # If ORM object
            if not getattr(data, "page", None):
                setattr(data, "page", getattr(data, "page_number"))
        elif isinstance(data, dict):
            if "page_number" in data and not data.get("page"):
                data["page"] = data["page_number"]
            elif "page" in data and not data.get("page_number"):
                data["page_number"] = str(data["page"])
        return data

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime
    sources: List[MessageSourceResponse] = []

    class Config:
        from_attributes = True


class ChatMessageRequest(BaseModel):
    conversation_id: Optional[int] = None
    message: str


class ConversationCreate(BaseModel):
    title: Optional[str] = "การสนทนาใหม่"


class ConversationResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationDetailResponse(ConversationResponse):
    messages: List[MessageResponse] = []
