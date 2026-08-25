import { Link } from 'react-router-dom'
import { Users, FileText, ClipboardList, Calendar, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'

// ── Menu Items ──────────────────────────────────────────────────────
const menuItems = [
  {
    id:    'qualifications',
    icon:  Users,
    title: 'คุณสมบัติผู้กู้',
    desc:  'ตรวจสอบคุณสมบัติและเงื่อนไขการกู้ยืม',
    href:  '/qualifications',
  },
  {
    id:    'documents',
    icon:  FileText,
    title: 'เอกสารที่ใช้',
    desc:  'รายการเอกสารที่ต้องใช้ในการดำเนินการ',
    href:  '/documents',
  },
  {
    id:    'process',
    icon:  ClipboardList,
    title: 'ขั้นตอนการกู้ยืม',
    desc:  'ขั้นตอนการสมัครกู้ยืมอย่างละเอียด',
    href:  '/loan-process',
  },
  {
    id:    'schedule',
    icon:  Calendar,
    title: 'กำหนดการ',
    desc:  'ปฏิทินและกำหนดการดำเนินงาน กยศ.',
    href:  '/schedule',
  },
  {
    id:    'contact',
    icon:  Headphones,
    title: 'ติดต่อเจ้าหน้าที่',
    desc:  'ช่องทางการติดต่อและขอรับคำปรึกษา',
    href:  '/contact',
  },
]

/**
 * QuickMenu — 5 Floating Quick Access Cards matching Figma Design
 */
export default function QuickMenu() {
  return (
    <section id="quick-menu" aria-label="Quick Access Menu" className="relative z-20">
      <div className="container-main">
        {/* Overlap Hero section with negative margin */}
        <motion.div
          className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_8px_30px_rgba(6,46,102,0.08)] border border-[#DDE2EA]"
          style={{ marginTop: '-42px' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-[#EDF2F7]">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  id={`quick-menu-${item.id}`}
                  className="group flex flex-col items-center text-center p-4 sm:p-5 transition-all duration-200 hover:bg-[#F7F8FA] rounded-xl"
                >
                  {/* Circular Icon in Light Blue Background */}
                  <div className="w-14 h-14 rounded-full bg-[#E5EDFF] flex items-center justify-center mb-3 text-[#0B4DBA] group-hover:scale-105 transition-transform duration-200">
                    <Icon size={24} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h2 className="font-bold text-sm sm:text-[15px] text-[#111827] group-hover:text-[#0B4DBA] transition-colors mb-1">
                    {item.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-[#5F6673] leading-snug line-clamp-2 max-w-[180px]">
                    {item.desc}
                  </p>
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
