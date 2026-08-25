from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MessageSourceResponse(BaseModel):
    id: int
    document_id: Optional[int] = None
    filename: str
    chunk_content: str
    similarity_score: Optional[str] = None

    class Config:
        from_attributes = True


class MessageFeedbackCreate(BaseModel):
    rating: str  # like, dislike
    comment: Optional[str] = None


class MessageFeedbackResponse(BaseModel):
    id: int
    message_id: int
    rating: str
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime
    sources: List[MessageSourceResponse] = []
    feedback: Optional[MessageFeedbackResponse] = None

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
