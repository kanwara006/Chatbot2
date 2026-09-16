import axios from 'axios'
import type { Document, DocumentStatus } from '@/types'
import { API_BASE_URL, getAuthHeader } from '@/services/authService'
import { withCache, invalidateCache } from '@/utils/apiCache'

function mapDocument(raw: any): Document {
  return {
    id: raw.id,
    filename: raw.filename,
    originalName: raw.original_name,
    fileType: raw.file_type,
    fileSize: raw.file_size,
    status: raw.status as DocumentStatus,
    categoryId: raw.category_id ?? undefined,
    description: raw.description ?? undefined,
    isActive: raw.is_active,
    displayOrder: raw.display_order,
    uploadedBy: raw.uploaded_by,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

export async function fetchDocuments(): Promise<Document[]> {
  return withCache('documents', async () => {
    const response = await axios.get(`${API_BASE_URL}/documents/`, {
      headers: getAuthHeader(),
    })
    return (response.data || []).map(mapDocument)
  })
}

export async function uploadDocument(
  file: File,
  meta?: { name?: string; categoryId?: number; description?: string }
): Promise<Document> {
  const formData = new FormData()
  formData.append('file', file)
  if (meta?.name) formData.append('name', meta.name)
  if (meta?.categoryId !== undefined) formData.append('category_id', String(meta.categoryId))
  if (meta?.description) formData.append('description', meta.description)
  const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
    headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
  })
  invalidateCache('documents')
  return mapDocument(response.data)
}

export async function deleteDocument(id: number): Promise<void> {
  await axios.delete(`${API_BASE_URL}/documents/${id}`, {
    headers: getAuthHeader(),
  })
  invalidateCache('documents')
}

export async function fetchDocumentById(id: number): Promise<Document> {
  const response = await axios.get(`${API_BASE_URL}/documents/${id}`, {
    headers: getAuthHeader(),
  })
  return mapDocument(response.data)
}

export async function updateDocument(
  id: number,
  payload: { originalName?: string; categoryId?: number; description?: string; isActive?: boolean }
): Promise<Document> {
  const response = await axios.put(`${API_BASE_URL}/documents/${id}`, {
    original_name: payload.originalName,
    category_id: payload.categoryId,
    description: payload.description,
    is_active: payload.isActive,
  }, {
    headers: getAuthHeader(),
  })
  invalidateCache('documents')
  return mapDocument(response.data)
}
