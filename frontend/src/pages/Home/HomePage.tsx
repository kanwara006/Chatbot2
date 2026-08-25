import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/home/HeroSection'
import QuickMenu from '@/components/home/QuickMenu'
import NewsSection from '@/components/home/NewsSection'
import ContactCard from '@/components/home/ContactCard'

/**
 * HomePage — Clean & Balanced Layout for PSU SLF AI
 * Matched with Figma Reference
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA]">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* ① Hero Section */}
        <HeroSection />

        {/* ② Quick Menu — Overlaps hero with floating white card */}
        <QuickMenu />

        {/* ③ News Announcements & Contact Section */}
        <section
          className="section-sm"
          aria-label="ข่าวและประกาศ และติดต่อสอบถาม"
        >
          <div className="container-main">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* News: 8 cols on desktop (approx 2/3) */}
              <div className="lg:col-span-8 flex flex-col">
                <NewsSection />
              </div>

              {/* Contact: 4 cols on desktop (approx 1/3) */}
              <div className="lg:col-span-4 flex flex-col">
                <ContactCard />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
