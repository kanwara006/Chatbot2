import { useState, useCallback, useRef } from 'react'
import type { Message, Conversation } from '@/types'
import {
  simulateAIResponse,
  getStoredConversations,
  saveConversation,
  deleteConversation,
  generateId,
} from '@/services/chatService'

/**
 * useChat — Custom hook สำหรับจัดการ State ของ Chat ทั้งหมด
 *
 * Input:  ไม่มี parameter
 * Process:
 *   - เก็บ state ของ conversations, messages, loading
 *   - sendMessage() → ส่งคำถาม → จำลอง AI response → อัปเดต state
 * Output: ค่า state และฟังก์ชันต่าง ๆ ที่ component ใช้งาน
 */
export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(
    () => getStoredConversations()
  )
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // เลื่อน scroll ลงล่างสุดอัตโนมัติ
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  // สร้าง Conversation ใหม่
  const createNewConversation = useCallback(() => {
    setActiveConversationId(null)
    setMessages([])
  }, [])

  // เปิด Conversation เก่า
  const openConversation = useCallback(
    (convId: number) => {
      setActiveConversationId(convId)
      // Phase 8: โหลด messages จาก API
      // ตอนนี้ใช้ mock messages เดิมหรือว่างเปล่า
      setMessages([])
    },
    []
  )

  // ลบ Conversation
  const removeConversation = useCallback(
    (convId: number) => {
      deleteConversation(convId)
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (activeConversationId === convId) {
        setActiveConversationId(null)
        setMessages([])
      }
    },
    [activeConversationId]
  )

  // ส่งข้อความ — จุดหลักของ Chat Flow
  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return

      // ── 1. เพิ่มข้อความของ User ─────────────────────────────────
      const userMsg: Message = {
        id:             generateId(),
        conversationId: activeConversationId ?? 0,
        role:           'user',
        content:        question,
        createdAt:      new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      scrollToBottom()

      try {
        // ── 2. ส่งคำถามไป AI (mock) / Phase 8: ส่งไป Backend จริง ──
        const { answer, sources } = await simulateAIResponse(question)

        // ── 3. เพิ่มข้อความของ AI ──────────────────────────────────
        const aiMsg: Message = {
          id:             generateId(),
          conversationId: activeConversationId ?? 0,
          role:           'assistant',
          content:        answer,
          sources:        sources,
          createdAt:      new Date().toISOString(),
        }
        setMessages((prev) => [...prev, aiMsg])

        // ── 4. สร้าง/อัปเดต Conversation ────────────────────────────
        let convId = activeConversationId
        if (!convId) {
          convId = generateId()
          const title = question.length > 30 ? question.slice(0, 30) + '...' : question
          const newConv: Conversation = {
            id:        convId,
            userId:    1,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          saveConversation(newConv)
          setConversations((prev) => [newConv, ...prev])
          setActiveConversationId(convId)
        } else {
          // อัปเดต updatedAt ของ conversation ที่มีอยู่
          setConversations((prev) =>
            prev.map((c) =>
              c.id === convId ? { ...c, updatedAt: new Date().toISOString() } : c
            )
          )
        }
      } catch {
        // ── Error: แสดงข้อความเป็นมิตร ──────────────────────────────
        const errMsg: Message = {
          id:             generateId(),
          conversationId: activeConversationId ?? 0,
          role:           'assistant',
          content:        'ขออภัย ระบบไม่สามารถประมวลผลคำถามได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง',
          createdAt:      new Date().toISOString(),
        }
        setMessages((prev) => [...prev, errMsg])
      } finally {
        setIsLoading(false)
        scrollToBottom()
      }
    },
    [activeConversationId, isLoading, scrollToBottom]
  )

  // Toggle like/dislike feedback (Phase 8: ส่งไป API)
  const submitFeedback = useCallback(
    (_messageId: number, _rating: 'like' | 'dislike') => {
      // Phase 8: axios.post('/api/chat/feedback', { messageId, rating })
      // ตอนนี้แค่ log
      console.log('Feedback submitted:', _messageId, _rating)
    },
    []
  )

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    sidebarOpen,
    messagesEndRef,
    setSidebarOpen,
    createNewConversation,
    openConversation,
    removeConversation,
    sendMessage,
    submitFeedback,
  }
}
