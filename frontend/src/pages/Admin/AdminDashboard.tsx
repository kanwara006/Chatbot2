import { Users, MessageSquare, FileText, TrendingUp, ThumbsUp, AlertCircle, HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// ── Mock Stats ──────────────────────────────────────────────────────
const stats = [
  {
    id: 'users', label: 'จำนวนผู้ใช้งาน', value: '248',
    change: '+12 เดือนนี้', icon: Users, color: '#1E5AA8', bg: '#EFF6FF',
  },
  {
    id: 'questions', label: 'คำถามทั้งหมด', value: '1,842',
    change: '+134 เดือนนี้', icon: MessageSquare, color: '#7C3AED', bg: '#F5F3FF',
  },
  {
    id: 'conversations', label: 'บทสนทนา', value: '573',
    change: '+43 เดือนนี้', icon: TrendingUp, color: '#059669', bg: '#ECFDF5',
  },
  {
    id: 'documents', label: 'เอกสาร KB', value: '24',
    change: 'พร้อมใช้งาน 22 ชิ้น', icon: FileText, color: '#D97706', bg: '#FFFBEB',
  },
]

// ── Mock Popular Questions ──────────────────────────────────────────
const popularQuestions = [
  { q: 'ผู้กู้รายเก่าต้องดำเนินการอย่างไร?',   count: 234, positive: 88 },
  { q: 'ต้องใช้เอกสารอะไรบ้าง?',               count: 198, positive: 92 },
  { q: 'ต้องทำจิตอาสากี่ชั่วโมง?',             count: 176, positive: 85 },
  { q: 'กำหนดการกู้ยืมปี 2569 มีวันไหน?',      count: 143, positive: 79 },
  { q: 'วิธีสมัครกู้ยืม กยศ. สำหรับรายใหม่?', count: 121, positive: 90 },
]

// ── Mock Unanswered ─────────────────────────────────────────────────
const unanswered = [
  { q: 'ถ้ารายได้ครอบครัวเกินกำหนดแต่มีรายจ่ายสูงจะขอกู้ได้ไหม?', date: '19 ส.ค. 2569' },
  { q: 'การยืนยันการเบิกเงินค่าครองชีพต้องทำผ่านช่องทางไหน?',       date: '18 ส.ค. 2569' },
  { q: 'กรณีผิดนัดชำระหนี้สามารถขอผ่อนผันได้ไหม?',                 date: '17 ส.ค. 2569' },
]

// Stat card component
function StatCard({ stat, delay }: { stat: typeof stats[0]; delay: number }) {
  const Icon = stat.icon
  return (
    <motion.div
      className="card p-5"
      style={{ borderRadius: '16px' }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex items-center justify-center rounded-xl"
          style={{ width: 44, height: 44, background: stat.bg }}
        >
          <Icon size={20} style={{ color: stat.color }} />
        </div>
        <span className="text-xs text-[#10B981] font-medium bg-green-50 px-2 py-1 rounded-lg">
          {stat.change}
        </span>
      </div>
      <p className="text-2xl font-bold text-[#14213D]">{stat.value}</p>
      <p className="text-sm text-[#64748B] mt-0.5">{stat.label}</p>
    </motion.div>
  )
}

/**
 * AdminDashboard — หน้าหลัก Admin
 *
 * แสดง: Stats, Popular Questions, Unanswered Questions, Quick Actions
 */
export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0B2E5E]">Dashboard</h1>
        <p className="text-sm text-[#64748B] mt-1">ภาพรวมระบบ PSU SLF AI Chatbot</p>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => <StatCard key={s.id} stat={s} delay={i * 0.08} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Popular Questions ─────────────────────────────────── */}
        <div className="xl:col-span-2 card p-6" style={{ borderRadius: '16px' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-[#14213D]">คำถามยอดนิยม</h2>
            <span className="badge badge-blue">เดือนนี้</span>
          </div>

          <div className="space-y-3">
            {popularQuestions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 rounded-xl"
                style={{ background: '#F7F9FC' }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-lg text-xs font-bold"
                  style={{
                    width:      32,
                    height:     32,
                    background: idx === 0 ? '#0B2E5E' : idx === 1 ? '#1E5AA8' : '#E2E8F0',
                    color:      idx < 2 ? '#fff' : '#64748B',
                  }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#14213D] truncate">{item.q}</p>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{item.count} ครั้ง</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-green-600 flex-shrink-0">
                  <ThumbsUp size={11} />
                  {item.positive}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Unanswered questions */}
          <div className="card p-5" style={{ borderRadius: '16px' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={16} className="text-amber-500" />
              <h3 className="font-bold text-[#14213D] text-sm">คำถามที่ AI ตอบไม่ได้</h3>
            </div>
            <div className="space-y-3">
              {unanswered.map((item, i) => (
                <div key={i} className="border-l-2 pl-3" style={{ borderColor: '#FCD34D' }}>
                  <p className="text-xs text-[#14213D] leading-snug">{item.q}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{item.date}</p>
                </div>
              ))}
            </div>
            <Link
              to="/admin/documents"
              className="flex items-center justify-center gap-1.5 mt-4 py-2 rounded-lg text-xs font-semibold text-[#1E5AA8] bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors"
            >
              <FileText size={12} />
              เพิ่มเอกสาร Knowledge Base
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="card p-5" style={{ borderRadius: '16px' }}>
            <h3 className="font-bold text-[#14213D] text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/admin/documents',     icon: FileText,   label: 'Upload เอกสาร',   color: '#1E5AA8', bg: '#EFF6FF' },
                { to: '/admin/announcements', icon: HelpCircle, label: 'เพิ่มประกาศ',     color: '#7C3AED', bg: '#F5F3FF' },
                { to: '/admin/faq',           icon: HelpCircle, label: 'เพิ่ม FAQ ใหม่',  color: '#059669', bg: '#ECFDF5' },
              ].map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                    style={{ background: '#F7F9FC' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = action.bg }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#F7F9FC' }}
                  >
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded-lg"
                      style={{ width: 30, height: 30, background: action.bg }}
                    >
                      <Icon size={14} style={{ color: action.color }} />
                    </div>
                    <span className="text-sm text-[#14213D] group-hover:text-[#0B2E5E] font-medium">
                      {action.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
