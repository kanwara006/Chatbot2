import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, ShieldCheck } from 'lucide-react'
import Logo from '@/components/common/Logo'

interface AdminAuthSplitLayoutProps {
  headline: ReactNode
  description: string
  children: ReactNode
}

/**
 * AdminAuthSplitLayout — โครงหน้า Login/Register ของแอดมิน
 * ใช้โครงสร้างการ์ดลอยทับแบบเดียวกับฝั่งผู้ใช้ (AuthSplitLayout) แต่จงใจให้โทนสี
 * ต่างกันชัดเจน (ม่วง/อินดิโก้เข้ม + ขาว แทนที่จะเป็นน้ำเงิน+ขาวแบบผู้ใช้) พร้อมป้าย
 * "ADMIN CONSOLE" เพื่อไม่ให้สับสนว่ากำลังอยู่หน้าเจ้าหน้าที่หรือหน้านักศึกษา
 */
export default function AdminAuthSplitLayout({ headline, description, children }: AdminAuthSplitLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{ background: '#F5F3FB' }}
    >
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-stretch" style={{ minHeight: 'min(560px, 80vh)' }}>
        {/* ── Left Panel: Brand (ม่วง/อินดิโก้เข้ม — เอกลักษณ์เฉพาะของแอดมิน) ── */}
        <motion.div
          className="hidden md:flex flex-col justify-between w-full md:w-[46%] rounded-[28px] p-10 lg:p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #312E81 0%, #5B21B6 100%)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* Subtle decorative circle, kept quiet to match the reference's calm mood */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 260, height: 260, top: -90, right: -90, background: 'rgba(196,181,253,0.1)' }}
            aria-hidden="true"
          />

          {/* Badge + Logo */}
          <div className="relative z-10 space-y-3">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider"
              style={{ background: 'rgba(196,181,253,0.16)', color: '#DDD6FE', border: '1px solid rgba(196,181,253,0.3)' }}
            >
              <KeyRound size={11} className="flex-shrink-0" />
              ADMIN CONSOLE
            </div>
            <div className="flex items-center gap-2.5">
              <Logo size={36} />
              <p className="text-sm font-bold text-white">PSU SLF AI</p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10 my-8 md:my-0">
            <h1 className="text-[26px] lg:text-[30px] font-extrabold text-white leading-tight">{headline}</h1>
            <p className="text-white/65 text-sm mt-3 max-w-sm leading-relaxed">{description}</p>
          </div>

          {/* Simple icon mark instead of an illustration */}
          <div className="relative z-10 flex items-center gap-2 text-[#DDD6FE]/80 text-xs">
            <ShieldCheck size={16} className="flex-shrink-0" />
            <span>สำหรับเจ้าหน้าที่ที่ได้รับสิทธิ์เท่านั้น</span>
          </div>
        </motion.div>

        {/* ── Right Panel: Form Card (floats, overlapping the left panel) ── */}
        <motion.div
          className="relative w-full md:w-[58%] md:-ml-10 bg-white rounded-[24px] z-10 flex items-center overflow-hidden"
          style={{ boxShadow: '0 24px 60px rgba(76,29,149,0.14)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
        >
          <div style={{ height: 3, background: 'linear-gradient(90deg, #312E81, #8B5CF6)', position: 'absolute', top: 0, left: 0, right: 0 }} />
          <div className="w-full p-8 sm:p-10">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
