import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Megaphone, ChevronDown, BookOpen } from 'lucide-react'
import type { MessageSource } from '@/types'

interface SourceCitationProps {
  sources: MessageSource[]
}

interface DeduplicatedSource {
  filename: string
  pages: string[]
  isAnnouncement: boolean
}

const ANNOUNCEMENT_PREFIX = 'ประกาศ: '

/**
 * SourceCitation — แสดงแหล่งอ้างอิงจากฐานความรู้ (ไฟล์เอกสารหรือประกาศ) แบบการ์ดสวยงาม
 */
export default function SourceCitation({ sources }: SourceCitationProps) {
  const [isOpen, setIsOpen] = useState(false)

  // รวมและตัดไฟล์ที่ซ้ำกันออก พร้อมรวบรวมเลขหน้าทั้งหมดของไฟล์นั้น
  const uniqueSources = useMemo(() => {
    if (!sources || sources.length === 0) return []

    const map = new Map<string, Set<string>>()

    for (const src of sources) {
      const rawName = src.filename?.trim() || 'เอกสารอ้างอิง.pdf'
      // คัดเฉพาะชื่อไฟล์ตัด path ออกหากมี (ไม่ตัด prefix "ประกาศ: ")
      const isAnn = rawName.startsWith(ANNOUNCEMENT_PREFIX)
      const filename = isAnn ? rawName : (rawName.replace(/\\/g, '/').split('/').pop() || rawName)

      if (!map.has(filename)) {
        map.set(filename, new Set<string>())
      }

      const rawPage = src.page ?? src.pageNumber
      if (rawPage !== undefined && rawPage !== null && String(rawPage).trim() !== '') {
        const pageParts = String(rawPage)
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean)
        for (const p of pageParts) {
          map.get(filename)!.add(p)
        }
      }
    }

    const result: DeduplicatedSource[] = []
    map.forEach((pagesSet, filename) => {
      const pages = Array.from(pagesSet).sort((a, b) => {
        const numA = Number(a)
        const numB = Number(b)
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB
        return a.localeCompare(b, undefined, { numeric: true })
      })
      result.push({ filename, pages, isAnnouncement: filename.startsWith(ANNOUNCEMENT_PREFIX) })
    })

    return result
  }, [sources])

  if (!uniqueSources || uniqueSources.length === 0) return null

  const renderCard = (source: DeduplicatedSource, idx: number) => {
    const displayName = source.isAnnouncement ? source.filename.slice(ANNOUNCEMENT_PREFIX.length) : source.filename
    const Icon = source.isAnnouncement ? Megaphone : FileText
    const accent = source.isAnnouncement ? '#0891B2' : '#0B4DBA'

    return (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: idx * 0.04 }}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0]"
      >
        <div
          className="flex items-center justify-center rounded-md flex-shrink-0"
          style={{ width: 20, height: 20, background: `linear-gradient(135deg, ${accent}1A, ${accent}33)` }}
        >
          <Icon size={11} style={{ color: accent }} />
        </div>
        <span
          className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-semibold"
          style={{ background: `${accent}14`, color: accent }}
        >
          {source.isAnnouncement ? 'ข่าวสาร' : 'เอกสาร'}
        </span>
        <p className="min-w-0 flex-1 text-[11px] text-[#475569] truncate" title={displayName}>
          {displayName}
        </p>
        {source.pages.length > 0 && (
          <span
            className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold"
            style={{ background: `${accent}14`, color: accent }}
          >
            หน้า {source.pages.join(', ')}
          </span>
        )}
      </motion.div>
    )
  }

  // Dropdown เดียวกันเสมอ ไม่ว่าจะมี 1 หรือหลายแหล่ง — ยุบไว้เป็นค่าเริ่มต้นเสมอ
  // กันไม่ให้ชื่อไฟล์ยาวๆ ล้นออกนอกกล่องคำตอบ
  return (
    <div className="mt-2.5 pt-2 border-t border-[#EDF2F7]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5 font-medium min-w-0">
          <BookOpen size={12} className="text-[#0B4DBA] flex-shrink-0" />
          <span className="truncate">
            {uniqueSources.length > 1
              ? `อ้างอิงจากฐานความรู้ (${uniqueSources.length} แหล่ง)`
              : `อ้างอิงจาก${uniqueSources[0].isAnnouncement ? 'ข่าวสาร' : 'เอกสาร'}`}
          </span>
        </div>
        <ChevronDown
          size={12}
          className={`flex-shrink-0 text-[#94A3B8] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0B4DBA]' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 space-y-1 min-w-0">
              {uniqueSources.map((source, idx) => renderCard(source, idx))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
