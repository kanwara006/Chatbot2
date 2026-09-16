import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, HelpCircle, MessageSquareText, Sparkles, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchFAQById, createFAQ, updateFAQ } from '@/services/faqService'
import { fetchCategories, type Category } from '@/services/categoryService'
import { extractErrorMessage } from '@/services/authService'
import AdminLoadingState from '@/components/admin/AdminLoadingState'

const SECTION_COLORS = {
  question: '#1E5AA8',
  answer: '#0E7490',
  extra: '#4F46E5',
}

/**
 * AdminFAQForm — เพิ่ม/แก้ไขคำถาม-คำตอบ (ตาม design-reference: add_new.png)
 */
export default function AdminFAQForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    question: '',
    answer: '',
    categoryId: '' as number | '',
    keywords: '',
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    fetchFAQById(Number(id))
      .then((faq) => setForm({
        question: faq.question,
        answer: faq.answer,
        categoryId: faq.categoryId ?? '',
        keywords: faq.keywords || '',
        isActive: faq.isActive,
      }))
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดข้อมูลไม่สำเร็จ')))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleSubmit = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      toast.error('กรุณากรอกคำถามและคำตอบ')
      return
    }
    setLoading(true)
    try {
      const payload = {
        question: form.question,
        answer: form.answer,
        category_id: form.categoryId === '' ? undefined : Number(form.categoryId),
        keywords: form.keywords || undefined,
        is_active: form.isActive,
      }
      if (isEdit) {
        await updateFAQ(Number(id), payload)
        toast.success('บันทึกการแก้ไขแล้ว')
      } else {
        await createFAQ(payload)
        toast.success('เพิ่มคำถาม-คำตอบแล้ว')
      }
      navigate('/admin/faq')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'บันทึกข้อมูลไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-6 lg:p-8 max-w-4xl mx-auto"><AdminLoadingState /></div>
  }

  const keywordChips = form.keywords.split(',').map((k) => k.trim()).filter(Boolean)

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-[13px] text-[#64748B] mb-2">
        <Link to="/admin/faq" className="hover:text-[#0B2E5E]">จัดการคำถาม-คำตอบ</Link>
        <span>&gt;</span>
        <span>{isEdit ? 'แก้ไขคำถาม-คำตอบ' : 'เพิ่มคำถามใหม่'}</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/faq')} className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#EFF6FF]">
          <ArrowLeft size={20} />
        </button>
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0B2E5E, #0B2E5ECC)', boxShadow: '0 6px 14px rgba(11,46,94,0.25)' }}
        >
          <HelpCircle size={17} className="text-white" />
        </div>
        <h1 className="text-xl font-semibold text-[#0B2E5E]">{isEdit ? 'แก้ไขคำถาม-คำตอบ' : 'เพิ่มคำถาม-คำตอบใหม่'}</h1>
      </div>

      <div className="admin-card p-6 sm:p-7 space-y-5" style={{ borderTop: '4px solid #0B2E5E' }}>
        {/* Section 1 — ข้อมูลคำถาม */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.question}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.question}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.question}1A` }}>
              <HelpCircle size={14} style={{ color: SECTION_COLORS.question }} />
            </span>
            ข้อมูลคำถาม
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">
                คำถาม <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="เช่น การกู้ยืม กยศ. มีขั้นตอนอย่างไรบ้าง?"
                className="w-full px-4 py-3 rounded-xl text-sm font-medium border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">
                  สถานะการแสดงผล
                </label>
                <div
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white"
                  style={{ border: '1.5px solid #E2E8F0' }}
                >
                  <span className={`text-[13px] font-medium ${form.isActive ? 'text-[#1E5AA8]' : 'text-[#94A3B8]'}`}>
                    {form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, isActive: !form.isActive })}
                    className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{ background: form.isActive ? SECTION_COLORS.question : '#CBD5E1' }}
                  >
                    <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                      style={{ left: form.isActive ? '22px' : '2px' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 — คำตอบ */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.answer}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.answer}` }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D]">
              <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.answer}1A` }}>
                <MessageSquareText size={14} style={{ color: SECTION_COLORS.answer }} />
              </span>
              คำตอบ <span className="text-red-500">*</span>
            </h2>
            <span className="text-xs text-[#94A3B8]">{form.answer.length} ตัวอักษร</span>
          </div>
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={10}
            placeholder="พิมพ์คำตอบที่ชัดเจนและเข้าใจง่าย..."
            className="w-full px-4 py-3 rounded-xl text-[13px] leading-relaxed border outline-none text-[#14213D] bg-white resize-none transition-shadow focus:border-[#0E7490] focus:shadow-[0_0_0_3px_rgba(14,116,144,0.12)]"
            style={{ border: '1.5px solid #E2E8F0' }}
          />
        </div>

        {/* Section 3 — ข้อมูลเพิ่มเติมสำหรับ AI */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.extra}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.extra}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-1">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.extra}1A` }}>
              <Sparkles size={14} style={{ color: SECTION_COLORS.extra }} />
            </span>
            ข้อมูลเพิ่มเติม (สำหรับ AI)
          </h2>
          <p className="text-xs text-[#94A3B8] mb-3 ml-9">ช่วยให้ AI ค้นเจอคำถามนี้ได้แม่นยำขึ้นเมื่อผู้ใช้พิมพ์คำใกล้เคียง</p>
          <div className="ml-9">
            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#14213D] mb-1.5">
              <Tag size={12} style={{ color: SECTION_COLORS.extra }} />
              คำค้นหา / Keywords (คั่นด้วยลูกน้ำ)
            </label>
            <input
              type="text"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
              placeholder="กยศ, ขั้นตอน, ผู้กู้รายใหม่"
              className="w-full px-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#4F46E5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]"
              style={{ border: '1.5px solid #E2E8F0' }}
            />
            {keywordChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {keywordChips.map((kw, i) => (
                  <span
                    key={`${kw}-${i}`}
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${SECTION_COLORS.extra}14`, color: SECTION_COLORS.extra }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-[#EDF2F7]">
          <button onClick={() => navigate('/admin/faq')}
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
