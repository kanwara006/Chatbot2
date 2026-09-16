import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/common/Logo'

// ── Navigation Links ───────────────────────────────────────────────
const navLinks = [
  { label: 'หน้าแรก',         href: '/' },
  { label: 'ข่าวและประกาศ',   href: '/announcements' },
  { label: 'คำถามที่พบบ่อย', href: '/faq' },
  { label: 'ติดต่อเรา',       href: '/contact' },
]

/**
 * Navbar — Modern Academic Header matched with Figma Design
 */
export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const userName = user ? `${user.firstName} ${user.lastName}` : ''
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const location = useLocation()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    setUserMenuOpen(false)
    logout()
    // Hard redirect (not client-side navigate) so every page's local state
    // resets immediately instead of leaving stale data around post-logout.
    window.location.href = '/'
  }

  // Close user dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

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
          <Logo size={44} />

          {/* University Name Text */}
          <div className="leading-tight">
            <h1 className="text-base font-bold text-[#062E66] tracking-tight group-hover:text-[#0B4DBA] transition-colors">
              มหาวิทยาลัยสงขลานครินทร์
            </h1>
            <p className="text-sm text-[#5F6673] font-normal">
              วิทยาเขตสุราษฎร์ธานี
            </p>
          </div>
        </Link>

        {/* ── Center & Right: Desktop Navigation ────────────────────── */}
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

          {!isAuthenticated ? (
            /* Auth Buttons */
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                id="navbar-login-button"
                className="btn-primary text-xs px-4 py-1.5"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/admin/login"
                id="navbar-staff-button"
                className="btn-outline-navy text-xs px-3 py-1.5"
              >
                สำหรับเจ้าหน้าที่
              </Link>
            </div>
          ) : (
            /* User Avatar, Name & Dropdown Menu */
            <div className="relative ml-auto" ref={userMenuRef}>
              <button
                id="navbar-user-menu-button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2.5 py-1.5 pl-1.5 pr-2 rounded-full hover:bg-[#F7F8FA] transition-colors cursor-pointer"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-[#062E66] text-white flex items-center justify-center flex-shrink-0">
                  <User size={15} />
                </div>
                <span className="text-sm font-semibold text-[#062E66]">
                  {userName}
                </span>
                <ChevronDown
                  size={15}
                  className={`text-[#94A3B8] transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-[#DDE2EA] shadow-[0_8px_24px_rgba(6,46,102,0.12)] py-1.5 animate-fade-in z-50"
                >
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F7F8FA] transition-colors"
                  >
                    <User size={15} className="text-[#5F6673]" />
                    โปรไฟล์ของฉัน
                  </Link>
                  <div className="my-1 border-t border-[#EDF2F7]" />
                  <button
                    id="navbar-logout-button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <LogOut size={15} />
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

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
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="btn-primary w-full justify-center text-sm py-2.5">
                    เข้าสู่ระบบ
                  </Link>
                  <Link to="/admin/login" className="btn-outline-navy w-full justify-center text-sm py-2.5">
                    สำหรับเจ้าหน้าที่
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-[#062E66]">
                    <div className="w-7 h-7 rounded-full bg-[#062E66] text-white flex items-center justify-center flex-shrink-0">
                      <User size={15} />
                    </div>
                    {userName}
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#374151] hover:bg-[#F7F8FA] rounded-xl transition-colors"
                  >
                    <User size={16} className="text-[#5F6673]" />
                    โปรไฟล์ของฉัน
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 w-full text-sm py-2.5 rounded-xl font-medium text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <LogOut size={16} />
                    ออกจากระบบ
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
