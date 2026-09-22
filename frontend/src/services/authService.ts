import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'

const AUTH_STORAGE_KEY = 'psu_slf_auth'

export interface RegisterPayload {
  first_name: string
  last_name: string
  student_id?: string
  email: string
  faculty?: string
  department?: string
  password: string
}

export interface AdminRegisterPayload {
  first_name: string
  last_name: string
  email: string
  password: string
  staff_code: string
}

export interface AuthUser {
  userId: number
  role: string
  firstName: string
  lastName: string
  email: string
  studentId?: string
  accessToken: string
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  await axios.post(`${API_BASE_URL}/auth/register`, payload)
}

export async function registerAdmin(payload: AdminRegisterPayload): Promise<void> {
  await axios.post(`${API_BASE_URL}/auth/register-admin`, payload)
}

export async function loginUser(usernameOrEmail: string, password: string): Promise<AuthUser> {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    username_or_email: usernameOrEmail,
    password,
  })

  const data = response.data
  const authUser: AuthUser = {
    userId: data.user_id,
    role: data.role,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    studentId: data.student_id,
    accessToken: data.access_token,
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))
  return authUser
}

export function getStoredAuth(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getAuthHeader(): Record<string, string> {
  const auth = getStoredAuth()
  return auth ? { Authorization: `Bearer ${auth.accessToken}` } : {}
}

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
  }
  return fallback
}
