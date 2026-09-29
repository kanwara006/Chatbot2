import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { KeyRound, ShieldCheck } from 'lucide-react'
import Logo from '@/components/common/Logo'
import heroBackground from '@/assets/images/LC.jpg'

interface AdminAuthSplitLayoutProps {
  headline: ReactNode
  description: string
  children: ReactNode
}

/**
 * AdminAuthSplitLayout — โครงหน้า Login/Register ของแอดมิน
 * ใช้โครงสร้างเดียวกับฝั่งผู้ใช้ (AuthSplitLayout): พื้นหลังเต็มจอเป็นภาพวิทยาเขตจริง
 * ทับด้วยหมอกสีขาวฟุ้งๆ ตัวกล่องแบ่ง 2 ฝั่งเป็นกระจกฝ้าลอยตรงกลาง แต่จงใจให้โทนสี
 * ฝั่งซ้ายต่างกันชัดเจน (ม่วง/อินดิโก้เข้ม แทนที่จะเป็นน้ำเงินแบบผู้ใช้) พร้อมป้าย
 * "ADMIN CONSOLE" เพื่อไม่ให้สับสนว่ากำลังอยู่หน้าเจ้าหน้าที่หรือหน้านักศึกษา
 * (บนมือถือไม่แสดงโลโก้/แบรนด์ใดๆ เหลือแค่การ์ดฟอร์มเปล่าๆ)
 */
export default function AdminAuthSplitLayout({ headline, description, children }: AdminAuthSplitLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4 sm:p-8">
      {/* ── พื้นหลังเต็มจอ: ภาพวิทยาเขตจริง ── */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-[center_30%]"
        />
      </div>
      {/* หมอกสีขาวฟุ้งๆ ทับภาพ */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.85) 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 460, height: 460, top: '-12%', left: '-8%', background: 'rgba(196,181,253,0.25)', filter: 'blur(70px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 420, height: 420, bottom: '-12%', right: '-8%', background: 'rgba(196,181,253,0.2)', filter: 'blur(70px)' }}
        aria-hidden="true"
      />

      {/* ── กล่องหลัก แบ่ง 2 ฝั่ง ── */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-stretch md:min-h-[min(560px,80vh)]">
        {/* ── ฝั่งซ้าย: แบรนด์/ข้อความต้อนรับ (กระจกฝ้าม่วงเข้ม — เอกลักษณ์เฉพาะของแอดมิน) ── */}
        <motion.div
          className="hidden md:flex flex-col justify-between w-full md:w-[44%] p-10 lg:p-12 relative overflow-hidden"
          style={{
            borderRadius: '22px 0 0 22px',
            background: 'rgba(49,29,110,0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRight: 'none',
            boxShadow: '0 30px 60px rgba(49,29,110,0.35)',
          }}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
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

          <div className="relative z-10 flex items-center gap-2 text-[#DDD6FE]/80 text-xs">
            <ShieldCheck size={16} className="flex-shrink-0" />
            <span>สำหรับเจ้าหน้าที่ที่ได้รับสิทธิ์เท่านั้น</span>
          </div>
        </motion.div>

        {/* ── ฝั่งขวา: ฟอร์ม (กระจกฝ้าสีขาว) ── */}
        <motion.div
          className="relative w-full md:w-[56%] flex items-center overflow-hidden rounded-[22px] md:rounded-l-none"
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(15,23,42,0.06)',
            boxShadow: '0 35px 80px rgba(49,29,110,0.28), 0 2px 0 rgba(255,255,255,0.8) inset',
          }}
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
