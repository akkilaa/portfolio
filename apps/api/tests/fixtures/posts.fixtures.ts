import type { CreatePostInput } from '@portfolio/shared'

export const publishedPostInput: CreatePostInput = {
  slug: 'published-post',
  title: 'Published Post',
  excerpt: 'This post is live',
  contentMd: '# Published',
  authorId: 'author-1',
}

export const draftPostInput: CreatePostInput = {
  slug: 'draft-post',
  title: 'Draft Post',
  excerpt: 'Not published yet',
  contentMd: '# Draft',
  authorId: 'author-1',
}

export const deletedPostInput: CreatePostInput = {
  slug: 'deleted-post',
  title: 'Deleted Post',
  excerpt: 'This was removed',
  contentMd: '# Deleted',
  authorId: 'author-1',
}
