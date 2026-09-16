from sqlalchemy import Column, Integer, String, BigInteger, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.core.timezone import now_th
from app.core.database import Base

# ขนาดเวกเตอร์ของโมเดล embedding ที่ใช้ (BAAI/bge-m3 = 1024 มิติ)
EMBEDDING_DIM = 1024


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(20), nullable=False)  # pdf, docx, txt
    file_size = Column(BigInteger, nullable=False)
    status = Column(String(30), default="processing", nullable=False)  # pending, processing, ready, error
    error_message = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=now_th, nullable=False)
    updated_at = Column(DateTime, default=now_th, onupdate=now_th, nullable=False)

    # Relationships
    uploader = relationship("User", back_populates="documents")
    category = relationship("Category", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    """
    Chunk เนื้อหา + embedding สำหรับใช้ค้นหาแบบ RAG มาจากได้ 2 แหล่ง: เอกสารที่อัปโหลด (document_id)
    หรือประกาศข่าวสารที่เผยแพร่แล้ว (announcement_id) — บันทึกอย่างใดอย่างหนึ่งต่อแถว ไม่ใช่ทั้งคู่
    """
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=True)
    announcement_id = Column(Integer, ForeignKey("announcements.id", ondelete="CASCADE"), nullable=True)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer, nullable=True)
    chunk_content = Column(Text, nullable=False)
    chunk_tokens = Column(Integer, default=0, nullable=False)
    embedding = Column(Vector(EMBEDDING_DIM), nullable=False)
    created_at = Column(DateTime, default=now_th, nullable=False)

    # Relationships
    document = relationship("Document", back_populates="chunks")
    announcement = relationship("Announcement", back_populates="chunks")
