import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Shield, Building, GraduationCap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser, extractErrorMessage } from '@/services/authService'
import AuthSplitLayout from '@/components/auth/AuthSplitLayout'

const faculties = [
  'คณะวิทยาศาสตร์และเทคโนโลยีอุตสาหกรรม',
  'คณะศิลปศาสตร์และวิทยาการจัดการ',
  'คณะวิเทศศึกษา',
  'คณะเทคโนโลยีและสิ่งแวดล้อม',
  'คณะนวัตกรรมการเกษตรและประมง',
  'คณะพยาบาลศาสตร์',
]

/**
 * RegisterPage — สมัครสมาชิกนักศึกษา (โครงสร้างการ์ดลอยทับ ตาม AuthSplitLayout)
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
    try {
      const [firstName, ...rest] = form.fullName.trim().split(/\s+/)
      const lastName = rest.join(' ') || firstName

      await registerUser({
        first_name: firstName,
        last_name: lastName,
        student_id: form.studentId,
        email: form.email,
        faculty: form.faculty || undefined,
        department: form.department || undefined,
        password: form.password,
      })

      toast.success('สร้างบัญชีผู้ใช้เรียบร้อยแล้ว กรุณาเข้าสู่ระบบ')
      navigate('/login')
    } catch (err) {
      setError(extractErrorMessage(err, 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      headline={<>เริ่มต้นใช้งาน<br /><span className="text-[#93C5FD]">PSU SLF AI</span></>}
      description="ระบบผู้ช่วยอัจฉริยะสำหรับกองทุนเงินให้กู้ยืมเพื่อการศึกษา มหาวิทยาลัยสงขลานครินทร์ สมัครสมาชิกเพื่อเข้าถึงข้อมูลและบันทึกประวัติการสอบถาม"
    >
      <div>
          {/* Header */}
          <div className="mb-6 text-center">
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
    </AuthSplitLayout>
  )
}
