import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, UploadCloud, Save, Database, FileText, FileCheck2, ToggleLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadDocument, updateDocument, fetchDocumentById } from '@/services/documentService'
import { fetchCategories, type Category } from '@/services/categoryService'
import { extractErrorMessage } from '@/services/authService'
import AdminLoadingState from '@/components/admin/AdminLoadingState'

const SECTION_COLORS = {
  info: '#1E5AA8',
  file: '#0E7490',
  status: '#4F46E5',
}

function formatSize(bytes: number) {
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)} MB`
  return `${(bytes / 1e3).toFixed(0)} KB`
}

/**
 * AdminDocumentForm — เพิ่ม/แก้ไขเอกสาร (ตาม design-reference: new_document.png)
 * หมายเหตุ: โหมดแก้ไขปรับได้เฉพาะข้อมูลเอกสาร (ชื่อ/หมวดหมู่/คำอธิบาย/สถานะ) ไม่รองรับเปลี่ยนไฟล์แนบ
 */
export default function AdminDocumentForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [existingFile, setExistingFile] = useState<{ name: string; type: string; size: number } | null>(null)
  const [form, setForm] = useState({
    name: '',
    categoryId: '' as number | '',
    description: '',
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    fetchDocumentById(Number(id))
      .then((doc) => {
        setForm({
          name: doc.originalName,
          categoryId: doc.categoryId ?? '',
          description: doc.description || '',
          isActive: doc.isActive,
        })
        setExistingFile({ name: doc.originalName, type: doc.fileType, size: doc.fileSize })
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดข้อมูลเอกสารไม่สำเร็จ')))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleFileSelect = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    if (!f.name.match(/\.(pdf|docx|txt)$/i)) {
      toast.error('รองรับเฉพาะไฟล์ PDF, DOCX, TXT')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error('ไฟล์ใหญ่เกิน 10MB')
      return
    }
    setFile(f)
    if (!form.name) setForm((prev) => ({ ...prev, name: f.name }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('กรุณาระบุชื่อเอกสาร')
      return
    }
    if (isEdit) {
      setLoading(true)
      try {
        await updateDocument(Number(id), {
          originalName: form.name,
          categoryId: form.categoryId === '' ? undefined : Number(form.categoryId),
          description: form.description || undefined,
          isActive: form.isActive,
        })
        toast.success('บันทึกการแก้ไขแล้ว')
        navigate('/admin/documents')
      } catch (err) {
        toast.error(extractErrorMessage(err, 'บันทึกข้อมูลไม่สำเร็จ'))
      } finally {
        setLoading(false)
      }
      return
    }

    if (!file) {
      toast.error('กรุณาเลือกไฟล์เอกสาร')
      return
    }
    setLoading(true)
    try {
      await uploadDocument(file, {
        name: form.name.trim() || undefined,
        categoryId: form.categoryId === '' ? undefined : Number(form.categoryId),
        description: form.description || undefined,
      })
      toast.success('อัปโหลดเอกสารสำเร็จ — กำลังประมวลผล')
      navigate('/admin/documents')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'อัปโหลดเอกสารไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-6 lg:p-8 max-w-3xl mx-auto"><AdminLoadingState /></div>
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-[13px] text-[#64748B] mb-2">
        <Link to="/admin/documents" className="hover:text-[#0B2E5E]">จัดการเอกสารและฐานข้อมูล</Link>
        <span>&gt;</span>
        <span>{isEdit ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่'}</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/documents')} className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#EFF6FF]">
          <ArrowLeft size={20} />
        </button>
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0B2E5E, #0B2E5ECC)', boxShadow: '0 6px 14px rgba(11,46,94,0.25)' }}
        >
          <Database size={17} className="text-white" />
        </div>
        <h1 className="text-xl font-semibold text-[#0B2E5E]">{isEdit ? 'แก้ไขเอกสาร' : 'เพิ่มเอกสารใหม่'}</h1>
      </div>

      <div className="admin-card p-6 sm:p-7 space-y-5" style={{ borderTop: '4px solid #0B2E5E' }}>
        {/* Section 1 — ข้อมูลเอกสาร */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.info}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.info}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.info}1A` }}>
              <FileText size={14} style={{ color: SECTION_COLORS.info }} />
            </span>
            ข้อมูลเอกสาร
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">
                ชื่อเอกสาร <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ระบุชื่อเอกสาร"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">
                หมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value === '' ? '' : Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white cursor-pointer transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              >
                <option value="">เลือกหมวดหมู่</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">คำอธิบาย</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="เพิ่มคำอธิบายสั้นๆ เกี่ยวกับเอกสารนี้ (ไม่บังคับ)"
                className="w-full px-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white resize-none transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2 — ไฟล์แนบ / อัปโหลดไฟล์ */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.file}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.file}` }}
        >
          {isEdit ? (
            <>
              <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-3">
                <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.file}1A` }}>
                  <FileCheck2 size={14} style={{ color: SECTION_COLORS.file }} />
                </span>
                ไฟล์แนบ
              </h2>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white" style={{ border: '1.5px solid #E2E8F0' }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 36, height: 36, background: `${SECTION_COLORS.file}14` }}>
                  <FileText size={17} style={{ color: SECTION_COLORS.file }} />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[#14213D] truncate">{existingFile?.name}</p>
                  <p className="text-xs text-[#94A3B8]">{existingFile?.type.toUpperCase()} · {existingFile ? formatSize(existingFile.size) : ''}</p>
                </div>
              </div>
              <p className="text-xs text-[#94A3B8] mt-2">ไม่รองรับการเปลี่ยนไฟล์แนบ หากต้องการเปลี่ยนไฟล์ กรุณาลบเอกสารนี้แล้วอัปโหลดใหม่</p>
            </>
          ) : (
            <>
              <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-3">
                <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.file}1A` }}>
                  <UploadCloud size={14} style={{ color: SECTION_COLORS.file }} />
                </span>
                อัปโหลดไฟล์
              </h2>
              <div
                className="rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 bg-white"
                style={{ border: `2px dashed ${dragging ? SECTION_COLORS.file : '#CBD5E1'}` }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileSelect(e.dataTransfer.files) }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="inline-flex items-center justify-center rounded-2xl mb-3" style={{ width: 56, height: 56, background: dragging ? `${SECTION_COLORS.file}1F` : '#F7F9FC' }}>
                  <UploadCloud size={24} style={{ color: dragging ? SECTION_COLORS.file : '#94A3B8' }} />
                </div>
                <p className="font-semibold text-[#14213D] text-[13px] mb-1">
                  {file ? file.name : 'ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์'}
                </p>
                <p className="text-xs text-[#94A3B8]">รองรับไฟล์ประเภท PDF, DOCX, TXT (ขนาดไม่เกิน 10MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            </>
          )}
        </div>

        {/* Section 3 — สถานะการใช้งาน */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.status}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.status}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.status}1A` }}>
              <ToggleLeft size={14} style={{ color: SECTION_COLORS.status }} />
            </span>
            สถานะการใช้งาน
          </h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white" style={{ border: '1.5px solid #E2E8F0' }}>
            <div>
              <p className={`text-[13px] font-semibold ${form.isActive ? 'text-[#4F46E5]' : 'text-[#94A3B8]'}`}>{form.isActive ? 'เปิดใช้งานเอกสาร' : 'ปิดใช้งานเอกสาร'}</p>
              <p className="text-xs text-[#64748B]">เปิดใช้งานเพื่อให้ผู้ใช้ทั่วไปสามารถเข้าถึงเอกสารนี้ได้</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
              style={{ background: form.isActive ? SECTION_COLORS.status : '#CBD5E1' }}
            >
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                style={{ left: form.isActive ? '22px' : '2px' }} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-[#EDF2F7]">
          <button onClick={() => navigate('/admin/documents')}
            className="px-5 py-2.5 rounded-xl text-[13px] text-[#64748B] border border-[#E2E8F0] hover:bg-[#F7F9FC] transition-colors">
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 text-white font-semibold rounded-xl transition-shadow hover:shadow-lg disabled:opacity-70"
            style={{ fontSize: '13px', padding: '10px 20px', background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)', boxShadow: '0 8px 20px rgba(11,46,94,0.3)' }}
          >
            <Save size={15} />
            {loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </button>
        </div>
      </div>
    </div>
  )
}
