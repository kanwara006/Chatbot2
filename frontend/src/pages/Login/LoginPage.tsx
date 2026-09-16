import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { extractErrorMessage } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'
import AuthSplitLayout from '@/components/auth/AuthSplitLayout'

/**
 * LoginPage — เข้าสู่ระบบนักศึกษา (โครงสร้างการ์ดลอยทับ ตาม AuthSplitLayout)
 */
export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

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
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch (err) {
      setError(extractErrorMessage(err, 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      headline={<>ยินดีต้อนรับสู่ระบบ<br /><span className="text-[#93C5FD]">PSU SLF AI</span></>}
      description="ระบบผู้ช่วยอัจฉริยะสำหรับกองทุนเงินให้กู้ยืมเพื่อการศึกษา มหาวิทยาลัยสงขลานครินทร์ เข้าถึงข้อมูลง่าย จัดการสะดวก รวดเร็วและปลอดภัย"
    >
      <div>
          {/* Header */}
          <div className="mb-7 text-center">
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
    </AuthSplitLayout>
  )
}
