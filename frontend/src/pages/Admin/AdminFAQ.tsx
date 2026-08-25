import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, X, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface FAQItem {
  id: number; question: string; answer: string; category: string; order: number; isActive: boolean
}

const initFAQs: FAQItem[] = [
  { id: 1, question: 'ใครมีสิทธิ์กู้ยืมเงิน กยศ. บ้าง?', answer: 'นักศึกษาที่มีรายได้ครอบครัวไม่เกิน 360,000 บาทต่อปี...', category: 'การสมัคร', order: 1, isActive: true },
  { id: 2, question: 'ขั้นตอนการสมัครกู้ยืมมีอะไรบ้าง?', answer: 'ลงทะเบียนในระบบ กยศ. Connect → กรอกข้อมูล → ยื่นเอกสาร...', category: 'การสมัคร', order: 2, isActive: true },
  { id: 3, question: 'ต้องเตรียมเอกสารอะไรบ้าง?', answer: 'สำเนาบัตรประชาชน, สำเนาทะเบียนบ้าน, รูปถ่าย, หนังสือรับรองรายได้...', category: 'เอกสาร', order: 3, isActive: true },
  { id: 4, question: 'ต้องทำจิตอาสากี่ชั่วโมง?', answer: 'ไม่น้อยกว่า 36 ชั่วโมงต่อปีการศึกษา...', category: 'จิตอาสา', order: 4, isActive: true },
  { id: 5, question: 'ผู้กู้รายเก่าต้องทำอย่างไร?', answer: 'เข้าสู่ระบบ กยศ. Connect → ตรวจสอบสถานะ → ยื่นคำขอใหม่...', category: 'การสมัคร', order: 5, isActive: false },
]

const FAQ_CATEGORIES = ['การสมัคร', 'เอกสาร', 'จิตอาสา', 'ค่าเล่าเรียน', 'การชำระหนี้', 'อื่น ๆ']

