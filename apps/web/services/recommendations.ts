import type { RecommendationWithAuthor, RecommendationMeResponse } from '@portfolio/shared'
import { Api } from '@/lib/api'

export type { RecommendationWithAuthor, RecommendationMeResponse }

type RecommendationListResponse = {
  items: RecommendationWithAuthor[]
}

const api = new Api()

export async function getRecommendations(): Promise<RecommendationWithAuthor[]> {
  const res = await api.get('/recommendations', { next: { revalidate: 60 } })
  if (!res.ok) return []
  const data = (await res.json()) as RecommendationListResponse
  return data.items
}

export async function getRecommendationAuthor(): Promise<RecommendationMeResponse | null> {
  const res = await api.get('/recommendations/me', { credentials: 'include' })
  if (!res.ok) return null
  return res.json() as Promise<RecommendationMeResponse>
}

export async function submitRecommendation(comment: string, linkedinUrl?: string): Promise<void> {
  const res = await api.post(
    '/recommendations',
    { comment, ...(linkedinUrl ? { linkedinUrl } : {}) },
    { credentials: 'include' },
  )
  if (!res.ok) {
    if (res.status === 429) throw new Error('rate_limited')
    if (res.status === 409) throw new Error('already_submitted')
    if (res.status === 401) throw new Error('unauthorized')
    if (res.status === 400) throw new Error('validation')
    throw new Error('server')
  }
}
