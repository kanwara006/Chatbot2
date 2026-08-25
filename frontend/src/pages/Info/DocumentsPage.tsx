import { User, Receipt, GraduationCap, CheckCircle2, Bot } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

/**
 * DocumentsPage — Matched with Figma Required Documents Reference
 */
export default function DocumentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Navbar isAuthenticated={true} userName="กัญวรา ใจดี" />

      <main className="flex-1">
        {/* ── Solid Deep Navy Hero ───────────────────────────────── */}
        <section className="bg-[#062E66] text-white py-14 md:py-18 text-center">
          <div className="container-main max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              เอกสารที่ใช้ในการสมัคร
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              เตรียมความพร้อมก่อนสมัครกู้ยืมกองทุนเพื่อการศึกษา (กยศ.) ด้วยรายการเอกสารที่จำเป็นต้องใช้ในการยื่นคำร้อง
            </p>
          </div>
        </section>

        {/* ── 3 Documents Cards Grid ─────────────────────────────── */}
        <section className="section-sm">
          <div className="container-main">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">

              {/* Card 1: เอกสารส่วนตัว */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col">
                <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                  <User size={26} strokeWidth={2} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-4">
                  เอกสารส่วนตัว
                </h2>
                <ul className="space-y-3 text-xs sm:text-[13px] text-[#5F6673] flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>สำเนาบัตรประจำตัวประชาชนของผู้กู้ยืม (รับรองสำเนาถูกต้อง)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>สำเนาทะเบียนบ้านของผู้กู้ยืม</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>สำเนาบัตรประจำตัวประชาชนของบิดา มารดา หรือผู้ปกครอง</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>สำเนาทะเบียนบ้านของบิดา มารดา หรือผู้ปกครอง</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: เอกสารรายได้ */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col">
                <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                  <Receipt size={26} strokeWidth={2} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-4">
                  เอกสารรายได้
                </h2>
                <ul className="space-y-3 text-xs sm:text-[13px] text-[#5F6673] flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>หนังสือรับรองรายได้ครอบครัว (แบบฟอร์ม กยศ. 102)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>สลิปเงินเดือน หรือหนังสือรับรองเงินเดือน (กรณีมีรายได้ประจำ)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>สำเนาบัตรประจำตัวเจ้าหน้าที่ของรัฐ (ผู้รับรองรายได้)</span>
                  </li>
                </ul>
              </div>

              {/* Card 3: เอกสารการศึกษา */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col">
                <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                  <GraduationCap size={26} strokeWidth={2} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-4">
                  เอกสารการศึกษา
                </h2>
                <ul className="space-y-3 text-xs sm:text-[13px] text-[#5F6673] flex-1">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>สำเนาทะเบียนแสดงผลการเรียน (Transcript) ภาคเรียนล่าสุด</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>ใบรับรองสภาพการเป็นนักศึกษา มหาวิทยาลัยสงขลานครินทร์</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                    <span>หลักฐานการเข้าร่วมโครงการจิตอาสา (อย่างน้อย 36 ชั่วโมง)</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* ── Bottom Need Help / AI CTA (Fixed Font Glitch) ───── */}
            <div className="mt-10 bg-white rounded-2xl p-7 sm:p-8 text-center border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] max-w-3xl mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-[#062E66] mb-2">
                มีคำถามเพิ่มเติมเกี่ยวกับเอกสาร?
              </h2>
              <p className="text-[#5F6673] text-xs sm:text-sm max-w-lg mx-auto mb-5 leading-relaxed">
                หากคุณไม่แน่ใจว่าต้องเตรียมเอกสารประเภทใด หรือมีข้อสงสัยเกี่ยวกับรายละเอียดของเอกสารแต่ละฉบับ สามารถสอบถาม AI Chatbot ของเราได้ทันที
              </p>
              <Link
                to="/chat"
                id="documents-chat-button"
                className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5 shadow-md"
              >
                <Bot size={17} />
                <span>สอบถาม AI Chatbot</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
