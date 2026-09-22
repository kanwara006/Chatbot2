import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, Mail, MailOpen, Eye, Trash2, X, CalendarDays, Reply, IdCard, Tag, MessageSquareText, Send, CheckCircle2, AlertTriangle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  fetchContactMessages,
  markContactMessageRead,
  deleteContactMessage,
  replyToContactMessage,
  type ContactMessage,
} from '@/services/contactService'
import { extractErrorMessage } from '@/services/authService'
import { formatThaiDate } from '@/utils/date'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog'

const THEME = '#0B2E5E'

/**
 * AdminContactMessages — กล่องข้อความติดต่อจากฟอร์ม "ติดต่อเรา" หน้าเว็บไซต์
 */
export default function AdminContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread'>('all')
  const [viewing, setViewing] = useState<ContactMessage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const items = await fetchContactMessages()
      setMessages(items)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'โหลดข้อความติดต่อไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const haystack = `${m.fullName} ${m.email} ${m.subject || ''} ${m.message}`.toLowerCase()
      const matchSearch = !search || haystack.includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || !m.isRead
      return matchSearch && matchStatus
    })
  }, [messages, search, statusFilter])

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => !m.isRead).length,
  }

  const openMessage = async (msg: ContactMessage) => {
    setViewing(msg)
    setReplyText('')
    if (!msg.isRead) {
      try {
        const updated = await markContactMessageRead(msg.id)
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      } catch {
        // เงียบไว้ — ไม่กระทบการดูข้อความ แค่สถานะอ่านแล้วอาจไม่อัปเดต
      }
    }
  }

  const handleSendReply = async () => {
    if (!viewing || !replyText.trim()) return
    setSendingReply(true)
    try {
      const updated = await replyToContactMessage(viewing.id, replyText.trim())
      setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      setViewing(updated)
      setReplyText('')
      if (updated.emailSent) {
        toast.success('ส่งอีเมลตอบกลับเรียบร้อยแล้ว')
      } else {
        toast('บันทึกคำตอบแล้ว แต่ยังไม่ได้ส่งอีเมล (ระบบยังไม่ได้ตั้งค่า SMTP)', { icon: '⚠️' })
      }
    } catch (err) {
      toast.error(extractErrorMessage(err, 'ส่งคำตอบไม่สำเร็จ'))
    } finally {
      setSendingReply(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteContactMessage(deleteTarget.id)
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id))
      toast.success('ลบข้อความแล้ว')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(extractErrorMessage(err, 'ลบไม่สำเร็จ'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <AdminPageHeader
        title="จัดการข้อความติดต่อ"
        subtitle="ข้อความที่ผู้ใช้งานส่งเข้ามาจากฟอร์มติดต่อเราในหน้าเว็บไซต์"
        icon={Mail}
        color={THEME}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <AdminStatCard icon={Mail} label="ข้อความทั้งหมด" value={stats.total.toLocaleString()} color="#0E7490" delay={0} variant="vivid" />
        <AdminStatCard icon={MailOpen} label="ยังไม่ได้อ่าน" value={stats.unread.toLocaleString()} color="#1E5AA8" delay={0.05} variant="vivid" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ, อีเมล, หัวข้อ, ข้อความ..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[13px] border outline-none text-[#14213D] transition-shadow focus:shadow-[0_0_0_3px_rgba(11,46,94,0.12)]"
            style={{ border: '1.5px solid #E2E8F0', background: '#fff' }}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'unread'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                statusFilter === s ? 'text-white' : 'text-[#5F6673] bg-[#F7F8FA] border border-[#E2E8F0] hover:bg-[#EFF4FA]'
              }`}
              style={statusFilter === s ? { background: THEME } : undefined}
            >
              {s === 'all' ? 'ทั้งหมด' : 'ยังไม่อ่าน'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <AdminLoadingState />
      ) : (
        <div className="admin-card overflow-hidden">
          {filtered.length === 0 ? (
            <AdminEmptyState icon={Mail} title="ยังไม่มีข้อความติดต่อ" subtitle="ข้อความจากฟอร์มติดต่อเราจะปรากฏที่นี่" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ background: '#1E5AA8' }}>
                    {['ผู้ส่ง', 'หัวข้อ / ข้อความ', 'วันที่ส่ง', 'สถานะ', 'จัดการ'].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-[13px] font-semibold text-white uppercase whitespace-nowrap" style={{ letterSpacing: '0.04em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((msg, idx) => (
                    <motion.tr
                      key={msg.id}
                      style={{
                        borderBottom: idx < filtered.length - 1 ? '1px solid #F1F5F9' : 'none',
                        background: !msg.isRead ? `${THEME}06` : undefined,
                      }}
                      className={`transition-all hover:-translate-y-0.5 cursor-pointer ${
                        msg.isRead ? (idx % 2 === 0 ? 'bg-white' : 'bg-[#F2F5F9]') : ''
                      }`}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: idx * 0.03 }}
                      onClick={() => openMessage(msg)}
                    >
                      <td className="px-5 py-4 min-w-0" style={{ width: '22%' }}>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex-shrink-0 flex items-center justify-center rounded-full text-white text-[13px] font-bold"
                            style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${THEME}, #1E5AA8)` }}
                          >
                            {msg.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-[13px] truncate ${msg.isRead ? 'font-medium text-[#334155]' : 'font-bold text-[#14213D]'}`}>{msg.fullName}</p>
                            <p className="text-[13px] text-[#94A3B8] truncate">{msg.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 min-w-0">
                        <p className={`text-[13px] mb-0.5 truncate ${msg.isRead ? 'text-[#334155]' : 'font-semibold text-[#14213D]'}`}>{msg.subject || 'ไม่มีหัวข้อ'}</p>
                        <p className="text-[13px] text-[#94A3B8] line-clamp-1">{msg.message}</p>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-[#475569] whitespace-nowrap">{formatThaiDate(msg.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap"
                            style={msg.isRead
                              // แถวอ่านแล้วเป็นลายสลับสีตามปกติ (ขาว/เทาอ่อน) — ป้ายจึงสลับตามแถวได้
                              ? { color: '#94A3B8', background: idx % 2 === 0 ? '#F1F5F9' : '#FFFFFF', border: '1.5px solid #E2E8F0' }
                              // แถวยังไม่อ่านพื้นหลังเป็นสีทึม (ไม่ใช่ขาว) เสมอ ไม่ว่าแถวคู่หรือคี่ ป้ายจึงเป็นสีขาวเสมอให้ตัดกับพื้นแถว
                              : { color: '#1E5AA8', background: '#FFFFFF', border: '1.5px solid #BFDBFE' }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: msg.isRead ? '#CBD5E1' : '#1E5AA8' }} />
                            {msg.isRead ? 'อ่านแล้ว' : 'ยังไม่อ่าน'}
                          </span>
                          {msg.adminReply && (
                            <span
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap"
                              style={{ color: '#15803D', background: '#F0FDF4', border: '1.5px solid #BBF7D0' }}
                            >
                              <CheckCircle2 size={12} />
                              ตอบแล้ว
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => openMessage(msg)}
                            className="p-2 rounded-lg text-[#94A3B8] hover:text-[#1E5AA8] hover:bg-[#EFF6FF] transition-all"
                            title="ดูข้อความ"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(msg)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                            title="ลบข้อความ"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Message Detail Modal */}
      <AnimatePresence>
        {viewing && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.55)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewing(null)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-xl overflow-hidden flex flex-col"
              style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.3)', maxHeight: '85vh' }}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div
                className="flex items-start justify-between gap-3 p-6"
                style={{ background: `linear-gradient(135deg, ${THEME}14 0%, ${THEME}05 60%, transparent 100%)`, borderBottom: '1px solid #EDF2F7' }}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full text-white font-bold text-lg"
                    style={{ width: 50, height: 50, background: `linear-gradient(135deg, ${THEME}, #1E5AA8)`, boxShadow: `0 6px 16px ${THEME}40` }}
                  >
                    {viewing.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-bold text-[#14213D] text-base truncate mb-1">{viewing.fullName}</p>
                    <a
                      href={`mailto:${viewing.email}`}
                      className="inline-flex items-center gap-1.5 text-[13px] text-[#1E5AA8] hover:underline truncate mb-2"
                    >
                      <Mail size={12} className="flex-shrink-0" />
                      {viewing.email}
                    </a>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1 text-[13px] text-[#94A3B8]">
                        <CalendarDays size={12} />
                        {formatThaiDate(viewing.createdAt)}
                      </span>
                      {viewing.studentId && (
                        <span className="inline-flex items-center gap-1 text-[13px] text-[#94A3B8]">
                          <IdCard size={12} />
                          รหัสนักศึกษา {viewing.studentId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewing(null)}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors"
                  aria-label="ปิด"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8] mb-2">
                    <Tag size={12} />
                    หัวข้อเรื่อง
                  </p>
                  <h3 className="text-lg font-bold text-[#111827] leading-snug">
                    {viewing.subject || 'ไม่มีหัวข้อ'}
                  </h3>
                </div>

                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)',
                    border: '1px solid #E2E8F0',
                    borderLeft: `4px solid ${THEME}`,
                  }}
                >
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8] mb-3">
                    <MessageSquareText size={12} />
                    ข้อความ
                  </p>
                  <p className="text-[15px] text-black leading-[1.8] whitespace-pre-wrap">{viewing.message}</p>
                </div>

                {viewing.adminReply && (
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderLeft: '4px solid #16A34A' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#15803D]">
                        <CheckCircle2 size={12} />
                        ตอบกลับแล้ว {viewing.repliedBy ? `โดย ${viewing.repliedBy}` : ''}
                      </p>
                      {viewing.repliedAt && (
                        <span className="text-[11px] text-[#4D7C0F]">{formatThaiDate(viewing.repliedAt)}</span>
                      )}
                    </div>
                    <p className="text-[14px] text-[#14532D] leading-[1.8] whitespace-pre-wrap">{viewing.adminReply}</p>
                  </div>
                )}

                {/* Reply Composer */}
                <div>
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8] mb-2">
                    <Reply size={12} />
                    {viewing.adminReply ? 'ส่งคำตอบเพิ่มเติม' : 'ตอบกลับข้อความนี้'}
                  </p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="พิมพ์ข้อความตอบกลับถึงผู้ส่ง..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-[14px] text-[#14213D] outline-none resize-none transition-shadow focus:shadow-[0_0_0_3px_rgba(11,46,94,0.12)]"
                    style={{ border: '1.5px solid #E2E8F0', background: '#fff' }}
                  />
                  <p className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] mt-1.5">
                    <AlertTriangle size={11} />
                    ระบบจะส่งคำตอบนี้ไปยังอีเมล {viewing.email} โดยอัตโนมัติ
                  </p>
                </div>
              </div>

              <div className="p-5 pt-4 flex justify-end" style={{ borderTop: '1px solid #F1F5F9' }}>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sendingReply}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-white rounded-xl transition-shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  style={{ padding: '10px 20px', background: `linear-gradient(135deg, ${THEME}, #1E5AA8)`, boxShadow: `0 8px 20px ${THEME}30` }}
                >
                  <Send size={15} />
                  {sendingReply ? 'กำลังส่ง...' : 'ส่งคำตอบ'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminConfirmDialog
        open={!!deleteTarget}
        title="ยืนยันการลบข้อความ"
        message={deleteTarget ? `ต้องการลบข้อความจาก "${deleteTarget.fullName}" ใช่หรือไม่? การลบไม่สามารถย้อนกลับได้` : ''}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
