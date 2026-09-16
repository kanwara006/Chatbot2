import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * RequireAdmin — Route guard: อนุญาตเฉพาะผู้ใช้ที่เข้าสู่ระบบและมี role เป็น admin
 * ถ้าไม่ผ่านเงื่อนไข จะเด้งไปหน้า /admin/login
 */
export default function RequireAdmin() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
