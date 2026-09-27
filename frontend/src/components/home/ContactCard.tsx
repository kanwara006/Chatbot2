import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

/**
 * ContactCard — Deep Navy Card matching Figma Home Reference
 */
export default function ContactCard() {
  return (
    <motion.aside
      aria-label="ข้อมูลติดต่อเจ้าหน้าที่"
      className="bg-[#062E66] rounded-2xl p-6 sm:p-7 flex flex-col justify-between h-full text-white shadow-[0_4px_20px_rgba(6,46,102,0.15)]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <div>
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-bold mb-1 text-white">
          ติดต่อสอบถาม
        </h2>
        <p className="text-white/70 text-xs sm:text-sm mb-6">
          งานกองทุนเงินให้กู้ยืมเพื่อการศึกษา
        </p>

        {/* Contact Info List */}
        <div className="space-y-4 text-xs sm:text-[13px]">
          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#93C5FD] mt-0.5">
              <Phone size={15} />
            </div>
            <div>
              <p className="text-white/50 text-[11px]">เบอร์โทรศัพท์</p>
              <a href="tel:077278887" className="text-white font-medium hover:text-[#93C5FD] transition-colors">
                077-278-887
              </a>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#93C5FD] mt-0.5">
              <Mail size={15} />
            </div>
            <div>
              <p className="text-white/50 text-[11px]">อีเมล</p>
              <a href="mailto:studentloanpsu@gmail.com" className="text-white font-medium hover:text-[#93C5FD] transition-colors break-all">
                studentloanpsu@gmail.com
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-[#93C5FD] mt-0.5">
              <MapPin size={15} />
            </div>
            <div>
              <p className="text-white/50 text-[11px]">ที่อยู่ติดต่อ</p>
              <p className="text-white/80 leading-relaxed">
                อาคารสำนักงานวิทยาเขตสุราษฎร์ธานี มหาวิทยาลัยสงขลานครินทร์ สุราษฎร์ธานี 84000
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Button CTA */}
      <div className="pt-6 mt-6 border-t border-white/10">
        <Link
          to="/contact"
          id="contact-card-cta"
          className="btn-outline-white w-full text-center text-xs sm:text-sm py-2.5 rounded-full block"
        >
          ข้อมูลการติดต่อทั้งหมด
        </Link>
      </div>
    </motion.aside>
  )
}
