import type { Tag } from './tag'

export type Project = {
  id: string
  slug: string
  title: string
  descriptionMd: string
  shortDescription: string
  tagline: string | null
  role: string | null
  startedAt: Date | null
  endedAt: Date | null
  liveUrl: string | null
  repoUrl: string | null
  featured: boolean
  published: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type ProjectImage = {
  id: string
  projectId: string
  url: string
  alt: string
  width: number
  height: number
  displayOrder: number
}

export type ProjectWithTagsAndImages = Project & {
  tags: Tag[]
  images: ProjectImage[]
}

export type CreateProjectInput = {
  slug: string
  title: string
  descriptionMd: string
  shortDescription: string
  tagline?: string
  role?: string
  startedAt?: Date
  endedAt?: Date
  liveUrl?: string
  repoUrl?: string
  featured?: boolean
  displayOrder?: number
  tagSlugs?: string[]
}

export type UpdateProjectInput = Partial<CreateProjectInput>
