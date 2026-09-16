import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, CheckCircle, AlertCircle, Loader, Pencil, Trash2, Database, Clock, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import type { Document, DocumentStatus } from '@/types'
import { fetchDocuments, deleteDocument } from '@/services/documentService'
import { fetchCategories, type Category } from '@/services/categoryService'
import { extractErrorMessage } from '@/services/authService'
import { formatThaiDate } from '@/utils/date'
import { getCategoryColor } from '@/utils/categoryIcons'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog'

function formatSize(bytes: number) {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  return `${(bytes / 1e3).toFixed(0)} KB`
}

function StatusBadge({ status, isWhiteRow }: { status: DocumentStatus; isWhiteRow: boolean }) {
  const map: Record<DocumentStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
    ready:      { label: 'พร้อมใช้งาน', color: '#1E5AA8', bg: isWhiteRow ? '#EFF6FF' : '#FFFFFF', border: '#BFDBFE', icon: CheckCircle },
    processing: { label: 'กำลังประมวลผล', color: '#D97706', bg: '#FFFBEB', border: 'transparent', icon: Loader },
    pending:    { label: 'รอดำเนินการ', color: '#64748B', bg: '#F1F5F9',  border: 'transparent', icon: FileText },
    error:      { label: 'เกิดข้อผิดพลาด', color: '#EF4444', bg: '#FEF2F2', border: 'transparent', icon: AlertCircle },
  }
  const s = map[status]
  const Icon = s.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[13px] font-medium"
      style={{ background: s.bg, color: s.color, border: `1.5px solid ${s.border}` }}
    >
      <Icon size={11} className={status === 'processing' ? 'animate-spin' : ''} />
      {s.label}
    </span>
  )
}

/**
 * AdminDocuments — จัดการเอกสาร/ฐานความรู้ (ตาม design-reference: document_management.png)
 */
export default function AdminDocuments() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState<Document[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'pdf' | 'docx' | 'txt'>('all')
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadDocs = useCallback(async () => {
    try {
      const [items, cats] = await Promise.all([fetchDocuments(), fetchCategories()])
      setDocs(items)
      setCategories(cats)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'โหลดรายการเอกสารไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDocs()
  }, [loadDocs])

  useEffect(() => {
    if (!docs.some((d) => d.status === 'processing')) return
    const timer = setInterval(loadDocs, 3000)
    return () => clearInterval(timer)
  }, [docs, loadDocs])

  const categoryName = (id?: number) => categories.find((c) => c.id === id)?.name || '-'

  const filtered = docs.filter((d) => {
    const matchSearch = !search || d.originalName.includes(search)
    const matchCategory = categoryFilter === 'all' || d.categoryId === categoryFilter
    const matchFileType = fileTypeFilter === 'all' || d.fileType === fileTypeFilter
    return matchSearch && matchCategory && matchFileType
  })
  const lastUpdated = docs[0]?.updatedAt

  const deleteDoc = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteDocument(deleteTarget.id)
      setDocs((prev) => prev.filter((d) => d.id !== deleteTarget.id))
      toast.success('ลบเอกสารแล้ว')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'ลบเอกสารไม่สำเร็จ'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <AdminPageHeader
        title="จัดการเอกสารและฐานข้อมูล"
        subtitle="จัดการเอกสารสำหรับใช้ในการตอบคำถามของระบบแชทบอท"
        icon={Database}
        color="#0B2E5E"
        action={
          <button
            onClick={() => navigate('/admin/documents/new')}
            className="flex items-center gap-2 text-white font-semibold rounded-xl transition-shadow hover:shadow-lg"
            style={{ fontSize: '13px', padding: '10px 18px', background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)', boxShadow: '0 8px 20px rgba(11,46,94,0.3)' }}
          >
            <Plus size={15} /> เพิ่มเอกสารใหม่
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AdminStatCard icon={FileText} label="เอกสารทั้งหมด" value={`${docs.length} ไฟล์`} color="#1E5AA8" delay={0} variant="vivid" />
        <AdminStatCard icon={CheckCircle} label="พร้อมใช้งาน" value={`${docs.filter((d) => d.status === 'ready').length} ไฟล์`} color="#0E7490" delay={0.05} variant="vivid" />
        <AdminStatCard icon={Clock} label="อัปเดตล่าสุด" value={lastUpdated ? formatThaiDate(lastUpdated) : '-'} color="#4F46E5" delay={0.1} variant="vivid" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาเอกสาร..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] transition-shadow focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
            style={{ border: '1.5px solid #E2E8F0', background: '#fff' }}
          />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="pl-4 pr-8 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white appearance-none cursor-pointer"
            style={{ border: '1.5px solid #E2E8F0', minWidth: 160 }}
          >
            <option value="all">ทุกหมวดหมู่</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value as 'all' | 'pdf' | 'docx' | 'txt')}
            className="pl-4 pr-8 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white appearance-none cursor-pointer"
            style={{ border: '1.5px solid #E2E8F0', minWidth: 150 }}
          >
            <option value="all">ทุกประเภทไฟล์</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="txt">TXT</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <AdminLoadingState />
      ) : (
      <div className="admin-card overflow-hidden">
        {filtered.length === 0 ? (
          <AdminEmptyState icon={FileText} title="ยังไม่มีเอกสาร" subtitle="อัปโหลดเอกสารแรกของคุณเพื่อเริ่มสร้างฐานความรู้" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: '#1E5AA8' }}>
                  {['ชื่อเอกสาร', 'หมวดหมู่', 'ขนาด', 'สถานะ', 'วันที่อัปโหลด', 'จัดการ'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-[13px] font-semibold text-white uppercase" style={{ letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc, idx) => (
                  <motion.tr
                    key={doc.id}
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                    className={`transition-all hover:-translate-y-0.5 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F2F5F9]'}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: idx * 0.03 }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}>
                          <FileText size={16} className="text-[#0B2E5E]" />
                        </div>
                        <p className="font-medium text-[#14213D] text-[13px] leading-snug max-w-xs truncate">{doc.originalName}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="badge text-[10px]"
                        style={{
                          background: `${getCategoryColor(doc.categoryId)}14`,
                          color: getCategoryColor(doc.categoryId),
                          border: `1px solid ${getCategoryColor(doc.categoryId)}33`,
                        }}
                      >
                        {categoryName(doc.categoryId)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#334155] text-[13px]">{formatSize(doc.fileSize)}</td>
                    <td className="px-5 py-4"><StatusBadge status={doc.status} isWhiteRow={idx % 2 === 0} /></td>
                    <td className="px-5 py-4 text-[#475569] text-[13px] whitespace-nowrap">{formatThaiDate(doc.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/admin/documents/${doc.id}/edit`)}
                          className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all" title="แก้ไขเอกสาร">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteTarget(doc)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all" title="ลบเอกสาร">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="ยืนยันการลบเอกสาร"
        message={deleteTarget ? `ต้องการลบเอกสาร "${deleteTarget.originalName}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้` : ''}
        loading={deleting}
        onConfirm={deleteDoc}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
