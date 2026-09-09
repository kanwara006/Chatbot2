from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from google import genai
import time
import logging

logger = logging.getLogger(__name__)


def create_vector_db(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = text_splitter.split_documents(documents)

    for index, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = index + 1

    logger.info(f"✅ แบ่งข้อมูลเป็น Chunk ทั้งหมด: {len(chunks)} Chunks")

    embeddings = HuggingFaceEmbeddings(
        model_name="BAAI/bge-m3",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True}
    )

    db = FAISS.from_documents(chunks, embeddings)
    logger.info("✅ สร้าง FAISS Vector Store สำเร็จ")
    return db


def create_gemini(api_key: str):
    client = genai.Client(
        api_key=api_key.strip()
    )
    return client


def generate_answer(client, prompt: str, model_name: str = "gemini-3.6-flash"):
    models_to_try = [model_name, "gemini-3.6-flash", "gemini-1.5-flash"]
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


def ask_rag(
    db,
    client,
    question: str,
    top_k: int = 4
):
    greetings = ["สวัสดี", "hello", "hi", "หวัดดี", "สอบถามครับ", "สอบถามค่ะ"]
    if question.strip().lower() in greetings:
        welcome_msg = "สวัสดีครับ! มีข้อสงสัยหรือต้องการสอบถามข้อมูลเกี่ยวกับ กยศ. มหาวิทยาลัยสงขลานครินทร์ เรื่องใด สามารถพิมพ์ถามได้เลยครับ"
        return {
            "answer": welcome_msg,
            "retrieval": []
        }

    if db is None:
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

    # ดึงเอกสารที่เกี่ยวข้อง (k=8 แล้วคัดเลือกไฟล์ละไม่เกิน 2 chunks รวมสูงสุด 4 chunks)
    raw_results = db.similarity_search_with_score(question, k=8)

    selected_docs = []
    file_chunks_count = {}

    for doc, distance in raw_results:
        fn = doc.metadata.get("filename", "unknown")
        if file_chunks_count.get(fn, 0) < 2:
            selected_docs.append((doc, distance))
            file_chunks_count[fn] = file_chunks_count.get(fn, 0) + 1
        if len(selected_docs) >= top_k:
            break

    if len(selected_docs) < top_k:
        for item in raw_results:
            if item not in selected_docs:
                selected_docs.append(item)
            if len(selected_docs) >= top_k:
                break

    context = ""
    retrieval = []

    for rank, (doc, score) in enumerate(selected_docs, 1):
        context += doc.page_content + "\n\n"
        page = doc.metadata.get("page", 0) + 1
        filename = doc.metadata.get("filename", "ไม่ระบุชื่อไฟล์").replace("\\", "/").split("/")[-1]
        similarity = 1 / (1 + score)

        retrieval.append({
            "rank": rank,
            "chunk": doc.metadata.get("chunk_id", "ไม่พบ"),
            "page": page,
            "filename": filename,
            "chunk_content": doc.page_content[:200] if doc.page_content else "",
            "similarity": f"{similarity:.2f}"
        })

    prompt = f"""ข้อมูลอ้างอิง (Context):
{context}
-------------------------
คำสั่งสำคัญ: 
กรุณาวิเคราะห์ "คำถามของผู้ใช้งาน" ด้านล่างนี้ แล้วตอบตามเงื่อนไขอย่างเคร่งครัด:

1. หากคำถามเป็นเพียงการทักทาย, กล่าวขอบคุณ, หรือพูดคุยเล่นทั่วไป (เช่น สวัสดี, ดีจ้า, ขอบคุณ, ทำอะไรได้บ้าง) 
   -> ให้ตอบกลับแบบเป็นมิตรโดยไม่ต้องสนใจ Context และต้องพิมพ์คำว่า [GENERAL] ไว้หน้าสุดของคำตอบเสมอ

2. หากคำถามต้องการข้อมูล กยศ. 
   -> ให้ตอบโดยใช้เนื้อหาจาก Context เท่านั้น ห้ามคิดเอง 
   -> หากไม่มีเนื้อหาใน Context ที่ตอบคำถามได้ ให้ตอบสั้นๆ ว่า "ไม่พบข้อมูลในเอกสารครับ/ค่ะ"

คำถามของผู้ใช้งาน:
{question}
"""

    response = generate_answer(client, prompt)

    if response:
        ans_text = response.text

        if "[GENERAL]" in ans_text:
            ans_text = ans_text.replace("[GENERAL]", "").strip()
            retrieval = []
        else:
            no_citation_phrases = [
                "ไม่พบข้อมูลในเอกสาร",
                "ขออภัย ไม่พบข้อมูลดังกล่าว"
            ]
            for phrase in no_citation_phrases:
                if phrase in ans_text:
                    retrieval = []
                    break

        # Deduplicate sources by filename and aggregate unique pages
        unique_sources = {}
        for item in retrieval:
            fn = item["filename"]
            page = item.get("page")
            if fn not in unique_sources:
                unique_sources[fn] = {
                    "filename": fn,
                    "pages": [page] if page is not None and str(page).strip() != "" else [],
                    "chunk_content": item.get("chunk_content", ""),
                    "similarity": item.get("similarity", "0.90")
                }
            else:
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
                "chunk_content": "",
                "similarity": data["similarity"]
            })

        return {
            "answer": ans_text,
            "retrieval": formatted_retrieval
        }
    else:
        return {
            "answer": "ระบบ AI ไม่สามารถประมวลผลคำตอบได้ในขณะนี้ครับ",
            "retrieval": []
        }
