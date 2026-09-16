from langchain_text_splitters import RecursiveCharacterTextSplitter
from google import genai
import time
import logging

logger = logging.getLogger(__name__)


def split_into_chunks(documents):
    """แบ่งเอกสาร (list ของ langchain Document ต่อหน้า) เป็น chunk ย่อยสำหรับทำ embedding"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = text_splitter.split_documents(documents)

    for index, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = index + 1

    logger.info(f"✅ แบ่งข้อมูลเป็น Chunk ทั้งหมด: {len(chunks)} Chunks")
    return chunks


def get_embeddings_model():
    from langchain_huggingface import HuggingFaceEmbeddings

    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-m3",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )


def create_gemini(api_key: str):
    client = genai.Client(
        api_key=api_key.strip()
    )
    return client


def generate_answer(client, prompt: str, model_name: str = "gemini-3.6-flash"):
    models_to_try = [model_name, "gemini-3.6-flash"]
    # De-duplicate while preserving order
    models_to_try = list(dict.fromkeys(models_to_try))

    for model in models_to_try:
        retry = 2
        for i in range(retry):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                return response
            except Exception as e:
                logger.warning(f"⚠️ Gemini ({model}) Error ครั้งที่ {i+1}: {e}")
                time.sleep(2)
    return None


def retrieve_chunks(session, embeddings_model, question: str, k: int = 8):
    """ค้นหา chunk ที่ใกล้เคียงที่สุดจากตาราง document_chunks ใน database ด้วย pgvector (cosine distance)"""
    from app.models.document import DocumentChunk

    query_vector = embeddings_model.embed_query(question)
    return (
        session.query(DocumentChunk, DocumentChunk.embedding.cosine_distance(query_vector).label("distance"))
        .order_by("distance")
        .limit(k)
        .all()
    )


def chunk_source_name(chunk) -> str:
    """ชื่อแหล่งอ้างอิงของ chunk ไม่ว่าจะมาจากเอกสารที่อัปโหลดหรือประกาศข่าวสาร"""
    if chunk.document:
        return chunk.document.original_name
    if chunk.announcement:
        return f"ประกาศ: {chunk.announcement.title}"
    return "ไม่ระบุแหล่งที่มา"


def chunk_source_key(chunk):
    """คีย์เอกลักษณ์ของแหล่งที่มา ใช้เทียบว่า chunk 2 อันมาจากไฟล์/ประกาศเดียวกันหรือไม่"""
    if chunk.document_id is not None:
        return ("document", chunk.document_id)
    if chunk.announcement_id is not None:
        return ("announcement", chunk.announcement_id)
    return ("unknown", chunk.id)


def ask_rag(
    session,
    embeddings_model,
    client,
    question: str
):
    greetings = ["สวัสดี", "hello", "hi", "หวัดดี", "สอบถามครับ", "สอบถามค่ะ"]
    if question.strip().lower() in greetings:
        welcome_msg = "สวัสดีครับ! มีข้อสงสัยหรือต้องการสอบถามข้อมูลเกี่ยวกับ กยศ. มหาวิทยาลัยสงขลานครินทร์ เรื่องใด สามารถพิมพ์ถามได้เลยครับ"
        return {
            "answer": welcome_msg,
            "retrieval": []
        }

    raw_results = retrieve_chunks(session, embeddings_model, question, k=8)

    if not raw_results:
        # Fallback if no documents have been indexed yet
        prompt = f"""คำสั่ง: กรุณาตอบคำถามด้านล่างนี้อย่างสุภาพและเป็นมิตร หากเกี่ยวกับ กยศ. มหาวิทยาลัยสงขลานครินทร์ ให้ตอบเท่าที่ทราบข้อมูลทั่วไป:
