import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User } from 'lucide-react'

// ── Navigation Links ───────────────────────────────────────────────
const navLinks = [
  { label: 'หน้าแรก',         href: '/' },
  { label: 'ข่าวและประกาศ',   href: '/announcements' },
  { label: 'คำถามที่พบบ่อย', href: '/faq' },
  { label: 'ติดต่อเรา',       href: '/contact' },
]

interface NavbarProps {
  isAuthenticated?: boolean
  userName?: string
}

/**
 * Navbar — Modern Academic Header matched with Figma Design
 */
export default function Navbar({ isAuthenticated = false, userName = 'กัญวรา ใจดี' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const location = useLocation()

  // Add subtle shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <header
      className="sticky top-0 z-50 w-full bg-white transition-shadow duration-200"
      style={{
        boxShadow: scrolled ? '0 2px 16px rgba(6, 46, 102, 0.08)' : '0 1px 0 #DDE2EA',
      }}
    >
      <nav className="container-main flex items-center justify-between h-[72px]">
        {/* ── Left: PSU Logo + University Name ──────────────────────── */}
        <Link to="/" className="flex items-center gap-3.5 group" aria-label="PSU SLF AI — หน้าแรก">
          {/* PSU Logo SVG */}
          <div
            className="flex-shrink-0"
            style={{ width: 44, height: 44 }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="44" height="44" rx="8" fill="#0B2E5E"/>
              <text
                x="22" y="28"
                textAnchor="middle"
                fill="white"
                fontSize="16"
                fontWeight="700"
                fontFamily="IBM Plex Sans Thai, sans-serif"
                letterSpacing="-0.5"
              >
                PSU
              </text>
            </svg>
          </div>

          {/* University Name Text */}
          <div className="leading-tight">
            <h1 className="text-[15px] font-bold text-[#062E66] tracking-tight group-hover:text-[#0B4DBA] transition-colors">
              มหาวิทยาลัยสงขลานครินทร์
            </h1>
            <p className="text-xs text-[#5F6673] font-normal">
              วิทยาเขตสุราษฎร์ธานี
            </p>
          </div>
        </Link>

        {/* ── Center & Right: Desktop Navigation ────────────────────── */}
        {!isAuthenticated ? (
          /* Public Navbar: Links + Login & Staff CTA */
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <div className="flex items-center gap-1 mr-4 lg:mr-6">
              {navLinks.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`
                      relative px-3.5 py-2 text-[14px] font-medium transition-colors duration-150
                      ${active ? 'text-[#062E66] font-semibold' : 'text-[#5F6673] hover:text-[#062E66]'}
                    `}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] bg-[#062E66] rounded-full" />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                id="navbar-login-button"
                className="btn-primary text-[13px] px-5 py-2"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/admin"
                id="navbar-staff-button"
                className="btn-outline-navy text-[13px] px-4 py-2"
              >
                สำหรับเจ้าหน้าที่
              </Link>
            </div>
          </div>
        ) : (
          /* Authenticated Navbar: User Avatar & Name */
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2.5 py-1.5 px-3 rounded-full bg-[#F7F8FA] border border-[#DDE2EA]">
              <div className="w-7 h-7 rounded-full bg-[#062E66] text-white flex items-center justify-center">
                <User size={15} />
              </div>
              <span className="text-sm font-semibold text-[#062E66]">
                {userName}
              </span>
            </div>
          </div>
        )}

        {/* ── Mobile Hamburger Toggle ──────────────────────────────── */}
        <button
          id="navbar-mobile-toggle"
          className="md:hidden p-2 rounded-lg text-[#062E66] hover:bg-[#F7F8FA] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ── Mobile Drawer ─────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#DDE2EA] bg-white animate-fade-in">
          <div className="container-main py-4 flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
                    ${active ? 'text-[#062E66] bg-[#E5EDFF] font-semibold' : 'text-[#5F6673] hover:bg-[#F7F8FA]'}
                  `}
                >
                  {link.label}
                </Link>
              )
            })}

            <div className="pt-3 border-t border-[#DDE2EA] mt-2 flex flex-col gap-2">
              <Link to="/login" className="btn-primary w-full justify-center text-sm py-2.5">
                เข้าสู่ระบบ
              </Link>
              <Link to="/admin" className="btn-outline-navy w-full justify-center text-sm py-2.5">
                สำหรับเจ้าหน้าที่
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
