import { useState, useEffect } from 'react'
import { BarChart3, Smile, MessageCircle, ThumbsUp, ThumbsDown, ClipboardCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { fetchEvaluations, type EvaluationsData } from '@/services/dashboardService'
import { extractErrorMessage } from '@/services/authService'
import { formatThaiDate } from '@/utils/date'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import AdminStatCard from '@/components/admin/AdminStatCard'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminEmptyState from '@/components/admin/AdminEmptyState'

/**
 * AdminEvaluation — การประเมินคำตอบ (ตาม design-reference: question_evaluation.png)
 * หมายเหตุ: ระบบให้คะแนนจริงเป็นแบบ ถูกใจ/ไม่ถูกใจ (ไม่ใช่ดาว 1-5) จึงปรับสถิติเป็น % ความพึงพอใจแทน
 */
export default function AdminEvaluation() {
  const [data, setData] = useState<EvaluationsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvaluations()
      .then(setData)
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดข้อมูลการประเมินไม่สำเร็จ')))
      .finally(() => setLoading(false))
  }, [])

  const maxRate = data ? Math.max(1, ...data.dailyTrend.map((d) => d.satisfactionRate)) : 1
  const peakIndex = data ? data.dailyTrend.findIndex((d) => d.satisfactionRate === maxRate && maxRate > 0) : -1

  return (
    <div className="p-6 lg:p-8">
      <AdminPageHeader title="การประเมินคำตอบ" subtitle="ภาพรวมคะแนนความพึงพอใจและผลตอบรับจากผู้ใช้งาน (ถูกใจ/ไม่ถูกใจ)" icon={ClipboardCheck} color="#0B2E5E" />

      {loading || !data ? (
        <AdminLoadingState />
      ) : (
      <>
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <AdminStatCard icon={BarChart3} label="จำนวนการประเมินทั้งหมด" value={data.totalEvaluations.toLocaleString()} color="#4F46E5" delay={0} variant="vivid" />
          <AdminStatCard icon={Smile} label="คะแนนความพึงพอใจเฉลี่ย" value={`${data.avgSatisfaction}%`} color="#1E5AA8" delay={0.05} variant="vivid" />
          <AdminStatCard icon={MessageCircle} label="จำนวนข้อเสนอแนะ" value={data.suggestionCount.toLocaleString()} color="#0E7490" delay={0.1} variant="vivid" />
        </div>

        {/* Daily satisfaction trend */}
        <div className="admin-card p-6 mb-6">
          <h2 className="font-bold text-base text-[#14213D] mb-4">คะแนนความพึงพอใจรายวัน (7 วันล่าสุด)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EDF2F7" vertical={false} />
              <XAxis dataKey="weekday" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
              <Tooltip formatter={(v) => [`${v}%`, 'ความพึงพอใจ']} />
              <Bar dataKey="satisfactionRate" name="% ความพึงพอใจ" radius={[6, 6, 0, 0]}>
                {data.dailyTrend.map((_, i) => (
                  <Cell key={i} fill={i === peakIndex ? '#0B2E5E' : '#93C5FD'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent evaluations */}
        <div className="admin-card overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EDF2F7]">
            <h2 className="font-bold text-base text-[#14213D]">รายการประเมินล่าสุด</h2>
          </div>
          {data.recentEvaluations.length === 0 ? (
            <AdminEmptyState icon={ClipboardCheck} title="ยังไม่มีการประเมินคำตอบ" subtitle="จะแสดงเมื่อผู้ใช้เริ่มกดถูกใจ/ไม่ถูกใจในหน้าแชท" />
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: '#1E5AA8' }}>
                  {['คำถาม', 'คะแนน', 'ความคิดเห็น', 'วันที่'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-[13px] font-semibold text-white uppercase" style={{ letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentEvaluations.map((e, i) => (
                  <tr key={e.id} className={`transition-all hover:-translate-y-0.5 ${i % 2 === 0 ? 'bg-white' : 'bg-[#F2F5F9]'}`} style={{ borderBottom: i < data.recentEvaluations.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="text-[13px] text-[#14213D] truncate">{e.question}</p>
                    </td>
                    <td className="px-6 py-4">
                      {e.rating === 'like' ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-[13px] font-medium"><ThumbsUp size={13} /> ถูกใจ</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-500 text-[13px] font-medium"><ThumbsDown size={13} /> ไม่ถูกใจ</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[13px] text-[#334155] italic max-w-xs truncate">{e.comment || '-'}</td>
                    <td className="px-6 py-4 text-[13px] text-[#475569] whitespace-nowrap">{formatThaiDate(e.createdAt)}</td>
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
