import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

/** ปรับความสว่างของสี hex — percent บวกทำให้สว่างขึ้น (เข้าใกล้ขาว), ลบทำให้เข้มขึ้น (เข้าใกล้ดำ) */
function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const clamp = (v: number) => Math.max(0, Math.min(255, v))
  const r = clamp((num >> 16) + amt)
  const g = clamp(((num >> 8) & 0x00ff) + amt)
  const b = clamp((num & 0x0000ff) + amt)
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`
}

interface AdminStatCardProps {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  subColor?: string
  color?: string
  delay?: number
  /** @deprecated ทุกการ์ดใช้ดีไซน์เดียวกันแล้ว (พื้นสีเต็มไล่เฉด ทางการ) ไม่ต้องระบุก็ได้ */
  variant?: 'default' | 'vivid'
}

/**
 * AdminStatCard — การ์ดสรุปสถิติมาตรฐานที่ใช้ร่วมกันทุกหน้า Admin
 * ดีไซน์: พื้นหลังไล่เฉดสีเต็มตามธีม ดูโดดเด่นมีสีสัน แต่เรียบร้อยเป็นทางการ (ไม่มีเอฟเฟกต์เด้ง/ฉูดฉาด)
 */
export default function AdminStatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = '#1E5AA8',
  delay = 0,
}: AdminStatCardProps) {
  return (
    <motion.div
      className="p-3 rounded-xl relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${shade(color, 16)} 0%, ${color} 55%, ${shade(color, -24)} 100%)`,
        boxShadow: `0 6px 16px ${color}30, 0 1px 0 rgba(255,255,255,0.12) inset`,
      }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {/* Soft decorative accents — subtle depth, not distracting */}
      <div className="absolute -right-4 -top-5 w-16 h-16 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.07)' }} aria-hidden="true" />
      <div className="absolute -right-2 -bottom-6 w-12 h-12 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.05)' }} aria-hidden="true" />

      <div className="relative flex items-start justify-between mb-2">
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0"
          style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.2)' }}
        >
          <Icon size={14} className="text-white" />
        </div>
        {sub && (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-white"
            style={{ background: 'rgba(255,255,255,0.22)' }}
          >
            {sub}
          </span>
        )}
      </div>
      <p className="relative text-lg font-bold tracking-tight text-white">{value}</p>
      <p className="relative text-xs font-medium mt-0.5 text-white/80">{label}</p>
    </motion.div>
  )
}
