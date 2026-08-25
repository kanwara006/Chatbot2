/**
 * TypingIndicator — แสดง animation ขณะ AI กำลังตอบ
 *
 * Output: 3 จุดกระพริบ พร้อมข้อความ "AI กำลังตรวจสอบข้อมูล..."
 */
export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      {/* AI Avatar */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
        style={{ width: 32, height: 32, background: '#1E5AA8', marginTop: 2 }}
        aria-hidden="true"
      >
        AI
      </div>

      {/* Bubble */}
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3"
        style={{
          background:    '#fff',
          border:        '1px solid #E2E8F0',
          boxShadow:     '0 1px 4px rgba(0,0,0,0.05)',
          borderRadius:  '4px 18px 18px 18px',
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
                background:      '#94A3B8',
                animation:       `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-[#94A3B8]">
          AI กำลังตรวจสอบข้อมูลจากเอกสาร กยศ.
        </span>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
