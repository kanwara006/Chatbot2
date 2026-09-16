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
import AdminLayout            from '@/pages/Admin/AdminLayout'
import AdminLoginPage         from '@/pages/Admin/AdminLoginPage'
import AdminRegisterPage      from '@/pages/Admin/AdminRegisterPage'
import AdminDashboard         from '@/pages/Admin/AdminDashboard'
import AdminDocuments         from '@/pages/Admin/AdminDocuments'
import AdminDocumentForm      from '@/pages/Admin/AdminDocumentForm'
import AdminAnnouncements     from '@/pages/Admin/AdminAnnouncements'
import AdminAnnouncementForm  from '@/pages/Admin/AdminAnnouncementForm'
import AdminFAQ               from '@/pages/Admin/AdminFAQ'
import AdminFAQForm           from '@/pages/Admin/AdminFAQForm'
import AdminCategories        from '@/pages/Admin/AdminCategories'
import AdminCategoryForm      from '@/pages/Admin/AdminCategoryForm'
import AdminUsers             from '@/pages/Admin/AdminUsers'
import AdminReports           from '@/pages/Admin/AdminReports'
import AdminEvaluation        from '@/pages/Admin/AdminEvaluation'
import AdminContactMessages   from '@/pages/Admin/AdminContactMessages'
import RequireAdmin           from '@/components/admin/RequireAdmin'
import RequireAuth            from '@/components/RequireAuth'

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
      <Route path="/contact"             element={<ContactPage />} />
      <Route path="/login"               element={<LoginPage />} />
      <Route path="/register"            element={<RegisterPage />} />

      {/* Information Pages */}
      <Route path="/qualifications"      element={<QualificationsPage />} />
      <Route path="/documents"           element={<DocumentsPage />} />
      <Route path="/loan-process"        element={<LoanProcessPage />} />
      <Route path="/schedule"            element={<SchedulePage />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/profile"           element={<ProfilePage />} />
      </Route>

      {/* Admin Auth Routes — public */}
      <Route path="/admin/login"         element={<AdminLoginPage />} />
      <Route path="/admin/register"      element={<AdminRegisterPage />} />

      {/* Admin Routes — nested under AdminLayout, protected by RequireAdmin */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index                          element={<AdminDashboard />} />
          <Route path="categories"              element={<AdminCategories />} />
          <Route path="categories/new"          element={<AdminCategoryForm />} />
          <Route path="categories/:id/edit"     element={<AdminCategoryForm />} />
          <Route path="documents"               element={<AdminDocuments />} />
          <Route path="documents/new"           element={<AdminDocumentForm />} />
          <Route path="documents/:id/edit"      element={<AdminDocumentForm />} />
          <Route path="announcements"           element={<AdminAnnouncements />} />
          <Route path="announcements/new"       element={<AdminAnnouncementForm />} />
          <Route path="announcements/:id/edit"  element={<AdminAnnouncementForm />} />
          <Route path="faq"                     element={<AdminFAQ />} />
          <Route path="faq/new"                 element={<AdminFAQForm />} />
          <Route path="faq/:id/edit"            element={<AdminFAQForm />} />
          <Route path="users"                   element={<AdminUsers />} />
          <Route path="contact"                 element={<AdminContactMessages />} />
          <Route path="reports"                 element={<AdminReports />} />
          <Route path="evaluation"              element={<AdminEvaluation />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*"                    element={<NotFoundPage />} />
    </Routes>
  )
}
