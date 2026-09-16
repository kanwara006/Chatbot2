import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Announcement } from '@/types'
import { fetchAnnouncements } from '@/services/announcementService'
import { fetchCategories, type Category } from '@/services/categoryService'
import { formatThaiDate } from '@/utils/date'
import AnnouncementModal from '@/components/announcements/AnnouncementModal'

/**
 * NewsSection — White card container showing announcements matching Figma
 */
export default function NewsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null)

  useEffect(() => {
    Promise.all([fetchAnnouncements(), fetchCategories()])
      .then(([items, cats]) => {
        setAnnouncements(items.slice(0, 3))
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryName = (categoryId?: number) => categories.find((c) => c.id === categoryId)?.name || 'ทั่วไป'

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
        {loading ? (
          <p className="text-sm text-[#94A3B8] py-6 text-center">กำลังโหลดข้อมูล...</p>
        ) : announcements.length === 0 ? (
          <p className="text-sm text-[#94A3B8] py-6 text-center">ยังไม่มีประกาศ</p>
        ) : announcements.map((item) => (
          <motion.article
            key={item.id}
            className="py-4 first:pt-2 last:pb-1 group cursor-pointer"
            onClick={() => setSelectedItem(item)}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {/* Badge & Date */}
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="badge-blue text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                {categoryName(item.categoryId)}
              </span>
              <span className="text-xs text-[#94A3B8] inline-flex items-center gap-1">
                <CalendarDays size={12} />
                {formatThaiDate(item.eventDate || item.publishedAt)}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm sm:text-base text-[#111827] group-hover:text-[#0B4DBA] transition-colors leading-snug mb-1">
              {item.title}
            </h3>

            {/* Excerpt */}
            <p className="text-xs sm:text-[13px] text-[#5F6673] leading-relaxed line-clamp-2 mb-2">
              {item.content}
            </p>

            {/* Read More */}
            <span className="text-xs font-semibold text-[#0B4DBA] group-hover:text-[#062E66] inline-flex items-center gap-1 transition-colors">
              <span>อ่านเพิ่มเติม</span>
              <ArrowRight size={12} />
            </span>
          </motion.article>
        ))}
      </div>

      <AnnouncementModal
        item={selectedItem}
        categoryName={categoryName(selectedItem?.categoryId)}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  )
}
