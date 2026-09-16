import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

interface AdminPageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  /** ไอคอน + สีธีมประจำหน้า (ใส่แล้วจะแสดงเป็นชิปไล่สีหน้าหัวข้อ) */
  icon?: LucideIcon
  color?: string
}

/**
 * AdminPageHeader — หัวข้อหน้ามาตรฐานสำหรับทุกหน้า Admin (ชื่อ + คำอธิบาย + ปุ่ม action)
 */
export default function AdminPageHeader({ title, subtitle, action, icon: Icon, color = '#1E5AA8' }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${color}, ${color}CC)`, boxShadow: `0 6px 14px ${color}40` }}
          >
            <Icon size={17} className="text-white" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-semibold text-[#0B2E5E] tracking-tight">{title}</h1>
          {subtitle && <p className="text-[13px] text-[#64748B] mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
