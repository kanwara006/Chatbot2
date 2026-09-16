import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopNavbar from '@/components/admin/AdminTopNavbar'

/**
 * AdminLayout — Layout wrapper สำหรับทุกหน้า Admin
 *
 * โครงสร้าง:
 *   ┌──────────────────────────────────────────────────┐
 *   │ AdminTopNavbar                                     │
 *   ├──────────┬──────────────────────────────────────┤
 *   │ Sidebar  │  <Outlet /> (admin sub-pages)          │
 *   │ 240px    │  flex-1 scrollable                     │
 *   └──────────┴──────────────────────────────────────┘
 */
export default function AdminLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#F7F9FC' }}>
      <AdminTopNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1360px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
