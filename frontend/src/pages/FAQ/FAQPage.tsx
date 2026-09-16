import { useState, useMemo, useEffect } from 'react'
import { Search, ChevronDown, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import campusImage from '@/assets/images/psu-campus.jpg'
import type { FAQ } from '@/types'
import { fetchFAQs } from '@/services/faqService'
import { fetchCategories, type Category } from '@/services/categoryService'

/**
 * FAQPage — Matched with Figma FAQ Reference Screen
 */
export default function FAQPage() {
  const [faqsData, setFaqsData] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')
  const [openIds, setOpenIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    Promise.all([fetchFAQs(), fetchCategories()])
      .then(([items, cats]) => {
        setFaqsData(items)
        setCategories(cats)
        if (items[0]) setOpenIds(new Set([items[0].id]))
      })
      .finally(() => setLoading(false))
  }, [])

  const toggleFAQ = (id: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const filteredFAQs = useMemo(() => {
    return faqsData.filter((item) => {
      const matchSearch =
        !search ||
        item.question.toLowerCase().includes(search.toLowerCase()) ||
        item.answer.toLowerCase().includes(search.toLowerCase())
      const matchCategory =
        activeCategory === 'all' || item.categoryId === activeCategory
      return matchSearch && matchCategory
    })
  }, [search, activeCategory, faqsData])

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
            คำถามที่พบบ่อย (FAQ)
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            ค้นหาคำตอบสำหรับข้อสงสัยเบื้องต้นเกี่ยวกับการกู้ยืมเงิน กยศ.
          </p>
        </div>
      </section>

      {/* ── 2. Floating Search & Category Filter Card ─────────────── */}
      <section className="relative z-20" style={{ marginTop: '-32px' }}>
        <div className="container-main">
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(6,46,102,0.08)] border border-[#DDE2EA]">
            {/* Search input */}
            <div className="relative w-full mb-4">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="search-faq"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="พิมพ์คำถามที่ต้องการค้นหา..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
              />
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-2">
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

      {/* ── 3. Accordion List ─────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container-main max-w-4xl">
          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#DDE2EA]">
              <p className="text-[#5F6673] text-sm">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredFAQs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#DDE2EA]">
              <p className="text-[#5F6673] text-sm">ไม่พบคำถามที่ตรงกับการค้นหา</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFAQs.map((faq) => {
                const isOpen = openIds.has(faq.id)
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-[#DDE2EA] overflow-hidden transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-[#F7F8FA] transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-sm sm:text-base text-[#111827] pr-4 leading-snug">
                        {faq.question}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full bg-[#F7F8FA] flex items-center justify-center flex-shrink-0 text-[#5F6673] transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#0B4DBA] bg-[#E5EDFF]' : ''
                        }`}
                      >
                        <ChevronDown size={16} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5F6673] leading-relaxed border-t border-[#EDF2F7] whitespace-pre-line animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* ── 4. Need Help AI CTA Card (Figma Style) ─────────────── */}
          <div className="mt-12 bg-white rounded-2xl p-7 sm:p-8 text-center border border-[#DDE2EA] shadow-[0_4px_20px_rgba(6,46,102,0.04)]">
            <h2 className="text-lg sm:text-xl font-bold text-[#062E66] mb-2">
              ยังไม่พบคำตอบที่ต้องการ?
            </h2>
            <p className="text-[#5F6673] text-xs sm:text-sm max-w-md mx-auto mb-6 leading-relaxed">
              ผู้ช่วยอัจฉริยะ AI ของเราพร้อมให้คำตอบตลอด 24 ชั่วโมง หรือติดต่อเจ้าหน้าที่โดยตรง
            </p>
            <Link
              to="/chat"
              id="faq-cta-chat-button"
              className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5 shadow-md"
            >
              <MessageSquare size={16} />
              <span>เริ่มแชทกับ AI</span>
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