function FAQModal({
  mode, initial, onSave, onClose,
}: {
  mode: 'create' | 'edit'
  initial: { question: string; answer: string; category: string; isActive: boolean }
  onSave: (d: typeof initial) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(11,46,94,0.45)' }}>
      <div className="w-full max-w-lg card p-6" style={{ borderRadius: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#14213D]">{mode === 'create' ? 'เพิ่ม FAQ ใหม่' : 'แก้ไข FAQ'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9]"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#14213D] mb-1.5">คำถาม <span className="text-red-400">*</span></label>
            <input type="text" value={form.question} onChange={set('question')}
              className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none text-[#14213D]"
              style={{ border: '1.5px solid #E2E8F0' }} placeholder="คำถามที่พบบ่อย..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14213D] mb-1.5">คำตอบ <span className="text-red-400">*</span></label>
            <textarea value={form.answer} onChange={set('answer')} rows={6}
              className="w-full px-4 py-2.5 rounded-xl text-sm border outline-none text-[#14213D] resize-none"
              style={{ border: '1.5px solid #E2E8F0' }} placeholder="คำตอบ..." />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#14213D] mb-1.5">หมวดหมู่</label>
            <select value={form.category} onChange={set('category')}
              className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none text-[#14213D] bg-white"
              style={{ border: '1.5px solid #E2E8F0' }}>
              {FAQ_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: '#F7F9FC', border: '1px solid #E2E8F0' }}>
            <div>
              <p className="text-sm font-semibold text-[#14213D]">เปิดใช้งาน</p>
              <p className="text-xs text-[#64748B]">แสดงบนหน้า FAQ</p>
            </div>
            <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })}
              className="relative w-11 h-6 rounded-full transition-all duration-200"
              style={{ background: form.isActive ? '#1E5AA8' : '#CBD5E1' }}>
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200"
                style={{ left: form.isActive ? '22px' : '2px' }} />
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#64748B] border border-[#E2E8F0] hover:bg-[#F7F9FC] transition-colors">
            ยกเลิก
          </button>
          <button
            onClick={() => { if (!form.question.trim() || !form.answer.trim()) { toast.error('กรุณากรอกคำถามและคำตอบ'); return } onSave(form) }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: '#1E5AA8', boxShadow: '0 2px 8px rgba(30,90,168,0.25)' }}>
            {mode === 'create' ? 'เพิ่ม FAQ' : 'บันทึก'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * AdminFAQ — จัดการ FAQ (CRUD + Reorder)
 */
export default function AdminFAQ() {
  const [faqs,   setFaqs]   = useState<FAQItem[]>(initFAQs)
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState<{ mode: 'create' | 'edit' | null; target: FAQItem | null }>({ mode: null, target: null })

  const filtered = faqs.filter(f => f.question.includes(search) || f.category.includes(search))

  const moveItem = (idx: number, dir: 'up' | 'down') => {
    const arr = [...faqs]
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= arr.length) return
    ;[arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]]
    setFaqs(arr)
  }

  const handleSave = (form: { question: string; answer: string; category: string; isActive: boolean }) => {
    if (modal.mode === 'create') {
      setFaqs(prev => [...prev, { id: Date.now(), ...form, order: prev.length + 1 }])
      toast.success('เพิ่ม FAQ แล้ว')
    } else if (modal.target) {
      setFaqs(prev => prev.map(f => f.id === modal.target!.id ? { ...f, ...form } : f))
      toast.success('บันทึกการแก้ไขแล้ว')
    }
    setModal({ mode: null, target: null })
  }

  const handleDelete = (id: number) => { setFaqs(prev => prev.filter(f => f.id !== id)); toast.success('ลบ FAQ แล้ว') }
  const toggleActive = (id: number) => setFaqs(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f))

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2E5E]">FAQ</h1>
          <p className="text-sm text-[#64748B] mt-1">จัดการคำถามที่พบบ่อย — ลากเพื่อเรียงลำดับ</p>
        </div>
        <button id="faq-add-btn" onClick={() => setModal({ mode: 'create', target: null })}
          className="btn-primary flex items-center gap-2" style={{ fontSize: '13px', padding: '10px 18px' }}>
          <Plus size={15} /> เพิ่ม FAQ ใหม่
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="ค้นหา FAQ..." id="faq-search-admin"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none text-[#14213D]"
          style={{ border: '1.5px solid #E2E8F0', background: '#fff' }} />
      </div>

      {/* Summary */}
      <div className="flex gap-4 mb-5 text-xs">
        <span className="text-[#64748B]">ทั้งหมด <strong className="text-[#14213D]">{faqs.length}</strong> ข้อ</span>
        <span className="text-green-600">เปิดใช้งาน <strong>{faqs.filter(f => f.isActive).length}</strong> ข้อ</span>
        <span className="text-[#94A3B8]">ซ่อน <strong>{faqs.filter(f => !f.isActive).length}</strong> ข้อ</span>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {filtered.map((faq, idx) => (
          <div
            key={faq.id}
            className="card p-5 flex items-start gap-4"
            style={{ borderRadius: '14px', opacity: faq.isActive ? 1 : 0.55 }}
          >
            {/* Order controls */}
            <div className="flex flex-col items-center gap-0.5 flex-shrink-0 pt-1">
              <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0}
                className="p-0.5 text-[#CBD5E1] hover:text-[#1E5AA8] disabled:opacity-30 transition-colors">
                <ChevronUp size={14} />
              </button>
              <span className="text-xs text-[#94A3B8] font-bold w-5 text-center">{idx + 1}</span>
              <button onClick={() => moveItem(idx, 'down')} disabled={idx === filtered.length - 1}
                className="p-0.5 text-[#CBD5E1] hover:text-[#1E5AA8] disabled:opacity-30 transition-colors">
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="badge badge-blue text-[10px]">{faq.category}</span>
                {!faq.isActive && <span className="badge text-[10px]" style={{ background: '#F1F5F9', color: '#94A3B8' }}>ซ่อน</span>}
              </div>
              <p className="font-semibold text-[#14213D] text-sm mb-1">{faq.question}</p>
              <p className="text-xs text-[#64748B] leading-relaxed truncate">{faq.answer}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => toggleActive(faq.id)}
                className={`p-1.5 rounded-lg transition-all text-xs font-medium px-2 ${faq.isActive ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-[#94A3B8] hover:bg-[#F7F9FC]'}`}>
                {faq.isActive ? 'เปิด' : 'ซ่อน'}
              </button>
              <button onClick={() => setModal({ mode: 'edit', target: faq })}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#1E5AA8] hover:bg-[#EFF6FF] transition-all">
                <Pencil size={14} />
              </button>
              <button onClick={() => handleDelete(faq.id)}
                className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-all">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal.mode && (
        <FAQModal
          mode={modal.mode}
          initial={modal.target
            ? { question: modal.target.question, answer: modal.target.answer, category: modal.target.category, isActive: modal.target.isActive }
            : { question: '', answer: '', category: 'การสมัคร', isActive: true }
          }
          onSave={handleSave}
          onClose={() => setModal({ mode: null, target: null })}
        />
      )}
    </div>
  )
}