คำถาม: {question}"""
        response = generate_answer(client, prompt)
        if response:
            return {
                "answer": response.text,
                "retrieval": []
            }
        return {
            "answer": "ขออภัย ขณะนี้ระบบยังไม่มีเอกสารในฐานข้อมูลและไม่สามารถประมวลผลคำตอบได้ครับ",
            "retrieval": []
        }

    # จัดกลุ่ม chunk ตามแหล่งที่มา (ไฟล์/ประกาศ) โดยยังคงลำดับตามคะแนนความใกล้เคียงเดิม
    # แทนที่จะเดาแหล่งที่ถูกต้องจากคะแนนเวกเตอร์ของ chunk อันดับ 1 เพียงอย่างเดียว (ซึ่งพลาดบ่อย
    # เวลามีหลายเอกสารที่ใช้คำศัพท์คล้ายกัน เช่น "ผู้กู้รายเก่า" กับ "ผู้กู้รายใหม่") เราส่งบริบทจาก
    # ทุกแหล่งที่ติดอันดับให้ Gemini อ่านเนื้อหาเองแล้วเลือกแหล่งที่ตรงคำถามจริง ซึ่งแม่นยำกว่าการ
    # ตัดสินใจล่วงหน้าด้วยคะแนนความคล้ายเชิงเวกเตอร์อย่างเดียว
    sources_map = {}
    source_order = []
    for chunk, distance in raw_results:
        name = chunk_source_name(chunk)
        if name not in sources_map:
            sources_map[name] = []
            source_order.append(name)
        sources_map[name].append((chunk, distance))

    context_blocks = [
        f"[แหล่งที่มา: {name}]\n" + "\n".join(c.chunk_content for c, _ in sources_map[name])
        for name in source_order
    ]
    context = "\n\n".join(context_blocks)

    prompt = f"""ข้อมูลอ้างอิงจากฐานความรู้ (แบ่งเป็นแหล่งที่มาต่างๆ ด้านล่าง):
{context}
-------------------------
คำสั่งสำคัญ:
กรุณาวิเคราะห์ "คำถามของผู้ใช้งาน" ด้านล่างนี้ แล้วตอบตามเงื่อนไขอย่างเคร่งครัด:

1. หากคำถามเป็นเพียงการทักทาย, กล่าวขอบคุณ, หรือพูดคุยเล่นทั่วไป (เช่น สวัสดี, ดีจ้า, ขอบคุณ, ทำอะไรได้บ้าง)
   -> ให้ตอบกลับแบบเป็นมิตรโดยไม่ต้องสนใจ Context และต้องพิมพ์คำว่า [GENERAL] ไว้หน้าสุดของคำตอบเสมอ

2. หากคำถามต้องการข้อมูล กยศ.
   -> พิจารณาทุกแหล่งที่มาด้านบน แล้วเลือกใช้แหล่งที่เกี่ยวข้องกับคำถามมากที่สุดในการตอบ (ปกติควรเป็นแหล่งเดียว
      เลือกใช้มากกว่าหนึ่งแหล่งเฉพาะเมื่อจำเป็นจริงๆ)
   -> หากแหล่งที่เกี่ยวข้องไม่ได้ตอบคำถามตรงๆ แต่มีเนื้อหาที่เกี่ยวข้องอยู่บ้าง (เช่น มีตัวอย่าง รายละเอียด หรือ
      ข้อมูลประกอบของสิ่งที่ถูกถามถึง) ให้นำเนื้อหาที่มีอยู่จริงมาอธิบายให้ผู้ถามเข้าใจเท่าที่มีข้อมูล แทนที่จะตอบว่า
      ไม่พบข้อมูลทันที และอาจแจ้งด้วยว่าเอกสารมีข้อมูลส่วนใดให้บ้าง
   -> ห้ามใช้แหล่งที่ไม่เกี่ยวข้องกับคำถามเลย (พูดถึงคนละเรื่องโดยสิ้นเชิง) และห้ามคิดข้อมูลเพิ่มเติมเองที่ไม่มีอยู่ในแหล่งที่มา
   -> ตอบโดยใช้เนื้อหาจากแหล่งที่เลือกเท่านั้น ห้ามคิดเอง
   -> หากไม่มีแหล่งใดเกี่ยวข้องกับคำถามเลยจริงๆ ให้ตอบสั้นๆ ว่า "ไม่พบข้อมูลในเอกสารครับ/ค่ะ"
   -> ปิดท้ายคำตอบด้วยการขึ้นบรรทัดใหม่แล้วพิมพ์ [ใช้แหล่งที่มา: ชื่อแหล่งที่มา] เสมอ โดยใส่ชื่อแหล่งที่มา
      ที่เลือกใช้จริงตามที่ระบุไว้ในหัวข้อ [แหล่งที่มา: ...] ด้านบนเป๊ะๆ (คั่นด้วย , หากใช้หลายแหล่ง หรือใส่
      "ไม่มี" หากไม่พบข้อมูลเลย)

