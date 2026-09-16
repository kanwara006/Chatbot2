import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles } from 'lucide-react'

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
    <div
      className="p-4 sm:p-5 bg-white relative"
      style={{ boxShadow: '0 -8px 24px rgba(6,46,102,0.04)' }}
    >
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E2E8F0 20%, #E2E8F0 80%, transparent)' }}
        aria-hidden="true"
      />
      <div className="max-w-4xl mx-auto flex items-end gap-3">
        {/* Pill input container (Matched with PSU SLF AI - Chatbot Interface.png) */}
        <div className="flex-1 flex items-center gap-2 bg-[#F1F5F9] rounded-[26px] pl-5 pr-2.5 py-2.5 border border-[#E2E8F0] shadow-sm focus-within:border-[#1E5AA8] focus-within:bg-white focus-within:shadow-[0_6px_20px_rgba(11,77,186,0.12)] transition-all">
          <Sparkles size={16} className="flex-shrink-0 text-[#93C5FD]" aria-hidden="true" />
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์คำถามเกี่ยวกับ กยศ. ม.สงขลานครินทร์..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none bg-transparent text-sm text-[#1E293B] placeholder-[#94A3B8] outline-none leading-relaxed py-1 disabled:opacity-50"
            style={{ maxHeight: '100px', outline: 'none' }}
            aria-label="พิมพ์คำถาม"
          />
        </div>

        {/* Send Button */}
        <button
          id="chat-send-button"
          onClick={handleSubmit}
          disabled={!canSend}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white transition-all duration-150 ${
            canSend
              ? 'cursor-pointer hover:scale-105 active:scale-95'
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: 'linear-gradient(135deg, #062E66, #0B4DBA)',
            boxShadow: canSend ? '0 4px 14px rgba(11,77,186,0.4)' : 'none',
          }}
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
