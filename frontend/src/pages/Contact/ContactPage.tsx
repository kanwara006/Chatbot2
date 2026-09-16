import { useState } from 'react'
import { Phone, Mail, MapPin, Send } from 'lucide-react'
import PageLayout from '@/components/layout/PageLayout'
import campusImage from '@/assets/images/psu-campus.jpg'
import toast from 'react-hot-toast'
import { submitContactMessage } from '@/services/contactService'
import { extractErrorMessage } from '@/services/authService'

/**
 * ContactPage — Matched with Figma Contact Screen Reference
 */
export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: '',
    studentId: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.message) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
      return
    }

    setLoading(true)
    try {
      await submitContactMessage({
        full_name: form.fullName,
        student_id: form.studentId || undefined,
        email: form.email,
        subject: form.subject || undefined,
        message: form.message,
      })
      toast.success('ส่งข้อความเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด')
      setForm({ fullName: '', studentId: '', email: '', subject: '', message: '' })
    } catch (err) {
      toast.error(extractErrorMessage(err, 'ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      {/* ── 1. Hero Section with Campus Backdrop ─────────────────── */}
      <section className="relative w-full overflow-hidden" style={{ minHeight: '260px' }}>
        <div className="absolute inset-0">
          <img
            src={campusImage}
            alt="มหาวิทยาลัยสงขลานครินทร์"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(6,46,102,0.88) 0%, rgba(6,46,102,0.95) 100%)',
          }}
        />
        <div className="container-main relative z-10 py-12 md:py-16 text-center text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
            ติดต่อเรา
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            สอบถามข้อมูลเพิ่มเติมเกี่ยวกับกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) หรือต้องการความช่วยเหลือในการใช้งานระบบ
          </p>
        </div>
      </section>

      {/* ── 2. Contact 2-Column Section ───────────────────────────── */}
      <section className="section-sm">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Col (~40%): ช่องทางการติดต่อ */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)]">
              <h2 className="text-lg font-bold text-[#062E66] mb-6 pb-3 border-b border-[#EDF2F7]">
                ช่องทางการติดต่อ
              </h2>

              <div className="space-y-6 text-xs sm:text-sm">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E5EDFF] flex items-center justify-center flex-shrink-0 text-[#0B4DBA] mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] text-sm mb-1">ที่อยู่ติดต่อ</h3>
                    <p className="text-[#5F6673] leading-relaxed">
                      งานกองทุนเงินให้กู้ยืมเพื่อการศึกษา อาคารสำนักงานวิทยาเขตสุราษฎร์ธานี มหาวิทยาลัยสงขลานครินทร์ 31 หมู่ 6 ถ.สุราษฎร์-นาสาร ต.มะขามเตี้ย อ.เมือง จ.สุราษฎร์ธานี 84000
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E5EDFF] flex items-center justify-center flex-shrink-0 text-[#0B4DBA] mt-0.5">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] text-sm mb-1">เบอร์โทรศัพท์</h3>
                    <a href="tel:077278887" className="text-[#0B4DBA] font-medium hover:underline">
                      077-278-887
                    </a>
                    <p className="text-xs text-[#94A3B8] mt-0.5">วันจันทร์ – ศุกร์ เวลา 08:30 – 16:30 น.</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E5EDFF] flex items-center justify-center flex-shrink-0 text-[#0B4DBA] mt-0.5">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111827] text-sm mb-1">อีเมล</h3>
                    <a href="mailto:Studentloan@psu.ac.th" className="text-[#0B4DBA] font-medium hover:underline break-all">
                      Studentloan@psu.ac.th
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col (~60%): ส่งข้อความถึงเรา */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)]">
              <h2 className="text-lg font-bold text-[#062E66] mb-6 pb-3 border-b border-[#EDF2F7]">
                ส่งข้อความถึงเรา
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full name & Student ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-fullname" className="block text-xs font-semibold text-[#111827] mb-1.5">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="นายสมชาย ใจดี"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-studentid" className="block text-xs font-semibold text-[#111827] mb-1.5">
                      รหัสนักศึกษา (ถ้ามี)
                    </label>
                    <input
                      id="contact-studentid"
                      type="text"
                      value={form.studentId}
                      onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                      placeholder="65xxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-[#111827] mb-1.5">
                    อีเมลติดต่อกลับ <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="student@psu.ac.th"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all"
                  />
                </div>

                {/* Subject dropdown */}
                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#111827] mb-1.5">
                    เรื่องที่ต้องการติดต่อ
                  </label>
                  <select
                    id="contact-subject"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] transition-all cursor-pointer"
                  >
                    <option value="">กรุณาเลือกเรื่องที่ต้องการติดต่อ</option>
                    <option value="การสมัครกู้ยืมเงิน">การสมัครกู้ยืมเงิน</option>
                    <option value="เอกสารประกอบการกู้ยืม">เอกสารประกอบการกู้ยืม</option>
                    <option value="กำหนดการและขั้นตอน">กำหนดการและขั้นตอน</option>
                    <option value="การบันทึกชั่วโมงจิตอาสา">การบันทึกชั่วโมงจิตอาสา</option>
                    <option value="ปัญหาการใช้งานระบบ">ปัญหาการใช้งานระบบ</option>
                    <option value="อื่นๆ">อื่นๆ</option>
                  </select>
                </div>

                {/* Message textarea */}
                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#111827] mb-1.5">
                    รายละเอียดข้อความ <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="ระบุรายละเอียดที่ท่านต้องการสอบถามหรือแจ้งให้ทราบ..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-[#DDE2EA] outline-none bg-[#F7F8FA] focus:bg-white focus:border-[#0B4DBA] text-[#111827] placeholder-[#94A3B8] transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    id="contact-submit-button"
                    disabled={loading}
                    className="btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <span>กำลังส่ง...</span>
                    ) : (
                      <>
                        <span>ส่งข้อความ</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Campus Map Section (Full Width) ────────────────────── */}
      <section className="section-sm pt-0">
        <div className="container-main">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)]">
            <h2 className="text-lg font-bold text-[#062E66] mb-4">
              แผนที่หน่วยงาน
            </h2>
            <div className="w-full h-80 rounded-xl overflow-hidden border border-[#DDE2EA] relative bg-[#EDF2F7]">
              <iframe
                title="งานพัฒนานักศึกษาและศิษย์เก่าสัมพันธ์ มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตสุราษฎร์ธานี"
                src="https://www.google.com/maps?q=%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%99%E0%B8%B2%E0%B8%99%E0%B8%B1%E0%B8%81%E0%B8%A8%E0%B8%B6%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B8%A8%E0%B8%B4%E0%B8%A9%E0%B8%A2%E0%B9%8C%E0%B9%80%E0%B8%81%E0%B9%88%E0%B8%B2%E0%B8%AA%E0%B8%B1%E0%B8%A1%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C%2031%20Tambon%20Makham%20Tia&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
