import type { PrismaClient } from '@prisma'
import type { IPostRepository } from '@db/ports/repositories/post.repository'
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

const tagInclude = { postTags: { include: { tag: true } } }

function mapTags(
  postTags: { tag: { id: string; slug: string; label: string; color: string | null } }[],
) {
  return postTags.map((pt) => pt.tag)
}

export class PrismaPostRepository implements IPostRepository {
  constructor(private readonly db: PrismaClient) {}

  async findBySlug(slug: string): Promise<PostWithTags | null> {
    const row = await this.db.post.findFirst({
      where: { slug, deletedAt: null },
      include: tagInclude,
    })
    if (!row) return null
    const { postTags, ...post } = row
    return { ...post, tags: mapTags(postTags) }
  }

  findById(id: string): Promise<Post | null> {
    return this.db.post.findFirst({ where: { id, deletedAt: null } })
  }

  async findPublished({
    limit = 20,
    cursor,
    tag,
  }: PaginationOpts & { tag?: string }): Promise<Paginated<PostSummary>> {
    const rows = await this.db.post.findMany({
      where: {
        publishedAt: { not: null },
        deletedAt: null,
        ...(tag ? { postTags: { some: { tag: { slug: tag } } } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: tagInclude,
    })

    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows

    return {
      items: items.map(({ postTags, ...p }) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        readingMinutes: p.readingMinutes,
        publishedAt: p.publishedAt!,
        tags: mapTags(postTags),
      })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    }
  }

  async findAll({
    limit = 20,
    cursor,
    includeDeleted = false,
  }: AdminListOpts): Promise<Paginated<Post>> {
    const rows = await this.db.post.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    })

    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows
    return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
  }

  create(data: CreatePostInput): Promise<Post> {
    const { tagSlugs, ...rest } = data
    return this.db.post.create({
      data: {
        ...rest,
        ...(tagSlugs?.length
          ? {
              postTags: { create: tagSlugs.map((slug) => ({ tag: { connect: { slug } } })) },
            }
          : {}),
      },
    })
  }

  update(id: string, data: UpdatePostInput): Promise<Post> {
    const { tagSlugs, ...rest } = data
    return this.db.post.update({
      where: { id },
      data: {
        ...rest,
        ...(tagSlugs
          ? {
              postTags: {
                deleteMany: {},
                create: tagSlugs.map((slug) => ({ tag: { connect: { slug } } })),
              },
            }
          : {}),
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.post.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  publish(id: string): Promise<Post> {
    return this.db.post.update({ where: { id }, data: { publishedAt: new Date() } })
  }

  unpublish(id: string): Promise<Post> {
    return this.db.post.update({ where: { id }, data: { publishedAt: null } })
  }
}
