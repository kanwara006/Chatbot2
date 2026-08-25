import { useState, useMemo } from 'react'
import { Search, ChevronDown, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import campusImage from '@/assets/images/psu-campus.jpg'

// ── FAQ Data ────────────────────────────────────────────────────────
const faqsData = [
  {
    id: 1,
    category: 'การสมัคร',
    question: 'ใครมีสิทธิ์กู้ยืมเงินกองทุน กยศ. บ้าง?',
    answer: 'นักศึกษาที่มีสิทธิ์กู้ยืมเงิน กยศ. ต้องมีสัญชาติไทย ศึกษาอยู่ในมหาวิทยาลัยสงขลานครินทร์ มีรายได้ครอบครัวไม่เกิน 360,000 บาท/ปี (สำหรับผู้กู้ลักษณะที่ 1 ขาดแคลนทุนทรัพย์) มีผลการเรียนเฉลี่ยสะสม (GPAX) ไม่ต่ำกว่า 2.00 และมีชั่วโมงกิจกรรมจิตอาสาครบ 36 ชั่วโมง/ปีการศึกษา',
  },
  {
    id: 2,
    category: 'การสมัคร',
    question: 'ขั้นตอนการสมัครกู้ยืมเงิน กยศ. มีขั้นตอนอย่างไร?',
    answer: '1. ยื่นคำขอกู้ยืมผ่านแอปพลิเคชัน กยศ. Connect\n2. จัดเตรียมและนำส่งเอกสารประกอบการกู้ยืมให้แก่มหาวิทยาลัย\n3. ติดตามผลการพิจารณาตรวจสอบคุณสมบัติ\n4. เมื่อได้รับการอนุมัติ ดำเนินการลงนามในสัญญากู้ยืมเงิน\n5. กองทุนโอนเงินค่าเล่าเรียนเข้ามหาวิทยาลัย และค่าครองชีพเข้าบัญชีนักศึกษา',
  },
  {
    id: 3,
    category: 'เอกสาร',
    question: 'เอกสารสำคัญที่ต้องใช้ในการสมัครกู้ยืมมีอะไรบ้าง?',
    answer: 'เอกสารหลักที่ต้องเตรียมประกอบด้วย:\n• สำเนาบัตรประจำตัวประชาชนและทะเบียนบ้านของนักศึกษา\n• สำเนาบัตรประจำตัวประชาชนและทะเบียนบ้านของบิดา มารดา หรือผู้ปกครอง\n• หนังสือรับรองรายได้ครอบครัว (กยศ. 102) หรือสลิปเงินเดือน\n• สำเนาใบแสดงผลการเรียน (Transcript)\n• หนังสือรับรองสภาพการเป็นนักศึกษา',
  },
  {
    id: 4,
    category: 'เอกสาร',
    question: 'หนังสือรับรองรายได้ครอบครัว (กยศ. 102) ต้องให้ใครเป็นผู้รับรอง?',
    answer: 'ผู้รับรองรายได้ต้องเป็นเจ้าหน้าที่ของรัฐ เช่น ข้าราชการประจำ, ข้าราชการบำนาญ, กำนัน, ผู้ใหญ่บ้าน, สมาชิกสภาองค์กรปกครองส่วนท้องถิ่น หรือหัวหน้าหน่วยงานราชการ พร้อมแนบสำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐที่ยังไม่หมดอายุ',
  },
  {
    id: 5,
    category: 'กำหนดการ',
    question: 'กำหนดการยื่นคำขอกู้ยืมเงิน กยศ. ภาคเรียนที่ 1 ประจำปีการศึกษา?',
    answer: 'สำหรับภาคเรียนที่ 1 มหาวิทยาลัยเปิดให้ยื่นคำขอกู้ยืมระหว่างวันที่ 1 เมษายน – 15 มิถุนายน และกำหนดให้ส่งเอกสารประกอบการกู้ยืมภายในเดือนกรกฎาคมของทุกปีการศึกษา (กรุณาติดตามประกาศกำหนดการล่าสุดจากทางมหาวิทยาลัย)',
  },
  {
    id: 6,
    category: 'กำหนดการ',
    question: 'ต้องส่งชั่วโมงจิตอาสาภายในช่วงเวลาใด?',
    answer: 'นักศึกษาผู้กู้ยืมต้องสะสมและบันทึกชั่วโมงกิจกรรมจิตอาสาให้ครบ 36 ชั่วโมง ภายในปีการศึกษาก่อนหน้า และนำหลักฐานการทำกิจกรรมจิตอาสามายื่นพร้อมกับเอกสารขอกู้ยืมเงินในแต่ละภาคเรียน',
  },
  {
    id: 7,
    category: 'การชำระเงิน',
    question: 'เมื่อสำเร็จการศึกษาแล้ว จะต้องเริ่มชำระหนี้คืนกองทุนเมื่อไหร่?',
    answer: 'ผู้กู้ยืมเงินจะได้รับระยะเวลาปลอดหนี้ 2 ปี นับจากปีที่สำเร็จการศึกษา หรือพ้นสภาพการเป็นนักศึกษา หลังจากนั้นจะต้องเริ่มชำระเงินต้นพร้อมดอกเบี้ย (อัตรา 1% ต่อปี) คืนให้แก่กองทุน โดยสามารถเลือกผ่อนชำระเป็นรายปีหรือรายเดือนได้สูงสุด 15 ปี',
  },
  {
    id: 8,
    category: 'การชำระเงิน',
    question: 'ช่องทางและวิธีการชำระหนี้คืนกองทุน กยศ. ทำอย่างไรได้บ้าง?',
    answer: 'สามารถชำระเงินผ่านแอปพลิเคชัน กยศ. Connect, แอปพลิเคชัน Krungthai NEXT, สแกน QR Code ผ่าน Mobile Banking ทุกธนาคาร, เคาน์เตอร์ธนาคารกรุงไทย, เคาน์เตอร์เซอร์วิส 7-Eleven หรือหักผ่านบัญชีเงินเดือนอัตโนมัติ',
  },
]

const categories = ['ทั้งหมด', 'การสมัคร', 'เอกสาร', 'กำหนดการ', 'การชำระเงิน']

/**
 * FAQPage — Matched with Figma FAQ Reference Screen
 */
export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [openIds, setOpenIds] = useState<Set<number>>(new Set([1]))

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
        activeCategory === 'ทั้งหมด' || item.category === activeCategory
      return matchSearch && matchCategory
    })
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
              {categories.map((cat) => {
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer
                      ${isActive
                        ? 'bg-[#0B4DBA] text-white shadow-[0_2px_8px_rgba(11,77,186,0.25)]'
                        : 'bg-[#F7F8FA] text-[#5F6673] hover:bg-[#E5EDFF] hover:text-[#0B4DBA] border border-[#DDE2EA]'
                      }
                    `}
                  >
                    {cat}
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
          {filteredFAQs.length === 0 ? (
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
