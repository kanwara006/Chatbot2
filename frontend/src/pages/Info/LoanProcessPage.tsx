import { Send, FileCheck, SearchCheck, FileSignature, Landmark, Bot } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const steps = [
  {
    step: '1',
    title: '1. Submit Request (ยื่นคำขอกู้ยืม)',
    desc: 'ดำเนินการยื่นคำขอกู้ยืมเงินผ่านแอปพลิเคชัน กยศ. Connect ภายในระยะเวลาที่มหาวิทยาลัยและกองทุนกำหนดในแต่ละภาคเรียน',
    icon: Send,
  },
  {
    step: '2',
    title: '2. Document Submission (ส่งเอกสาร)',
    desc: 'จัดเตรียมและนำส่งเอกสารประกอบการกู้ยืมที่ถูกต้องครบถ้วนให้แก่งานกองทุนเงินให้กู้ยืมเพื่อการศึกษา มหาวิทยาลัยสงขลานครินทร์',
    icon: FileCheck,
  },
  {
    step: '3',
    title: '3. Status Verification (ตรวจสอบสถานะ)',
    desc: 'เจ้าหน้าที่มหาวิทยาลัยทำการตรวจสอบคุณสมบัติและเอกสาร นักศึกษาสามารถติดตามสถานะการพิจารณาได้ผ่านระบบอย่างต่อเนื่อง',
    icon: SearchCheck,
  },
  {
    step: '4',
    title: '4. Contract Signing (ลงนามสัญญา)',
    desc: 'เมื่อได้รับการอนุมัติการให้กู้ยืม ให้นักศึกษาและผู้ค้ำประกันดำเนินการจัดทำและลงนามในสัญญากู้ยืมเงินตามวันและเวลาที่ประกาศ',
    icon: FileSignature,
  },
  {
    step: '5',
    title: '5. Fund Transfer (โอนเงินเข้าบัญชี)',
    desc: 'กองทุนฯ ดำเนินการโอนเงินค่าเล่าเรียนเข้าบัญชีมหาวิทยาลัย และโอนเงินค่าครองชีพเข้าบัญชีธนาคารของผู้กู้ยืมเงินโดยตรง',
    icon: Landmark,
  },
]

/**
 * LoanProcessPage — Matched with Figma Loan Process Reference
 */
export default function LoanProcessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Navbar />

      <main className="flex-1">
        {/* ── Solid Deep Navy Hero ───────────────────────────────── */}
        <section className="bg-[#062E66] text-white py-14 md:py-18 text-center">
          <div className="container-main max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              ขั้นตอนการกู้ยืมเงิน กยศ.
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              โปรดศึกษาและปฏิบัติตามขั้นตอนอย่างละเอียด เพื่อรักษาสิทธิ์ในการกู้ยืม ระบบ AI พร้อมให้คำแนะนำในทุกขั้นตอน
            </p>
          </div>
        </section>

        {/* ── Process Steps Grid ─────────────────────────────────── */}
        <section className="section-sm">
          <div className="container-main">
            {/* Top row: 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-6 lg:mb-8">
              {steps.slice(0, 3).map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.step}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <h2 className="text-base sm:text-[17px] font-bold text-[#111827] mb-3">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-[13px] text-[#5F6673] leading-relaxed flex-1">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Bottom row: 2 centered cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {steps.slice(3, 5).map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.step}
                    className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center text-[#0B4DBA] mb-5">
                      <Icon size={26} strokeWidth={2} />
                    </div>
                    <h2 className="text-base sm:text-[17px] font-bold text-[#111827] mb-3">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-[13px] text-[#5F6673] leading-relaxed flex-1">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* ── Bottom Need Help / AI CTA ───────────────────────── */}
            <div className="mt-12 bg-white rounded-2xl p-7 sm:p-8 text-center border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] max-w-3xl mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-[#062E66] mb-2">
                หากมีข้อสงสัย (Need Help?)
              </h2>
              <p className="text-[#5F6673] text-xs sm:text-sm max-w-lg mx-auto mb-5 leading-relaxed">
                หากคุณพบปัญหาในขั้นตอนใด หรือต้องการสอบถามรายละเอียดเพิ่มเติมเกี่ยวกับเอกสาร AI Chatbot ของเราพร้อมให้ความช่วยเหลือตลอด 24 ชั่วโมง
              </p>
              <Link
                to="/chat"
                id="loan-process-chat-button"
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
