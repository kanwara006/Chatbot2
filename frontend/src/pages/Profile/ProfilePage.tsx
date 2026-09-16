import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Save, MessageCircle, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import toast from 'react-hot-toast'
import { useAuth } from '@/context/AuthContext'
import { fetchUserById, updateUser } from '@/services/userService'
import { extractErrorMessage } from '@/services/authService'

const emptyForm = {
  firstName: '',
  lastName: '',
  studentId: '',
  email: '',
  faculty: '',
  department: '',
  role: 'student',
}

/**
 * ProfilePage — หน้าโปรไฟล์นักศึกษา ออกแบบให้อ่านได้เหมือนบัตรประจำตัวนักศึกษาจริง
 * (แถบหัวบัตรสีเข้ม ช่องรูปถ่าย เส้นขอบทอง แถบบาร์โค้ดท้ายบัตร) เพื่อให้ดูเป็นทางการ
 * น่าเชื่อถือ สอดคล้องกับธรรมชาติของ "บัตรนักศึกษา" มากกว่าการ์ดข้อมูลทั่วไป
 *
 * Input:  ผู้ใช้ที่เข้าสู่ระบบ จาก AuthContext
 * Process: โหลดข้อมูลจริงจาก backend, แสดงและแก้ไขข้อมูลส่วนตัว
 * Output: บัตรนักศึกษาดิจิทัล พร้อมแผงแก้ไขข้อมูลด้านล่าง
 */
