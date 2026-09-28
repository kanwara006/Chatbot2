import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound, Mail } from 'lucide-react'
import { resetPassword, forgotPassword, extractErrorMessage } from '@/services/authService'
import AuthSplitLayout from '@/components/auth/AuthSplitLayout'

interface LocationState {
  email?: string
}

/**
 * ResetPasswordPage — กรอกรหัส OTP ที่ได้รับทางอีเมล + ตั้งรหัสผ่านใหม่
 * อีเมลถูกส่งมาจากหน้า ForgotPasswordPage ผ่าน router state
 * ถ้าเข้าหน้านี้ตรงๆ โดยไม่มีอีเมลติดมา จะให้กรอกอีเมลเองได้ด้วย
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const stateEmail = (location.state as LocationState | null)?.email || ''

  const [email, setEmail] = useState(stateEmail)
  const [form, setForm] = useState({ otp: '', password: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('กรุณากรอกอีเมล')
      return
    }
    if (!/^\d{6}$/.test(form.otp)) {
      setError('กรุณากรอกรหัส OTP 6 หลักที่ได้รับทางอีเมล')
      return
    }
    if (form.password.length < 8) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email, form.otp, form.password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err) {
      setError(extractErrorMessage(err, 'ตั้งรหัสผ่านใหม่ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError('กรุณากรอกอีเมลก่อนขอรหัส OTP ใหม่')
      return
    }
    setError('')
    setResendMsg('')
    setResending(true)
    try {
      await forgotPassword(email)
      setResendMsg('ส่งรหัส OTP ใหม่ให้แล้ว กรุณาตรวจสอบอีเมล')
    } catch (err) {
      setError(extractErrorMessage(err, 'ส่งรหัส OTP ใหม่ไม่สำเร็จ'))
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthSplitLayout
      headline={<>ตั้งรหัสผ่านใหม่<br /><span className="text-[#93C5FD]">ด้วยรหัส OTP</span></>}
      description="กรอกรหัส OTP 6 หลักที่ได้รับทางอีเมล พร้อมตั้งรหัสผ่านใหม่ที่ต้องการใช้งาน"
    >
      <div>
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-[#062E66] mb-1">ตั้งรหัสผ่านใหม่</h2>
          <p className="text-xs sm:text-sm text-[#5F6673]">กรอกรหัส OTP ที่ได้รับทางอีเมล</p>
        </div>

        {error && (
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-5 text-xs sm:text-sm bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
            role="alert"
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div
            className="flex items-start gap-2.5 px-4 py-3.5 rounded-xl text-sm text-left"
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D' }}
          >
            <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
            <span>ตั้งรหัสผ่านใหม่สำเร็จแล้ว กำลังพาไปหน้าเข้าสู่ระบบ...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-xs font-semibold text-[#111827] mb-1.5">
                อีเมล
              </label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@psu.ac.th"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reset-otp" className="block text-xs font-semibold text-[#111827] mb-1.5">
                รหัส OTP (6 หลัก)
              </label>
              <div className="relative">
                <KeyRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reset-otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={form.otp}
                  onChange={(e) => setForm({ ...form, otp: e.target.value.replace(/\D/g, '') })}
                  placeholder="123456"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm tracking-[0.3em] border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  autoComplete="one-time-code"
                />
              </div>
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-xs font-semibold text-[#0B4DBA] hover:underline disabled:opacity-60"
                >
                  {resending ? 'กำลังส่ง...' : 'ขอรหัส OTP ใหม่'}
                </button>
              </div>
              {resendMsg && <p className="text-xs text-[#15803D] mt-1">{resendMsg}</p>}
            </div>

            <div>
              <label htmlFor="reset-password" className="block text-xs font-semibold text-[#111827] mb-1.5">
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reset-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                  className="w-full pl-10 pr-12 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0B4DBA] transition-colors"
                  aria-label={showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="reset-confirm-password" className="block text-xs font-semibold text-[#111827] mb-1.5">
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                <input
                  id="reset-confirm-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-sm py-3 rounded-xl shadow-md font-semibold"
              >
                {loading ? 'กำลังบันทึก...' : 'ตั้งรหัสผ่านใหม่'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-5 text-center border-t border-[#EDF2F7] text-xs text-[#5F6673]">
          <Link to="/login" className="font-semibold text-[#0B4DBA] hover:underline">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </AuthSplitLayout>
  )
}
