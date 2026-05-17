import type { PrismaClient, Prisma } from '@prisma'
import type { IProjectRepository } from '@db/ports/repositories/project.repository'
import type {
  Project,
  ProjectWithTagsAndImages,
  CreateProjectInput,
  UpdateProjectInput,
  Paginated,
  PaginationOpts,
  AdminListOpts,
} from '@portfolio/shared'

const fullInclude = {
  projectTags: { include: { tag: true } },
  projectImages: { orderBy: { displayOrder: 'asc' as const } },
}

type ProjectRow = Prisma.ProjectGetPayload<{ include: typeof fullInclude }>

function mapProject(row: ProjectRow): ProjectWithTagsAndImages {
  const { projectTags, projectImages, ...project } = row
  return {
    ...project,
    tags: projectTags.map((pt) => pt.tag),
    images: projectImages,
  }
}

export class PrismaProjectRepository implements IProjectRepository {
  constructor(private readonly db: PrismaClient) {}

  async findBySlug(slug: string): Promise<ProjectWithTagsAndImages | null> {
    const row = await this.db.project.findFirst({
      where: { slug, deletedAt: null },
      include: fullInclude,
    })
    return row ? mapProject(row) : null
  }

  findById(id: string): Promise<Project | null> {
    return this.db.project.findFirst({ where: { id, deletedAt: null } })
  }

  async findPublished({
    limit = 20,
    cursor,
    tag,
  }: PaginationOpts & { tag?: string }): Promise<Paginated<ProjectWithTagsAndImages>> {
    const rows = await this.db.project.findMany({
      where: {
        published: true,
        deletedAt: null,
        ...(tag ? { projectTags: { some: { tag: { slug: tag } } } } : {}),
      },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: fullInclude,
    })

    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows
    return { items: items.map(mapProject), nextCursor: hasMore ? items[items.length - 1].id : null }
  }

  async findFeatured(): Promise<ProjectWithTagsAndImages[]> {
    const rows = await this.db.project.findMany({
      where: { featured: true, published: true, deletedAt: null },
      orderBy: { displayOrder: 'asc' },
      include: fullInclude,
    })
    return rows.map(mapProject)
  }

  async findAll({
    limit = 20,
    cursor,
    includeDeleted = false,
  }: AdminListOpts): Promise<Paginated<Project>> {
    const rows = await this.db.project.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    })

    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows
    return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
  }

  create(data: CreateProjectInput): Promise<Project> {
    const { tagSlugs, ...rest } = data
    return this.db.project.create({
      data: {
        ...rest,
        ...(tagSlugs?.length
          ? {
              projectTags: { create: tagSlugs.map((slug) => ({ tag: { connect: { slug } } })) },
            }
          : {}),
      },
    })
  }

  update(id: string, data: UpdateProjectInput): Promise<Project> {
    const { tagSlugs, ...rest } = data
    return this.db.project.update({
      where: { id },
      data: {
        ...rest,
        ...(tagSlugs
          ? {
              projectTags: {
                deleteMany: {},
                create: tagSlugs.map((slug) => ({ tag: { connect: { slug } } })),
              },
            }
          : {}),
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.project.update({ where: { id }, data: { deletedAt: new Date() } })
  }

  restore(id: string): Promise<Project> {
    return this.db.project.update({ where: { id }, data: { deletedAt: null } })
  }

  publish(id: string): Promise<Project> {
    return this.db.project.update({ where: { id }, data: { published: true } })
  }

  unpublish(id: string): Promise<Project> {
    return this.db.project.update({ where: { id }, data: { published: false } })
  }
}
