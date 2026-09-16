import {
  GraduationCap, Landmark, Banknote, FileText, Wrench,
  HelpCircle, Calendar, AlertTriangle, HandHeart, Phone, Folder,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const CATEGORY_ICON_OPTIONS: { key: string; icon: LucideIcon }[] = [
  { key: 'graduation-cap', icon: GraduationCap },
  { key: 'landmark', icon: Landmark },
  { key: 'banknote', icon: Banknote },
  { key: 'file-text', icon: FileText },
  { key: 'wrench', icon: Wrench },
  { key: 'help-circle', icon: HelpCircle },
  { key: 'calendar', icon: Calendar },
  { key: 'alert-triangle', icon: AlertTriangle },
  { key: 'hand-heart', icon: HandHeart },
  { key: 'phone', icon: Phone },
]

const ICON_MAP: Record<string, LucideIcon> = Object.fromEntries(
  CATEGORY_ICON_OPTIONS.map((o) => [o.key, o.icon])
)

export function getCategoryIcon(key: string): LucideIcon {
  return ICON_MAP[key] || Folder
}

/** สีประจำหมวดหมู่ (วนตามลำดับ) ใช้แต่งสี badge/ไอคอนหมวดหมู่ให้มีสีสันหลากหลาย แทนสีเดียวซ้ำทุกแถว */
export const CATEGORY_PALETTE = ['#1E5AA8', '#059669', '#7C3AED', '#D97706', '#DB2777', '#0891B2', '#DC2626', '#4F46E5']

export function getCategoryColor(id?: number | null): string {
  if (id == null) return '#94A3B8'
  return CATEGORY_PALETTE[id % CATEGORY_PALETTE.length]
}
