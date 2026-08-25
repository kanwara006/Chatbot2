import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'

/**
 * LoginPage — Split View 50/50 Matched with Figma Login Reference
 */
export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '', rememberMe: false })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.username || !form.password) {
      setError('กรุณากรอกรหัสนักศึกษา/Username และรหัสผ่าน')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    navigate('/chat')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ── Left Column: Deep Navy Branding (50%) ─────────────────── */}
      <div className="lg:w-1/2 bg-[#062E66] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Background Subtle Watermark Circles */}
        <div
          className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full opacity-10 pointer-events-none border-[40px] border-white"
          aria-hidden="true"
        />
        <div
          className="absolute right-12 bottom-12 w-64 h-64 rounded-full opacity-5 pointer-events-none border-[20px] border-white"
          aria-hidden="true"
        />

        {/* Top: PSU Branding */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group" aria-label="กลับสู่หน้าหลัก">
            <div className="w-10 h-10 flex-shrink-0">
              <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="44" height="44" rx="8" fill="rgba(255,255,255,0.15)"/>
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
            <div>
              <p className="text-sm font-bold text-white tracking-tight leading-tight">มหาวิทยาลัยสงขลานครินทร์</p>
              <p className="text-xs text-white/70">วิทยาเขตสุราษฎร์ธานี</p>
            </div>
          </Link>
        </div>

        {/* Center: Main Headline */}
        <div className="relative z-10 my-10 lg:my-0 max-w-lg">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4">
            ยินดีต้อนรับสู่ระบบ<br />
            <span className="text-[#93C5FD]">PSU SLF AI</span>
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            ระบบผู้ช่วยอัจฉริยะสำหรับกองทุนเงินให้กู้ยืมเพื่อการศึกษา มหาวิทยาลัยสงขลานครินทร์ เข้าถึงข้อมูลง่าย จัดการสะดวก รวดเร็วและปลอดภัย
          </p>
        </div>

        {/* Bottom: Security Badge */}
        <div className="relative z-10 flex items-center gap-2.5 text-xs text-white/70 pt-4 border-t border-white/10">
          <ShieldCheck size={18} className="text-[#60A5FA] flex-shrink-0" />
          <span>ระบบมีความปลอดภัยระดับสูงตามมาตรฐานสากล</span>
        </div>
      </div>

      {/* ── Right Column: Login Form (50%) ────────────────────────── */}
      <div className="lg:w-1/2 bg-[#F7F8FA] p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl p-7 sm:p-9 border border-[#DDE2EA] shadow-[0_4px_24px_rgba(6,46,102,0.06)]">
          {/* Header */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-[#062E66] mb-1">
              เข้าสู่ระบบ
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6673]">
              กรุณาเข้าสู่ระบบเพื่อจัดการข้อมูลการกู้ยืมของคุณ
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-5 text-xs sm:text-sm bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
              role="alert"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Student ID */}
            <div>
              <label htmlFor="login-username" className="block text-xs font-semibold text-[#111827] mb-1.5">
                รหัสนักศึกษา / Username
              </label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="login-username"
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="รหัสนักศึกษา 11 หลัก หรืออีเมล"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#111827] mb-1.5">
                รหัสผ่าน / Password
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="กรอกรหัสผ่านของคุณ"
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0B4DBA] hover:text-[#062E66] transition-colors p-1"
                  aria-label={showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Options: Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-[#5F6673] cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-[#DDE2EA] text-[#0B4DBA] focus:ring-0 cursor-pointer"
                />
                <span>จดจำฉันไว้</span>
              </label>
              <Link to="/contact" className="text-[#0B4DBA] hover:underline font-medium">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="login-submit-btn"
                disabled={loading}
                className="btn-primary w-full justify-center text-sm py-3 rounded-xl shadow-md font-semibold"
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>
            </div>
          </form>

          {/* Bottom link: Register */}
          <div className="mt-6 pt-5 text-center border-t border-[#EDF2F7] text-xs text-[#5F6673]">
            <span>ยังไม่มีบัญชี? </span>
            <Link to="/register" className="font-semibold text-[#0B4DBA] hover:underline">
              สมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
