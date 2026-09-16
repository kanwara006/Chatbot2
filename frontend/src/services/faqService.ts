import axios from 'axios'
import type { FAQ } from '@/types'
import { API_BASE_URL, getAuthHeader } from '@/services/authService'
import { withCache, invalidateCache } from '@/utils/apiCache'

export interface FAQPayload {
  question: string
  answer: string
  category_id?: number
  keywords?: string
  order_num?: number
  is_active: boolean
}

function mapFAQ(raw: any): FAQ {
  return {
    id: raw.id,
    question: raw.question,
    answer: raw.answer,
    categoryId: raw.category_id ?? undefined,
    keywords: raw.keywords ?? undefined,
    isActive: raw.is_active,
    orderIndex: raw.order_num,
  }
}

export async function fetchFAQs(params?: { search?: string; category_id?: number }): Promise<FAQ[]> {
  return withCache(`faqs:${JSON.stringify(params || {})}`, async () => {
    const response = await axios.get(`${API_BASE_URL}/faq/`, {
      headers: getAuthHeader(),
      params,
    })
    return (response.data || []).map(mapFAQ)
  })
}

export async function fetchFAQById(id: number): Promise<FAQ> {
  const response = await axios.get(`${API_BASE_URL}/faq/${id}`, {
    headers: getAuthHeader(),
  })
  return mapFAQ(response.data)
}

export async function createFAQ(payload: FAQPayload): Promise<FAQ> {
  const response = await axios.post(`${API_BASE_URL}/faq/`, payload, {
    headers: getAuthHeader(),
  })
  invalidateCache('faqs')
  return mapFAQ(response.data)
}

export async function updateFAQ(id: number, payload: Partial<FAQPayload>): Promise<FAQ> {
  const response = await axios.put(`${API_BASE_URL}/faq/${id}`, payload, {
    headers: getAuthHeader(),
  })
  invalidateCache('faqs')
  return mapFAQ(response.data)
}

export async function deleteFAQ(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/faq/${id}`, {
    headers: getAuthHeader(),
  })
  invalidateCache('faqs')
}
