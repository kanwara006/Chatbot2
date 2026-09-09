import os
import logging
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document

# Configure logging
logger = logging.getLogger(__name__)


def load_single_pdf(pdf_path: str):
    documents = []
    file_name = os.path.basename(pdf_path)
    abs_pdf_path = os.path.abspath(pdf_path)

    # --- ขั้นที่ 1: ลองอ่านด้วย PyPDFLoader ก่อน ---
    try:
        loader = PyPDFLoader(abs_pdf_path)
        pdf_docs = loader.load()
    except Exception as e:
        logger.warning(f"Failed to load text from {file_name} with PyPDFLoader: {e}")
        pdf_docs = []

    has_text = False
    for doc in pdf_docs:
        if doc.page_content.strip():
            has_text = True
            doc.metadata["source_type"] = "text"
            doc.metadata["filename"] = file_name
            documents.append(doc)

    # --- ขั้นที่ 2: ถ้าไม่มีข้อความ ใช้ pymupdf (fitz) อ่านแทน ---
    if not has_text:
        logger.info(f"PyPDFLoader ไม่พบข้อความใน {file_name} กำลังลองด้วย pymupdf...")
        try:
            import fitz  # pymupdf

            pdf_document = fitz.open(abs_pdf_path)
            for page_idx in range(len(pdf_document)):
                page = pdf_document[page_idx]
                text = page.get_text("text")
                if text.strip():
                    has_text = True
                    documents.append(
                        Document(
                            page_content=text,
                            metadata={
                                "page": page_idx,
                                "source_type": "pymupdf",
                                "filename": file_name,
                            },
                        )
                    )
            pdf_document.close()

            if has_text:
                logger.info(f"✅ pymupdf อ่าน {file_name} สำเร็จ ({len(documents)} หน้า)")
            else:
                logger.warning(
                    f"⚠️ {file_name} ไม่มีข้อความที่อ่านได้ (อาจเป็นไฟล์สแกนที่ไม่มี text layer)"
                )

        except ImportError:
            logger.error("ไม่พบ pymupdf กรุณาติดตั้งด้วย: pip install pymupdf")
        except Exception as e:
            logger.error(f"pymupdf ไม่สามารถอ่าน {file_name}: {e}")

    return documents


def load_pdfs_from_directory(directory_path: str):
    all_documents = []

    if not os.path.isdir(directory_path):
        logger.error(f"Directory not found: {directory_path}")
        return all_documents

    for filename in os.listdir(directory_path):
        if filename.lower().endswith(".pdf"):
            pdf_path = os.path.join(directory_path, filename)
            logger.info(f"กำลังอ่านไฟล์: {filename}...")
            docs = load_single_pdf(pdf_path)
            all_documents.extend(docs)

    logger.info(f"รวมข้อมูลทั้งหมดเรียบร้อย: {len(all_documents)} หน้า")
    return all_documents
