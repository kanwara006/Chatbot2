import { useState, useCallback } from 'react'
import { Copy, ThumbsUp, ThumbsDown, Download, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface MessageActionsProps {
  messageId:       number
  content:         string
  timestamp?:      string
  onFeedback:      (id: number, rating: 'like' | 'dislike') => void
}

/**
 * MessageActions — Action bar ใต้ข้อความ AI ตามแบบในรูปตัวอย่าง
 */
export default function MessageActions({
  messageId,
  content,
  timestamp,
  onFeedback,
}: MessageActionsProps) {
  const [copied,   setCopied]   = useState(false)
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    toast.success('คัดลอกข้อความแล้ว')
    setTimeout(() => setCopied(false), 2000)
  }, [content])

  const handleFeedback = useCallback(
    (rating: 'like' | 'dislike') => {
      setFeedback(rating)
      onFeedback(messageId, rating)
      toast.success(rating === 'like' ? 'ขอบคุณสำหรับ Feedback 👍' : 'ขอบคุณ เราจะปรับปรุงต่อไป')
    },
    [messageId, onFeedback]
  )

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `psu-slf-answer-${messageId}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('ดาวน์โหลดคำตอบแล้ว')
  }, [content, messageId])

  return (
    <div className="flex items-center justify-between text-xs text-[#94A3B8] mt-2 px-1">
      {/* Timestamp on left */}
      <span className="text-[11px] text-[#94A3B8]">
        {timestamp || '5 ส.ค. 2569 20:46'}
      </span>

      {/* Action buttons on right */}
      <div className="flex items-center gap-3">
        {/* Copy */}
        <button
          id={`msg-copy-${messageId}`}
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#475569] transition-colors"
          title="คัดลอกข้อความ"
        >
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
        </button>

        {/* Download */}
        <button
          id={`msg-download-${messageId}`}
          onClick={handleDownload}
          className="flex items-center gap-1 text-[11px] text-[#94A3B8] hover:text-[#475569] transition-colors"
          title="ดาวน์โหลดคำตอบ"
        >
          <Download size={12} />
          <span>ดาวน์โหลด</span>
        </button>

        {/* Separator */}
        <span className="text-[#CBD5E1]">|</span>

        {/* Like */}
        <button
          id={`msg-like-${messageId}`}
          onClick={() => handleFeedback('like')}
          disabled={feedback !== null}
          className={`p-1 rounded transition-colors ${
            feedback === 'like'
              ? 'text-green-600'
              : 'text-[#94A3B8] hover:text-green-600 disabled:opacity-50'
          }`}
          title="คำตอบนี้มีประโยชน์"
        >
          <ThumbsUp size={13} />
        </button>

        {/* Dislike */}
        <button
          id={`msg-dislike-${messageId}`}
          onClick={() => handleFeedback('dislike')}
          disabled={feedback !== null}
          className={`p-1 rounded transition-colors ${
            feedback === 'dislike'
              ? 'text-red-500'
              : 'text-[#94A3B8] hover:text-red-500 disabled:opacity-50'
          }`}
          title="คำตอบนี้ไม่ถูกต้อง"
        >
          <ThumbsDown size={13} />
        </button>
      </div>
    </div>
  )
}
