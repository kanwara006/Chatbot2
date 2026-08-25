import { Clock, Bot, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const scheduleItems = [
  {
    semester: 'ภาคเรียนที่ 1',
    title: 'ยื่นแบบคำขอกู้ยืมเงิน',
    target: 'สำหรับผู้กู้รายใหม่ และผู้กู้รายเก่าย้ายสถานศึกษา',
    period: '1 เม.ย. – 15 มิ.ย.',
    details: [
      'ลงทะเบียนขอรับสิทธิ์ผ่านระบบ กยศ. Connect',
      'จัดส่งเอกสารประกอบการกู้ยืมเงินให้แก่มหาวิทยาลัย',
      'เข้ารับการสัมภาษณ์และตรวจสอบคุณสมบัติ',
    ],
  },
  {
    semester: 'ภาคเรียนที่ 1',
    title: 'บันทึกสัญญากู้ยืมเงิน',
    target: 'สำหรับผู้ที่ผ่านการอนุมัติการให้กู้ยืมเงิน',
    period: 'กรกฎาคม',
    details: [
      'จัดพิมพ์แบบฟอร์มสัญญากู้ยืมเงินจากระบบ',
      'ลงนามในสัญญาร่วมกับผู้ค้ำประกัน',
      'ส่งสัญญากู้ยืมฉบับจริง ณ งานกองทุนฯ วิทยาเขต',
    ],
  },
  {
    semester: 'ภาคเรียนที่ 2',
    title: 'ยื่นแบบยืนยันการเบิกเงินกู้ยืม',
    target: 'สำหรับผู้กู้ยืมต่อเนื่องทุกชั้นปี',
    period: 'พฤศจิกายน – ธันวาคม',
    details: [
      'ลงทะเบียนเรียนและบันทึกยอดค่าเล่าเรียน',
      'ยืนยันการลงทะเบียนเรียนในระบบ กยศ. Connect',
      'ตรวจสอบการโอนเงินเข้าบัญชีตามรอบกำหนด',
    ],
  },
]

/**
 * SchedulePage — Matched with Figma Schedule Reference
 */
export default function SchedulePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Navbar isAuthenticated={true} userName="กัญวรา ใจดี" />

      <main className="flex-1">
        {/* ── Solid Deep Navy Hero ───────────────────────────────── */}
        <section className="bg-[#062E66] text-white py-14 md:py-18 text-center">
          <div className="container-main max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
              กำหนดการกองทุนเงินให้กู้ยืมเพื่อการศึกษา (กยศ.)
            </h1>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              ปฏิทินและกำหนดการดำเนินงานที่สำคัญสำหรับนักศึกษา มหาวิทยาลัยสงขลานครินทร์
            </p>
          </div>
        </section>

        {/* ── 3 Schedule Cards Grid ──────────────────────────────── */}
        <section className="section-sm">
          <div className="container-main">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {scheduleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-blue text-[11px] font-semibold px-3 py-1 rounded-full">
                      {item.semester}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-[#0B4DBA] font-bold bg-[#F7F8FA] px-2.5 py-1 rounded-lg border border-[#DDE2EA]">
                      <Clock size={13} />
                      <span>{item.period}</span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[#111827] mb-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-[#5F6673] mb-4">
                    {item.target}
                  </p>

                  <div className="pt-4 border-t border-[#EDF2F7] flex-1">
                    <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2.5">
                      กิจกรรมที่ต้องปฏิบัติ:
                    </h3>
                    <ul className="space-y-2 text-xs text-[#5F6673]">
                      {item.details.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckCircle2 size={14} className="text-[#0B4DBA] mt-0.5 flex-shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Bottom Need Help / AI CTA ───────────────────────── */}
            <div className="mt-12 bg-white rounded-2xl p-7 sm:p-8 text-center border border-[#DDE2EA] shadow-[0_2px_12px_rgba(6,46,102,0.04)] max-w-3xl mx-auto">
              <h2 className="text-lg sm:text-xl font-bold text-[#062E66] mb-2">
                หากมีข้อสงสัย (Need Help?)
              </h2>
              <p className="text-[#5F6673] text-xs sm:text-sm max-w-lg mx-auto mb-5 leading-relaxed">
                สอบถามข้อมูลเพิ่มเติมเกี่ยวกับกำหนดการ หรือต้องการความช่วยเหลือในการดำเนินการ
              </p>
              <Link
                to="/chat"
                id="schedule-chat-button"
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