export default function ProfilePage() {
  const { user } = useAuth()
  const [form, setForm]         = useState(emptyForm)
  const [savedForm, setSavedForm] = useState(emptyForm)
  const [fetching, setFetching] = useState(true)
  const [editing, setEditing]   = useState(false)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (!user) return
    fetchUserById(user.userId)
      .then((u) => {
        const loaded = {
          firstName: u.firstName,
          lastName: u.lastName,
          studentId: u.studentId,
          email: u.email,
          faculty: u.faculty,
          department: u.department,
          role: u.role,
        }
        setForm(loaded)
        setSavedForm(loaded)
      })
      .catch((err) => toast.error(extractErrorMessage(err, 'โหลดข้อมูลโปรไฟล์ไม่สำเร็จ')))
      .finally(() => setFetching(false))
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    try {
      await updateUser(user.userId, {
        first_name: form.firstName,
        last_name: form.lastName,
        faculty: form.faculty,
        department: form.department,
      })
      setSavedForm(form)
      setEditing(false)
      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว')
    } catch (err) {
      toast.error(extractErrorMessage(err, 'บันทึกข้อมูลไม่สำเร็จ'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="container-main section-sm max-w-2xl">
        <div className="mb-6">
          <h1 className="section-heading">โปรไฟล์ของฉัน</h1>
          <p className="text-sm text-[#64748B] mt-1">บัตรประจำตัวและข้อมูลส่วนตัวของคุณในระบบ</p>
        </div>

        {fetching ? (
          <div className="card p-10 text-center text-sm text-[#64748B]" style={{ borderRadius: '20px' }}>
            กำลังโหลดข้อมูล...
          </div>
        ) : (
        <div className="flex flex-col gap-6">

          {/* ── Digital Student ID Card ────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{
              borderRadius: 18,
              overflow: 'hidden',
              background: '#FFFFFF',
              border: '1px solid #DDE2EA',
              boxShadow: '0 2px 6px rgba(6,46,102,0.08), 0 20px 40px rgba(6,46,102,0.10)',
            }}
          >
            {/* Header band */}
            <div
              className="relative"
              style={{ background: 'linear-gradient(135deg, #062E66 0%, #0B4DBA 100%)', padding: '14px 20px' }}
            >
              {/* Subtle guilloché-style security pattern */}
              <div
                aria-hidden
                style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 9px)',
                  pointerEvents: 'none',
                }}
              />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.35)' }}
                  >
                    <ShieldCheck size={15} color="#FFFFFF" />
                  </div>
                  <div>
                    <p className="text-white font-bold leading-tight" style={{ fontSize: 13.5 }}>บัตรประจำตัวนักศึกษา</p>
                    <p style={{ fontSize: 10, letterSpacing: '0.09em', color: 'rgba(255,255,255,0.75)' }}>STUDENT IDENTIFICATION CARD</p>
                  </div>
                </div>
                <span
                  className="flex-shrink-0"
                  style={{
                    fontSize: 10.5, fontWeight: 600, color: '#FFFFFF',
                    background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.4)',
                    padding: '3px 10px', borderRadius: 999,
                  }}
                >
                  นักศึกษา
                </span>
              </div>
            </div>

            {/* Gold trim */}
            <div style={{ height: 3, background: 'linear-gradient(90deg, #D8B45C, #B8892F 50%, #D8B45C)' }} />

            {/* Card body */}
            <div className="flex gap-4 sm:gap-5" style={{ padding: '20px' }}>
              {/* Photo slot */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 84, height: 100, borderRadius: 8,
                  background: 'linear-gradient(150deg, #0B2E5E, #1E5AA8)',
                  border: '3px solid #F7F9FC', boxShadow: '0 0 0 1px #DDE2EA, inset 0 0 0 1px rgba(255,255,255,0.1)',
                  color: '#FFFFFF', fontSize: 30, fontWeight: 700,
                }}
              >
                {form.firstName.charAt(0)}
              </div>

              {/* Fields */}
              <div className="min-w-0 flex-1">
                <p style={{ fontSize: 10, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>ชื่อ-นามสกุล · Full Name</p>
                <p className="font-bold truncate" style={{ fontSize: 18, color: '#111827' }}>{form.firstName} {form.lastName}</p>

                <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 mt-3">
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>รหัสนักศึกษา</p>
                    <p className="font-semibold" style={{ fontSize: 13, color: '#14213D', fontFamily: 'monospace, var(--font-sans)' }}>{form.studentId}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>คณะ</p>
                    <p className="font-semibold truncate" style={{ fontSize: 13, color: '#14213D' }} title={form.faculty}>{form.faculty || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p style={{ fontSize: 10, letterSpacing: '0.08em', color: '#94A3B8', textTransform: 'uppercase' }}>สาขาวิชา</p>
                    <p className="font-semibold truncate" style={{ fontSize: 13, color: '#14213D' }} title={form.department}>{form.department || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer strip: barcode + serial */}
            <div
              className="flex items-center justify-between gap-3"
              style={{ borderTop: '1px dashed #E2E8F0', background: '#F9FBFD', padding: '10px 20px' }}
            >
              <div
                aria-hidden
                style={{
                  width: 108, height: 22,
                  backgroundImage: 'repeating-linear-gradient(90deg, #14213D 0px, #14213D 2px, transparent 2px, transparent 4px, #14213D 4px, #14213D 5px, transparent 5px, transparent 8px)',
                  opacity: 0.55,
                }}
              />
              <p style={{ fontSize: 10.5, color: '#94A3B8', fontFamily: 'monospace, var(--font-sans)' }}>
                เลขที่บัตร {form.studentId}
              </p>
            </div>
            <p className="text-center" style={{ fontSize: 10, color: '#B7C0CE', padding: '6px 16px 12px' }}>
              ออกโดยระบบ AI Chatbot กยศ. · มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี
            </p>
          </motion.div>

          {/* ── Contact meta row ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut', delay: 0.06 }}
            className="flex items-center justify-between gap-3 flex-wrap"
          >
            <div className="flex items-center gap-2 text-sm text-[#5F6673]">
              <Mail size={15} style={{ color: '#94A3B8' }} />
              {form.email}
            </div>
            {!editing && (
              <button
                id="profile-edit-btn"
                onClick={() => setEditing(true)}
                className="btn-secondary text-xs"
                style={{ padding: '6px 14px' }}
              >
                แก้ไขข้อมูล
              </button>
            )}
          </motion.div>

          {/* ── Edit panel (formal, flat) ──────────────────────── */}
          {editing && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              style={{ borderRadius: 16, border: '1px solid #DDE2EA', background: '#FFFFFF', padding: 22 }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-[#14213D] text-sm">แก้ไขข้อมูลส่วนตัว</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setForm(savedForm) }}
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
              </div>

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
            </motion.div>
          )}

          {/* ── CTA ─────────────────────────────────────────────── */}
          <Link
            to="/chat"
            className="btn-primary w-full justify-center"
            style={{ fontSize: '13px', padding: '12px' }}
          >
            <MessageCircle size={15} />
            เริ่มถาม AI Chatbot
          </Link>
        </div>
        )}
      </div>
    </PageLayout>
  )
}
