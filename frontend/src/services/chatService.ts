import axios from 'axios'
import type { MessageSource, Conversation } from '@/types'

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1'

const STORAGE_KEY = 'psu_slf_conversations'



export async function simulateAIResponse(question: string): Promise<{
  answer: string
  sources: MessageSource[]
}> {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat/message`, {
      message: question,
    })

    const data = response.data
    const sources: MessageSource[] = (data.sources || []).map((src: any, index: number) => ({
      documentId: src.id || index + 1,
      filename: src.filename || 'เอกสารอ้างอิง.pdf',
      chunkContent: src.chunk_content || '',
      page: src.page || src.page_number || undefined,
      similarity: src.similarity_score ? parseFloat(src.similarity_score) : undefined,
    }))

    return {
      answer: data.content || data.answer || 'ขออภัย ไม่พบคำตอบ',
      sources,
    }
  } catch (error) {
    console.error('Error calling backend RAG API:', error)
    return {
      answer: 'ขออภัย ระบบขัดข้องชั่วคราว ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ RAG ได้ กรุณาลองใหม่อีกครั้ง',
      sources: [],
    }
  }
}

// ── Conversation Storage ─────────────────────────────────────────────

export function getStoredConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveConversation(conv: Conversation): void {
  const convs = getStoredConversations()
  const idx = convs.findIndex((c) => c.id === conv.id)
  if (idx >= 0) {
    convs[idx] = conv
  } else {
    convs.unshift(conv)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
}

export function deleteConversation(id: number): void {
  const convs = getStoredConversations().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
}

export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}
