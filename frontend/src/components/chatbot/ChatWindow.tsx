import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Download, RotateCcw, Shield } from 'lucide-react'
import type { Message } from '@/types'
import ChatMessage from './ChatMessage'
import TypingIndicator from './TypingIndicator'
import WelcomeScreen from './WelcomeScreen'
import ChatInput from './ChatInput'
import Logo from '@/components/common/Logo'
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
      <header
        className="bg-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 flex-shrink-0 relative"
        style={{ borderBottom: '1px solid #E2E8F0' }}
      >
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: 2, background: 'linear-gradient(90deg, #062E66, #0B4DBA, #38BDF8)' }}
          aria-hidden="true"
        />
        {/* Left: Chatbot Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 p-1.5"
            style={{ background: 'linear-gradient(135deg, #E5EDFF, #DBEAFE)', boxShadow: '0 2px 8px rgba(11,77,186,0.1)' }}
          >
            <Logo size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-[#062E66]">
                ระบบ AI Chatbot กยศ.
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#0B2E5E]">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#062E66] border border-[#DDE2EA] bg-white hover:bg-[#EFF6FF] hover:border-[#0B4DBA] transition-colors cursor-pointer"
            title="ดาวน์โหลดประวัติแชททั้งหมด"
          >
            <Download size={13} />
            <span>ดาวน์โหลดแชท</span>
          </button>

          {/* Reset / New Chat */}
          <button
            onClick={onReset}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#062E66] border border-[#DDE2EA] bg-white hover:bg-[#EFF6FF] hover:border-[#0B4DBA] transition-colors cursor-pointer"
            title="เริ่มการสนทนาใหม่"
          >
            <RotateCcw size={13} />
            <span>เริ่มใหม่</span>
          </button>

          {/* Officer / Admin Portal */}
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:brightness-110 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #062E66, #0B4DBA)', boxShadow: '0 2px 10px rgba(6,46,102,0.3)' }}
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
