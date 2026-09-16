import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Save, Megaphone, Image as ImageIcon, Radio } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  uploadAnnouncementImage,
  resolveAnnouncementImageUrl,
} from '@/services/announcementService'
import { fetchCategories, type Category } from '@/services/categoryService'
import { extractErrorMessage } from '@/services/authService'
import AdminLoadingState from '@/components/admin/AdminLoadingState'

const SECTION_COLORS = {
  info: '#1E5AA8',
  content: '#0E7490',
  publish: '#4F46E5',
}

/**
 * AdminAnnouncementForm — เพิ่ม/แก้ไขประกาศข่าวสาร (ตาม design-reference: new_news_matched.png)
 */
export default function AdminAnnouncementForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '',
    content: '',
    categoryId: '' as number | '',
    academicYear: '2569',
    attachmentUrl: '',
    isPublished: true,
    eventDate: new Date().toISOString().slice(0, 10),
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    fetchAnnouncementById(Number(id))
      .then((a) => {
        setForm({
          title: a.title,
          content: a.content,
          categoryId: a.categoryId ?? '',
          academicYear: a.academicYear,
          attachmentUrl: a.attachmentUrl || '',
          isPublished: a.isPublished,
          eventDate: (a.eventDate || a.publishedAt).slice(0, 10),
        })
        const resolved = resolveAnnouncementImageUrl(a.attachmentUrl)
        if (resolved) setImagePreview(resolved)
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดข้อมูลไม่สำเร็จ')))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleImageSelect = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    if (!f.type.match(/^image\/(png|jpeg|gif)$/)) {
      toast.error('รองรับเฉพาะไฟล์ PNG, JPG, GIF')
      return
    }
    setImageFile(f)
    setImagePreview(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('กรุณากรอกหัวข้อและรายละเอียดข่าวสาร')
      return
    }
    if (!form.eventDate) {
      toast.error('กรุณาระบุวันที่ของกิจกรรม/ประกาศ')
      return
    }
    setLoading(true)
    try {
      let attachmentUrl = form.attachmentUrl
      if (imageFile) {
        attachmentUrl = await uploadAnnouncementImage(imageFile)
      }

      const payload = {
        title: form.title,
        content: form.content,
        category_id: form.categoryId === '' ? undefined : Number(form.categoryId),
        academic_year: form.academicYear,
        attachment_url: attachmentUrl || undefined,
        is_published: form.isPublished,
        event_date: form.eventDate,
      }

      if (isEdit) {
        await updateAnnouncement(Number(id), payload)
        toast.success('บันทึกการแก้ไขแล้ว')
      } else {
        await createAnnouncement(payload)
        toast.success('สร้างประกาศแล้ว')
      }
      navigate('/admin/announcements')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'บันทึกข้อมูลไม่สำเร็จ'))
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
        <Link to="/admin/announcements" className="hover:text-[#0B2E5E]">จัดการข่าวสาร</Link>
        <span>&gt;</span>
        <span>{isEdit ? 'แก้ไขข่าวสาร' : 'เพิ่มข่าวสารใหม่'}</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/announcements')} className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#EFF6FF]">
          <ArrowLeft size={20} />
        </button>
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0B2E5E, #0B2E5ECC)', boxShadow: '0 6px 14px rgba(11,46,94,0.25)' }}
        >
          <Megaphone size={17} className="text-white" />
        </div>
        <h1 className="text-xl font-semibold text-[#0B2E5E]">{isEdit ? 'แก้ไขประกาศข่าวสาร' : 'เพิ่มประกาศข่าวสารใหม่'}</h1>
      </div>

      <div className="admin-card p-6 sm:p-7 space-y-5" style={{ borderTop: '4px solid #0B2E5E' }}>
        {/* Section 1 — ข้อมูลข่าวสาร */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.info}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.info}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.info}1A` }}>
              <Megaphone size={14} style={{ color: SECTION_COLORS.info }} />
            </span>
            ข้อมูลข่าวสาร
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">หัวข้อข่าวสาร <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="ระบุหัวข้อข่าวสาร"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">หมวดหมู่</label>
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
                <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">
                  วันที่ของกิจกรรม/ประกาศ <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                  style={{ border: '1.5px solid #E2E8F0' }}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">ปีการศึกษา</label>
                <input
                  type="text"
                  value={form.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  placeholder="2569"
                  className="w-full px-3 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                  style={{ border: '1.5px solid #E2E8F0' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 — เนื้อหาและรูปภาพ */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.content}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.content}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D]">
              <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.content}1A` }}>
                <ImageIcon size={14} style={{ color: SECTION_COLORS.content }} />
              </span>
              เนื้อหาและรูปภาพ <span className="text-red-500">*</span>
            </h2>
            <span className="text-xs text-[#94A3B8]">{form.content.length} ตัวอักษร</span>
          </div>
          <div className="space-y-4">
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              placeholder="ระบุรายละเอียดข่าวสาร"
              className="w-full px-4 py-3 rounded-xl text-[13px] leading-relaxed border outline-none text-[#14213D] bg-white resize-none transition-shadow focus:border-[#0E7490] focus:shadow-[0_0_0_3px_rgba(14,116,144,0.12)]"
              style={{ border: '1.5px solid #E2E8F0' }}
            />

            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">รูปภาพหน้าปก</label>
              <div
                className="rounded-2xl p-8 text-center cursor-pointer transition-all bg-white"
                style={{ border: `2px dashed ${imagePreview ? SECTION_COLORS.content : '#CBD5E1'}` }}
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="ตัวอย่างรูปภาพ" className="max-h-48 mx-auto rounded-lg object-cover" />
                ) : (
                  <>
                    <div className="inline-flex items-center justify-center rounded-2xl mb-2" style={{ width: 48, height: 48, background: `${SECTION_COLORS.content}14` }}>
                      <ImagePlus size={22} style={{ color: SECTION_COLORS.content }} />
                    </div>
                    <p className="text-[13px] font-medium text-[#14213D]">คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง</p>
                    <p className="text-xs text-[#94A3B8] mt-1">PNG, JPG หรือ GIF ขนาดไม่เกิน 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 — การเผยแพร่ */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.publish}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.publish}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-3">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.publish}1A` }}>
              <Radio size={14} style={{ color: SECTION_COLORS.publish }} />
            </span>
            สถานะการเผยแพร่
          </h2>
          <div className="flex items-center gap-3">
            <label
              className="flex items-center gap-2 text-[13px] cursor-pointer px-4 py-2.5 rounded-xl flex-1 transition-colors bg-white"
              style={form.isPublished
                ? { border: `1.5px solid ${SECTION_COLORS.publish}`, color: SECTION_COLORS.publish, background: `${SECTION_COLORS.publish}0D` }
                : { border: '1.5px solid #E2E8F0', color: '#64748B' }}
            >
              <input type="radio" checked={form.isPublished} onChange={() => setForm({ ...form, isPublished: true })} style={{ accentColor: SECTION_COLORS.publish }} />
              เผยแพร่ทันที
            </label>
            <label
              className="flex items-center gap-2 text-[13px] cursor-pointer px-4 py-2.5 rounded-xl flex-1 transition-colors bg-white"
              style={!form.isPublished
                ? { border: `1.5px solid ${SECTION_COLORS.publish}`, color: SECTION_COLORS.publish, background: `${SECTION_COLORS.publish}0D` }
                : { border: '1.5px solid #E2E8F0', color: '#64748B' }}
            >
              <input type="radio" checked={!form.isPublished} onChange={() => setForm({ ...form, isPublished: false })} style={{ accentColor: SECTION_COLORS.publish }} />
              บันทึกเป็นร่าง
            </label>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-[#EDF2F7]">
          <button onClick={() => navigate('/admin/announcements')}
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
