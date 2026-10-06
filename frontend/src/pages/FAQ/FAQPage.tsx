import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, ChevronDown, MessageSquare, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import faqBanner1 from '@/assets/images/faq-banner1.jpg'
import faqBanner2 from '@/assets/images/faq-banner2.jpg'
import lcImage from '@/assets/images/LC.jpg'
import campusImage from '@/assets/images/psu-campus.jpg'
import type { FAQ } from '@/types'
import { fetchFAQs } from '@/services/faqService'
import { fetchCategories, type Category } from '@/services/categoryService'

const faqSlides = [
  {
    image: faqBanner1,
    alt: 'ศูนย์บริการข้อมูลและให้คำปรึกษา กยศ. ม.อ. สุราษฎร์ธานี',
    badge: 'ศูนย์บริการข้อมูล กยศ.',
  },
  {
    image: faqBanner2,
    alt: 'ค้นหาคำตอบและแนวทางการกู้ยืมเงินเพื่อการศึกษา',
    badge: 'คำถามที่พบบ่อย',
  },
  {
    image: lcImage,
    alt: 'อาคารศูนย์การเรียนรู้ มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี',
    badge: 'ม.อ. สุราษฎร์ธานี',
  },
  {
    image: campusImage,
    alt: 'มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี',
    badge: 'วิทยาเขตสุราษฎร์ธานี',
  },
]

/**
 * FAQPage — Matched with Figma FAQ Reference Screen with Auto-sliding Banner Backdrop
 */
export default function FAQPage() {
  const [faqsData, setFaqsData] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all')
  const [openIds, setOpenIds] = useState<Set<number>>(new Set())

  // Auto-sliding banner state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % faqSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + faqSlides.length) % faqSlides.length)
  }, [])

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 3000)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide])

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
      {/* ── 1. Hero Section with Auto-sliding Advertisement Backdrop ─ */}
      <section
        className="relative w-full overflow-hidden min-h-[380px] sm:min-h-[420px] md:min-h-[450px] flex items-center justify-center"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Image Slideshow */}
        <div className="absolute inset-0 overflow-hidden bg-slate-950">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={currentSlide}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
            >
              <img
                src={faqSlides[currentSlide].image}
                alt={faqSlides[currentSlide].alt}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gradient Overlay for Text Readability & Image Vibrancy */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,25,60,0.38) 0%, rgba(6,35,80,0.52) 50%, rgba(6,46,102,0.82) 100%)',
          }}
        />

        {/* Navigation Dots and Controls */}
        <div className="absolute bottom-11 right-4 sm:right-8 z-20 flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-md">
            {faqSlides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`ไปยังแบนเนอร์ที่ ${idx + 1}: ${slide.badge}`}
                className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
                  currentSlide === idx ? 'w-6 bg-[#60A5FA]' : 'w-2 bg-white/40 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={prevSlide}
              aria-label="ภาพก่อนหน้า"
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="ภาพถัดไป"
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white/80 hover:text-white backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="container-main relative z-10 pt-16 pb-20 md:pt-20 md:pb-24 text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
            คำถามที่พบบ่อย (FAQ)
          </h1>
          <p className="text-white/95 text-xs sm:text-sm md:text-base max-w-xl mx-auto leading-relaxed drop-shadow-[0_1px_5px_rgba(0,0,0,0.75)] font-normal">
            ค้นหาคำตอบสำหรับข้อสงสัยเบื้องต้นเกี่ยวกับการกู้ยืมเงิน กยศ. มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี
          </p>
        </div>
      </section>

      {/* ── 2. Floating Search & Category Filter Card ─────────────── */}
      <section className="relative z-20" style={{ marginTop: '-32px' }}>
        <div className="container-main">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(6,46,102,0.08)] border border-[#DDE2EA] flex flex-col gap-3.5">
            {/* Search input — with quick clear button */}
            <div className="relative w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="search-faq"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="พิมพ์คำถามที่ต้องการค้นหา..."
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F8FAFC] focus:bg-white focus:border-[#0B4DBA] focus:ring-2 focus:ring-[#0B4DBA]/10 text-[#111827] placeholder-[#94A3B8] transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="ล้างคำค้นหา"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#94A3B8] hover:text-[#111827] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Category Chips — Horizontal Swipeable on Mobile, Wrap on Desktop */}
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 sm:flex-wrap">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`
                    shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer select-none active:scale-95
                    ${activeCategory === 'all'
                      ? 'bg-[#0B4DBA] text-white shadow-[0_2px_8px_rgba(11,77,186,0.28)] ring-2 ring-[#0B4DBA]/20'
                      : 'bg-[#F8FAFC] text-[#5F6673] hover:bg-[#EFF6FF] hover:text-[#0B4DBA] border border-[#DDE2EA]'
                    }
                  `}
                >
                  ทั้งหมด
                </button>
                {categories.map((cat, idx) => {
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={`cat-${cat.id ?? idx}-${idx}`}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`
                        shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer select-none active:scale-95
                        ${isActive
                          ? 'bg-[#0B4DBA] text-white shadow-[0_2px_8px_rgba(11,77,186,0.28)] ring-2 ring-[#0B4DBA]/20'
                          : 'bg-[#F8FAFC] text-[#5F6673] hover:bg-[#EFF6FF] hover:text-[#0B4DBA] border border-[#DDE2EA]'
                        }
                      `}
                    >
                      {cat.name}
                    </button>
                  )
                })}
              </div>
              {/* Subtle edge fade indicator for mobile horizontal scroll */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent sm:hidden" />
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