คำถามของผู้ใช้งาน:
{question}
"""

    response = generate_answer(client, prompt)

    if not response:
        return {
            "answer": "ระบบ AI ไม่สามารถประมวลผลคำตอบได้ในขณะนี้ครับ",
            "retrieval": []
        }

    ans_text = response.text

    if "[GENERAL]" in ans_text:
        ans_text = ans_text.replace("[GENERAL]", "").strip()
        return {"answer": ans_text, "retrieval": []}

    # แกะแท็ก [ใช้แหล่งที่มา: ...] ที่ Gemini รายงานกลับมาว่าใช้แหล่งไหนจริงในการตอบ
    import re
    used_sources = []
    tag_match = re.search(r"\[ใช้แหล่งที่มา:\s*(.+?)\]\s*$", ans_text.strip())
    if tag_match:
        ans_text = ans_text[:tag_match.start()].rstrip()
        tag_value = tag_match.group(1).strip()
        if tag_value and tag_value != "ไม่มี":
            used_sources = [s.strip() for s in tag_value.split(",") if s.strip()]
    elif not any(p in ans_text.strip()[:60] for p in ["ไม่พบข้อมูลในเอกสาร", "ขออภัย ไม่พบข้อมูลดังกล่าว"]):
        # เผื่อ Gemini ลืมใส่แท็ก แต่ตอบแบบมีเนื้อหาจริง — ใช้แหล่งของ chunk อันดับ 1 เป็นค่าสำรอง
        used_sources = [chunk_source_name(raw_results[0][0])]

    retrieval = []
    for name in used_sources:
        if name not in sources_map:
            continue  # กันกรณี Gemini พิมพ์ชื่อแหล่งคลาดเคลื่อนจนจับคู่ไม่ได้
        for chunk, distance in sources_map[name]:
            page = (chunk.page_number or 0) + 1 if chunk.document else None
            retrieval.append({
                "filename": name,
                "page": page,
                "similarity": f"{1 - distance:.2f}",
                "document_id": chunk.document_id,
            })

    # Deduplicate sources by filename and aggregate unique pages
    unique_sources = {}
    for item in retrieval:
        fn = item["filename"]
        page = item.get("page")
        if fn not in unique_sources:
            unique_sources[fn] = {
                "filename": fn,
                "pages": [],
                "similarity": item.get("similarity", "0.90"),
                "document_id": item.get("document_id"),
            }
        if page is not None and str(page).strip() != "" and page not in unique_sources[fn]["pages"]:
            unique_sources[fn]["pages"].append(page)

    formatted_retrieval = []
    for fn, data in unique_sources.items():
        def sort_key(p):
            try:
                return (0, int(p))
            except (ValueError, TypeError):
                return (1, str(p))
        sorted_pages = sorted(data["pages"], key=sort_key)
        page_str = ", ".join(map(str, sorted_pages)) if sorted_pages else ""
        formatted_retrieval.append({
            "filename": fn,
            "page": page_str,
            "similarity": data["similarity"],
            "document_id": data["document_id"],
        })

    return {
        "answer": ans_text,
        "retrieval": formatted_retrieval
    }
