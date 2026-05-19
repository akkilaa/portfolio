import type { IPostRepository } from '../../src/ports/post.repository'
import type {
  Post,
  PostWithTags,
  PostSummary,
  CreatePostInput,
  UpdatePostInput,
  Paginated,
  PaginationOpts,
  AdminListOpts,
} from '@portfolio/shared'

export class InMemoryPostRepository implements IPostRepository {
  private store = new Map<string, Post>()
  private nextId = 1

  seed(posts: Post[]): this {
    for (const post of posts) this.store.set(post.id, post)
    return this
  }

  async findPublished({
    limit = 20,
    cursor,
  }: PaginationOpts & { tag?: string }): Promise<Paginated<PostSummary>> {
    let items = [...this.store.values()].filter(
      (p) => p.publishedAt !== null && p.deletedAt === null,
    )
    if (cursor) {
      const idx = items.findIndex((p) => p.id === cursor)
      items = items.slice(idx + 1)
    }
    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items
    return {
      items: page.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        readingMinutes: p.readingMinutes,
        publishedAt: p.publishedAt as Date,
        tags: [],
      })),
      nextCursor: hasMore ? page[page.length - 1].id : null,
    }
  }

  async slugExists(slug: string): Promise<boolean> {
    return [...this.store.values()].some((p) => p.slug === slug)
  }

  async findBySlug(slug: string): Promise<PostWithTags | null> {
    const post = [...this.store.values()].find((p) => p.slug === slug && p.deletedAt === null)
    return post ? { ...post, tags: [] } : null
  }

  async findById(id: string): Promise<Post | null> {
    return this.store.get(id) ?? null
  }

  async findAll({
    limit = 20,
    cursor,
    includeDeleted = false,
  }: AdminListOpts): Promise<Paginated<Post>> {
    let items = [...this.store.values()].filter((p) => includeDeleted || p.deletedAt === null)
    if (cursor) {
      const idx = items.findIndex((p) => p.id === cursor)
      items = items.slice(idx + 1)
    }
    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items
    return { items: page, nextCursor: hasMore ? page[page.length - 1].id : null }
  }

  async create(data: CreatePostInput): Promise<Post> {
    const post: Post = {
      id: String(this.nextId++),
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      contentMd: data.contentMd,
      coverImage: data.coverImage ?? null,
      readingMinutes: 1,
      publishedAt: null,
      authorId: data.authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }
    this.store.set(post.id, post)
    return post
  }

  async update(id: string, data: UpdatePostInput): Promise<Post> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Post ${id} not found`)
    const updated: Post = { ...existing, ...data, updatedAt: new Date() }
    this.store.set(id, updated)
    return updated
  }

  async publish(id: string): Promise<Post> {
    return this.update(id, { publishedAt: new Date() } as UpdatePostInput)
  }

  async unpublish(id: string): Promise<Post> {
    return this.update(id, { publishedAt: null } as UpdatePostInput)
  }

  async delete(id: string): Promise<void> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Post ${id} not found`)
    this.store.set(id, { ...existing, deletedAt: new Date() })
  }
}
