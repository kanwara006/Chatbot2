import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Download, RotateCcw, Shield } from 'lucide-react'
import type { Message } from '@/types'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import WelcomeScreen from './WelcomeScreen'
import ChatInput from './ChatInput'
import toast from 'react-hot-toast'

interface ChatWindowProps {
  messages:     Message[]
  isLoading:    boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onSend:       (msg: string) => void
  onFeedback:   (id: number, rating: 'like' | 'dislike') => void
  onReset?:     () => void
}

/**
 * ChatWindow — หน้าต่างแชทหลัก พร้อม Header ตามแบบภาพตัวอย่าง
 */
export default function ChatWindow({
  messages,
  isLoading,
  messagesEndRef,
  onSend,
  onFeedback,
  onReset,
}: ChatWindowProps) {
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading, messagesEndRef])

  const handleDownloadAll = () => {
    if (messages.length === 0) {
      toast.error('ยังไม่มีข้อความสำหรับการดาวน์โหลด')
      return
    }
    const fullText = messages
      .map((m) => `[${m.role === 'user' ? 'นักศึกษา' : 'PSU SLF AI'}]:\n${m.content}\n`)
      .join('\n----------------------------------------\n\n')
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `psu-slf-chat-history.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('ดาวน์โหลดบทสนทนาเรียบร้อยแล้ว')
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* ── Chat Header (Matched with Reference Image) ─────────────── */}
      <header className="bg-white border-b border-[#E2E8F0] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 flex-shrink-0">
        {/* Left: Chatbot Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] flex-shrink-0">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[#062E66]">
                ระบบ AI Chatbot กยศ.
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0369A1]">
                RAG System
              </span>
            </div>
            <p className="text-xs text-[#5F6673]">
              มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี
            </p>
          </div>
        </div>

        {/* Right: Actions Buttons */}
        <div className="flex items-center gap-2">
          {/* Download Chat */}
          <button
            onClick={handleDownloadAll}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E293B] hover:bg-[#0F172A] text-white transition-colors cursor-pointer"
            title="ดาวน์โหลดประวัติแชททั้งหมด"
          >
            <Download size={13} />
            <span>ดาวน์โหลดแชท</span>
          </button>

          {/* Reset / New Chat */}
          <button
            onClick={onReset}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1E293B] hover:bg-[#0F172A] text-white transition-colors cursor-pointer"
            title="เริ่มการสนทนาใหม่"
          >
            <RotateCcw size={13} />
            <span>เริ่มใหม่</span>
          </button>

          {/* Officer / Admin Portal */}
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#062E66] hover:bg-[#0B4DBA] text-white transition-colors"
          >
            <Shield size={13} />
            <span>ส่วนเจ้าหน้าที่</span>
          </Link>
        </div>
      </header>

      {/* ── Message Area ─────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'thin' }}
        role="log"
        aria-label="บทสนทนา"
        aria-live="polite"
      >
        {messages.length === 0 && !isLoading ? (
          <WelcomeScreen onSelectQuestion={onSend} />
        ) : (
          <div className="py-5 space-y-3 max-w-4xl mx-auto">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onFeedback={onFeedback}
              />
            ))}

            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Chat Input ───────────────────────────────────────────── */}
      <div className="flex-shrink-0">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  )
}
