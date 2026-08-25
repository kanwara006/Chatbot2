import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Shield, Building, GraduationCap, Mail, Lock, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const faculties = [
  'คณะวิทยาศาสตร์และเทคโนโลยีอุตสาหกรรม',
  'คณะศิลปศาสตร์และวิทยาการจัดการ',
  'คณะวิเทศศึกษา',
  'คณะเทคโนโลยีและสิ่งแวดล้อม',
  'คณะนวัตกรรมการเกษตรและประมง',
  'คณะพยาบาลศาสตร์',
]

/**
 * RegisterPage — Split View 50/50 Matched with Figma Registration Reference
 */
export default function RegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    studentId: '',
    faculty: '',
    department: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.fullName || !form.studentId || !form.email || !form.password || !form.confirmPassword) {
      setError('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
      return
    }

    if (form.password.length < 8) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    toast.success('สร้างบัญชีผู้ใช้เรียบร้อยแล้ว')
    navigate('/chat')
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ── Left Column: Deep Navy Branding (50%) ─────────────────── */}
      <div className="lg:w-1/2 bg-[#062E66] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Watermark circles */}
        <div
          className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full opacity-10 pointer-events-none border-[40px] border-white"
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
            เริ่มต้นใช้งาน<br />
            <span className="text-[#93C5FD]">PSU SLF AI</span>
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            ระบบผู้ช่วยอัจฉริยะสำหรับกองทุนเงินให้กู้ยืมเพื่อการศึกษา มหาวิทยาลัยสงขลานครินทร์ สมัครสมาชิกเพื่อเข้าถึงข้อมูลและบันทึกประวัติการสอบถาม
          </p>
        </div>

        {/* Bottom: Security Badge */}
        <div className="relative z-10 flex items-center gap-2.5 text-xs text-white/70 pt-4 border-t border-white/10">
          <ShieldCheck size={18} className="text-[#60A5FA] flex-shrink-0" />
          <span>ระบบมีความปลอดภัยระดับสูงตามมาตรฐานสากล</span>
        </div>
      </div>

      {/* ── Right Column: Register Form (50%) ──────────────────────── */}
      <div className="lg:w-1/2 bg-[#F7F8FA] p-6 sm:p-10 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 border border-[#DDE2EA] shadow-[0_4px_24px_rgba(6,46,102,0.06)]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#062E66] mb-1">
              สร้างบัญชีผู้ใช้
            </h2>
            <p className="text-xs sm:text-sm text-[#5F6673]">
              กรุณากรอกข้อมูลเพื่อลงทะเบียนเข้าใช้งานระบบ
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-4 text-xs sm:text-sm bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
              role="alert"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-semibold text-[#111827] mb-1">
                ชื่อ-นามสกุล <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="นายสมชาย ใจดี"
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                />
              </div>
            </div>

            {/* Student ID */}
            <div>
              <label htmlFor="reg-studentid" className="block text-xs font-semibold text-[#111827] mb-1">
                รหัสประจำตัวนักศึกษา <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reg-studentid"
                  type="text"
                  required
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  placeholder="65123456789 (11 หลัก)"
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                />
              </div>
            </div>

            {/* 2 Cols: Faculty & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label htmlFor="reg-faculty" className="block text-xs font-semibold text-[#111827] mb-1">
                  คณะ
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <select
                    id="reg-faculty"
                    value={form.faculty}
                    onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] transition-all cursor-pointer text-xs"
                  >
                    <option value="">เลือกคณะ</option>
                    {faculties.map((fac) => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="reg-department" className="block text-xs font-semibold text-[#111827] mb-1">
                  สาขาวิชา
                </label>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                  <input
                    id="reg-department"
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="วิทยาการคอมพิวเตอร์"
                    className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* University Email */}
            <div>
              <label htmlFor="reg-email" className="block text-xs font-semibold text-[#111827] mb-1">
                อีเมลมหาวิทยาลัย <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="student.id@psu.ac.th"
                  className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-xs font-semibold text-[#111827] mb-1">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full pl-10 pr-10 py-2 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B4DBA]"
                  aria-label={showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirmpass" className="block text-xs font-semibold text-[#111827] mb-1">
                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reg-confirmpass"
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                  className="w-full pl-10 pr-10 py-2 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B4DBA]"
                  aria-label={showConfirmPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                id="register-submit-btn"
                disabled={loading}
                className="btn-primary w-full justify-center text-sm py-2.5 rounded-xl shadow-md font-semibold"
              >
                {loading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิก'}
              </button>
            </div>
          </form>

          {/* Bottom link: Login */}
          <div className="mt-5 pt-4 text-center border-t border-[#EDF2F7] text-xs text-[#5F6673]">
            <span>มีบัญชีอยู่แล้ว? </span>
            <Link to="/login" className="font-semibold text-[#0B4DBA] hover:underline">
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
