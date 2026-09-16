import { Loader2 } from 'lucide-react'

export default function AdminLoadingState({ label = 'กำลังโหลดข้อมูล...' }: { label?: string }) {
  return (
    <div className="admin-card flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 size={28} className="animate-spin text-[#1E5AA8]" />
      <p className="text-sm text-[#94A3B8]">{label}</p>
    </div>
  )
}
