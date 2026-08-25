import { Link } from 'react-router-dom'
import { Send, BookOpen, Clock, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import heroBackground from '@/assets/images/LC.jpg'

/**
 * HeroSection — Responsive hero banner with PSU campus backdrop
 */
export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '520px' }}
      aria-label="Hero Banner"
    >
      {/* ── Background Image ──────────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี"
          className="w-full h-full object-cover object-[center_30%]"
        />
      </div>

      {/* ── Gradient Overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(105deg, rgba(6,46,102,0.90) 0%, rgba(6,46,102,0.68) 42%, rgba(6,46,102,0.25) 75%, rgba(6,46,102,0.05) 100%)',
        }}
      />

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="container-main relative z-10 flex items-center" style={{ minHeight: '520px' }}>
        <div className="max-w-2xl py-16 md:py-20">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(59,130,246,0.25)', color: '#93C5FD', backdropFilter: 'blur(8px)', border: '1px solid rgba(147,197,253,0.30)' }}
            >
              <span className="w-2 h-2 rounded-full bg-[#60A5FA] animate-pulse" />
              ระบบ AI ตอบคำถามอัตโนมัติ 24 ชั่วโมง
            </span>
          </motion.div>

          {/* English Title */}
          <motion.h1
            className="text-white font-bold leading-tight mb-3"
            style={{ fontSize: 'clamp(28px, 4.5vw, 46px)', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            AI Chatbot for <span style={{ color: '#93C5FD' }}>Student Loan Fund</span>
          </motion.h1>

          {/* Thai Subtitle */}
          <motion.p
            className="text-white/90 text-base sm:text-lg leading-relaxed mb-2 font-medium"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            ผู้ช่วยอัจฉริยะสำหรับตอบคำถามกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)
          </motion.p>

          <motion.p
            className="text-white/65 text-xs sm:text-sm mb-8 leading-relaxed max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี — ค้นหาข้อมูลคุณสมบัติ เอกสาร กำหนดการ และขั้นตอนการกู้ยืมจากเอกสารจริงได้ทันที
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-3.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <Link
              to="/chat"
              id="hero-cta-button"
              className="btn-primary flex items-center gap-2"
              style={{
                fontSize: '15px',
                padding: '12px 28px',
                background: '#0B4DBA',
                boxShadow: '0 4px 20px rgba(11,77,186,0.45)',
              }}
            >
              <Send size={15} />
              เริ่มถามคำถามเลย
            </Link>

            <Link
              to="/faq"
              className="btn-outline-white flex items-center gap-2"
            >
              <BookOpen size={15} />
              คำถามที่พบบ่อย
            </Link>
          </motion.div>

          {/* Feature Highlights Row */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-10 pt-6 max-w-md"
            style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, delay: 0.55 }}
          >
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#93C5FD] flex-shrink-0" />
              <span className="text-white/80 text-xs font-medium">บริการ 24 ชม.</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-[#93C5FD] flex-shrink-0" />
              <span className="text-white/80 text-xs font-medium">เอกสารจริง ม.อ.</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#93C5FD] flex-shrink-0" />
              <span className="text-white/80 text-xs font-medium">ตอบตรงจุด</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
