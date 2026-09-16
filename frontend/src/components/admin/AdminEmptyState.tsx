import type { LucideIcon } from 'lucide-react'

interface AdminEmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
}

export default function AdminEmptyState({ icon: Icon, title, subtitle }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{ width: 56, height: 56, background: '#EFF6FF' }}
      >
        <Icon size={24} className="text-[#94A3B8]" />
      </div>
      <p className="text-[13px] font-medium text-[#64748B]">{title}</p>
      {subtitle && <p className="text-[13px] text-[#94A3B8] max-w-xs">{subtitle}</p>}
    </div>
  )
}
