import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, Check, CalendarDays, Paperclip } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Announcement } from '@/types'

const initData: Announcement[] = [
  { id: 1, title: 'เปิดระบบผู้กู้ยืม กยศ. ภาคเรียนที่ 1/2569', content: 'เปิดรับการลงทะเบียนสำหรับภาคเรียนที่ 1/2569...', category: 'การกู้ยืม', academicYear: '2569', isPublished: true, publishedAt: '2026-08-15', createdAt: '2026-08-15' },
  { id: 2, title: 'กำหนดการส่งเอกสารประกอบการกู้ยืม', content: 'ขอให้นักศึกษาส่งเอกสารตามกำหนดการ...', category: 'เอกสาร', academicYear: '2569', isPublished: true, publishedAt: '2026-08-10', createdAt: '2026-08-10', attachmentUrl: '#' },
  { id: 3, title: 'การอบรมจิตอาสา ประจำปีการศึกษา 2569', content: 'กำหนดการอบรมจิตอาสา...', category: 'จิตอาสา', academicYear: '2569', isPublished: true, publishedAt: '2026-08-02', createdAt: '2026-08-02' },
  { id: 4, title: 'ประกาศรายชื่อผู้ผ่านการพิจารณา', content: 'รายชื่อนักศึกษาที่ผ่านการพิจารณา...', category: 'การกู้ยืม', academicYear: '2569', isPublished: false, publishedAt: '2026-07-20', createdAt: '2026-07-20' },
]

const CATEGORIES = ['การกู้ยืม', 'เอกสาร', 'จิตอาสา', 'กำหนดการ', 'อื่น ๆ']

type ModalMode = 'create' | 'edit' | null

interface FormState {
  title: string; content: string; category: string
  academicYear: string; isPublished: boolean
}

const emptyForm: FormState = { title: '', content: '', category: 'การกู้ยืม', academicYear: '2569', isPublished: true }

