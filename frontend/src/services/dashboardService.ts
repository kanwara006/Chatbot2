import axios from 'axios'
import { API_BASE_URL, getAuthHeader } from '@/services/authService'
import { withCache } from '@/utils/apiCache'

const DASHBOARD_TTL = 20_000

export interface DashboardStats {
  users: number
  conversations: number
  messages: number
  answered: number
  documents: number
  totalDocuments: number
  announcements: number
  faqs: number
  positiveRate: number
}

export interface UsageTrendPoint {
  date: string
  total: number
  success: number
}

export interface CategoryBreakdown {
  categoryId: number
  categoryName: string
  count: number
  percentage: number
}

export interface RecentQuestion {
  id: number
  content: string
  createdAt: string
}

export interface RecentDocument {
  id: number
  originalName: string
  status: string
  updatedAt: string
}

export interface ReportsData {
  totalQuestions: number
  successRate: number
  avgSatisfaction: number
  usageTrend: { weekday: string; date: string; count: number }[]
  topCategories: { categoryId: number; name: string; count: number; satisfaction: number }[]
}

export interface EvaluationsData {
  totalEvaluations: number
  avgSatisfaction: number
  suggestionCount: number
  dailyTrend: { date: string; weekday: string; satisfactionRate: number }[]
  recentEvaluations: {
    id: number
    question: string
    rating: 'like' | 'dislike'
    comment: string | null
    createdAt: string
  }[]
}

function authGet<T = any>(path: string, params?: Record<string, unknown>) {
  return axios.get<T>(`${API_BASE_URL}${path}`, { headers: getAuthHeader(), params })
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return withCache('dashboard:stats', async () => {
    const { data } = await authGet('/dashboard/stats')
    return {
      users: data.users,
      conversations: data.conversations,
      messages: data.messages,
      answered: data.answered,
      documents: data.documents,
      totalDocuments: data.total_documents,
      announcements: data.announcements,
      faqs: data.faqs,
      positiveRate: data.positive_rate,
    }
  }, DASHBOARD_TTL)
}

export async function fetchUsageTrend(days = 7): Promise<UsageTrendPoint[]> {
  return withCache(`dashboard:usage-trend:${days}`, async () => {
    const { data } = await authGet('/dashboard/usage-trend', { days })
    return data
  }, DASHBOARD_TTL)
}

export async function fetchCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  return withCache('dashboard:category-breakdown', async () => {
    const { data } = await authGet('/dashboard/category-breakdown')
    return data.map((d: any) => ({
      categoryId: d.category_id,
      categoryName: d.category_name,
      count: d.count,
      percentage: d.percentage,
    }))
  }, DASHBOARD_TTL)
}

export async function fetchRecentQuestions(limit = 5): Promise<RecentQuestion[]> {
  return withCache(`dashboard:recent-questions:${limit}`, async () => {
    const { data } = await authGet('/dashboard/recent-questions', { limit })
    return data.map((d: any) => ({ id: d.id, content: d.content, createdAt: d.created_at }))
  }, DASHBOARD_TTL)
}

export async function fetchRecentDocuments(limit = 5): Promise<RecentDocument[]> {
  return withCache(`dashboard:recent-documents:${limit}`, async () => {
    const { data } = await authGet('/dashboard/recent-documents', { limit })
    return data.map((d: any) => ({
      id: d.id,
      originalName: d.original_name,
      status: d.status,
      updatedAt: d.updated_at,
    }))
  }, DASHBOARD_TTL)
}

export async function fetchReports(): Promise<ReportsData> {
  return withCache('dashboard:reports', async () => {
    const { data } = await authGet('/dashboard/reports')
    return {
      totalQuestions: data.total_questions,
      successRate: data.success_rate,
      avgSatisfaction: data.avg_satisfaction,
      usageTrend: data.usage_trend,
      topCategories: (data.top_categories || []).map((c: any) => ({
        categoryId: c.category_id,
        name: c.name,
        count: c.count,
        satisfaction: c.satisfaction,
      })),
    }
  }, DASHBOARD_TTL)
}

export async function fetchEvaluations(): Promise<EvaluationsData> {
  return withCache('dashboard:evaluations', async () => {
    const { data } = await authGet('/dashboard/evaluations')
    return {
      totalEvaluations: data.total_evaluations,
      avgSatisfaction: data.avg_satisfaction,
      suggestionCount: data.suggestion_count,
      dailyTrend: (data.daily_trend || []).map((d: any) => ({
        date: d.date,
        weekday: d.weekday,
        satisfactionRate: d.satisfaction_rate,
      })),
      recentEvaluations: (data.recent_evaluations || []).map((e: any) => ({
        id: e.id,
        question: e.question,
        rating: e.rating,
        comment: e.comment,
        createdAt: e.created_at,
      })),
    }
  }, DASHBOARD_TTL)
}
