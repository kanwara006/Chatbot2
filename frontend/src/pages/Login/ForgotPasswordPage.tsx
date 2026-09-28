import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, AlertCircle, ArrowLeft } from 'lucide-react'
import { forgotPassword, extractErrorMessage } from '@/services/authService'
import AuthSplitLayout from '@/components/auth/AuthSplitLayout'

/**
 * ForgotPasswordPage — ให้ผู้ใช้กรอกอีเมลเพื่อขอรหัส OTP ตั้งรหัสผ่านใหม่
 * เมื่อส่งสำเร็จจะพาไปหน้า /reset-password พร้อมแนบอีเมลไปให้กรอก OTP ต่อ
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('กรุณากรอกอีเมล')
      return
    }

    setLoading(true)
    try {
      await forgotPassword(email)
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      setError(extractErrorMessage(err, 'ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      headline={<>ลืมรหัสผ่าน?<br /><span className="text-[#93C5FD]">ไม่ต้องกังวล</span></>}
      description="กรอกอีเมลที่ใช้สมัครสมาชิกไว้ ระบบจะส่งรหัส OTP สำหรับตั้งรหัสผ่านใหม่ไปให้ทางอีเมลภายในไม่กี่นาที"
      hideBrandPanel
      hideTopBranding
    >
      <div>
        <div className="mb-7 text-center">
          <h2 className="text-2xl font-bold text-[#062E66] mb-1">ลืมรหัสผ่าน</h2>
          <p className="text-xs sm:text-sm text-[#5F6673]">กรอกอีเมลที่ใช้สมัครสมาชิกไว้</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-xs font-semibold text-[#111827] mb-1.5">
              อีเมล
            </label>
            <div className="relative">
              <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="forgot-email"
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-sm py-3 rounded-xl shadow-md font-semibold"
            >
              {loading ? 'กำลังส่งรหัส OTP...' : 'ส่งรหัส OTP'}
            </button>
          </div>

          <div className="text-center pt-1">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F6673] hover:text-[#0B4DBA] transition-colors"
            >
              <ArrowLeft size={13} />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </form>
      </div>
    </AuthSplitLayout>
  )
}
