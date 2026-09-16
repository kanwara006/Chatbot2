import { useState, useCallback, useRef, useEffect } from 'react'
import type { Message, Conversation } from '@/types'
import {
  sendChatMessage,
  fetchConversations,
  fetchConversationMessages,
  deleteConversationRemote,
  submitMessageFeedback,
  generateId,
} from '@/services/chatService'
import { useAuth } from '@/context/AuthContext'

/**
 * useChat — Custom hook สำหรับจัดการ State ของ Chat ทั้งหมด
 *
 * ผู้ใช้ที่เข้าสู่ระบบ: ประวัติการสนทนาโหลด/บันทึกผ่าน backend จริง
 * ผู้ใช้ที่ไม่ได้เข้าสู่ระบบ: ไม่มีการบันทึกประวัติใด ๆ (เก็บแค่ใน state ของหน้านี้)
 */
export function useChat() {
  const { isAuthenticated } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // โหลดประวัติการสนทนาจาก backend เฉพาะผู้ใช้ที่เข้าสู่ระบบเท่านั้น
  useEffect(() => {
    setActiveConversationId(null)
    setMessages([])
    if (isAuthenticated) {
      fetchConversations().then(setConversations)
    } else {
      setConversations([])
    }
  }, [isAuthenticated])

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  const createNewConversation = useCallback(() => {
    setActiveConversationId(null)
    setMessages([])
  }, [])

  const openConversation = useCallback(
    async (convId: number) => {
      setActiveConversationId(convId)
      const msgs = await fetchConversationMessages(convId)
      setMessages(msgs)
      scrollToBottom()
    },
    [scrollToBottom]
  )

  const removeConversation = useCallback(
    async (convId: number) => {
      await deleteConversationRemote(convId)
      setConversations((prev) => prev.filter((c) => c.id !== convId))
      if (activeConversationId === convId) {
        setActiveConversationId(null)
        setMessages([])
      }
    },
    [activeConversationId]
  )

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || isLoading) return

      const userMsg: Message = {
        id: generateId(),
        conversationId: activeConversationId ?? 0,
        role: 'user',
        content: question,
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)
      scrollToBottom()

      const aiMsg = await sendChatMessage(question, activeConversationId)
      setMessages((prev) => [...prev, aiMsg])

      // มีแค่ผู้ใช้ที่เข้าสู่ระบบเท่านั้นที่มีประวัติการสนทนาให้อัปเดตในแถบข้าง
      if (isAuthenticated) {
        if (!activeConversationId) {
          const convId = aiMsg.conversationId
          const title = question.length > 30 ? question.slice(0, 30) + '...' : question
          const newConv: Conversation = {
            id: convId,
            userId: 0,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          setConversations((prev) => [newConv, ...prev])
          setActiveConversationId(convId)
        } else {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId ? { ...c, updatedAt: new Date().toISOString() } : c
            )
          )
        }
      }

      setIsLoading(false)
      scrollToBottom()
    },
    [activeConversationId, isLoading, isAuthenticated, scrollToBottom]
  )

  const submitFeedback = useCallback((messageId: number, rating: 'like' | 'dislike') => {
    submitMessageFeedback(messageId, rating)
  }, [])

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
