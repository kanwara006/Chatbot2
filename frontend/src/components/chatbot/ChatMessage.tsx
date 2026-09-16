import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import type { Message } from '@/types'
import SourceCitation from './SourceCitation'
import MessageActions from './MessageActions'
import Logo from '@/components/common/Logo'

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
      <motion.div
        className="flex flex-col items-end px-4 sm:px-6 py-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
          {/* User Bubble */}
          <div
            className="rounded-2xl px-5 py-3 text-sm leading-relaxed text-white"
            style={{
              background: 'linear-gradient(135deg, #0B4DBA, #1E5AA8)',
              borderRadius: '22px 6px 22px 22px',
              whiteSpace: 'pre-wrap',
              boxShadow: '0 2px 4px rgba(11,77,186,0.15), 0 10px 24px rgba(11,77,186,0.25)',
            }}
          >
            {message.content}
          </div>

          {/* User Avatar (on right) */}
          <div
            className="w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'linear-gradient(135deg, #062E66, #0B4DBA)' }}
            aria-label="User"
          >
            <User size={16} />
          </div>
        </div>

        {/* Timestamp */}
        <span className="text-[11px] text-[#94A3B8] mt-1 mr-11">
          {timeStr}
        </span>
      </motion.div>
    )
  }

  // ── AI Message ────────────────────────────────────────────────────
  return (
    <motion.div
      className="flex items-start gap-3 px-4 sm:px-6 py-3 max-w-[95%] sm:max-w-[85%]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* AI Avatar — โลโก้มาสคอตของแชทบอท */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 p-1"
        style={{ background: 'linear-gradient(135deg, #E5EDFF, #DBEAFE)', boxShadow: '0 2px 8px rgba(11,77,186,0.12)' }}
        aria-label="AI Assistant"
      >
        <Logo size={26} />
      </div>

      {/* Bubble Container */}
      <div className="flex-1 min-w-0">
        <div
          className="bg-white p-5 sm:p-6 border border-[#EDF2F7] text-sm leading-relaxed text-[#1E293B]"
          style={{
            borderRadius: '6px 22px 22px 22px',
            boxShadow: '0 1px 2px rgba(6,46,102,0.04), 0 10px 24px rgba(6,46,102,0.08), 0 1px 0 rgba(255,255,255,0.6) inset',
          }}
        >
          {/* Markdown Content */}
          <div className="prose prose-sm max-w-none text-[#1E293B]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0B4DBA] underline decoration-[#0B4DBA]/40 hover:decoration-[#0B4DBA] break-all"
                  >
                    {children}
                  </a>
                ),
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
    </motion.div>
  )
}
