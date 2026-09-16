// ─────────────────────────────────────────
// Shared TypeScript Types — PSU SLF Chatbot
// ─────────────────────────────────────────

// ── User ──────────────────────────────────
export interface User {
  id: number
  studentId: string
  firstName: string
  lastName: string
  email: string
  faculty: string
  department: string
  role: 'student' | 'admin'
  createdAt: string
}

// ── Auth ──────────────────────────────────
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// ── Announcement ─────────────────────────
export interface Announcement {
  id: number
  title: string
  content: string
  categoryId?: number
  academicYear: string
  attachmentUrl?: string
  isPublished: boolean
  eventDate?: string
  publishedAt: string
  createdAt: string
}

// ── FAQ ───────────────────────────────────
export interface FAQ {
  id: number
  question: string
  answer: string
  categoryId?: number
  keywords?: string
  isActive: boolean
  orderIndex: number
}

// ── Chat ──────────────────────────────────
export interface Conversation {
  id: number
  userId: number
  title: string
  createdAt: string
  updatedAt: string
}

export interface MessageSource {
  id?: number
  documentId?: number
  filename: string
  page?: string | number
  pageNumber?: string | number
  similarity?: number
}

export interface Message {
  id: number
  conversationId: number
  role: 'user' | 'assistant'
  content: string
  sources?: MessageSource[]
  createdAt: string
}

export interface ChatRequest {
  conversationId?: number
  question: string
}

export interface ChatResponse {
  conversationId: number
  message: Message
}

// ── Document ─────────────────────────────
export type DocumentStatus = 'pending' | 'processing' | 'ready' | 'error'

export interface Document {
  id: number
  filename: string
  originalName: string
  fileType: 'pdf' | 'docx' | 'txt'
  fileSize: number
  status: DocumentStatus
  categoryId?: number
  description?: string
  isActive: boolean
  displayOrder: number
  uploadedBy: number
  createdAt: string
  updatedAt: string
}

// ── API Response ──────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
