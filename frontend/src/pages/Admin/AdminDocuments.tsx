import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Trash2, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Document, DocumentStatus } from '@/types'

// ── Mock Documents ──────────────────────────────────────────────────
const initDocs: Document[] = [
  { id: 1, filename: 'slf-process-2569.pdf', originalName: 'ขั้นตอนการดำเนินการกู้ยืม ปี 2569.pdf',         fileType: 'pdf', fileSize: 1240000, status: 'ready',   uploadedBy: 1, createdAt: '2026-08-10' },
  { id: 2, filename: 'slf-announce-1-2569.pdf', originalName: 'ประกาศ กยศ. ภาคเรียนที่ 1/2569.pdf',       fileType: 'pdf', fileSize: 890000,  status: 'ready',   uploadedBy: 1, createdAt: '2026-08-08' },
  { id: 3, filename: 'slf-volunteer-2569.pdf', originalName: 'ระเบียบกิจกรรมจิตอาสา กยศ. 2569.pdf',     fileType: 'pdf', fileSize: 540000,  status: 'ready',   uploadedBy: 1, createdAt: '2026-08-05' },
  { id: 4, filename: 'slf-docs-list.pdf', originalName: 'รายการเอกสารการกู้ยืม กยศ. 2569.pdf',           fileType: 'pdf', fileSize: 320000,  status: 'ready',   uploadedBy: 1, createdAt: '2026-08-03' },
  { id: 5, filename: 'slf-calendar.pdf', originalName: 'ปฏิทินกำหนดการ กยศ. ปีการศึกษา 2569.pdf',        fileType: 'pdf', fileSize: 450000,  status: 'ready',   uploadedBy: 1, createdAt: '2026-08-01' },
  { id: 6, filename: 'psu-slf-handbook.pdf', originalName: 'คู่มือนักศึกษา กยศ. มหาวิทยาลัยสงขลานครินทร์.pdf', fileType: 'pdf', fileSize: 2100000, status: 'processing', uploadedBy: 1, createdAt: '2026-08-19' },
]

function formatSize(bytes: number) {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  return `${(bytes / 1e3).toFixed(0)} KB`
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const map: Record<DocumentStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
    ready:      { label: 'พร้อมใช้งาน', color: '#059669', bg: '#ECFDF5',  icon: CheckCircle },
    processing: { label: 'กำลังประมวลผล', color: '#D97706', bg: '#FFFBEB', icon: Loader },
    pending:    { label: 'รอดำเนินการ', color: '#64748B', bg: '#F1F5F9',  icon: FileText },
    error:      { label: 'เกิดข้อผิดพลาด', color: '#EF4444', bg: '#FEF2F2', icon: AlertCircle },
  }
  const s = map[status]
  const Icon = s.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
      style={{ background: s.bg, color: s.color }}
    >
      <Icon size={11} className={status === 'processing' ? 'animate-spin' : ''} />
      {s.label}
    </span>
  )
}

/**
 * AdminDocuments — Knowledge Base Management
 *
 * Input:  ไฟล์ PDF/DOCX/TXT จาก drag-and-drop หรือ click-to-upload
 * Process: อัปโหลด → จำลอง processing (Phase 10 ทำจริง) → แสดงสถานะ
 * Output: รายการเอกสารใน Knowledge Base พร้อมสถานะ
 */
