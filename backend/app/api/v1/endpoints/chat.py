from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user_optional
from app.core.timezone import now_th
from app.models.chat import Conversation, Message, MessageSource
from app.models.user import User
from app.schemas.chat import (
    ChatMessageRequest,
    MessageResponse,
    MessageSourceResponse,
    ConversationResponse,
    ConversationDetailResponse
)

router = APIRouter()


# Quick keyword responder for Phase 6 backend demo (Phase 7 connects pluggable LLM/RAG service)
MOCK_ANSWERS = [
    {
        "keywords": ["ผู้กู้รายเก่า", "รายเก่า", "ต่อสัญญา"],
        "answer": """## ขั้นตอนสำหรับผู้กู้รายเก่า (ต่อสัญญา)

ผู้กู้ยืมรายเก่าที่ต้องการกู้ยืมต่อเนื่อง ต้องดำเนินการตามขั้นตอนดังนี้

### 1. ตรวจสอบสิทธิ์
- ยืนยันสถานะผ่านระบบ **กยศ. Connect** ที่ [www.studentloan.or.th](https://www.studentloan.or.th)
- ตรวจสอบว่ามีชั่วโมงกิจกรรมจิตอาสาครบ **36 ชั่วโมง/ปี**

### 2. เตรียมเอกสาร
- สำเนาบัตรประชาชนนักศึกษา
- หนังสือรับรองรายได้ครอบครัว
- เอกสารยืนยันการลงทะเบียนเรียน

### 3. ยื่นเอกสาร
- ยื่นเอกสารที่งานกองทุนฯ ตามกำหนดการที่ประกาศ
- ลงนามสัญญากู้ยืมใหม่ทุกปีการศึกษา""",
        "sources": [
            {"filename": "ขั้นตอนการดำเนินการกู้ยืม ปี 2569.pdf", "similarity": "0.94"},
            {"filename": "ประกาศ กยศ. ภาคเรียนที่ 1/2569.pdf", "similarity": "0.89"}
        ]
    },
    {
        "keywords": ["เอกสาร", "ใช้เอกสาร", "เอกสารอะไร"],
        "answer": """## เอกสารที่ต้องใช้ในการกู้ยืม กยศ.

1. **สำเนาบัตรประชาชน** ของนักศึกษา (รับรองสำเนาถูกต้อง)
2. **สำเนาทะเบียนบ้าน** ของนักศึกษา
3. **รูปถ่าย** ขนาด 1 นิ้ว จำนวน 2 รูป
4. **หนังสือรับรองรายได้** ของผู้ปกครอง/ครอบครัว
5. **ใบรับรองนักศึกษา** จากมหาวิทยาลัย""",
        "sources": [
            {"filename": "รายการเอกสารการกู้ยืม กยศ. 2569.pdf", "similarity": "0.96"}
        ]
    },
    {
        "keywords": ["จิตอาสา", "ชั่วโมงจิตอาสา"],
        "answer": """## กิจกรรมจิตอาสา — ข้อมูลสำคัญ

- ผู้กู้ยืม กยศ. ต้องทำกิจกรรมจิตอาสา **ไม่น้อยกว่า 36 ชั่วโมงต่อปีการศึกษา**
- บันทึกผ่านแอปพลิเคชัน **กยศ. Connect**
- ต้องมีการรับรองจากผู้ควบคุมกิจกรรม""",
        "sources": [
            {"filename": "ระเบียบกิจกรรมจิตอาสา กยศ. 2569.pdf", "similarity": "0.95"}
        ]
    }
]


from app.services.rag import get_rag_service


def generate_chat_response(db: Session, query: str):
    try:
        rag_svc = get_rag_service()
        result = rag_svc.query(db, query)
        answer = result.get("answer", "")
        sources = result.get("retrieval", [])
        return answer, sources
    except Exception as e:
        # Fallback in case of error
        query_lower = query.lower()
        for item in MOCK_ANSWERS:
            if any(kw in query_lower for kw in item["keywords"]):
                return item["answer"], item["sources"]

        default_answer = f"""ขออภัย เกิดข้อผิดพลาดในการประมวลผล RAG ({str(e)})
กรุณาติดต่อเจ้าหน้าที่กองทุนเงินให้กู้ยืมเพื่อการศึกษา มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี เพื่อสอบถามข้อมูลเพิ่มเติม"""
        return default_answer, []


@router.get("/conversations", response_model=List[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not current_user:
        return []
    return db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.updated_at.desc()).all()


@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation_detail(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    if conv.user_id and (not current_user or current_user.id != conv.user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return conv


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_conversation(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    if conv.user_id and (not current_user or current_user.id != conv.user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.delete(conv)
    db.commit()
    return None


@router.post("/message", response_model=MessageResponse)
def send_message(
    payload: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    # Guests are not signed in: answer the question but never write to the DB.
    if not current_user:
        answer_text, sources_data = generate_chat_response(db, payload.message)
        return MessageResponse(
            id=0,
            conversation_id=0,
            role="assistant",
            content=answer_text,
            created_at=now_th(),
            sources=[
                MessageSourceResponse(
                    id=0,
                    filename=src["filename"],
                    page_number=str(src.get("page", "")) if src.get("page") is not None else None,
                    similarity_score=src.get("similarity", "0.90"),
                )
                for src in sources_data
            ],
        )

    # 1. Get or create conversation (owned by the signed-in user only)
    conv = None
    if payload.conversation_id:
        conv = db.query(Conversation).filter(Conversation.id == payload.conversation_id).first()
        if not conv or conv.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    if not conv:
        title = payload.message[:30] + ("..." if len(payload.message) > 30 else "")
        conv = Conversation(
            user_id=current_user.id,
            title=title
        )
        db.add(conv)
        db.commit()
        db.refresh(conv)

    # 2. Save User message
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=payload.message
    )
    db.add(user_msg)
    db.commit()

    # 3. Generate AI response (Phase 7 & 8 will use RAG Engine)
    answer_text, sources_data = generate_chat_response(db, payload.message)

    # 4. Save Assistant message
    ai_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=answer_text
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    # 5. Save Sources if any
    for src in sources_data:
        source_record = MessageSource(
            message_id=ai_msg.id,
            document_id=src.get("document_id"),
            filename=src["filename"],
            page_number=str(src.get("page", "")) if src.get("page") is not None else None,
            similarity_score=src.get("similarity", "0.90")
        )
        db.add(source_record)
    db.commit()
    db.refresh(ai_msg)

    return ai_msg
