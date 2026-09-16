import axios from 'axios'
import type { Message, MessageSource, Conversation } from '@/types'
import { API_BASE_URL, getAuthHeader, getStoredAuth } from '@/services/authService'

function mapSources(raw: any[]): MessageSource[] {
  return (raw || []).map((src: any, index: number) => ({
    documentId: src.document_id ?? index + 1,
    filename: src.filename || 'เอกสารอ้างอิง.pdf',
    page: src.page || src.page_number || undefined,
    similarity: src.similarity_score ? parseFloat(src.similarity_score) : undefined,
  }))
}

function mapMessage(raw: any): Message {
  return {
    id: raw.id,
    conversationId: raw.conversation_id,
    role: raw.role,
    content: raw.content,
    sources: mapSources(raw.sources),
    createdAt: raw.created_at,
  }
}

export async function sendChatMessage(
  message: string,
  conversationId: number | null
): Promise<Message> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chat/message`,
      { message, conversation_id: conversationId },
      { headers: getAuthHeader() }
    )
    return mapMessage(response.data)
  } catch (error) {
    console.error('Error calling backend chat API:', error)
    return {
      id: Date.now(),
      conversationId: conversationId ?? 0,
      role: 'assistant',
      content: 'ขออภัย ระบบขัดข้องชั่วคราว ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง',
      sources: [],
      createdAt: new Date().toISOString(),
    }
  }
}

export async function fetchConversations(): Promise<Conversation[]> {
  if (!getStoredAuth()) return []
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/conversations`, {
      headers: getAuthHeader(),
    })
    return (response.data || []).map((c: any) => ({
      id: c.id,
      userId: c.user_id,
      title: c.title,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return []
  }
}

export async function fetchConversationMessages(id: number): Promise<Message[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/chat/conversations/${id}`, {
      headers: getAuthHeader(),
    })
    return (response.data.messages || []).map(mapMessage)
  } catch (error) {
    console.error('Error fetching conversation detail:', error)
    return []
  }
}

export async function deleteConversationRemote(id: number): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/chat/conversations/${id}`, {
      headers: getAuthHeader(),
    })
  } catch (error) {
    console.error('Error deleting conversation:', error)
  }
}

export async function submitMessageFeedback(
  messageId: number,
  rating: 'like' | 'dislike'
): Promise<void> {
  try {
    await axios.post(
      `${API_BASE_URL}/chat/feedback/${messageId}`,
      { rating },
      { headers: getAuthHeader() }
    )
  } catch (error) {
    console.error('Error submitting feedback:', error)
  }
}

export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}