/** Modal dialog สำหรับ สร้าง/แก้ไข Announcement */
function AnnouncementModal({
  mode, initial, onSave, onClose,
}: {
  mode:    ModalMode
  initial: FormState
  onSave:  (data: FormState) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(11,46,94,0.45)' }}>
      <div className="w-full max-w-lg card p-6" style={{ borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#14213D]">{mode === 'create' ? 'สร้างประกาศใหม่' : 'แก้ไขประกาศ'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#14213D] mb-1.5">หัวข้อประกาศ <span className="text-red-400">*</span></label>
            <input type="text" value={form.title} onChange={set('title')}
              className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none text-[#14213D]"
              style={{ border: '1.5px solid #E2E8F0' }} placeholder="หัวข้อประกาศ" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14213D] mb-1.5">เนื้อหา</label>
            <textarea value={form.content} onChange={set('content')} rows={5}
              className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none text-[#14213D] resize-none"
              style={{ border: '1.5px solid #E2E8F0' }} placeholder="เนื้อหาประกาศ..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#14213D] mb-1.5">หมวดหมู่</label>
              <select value={form.category} onChange={set('category')}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none text-[#14213D] bg-white"
                style={{ border: '1.5px solid #E2E8F0' }}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#14213D] mb-1.5">ปีการศึกษา</label>
              <input type="text" value={form.academicYear} onChange={set('academicYear')}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none text-[#14213D]"
                style={{ border: '1.5px solid #E2E8F0' }} placeholder="2569" />
            </div>
          </div>
          {/* Publish toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F7F9FC', border: '1px solid #E2E8F0' }}>
            <div>
              <p className="text-sm font-semibold text-[#14213D]">เผยแพร่ทันที</p>
              <p className="text-xs text-[#64748B]">นักศึกษาจะเห็นประกาศนี้</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
              className="relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0"
              style={{ background: form.isPublished ? '#1E5AA8' : '#CBD5E1' }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                style={{ left: form.isPublished ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#64748B] border border-[#E2E8F0] hover:bg-[#F7F9FC] transition-colors">
            ยกเลิก
          </button>
          <button
            onClick={() => { if (!form.title.trim()) { toast.error('กรุณากรอกหัวข้อประกาศ'); return } onSave(form) }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: '#1E5AA8', boxShadow: '0 2px 8px rgba(30,90,168,0.25)' }}
          >
            {mode === 'create' ? 'สร้างประกาศ' : 'บันทึกการแก้ไข'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * AdminAnnouncements — จัดการประกาศ (CRUD)
 */
export default function AdminAnnouncements() {
  const [data,   setData]   = useState<Announcement[]>(initData)
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState<{ mode: ModalMode; target: Announcement | null }>({ mode: null, target: null })

  const filtered = data.filter(a => a.title.includes(search) || a.category.includes(search))

  const openCreate = () => setModal({ mode: 'create', target: null })
  const openEdit   = (a: Announcement) => setModal({ mode: 'edit', target: a })
  const closeModal = () => setModal({ mode: null, target: null })

  const handleSave = (form: FormState) => {
    if (modal.mode === 'create') {
      const newItem: Announcement = {
        id: Date.now(), ...form,
        publishedAt: new Date().toISOString().split('T')[0],
        createdAt:   new Date().toISOString().split('T')[0],
      }
      setData(prev => [newItem, ...prev])
      toast.success('สร้างประกาศแล้ว')
    } else if (modal.target) {
      setData(prev => prev.map(a => a.id === modal.target!.id ? { ...a, ...form } : a))
      toast.success('บันทึกการแก้ไขแล้ว')
    }
    closeModal()
  }

  const handleDelete = (id: number) => {
    setData(prev => prev.filter(a => a.id !== id))
    toast.success('ลบประกาศแล้ว')
  }

  const togglePublish = (id: number) => {
    setData(prev => prev.map(a => a.id === id ? { ...a, isPublished: !a.isPublished } : a))
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2E5E]">ประกาศ</h1>
          <p className="text-sm text-[#64748B] mt-1">จัดการข่าวและประกาศที่แสดงบนเว็บไซต์</p>
        </div>
        <button id="announcement-add-btn" onClick={openCreate}
          className="btn-primary flex items-center gap-2"
          style={{ fontSize: '13px', padding: '10px 18px' }}>
          <Plus size={15} /> สร้างประกาศใหม่
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ค้นหาประกาศ..." id="announcement-search-admin"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none text-[#14213D]"
          style={{ border: '1.5px solid #E2E8F0', background: '#fff' }} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden" style={{ borderRadius: '16px' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F7F9FC', borderBottom: '1px solid #E2E8F0' }}>
              {['หัวข้อ','หมวดหมู่','ปี','สถานะ','วันที่',''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase" style={{ letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id}
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F7F9FC' }}
                onMouseLeave={e => { e.currentTarget.style.background = '' }}>
                <td className="px-5 py-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    {a.attachmentUrl && <Paperclip size={11} className="text-[#94A3B8] flex-shrink-0" />}
                    <span className="text-xs font-medium text-[#14213D] truncate">{a.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4"><span className="badge badge-blue text-[10px]">{a.category}</span></td>
                <td className="px-5 py-4 text-xs text-[#64748B]">{a.academicYear}</td>
                <td className="px-5 py-4">
                  <button onClick={() => togglePublish(a.id)}
                    className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                    style={{ color: a.isPublished ? '#059669' : '#94A3B8' }}>
                    {a.isPublished
                      ? <><Check size={12} /> เผยแพร่แล้ว</>
                      : <><X size={12} /> แบบร่าง</>}
                  </button>
                </td>
                <td className="px-5 py-4 text-xs text-[#64748B] whitespace-nowrap">
                  <div className="flex items-center gap-1"><CalendarDays size={11} />{a.publishedAt}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(a)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E5AA8] hover:bg-[#EFF6FF] transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.mode && (
        <AnnouncementModal
          mode={modal.mode}
          initial={modal.target
            ? { title: modal.target.title, content: modal.target.content, category: modal.target.category, academicYear: modal.target.academicYear, isPublished: modal.target.isPublished }
            : emptyForm
          }
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
