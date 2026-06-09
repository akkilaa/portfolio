import type { PrismaClient } from '../../../prisma/src/generated/prisma'
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
import { ConflictError, ForeignKeyError, BadRequestError, ValidationError } from '@portfolio/shared'
import { isPrismaError, isPrismaValidationError } from '../../utils'

const tagInclude = { postTags: { include: { tag: true } } }

function tagConnectOrCreate(slug: string) {
  const label = slug.replace(/-/g, ' ')
  return { where: { slug }, create: { slug, label } }
}

function mapTags(
  postTags: { tag: { id: string; slug: string; label: string; color: string | null } }[],
) {
  return postTags.map((pt) => pt.tag)
}

export class PrismaPostRepository {
  constructor(private readonly db: PrismaClient) {}

  async slugExists(slug: string): Promise<boolean> {
    const count = await this.db.post.count({ where: { slug } })
    return count > 0
  }

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
  }: AdminListOpts): Promise<Paginated<PostWithTags>> {
    const rows = await this.db.post.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: tagInclude,
    })

    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows
    return {
      items: items.map(({ postTags, ...p }) => ({ ...p, tags: mapTags(postTags) })),
      nextCursor: hasMore ? items[items.length - 1].id : null,
    }
  }

  async create(data: CreatePostInput): Promise<PostWithTags> {
    const { tagSlugs, ...rest } = data
    try {
      const row = await this.db.post.create({
        data: {
          ...rest,
          ...(tagSlugs?.length
            ? {
                postTags: {
                  create: tagSlugs.map((slug) => ({
                    tag: { connectOrCreate: tagConnectOrCreate(slug) },
                  })),
                },
              }
            : {}),
        },
        include: tagInclude,
      })
      const { postTags, ...post } = row
      return { ...post, tags: mapTags(postTags) }
    } catch (e) {
      if (isPrismaValidationError(e)) throw new ValidationError('Invalid data provided')
      if (isPrismaError(e, 'P2003'))
        throw new ForeignKeyError(`Author "${data.authorId}" does not exist`)
      if (isPrismaError(e, 'P2002')) throw new ConflictError(`Slug "${data.slug}" is already taken`)
      if (isPrismaError(e, 'P2007'))
        throw new BadRequestError('Invalid value format for field in post')
      throw e
    }
  }

  async update(id: string, data: UpdatePostInput): Promise<PostWithTags> {
    const { tagSlugs, ...rest } = data
    const row = await this.db.post.update({
      where: { id },
      data: {
        ...rest,
        ...(tagSlugs
          ? {
              postTags: {
                deleteMany: {},
                create: tagSlugs.map((slug) => ({
                  tag: { connectOrCreate: tagConnectOrCreate(slug) },
                })),
              },
            }
          : {}),
      },
      include: tagInclude,
    })
    const { postTags, ...post } = row
    return { ...post, tags: mapTags(postTags) }
  }

  async delete(id: string): Promise<void> {
    await this.db.post.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  async publish(id: string): Promise<PostWithTags> {
    const row = await this.db.post.update({
      where: { id },
      data: { publishedAt: new Date() },
      include: tagInclude,
    })
    const { postTags, ...post } = row
    return { ...post, tags: mapTags(postTags) }
  }

  async unpublish(id: string): Promise<PostWithTags> {
    const row = await this.db.post.update({
      where: { id },
      data: { publishedAt: null },
      include: tagInclude,
    })
    const { postTags, ...post } = row
    return { ...post, tags: mapTags(postTags) }
  }
}
