import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, User as UserIcon, ChevronDown, LogOut, Mail } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/common/Logo'
import { fetchContactMessages, type ContactMessage } from '@/services/contactService'
import { formatThaiDate } from '@/utils/date'

const NOTIF_POLL_MS = 20_000

/**
 * AdminTopNavbar — แถบด้านบนของทุกหน้า Admin (ตาม design-reference)
 */
export default function AdminTopNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    // Hard redirect so admin state resets immediately instead of leaving stale data around.
    window.location.href = '/admin/login'
  }

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadUnread = () => {
      fetchContactMessages()
        .then((items) => {
          if (!cancelled) setUnreadMessages(items.filter((m) => !m.isRead))
        })
        .catch(() => {})
    }
    loadUnread()
    const timer = setInterval(loadUnread, NOTIF_POLL_MS)
    window.addEventListener('contact-messages-updated', loadUnread)
    return () => {
      cancelled = true
      clearInterval(timer)
      window.removeEventListener('contact-messages-updated', loadUnread)
    }
  }, [])

  const unreadCount = unreadMessages.length

  const goToContactMessages = () => {
    setNotifOpen(false)
    navigate('/admin/contact')
  }

  return (
    <header
      className="flex items-center justify-between px-6 py-3 bg-white flex-shrink-0 z-10"
      style={{ borderBottom: '1px solid #E9EEF5', boxShadow: '0 1px 3px rgba(11,46,94,0.04)' }}
    >
      <Link to="/admin" className="flex items-center gap-3" aria-label="ไปยังหน้า Dashboard">
        <Logo size={44} />
        <div className="leading-tight">
          <p className="text-base font-bold text-[#0B2E5E]">มหาวิทยาลัยสงขลานครินทร์</p>
          <p className="text-sm text-[#64748B]">วิทยาเขตสุราษฎร์ธานี</p>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2.5 rounded-xl text-[#64748B] hover:text-[#1E5AA8] hover:bg-[#EFF6FF] transition-colors"
            aria-label="การแจ้งเตือน"
            aria-expanded={notifOpen}
            aria-haspopup="true"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-white font-bold"
                style={{ minWidth: 17, height: 17, padding: '0 4px', fontSize: '10px', background: '#DC2626', border: '1.5px solid #fff' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-[#DDE2EA] shadow-[0_8px_24px_rgba(6,46,102,0.12)] overflow-hidden animate-fade-in z-50"
            >
              <div className="px-4 py-3 flex items-center justify-between border-b border-[#EDF2F7]">
                <p className="text-sm font-bold text-[#14213D]">การแจ้งเตือน</p>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-semibold text-[#1E5AA8]">{unreadCount} ข้อความใหม่</span>
                )}
              </div>

              {unreadCount === 0 ? (
                <div className="py-8 px-4 text-center">
                  <p className="text-xs text-[#94A3B8]">ไม่มีข้อความติดต่อใหม่</p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {unreadMessages.slice(0, 6).map((m) => (
                    <button
                      key={m.id}
                      onClick={goToContactMessages}
                      className="flex items-start gap-3 w-full px-4 py-3 text-left border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#F7F9FC] transition-colors"
                    >
                      <div
                        className="flex-shrink-0 flex items-center justify-center rounded-full text-white"
                        style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)' }}
                      >
                        <Mail size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[#14213D] truncate">{m.fullName}</p>
                        <p className="text-xs text-[#64748B] truncate">{m.subject || m.message}</p>
                        <p className="text-[10px] text-[#94A3B8] mt-0.5">{formatThaiDate(m.createdAt)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={goToContactMessages}
                className="block w-full py-2.5 text-center text-xs font-semibold text-[#1E5AA8] hover:bg-[#EFF6FF] transition-colors border-t border-[#EDF2F7]"
              >
                ดูข้อความติดต่อทั้งหมด
              </button>
            </div>
          )}
        </div>

        <div className="w-px h-7 bg-[#EDF2F7]" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl cursor-pointer hover:bg-[#F7F9FC] transition-colors"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)' }}
            >
              <UserIcon size={16} />
            </div>
            <div className="leading-tight text-left hidden sm:block">
              <p className="text-sm font-bold text-[#14213D]">
                {user ? `${user.firstName} ${user.lastName}` : 'ผู้ดูแลระบบ'}
              </p>
              <p className="text-xs font-medium text-[#64748B]">Administrator</p>
            </div>
            <ChevronDown size={14} className={`text-[#94A3B8] transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl border border-[#DDE2EA] shadow-[0_8px_24px_rgba(6,46,102,0.12)] py-1.5 animate-fade-in z-50"
            >
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
              >
                <LogOut size={15} />
                ออกจากระบบ
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
