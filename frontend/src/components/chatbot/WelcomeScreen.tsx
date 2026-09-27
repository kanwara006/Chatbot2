import { motion } from 'framer-motion'
import { ArrowUpRight, RotateCcw, FileText, HeartHandshake, CalendarDays, Sparkles } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface WelcomeScreenProps {
  onSelectQuestion: (q: string) => void
}

// ── Suggested Questions ─────────────────────────────────────────────
const suggestedQuestions = [
  { id: 'sq-1', text: 'ผู้กู้รายเก่าต้องดำเนินการอย่างไร?', icon: RotateCcw, color: '#0B4DBA', bg: '#E5EDFF' },
  { id: 'sq-2', text: 'สมัครกู้ กยศ. ต้องใช้เอกสารอะไรบ้าง?', icon: FileText, color: '#7C3AED', bg: '#F3E8FF' },
  { id: 'sq-3', text: 'ต้องทำจิตอาสากี่ชั่วโมง?', icon: HeartHandshake, color: '#059669', bg: '#D1FAE5' },
  { id: 'sq-4', text: 'กำหนดการกู้ยืมปี 2569 มีวันไหนบ้าง?', icon: CalendarDays, color: '#D97706', bg: '#FEF3C7' },
]

/**
 * WelcomeScreen — หน้าต้อนรับเมื่อยังไม่มีการสนทนา
 *
 * Input:  onSelectQuestion — callback เมื่อกดคำถามแนะนำ
 * Output: Welcome screen พร้อม Suggested Questions
 */
export default function WelcomeScreen({ onSelectQuestion }: WelcomeScreenProps) {
  const { user } = useAuth()

  return (
    <div className="relative flex flex-col items-center justify-center h-full px-6 py-12 text-center overflow-hidden">
      {/* Decorative soft background glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 420, height: 420, top: '-10%', background: 'radial-gradient(circle, rgba(11,77,186,0.06) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Welcome Badge */}
      <motion.span
        className="relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full mb-5 text-xs font-bold tracking-wide"
        style={{
          background: 'linear-gradient(135deg, #E5EDFF, #DBEAFE)',
          color: '#1E5AA8',
          border: '1px solid rgba(11,77,186,0.14)',
        }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Sparkles size={13} />
        ยินดีต้อนรับสู่ PSU SLF AI
      </motion.span>

      {/* Greeting */}
      <motion.h1
        className="relative text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#062E66] via-[#0B4DBA] to-[#2563EB] bg-clip-text text-transparent mb-3 filter drop-shadow-[0_2px_8px_rgba(11,77,186,0.12)]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {user ? `สวัสดี, ${user.firstName}` : 'สวัสดี'}
      </motion.h1>

      <motion.p
        className="relative text-base sm:text-lg font-semibold text-[#1E5AA8] mb-2.5 max-w-lg"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        มีอะไรเกี่ยวกับ กยศ. มหาวิทยาลัยสงขลานครินทร์ ที่อยากสอบถาม?
      </motion.p>

      <motion.p
        className="relative text-sm text-[#64748B] max-w-sm leading-relaxed mb-8"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        AI สามารถช่วยค้นหาข้อมูลเกี่ยวกับการกู้ยืม เอกสาร กำหนดการ
        และขั้นตอนต่าง ๆ จากเอกสารของมหาวิทยาลัย
      </motion.p>

      {/* Suggested Questions */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {suggestedQuestions.map((q, i) => {
          const Icon = q.icon
          return (
            <motion.button
              key={q.id}
              id={q.id}
              onClick={() => onSelectQuestion(q.text)}
              className="group relative flex items-center gap-3 text-left px-4 py-3 rounded-2xl border bg-white overflow-hidden transition-all duration-300"
              style={{
                borderColor: '#E2E8F0',
                boxShadow:   '0 1px 2px rgba(6,46,102,0.03), 0 6px 16px rgba(6,46,102,0.05)',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.22 + i * 0.07 }}
              whileHover={{ y: -3 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = q.color
                e.currentTarget.style.boxShadow    = `0 4px 8px ${q.color}14, 0 16px 32px ${q.color}29`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.boxShadow    = '0 1px 2px rgba(6,46,102,0.03), 0 6px 16px rgba(6,46,102,0.05)'
              }}
            >
              {/* Icon */}
              <span
                className="flex items-center justify-center rounded-xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ width: 34, height: 34, background: q.bg }}
              >
                <Icon size={16} style={{ color: q.color }} />
              </span>

              {/* Question text */}
              <span className="flex-1 text-xs text-[#14213D] transition-colors leading-snug font-medium">
                {q.text}
              </span>

              {/* Hover arrow */}
              <ArrowUpRight
                size={15}
                className="flex-shrink-0 text-[#CBD5E1] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                style={{ color: q.color }}
              />
            </motion.button>
          )
        })}
      </div>

      {/* Disclaimer — บังคับบรรทัดเดียวเมื่อพื้นที่พอแน่ๆ (นับรวม sidebar 280px ที่แย่งพื้นที่ chat panel ไปแล้ว)
          ปล่อยตัดคำตามธรรมชาติเฉพาะจอแคบที่ไม่พอจริง เพื่อไม่ให้ล้นขอบจอแนวนอน */}
      <p className="relative mt-8 text-[11px] lg:text-xs text-[#94A3B8] leading-relaxed whitespace-normal lg:whitespace-nowrap max-w-full">
        AI จะตอบเฉพาะข้อมูลจากเอกสาร กยศ. ของมหาวิทยาลัย หากไม่พบข้อมูลจะแนะนำให้ติดต่อเจ้าหน้าที่
      </p>
    </div>
  )
}
