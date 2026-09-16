import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save, FolderOpen, Palette, Settings2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchCategories, createCategory, updateCategory } from '@/services/categoryService'
import { extractErrorMessage } from '@/services/authService'
import { CATEGORY_ICON_OPTIONS } from '@/utils/categoryIcons'
import AdminLoadingState from '@/components/admin/AdminLoadingState'

const SECTION_COLORS = {
  info: '#1E5AA8',
  icon: '#0E7490',
  settings: '#4F46E5',
}

/**
 * AdminCategoryForm — เพิ่ม/แก้ไขหมวดหมู่ (ตาม design-reference: screen.png)
 */
export default function AdminCategoryForm() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: 'graduation-cap',
    displayOrder: 1,
    isActive: true,
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    fetchCategories()
      .then((items) => {
        const found = items.find((c) => c.id === Number(id))
        if (found) {
          setForm({
            name: found.name,
            description: found.description || '',
            icon: found.icon,
            displayOrder: found.displayOrder,
            isActive: found.isActive,
          })
        }
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดข้อมูลหมวดหมู่ไม่สำเร็จ')))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('กรุณากรอกชื่อหมวดหมู่')
      return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        description: form.description || undefined,
        icon: form.icon,
        display_order: form.displayOrder,
        is_active: form.isActive,
      }
      if (isEdit) {
        await updateCategory(Number(id), payload)
        toast.success('บันทึกการแก้ไขแล้ว')
      } else {
        await createCategory(payload)
        toast.success('สร้างหมวดหมู่แล้ว')
      }
      navigate('/admin/categories')
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
        <Link to="/admin/categories" className="hover:text-[#0B2E5E]">จัดการหมวดหมู่</Link>
        <span>&gt;</span>
        <span>{isEdit ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/categories')} className="p-1.5 rounded-lg text-[#64748B] hover:bg-[#EFF6FF]">
          <ArrowLeft size={20} />
        </button>
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0B2E5E, #0B2E5ECC)', boxShadow: '0 6px 14px rgba(11,46,94,0.25)' }}
        >
          <FolderOpen size={17} className="text-white" />
        </div>
        <h1 className="text-xl font-semibold text-[#0B2E5E]">{isEdit ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</h1>
      </div>

      <div className="admin-card p-6 sm:p-7 space-y-5" style={{ borderTop: '4px solid #0B2E5E' }}>
        {/* Section 1 — ข้อมูลหมวดหมู่ */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.info}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.info}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.info}1A` }}>
              <FolderOpen size={14} style={{ color: SECTION_COLORS.info }} />
            </span>
            ข้อมูลหมวดหมู่
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">
                ชื่อหมวดหมู่ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="เช่น คุณสมบัติผู้กู้"
                className="w-full px-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">รายละเอียด</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="อธิบายรายละเอียดเกี่ยวกับหมวดหมู่นี้..."
                className="w-full px-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white resize-none transition-shadow focus:border-[#1E5AA8] focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              />
            </div>
          </div>
        </div>

        {/* Section 2 — ไอคอนหมวดหมู่ */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.icon}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.icon}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-1">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.icon}1A` }}>
              <Palette size={14} style={{ color: SECTION_COLORS.icon }} />
            </span>
            เลือกไอคอน
          </h2>
          <p className="text-xs text-[#94A3B8] mb-3 ml-9">ไอคอนนี้จะแสดงแทนหมวดหมู่นี้ในหน้าผู้ใช้งาน</p>
          <div className="flex flex-wrap gap-2 ml-9">
            {CATEGORY_ICON_OPTIONS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm({ ...form, icon: key })}
                className="w-11 h-11 rounded-xl flex items-center justify-center transition-all"
                style={{
                  border: form.icon === key ? `2px solid ${SECTION_COLORS.icon}` : '1.5px solid #E2E8F0',
                  background: form.icon === key ? `${SECTION_COLORS.icon}14` : '#fff',
                  color: form.icon === key ? SECTION_COLORS.icon : '#64748B',
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Section 3 — การแสดงผล */}
        <div
          className="rounded-2xl p-5"
          style={{ background: `linear-gradient(180deg, ${SECTION_COLORS.settings}0A 0%, #FFFFFF 100%)`, border: '1px solid #E2E8F0', borderLeft: `4px solid ${SECTION_COLORS.settings}` }}
        >
          <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
            <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: `${SECTION_COLORS.settings}1A` }}>
              <Settings2 size={14} style={{ color: SECTION_COLORS.settings }} />
            </span>
            การแสดงผล
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end sm:justify-between">
            <div className="flex-1">
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">สถานะหมวดหมู่</label>
              <div
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white"
                style={{ border: '1.5px solid #E2E8F0' }}
              >
                <div>
                  <p className={`text-[13px] font-semibold ${form.isActive ? 'text-[#4F46E5]' : 'text-[#94A3B8]'}`}>{form.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</p>
                  <p className="text-xs text-[#64748B]">เมื่อเปิดใช้งาน หมวดหมู่นี้จะแสดงให้ผู้ใช้เห็น</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
                  style={{ background: form.isActive ? SECTION_COLORS.settings : '#CBD5E1' }}
                >
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                    style={{ left: form.isActive ? '22px' : '2px' }} />
                </button>
              </div>
            </div>
            <div className="sm:w-40">
              <label className="block text-[13px] font-semibold text-[#14213D] mb-1.5">ลำดับการแสดงผล</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white transition-shadow focus:border-[#4F46E5] focus:shadow-[0_0_0_3px_rgba(79,70,229,0.12)]"
                style={{ border: '1.5px solid #E2E8F0' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-[#EDF2F7]">
          <button onClick={() => navigate('/admin/categories')}
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
