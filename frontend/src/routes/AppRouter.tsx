import { Routes, Route } from 'react-router-dom'
import HomePage           from '@/pages/Home/HomePage'
import ChatPage           from '@/pages/Chat/ChatPage'
import FAQPage            from '@/pages/FAQ/FAQPage'
import AnnouncementsPage  from '@/pages/Announcements/AnnouncementsPage'
import ContactPage        from '@/pages/Contact/ContactPage'
import LoginPage          from '@/pages/Login/LoginPage'
import RegisterPage       from '@/pages/Register/RegisterPage'
import ProfilePage        from '@/pages/Profile/ProfilePage'

// Information Pages (Figma matched)
import QualificationsPage from '@/pages/Info/QualificationsPage'
import DocumentsPage      from '@/pages/Info/DocumentsPage'
import LoanProcessPage    from '@/pages/Info/LoanProcessPage'
import SchedulePage       from '@/pages/Info/SchedulePage'

// Admin pages
import AdminLayout        from '@/pages/Admin/AdminLayout'
import AdminDashboard     from '@/pages/Admin/AdminDashboard'
import AdminDocuments     from '@/pages/Admin/AdminDocuments'
import AdminAnnouncements from '@/pages/Admin/AdminAnnouncements'
import AdminFAQ           from '@/pages/Admin/AdminFAQ'
import AdminUsers         from '@/pages/Admin/AdminUsers'

const NotFoundPage = () => <div className="flex items-center justify-center h-screen text-2xl font-semibold text-[#64748B]">404 — ไม่พบหน้านี้</div>

/**
 * AppRouter — กำหนด Routes ทั้งหมดของระบบ
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"                    element={<HomePage />} />
      <Route path="/chat"                element={<ChatPage />} />
      <Route path="/faq"                 element={<FAQPage />} />
      <Route path="/announcements"       element={<AnnouncementsPage />} />
      <Route path="/announcements/:id"   element={<AnnouncementsPage />} />
      <Route path="/contact"             element={<ContactPage />} />
      <Route path="/login"               element={<LoginPage />} />
      <Route path="/register"            element={<RegisterPage />} />

      {/* Information Pages */}
      <Route path="/qualifications"      element={<QualificationsPage />} />
      <Route path="/documents"           element={<DocumentsPage />} />
      <Route path="/loan-process"        element={<LoanProcessPage />} />
      <Route path="/schedule"            element={<SchedulePage />} />

      {/* Protected Routes */}
      <Route path="/profile"             element={<ProfilePage />} />

      {/* Admin Routes — nested under AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index                  element={<AdminDashboard />} />
        <Route path="documents"       element={<AdminDocuments />} />
        <Route path="announcements"   element={<AdminAnnouncements />} />
        <Route path="faq"             element={<AdminFAQ />} />
        <Route path="users"           element={<AdminUsers />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*"                    element={<NotFoundPage />} />
    </Routes>
  )
}
