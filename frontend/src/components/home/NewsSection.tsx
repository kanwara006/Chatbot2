import { Link } from 'react-router-dom'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

// ── Announcements Data ───────────────────────────────────────────────
const announcements = [
  {
    id:       1,
    category: 'ประกาศ',
    title:    'เปิดรับคำขอกู้ยืมเงิน กยศ. ภาคเรียนที่ 1/2569',
    date:     '15 พฤษภาคม 2569',
    excerpt:  'เปิดระบบให้นักศึกษาที่ประสงค์จะกู้ยืมเงิน กยศ. ภาคเรียนที่ 1/2569 ทั้งผู้กู้รายใหม่และผู้กู้รายเก่า ดำเนินการผ่านระบบ กยศ. Connect',
  },
  {
    id:       2,
    category: 'เอกสาร',
    title:    'กำหนดการส่งเอกสารประกอบการกู้ยืม ภาคเรียนที่ 1/2569',
    date:     '10 พฤษภาคม 2569',
    excerpt:  'ขอให้นักศึกษานำส่งเอกสารประกอบการกู้ยืม กยศ. ภาคเรียนที่ 1/2569 ที่งานกองทุนฯ ตามวันและเวลาที่กำหนดในประกาศ',
  },
  {
    id:       3,
    category: 'จิตอาสา',
    title:    'การเข้าร่วมโครงการจิตอาสาเพื่อสะสมชั่วโมง กยศ. ประจำปี 2569',
    date:     '2 พฤษภาคม 2569',
    excerpt:  'กำหนดการจัดอบรมและทำกิจกรรมจิตอาสาเพื่อสะสมชั่วโมงจิตอาสาให้ครบ 36 ชั่วโมง สำหรับผู้กู้ยืมเงิน กยศ. ทุกคน',
  },
]

/**
 * NewsSection — White card container showing announcements matching Figma
 */
export default function NewsSection() {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] h-full flex flex-col">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-[#EDF2F7]">
        <h2 className="text-lg sm:text-xl font-bold text-[#062E66]">
          ข่าวและประกาศ
        </h2>
        <Link
          to="/announcements"
          id="view-all-announcements"
          className="text-xs sm:text-sm font-semibold text-[#0B4DBA] hover:text-[#062E66] transition-colors inline-flex items-center gap-1 group"
        >
          <span>ดูทั้งหมด</span>
          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ── News List ─────────────────────────────────────────── */}
      <div className="divide-y divide-[#EDF2F7] flex-1 flex flex-col justify-between">
        {announcements.map((item) => (
          <motion.article
            key={item.id}
            className="py-4 first:pt-2 last:pb-1 group"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {/* Badge & Date */}
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="badge-blue text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                {item.category}
              </span>
              <span className="text-xs text-[#94A3B8] inline-flex items-center gap-1">
                <CalendarDays size={12} />
                {item.date}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm sm:text-base text-[#111827] group-hover:text-[#0B4DBA] transition-colors leading-snug mb-1">
              <Link to={`/announcements`}>
                {item.title}
              </Link>
            </h3>

            {/* Excerpt */}
            <p className="text-xs sm:text-[13px] text-[#5F6673] leading-relaxed line-clamp-2 mb-2">
              {item.excerpt}
            </p>

            {/* Read More Link */}
            <Link
              to="/announcements"
              className="text-xs font-semibold text-[#0B4DBA] hover:text-[#062E66] inline-flex items-center gap-1 transition-colors"
            >
              <span>อ่านเพิ่มเติม</span>
              <ArrowRight size={12} />
            </Link>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
