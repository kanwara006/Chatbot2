import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Megaphone, HelpCircle, FolderOpen,
  Users, BarChart3, ChevronLeft, ChevronRight, Mail,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const navSections = [
  {
    label: 'ภาพรวม',
    items: [
      { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    ],
  },
  {
    label: 'จัดการเนื้อหา',
    items: [
      { to: '/admin/faq', icon: HelpCircle, label: 'จัดการคำถาม-คำตอบ', end: false },
      { to: '/admin/categories', icon: FolderOpen, label: 'จัดการหมวดหมู่', end: false },
      { to: '/admin/documents', icon: FileText, label: 'จัดการเอกสาร/ฐานความรู้', end: false },
      { to: '/admin/announcements', icon: Megaphone, label: 'จัดการข่าวสารและประกาศ', end: false },
    ],
  },
  {
    label: 'ผู้ใช้งานและรายงาน',
    items: [
      { to: '/admin/users', icon: Users, label: 'จัดการผู้ใช้', end: false },
      { to: '/admin/contact', icon: Mail, label: 'จัดการข้อความติดต่อ', end: false },
      { to: '/admin/reports', icon: BarChart3, label: 'รายงานและสถิติ', end: false },
    ],
  },
]

/**
 * AdminSidebar — Sidebar สำหรับ Admin Panel (ตาม design-reference)
 */
export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width: collapsed ? 64 : 264,
        background: 'linear-gradient(180deg, #0B2E5E 0%, #082347 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
      }}
    >
      {/* ── Collapse Toggle ─────────────────────────────────────── */}
      <div className="flex justify-end px-2 pt-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
          aria-label={collapsed ? 'ขยาย sidebar' : 'ย่อ sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="flex-1 px-2.5 py-2 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase text-white/50" style={{ letterSpacing: '0.08em' }}>
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) => `
                    relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
                    transition-all duration-150 group
                    ${isActive
                      ? 'bg-white/12 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/[0.06]'
                    }
                  `}
                  title={collapsed ? label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[#60A5FA]" />
                      )}
                      <Icon size={17} className="flex-shrink-0" />
                      {!collapsed && <span className="truncate">{label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div
        className="px-2.5 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Admin info */}
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-sm font-bold"
              style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #1E5AA8, #3B82F6)' }}
            >
              {user?.firstName?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-white/50 text-xs truncate">เข้าสู่ระบบในชื่อ</p>
              <p className="text-white text-sm font-semibold truncate">
                {user ? user.firstName : 'Admin'}
              </p>
            </div>
            <span className="flex items-center gap-1 text-xs text-green-400 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              online
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}
