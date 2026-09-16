import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface WelcomeScreenProps {
  onSelectQuestion: (q: string) => void
}

// ── Suggested Questions ─────────────────────────────────────────────
const suggestedQuestions = [
  { id: 'sq-1', text: 'ผู้กู้รายเก่าต้องดำเนินการอย่างไร?' },
  { id: 'sq-2', text: 'สมัครกู้ กยศ. ต้องใช้เอกสารอะไรบ้าง?' },
  { id: 'sq-3', text: 'ต้องทำจิตอาสากี่ชั่วโมง?' },
  { id: 'sq-4', text: 'กำหนดการกู้ยืมปี 2569 มีวันไหนบ้าง?' },
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

      {/* Greeting */}
      <h1 className="relative text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#062E66] via-[#0B4DBA] to-[#2563EB] bg-clip-text text-transparent mb-1.5 filter drop-shadow-[0_2px_8px_rgba(11,77,186,0.12)]">
        {user ? `สวัสดี, ${user.firstName}` : 'สวัสดี'}
      </h1>
      <p className="relative text-sm font-bold text-[#0B4DBA] tracking-wide mb-3">
        ยินดีต้อนรับสู่ PSU SLF AI
      </p>
      <p className="relative text-base sm:text-lg font-semibold text-[#1E5AA8] mb-2">
        มีอะไรเกี่ยวกับ กยศ. มหาวิทยาลัยสงขลานครินทร์ ที่อยากสอบถาม?
      </p>
      <p className="relative text-sm text-[#64748B] max-w-sm leading-relaxed mb-8">
        AI สามารถช่วยค้นหาข้อมูลเกี่ยวกับการกู้ยืม เอกสาร กำหนดการ
        และขั้นตอนต่าง ๆ จากเอกสารของมหาวิทยาลัย
      </p>

      {/* Suggested Questions */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {suggestedQuestions.map((q, i) => (
          <motion.button
            key={q.id}
            id={q.id}
            onClick={() => onSelectQuestion(q.text)}
            className="group flex items-center justify-between text-left p-5 rounded-2xl border transition-all duration-300"
            style={{
              background:   '#fff',
              border:       '1.5px solid #E2E8F0',
              boxShadow:    '0 1px 2px rgba(6,46,102,0.03), 0 6px 16px rgba(6,46,102,0.05)',
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
            whileHover={{ y: -3 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor  = '#1E5AA8'
              e.currentTarget.style.background   = '#EFF6FF'
              e.currentTarget.style.boxShadow    = '0 4px 8px rgba(30,90,168,0.08), 0 16px 32px rgba(30,90,168,0.16)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor  = '#E2E8F0'
              e.currentTarget.style.background   = '#fff'
              e.currentTarget.style.boxShadow    = '0 1px 2px rgba(6,46,102,0.03), 0 6px 16px rgba(6,46,102,0.05)'
            }}
          >
            <span className="text-sm text-[#14213D] group-hover:text-[#1E5AA8] transition-colors leading-snug font-medium pr-2">
              {q.text}
            </span>
            <span
              className="flex items-center justify-center rounded-full flex-shrink-0 ml-auto transition-colors"
              style={{ width: 26, height: 26, background: '#EFF6FF' }}
            >
              <Send size={12} className="text-[#94A3B8] group-hover:text-[#1E5AA8] transition-colors" />
            </span>
          </motion.button>
        ))}
      </div>

      {/* Disclaimer — บังคับบรรทัดเดียวเมื่อพื้นที่พอแน่ๆ (นับรวม sidebar 280px ที่แย่งพื้นที่ chat panel ไปแล้ว)
          ปล่อยตัดคำตามธรรมชาติเฉพาะจอแคบที่ไม่พอจริง เพื่อไม่ให้ล้นขอบจอแนวนอน */}
      <p className="relative mt-8 text-[11px] lg:text-xs text-[#94A3B8] leading-relaxed whitespace-normal lg:whitespace-nowrap max-w-full">
        AI จะตอบเฉพาะข้อมูลจากเอกสาร กยศ. ของมหาวิทยาลัย หากไม่พบข้อมูลจะแนะนำให้ติดต่อเจ้าหน้าที่
      </p>
    </div>
  )
}
