import type { RecommendationWithAuthor, RecommendationMeResponse } from '@portfolio/shared'

export type { RecommendationWithAuthor, RecommendationMeResponse }

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

type RecommendationListResponse = {
  items: RecommendationWithAuthor[]
}

export async function getRecommendations(): Promise<RecommendationWithAuthor[]> {
  const res = await fetch(`${API_URL}/recommendations`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  const data = (await res.json()) as RecommendationListResponse
  return data.items
}

export async function getRecommendationAuthor(): Promise<RecommendationMeResponse | null> {
  const res = await fetch(`${API_URL}/recommendations/me`, { credentials: 'include' })
  if (!res.ok) return null
  return res.json() as Promise<RecommendationMeResponse>
}

export async function submitRecommendation(comment: string, linkedinUrl?: string): Promise<void> {
  const res = await fetch(`${API_URL}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ comment, ...(linkedinUrl ? { linkedinUrl } : {}) }),
  })
  if (!res.ok) {
    if (res.status === 429) throw new Error('rate_limited')
    if (res.status === 409) throw new Error('already_submitted')
    if (res.status === 401) throw new Error('unauthorized')
    if (res.status === 400) throw new Error('validation')
    throw new Error('server')
  }
}
