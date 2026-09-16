import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

/**
 * RequireAuth — Route guard: อนุญาตเฉพาะผู้ใช้ที่เข้าสู่ระบบแล้ว (นักศึกษาหรือแอดมิน)
 * ถ้ายังไม่ได้เข้าสู่ระบบ จะเด้งไปหน้า /login
 */
export default function RequireAuth() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
