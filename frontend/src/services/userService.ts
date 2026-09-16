import axios from 'axios'
import { API_BASE_URL, getAuthHeader } from '@/services/authService'
import { withCache, invalidateCache } from '@/utils/apiCache'

export interface AdminUserView {
  id: number
  firstName: string
  lastName: string
  studentId: string
  email: string
  faculty: string
  department: string
  role: 'student' | 'admin'
  isActive: boolean
  createdAt: string
}

function mapUser(raw: any): AdminUserView {
  return {
    id: raw.id,
    firstName: raw.first_name,
    lastName: raw.last_name,
    studentId: raw.student_id || '-',
    email: raw.email,
    faculty: raw.faculty || '-',
    department: raw.department || '-',
    role: raw.role,
    isActive: raw.is_active,
    createdAt: raw.created_at,
  }
}

export async function fetchUsers(params?: { role?: string; search?: string }): Promise<AdminUserView[]> {
  return withCache(`users:${JSON.stringify(params || {})}`, async () => {
    const response = await axios.get(`${API_BASE_URL}/users/`, {
      headers: getAuthHeader(),
      params,
    })
    return (response.data || []).map(mapUser)
  })
}

export async function fetchUserById(id: number): Promise<AdminUserView> {
  const response = await axios.get(`${API_BASE_URL}/users/${id}`, {
    headers: getAuthHeader(),
  })
  return mapUser(response.data)
}

export async function updateUser(
  id: number,
  payload: Partial<{ role: string; is_active: boolean; first_name: string; last_name: string; faculty: string; department: string }>
): Promise<AdminUserView> {
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, payload, {
    headers: getAuthHeader(),
  })
  invalidateCache('users')
  return mapUser(response.data)
}
