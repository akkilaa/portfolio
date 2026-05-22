import type { ProjectDetailResponse, ProjectListResponse } from '@portfolio/shared'

export type { ProjectDetailResponse }

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

export async function getProjects(): Promise<ProjectDetailResponse[]> {
  const res = await fetch(`${API_URL}/projects?limit=100`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  const data = (await res.json()) as ProjectListResponse
  return data.items
}

export function getAllProjectTags(projects: ProjectDetailResponse[]): [string, number][] {
  const counts = new Map<string, number>()
  for (const p of projects) {
    for (const t of p.tags) {
      counts.set(t.label, (counts.get(t.label) ?? 0) + 1)
    }
  }
  return [
    ['all', projects.length] as [string, number],
    ...Array.from(counts.entries()).sort((a, b) => b[1] - a[1]),
  ]
}

export async function getProject(slug: string): Promise<ProjectDetailResponse | null> {
  const res = await fetch(`${API_URL}/projects/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json() as Promise<ProjectDetailResponse>
}

export async function getFeaturedProjects(): Promise<ProjectDetailResponse[]> {
  const res = await fetch(`${API_URL}/projects/featured`, { next: { revalidate: 60 } })
  if (!res.ok) return []
  return res.json() as Promise<ProjectDetailResponse[]>
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await getProjects()
  return projects.map((p) => p.slug)
}

export function formatProjectDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' })
}
