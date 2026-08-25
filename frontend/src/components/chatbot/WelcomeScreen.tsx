import { Send } from 'lucide-react'

interface WelcomeScreenProps {
  onSelectQuestion: (q: string) => void
}

// ── Suggested Questions ─────────────────────────────────────────────
const suggestedQuestions = [
  { id: 'sq-1', text: 'ผู้กู้รายเก่าต้องดำเนินการอย่างไร?',          icon: '📋' },
  { id: 'sq-2', text: 'สมัครกู้ กยศ. ต้องใช้เอกสารอะไรบ้าง?',        icon: '📄' },
  { id: 'sq-3', text: 'ต้องทำจิตอาสากี่ชั่วโมง?',                     icon: '🤝' },
  { id: 'sq-4', text: 'กำหนดการกู้ยืมปี 2569 มีวันไหนบ้าง?',          icon: '📅' },
]

/**
 * WelcomeScreen — หน้าต้อนรับเมื่อยังไม่มีการสนทนา
 *
 * Input:  onSelectQuestion — callback เมื่อกดคำถามแนะนำ
 * Output: Welcome screen พร้อม Suggested Questions
 */
export default function WelcomeScreen({ onSelectQuestion }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      {/* Logo / Icon */}
      <div
        className="flex items-center justify-center rounded-2xl mb-6"
        style={{
          width:      72,
          height:     72,
          background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)',
          boxShadow:  '0 8px 24px rgba(30,90,168,0.20)',
        }}
        aria-hidden="true"
      >
        <span className="text-white text-2xl font-bold" style={{ fontFamily: 'IBM Plex Sans Thai, sans-serif' }}>
          AI
        </span>
      </div>

      {/* Greeting */}
      <h1 className="text-2xl font-bold text-[#14213D] mb-2">
        สวัสดี 👋
      </h1>
      <p className="text-base font-semibold text-[#1E5AA8] mb-2">
        มีอะไรเกี่ยวกับ กยศ. ที่อยากสอบถาม?
      </p>
      <p className="text-sm text-[#64748B] max-w-sm leading-relaxed mb-8">
        AI สามารถช่วยค้นหาข้อมูลเกี่ยวกับการกู้ยืม เอกสาร กำหนดการ
        และขั้นตอนต่าง ๆ จากเอกสารของมหาวิทยาลัย
      </p>

      {/* Suggested Questions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
        {suggestedQuestions.map((q) => (
          <button
            key={q.id}
            id={q.id}
            onClick={() => onSelectQuestion(q.text)}
            className="group flex items-start gap-3 text-left p-4 rounded-xl border transition-all duration-200"
            style={{
              background:   '#fff',
              border:       '1.5px solid #E2E8F0',
              boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor  = '#1E5AA8'
              e.currentTarget.style.background   = '#EFF6FF'
              e.currentTarget.style.boxShadow    = '0 4px 12px rgba(30,90,168,0.10)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor  = '#E2E8F0'
              e.currentTarget.style.background   = '#fff'
              e.currentTarget.style.boxShadow    = '0 1px 4px rgba(0,0,0,0.04)'
            }}
          >
            <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden="true">{q.icon}</span>
            <span className="text-sm text-[#14213D] group-hover:text-[#1E5AA8] transition-colors leading-snug font-medium">
              {q.text}
            </span>
            <Send
              size={13}
              className="flex-shrink-0 mt-1 text-[#CBD5E1] group-hover:text-[#1E5AA8] transition-colors ml-auto"
            />
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-[#94A3B8] max-w-sm leading-relaxed">
        AI จะตอบเฉพาะข้อมูลจากเอกสาร กยศ. ของมหาวิทยาลัย
        หากไม่พบข้อมูลจะแนะนำให้ติดต่อเจ้าหน้าที่
      </p>
    </div>
  )
}
