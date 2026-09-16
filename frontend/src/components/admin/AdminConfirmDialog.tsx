import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface AdminConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  loadingText?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * AdminConfirmDialog — กล่องยืนยันมาตรฐานก่อนทำรายการที่ย้อนกลับไม่ได้ (เช่น ลบข้อมูล)
 * ใช้ร่วมกันทุกหน้าแอดมิน แทนการลบทันทีเมื่อกดปุ่ม
 */
export default function AdminConfirmDialog({
  open,
  title,
  message,
  confirmText = 'ลบ',
  cancelText = 'ยกเลิก',
  loadingText = 'กำลังลบ...',
  loading = false,
  onConfirm,
  onCancel,
}: AdminConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
          >
            <div
              className="flex items-center justify-center rounded-full mb-4 mx-auto"
              style={{ width: 48, height: 48, background: '#FEF2F2' }}
            >
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <h3 className="text-center font-bold text-[#14213D] text-base mb-1.5">{title}</h3>
            <p className="text-center text-sm text-[#64748B] mb-6 leading-relaxed">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#64748B] border border-[#E2E8F0] hover:bg-[#F7F9FC] transition-colors disabled:opacity-60"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {loading ? loadingText : confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
