import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Tag, X } from 'lucide-react'
import type { Announcement } from '@/types'
import { resolveAnnouncementImageUrl } from '@/services/announcementService'
import { formatThaiDate } from '@/utils/date'

interface AnnouncementModalProps {
  item: Announcement | null
  categoryName: string
  onClose: () => void
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g

/** แปลง URL แบบข้อความล้วนในเนื้อหาประกาศให้เป็นลิงก์ที่กดได้ (ตัดวรรคตอนท้าย เช่น . , ) ออกจากลิงก์) */
function renderContentWithLinks(text: string) {
  return text.split(URL_REGEX).map((part, i) => {
    if (i % 2 !== 1) return part
    const trailingMatch = part.match(/[.,;:!?)\]}'"]+$/)
    const trailing = trailingMatch ? trailingMatch[0] : ''
    const url = trailing ? part.slice(0, -trailing.length) : part
    return (
      <span key={i}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0B4DBA] underline decoration-[#0B4DBA]/40 hover:decoration-[#0B4DBA] break-all"
        >
          {url}
        </a>
        {trailing}
      </span>
    )
  })
}

/**
 * AnnouncementModal — แจ้งเตือน/ป็อปอัปแสดงรายละเอียดประกาศเต็ม โดยไม่ต้องเปลี่ยนหน้า
 */
export default function AnnouncementModal({ item, categoryName, onClose }: AnnouncementModalProps) {
  const imageUrl = item ? resolveAnnouncementImageUrl(item.attachmentUrl) : undefined

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.55)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col"
            style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.3)', maxHeight: '85vh' }}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors"
              aria-label="ปิด"
            >
              <X size={18} />
            </button>

            <div className="overflow-y-auto">
              {imageUrl && (
                <div className="w-full" style={{ maxHeight: 280, overflow: 'hidden' }}>
                  <img src={imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-6 sm:p-7">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full bg-[#E5EDFF] text-[#0B4DBA]">
                    <Tag size={11} />
                    {categoryName}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
                    <CalendarDays size={13} />
                    {formatThaiDate(item.eventDate || item.publishedAt)}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#111827] leading-snug mb-4">
                  {item.title}
                </h2>

                <div
                  className="rounded-2xl p-5 sm:p-6"
                  style={{
                    background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #0B4DBA',
                  }}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8] mb-2.5">
                    รายละเอียด
                  </p>
                  <div className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                    {renderContentWithLinks(item.content)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
