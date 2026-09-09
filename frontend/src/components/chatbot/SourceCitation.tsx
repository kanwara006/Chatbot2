import { useState, useMemo } from 'react'
import { FileText, ChevronDown } from 'lucide-react'
import type { MessageSource } from '@/types'

interface SourceCitationProps {
  sources: MessageSource[]
}

interface DeduplicatedSource {
  filename: string
  pages: string[]
}

/**
 * SourceCitation — Accordion แสดงแหล่งอ้างอิงจากฐานความรู้ (ชื่อไฟล์และเลขหน้า ไม่ซ้ำกัน)
 */
export default function SourceCitation({ sources }: SourceCitationProps) {
  const [isOpen, setIsOpen] = useState(false)

  // รวมและตัดไฟล์ที่ซ้ำกันออก พร้อมรวบรวมเลขหน้าทั้งหมดของไฟล์นั้น
  const uniqueSources = useMemo(() => {
    if (!sources || sources.length === 0) return []

    const map = new Map<string, Set<string>>()

    for (const src of sources) {
      const rawName = src.filename?.trim() || 'เอกสารอ้างอิง.pdf'
      // คัดเฉพาะชื่อไฟล์ตัด path ออกหากมี
      const filename = rawName.replace(/\\/g, '/').split('/').pop() || rawName

      if (!map.has(filename)) {
        map.set(filename, new Set<string>())
      }

      // ดึง page จาก page หรือ pageNumber
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
      // เรียงหมายเลขหน้าตามตัวเลข
      const pages = Array.from(pagesSet).sort((a, b) => {
        const numA = Number(a)
        const numB = Number(b)
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB
        return a.localeCompare(b, undefined, { numeric: true })
      })
      result.push({ filename, pages })
    })

    return result
  }, [sources])

  if (!uniqueSources || uniqueSources.length === 0) return null

  return (
    <div className="mt-4 pt-3 border-t border-[#EDF2F7]">
      {/* Accordion toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 font-medium">
          <FileText size={14} className="text-[#0B4DBA]" />
          <span>แหล่งอ้างอิงจากฐานความรู้ ({uniqueSources.length} ไฟล์)</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-[#94A3B8] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0B4DBA]' : ''
          }`}
        />
      </button>

      {/* Expanded list - แสดงเฉพาะชื่อไฟล์และหน้า */}
      {isOpen && (
        <div className="mt-2 space-y-1.5 animate-fade-in">
          {uniqueSources.map((source, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <FileText size={13} className="text-[#0B4DBA] shrink-0" />
                <span className="font-medium text-[#1E293B] truncate" title={source.filename}>
                  {source.filename}
                </span>
              </div>
              {source.pages.length > 0 ? (
                <span className="shrink-0 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#EBF3FF] text-[#0B4DBA] border border-[#BFDBFE]">
                  หน้า {source.pages.join(', ')}
                </span>
              ) : (
                <span className="shrink-0 px-2 py-0.5 rounded text-[11px] text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0]">
                  เอกสาร
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
