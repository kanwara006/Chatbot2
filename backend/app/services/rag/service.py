import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.core.config import settings
from .rag_engine import split_into_chunks, get_embeddings_model, create_gemini, ask_rag
from .pdf_loader import load_single_pdf

logger = logging.getLogger(__name__)


class RAGService:
    _instance: Optional["RAGService"] = None

    def __init__(self):
        self.client = None
        self.embeddings = None
        self.is_initialized = False

    @classmethod
    def get_instance(cls) -> "RAGService":
        if cls._instance is None:
            cls._instance = RAGService()
        return cls._instance

    def initialize(self):
        """Initializes the Gemini client. The embeddings model loads lazily on first use."""
        if self.is_initialized:
            return

        api_key = settings.GEMINI_API_KEY
        if api_key:
            try:
                self.client = create_gemini(api_key)
                logger.info("✅ Gemini Client initialized successfully.")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Gemini Client: {e}")

        self.is_initialized = True

    def _get_embeddings(self):
        if self.embeddings is None:
            self.embeddings = get_embeddings_model()
        return self.embeddings

    def index_document(self, db: Session, document) -> int:
        """
        ประมวลผลไฟล์เอกสาร 1 ไฟล์: แตกเป็น chunk, สร้าง embedding, บันทึกลงตาราง
        document_chunks ใน database (แทนที่ chunk เดิมของเอกสารนี้ทั้งหมด)
        """
        from app.models.document import DocumentChunk

        if document.file_type != "pdf":
            # รองรับเฉพาะ PDF ในการทำเวกเตอร์ในตอนนี้
            return 0

        pages = load_single_pdf(document.file_path)
        if not pages:
            return 0

        chunks = split_into_chunks(pages)
        if not chunks:
            return 0

        embeddings_model = self._get_embeddings()
        vectors = embeddings_model.embed_documents([c.page_content for c in chunks])

        # ลบ chunk เดิมของเอกสารนี้ก่อนบันทึกชุดใหม่ (กรณีอัปโหลดซ้ำ/ประมวลผลใหม่)
        db.query(DocumentChunk).filter(DocumentChunk.document_id == document.id).delete()

        for chunk, vector in zip(chunks, vectors):
            db.add(DocumentChunk(
                document_id=document.id,
                chunk_index=chunk.metadata.get("chunk_id", 0),
                page_number=chunk.metadata.get("page"),
                chunk_content=chunk.page_content,
                chunk_tokens=len(chunk.page_content.split()),
                embedding=vector,
            ))

        db.commit()
        logger.info(f"✅ บันทึก {len(chunks)} chunks พร้อม embedding ลง database สำหรับเอกสาร '{document.original_name}'")
        return len(chunks)

    def index_announcement(self, db: Session, announcement) -> int:
        """
        ประมวลผลประกาศข่าวสาร 1 รายการ (เฉพาะที่เผยแพร่แล้ว): แตกหัวข้อ+เนื้อหาเป็น chunk,
        สร้าง embedding, บันทึกลงตาราง document_chunks (แทนที่ chunk เดิมของประกาศนี้ทั้งหมด)
        """
        from langchain_core.documents import Document as LCDocument
        from app.models.document import DocumentChunk

        # ลบ chunk เดิมของประกาศนี้ก่อนเสมอ (กรณีแก้ไข/ยกเลิกเผยแพร่)
        db.query(DocumentChunk).filter(DocumentChunk.announcement_id == announcement.id).delete()

        if not announcement.is_published:
            db.commit()
            return 0

        text = f"{announcement.title}\n\n{announcement.content}"
        pages = [LCDocument(page_content=text, metadata={})]
        chunks = split_into_chunks(pages)
        if not chunks:
            db.commit()
            return 0

        embeddings_model = self._get_embeddings()
        vectors = embeddings_model.embed_documents([c.page_content for c in chunks])

        for chunk, vector in zip(chunks, vectors):
            db.add(DocumentChunk(
                announcement_id=announcement.id,
                chunk_index=chunk.metadata.get("chunk_id", 0),
                chunk_content=chunk.page_content,
                chunk_tokens=len(chunk.page_content.split()),
                embedding=vector,
            ))

        db.commit()
        logger.info(f"✅ บันทึก {len(chunks)} chunks พร้อม embedding ลง database สำหรับประกาศ '{announcement.title}'")
        return len(chunks)

    def query(self, db: Session, question: str) -> Dict[str, Any]:
        """Queries the RAG engine with a question, retrieving context from document_chunks in the database."""
        if not self.client and settings.GEMINI_API_KEY:
            self.client = create_gemini(settings.GEMINI_API_KEY)

        if not self.client:
            return {
                "answer": "กรุณาตั้งค่า GEMINI_API_KEY ในระบบก่อนใช้งานครับ",
                "retrieval": []
            }

        return ask_rag(
            session=db,
            embeddings_model=self._get_embeddings(),
            client=self.client,
            question=question
        )


def get_rag_service() -> RAGService:
    service = RAGService.get_instance()
    if not service.is_initialized:
        service.initialize()
    return service
