import ReactMarkdown from 'react-markdown'
import { User, FileText } from 'lucide-react'
import type { Message } from '@/types'
import SourceCitation from './SourceCitation'
import MessageActions from './MessageActions'

interface ChatMessageProps {
  message:    Message
  onFeedback: (id: number, rating: 'like' | 'dislike') => void
}

/**
 * ChatMessage — แสดงข้อความ 1 ข้อความ (User หรือ AI) ตามแบบในภาพตัวอย่าง
 */
export default function ChatMessage({ message, onFeedback }: ChatMessageProps) {
  const isUser = message.role === 'user'

  // Format timestamp (or fallback to thai formatted string)
  const timeStr = message.createdAt
    ? new Date(message.createdAt).toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '5 ส.ค. 2569 20:46'

  // ── User Message ──────────────────────────────────────────────────
  if (isUser) {
    return (
      <div className="flex flex-col items-end px-4 sm:px-6 py-2 animate-fade-in">
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
          {/* User Bubble */}
          <div
            className="rounded-2xl px-5 py-3 text-sm leading-relaxed text-white shadow-sm"
            style={{
              background: '#0B4DBA',
              borderRadius: '20px 4px 20px 20px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.content}
          </div>

          {/* User Avatar (on right) */}
          <div
            className="w-8 h-8 rounded-full bg-[#062E66] text-white flex items-center justify-center flex-shrink-0 mt-0.5"
            aria-label="User"
          >
            <User size={16} />
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-[#94A3B8] mt-1 mr-11">
          {timeStr}
        </span>
      </div>
    )
  }

  // ── AI Message ────────────────────────────────────────────────────
  return (
    <div className="flex items-start gap-3 px-4 sm:px-6 py-3 animate-fade-in max-w-[95%] sm:max-w-[85%]">
      {/* AI Avatar (Purple/Indigo Rounded Box on left) */}
      <div
        className="w-8 h-8 rounded-xl bg-[#5850EC] text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm"
        aria-label="AI Assistant"
      >
        <FileText size={16} />
      </div>

      {/* Bubble Container */}
      <div className="flex-1 min-w-0">
        <div
          className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-[0_2px_10px_rgba(0,0,0,0.03)] text-sm leading-relaxed text-[#1E293B]"
          style={{ borderRadius: '4px 20px 20px 20px' }}
        >
          {/* Markdown Content */}
          <div className="prose prose-sm max-w-none text-[#1E293B]">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2 className="text-base font-bold text-[#062E66] mt-4 mb-2 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold text-[#0B4DBA] mt-3 mb-1.5">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="my-2 ml-4 space-y-1 list-disc list-outside text-[#1E293B]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-2 ml-4 space-y-1 list-decimal list-outside text-[#1E293B]">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-sm leading-relaxed">{children}</li>
                ),
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed text-[#1E293B] my-2 first:mt-0 last:mb-0">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-[#062E66]">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-2 pl-3 py-1 text-xs text-[#64748B] border-l-2 border-[#0B4DBA] bg-[#F8FAFC] rounded-r-lg">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Sources Citation Accordion inside the bubble */}
          {message.sources && message.sources.length > 0 && (
            <SourceCitation sources={message.sources} />
          )}
        </div>

        {/* Action bar and timestamp below bubble */}
        <MessageActions
          messageId={message.id}
          content={message.content}
          timestamp={timeStr}
          onFeedback={onFeedback}
        />
      </div>
    </div>
  )
}
