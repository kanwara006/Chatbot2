import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Megaphone, HelpCircle,
  Users, MessageSquare, LogOut, ChevronLeft, ChevronRight,
  Bot,
} from 'lucide-react'

const navItems = [
  { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard',       end: true },
  { to: '/admin/documents',  icon: FileText,        label: 'Knowledge Base' },
  { to: '/admin/announcements', icon: Megaphone,    label: 'ประกาศ' },
  { to: '/admin/faq',        icon: HelpCircle,      label: 'FAQ' },
  { to: '/admin/users',      icon: Users,           label: 'ผู้ใช้งาน' },
  { to: '/admin/chats',      icon: MessageSquare,   label: 'ประวัติ Chat' },
]

/**
 * AdminSidebar — Sidebar สำหรับ Admin Panel
 *
 * Input:  ไม่มี Props
 * Output: Navigation sidebar พร้อม collapsible mode
 */
export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  return (
    <aside
      className="flex flex-col h-full transition-all duration-300"
      style={{
        width:       collapsed ? 64 : 240,
        background:  '#0B2E5E',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        flexShrink:  0,
      }}
    >
      {/* ── Brand ───────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-4 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-lg"
              style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.12)' }}
            >
              <Bot size={17} className="text-white" />
            </div>
            <div className="leading-tight overflow-hidden">
              <p className="text-white text-xs font-bold truncate">PSU SLF Admin</p>
              <p className="text-white/40 text-[10px] truncate">ระบบจัดการ</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all duration-150"
          aria-label={collapsed ? 'ขยาย sidebar' : 'ย่อ sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150 group
              ${isActive
                ? 'bg-white/15 text-white'
                : 'text-white/55 hover:text-white hover:bg-white/08'
              }
            `}
            title={collapsed ? label : undefined}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div
        className="px-2 py-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Admin info */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 mb-2">
            <div
              className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ width: 30, height: 30, background: '#1E5AA8' }}
            >
              A
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-xs font-semibold truncate">Admin</p>
              <p className="text-white/40 text-[10px] truncate">admin@psu.ac.th</p>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/55 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          title={collapsed ? 'ออกจากระบบ' : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  )
}
