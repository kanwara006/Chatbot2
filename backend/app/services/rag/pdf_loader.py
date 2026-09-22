import os
import io
import logging
from langchain_core.documents import Document

logger = logging.getLogger(__name__)

# รูปภาพที่มีพิกเซลน้อยกว่านี้ ถือว่าเป็นโลโก้/ไอคอนตกแต่ง ไม่ใช่เนื้อหา จึงข้าม ไม่ต้อง OCR
MIN_IMAGE_PIXELS = 40000  # ประมาณ 200x200 พิกเซล


def _ocr_image_bytes(image_bytes: bytes) -> str:
    """อ่านข้อความจากรูปภาพหนึ่งรูปด้วย Tesseract OCR (รองรับไทย+อังกฤษ)"""
    try:
        import pytesseract
        from PIL import Image

        image = Image.open(io.BytesIO(image_bytes))
        if image.width * image.height < MIN_IMAGE_PIXELS:
            return ""
        return pytesseract.image_to_string(image, lang="tha+eng").strip()
    except ImportError:
        logger.warning("ไม่พบ pytesseract/Pillow กรุณาติดตั้งด้วย: pip install pytesseract pillow")
        return ""
    except Exception as e:
        logger.warning(f"⚠️ OCR รูปภาพไม่สำเร็จ: {e}")
        return ""


def _extract_page_links(page) -> str:
    """
    ดึงลิงก์ (URL) แบบ URI ที่ฝังอยู่ในหน้า PDF (เช่น ปุ่ม/ข้อความที่กดแล้วไปดาวน์โหลดฟอร์ม หรือไปหน้าเว็บ
    ที่เกี่ยวข้อง) พร้อมข้อความที่ผูกกับลิงก์นั้น ลิงก์เหล่านี้เป็นคนละส่วนกับ text layer ปกติของ PDF
    (เป็น annotation ซ้อนอยู่บนข้อความ) จึง PyPDFLoader ไม่ได้ดึงมาให้ ถ้าไม่ทำตรงนี้ RAG จะไม่รู้จัก URL จริง
    แม้ข้อความที่มองเห็นจะบอกแค่ชื่อเอกสารเฉยๆ
    """
    lines = []
    for link in page.get_links():
        uri = link.get("uri")
        if not uri:
            continue
        rect = link.get("from")
        anchor_text = page.get_textbox(rect).strip() if rect else ""
        anchor_text = " ".join(anchor_text.split())
        if anchor_text:
            lines.append(f"[ลิงก์: {anchor_text}] {uri}")
        else:
            lines.append(uri)
    return "\n".join(lines)


def _ocr_page_images(pdf_document, page_index: int, file_name: str) -> str:
    """
    OCR เฉพาะรูปภาพที่ฝังอยู่ในหน้านั้น (ไม่ใช่แปลงทั้งหน้าเป็นรูปภาพ) เพื่อดึงข้อความที่อยู่ใน
    อินโฟกราฟิก/ภาพตัวอย่างเอกสาร ซึ่ง text layer ปกติของ PDF ไม่ได้เก็บไว้ ครอบคลุมทั้งกรณีหน้าที่มี
    ทั้งข้อความจริงและรูปภาพประกอบในหน้าเดียวกัน และกรณีหน้าที่เป็นภาพสแกนทั้งหน้า (ไม่มี text layer เลย)
    เพราะทั้งสองกรณีรูปภาพจะถูกฝังเป็น image object ในหน้า PDF เหมือนกัน
    """
    page = pdf_document[page_index]
    texts = []
    for img_info in page.get_images(full=True):
        xref = img_info[0]
        try:
            base_image = pdf_document.extract_image(xref)
            image_bytes = base_image["image"]
        except Exception as e:
            logger.warning(f"⚠️ ดึงรูปภาพ xref={xref} หน้า {page_index + 1} ของ {file_name} ไม่สำเร็จ: {e}")
            continue
        ocr_text = _ocr_image_bytes(image_bytes)
        if ocr_text:
            texts.append(ocr_text)
    return "\n".join(texts)


def load_single_pdf(pdf_path: str):
    """
    อ่านเนื้อหา PDF ทีละหน้า โดยดึง text layer ที่ฝังอยู่ในไฟล์เป็นหลัก (เร็วและแม่นกว่า)
    และตรวจทุกหน้าว่ามีรูปภาพฝังอยู่หรือไม่ (เช่น อินโฟกราฟิก ภาพตัวอย่างเอกสาร หรือหน้าสแกนทั้งหน้า)
    ถ้ามี จะรัน OCR เฉพาะรูปภาพนั้น และดึงลิงก์ (URL) ที่ฝังอยู่ในหน้านั้นด้วย (เช่น ลิงก์ดาวน์โหลดฟอร์ม)
    แล้วนำทั้งหมดมารวมกับ text layer เดิม (ไม่ใช่เลือกอย่างใดอย่างหนึ่ง) ทำให้ไม่พลาดเนื้อหาที่อยู่ในรูปภาพ
    หรือ URL จริงที่ผูกกับข้อความ แม้หน้านั้นจะมีข้อความจริงอยู่แล้วก็ตาม
    """
    documents = []
    file_name = os.path.basename(pdf_path)
    abs_pdf_path = os.path.abspath(pdf_path)

    # ใช้ pymupdf (fitz) อย่างเดียวสำหรับทั้ง text layer, OCR รูปภาพ และลิงก์ แทนการพึ่งพา
    # langchain-community's PyPDFLoader เพิ่ม เพราะแพ็กเกจนั้นมี __init__ ที่ import
    # dependency หนักๆ (tiktoken/transformers/numpy) โดยไม่จำเป็น ทำให้กิน RAM เกิน 350MB
    # เปล่าๆ ซึ่งพังการ deploy บน host ที่จำกัด RAM ต่ำอย่าง Render free tier
    try:
        import fitz  # pymupdf
    except Exception as e:
        logger.warning(f"ไม่สามารถโหลด pymupdf เพื่อประมวลผล {file_name}: {e}")
        return documents

    try:
        pdf_document = fitz.open(abs_pdf_path)
    except Exception as e:
        logger.warning(f"ไม่สามารถเปิด {file_name} ด้วย pymupdf: {e}")
        return documents

    page_count = len(pdf_document)

    for page_idx in range(page_count):
        page = pdf_document[page_idx]
        text_content = page.get_text().strip()

        image_ocr_text = _ocr_page_images(pdf_document, page_idx, file_name)
        if image_ocr_text:
            logger.info(
                f"✅ OCR รูปภาพในหน้า {page_idx + 1} ของ {file_name} สำเร็จ ({len(image_ocr_text)} ตัวอักษร)"
            )
        link_text = _extract_page_links(page)
        if link_text:
            logger.info(f"🔗 พบลิงก์ในหน้า {page_idx + 1} ของ {file_name}")

        parts = [p for p in (text_content, image_ocr_text, link_text) if p]
        combined_content = "\n\n".join(parts)
        source_type = "+".join(
            name for name, value in (("text", text_content), ("ocr", image_ocr_text), ("link", link_text)) if value
        ) or None

        if combined_content:
            documents.append(
                Document(
                    page_content=combined_content,
                    metadata={"page": page_idx, "source_type": source_type, "filename": file_name},
                )
            )

    pdf_document.close()

    if not documents:
        logger.warning(f"⚠️ {file_name} ไม่มีข้อความที่อ่านได้เลย (ทั้ง text layer และ OCR)")

    return documents
