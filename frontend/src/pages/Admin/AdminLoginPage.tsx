import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { extractErrorMessage } from '@/services/authService'
import { useAuth } from '@/context/AuthContext'
import AdminAuthSplitLayout from '@/components/admin/AdminAuthSplitLayout'

/**
 * AdminLoginPage — หน้าเข้าสู่ระบบสำหรับเจ้าหน้าที่/แอดมิน
 */
export default function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, logout } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน')
      return
    }

    setLoading(true)
    try {
      const authUser = await login(form.email, form.password)
      if (authUser.role !== 'admin') {
        logout()
        setError('บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบเจ้าหน้าที่')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(extractErrorMessage(err, 'เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuthSplitLayout
      headline={<>ยินดีต้อนรับสู่<br /><span className="text-[#DDD6FE]">ระบบเจ้าหน้าที่</span></>}
      description="เข้าสู่ระบบเพื่อจัดการฐานความรู้ ประกาศข่าวสาร และดูแลระบบแชทบอท AI กยศ. มหาวิทยาลัยสงขลานครินทร์"
    >
      <div className="mb-7 text-center">
        <h2 className="text-xl font-bold text-[#312E81]">เข้าสู่ระบบเจ้าหน้าที่</h2>
        <p className="text-xs sm:text-sm text-[#5F6673] mt-1">กรอกข้อมูลบัญชีของคุณเพื่อเข้าใช้งาน</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-5 text-xs sm:text-sm bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
          role="alert"
        >
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-login-email" className="block text-xs font-semibold text-[#111827] mb-1.5">
            อีเมลเจ้าหน้าที่
          </label>
          <div className="relative">
            <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="admin-login-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="staff@psu.ac.th"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#7C3AED] text-[#111827] placeholder-[#94A3B8] transition-all focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
              autoComplete="username"
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-login-password" className="block text-xs font-semibold text-[#111827] mb-1.5">
            รหัสผ่าน
          </label>
          <div className="relative">
            <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="admin-login-password"
              type={showPass ? 'text' : 'password'}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="กรอกรหัสผ่านของคุณ"
              className="w-full pl-10 pr-12 py-3 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#7C3AED] text-[#111827] placeholder-[#94A3B8] transition-all focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#7C3AED] transition-colors"
              aria-label={showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 rounded-xl text-sm font-bold text-white transition-shadow duration-200 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #312E81, #7C3AED)', boxShadow: '0 12px 32px rgba(49,46,129,0.35)' }}
        >
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </motion.button>
      </form>

      <div className="mt-7 pt-5 text-center text-xs space-y-2.5 border-t border-[#EDF2F7]">
        <p className="text-[#5F6673]">
          <span>ยังไม่มีบัญชีเจ้าหน้าที่? </span>
          <Link to="/admin/register" className="font-semibold text-[#6D28D9] hover:underline">
            สมัครสมาชิกเจ้าหน้าที่
          </Link>
        </p>
        <p>
          <Link to="/login" className="text-[#94A3B8] hover:text-[#5F6673] hover:underline transition-colors">
            กลับไปหน้าเข้าสู่ระบบนักศึกษา
          </Link>
        </p>
      </div>
    </AdminAuthSplitLayout>
  )
}
