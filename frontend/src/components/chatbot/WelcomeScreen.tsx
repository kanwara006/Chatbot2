import { Send } from 'lucide-react'

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
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      {/* Greeting */}
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-[#062E66] via-[#0B4DBA] to-[#2563EB] bg-clip-text text-transparent mb-3 filter drop-shadow-[0_2px_8px_rgba(11,77,186,0.12)]">
        สวัสดี
      </h1>
      <p className="text-base sm:text-lg font-semibold text-[#1E5AA8] mb-2">
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
            className="group flex items-center justify-between text-left p-4 rounded-xl border transition-all duration-200"
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
            <span className="text-sm text-[#14213D] group-hover:text-[#1E5AA8] transition-colors leading-snug font-medium pr-2">
              {q.text}
            </span>
            <Send
              size={13}
              className="flex-shrink-0 text-[#CBD5E1] group-hover:text-[#1E5AA8] transition-colors ml-auto"
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
