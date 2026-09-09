import os
import logging
from typing import Optional, Tuple, List, Dict, Any
from app.core.config import settings
from .rag_engine import create_vector_db, create_gemini, ask_rag
from .pdf_loader import load_pdfs_from_directory

logger = logging.getLogger(__name__)


class RAGService:
    _instance: Optional["RAGService"] = None

    def __init__(self):
        self.db = None
        self.client = None
        self.embeddings = None
        self.is_initialized = False

    @classmethod
    def get_instance(cls) -> "RAGService":
        if cls._instance is None:
            cls._instance = RAGService()
        return cls._instance

    def initialize(self):
        """Initializes Gemini client and loads or creates FAISS index."""
        if self.is_initialized:
            return

        # 1. Initialize Gemini client
        api_key = settings.GEMINI_API_KEY
        if api_key:
            try:
                self.client = create_gemini(api_key)
                logger.info("✅ Gemini Client initialized successfully.")
            except Exception as e:
                logger.error(f"❌ Failed to initialize Gemini Client: {e}")

        # 2. Load FAISS index or create from documents in UPLOAD_DIR
        try:
            self._load_or_build_index()
        except Exception as e:
            logger.warning(f"⚠️ Vector DB initialization deferred: {e}")

        self.is_initialized = True

    def _load_or_build_index(self):
        index_dir = settings.FAISS_INDEX_DIR
        upload_dir = settings.UPLOAD_DIR

        # Check if saved index exists
        if os.path.exists(index_dir) and os.path.exists(os.path.join(index_dir, "index.faiss")):
            try:
                from langchain_huggingface import HuggingFaceEmbeddings
                from langchain_community.vectorstores import FAISS

                logger.info(f"Loading existing FAISS index from {index_dir}...")
                embeddings = HuggingFaceEmbeddings(
                    model_name="BAAI/bge-m3",
                    model_kwargs={"device": "cpu"},
                    encode_kwargs={"normalize_embeddings": True}
                )
                self.db = FAISS.load_local(index_dir, embeddings, allow_dangerous_deserialization=True)
                logger.info("✅ Loaded existing FAISS index successfully.")
                return
            except Exception as e:
                logger.warning(f"Could not load local FAISS index: {e}")

        # Otherwise build index if PDFs exist in upload_dir
        if os.path.exists(upload_dir):
            pdf_files = [f for f in os.listdir(upload_dir) if f.lower().endswith(".pdf")]
            if pdf_files:
                logger.info(f"Found {len(pdf_files)} PDFs in {upload_dir}. Building new FAISS index...")
                documents = load_pdfs_from_directory(upload_dir)
                if documents:
                    self.db = create_vector_db(documents)
                    os.makedirs(index_dir, exist_ok=True)
                    self.db.save_local(index_dir)
                    logger.info(f"✅ FAISS index saved to {index_dir}")

    def rebuild_index(self):
        """Rebuilds the FAISS index from documents in upload_dir."""
        upload_dir = settings.UPLOAD_DIR
        index_dir = settings.FAISS_INDEX_DIR

        if not os.path.exists(upload_dir):
            os.makedirs(upload_dir, exist_ok=True)

        documents = load_pdfs_from_directory(upload_dir)
        if documents:
            self.db = create_vector_db(documents)
            os.makedirs(index_dir, exist_ok=True)
            self.db.save_local(index_dir)
            logger.info("✅ FAISS index rebuilt successfully.")
            return len(documents)
        return 0

    def query(self, question: str) -> Dict[str, Any]:
        """Queries the RAG engine with a question."""
        if not self.client and settings.GEMINI_API_KEY:
            self.client = create_gemini(settings.GEMINI_API_KEY)

        if not self.client:
            return {
                "answer": "กรุณาตั้งค่า GEMINI_API_KEY ในระบบก่อนใช้งานครับ",
                "retrieval": []
            }

        return ask_rag(
            db=self.db,
            client=self.client,
            question=question
        )


def get_rag_service() -> RAGService:
    service = RAGService.get_instance()
    if not service.is_initialized:
        service.initialize()
    return service
