import { Outlet } from 'react-router-dom'
import AdminSidebar from '@/components/admin/AdminSidebar'

/**
 * AdminLayout — Layout wrapper สำหรับทุกหน้า Admin
 *
 * โครงสร้าง:
 *   ┌──────────┬──────────────────────────────────┐
 *   │ Sidebar  │  <Outlet /> (admin sub-pages)    │
 *   │ 240px    │  flex-1 scrollable               │
 *   └──────────┴──────────────────────────────────┘
 */
export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F7F9FC' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
