import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MessageSquare, ChevronLeft, Trash2, Bell, User, LogOut, ChevronUp, Home, AlertTriangle } from 'lucide-react'
import type { Conversation } from '@/types'
import { useAuth } from '@/context/AuthContext'

interface ChatSidebarProps {
  conversations:         Conversation[]
  activeConversationId:  number | null
  onNew:                 () => void
  onOpen:                (id: number) => void
  onDelete:              (id: number) => void
  onCollapse?:           () => void
}

/**
 * ChatSidebar — Sidebar ด้านซ้ายของหน้า Chat ตามแบบภาพตัวอย่าง
 */
export default function ChatSidebar({
  conversations,
  activeConversationId,
  onNew,
  onOpen,
  onDelete,
  onCollapse,
}: ChatSidebarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null)
  const { isAuthenticated, user, logout } = useAuth()

  const confirmDelete = () => {
    if (!deleteTarget) return
    onDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const handleLogout = () => {
    logout()
    // Hard redirect so chat state (messages, conversations) resets immediately
    // instead of leaving the previous user's data on screen.
    window.location.href = '/'
  }

  return (
    <aside
      className="flex flex-col h-full bg-[#062E66] text-white select-none"
      style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.08)' }}
      aria-label="ประวัติการสนทนา"
    >
      {/* ── 1. Top Section (class="px-4 pt-5 pb-3") ────────────────── */}
      <div className="px-4 pt-5 pb-3">
        {/* Top row: กลับหน้าหลัก + Collapse Button */}
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-medium group"
            aria-label="กลับหน้าหลัก"
          >
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Home size={14} className="text-white/80 group-hover:text-white" />
            </div>
            <span>กลับหน้าหลัก</span>
          </Link>

          <button
            onClick={onCollapse}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="ย่อแถบข้าง"
            title="ย่อแถบข้าง"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* New Chat Button (Figma / Image Style: Blue filled + icon) */}
        <button
          id="new-chat-button"
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#0B4DBA] hover:bg-[#1E40AF] transition-all duration-150 shadow-md cursor-pointer"
        >
          <Plus size={16} />
          <span>แชทใหม่</span>
        </button>
      </div>

      {/* ── 2. Conversation History (labels fixed, list scrolls independently) ── */}
      <div className="flex-1 min-h-0 flex flex-col px-3 py-2">
        <p className="text-[11px] font-medium text-white/50 px-2 mb-2 flex-shrink-0">
          ประวัติการสนทนา
        </p>
        <p className="text-[10px] text-white/35 px-2 mb-1.5 font-medium flex-shrink-0">
          เก่ากว่านั้น
        </p>

        <div className="flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {conversations.length === 0 ? (
            <div className="text-center py-6 text-white/30 text-xs">
              <p>ยังไม่มีบทสนทนา</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv) => {
                const isActive = activeConversationId === conv.id
                return (
                  <div
                    key={conv.id}
                    onClick={() => onOpen(conv.id)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                      isActive
                        ? 'bg-[#00224F] text-white font-medium shadow-inner'
                        : 'text-white/80 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <MessageSquare size={14} className="text-white/60 flex-shrink-0" />
                      <span className="truncate">{conv.title}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteTarget(conv)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-white/40 hover:text-red-400 rounded transition-opacity"
                      title="ลบการสนทนานี้"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Announcements Widget (fixed, never scrolls out of view) ──── */}
      <div className="flex-shrink-0 pt-3 pb-3 px-5 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/70 mb-2">
          <Bell size={14} className="text-[#60A5FA]" />
          <span>ประกาศและข่าวสาร</span>
        </div>
        <p className="text-[11px] text-white/40 mb-2">
          ยังไม่มีประกาศและข่าวสาร
        </p>
        <Link
          to="/announcements"
          className="text-[11px] text-[#60A5FA] hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>ดูประกาศทั้งหมด</span>
          <span>→</span>
        </Link>
      </div>

      {/* ── 3. Bottom Action Buttons & User Profile Bar ─────────────── */}
      <div className="p-3 bg-[#041F47] border-t border-white/10 space-y-2">
        {isAuthenticated && user ? (
          <>
            {/* Expandable Menu: Profile & Logout */}
            {isUserMenuOpen && (
              <div className="space-y-2 pb-1 animate-fade-in">
                <Link
                  to="/profile"
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-[#0B4DBA] hover:bg-[#1E40AF] transition-colors"
                >
                  <User size={14} />
                  <span>ดูข้อมูลส่วนตัว</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-white bg-[#0B4DBA] hover:bg-[#1E40AF] transition-colors"
                >
                  <LogOut size={14} />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            )}

            {/* User Card & Toggle Arrow */}
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors text-white text-left cursor-pointer group"
              aria-expanded={isUserMenuOpen}
              aria-label="เมนูผู้ใช้งาน"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#1E3A8A] flex items-center justify-center text-white flex-shrink-0 group-hover:bg-[#1E40AF] transition-colors">
                  <User size={15} />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-sm font-bold truncate">{user.firstName} {user.lastName}</p>
                  {user.studentId && (
                    <p className="text-xs text-white/50 truncate">รหัส: {user.studentId}</p>
                  )}
                </div>
              </div>
              <ChevronUp
                size={16}
                className={`text-white/50 group-hover:text-white transition-transform duration-200 ${
                  isUserMenuOpen ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
          </>
        ) : (
          /* Guest: ไม่ได้เข้าสู่ระบบ — ไม่มีประวัติการสนทนาให้จัดการ */
          <Link
            to="/login"
            className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors text-white"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 flex-shrink-0">
              <User size={15} />
            </div>
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-bold truncate">ผู้เยี่ยมชม</p>
              <p className="text-[10px] text-white/50 truncate">เข้าสู่ระบบเพื่อบันทึกประวัติแชท</p>
            </div>
          </Link>
        )}
      </div>

      {deleteTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.5)' }}
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div
              className="flex items-center justify-center rounded-full mb-4 mx-auto"
              style={{ width: 48, height: 48, background: '#FEF2F2' }}
            >
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="text-center font-bold text-[#14213D] text-base mb-1.5">ยืนยันการลบการสนทนา</h3>
            <p className="text-center text-sm text-[#64748B] mb-6 leading-relaxed">
              ต้องการลบ "{deleteTarget.title}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F7F9FC] transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
