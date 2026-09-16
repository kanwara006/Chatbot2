import { useState, useEffect } from 'react'
import { MessageSquare, CheckCircle2, Smile, FolderSearch, BarChart3 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { fetchReports, type ReportsData } from '@/services/dashboardService'
import { extractErrorMessage } from '@/services/authService'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'

/**
 * AdminReports — รายงานและสถิติ (ตาม design-reference: reports_statistics.png)
 */
export default function AdminReports() {
  const [data, setData] = useState<ReportsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
      .then(setData)
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดรายงานไม่สำเร็จ')))
      .finally(() => setLoading(false))
  }, [])

  const maxCount = data ? Math.max(1, ...data.usageTrend.map((d) => d.count)) : 1
  const peakIndex = data ? data.usageTrend.findIndex((d) => d.count === maxCount && maxCount > 0) : -1

  return (
    <div className="p-6 lg:p-8">
      <AdminPageHeader title="รายงานและสถิติ" subtitle="ภาพรวมการใช้งานและประสิทธิภาพของระบบ AI Assistant" icon={BarChart3} color="#0B2E5E" />

      {loading || !data ? (
        <AdminLoadingState />
      ) : (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <AdminStatCard icon={MessageSquare} label="คำถามทั้งหมด" value={data.totalQuestions.toLocaleString()} color="#4F46E5" delay={0} variant="vivid" />
          <AdminStatCard icon={CheckCircle2} label="อัตราการตอบสำเร็จ" value={`${data.successRate}%`} color="#1E5AA8" delay={0.05} variant="vivid" />
          <AdminStatCard icon={Smile} label="ความพึงพอใจเฉลี่ย" value={`${data.avgSatisfaction}%`} color="#0E7490" delay={0.1} variant="vivid" />
        </div>

        {/* Usage trend bar chart */}
        <div className="admin-card p-6 mb-6">
          <h2 className="font-bold text-base text-[#14213D] mb-4">แนวโน้มการใช้งาน (7 วันล่าสุด)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.usageTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" vertical={false} />
              <XAxis dataKey="weekday" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="จำนวนคำถาม" radius={[6, 6, 0, 0]}>
                {data.usageTrend.map((_, i) => (
                  <Cell key={i} fill={i === peakIndex ? '#0B2E5E' : '#93C5FD'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top categories table */}
        <div className="admin-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EDF2F7]">
            <h2 className="font-bold text-base text-[#14213D]">หมวดหมู่ที่ถูกถามบ่อยที่สุด</h2>
          </div>
          {data.topCategories.length === 0 ? (
            <AdminEmptyState icon={FolderSearch} title="ยังไม่มีข้อมูลอ้างอิงหมวดหมู่จากการสนทนา" />
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: '#1E5AA8' }}>
                  {['อันดับ', 'ชื่อหมวดหมู่', 'จำนวนคำถาม', 'คะแนนความพึงพอใจ'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-[13px] font-semibold text-white uppercase" style={{ letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topCategories.map((c, i) => (
                  <tr key={c.categoryId} className={`transition-all hover:-translate-y-0.5 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F2F5F9]'}`} style={{ borderBottom: i < data.topCategories.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td className="px-6 py-4">
                      <span className="flex items-center justify-center rounded-lg text-[13px] font-bold text-white"
                        style={{ width: 28, height: 28, background: i === 0 ? '#0B2E5E' : '#94A3B8' }}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#14213D] font-medium text-[13px]">{c.name}</td>
                    <td className="px-6 py-4 text-[#14213D] text-[13px]">{c.count.toLocaleString()}</td>
                    <td className="px-6 py-4 text-green-600 text-[13px] font-medium">{c.satisfaction}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
      )}
    </div>
  )
}
