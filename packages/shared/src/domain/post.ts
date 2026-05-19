import type { Tag } from './tag'

export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string
  contentMd: string
  coverImage: string | null
  readingMinutes: number
  publishedAt: Date | null
  authorId: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type PostWithTags = Post & {
  tags: Tag[]
}

export type PostSummary = {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  readingMinutes: number
  publishedAt: Date
  tags: Tag[]
}

export type CreatePostInput = {
  slug: string
  title: string
  excerpt: string
  contentMd: string
  authorId: string
  coverImage?: string
}

export type UpdatePostInput = Partial<Omit<CreatePostInput, 'authorId'>>
