import { motion } from 'framer-motion'
import Logo from '@/components/common/Logo'

/**
 * TypingIndicator — แสดง animation ขณะ AI กำลังตอบ
 *
 * Output: 3 จุดกระพริบ พร้อมข้อความ "AI กำลังตรวจสอบข้อมูล..."
 */
export default function TypingIndicator() {
  return (
    <motion.div
      className="flex items-start gap-3 px-4 sm:px-6 py-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* AI Avatar */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-xl p-1"
        style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #E5EDFF, #DBEAFE)' }}
        aria-hidden="true"
      >
        <Logo size={22} />
      </div>

      {/* Bubble */}
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background:    '#fff',
          border:        '1px solid #EDF2F7',
          boxShadow:     '0 1px 2px rgba(6,46,102,0.04), 0 8px 20px rgba(6,46,102,0.08), 0 1px 0 rgba(255,255,255,0.6) inset',
          borderRadius:  '6px 18px 18px 18px',
        }}
        role="status"
        aria-label="AI กำลังประมวลผล"
      >
        {/* 3 Dot animation */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full"
              style={{
                width:           7,
                height:          7,
                background:      '#1E5AA8',
                animation:       `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-[#64748B]">
          AI กำลังตรวจสอบข้อมูลจากเอกสาร กยศ.
        </span>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </motion.div>
  )
}
