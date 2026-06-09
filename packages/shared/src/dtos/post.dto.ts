import type { Post, PostWithTags, PostSummary } from '../domain/post'
import type { Tag } from '../domain/tag'

export interface PostResponse extends Omit<
  Post,
  'deletedAt' | 'publishedAt' | 'createdAt' | 'updatedAt'
> {
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  tags: Tag[]
}

export interface PostDetailResponse extends Omit<
  PostWithTags,
  'deletedAt' | 'publishedAt' | 'createdAt' | 'updatedAt'
> {
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostListItemResponse extends Omit<PostSummary, 'publishedAt'> {
  publishedAt: string
}

export type PostListResponse = {
  items: PostListItemResponse[]
  nextCursor: string | null
}

export type AdminPostListResponse = {
  items: PostResponse[]
  nextCursor: string | null
}
