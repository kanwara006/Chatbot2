import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import Logo from '@/components/common/Logo'

interface AuthSplitLayoutProps {
  headline: ReactNode
  description: string
  children: ReactNode
}

/**
 * AuthSplitLayout — โครงหน้า Login/Register ของผู้ใช้ (นักศึกษา)
 * โครงสร้างเดียวกับ AdminAuthSplitLayout: พื้นหลังสว่าง เรียบ,
 * พาเนลซ้ายเป็นบล็อกสีน้ำเงินเข้มมีโลโก้/หัวข้อ, การ์ดฟอร์มสีขาวลอยทับเหลื่อมด้านขวา
 */
export default function AuthSplitLayout({ headline, description, children }: AuthSplitLayoutProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{ background: '#EEF2FA' }}
    >
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-stretch" style={{ minHeight: 'min(600px, 84vh)' }}>
        {/* ── Left Panel: Brand ─────────────────────────────────────── */}
        <motion.div
          className="hidden md:flex flex-col justify-between w-full md:w-[46%] rounded-[28px] p-10 lg:p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(160deg, #0B2E5E 0%, #123C74 100%)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 260, height: 260, top: -90, right: -90, background: 'rgba(255,255,255,0.05)' }}
            aria-hidden="true"
          />

          {/* Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3 group" aria-label="กลับสู่หน้าหลัก">
              <Logo size={40} />
              <div>
                <p className="text-sm font-bold text-white tracking-tight leading-tight">มหาวิทยาลัยสงขลานครินทร์</p>
                <p className="text-xs text-white/70">วิทยาเขตสุราษฎร์ธานี</p>
              </div>
            </Link>
          </div>

          {/* Headline */}
          <div className="relative z-10 my-8 md:my-0">
            <h1 className="text-[26px] lg:text-[30px] font-extrabold text-white leading-tight">{headline}</h1>
            <p className="text-white/65 text-sm mt-3 max-w-sm leading-relaxed">{description}</p>
          </div>

          {/* Security badge */}
          <div className="relative z-10 flex items-center gap-2 text-white/50 text-xs">
            <ShieldCheck size={16} className="flex-shrink-0" />
            <span>ระบบมีความปลอดภัยระดับสูงตามมาตรฐานสากล</span>
          </div>
        </motion.div>

        {/* ── Right Panel: Form Card (floats, overlapping the left panel) ── */}
        <motion.div
          className="relative w-full md:w-[58%] md:-ml-10 bg-white rounded-[24px] z-10 flex items-center"
          style={{ boxShadow: '0 24px 60px rgba(15,23,42,0.12)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
        >
          <div className="w-full p-8 sm:p-10">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
