from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class FAQBase(BaseModel):
    question: str
    answer: str
    category: str = "ทั่วไป"
    order_num: int = 0
    is_active: bool = True


class FAQCreate(FAQBase):
    pass


class FAQUpdate(BaseModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    order_num: Optional[int] = None
    is_active: Optional[bool] = None


class FAQResponse(FAQBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
