import axios from 'axios'
import { API_BASE_URL, getAuthHeader } from '@/services/authService'
import { withCache, invalidateCache } from '@/utils/apiCache'

export interface ContactPayload {
  full_name: string
  student_id?: string
  email: string
  subject?: string
  message: string
}

export interface ContactMessage {
  id: number
  fullName: string
  studentId?: string
  email: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: string
}

function mapContactMessage(raw: any): ContactMessage {
  return {
    id: raw.id,
    fullName: raw.full_name,
    studentId: raw.student_id || undefined,
    email: raw.email,
    subject: raw.subject || undefined,
    message: raw.message,
    isRead: raw.is_read,
    createdAt: raw.created_at,
  }
}

export async function submitContactMessage(payload: ContactPayload): Promise<void> {
  await axios.post(`${API_BASE_URL}/contact/`, payload)
}

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  return withCache('contact-messages', async () => {
    const response = await axios.get(`${API_BASE_URL}/contact/`, {
      headers: getAuthHeader(),
    })
    return (response.data || []).map(mapContactMessage)
  })
}

export async function markContactMessageRead(id: number): Promise<ContactMessage> {
  const response = await axios.put(`${API_BASE_URL}/contact/${id}/read`, {}, {
    headers: getAuthHeader(),
  })
  invalidateCache('contact-messages')
  window.dispatchEvent(new Event('contact-messages-updated'))
  return mapContactMessage(response.data)
}

export async function deleteContactMessage(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/contact/${id}`, {
    headers: getAuthHeader(),
  })
  invalidateCache('contact-messages')
  window.dispatchEvent(new Event('contact-messages-updated'))
}
