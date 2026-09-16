import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Grid3x3, ListChecks, FileStack, Pencil, Trash2, FolderOpen, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fetchCategories, deleteCategory, type Category } from '@/services/categoryService'
import { extractErrorMessage } from '@/services/authService'
import { getCategoryIcon, getCategoryColor } from '@/utils/categoryIcons'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog'

/**
 * AdminCategories — จัดการหมวดหมู่ (ตาม design-reference: category_management.png)
 */
export default function AdminCategories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const items = await fetchCategories()
      setCategories(items)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'โหลดข้อมูลหมวดหมู่ไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = categories.filter((c) => {
    const matchSearch = c.name.includes(search) || (c.description || '').includes(search)
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? c.isActive : !c.isActive)
    return matchSearch && matchStatus
  })
  const totalFaqs = categories.reduce((sum, c) => sum + c.faqCount, 0)
  const totalDocs = categories.reduce((sum, c) => sum + c.documentCount, 0)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCategory(deleteTarget.id)
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      toast.success('ลบหมวดหมู่แล้ว')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'ลบหมวดหมู่ไม่สำเร็จ'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <AdminPageHeader
        title="จัดการหมวดหมู่"
        subtitle="จัดการกลุ่มหมวดหมู่ของคำถาม เพื่อใช้ในการจัดระเบียบและแสดงผล"
        icon={FolderOpen}
        color="#0B2E5E"
        action={
          <button
            onClick={() => navigate('/admin/categories/new')}
            className="flex items-center gap-2 text-white font-semibold rounded-xl transition-shadow hover:shadow-lg"
            style={{ fontSize: '13px', padding: '10px 18px', background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)', boxShadow: '0 8px 20px rgba(11,46,94,0.3)' }}
          >
            <Plus size={15} /> เพิ่มหมวดหมู่ใหม่
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AdminStatCard icon={Grid3x3} label="หมวดหมู่ทั้งหมด" value={`${categories.length} หมวดหมู่`} color="#1E5AA8" delay={0} variant="vivid" />
        <AdminStatCard icon={ListChecks} label="คำถามในหมวดหมู่" value={`${totalFaqs.toLocaleString()} รายการ`} color="#0E7490" delay={0.05} variant="vivid" />
        <AdminStatCard icon={FileStack} label="เอกสารในหมวดหมู่" value={`${totalDocs.toLocaleString()} ไฟล์`} color="#4F46E5" delay={0.1} variant="vivid" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาหมวดหมู่..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] transition-shadow focus:shadow-[0_0_0_3px_rgba(30,90,168,0.12)]"
            style={{ border: '1.5px solid #E2E8F0', background: '#fff' }}
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="pl-4 pr-8 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white appearance-none cursor-pointer"
            style={{ border: '1.5px solid #E2E8F0', minWidth: 160 }}
          >
            <option value="all">ทุกสถานะ</option>
            <option value="active">เปิดใช้งาน</option>
            <option value="inactive">ปิดใช้งาน</option>
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
          <AdminEmptyState icon={FolderOpen} title="ยังไม่มีหมวดหมู่" subtitle="เริ่มสร้างหมวดหมู่แรกเพื่อจัดระเบียบคำถามและเอกสาร" />
        ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr style={{ background: '#1E5AA8' }}>
              {['ชื่อหมวดหมู่', 'คำอธิบาย', 'จำนวนคำถาม', 'จำนวนเอกสาร', 'สถานะ', 'จัดการ'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[13px] font-semibold text-white uppercase" style={{ letterSpacing: '0.04em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((cat, i) => {
              const Icon = getCategoryIcon(cat.icon)
              return (
                <motion.tr
                  key={cat.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  className={`transition-all hover:-translate-y-0.5 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F2F5F9]'}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${getCategoryColor(cat.id)}1A, ${getCategoryColor(cat.id)}33)` }}
                      >
                        <Icon size={16} style={{ color: getCategoryColor(cat.id) }} />
                      </div>
                      <span className="font-medium text-[#14213D] text-[13px]">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#334155] max-w-xs truncate">{cat.description || '-'}</td>
                  <td className="px-5 py-4 text-[13px] text-[#14213D]">{cat.faqCount}</td>
                  <td className="px-5 py-4 text-[13px] text-[#14213D]">{cat.documentCount}</td>
                  <td className="px-5 py-4">
                    <span
                      className="badge text-[10px]"
                      style={cat.isActive
                        ? { background: i % 2 === 0 ? '#EFF6FF' : '#FFFFFF', color: '#1E5AA8', border: '1.5px solid #BFDBFE' }
                        : { background: '#F1F5F9', color: '#94A3B8', border: '1.5px solid transparent' }}
                    >
                      {cat.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => navigate(`/admin/categories/${cat.id}/edit`)}
                        className="p-1.5 rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteTarget(cat)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
        )}
      </div>
      )}

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="ยืนยันการลบหมวดหมู่"
        message={deleteTarget ? `ต้องการลบหมวดหมู่ "${deleteTarget.name}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
