import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend:    (message: string) => void
  isLoading: boolean
}

/**
 * ChatInput — ช่องกรอกข้อความคำถามแชท ตามแบบภาพตัวอย่าง PSU SLF AI - Chatbot Interface.png
 */
export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef       = useRef<HTMLTextAreaElement>(null)

  // Auto resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [value])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const canSend = value.trim().length > 0 && !isLoading

  return (
    <div className="p-4 sm:p-5 bg-white border-t border-[#EDF2F7]">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        {/* Pill input container (Matched with PSU SLF AI - Chatbot Interface.png) */}
        <div className="flex-1 flex items-center bg-[#F1F5F9] rounded-full px-6 py-3 border border-[#E2E8F0] focus-within:border-[#38BDF8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#38BDF8]/20 transition-all">
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์คำถามเกี่ยวกับ กยศ. ม.สงขลานครินทร์..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none bg-transparent text-xs sm:text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none leading-relaxed disabled:opacity-50"
            style={{ maxHeight: '100px' }}
            aria-label="พิมพ์คำถาม"
          />
        </div>

        {/* Send Button (Sky Blue Circle Matched with Screenshot) */}
        <button
          id="chat-send-button"
          onClick={handleSubmit}
          disabled={!canSend}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
            canSend
              ? 'bg-[#38BDF8] hover:bg-[#0EA5E9] text-white shadow-[0_2px_8px_rgba(56,189,248,0.35)] cursor-pointer hover:scale-105 active:scale-95'
              : 'bg-[#38BDF8] text-white opacity-60 cursor-not-allowed'
          }`}
          aria-label="ส่งข้อความ"
          title={canSend ? 'ส่งข้อความ (Enter)' : 'กรุณาพิมพ์คำถาม'}
        >
          {isLoading ? (
            <span className="block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <Send size={18} className="translate-x-0.5 -translate-y-0.5" />
          )}
        </button>
      </div>
    </div>
  )
}
