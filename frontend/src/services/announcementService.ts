import axios from 'axios'
import type { Announcement } from '@/types'
import { API_BASE_URL, getAuthHeader } from '@/services/authService'
import { withCache, invalidateCache } from '@/utils/apiCache'

export interface AnnouncementPayload {
  title: string
  content: string
  category_id?: number
  academic_year: string
  attachment_url?: string
  is_published: boolean
  event_date?: string
}

function mapAnnouncement(raw: any): Announcement {
  return {
    id: raw.id,
    title: raw.title,
    content: raw.content,
    categoryId: raw.category_id ?? undefined,
    academicYear: raw.academic_year,
    attachmentUrl: raw.attachment_url || undefined,
    isPublished: raw.is_published,
    eventDate: raw.event_date || undefined,
    publishedAt: raw.published_at,
    createdAt: raw.created_at,
  }
}

export async function fetchAnnouncements(params?: { search?: string; category_id?: number }): Promise<Announcement[]> {
  return withCache(`announcements:${JSON.stringify(params || {})}`, async () => {
    const response = await axios.get(`${API_BASE_URL}/announcements/`, {
      headers: getAuthHeader(),
      params,
    })
    return (response.data || []).map(mapAnnouncement)
  })
}

export async function fetchAnnouncementById(id: number): Promise<Announcement> {
  const response = await axios.get(`${API_BASE_URL}/announcements/${id}`, {
    headers: getAuthHeader(),
  })
  return mapAnnouncement(response.data)
}

export async function createAnnouncement(payload: AnnouncementPayload): Promise<Announcement> {
  const response = await axios.post(`${API_BASE_URL}/announcements/`, payload, {
    headers: getAuthHeader(),
  })
  invalidateCache('announcements')
  return mapAnnouncement(response.data)
}

export async function updateAnnouncement(
  id: number,
  payload: Partial<AnnouncementPayload>
): Promise<Announcement> {
  const response = await axios.put(`${API_BASE_URL}/announcements/${id}`, payload, {
    headers: getAuthHeader(),
  })
  invalidateCache('announcements')
  return mapAnnouncement(response.data)
}

export async function deleteAnnouncement(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/announcements/${id}`, {
    headers: getAuthHeader(),
  })
  invalidateCache('announcements')
}

export async function uploadAnnouncementImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axios.post(`${API_BASE_URL}/announcements/upload-image`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })
  return response.data.url as string
}

const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/v1$/, '')

/** แปลง path รูปภาพที่ backend คืนมา (เช่น /uploads/xxx.png) ให้เป็น URL เต็มที่เบราว์เซอร์โหลดได้ */
export function resolveAnnouncementImageUrl(attachmentUrl?: string): string | undefined {
  if (!attachmentUrl) return undefined
  return attachmentUrl.startsWith('http') ? attachmentUrl : `${BACKEND_ORIGIN}${attachmentUrl}`
}
