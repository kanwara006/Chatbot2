import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react'
import Logo from '@/components/common/Logo'

// ── Footer Links ────────────────────────────────────────────────────
const mainLinks = [
  { label: 'หน้าแรก',         href: '/' },
  { label: 'ข่าวและประกาศ',   href: '/announcements' },
  { label: 'คำถามที่พบบ่อย', href: '/faq' },
  { label: 'ติดต่อเรา',       href: '/contact' },
]

/**
 * Footer — Deep Navy 4-Column Footer matched with Figma Reference
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#062E66] text-white mt-auto">
      {/* ── Main 4-Column Grid ────────────────────────────────────── */}
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Col 1: System Info & Description (Span 4) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-3 mb-4 group" aria-label="PSU SLF AI หน้าแรก">
              <Logo size={40} />
              <div className="leading-tight">
                <p className="text-white text-sm font-bold tracking-tight">
                  มหาวิทยาลัยสงขลานครินทร์
                </p>
                <p className="text-white/60 text-xs mt-0.5">
                  วิทยาเขตสุราษฎร์ธานี
                </p>
              </div>
            </Link>

            <p className="text-white/70 text-xs sm:text-[13px] leading-relaxed max-w-sm">
              ระบบผู้ช่วยอัจฉริยะ (AI Chatbot) เพื่อให้บริการข้อมูลและตอบคำถามเกี่ยวกับกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) สำหรับนักศึกษามหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี
            </p>
          </div>

          {/* Col 2: เมนูหลัก (Span 2) */}
          <div className="lg:col-span-2">
            <h3 className="text-white text-sm font-bold tracking-tight mb-4">
              เมนูหลัก
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              {mainLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/70 hover:text-white transition-colors duration-150 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: ข้อมูลการติดต่อ (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-sm font-bold tracking-tight mb-4">
              ข้อมูลการติดต่อ
            </h3>
            <ul className="space-y-3 text-xs sm:text-[13px]">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-white/60 mt-0.5 flex-shrink-0" />
                <span className="text-white/75 leading-relaxed">
                  31 หมู่ 6 ถ.สุราษฎร์-นาสาร ต.มะขามเตี้ย อ.เมือง จ.สุราษฎร์ธานี 84000
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-white/60 flex-shrink-0" />
                <a href="tel:077278887" className="text-white/75 hover:text-white transition-colors">
                  077-278-887
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-white/60 flex-shrink-0" />
                <a
                  href="mailto:studentloanpsu@gmail.com"
                  className="text-white/75 hover:text-white transition-colors break-all"
                >
                  studentloanpsu@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: ลิงก์ภายนอก (Span 3) */}
          <div className="lg:col-span-3">
            <h3 className="text-white text-sm font-bold tracking-tight mb-4">
              ลิงก์ภายนอก
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-[13px]">
              <li>
                <a
                  href="https://www.studentloan.or.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5"
                >
                  <span>กองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)</span>
                  <ExternalLink size={13} className="text-white/50" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.psu.ac.th"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors duration-150 inline-flex items-center gap-1.5"
                >
                  <span>มหาวิทยาลัยสงขลานครินทร์</span>
                  <ExternalLink size={13} className="text-white/50" />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Divider & Copyright Bar ────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {currentYear} Prince of Songkla University. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-white/80 cursor-pointer transition-colors">นโยบายความเป็นส่วนตัว</span>
            <span className="hover:text-white/80 cursor-pointer transition-colors">ข้อตกลงการใช้งาน</span>
            <span className="hover:text-white/80 cursor-pointer transition-colors">แผนผังเว็บไซต์</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
