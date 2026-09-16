import axios from 'axios'
import { API_BASE_URL, getAuthHeader } from '@/services/authService'
import { withCache, invalidateCache } from '@/utils/apiCache'

export interface Category {
  id: number
  name: string
  description?: string
  icon: string
  displayOrder: number
  isActive: boolean
  faqCount: number
  documentCount: number
  createdAt: string
  updatedAt: string
}

export interface CategoryPayload {
  name: string
  description?: string
  icon: string
  display_order: number
  is_active: boolean
}

function mapCategory(raw: any): Category {
  return {
    id: raw.id,
    name: raw.name,
    description: raw.description || undefined,
    icon: raw.icon,
    displayOrder: raw.display_order,
    isActive: raw.is_active,
    faqCount: raw.faq_count ?? 0,
    documentCount: raw.document_count ?? 0,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export async function fetchCategories(): Promise<Category[]> {
  return withCache('categories', async () => {
    const response = await axios.get(`${API_BASE_URL}/categories/`, {
      headers: getAuthHeader(),
    })
    return (response.data || []).map(mapCategory)
  })
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const response = await axios.post(`${API_BASE_URL}/categories/`, payload, {
    headers: getAuthHeader(),
  })
  invalidateCache('categories')
  return mapCategory(response.data)
}

export async function updateCategory(id: number, payload: Partial<CategoryPayload>): Promise<Category> {
  const response = await axios.put(`${API_BASE_URL}/categories/${id}`, payload, {
    headers: getAuthHeader(),
  })
  invalidateCache('categories')
  return mapCategory(response.data)
}

export async function deleteCategory(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/categories/${id}`, {
    headers: getAuthHeader(),
  })
  invalidateCache('categories')
}