export default function AdminDocuments() {
  const [docs, setDocs]         = useState<Document[]>(initDocs)
  const [dragging, setDragging] = useState(false)
  const fileInputRef             = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      // Validate type
      const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|docx|txt)$/i)) {
        toast.error(`ไฟล์ ${file.name} ไม่รองรับ — ใช้ได้เฉพาะ PDF, DOCX, TXT`)
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`ไฟล์ ${file.name} ใหญ่เกิน 10MB`)
        return
      }

      const ext = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'txt'
      const newDoc: Document = {
        id:           Date.now(),
        filename:     file.name.toLowerCase().replace(/\s+/g, '-'),
        originalName: file.name,
        fileType:     ext,
        fileSize:     file.size,
        status:       'processing',
        uploadedBy:   1,
        createdAt:    new Date().toISOString().split('T')[0],
      }
      setDocs((prev) => [newDoc, ...prev])
      toast.success(`อัปโหลด "${file.name}" สำเร็จ — กำลังประมวลผล...`)

      // จำลอง processing → ready (Phase 10 จะทำผ่าน WebSocket)
      setTimeout(() => {
        setDocs((prev) =>
          prev.map((d) => d.id === newDoc.id ? { ...d, status: 'ready' } : d)
        )
        toast.success(`"${file.name}" พร้อมใช้งานใน Knowledge Base แล้ว ✅`)
      }, 4000)
    })
  }

  const deleteDoc = (id: number) => {
    setDocs((prev) => prev.filter((d) => d.id !== id))
    toast.success('ลบเอกสารแล้ว')
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2E5E]">Knowledge Base</h1>
          <p className="text-sm text-[#64748B] mt-1">
            จัดการเอกสารที่ AI ใช้ตอบคำถาม — รองรับ PDF, DOCX, TXT (สูงสุด 10MB)
          </p>
        </div>
        <div
          className="text-right text-xs text-[#64748B] bg-white rounded-xl px-4 py-3"
          style={{ border: '1px solid #E2E8F0' }}
        >
          <p className="font-semibold text-[#14213D]">{docs.filter(d => d.status === 'ready').length} / {docs.length}</p>
          <p>เอกสารพร้อมใช้</p>
        </div>
      </div>

      {/* ── Drop Zone ─────────────────────────────────────────────── */}
      <div
        id="document-upload-zone"
        className="rounded-2xl p-10 text-center mb-6 transition-all duration-200 cursor-pointer"
        style={{
          border:     `2px dashed ${dragging ? '#1E5AA8' : '#CBD5E1'}`,
          background:  dragging ? '#EFF6FF' : '#fff',
        }}
        onDragOver={(e)  => { e.preventDefault(); setDragging(true)  }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e)      => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div
          className="inline-flex items-center justify-center rounded-2xl mb-4"
          style={{ width: 56, height: 56, background: dragging ? '#DBEAFE' : '#F7F9FC' }}
        >
          <Upload size={24} style={{ color: dragging ? '#1E5AA8' : '#94A3B8' }} />
        </div>
        <p className="font-semibold text-[#14213D] text-sm mb-1">
          {dragging ? 'วางไฟล์ที่นี่...' : 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
        </p>
        <p className="text-xs text-[#94A3B8]">PDF, DOCX, TXT — สูงสุด 10MB ต่อไฟล์</p>
        <input
          ref={fileInputRef}
          id="document-file-input"
          type="file"
          multiple
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* ── RAG Pipeline Info ─────────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center text-xs"
        style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
      >
        <p className="font-semibold text-[#0B2E5E]">⚙️ Pipeline หลังอัปโหลด:</p>
        {['Extract Text', 'Clean Text', 'Chunking', 'Embedding', 'Vector Store', 'พร้อมใช้งาน'].map((step, i, arr) => (
          <span key={step} className="flex items-center gap-2">
            <span className="text-[#1E5AA8] font-medium">{step}</span>
            {i < arr.length - 1 && <span className="text-[#94A3B8]">→</span>}
          </span>
        ))}
      </div>

      {/* ── Document Table ────────────────────────────────────────── */}
      <div className="card overflow-hidden" style={{ borderRadius: '16px' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <h2 className="font-bold text-[#14213D] text-sm">รายการเอกสาร ({docs.length})</h2>
        </div>

        {docs.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={36} className="text-[#CBD5E1] mx-auto mb-2" />
            <p className="text-[#64748B] text-sm">ยังไม่มีเอกสาร — อัปโหลดเอกสารแรกของคุณ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F7F9FC', borderBottom: '1px solid #E2E8F0' }}>
                  {['ชื่อเอกสาร', 'ประเภท', 'ขนาด', 'สถานะ', 'วันที่อัปโหลด', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase" style={{ letterSpacing: '0.04em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, idx) => (
                  <tr
                    key={doc.id}
                    style={{
                      borderBottom: idx < docs.length - 1 ? '1px solid #F1F5F9' : 'none',
                      background:   'white',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F7F9FC' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'white' }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex items-center justify-center rounded-lg flex-shrink-0"
                          style={{ width: 32, height: 32, background: '#EFF6FF' }}
                        >
                          <FileText size={15} className="text-[#1E5AA8]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#14213D] text-xs leading-snug max-w-xs truncate">
                            {doc.originalName}
                          </p>
                          <p className="text-[#94A3B8] text-[10px] mt-0.5">{doc.filename}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge badge-navy uppercase">{doc.fileType}</span>
                    </td>
                    <td className="px-5 py-4 text-[#64748B] text-xs">{formatSize(doc.fileSize)}</td>
                    <td className="px-5 py-4"><StatusBadge status={doc.status} /></td>
                    <td className="px-5 py-4 text-[#64748B] text-xs whitespace-nowrap">{doc.createdAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E5AA8] hover:bg-[#EFF6FF] transition-all"
                          title="ดูเอกสาร"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => deleteDoc(doc.id)}
                          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-all"
                          title="ลบเอกสาร"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
