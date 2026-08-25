import { useState } from 'react'
import { User, Mail, BookOpen, Building, Shield, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import toast from 'react-hot-toast'

// Mock user — Phase 9 จะโหลดจาก AuthContext
const mockUser = {
  firstName:  'สมชาย',
  lastName:   'ใจดี',
  studentId:  '65123456789',
  email:      'somchai.j@psu.ac.th',
  faculty:    'คณะวิทยาศาสตร์และเทคโนโลยีอุตสาหกรรม',
  department: 'วิทยาการคอมพิวเตอร์',
  role:       'student',
}

/**
 * ProfilePage — หน้าโปรไฟล์นักศึกษา
 *
 * Input:  User data จาก AuthContext (mock ก่อน Phase 9)
 * Process: แสดงและแก้ไขข้อมูลส่วนตัว
 * Output: Profile card พร้อมฟอร์มแก้ไข
 */
export default function ProfilePage() {
  const [form, setForm]     = useState(mockUser)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setEditing(false)
    toast.success('บันทึกข้อมูลเรียบร้อยแล้ว')
  }

  const info = [
    { icon: User,     label: 'ชื่อ-นามสกุล', value: `${form.firstName} ${form.lastName}` },
    { icon: Shield,   label: 'รหัสนักศึกษา', value: form.studentId },
    { icon: Mail,     label: 'Email',        value: form.email },
    { icon: Building, label: 'คณะ',          value: form.faculty },
    { icon: BookOpen, label: 'สาขาวิชา',    value: form.department },
  ]

  return (
    <PageLayout>
      <div className="container-main section-sm max-w-3xl">
        <div className="mb-6">
          <h1 className="section-heading">โปรไฟล์ของฉัน</h1>
          <p className="text-sm text-[#64748B] mt-1">จัดการข้อมูลส่วนตัวของคุณ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">

          {/* Left: Avatar card */}
          <div className="card p-6 flex flex-col items-center text-center" style={{ borderRadius: '20px', height: 'fit-content' }}>
            {/* Avatar */}
            <div
              className="flex items-center justify-center rounded-full text-white text-2xl font-bold mb-4"
              style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #0B2E5E, #1E5AA8)', boxShadow: '0 4px 16px rgba(30,90,168,0.25)' }}
            >
              {form.firstName.charAt(0)}
            </div>
            <h2 className="font-bold text-[#14213D] text-base">{form.firstName} {form.lastName}</h2>
            <p className="text-sm text-[#64748B] mt-0.5">{form.studentId}</p>
            <span
              className="badge badge-blue mt-3"
              style={{ fontSize: '11px' }}
            >
              นักศึกษา
            </span>

            <div className="w-full mt-6 pt-4" style={{ borderTop: '1px solid #F1F5F9' }}>
              <p className="text-xs text-[#94A3B8] mb-1">สังกัด</p>
              <p className="text-xs font-medium text-[#14213D] leading-snug">{form.faculty}</p>
              <p className="text-xs text-[#64748B] mt-1">{form.department}</p>
            </div>

            <Link
              to="/chat"
              className="btn-primary w-full justify-center mt-5"
              style={{ fontSize: '13px', padding: '10px' }}
            >
              เริ่มถาม AI Chatbot
            </Link>
          </div>

          {/* Right: Info / Edit form */}
          <div className="card p-6" style={{ borderRadius: '20px' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[#14213D]">ข้อมูลส่วนตัว</h3>
              {!editing ? (
                <button
                  id="profile-edit-btn"
                  onClick={() => setEditing(true)}
                  className="btn-secondary text-xs"
                  style={{ padding: '6px 14px' }}
                >
                  แก้ไขข้อมูล
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setForm(mockUser) }}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:bg-[#F7F9FC] transition-colors border border-[#E2E8F0]"
                  >
                    ยกเลิก
                  </button>
                  <button
                    id="profile-save-btn"
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs text-white font-medium transition-all"
                    style={{ background: '#1E5AA8', boxShadow: '0 2px 8px rgba(30,90,168,0.20)' }}
                  >
                    {loading ? <span className="block w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <Save size={12} />}
                    บันทึก
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {!editing ? (
                // View mode
                info.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-start gap-4">
                      <div
                        className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ width: 36, height: 36, background: '#EFF6FF' }}
                      >
                        <Icon size={16} style={{ color: '#1E5AA8' }} />
                      </div>
                      <div>
                        <p className="text-xs text-[#94A3B8] mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-[#14213D]">{item.value}</p>
                      </div>
                    </div>
                  )
                })
              ) : (
                // Edit mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'pf-first', key: 'firstName', label: 'ชื่อ' },
                      { id: 'pf-last',  key: 'lastName',  label: 'นามสกุล' },
                    ].map((f) => (
                      <div key={f.id}>
                        <label htmlFor={f.id} className="block text-xs font-semibold text-[#14213D] mb-1.5">{f.label}</label>
                        <input
                          id={f.id}
                          type="text"
                          value={form[f.key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none text-[#14213D]"
                          style={{ border: '1.5px solid #E2E8F0', background: '#F7F9FC' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = '#1E5AA8'; e.currentTarget.style.background = '#fff' }}
                          onBlur={(e)  => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F7F9FC' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label htmlFor="pf-dept" className="block text-xs font-semibold text-[#14213D] mb-1.5">สาขาวิชา</label>
                    <input
                      id="pf-dept"
                      type="text"
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none text-[#14213D]"
                      style={{ border: '1.5px solid #E2E8F0', background: '#F7F9FC' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#1E5AA8'; e.currentTarget.style.background = '#fff' }}
                      onBlur={(e)  => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F7F9FC' }}
                    />
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    * รหัสนักศึกษาและ Email ไม่สามารถเปลี่ยนแปลงได้ กรุณาติดต่อเจ้าหน้าที่
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
