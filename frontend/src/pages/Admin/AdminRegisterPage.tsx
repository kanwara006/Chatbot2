import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerAdmin, extractErrorMessage } from '@/services/authService'
import AdminAuthSplitLayout from '@/components/admin/AdminAuthSplitLayout'

/**
 * AdminRegisterPage — สมัครสมาชิกสำหรับเจ้าหน้าที่/แอดมิน
 * ต้องมีรหัสเจ้าหน้าที่ (staff code) จากงานกองทุนฯ เพื่อยืนยันสิทธิ์การสมัคร
 */
export default function AdminRegisterPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    staffCode: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.fullName || !form.email || !form.password || !form.confirmPassword || !form.staffCode) {
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
    try {
      const [firstName, ...rest] = form.fullName.trim().split(/\s+/)
      const lastName = rest.join(' ') || firstName

      await registerAdmin({
        first_name: firstName,
        last_name: lastName,
        email: form.email,
        password: form.password,
        staff_code: form.staffCode,
      })

      toast.success('สร้างบัญชีเจ้าหน้าที่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบ')
      navigate('/admin/login')
    } catch (err) {
      setError(extractErrorMessage(err, 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminAuthSplitLayout
      headline={<>เริ่มต้นใช้งาน<br /><span className="text-[#DDD6FE]">ระบบเจ้าหน้าที่</span></>}
      description="สมัครสมาชิกเพื่อเข้าจัดการฐานความรู้ ประกาศข่าวสาร และดูแลระบบแชทบอท AI กยศ. มหาวิทยาลัยสงขลานครินทร์"
    >
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold text-[#312E81]">สมัครสมาชิกเจ้าหน้าที่</h2>
        <p className="text-xs sm:text-sm text-[#5F6673] mt-1">ต้องมีรหัสเจ้าหน้าที่จากงานกองทุนฯ เพื่อยืนยันสิทธิ์</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-4 text-xs sm:text-sm bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626]"
          role="alert"
        >
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="admin-reg-fullname" className="block text-xs font-semibold text-[#111827] mb-1">
            ชื่อ-นามสกุล <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="admin-reg-fullname"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="นางสาวใจดี มีสุข"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#7C3AED] text-[#111827] placeholder-[#94A3B8] transition-all focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="admin-reg-email" className="block text-xs font-semibold text-[#111827] mb-1">
            อีเมลเจ้าหน้าที่ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="admin-reg-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="staff@psu.ac.th"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#7C3AED] text-[#111827] placeholder-[#94A3B8] transition-all focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="admin-reg-password" className="block text-xs font-semibold text-[#111827] mb-1">
              รหัสผ่าน <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="admin-reg-password"
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="8+ ตัวอักษร"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#7C3AED] text-[#111827] placeholder-[#94A3B8] transition-all focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#7C3AED] transition-colors"
                aria-label={showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="admin-reg-confirmpass" className="block text-xs font-semibold text-[#111827] mb-1">
              ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                id="admin-reg-confirmpass"
                type={showConfirmPass ? 'text' : 'password'}
                required
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="กรอกซ้ำ"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#7C3AED] text-[#111827] placeholder-[#94A3B8] transition-all focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#7C3AED] transition-colors"
                aria-label={showConfirmPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="admin-reg-staffcode" className="block text-xs font-semibold text-[#111827] mb-1">
            รหัสเจ้าหน้าที่ (Staff Code) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="admin-reg-staffcode"
              type="text"
              required
              value={form.staffCode}
              onChange={(e) => setForm({ ...form, staffCode: e.target.value })}
              placeholder="รับจากงานกองทุน กยศ."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#7C3AED] text-[#111827] placeholder-[#94A3B8] transition-all focus:shadow-[0_0_0_3px_rgba(124,58,237,0.15)]"
            />
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
          {loading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิกเจ้าหน้าที่'}
        </motion.button>
      </form>

      <div className="mt-6 pt-5 text-center text-xs text-[#5F6673] border-t border-[#EDF2F7]">
        <span>มีบัญชีอยู่แล้ว? </span>
        <Link to="/admin/login" className="font-semibold text-[#6D28D9] hover:underline">
          เข้าสู่ระบบ
        </Link>
      </div>
    </AdminAuthSplitLayout>
  )
}
