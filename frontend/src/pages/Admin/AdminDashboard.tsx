import { useState, useEffect } from 'react'
import { MessageSquare, CheckCircle2, Smile, FileText, MessageCircleQuestion, TrendingUp, PieChart as PieChartIcon, Clock, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  fetchDashboardStats, fetchUsageTrend, fetchCategoryBreakdown,
  fetchRecentQuestions, fetchRecentDocuments,
  type DashboardStats, type UsageTrendPoint, type CategoryBreakdown, type RecentQuestion, type RecentDocument,
} from '@/services/dashboardService'
import { extractErrorMessage } from '@/services/authService'
import { formatThaiDate } from '@/utils/date'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'
import mascotImg from '@/assets/dashboard-mascot.png'

const PIE_COLORS = ['#1E5AA8', '#059669', '#D97706', '#7C3AED', '#EF4444', '#94A3B8']

/** Tooltip แบบกำหนดเอง ให้เข้ากับดีไซน์การ์ดของระบบ แทน tooltip เริ่มต้นของ recharts */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { color?: string; name?: string; value?: number | string; dataKey?: string }[]; label?: string }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-xl bg-white px-3.5 py-2.5" style={{ boxShadow: '0 8px 24px rgba(15,23,42,0.14)', border: '1px solid #EDF2F7' }}>
      {label && <p className="text-[11px] font-semibold text-[#94A3B8] mb-1.5">{formatThaiDate(label)}</p>}
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
            <span className="text-[#64748B]">{p.name}:</span>
            <span className="font-semibold text-[#14213D]">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * AdminDashboard — หน้าหลัก Admin (ตาม design-reference: admin_dashboard.png)
 */
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [trend, setTrend] = useState<UsageTrendPoint[]>([])
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([])
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([])
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchDashboardStats(),
      fetchUsageTrend(7),
      fetchCategoryBreakdown(),
      fetchRecentQuestions(5),
      fetchRecentDocuments(5),
    ])
      .then(([s, t, b, q, d]) => {
        setStats(s)
        setTrend(t)
        setBreakdown(b)
        setRecentQuestions(q)
        setRecentDocs(d)
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดข้อมูล Dashboard ไม่สำเร็จ')))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome banner — rich dark gradient with the AI mascot perched on top */}
      <div className="relative mb-6">
        <div
          className="relative overflow-hidden rounded-[24px] px-6 py-7 sm:px-8 sm:py-8"
          style={{ background: 'linear-gradient(120deg, #0B2E5E 0%, #1E5AA8 60%, #FFFFFF 100%)' }}
        >
          <div className="absolute rounded-full pointer-events-none" style={{ width: 220, height: 220, top: -80, right: -40, background: 'rgba(255,255,255,0.08)' }} aria-hidden="true" />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 140, height: 140, bottom: -60, right: 140, background: 'rgba(14,165,233,0.25)' }} aria-hidden="true" />
          <div className="relative max-w-[75%] sm:max-w-[80%]">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">ยินดีต้อนรับ, ผู้ดูแลระบบ</h1>
            <p className="text-[13px] text-white/75 mt-1.5">ภาพรวมการใช้งานระบบแชทบอท กยศ.</p>
          </div>
        </div>

        {/* AI mascot perched on top of the banner */}
        <img
          src={mascotImg}
          alt="ผู้ช่วย AI"
          className="absolute -top-11 right-6 sm:right-12 pointer-events-none select-none"
          style={{ width: 132, filter: 'drop-shadow(0 10px 16px rgba(11,46,94,0.35))' }}
        />
      </div>

      {loading || !stats ? (
        <AdminLoadingState />
      ) : (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <AdminStatCard icon={MessageSquare} label="คำถามทั้งหมด" value={stats.messages.toLocaleString()} color="#1E5AA8" delay={0} variant="vivid" />
          <AdminStatCard icon={CheckCircle2} label="ตอบคำถามสำเร็จ" value={stats.answered.toLocaleString()} color="#0E7490" delay={0.05} variant="vivid" />
          <AdminStatCard icon={Smile} label="ความพึงพอใจ" value={`${stats.positiveRate}%`} color="#4F46E5" delay={0.1} variant="vivid" />
          <AdminStatCard icon={FileText} label="เอกสารพร้อมใช้งาน" value={`${stats.documents}/${stats.totalDocuments}`} color="#0369A1" delay={0.15} variant="vivid" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          {/* Usage trend area chart */}
          <div className="xl:col-span-2 admin-card p-6" style={{ borderRadius: '20px' }}>
            <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
              <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #1E5AA8, #3B82F6)' }}>
                <TrendingUp size={14} className="text-white" />
              </span>
              สถิติการใช้งาน
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E5AA8" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#1E5AA8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0E7490" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#0E7490" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={(d) => formatThaiDate(d).split(' ').slice(0, 2).join(' ')} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} axisLine={false} tickLine={false} width={30} />
                <Tooltip content={<ChartTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone" dataKey="total" name="คำถามทั้งหมด"
                  stroke="#1E5AA8" strokeWidth={2.5} fill="url(#gradTotal)"
                  dot={{ r: 3, strokeWidth: 2, stroke: '#fff', fill: '#1E5AA8' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
                <Area
                  type="monotone" dataKey="success" name="ตอบคำถามสำเร็จ"
                  stroke="#0E7490" strokeWidth={2.5} fill="url(#gradSuccess)"
                  dot={{ r: 3, strokeWidth: 2, stroke: '#fff', fill: '#0E7490' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category breakdown donut */}
          <div className="admin-card p-6" style={{ borderRadius: '20px' }}>
            <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
              <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
                <PieChartIcon size={14} className="text-white" />
              </span>
              หมวดหมู่คำถามยอดนิยม
            </h2>
            {breakdown.length === 0 ? (
              <AdminEmptyState icon={MessageCircleQuestion} title="ยังไม่มีข้อมูลอ้างอิงหมวดหมู่" subtitle="จะแสดงเมื่อ AI เริ่มตอบคำถามโดยอ้างอิงเอกสารในระบบ" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={breakdown} dataKey="count" nameKey="categoryName" innerRadius={55} outerRadius={85} paddingAngle={3} cornerRadius={6}>
                    {breakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={2} />)}
                  </Pie>
                  <Tooltip
                    formatter={(v, n) => [`${v} ครั้ง`, n]}
                    contentStyle={{ borderRadius: 12, border: '1px solid #EDF2F7', boxShadow: '0 8px 24px rgba(15,23,42,0.14)' }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent questions */}
          <div className="admin-card p-6" style={{ borderRadius: '20px' }}>
            <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
              <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #059669, #34D399)' }}>
                <Clock size={14} className="text-white" />
              </span>
              คำถามล่าสุด
            </h2>
            {recentQuestions.length === 0 ? (
              <AdminEmptyState icon={MessageCircleQuestion} title="ยังไม่มีคำถาม" />
            ) : (
              <div className="space-y-2.5">
                {recentQuestions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: '#F7F9FC' }}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <span className="flex-shrink-0 w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} aria-hidden="true" />
                    <p className="text-[13px] text-[#14213D] truncate flex-1">{q.content}</p>
                    <span className="text-xs text-[#64748B] whitespace-nowrap">{formatThaiDate(q.createdAt)}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Recent documents */}
          <div className="admin-card p-6" style={{ borderRadius: '20px' }}>
            <h2 className="flex items-center gap-2 font-bold text-base text-[#14213D] mb-4">
              <span className="flex items-center justify-center rounded-lg" style={{ width: 26, height: 26, background: 'linear-gradient(135deg, #D97706, #FBBF24)' }}>
                <FolderOpen size={14} className="text-white" />
              </span>
              เอกสารล่าสุด
            </h2>
            {recentDocs.length === 0 ? (
              <AdminEmptyState icon={FileText} title="ยังไม่มีเอกสาร" />
            ) : (
              <div className="space-y-2.5">
                {recentDocs.map((d, i) => (
                  <motion.div
                    key={d.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: '#F7F9FC' }}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: '#FEF2F2' }}>
                      <FileText size={15} className="text-[#EF4444]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#14213D] truncate">{d.originalName}</p>
                      <p className="text-xs text-[#64748B]">อัปเดต {formatThaiDate(d.updatedAt)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>
      )}
    </div>
  )
}
