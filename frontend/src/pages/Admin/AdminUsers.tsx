import { useState, useEffect, useCallback } from 'react'
import { Search, UserCheck, UserX, Mail, ChevronDown, Users as UsersIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { fetchUsers, updateUser, type AdminUserView } from '@/services/userService'
import { extractErrorMessage } from '@/services/authService'
import { formatThaiDate } from '@/utils/date'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog'

type UserRole = 'student' | 'admin'
type AdminUser = AdminUserView

/**
 * AdminUsers — ตารางผู้ใช้งาน + จัดการสิทธิ์
 */
export default function AdminUsers() {
  const [users,      setUsers]      = useState<AdminUser[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')
  const [roleChangeTarget, setRoleChangeTarget] = useState<{ user: AdminUser; newRole: UserRole } | null>(null)
  const [changingRole, setChangingRole] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const items = await fetchUsers()
      setUsers(items)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'โหลดข้อมูลผู้ใช้งานไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = users.filter(u => {
    const name  = `${u.firstName} ${u.lastName} ${u.studentId} ${u.email}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const toggleActive = async (id: number) => {
    const user = users.find(u => u.id === id)
    if (!user) return
    try {
      const updated = await updateUser(id, { is_active: !user.isActive })
      setUsers(prev => prev.map(u => u.id === id ? updated : u))
      toast.success(`${user.isActive ? 'ระงับ' : 'เปิดใช้งาน'}บัญชี ${user.firstName} แล้ว`)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'เปลี่ยนสถานะไม่สำเร็จ'))
    }
  }

  const requestRoleChange = (user: AdminUser, newRole: UserRole) => {
    if (newRole === user.role) return
    setRoleChangeTarget({ user, newRole })
  }

  const confirmRoleChange = async () => {
    if (!roleChangeTarget) return
    const { user, newRole } = roleChangeTarget
    setChangingRole(true)
    try {
      const updated = await updateUser(user.id, { role: newRole })
      setUsers(prev => prev.map(u => u.id === user.id ? updated : u))
      toast.success('เปลี่ยนบทบาทผู้ใช้งานแล้ว')
      setRoleChangeTarget(null)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'เปลี่ยนบทบาทไม่สำเร็จ'))
    } finally {
      setChangingRole(false)
    }
  }

  const stats = {
    total:   users.length,
    active:  users.filter(u => u.isActive).length,
    admin:   users.filter(u => u.role === 'admin').length,
  }

  return (
    <div className="p-6 lg:p-8">
      <AdminPageHeader title="จัดการผู้ใช้งาน" subtitle="จัดการบัญชีและสิทธิ์ของผู้ใช้งานในระบบ" icon={UsersIcon} color="#0B2E5E" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AdminStatCard icon={UsersIcon} label="ผู้ใช้งานทั้งหมด" value={stats.total.toLocaleString()} color="#4F46E5" delay={0} variant="vivid" />
        <AdminStatCard icon={UserCheck} label="ใช้งานอยู่" value={stats.active.toLocaleString()} color="#1E5AA8" delay={0.05} variant="vivid" />
        <AdminStatCard icon={UsersIcon} label="ผู้ดูแลระบบ" value={stats.admin.toLocaleString()} color="#0E7490" delay={0.1} variant="vivid" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, รหัส, Email..." id="users-search"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] transition-shadow focus:border-[#0B2E5E] focus:shadow-[0_0_0_3px_rgba(11,46,94,0.12)]"
            style={{ border: '1.5px solid #E2E8F0', background: '#fff' }} />
        </div>
        <div className="relative">
          <select
            id="users-role-filter"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as 'all' | UserRole)}
            className="pl-4 pr-8 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] bg-white appearance-none cursor-pointer"
            style={{ border: '1.5px solid #E2E8F0', minWidth: 160 }}>
            <option value="all">ทุกบทบาท</option>
            <option value="student">นักศึกษา</option>
            <option value="admin">Admin</option>
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
          <AdminEmptyState icon={UsersIcon} title="ไม่พบผู้ใช้งานที่ตรงกับการค้นหา" />
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: '#1E5AA8' }}>
                {['ผู้ใช้งาน', 'รหัสนักศึกษา', 'Email', 'คณะ', 'บทบาท', 'สถานะ', 'วันที่สมัคร', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[13px] font-semibold text-white uppercase whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <motion.tr key={user.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', opacity: user.isActive ? 1 : 0.55 }}
                  className={`transition-all hover:-translate-y-0.5 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F2F5F9]'}`}
                  initial={{ opacity: 0 }} animate={{ opacity: user.isActive ? 1 : 0.55 }} transition={{ duration: 0.2, delay: i * 0.03 }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-[13px] font-bold"
                        style={{ width: 32, height: 32, background: user.role === 'admin' ? 'linear-gradient(135deg, #7C3AED, #A78BFA)' : 'linear-gradient(135deg, #0B2E5E, #1E5AA8)' }}>
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#14213D] text-[13px]">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-[#334155]">{user.studentId}</td>
                  <td className="px-4 py-3.5">
                    <a href={`mailto:${user.email}`} className="flex items-center gap-1 text-[13px] text-[#1E5AA8] hover:underline">
                      <Mail size={11} />{user.email}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-[#334155] whitespace-nowrap">{user.faculty}</td>
                  <td className="px-4 py-3.5">
                    {(() => {
                      const isWhiteRow = i % 2 === 0
                      const roleColor = user.role === 'admin' ? '#4F46E5' : '#1E5AA8'
                      const roleTint = user.role === 'admin' ? '#EEF2FF' : '#EFF6FF'
                      const roleBorder = user.role === 'admin' ? '#C7D2FE' : '#BFDBFE'
                      return (
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            onChange={e => requestRoleChange(user, e.target.value as UserRole)}
                            className="text-[13px] font-semibold rounded-full pl-3 pr-7 py-1.5 outline-none cursor-pointer appearance-none transition-all"
                            style={{
                              background: isWhiteRow ? roleTint : '#FFFFFF',
                              color: roleColor,
                              border: `1.5px solid ${roleBorder}`,
                            }}
                          >
                            <option value="student">นักศึกษา</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown
                            size={12}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{ color: roleColor }}
                          />
                        </div>
                      )
                    })()}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[13px] font-medium"
                      style={user.isActive
                        ? { background: i % 2 === 0 ? '#EFF6FF' : '#FFFFFF', color: '#1E5AA8', border: '1.5px solid #BFDBFE' }
                        : { background: '#F1F5F9', color: '#94A3B8', border: '1.5px solid transparent' }}
                    >
                      {user.isActive ? <><UserCheck size={10} /> ใช้งาน</> : <><UserX size={10} /> ระงับ</>}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-[#475569] whitespace-nowrap">{formatThaiDate(user.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${user.isActive
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'}`}>
                      {user.isActive ? 'ระงับ' : 'เปิดใช้'}
                    </button>
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
        open={!!roleChangeTarget}
        title="ยืนยันการเปลี่ยนบทบาท"
        message={roleChangeTarget
          ? `ต้องการเปลี่ยนบทบาทของ "${roleChangeTarget.user.firstName} ${roleChangeTarget.user.lastName}" เป็น "${roleChangeTarget.newRole === 'admin' ? 'Admin' : 'นักศึกษา'}" ใช่หรือไม่?`
          : ''}
        confirmText="ยืนยันเปลี่ยนบทบาท"
        loadingText="กำลังเปลี่ยนบทบาท..."
        loading={changingRole}
        onConfirm={confirmRoleChange}
        onCancel={() => setRoleChangeTarget(null)}
      />
    </div>
  )
}
