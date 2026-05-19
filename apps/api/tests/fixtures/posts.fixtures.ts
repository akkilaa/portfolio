import type { Post } from '@portfolio/shared'

export const publishedPost: Post = {
  id: '1',
  slug: 'published-post',
  title: 'Published Post',
  excerpt: 'This post is live',
  contentMd: '# Published',
  coverImage: null,
  readingMinutes: 3,
  publishedAt: new Date('2026-03-01'),
  authorId: 'author-1',
  createdAt: new Date('2026-03-01'),
  updatedAt: new Date('2026-03-01'),
  deletedAt: null,
}

export const draftPost: Post = {
  id: '2',
  slug: 'draft-post',
  title: 'Draft Post',
  excerpt: 'Not published yet',
  contentMd: '# Draft',
  coverImage: null,
  readingMinutes: 2,
  publishedAt: null,
  authorId: 'author-1',
  createdAt: new Date('2026-03-02'),
  updatedAt: new Date('2026-03-02'),
  deletedAt: null,
}

export const deletedPost: Post = {
  id: '3',
  slug: 'deleted-post',
  title: 'Deleted Post',
  excerpt: 'This was removed',
  contentMd: '# Deleted',
  coverImage: null,
  readingMinutes: 1,
  publishedAt: new Date('2026-02-01'),
  authorId: 'author-1',
  createdAt: new Date('2026-02-01'),
  updatedAt: new Date('2026-02-15'),
  deletedAt: new Date('2026-02-15'),
}
