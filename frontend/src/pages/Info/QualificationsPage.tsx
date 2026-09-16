import { User, GraduationCap, Wallet, CheckCircle2, MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

/**
 * QualificationsPage — Matched with Figma Borrower Qualifications Reference
 */
export default function QualificationsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Navbar />

      <main className="flex-1">
        {/* ── Solid Deep Navy Hero ───────────────────────────────── */}
        <section className="bg-[#062E66] text-white py-14 md:py-18 text-center">
          <div className="container-main max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              คุณสมบัติของผู้กู้
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              ตรวจสอบคุณสมบัติเบื้องต้นสำหรับการยื่นขอรับทุนการศึกษาผ่านกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.) มหาวิทยาลัยสงขลานครินทร์
            </p>
          </div>
        </section>

        {/* ── 3 Qualifications Cards Grid ────────────────────────── */}
        <section className="section-sm">
          <div className="container-main">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

              {/* Card 1: คุณสมบัติทั่วไป */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col">
                <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                  <User size={26} strokeWidth={2} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-4">
                  คุณสมบัติทั่วไป
                </h2>
                <ul className="space-y-3 text-xs sm:text-[13px] text-[#5F6673] flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>มีสัญชาติไทย</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>เป็นนักศึกษามหาวิทยาลัยสงขลานครินทร์ (ระดับปริญญาตรี/โท/เอก)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>มีความประพฤติดี ไม่เคยต้องโทษจำคุกในคดีอาญา</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: คุณสมบัติทางวิชาการ */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col">
                <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                  <GraduationCap size={26} strokeWidth={2} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-4">
                  คุณสมบัติทางวิชาการ
                </h2>
                <ul className="space-y-3 text-xs sm:text-[13px] text-[#5F6673] flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>ผลการเรียนเฉลี่ยสะสม (GPAX) ไม่ต่ำกว่า 2.00</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>ลงทะเบียนเรียนครบตามแผนการศึกษาของหลักสูตร</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>มีชั่วโมงกิจกรรมจิตอาสาไม่น้อยกว่า 36 ชั่วโมง/ปีการศึกษา</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: คุณสมบัติทางรายได้ */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col">
                <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                  <Wallet size={26} strokeWidth={2} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-4">
                  คุณสมบัติทางรายได้
                </h2>
                <ul className="space-y-3 text-xs sm:text-[13px] text-[#5F6673] flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>รายได้ครอบครัวรวมกันไม่เกิน 360,000 บาท/ปี (สำหรับผู้กู้ลักษณะที่ 1 ขาดแคลนทุนทรัพย์)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>ไม่จำกัดรายได้ครอบครัว สำหรับผู้กู้ในสาขาวิชาที่เป็นความต้องการหลัก (ลักษณะที่ 2, 3, 4)</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* ── Bottom Need Help / AI CTA ───────────────────────── */}
            <div className="mt-10 bg-white rounded-2xl p-7 sm:p-8 text-center border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] max-w-3xl mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-[#062E66] mb-2">
                ไม่แน่ใจว่าตนเองมีคุณสมบัติครบถ้วนหรือไม่?
              </h2>
              <p className="text-[#5F6673] text-xs sm:text-sm max-w-lg mx-auto mb-5 leading-relaxed">
                พูดคุยกับ AI Assistant ของเราเพื่อตรวจสอบคุณสมบัติเบื้องต้นแบบเจาะจงสำหรับกรณีของคุณ ได้ตลอด 24 ชั่วโมง
              </p>
              <Link
                to="/chat"
                id="qualifications-chat-button"
                className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5 shadow-md"
              >
                <MessageSquare size={16} />
                <span>เริ่มแชทกับ AI</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
