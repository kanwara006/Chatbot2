import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

interface PageLayoutProps {
  children: React.ReactNode
  /** ถ้า true จะไม่แสดง Footer (สำหรับหน้า Login/Register) */
  noFooter?: boolean
  /** ถ้า true จะไม่แสดง Navbar */
  noNavbar?: boolean
}

/**
 * PageLayout — Layout หลักสำหรับหน้าสาธารณะ
 * รวม Navbar + Content + Footer ไว้ในที่เดียว
 */
export default function PageLayout({ children, noFooter, noNavbar }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F9FC' }}>
      {!noNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  )
}
