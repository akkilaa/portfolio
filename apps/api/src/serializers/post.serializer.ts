import type { PostWithTags, Paginated, PostSummary } from '@portfolio/shared'
import type {
  PostResponse,
  PostDetailResponse,
  PostListItemResponse,
  PostListResponse,
  AdminPostListResponse,
} from '@portfolio/shared'

export function serializePost(post: PostWithTags): PostResponse {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    contentMd: post.contentMd,
    coverImage: post.coverImage,
    readingMinutes: post.readingMinutes,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    authorId: post.authorId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    tags: post.tags,
  }
}

export function serializePostDetail(post: PostWithTags): PostDetailResponse {
  return serializePost(post)
}

export function serializeAdminPostList(paginated: Paginated<PostWithTags>): AdminPostListResponse {
  return {
    items: paginated.items.map(serializePost),
    nextCursor: paginated.nextCursor,
  }
}

export function serializePostList(paginated: Paginated<PostSummary>): PostListResponse {
  return {
    items: paginated.items.map(
      (item): PostListItemResponse => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        coverImage: item.coverImage,
        readingMinutes: item.readingMinutes,
        publishedAt: item.publishedAt.toISOString(),
        tags: item.tags,
      }),
    ),
    nextCursor: paginated.nextCursor,
  }
}
