import { useState, useMemo, useEffect } from 'react'
import { Search, CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import campusImage from '@/assets/images/psu-campus.jpg'
import type { Announcement } from '@/types'
import { fetchAnnouncements, resolveAnnouncementImageUrl } from '@/services/announcementService'
import { fetchCategories, type Category } from '@/services/categoryService'
import { formatThaiDate } from '@/utils/date'
import AnnouncementModal from '@/components/announcements/AnnouncementModal'

const GRADIENTS = [
  'linear-gradient(135deg, #062E66 0%, #0B4DBA 100%)',
  'linear-gradient(135deg, #0B4DBA 0%, #3B82F6 100%)',
  'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)',
  'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
  'linear-gradient(135deg, #0B4DBA 0%, #60A5FA 100%)',
]
const BADGE_COLORS = ['bg-[#EF4444] text-white', 'bg-[#3B82F6] text-white', 'bg-[#10B981] text-white', 'bg-[#7C3AED] text-white']

const PAGE_SIZE = 6

/**
 * AnnouncementsPage — Matched with Figma News Screen Reference
 */
export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<Announcement | null>(null)

  useEffect(() => {
    Promise.all([fetchAnnouncements(), fetchCategories()])
      .then(([announcements, cats]) => {
        setItems(announcements)
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  const categoryStyle = (categoryId?: number) => {
    const idx = categories.findIndex((c) => c.id === categoryId)
    const safeIdx = idx === -1 ? categories.length : idx
    return {
      badge: BADGE_COLORS[safeIdx % BADGE_COLORS.length],
      gradient: GRADIENTS[safeIdx % GRADIENTS.length],
    }
  }
  const categoryName = (categoryId?: number) => categories.find((c) => c.id === categoryId)?.name || 'ทั่วไป'

  const filteredNews = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        !search ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.content.toLowerCase().includes(search.toLowerCase())
      const matchCategory =
        activeCategory === 'all' || item.categoryId === activeCategory
      return matchSearch && matchCategory
    })
  }, [search, activeCategory, items])

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PAGE_SIZE))
  const pagedNews = filteredNews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeCategory])

  return (
    <PageLayout>
      {/* ── 1. Hero Section with Campus Backdrop ─────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '260px' }}>
        <div className="absolute inset-0">
          <img
            src={campusImage}
            alt="มหาวิทยาลัยสงขลานครินทร์"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(6,46,102,0.88) 0%, rgba(6,46,102,0.95) 100%)',
          }}
        />
        <div className="container-main relative z-10 py-12 md:py-16 text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
            ข่าวสารและประกาศทั้งหมด
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            ติดตามอัปเดตล่าสุด ประกาศสำคัญ และข้อมูลกำหนดการเกี่ยวกับการกู้ยืมเงินกองทุนเพื่อการศึกษา
          </p>
        </div>
      </section>

      {/* ── 2. Floating Search & Category Filter Card ─────────────── */}
      <section className="relative z-20" style={{ marginTop: '-32px' }}>
        <div className="container-main">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(6,46,102,0.08)] border border-[#DDE2EA] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="search-announcements"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาข่าวสารและประกาศ..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => setActiveCategory('all')}
                className={`
                  px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer
                  ${activeCategory === 'all'
                    ? 'bg-[#0B4DBA] text-white shadow-[0_2px_8px_rgba(11,77,186,0.25)]'
                    : 'bg-[#F7F8FA] text-[#5F6673] hover:bg-[#E5EDFF] hover:text-[#0B4DBA] border border-[#DDE2EA]'
                  }
                `}
              >
                ทั้งหมด
              </button>
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer
                      ${isActive
                        ? 'bg-[#0B4DBA] text-white shadow-[0_2px_8px_rgba(11,77,186,0.25)]'
                        : 'bg-[#F7F8FA] text-[#5F6673] hover:bg-[#E5EDFF] hover:text-[#0B4DBA] border border-[#DDE2EA]'
                      }
                    `}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. News Grid (3 Columns) ──────────────────────────────── */}
      <section className="section-sm">
        <div className="container-main">
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#DDE2EA]">
              <p className="text-[#5F6673] text-sm">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#DDE2EA]">
              <p className="text-[#5F6673] text-sm">ไม่พบข่าวสารหรือประกาศที่ตรงกับเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedNews.map((item) => {
                const style = categoryStyle(item.categoryId)
                const imageUrl = resolveAnnouncementImageUrl(item.attachmentUrl)
                return (
                  <article
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="card group flex flex-col overflow-hidden bg-white hover:-translate-y-1 transition-transform duration-200 cursor-pointer text-left"
                  >
                    {/* Card Thumbnail Top Banner */}
                    <div
                      className="h-40 w-full relative flex items-end p-4 text-white"
                      style={imageUrl ? undefined : { background: style.gradient }}
                    >
                      {imageUrl && (
                        <>
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(180deg, rgba(6,46,102,0) 55%, rgba(6,46,102,0.55) 100%)' }}
                          />
                        </>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${style.badge}`}>
                          {categoryName(item.categoryId)}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col">
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-2 font-medium">
                        <CalendarDays size={13} />
                        <span>{formatThaiDate(item.eventDate || item.publishedAt)}</span>
                      </div>

                      {/* Title */}
                      <h2 className="font-bold text-base text-[#111827] group-hover:text-[#0B4DBA] transition-colors leading-snug mb-2 line-clamp-2">
                        {item.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-[13px] text-[#5F6673] leading-relaxed line-clamp-3 mb-5 flex-1">
                        {item.content}
                      </p>

                      {/* Footer link */}
                      <div className="pt-3 border-t border-[#EDF2F7] mt-auto">
                        <span className="text-xs font-semibold text-[#0B4DBA] group-hover:text-[#062E66] inline-flex items-center gap-1.5 transition-colors">
                          <span>อ่านเพิ่มเติม</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* ── 4. Pagination (Figma Style) ───────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-full border border-[#DDE2EA] flex items-center justify-center text-[#5F6673] hover:bg-white disabled:opacity-40 transition-colors"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    w-9 h-9 rounded-full text-xs font-bold transition-all
                    ${currentPage === page
                      ? 'bg-[#0B4DBA] text-white shadow-[0_2px_8px_rgba(11,77,186,0.30)]'
                      : 'border border-[#DDE2EA] bg-white text-[#5F6673] hover:bg-[#F7F8FA]'
                    }
                  `}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-full border border-[#DDE2EA] flex items-center justify-center text-[#5F6673] hover:bg-white disabled:opacity-40 transition-colors"
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      <AnnouncementModal
        item={selectedItem}
        categoryName={categoryName(selectedItem?.categoryId)}
        onClose={() => setSelectedItem(null)}
      />
    </PageLayout>
  )
}
