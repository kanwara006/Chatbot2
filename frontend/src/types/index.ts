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
  category: string
  academicYear: string
  attachmentUrl?: string
  isPublished: boolean
  publishedAt: string
  createdAt: string
}

// ── FAQ ───────────────────────────────────
export interface FAQ {
  id: number
  question: string
  answer: string
  category: string
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
  filename: string
  chunkContent: string
  documentId: number
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
  uploadedBy: number
  createdAt: string
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
