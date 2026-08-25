import { useState } from 'react'
import { Search, UserCheck, UserX, Mail, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

type UserRole = 'student' | 'admin'
interface AdminUser {
  id: number; firstName: string; lastName: string; studentId: string
  email: string; faculty: string; role: UserRole; isActive: boolean; createdAt: string
}

const initUsers: AdminUser[] = [
  { id: 1, firstName: 'สมชาย',    lastName: 'ใจดี',      studentId: '65123456789', email: 'somchai.j@psu.ac.th',   faculty: 'วิทยาศาสตร์ฯ', role: 'student', isActive: true,  createdAt: '2026-08-01' },
  { id: 2, firstName: 'สมหญิง',   lastName: 'รักดี',     studentId: '65987654321', email: 'somying.r@psu.ac.th',   faculty: 'ศิลปศาสตร์ฯ',   role: 'student', isActive: true,  createdAt: '2026-08-02' },
  { id: 3, firstName: 'มานะ',     lastName: 'ขยันดี',    studentId: '66111222333', email: 'mana.k@psu.ac.th',      faculty: 'เทคโนโลยีฯ',    role: 'student', isActive: true,  createdAt: '2026-08-03' },
  { id: 4, firstName: 'วิไล',     lastName: 'สว่างใจ',   studentId: '66444555666', email: 'wilai.s@psu.ac.th',     faculty: 'พยาบาลศาสตร์',  role: 'student', isActive: false, createdAt: '2026-08-05' },
  { id: 5, firstName: 'Admin',    lastName: 'PSU',        studentId: '-',           email: 'admin@psu.ac.th',       faculty: '-',              role: 'admin',   isActive: true,  createdAt: '2026-01-01' },
  { id: 6, firstName: 'ประพล',    lastName: 'มีสุข',     studentId: '64333222111', email: 'prapol.m@psu.ac.th',    faculty: 'วิเทศศึกษา',    role: 'student', isActive: true,  createdAt: '2026-08-10' },
]


/**
 * AdminUsers — ตารางผู้ใช้งาน + จัดการสิทธิ์
 */
export default function AdminUsers() {
  const [users,      setUsers]      = useState<AdminUser[]>(initUsers)
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all')

  const filtered = users.filter(u => {
    const name  = `${u.firstName} ${u.lastName} ${u.studentId} ${u.email}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const toggleActive = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u))
    const user = users.find(u => u.id === id)!
    toast.success(`${user.isActive ? 'ระงับ' : 'เปิดใช้งาน'}บัญชี ${user.firstName} แล้ว`)
  }

  const changeRole = (id: number, role: UserRole) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u))
    toast.success('เปลี่ยนบทบาทผู้ใช้งานแล้ว')
  }

  const stats = {
    total:   users.length,
    active:  users.filter(u => u.isActive).length,
    admin:   users.filter(u => u.role === 'admin').length,
    student: users.filter(u => u.role === 'student').length,
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2E5E]">ผู้ใช้งาน</h1>
          <p className="text-sm text-[#64748B] mt-1">จัดการบัญชีและสิทธิ์ของผู้ใช้งานในระบบ</p>
        </div>
        {/* Quick stats */}
        <div className="flex gap-3">
          {[
            { label: 'ทั้งหมด', value: stats.total, color: '#1E5AA8', bg: '#EFF6FF' },
            { label: 'ใช้งาน', value: stats.active, color: '#059669', bg: '#ECFDF5' },
            { label: 'Admin',  value: stats.admin,  color: '#7C3AED', bg: '#F5F3FF' },
          ].map(s => (
            <div key={s.label} className="text-center px-4 py-2.5 rounded-xl" style={{ background: s.bg }}>
              <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs" style={{ color: s.color, opacity: 0.7 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, รหัส, Email..." id="users-search"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border outline-none text-[#14213D]"
            style={{ border: '1.5px solid #E2E8F0', background: '#fff' }} />
        </div>
        <div className="relative">
          <select
            id="users-role-filter"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as 'all' | UserRole)}
            className="pl-4 pr-8 py-2.5 rounded-xl text-sm border outline-none text-[#14213D] bg-white appearance-none cursor-pointer"
            style={{ border: '1.5px solid #E2E8F0', minWidth: 160 }}>
            <option value="all">ทุกบทบาท</option>
            <option value="student">นักศึกษา</option>
            <option value="admin">Admin</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden" style={{ borderRadius: '16px' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#F7F9FC', borderBottom: '1px solid #E2E8F0' }}>
                {['ผู้ใช้งาน', 'รหัสนักศึกษา', 'Email', 'คณะ', 'บทบาท', 'สถานะ', 'วันที่สมัคร', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-[#64748B] uppercase whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => (
                <tr key={user.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none', opacity: user.isActive ? 1 : 0.55 }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F7F9FC' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '' }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
                        style={{ width: 32, height: 32, background: user.role === 'admin' ? '#7C3AED' : '#1E5AA8' }}>
                        {user.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#14213D] text-xs">{user.firstName} {user.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#64748B] font-mono">{user.studentId}</td>
                  <td className="px-4 py-3.5">
                    <a href={`mailto:${user.email}`} className="flex items-center gap-1 text-xs text-[#1E5AA8] hover:underline">
                      <Mail size={11} />{user.email}
                    </a>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#64748B] whitespace-nowrap">{user.faculty}</td>
                  <td className="px-4 py-3.5">
                    <select value={user.role} onChange={e => changeRole(user.id, e.target.value as UserRole)}
                      className="text-xs border rounded-lg px-2 py-1 outline-none bg-white cursor-pointer"
                      style={{ border: '1px solid #E2E8F0' }}>
                      <option value="student">นักศึกษา</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
                      ${user.isActive ? 'text-green-600 bg-green-50' : 'text-[#94A3B8] bg-[#F1F5F9]'}`}>
                      {user.isActive ? <><UserCheck size={10} /> ใช้งาน</> : <><UserX size={10} /> ระงับ</>}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-[#94A3B8] whitespace-nowrap">{user.createdAt}</td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => toggleActive(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.isActive
                        ? 'text-red-500 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'}`}>
                      {user.isActive ? 'ระงับ' : 'เปิดใช้'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-[#64748B]">ไม่พบผู้ใช้งานที่ตรงกับการค้นหา</p>
          </div>
        )}
      </div>
    </div>
  )
}
