import type { PostDetailResponse, PostListItemResponse, PostListResponse } from '@portfolio/shared'

export type { PostDetailResponse, PostListItemResponse }

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

export async function getPosts(): Promise<PostListItemResponse[]> {
  const res = await fetch(`${API_URL}/posts`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  const data = (await res.json()) as PostListResponse
  return data.items
}

export async function getPost(slug: string): Promise<PostDetailResponse | null> {
  const res = await fetch(`${API_URL}/posts/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json() as Promise<PostDetailResponse>
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getPosts()
  return posts.map((p) => p.slug)
}

export function getAllTags(posts: PostListItemResponse[]): [string, number][] {
  const counts = new Map<string, number>()
  for (const p of posts) {
    for (const t of p.tags) {
      counts.set(t.label, (counts.get(t.label) ?? 0) + 1)
    }
  }
  return [
    ['all', posts.length] as [string, number],
    ...Array.from(counts.entries()).sort((a, b) => b[1] - a[1]),
  ]
}

export function formatDate(iso: string): { day: string; month: string; year: number } {
  const d = new Date(iso)
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()
  return { day: String(d.getDate()).padStart(2, '0'), month, year: d.getFullYear() }
}
