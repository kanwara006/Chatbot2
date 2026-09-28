import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import Logo from '@/components/common/Logo'
import heroBackground from '@/assets/images/LC.jpg'

interface AuthSplitLayoutProps {
  headline: ReactNode
  description: string
  children: ReactNode
  /** ซ่อนกล่องฝั่งซ้าย (แบรนด์/ข้อความต้อนรับ) แสดงเฉพาะฟอร์มกล่องเดียวกึ่งกลางจอ — ใช้กับหน้าลืมรหัสผ่าน */
  hideBrandPanel?: boolean
  /** ซ่อนแถบโลโก้+ชื่อมหาวิทยาลัยด้านบนกล่องด้วย (ทุกขนาดจอ) */
  hideTopBranding?: boolean
}

/**
 * AuthSplitLayout — โครงหน้า Login/Register/ลืมรหัสผ่าน ของผู้ใช้ (นักศึกษา)
 *
 * พื้นหลังเต็มจอเป็นภาพวิทยาเขตจริง ทับด้วยหมอกสีขาวฟุ้งๆ (แทนไล่สีน้ำเงินเข้มแบบเดิม)
 * ให้บรรยากาศสว่าง นวล ไม่ทึบ ตัวกล่องแบ่ง 2 ฝั่งเป็นกระจกฝ้าลอยตรงกลาง
 * (หรือกล่องเดียวกึ่งกลางถ้า hideBrandPanel)
 */
export default function AuthSplitLayout({ headline, description, children, hideBrandPanel = false, hideTopBranding = false }: AuthSplitLayoutProps) {
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
      {/* หมอกสีขาวฟุ้งๆ ทับภาพ แทนไล่สีน้ำเงินเข้มแบบเดิม */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.85) 100%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 460, height: 460, top: '-12%', left: '-8%', background: 'rgba(255,255,255,0.7)', filter: 'blur(70px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ width: 420, height: 420, bottom: '-12%', right: '-8%', background: 'rgba(255,255,255,0.65)', filter: 'blur(70px)' }}
        aria-hidden="true"
      />

      {/* ── Branding Header (แสดงตอนจอเล็กเสมอ หรือทุกขนาดจอถ้าซ่อนฝั่งซ้าย) ── */}
      {!hideTopBranding && (
        <motion.div
          className={`${hideBrandPanel ? 'flex' : 'md:hidden flex'} absolute top-6 left-0 right-0 items-center gap-2.5 justify-center z-10`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to="/" className="flex items-center gap-2.5" aria-label="กลับสู่หน้าหลัก">
            <Logo size={32} />
            <div className="leading-tight text-left">
              <p className="text-sm font-bold text-[#062E66]">มหาวิทยาลัยสงขลานครินทร์</p>
              <p className="text-[11px] text-[#5F6673]">วิทยาเขตสุราษฎร์ธานี</p>
            </div>
          </Link>
        </motion.div>
      )}

      {/* ── กล่องหลัก แบ่ง 2 ฝั่ง (หรือกล่องเดียวถ้า hideBrandPanel) ── */}
      <div
        className={`relative z-10 w-full flex flex-col md:flex-row items-stretch ${hideTopBranding ? '' : 'mt-16 md:mt-0'} ${
          hideBrandPanel ? 'max-w-[440px]' : 'max-w-4xl md:min-h-[min(600px,84vh)]'
        }`}
      >
        {/* ── ฝั่งซ้าย: แบรนด์/ข้อความต้อนรับ (กระจกฝ้าเข้ม) ── */}
        {!hideBrandPanel && (
          <motion.div
            className="hidden md:flex flex-col justify-between w-full md:w-[44%] p-10 lg:p-12 relative overflow-hidden"
            style={{
              borderRadius: '22px 0 0 22px',
              background: 'rgba(6,34,78,0.92)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRight: 'none',
              boxShadow: '0 30px 60px rgba(6,20,46,0.35)',
            }}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="relative z-10">
              <Link to="/" className="inline-flex items-center gap-3 group" aria-label="กลับสู่หน้าหลัก">
                <Logo size={40} />
                <div>
                  <p className="text-sm font-bold text-white tracking-tight leading-tight">มหาวิทยาลัยสงขลานครินทร์</p>
                  <p className="text-xs text-white/70">วิทยาเขตสุราษฎร์ธานี</p>
                </div>
              </Link>
            </div>

            <div className="relative z-10 my-8 md:my-0">
              <h1 className="text-[26px] lg:text-[30px] font-extrabold text-white leading-tight">{headline}</h1>
              <p className="text-white/70 text-sm mt-3 max-w-sm leading-relaxed">{description}</p>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-white/55 text-xs">
              <ShieldCheck size={16} className="flex-shrink-0" />
              <span>ระบบมีความปลอดภัยระดับสูงตามมาตรฐานสากล</span>
            </div>
          </motion.div>
        )}

        {/* ── ฝั่งขวา: ฟอร์ม (กระจกฝ้าสีขาว) ── */}
        <motion.div
          className={`relative w-full flex items-center overflow-hidden rounded-[22px] ${hideBrandPanel ? '' : 'md:w-[56%] md:rounded-l-none'}`}
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(15,23,42,0.06)',
            boxShadow: '0 35px 80px rgba(6,20,46,0.38), 0 2px 0 rgba(255,255,255,0.8) inset',
          }}
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
