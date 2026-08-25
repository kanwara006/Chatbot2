import { useState } from 'react'
import { FileText, ChevronDown } from 'lucide-react'
import type { MessageSource } from '@/types'

interface SourceCitationProps {
  sources: MessageSource[]
}

/**
 * SourceCitation — Accordion แหล่งอ้างอิงจากฐานความรู้ ตามแบบในภาพตัวอย่าง
 */
export default function SourceCitation({ sources }: SourceCitationProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-4 pt-3 border-t border-[#EDF2F7]">
      {/* Accordion toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#475569] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 font-medium">
          <FileText size={14} className="text-[#0B4DBA]" />
          <span>แหล่งอ้างอิงจากฐานความรู้ ({sources.length} รายการ)</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-[#94A3B8] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0B4DBA]' : ''
          }`}
        />
      </button>

      {/* Expanded list */}
      {isOpen && (
        <div className="mt-2 space-y-1.5 pl-2 animate-fade-in">
          {sources.map((source, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]"
            >
              <div className="flex items-center gap-1.5 font-semibold text-[#0B4DBA] mb-1">
                <FileText size={12} />
                <span>{source.filename}</span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed line-clamp-3">
                {source.chunkContent}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
