import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, HelpCircle, CheckCircle2, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import type { FAQ } from '@/types'
import { fetchFAQs, deleteFAQ } from '@/services/faqService'
import { fetchCategories, type Category } from '@/services/categoryService'
import { extractErrorMessage } from '@/services/authService'
import { getCategoryColor } from '@/utils/categoryIcons'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog'

/**
 * AdminFAQ — จัดการคำถาม-คำตอบ (ตาม design-reference: q_a_management.png)
 */
export default function AdminFAQ() {
  const navigate = useNavigate()
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all')
  const [deleteTarget, setDeleteTarget] = useState<FAQ | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [faqItems, catItems] = await Promise.all([fetchFAQs(), fetchCategories()])
      setFaqs(faqItems)
      setCategories(catItems)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'โหลดข้อมูล FAQ ไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const categoryName = (id?: number) => categories.find((c) => c.id === id)?.name || '-'

  const filtered = faqs.filter((f) => {
    const matchSearch = !search || f.question.includes(search) || f.answer.includes(search)
    const matchCategory = categoryFilter === 'all' || f.categoryId === categoryFilter
    return matchSearch && matchCategory
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteFAQ(deleteTarget.id)
      setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id))
      toast.success('ลบคำถาม-คำตอบแล้ว')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'ลบไม่สำเร็จ'))
    } finally {
      setDeleting(false)
    }
  }

  const stats = {
    total: faqs.length,
    active: faqs.filter((f) => f.isActive).length,
    categories: categories.length,
  }

  return (
    <div className="p-6 lg:p-8">
      <AdminPageHeader
        title="จัดการคำถาม-คำตอบ"
        subtitle="จัดการและดูแลชุดคำถาม-คำตอบ (Q&A) ในฐานความรู้ของระบบ"
        icon={HelpCircle}
        color="#0B2E5E"
        action={
          <button
            onClick={() => navigate('/admin/faq/new')}
            className="flex items-center gap-2 text-white font-semibold rounded-xl transition-shadow hover:shadow-lg"
            style={{ fontSize: '13px', padding: '10px 18px', background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)', boxShadow: '0 8px 20px rgba(11,46,94,0.3)' }}
          >
            <Plus size={15} /> เพิ่มคำถาม หรือ คำตอบใหม่
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AdminStatCard icon={HelpCircle} label="คำถามทั้งหมด" value={`${stats.total} รายการ`} color="#4F46E5" delay={0} />
        <AdminStatCard icon={CheckCircle2} label="เปิดใช้งาน" value={`${stats.active} รายการ`} color="#1E5AA8" delay={0.05} />
        <AdminStatCard icon={FolderOpen} label="หมวดหมู่ที่ใช้งาน" value={`${stats.categories} หมวดหมู่`} color="#0E7490" delay={0.1} />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาคำถาม, คำตอบ, หมวดหมู่..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] transition-shadow focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
            style={{ border: '1.5px solid #E2E8F0', background: '#fff' }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-3 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white cursor-pointer"
          style={{ border: '1.5px solid #E2E8F0', minWidth: 160 }}
        >
          <option value="all">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <AdminLoadingState />
      ) : (
      <div className="admin-card overflow-hidden">
        {filtered.length === 0 ? (
          <AdminEmptyState icon={HelpCircle} title="ยังไม่มีคำถาม-คำตอบ" subtitle="เริ่มเพิ่มคำถามแรกเพื่อให้ AI ใช้ตอบผู้ใช้งาน" />
        ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: '#1E5AA8' }}>
              {['ลำดับ', 'คำถาม', 'คำตอบ (ตัวอย่าง)', 'หมวดหมู่', 'จัดการ'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[13px] font-semibold text-white uppercase" style={{ letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((faq, idx) => (
              <motion.tr
                key={faq.id}
                style={{ borderBottom: idx < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', opacity: faq.isActive ? 1 : 0.5 }}
                className={`transition-all hover:-translate-y-0.5 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#F2F5F9]'}`}
                initial={{ opacity: 0 }} animate={{ opacity: faq.isActive ? 1 : 0.5 }} transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <td className="px-5 py-4 text-[13px] text-[#475569]">{idx + 1}</td>
                <td className="px-5 py-4 max-w-xs">
                  <p className="text-[13px] font-semibold text-[#14213D]">{faq.question}</p>
                </td>
                <td className="px-5 py-4 max-w-sm">
                  <p className="text-[13px] text-[#334155] line-clamp-2">{faq.answer}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="badge text-[10px]"
                    style={{
                      background: `${getCategoryColor(faq.categoryId)}14`,
                      color: getCategoryColor(faq.categoryId),
                      border: `1px solid ${getCategoryColor(faq.categoryId)}33`,
                    }}
                  >
                    {categoryName(faq.categoryId)}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => navigate(`/admin/faq/${faq.id}/edit`)}
                      className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(faq)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="ยืนยันการลบคำถาม-คำตอบ"
        message={deleteTarget ? `ต้องการลบ "${deleteTarget.question}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
