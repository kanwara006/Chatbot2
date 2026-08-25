from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class DocumentChunkResponse(BaseModel):
    id: int
    chunk_index: int
    chunk_content: str
    chunk_tokens: int
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    id: int
    filename: str
    original_name: str
    file_type: str
    file_size: int
    status: str
    error_message: Optional[str] = None
    uploaded_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentDetailResponse(DocumentResponse):
    chunks: List[DocumentChunkResponse] = []
