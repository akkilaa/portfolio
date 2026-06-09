import type {
  AdminProjectListResponse,
  ProjectResponse,
  AdminPostListResponse,
  PostResponse,
  AdminRecommendationListResponse,
  RecommendationResponse,
  RecommendationStatus,
} from '@portfolio/shared'
import { Api } from '@/lib/api'

const api = new Api(undefined, { credentials: 'include' })

async function expect<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function adminGetProjects(): Promise<ProjectResponse[]> {
  const res = await api.get('/projects/admin?limit=100')
  if (!res.ok) return []
  const data = (await res.json()) as AdminProjectListResponse
  return data.items
}

export async function adminUpdateProject(
  id: string,
  body: Record<string, unknown>,
): Promise<ProjectResponse> {
  return expect<ProjectResponse>(await api.patch(`/projects/${id}`, body))
}

export async function adminPublishProject(id: string): Promise<ProjectResponse> {
  return expect<ProjectResponse>(await api.patch(`/projects/${id}/publish`, {}))
}

export async function adminUnpublishProject(id: string): Promise<ProjectResponse> {
  return expect<ProjectResponse>(await api.patch(`/projects/${id}/unpublish`, {}))
}

export async function adminFeatureProject(id: string): Promise<ProjectResponse> {
  return expect<ProjectResponse>(await api.patch(`/projects/${id}/feature`, {}))
}

export async function adminUnfeatureProject(id: string): Promise<ProjectResponse> {
  return expect<ProjectResponse>(await api.patch(`/projects/${id}/unfeature`, {}))
}

export async function adminReorderProjects(
  orders: { id: string; displayOrder: number }[],
): Promise<void> {
  const res = await api.patch('/projects/reorder', { orders })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
}

export async function adminGetMe(): Promise<{ id: string; role: string }> {
  return expect<{ id: string; role: string }>(await api.get('/auth/me'))
}

export async function adminGetPosts(): Promise<PostResponse[]> {
  const res = await api.get('/posts/admin?limit=100')
  if (!res.ok) return []
  const data = (await res.json()) as AdminPostListResponse
  return data.items
}

export async function adminUpdatePost(
  id: string,
  body: Record<string, unknown>,
): Promise<PostResponse> {
  return expect<PostResponse>(await api.patch(`/posts/${id}`, body))
}

export async function adminCreatePost(body: Record<string, unknown>): Promise<PostResponse> {
  return expect<PostResponse>(await api.post('/posts', body))
}

export async function adminPublishPost(id: string): Promise<PostResponse> {
  return expect<PostResponse>(await api.patch(`/posts/${id}/publish`, {}))
}

export async function adminUnpublishPost(id: string): Promise<PostResponse> {
  return expect<PostResponse>(await api.patch(`/posts/${id}/unpublish`, {}))
}

export async function adminGetRecommendations(
  status?: RecommendationStatus,
): Promise<RecommendationResponse[]> {
  const url = status ? `/recommendations/admin?status=${status}` : '/recommendations/admin'
  const res = await api.get(url)
  if (!res.ok) return []
  const data = (await res.json()) as AdminRecommendationListResponse
  return data.items
}

export async function adminApproveRecommendation(id: string): Promise<void> {
  await expect<void>(await api.patch(`/recommendations/${id}/approve`, {}))
}

export async function adminRejectRecommendation(id: string): Promise<void> {
  await expect<void>(await api.patch(`/recommendations/${id}/reject`, {}))
}

export async function adminDeleteRecommendation(id: string): Promise<void> {
  const res = await api.del(`/recommendations/${id}`)
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? `Request failed: ${res.status}`)
  }
}

export async function adminLogin(email: string, password: string): Promise<void> {
  const res = await api.post('/auth/login', { email, password })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? 'Login failed')
  }
}

export async function adminVerify(token: string): Promise<void> {
  const res = await api.get(`/auth/verify?token=${encodeURIComponent(token)}`)
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(body.error ?? 'Invalid or expired login link')
  }
}

export async function adminLogout(): Promise<void> {
  await api.post('/auth/logout', {})
}
