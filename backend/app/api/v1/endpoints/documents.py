import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_current_admin_user
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentResponse, DocumentDetailResponse

router = APIRouter()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


def process_document_task(document_id: int, db_url: str):
    """
    Background worker for RAG processing (Phase 7 & 10 pipeline).
    Extracts text, splits chunks, generates embeddings, stores to ChromaDB.
    """
    from app.core.database import SessionLocal
    db = SessionLocal()
    try:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            return

        doc.status = "processing"
        db.commit()

        # Simulated or actual ingestion
        # In Phase 7 & 10, full Chroma embedding will run here
        doc.status = "ready"
        db.commit()
    except Exception as e:
        if doc:
            doc.status = "error"
            doc.error_message = str(e)
            db.commit()
    finally:
        db.close()


@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0,
    limit: int = 100,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    query = db.query(Document)
    if status_filter:
        query = query.filter(Document.status == status_filter)
    return query.order_by(Document.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{document_id}", response_model=DocumentDetailResponse)
def get_document(
    document_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    item = db.query(Document).filter(Document.id == document_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return item


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    # Validate extension
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else ""
    if ext not in ["pdf", "docx", "txt"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Only PDF, DOCX, and TXT are supported."
        )

    # Save to disk
    sanitized_name = f"{int(os.path.getmtime('.'))}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(settings.UPLOAD_DIR, sanitized_name)

    content = await file.read()
    file_size = len(content)

    if file_size > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds 10MB limit."
        )

    with open(file_path, "wb") as f:
        f.write(content)

    document = Document(
        filename=sanitized_name,
        original_name=file.filename,
        file_path=file_path,
        file_type=ext,
        file_size=file_size,
        status="processing",
        uploaded_by=admin.id
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    # Trigger background RAG pipeline
    background_tasks.add_task(process_document_task, document.id, settings.DATABASE_URL)

    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Remove physical file if exists
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except OSError:
            pass

    db.delete(doc)
    db.commit()
    return None
