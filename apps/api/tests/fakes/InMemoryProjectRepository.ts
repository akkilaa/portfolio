import type { IProjectRepository } from '../../src/ports/project.repository'
import type {
  Project,
  ProjectWithTagsAndImages,
  CreateProjectInput,
  UpdateProjectInput,
  Paginated,
  PaginationOpts,
  AdminListOpts,
} from '@portfolio/shared'

export class InMemoryProjectRepository implements IProjectRepository {
  private store = new Map<string, Project>()
  private nextId = 1

  seed(projects: Project[]): this {
    for (const project of projects) this.store.set(project.id, project)
    return this
  }

  async findBySlug(slug: string): Promise<ProjectWithTagsAndImages | null> {
    const project = [...this.store.values()].find((p) => p.slug === slug && p.deletedAt === null)
    return project ? { ...project, tags: [], images: [] } : null
  }

  async findById(id: string): Promise<Project | null> {
    return this.store.get(id) ?? null
  }

  async findPublished({
    limit = 20,
    cursor,
  }: PaginationOpts & { tag?: string }): Promise<Paginated<ProjectWithTagsAndImages>> {
    let items = [...this.store.values()].filter((p) => p.published && p.deletedAt === null)
    if (cursor) {
      const idx = items.findIndex((p) => p.id === cursor)
      items = items.slice(idx + 1)
    }
    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items
    return {
      items: page.map((p) => ({ ...p, tags: [], images: [] })),
      nextCursor: hasMore ? page[page.length - 1].id : null,
    }
  }

  async findFeatured(): Promise<ProjectWithTagsAndImages[]> {
    return [...this.store.values()]
      .filter((p) => p.featured && p.published && p.deletedAt === null)
      .map((p) => ({ ...p, tags: [], images: [] }))
  }

  async findAll({
    limit = 20,
    cursor,
    includeDeleted = false,
  }: AdminListOpts): Promise<Paginated<Project>> {
    let items = [...this.store.values()].filter((p) => includeDeleted || p.deletedAt === null)
    if (cursor) {
      const idx = items.findIndex((p) => p.id === cursor)
      items = items.slice(idx + 1)
    }
    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items
    return { items: page, nextCursor: hasMore ? page[page.length - 1].id : null }
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const project: Project = {
      id: String(this.nextId++),
      slug: data.slug,
      title: data.title,
      descriptionMd: data.descriptionMd,
      shortDescription: data.shortDescription,
      role: data.role ?? null,
      startedAt: data.startedAt ?? null,
      endedAt: data.endedAt ?? null,
      liveUrl: data.liveUrl ?? null,
      repoUrl: data.repoUrl ?? null,
      featured: data.featured ?? false,
      published: false,
      displayOrder: data.displayOrder ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }
    this.store.set(project.id, project)
    return project
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    const { tagSlugs: _, ...fields } = data
    const updated: Project = { ...existing, ...fields, updatedAt: new Date() }
    this.store.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<void> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    this.store.set(id, { ...existing, deletedAt: new Date() })
  }

  async restore(id: string): Promise<Project> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    const restored = { ...existing, deletedAt: null }
    this.store.set(id, restored)
    return restored
  }

  async publish(id: string): Promise<Project> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    const updated = { ...existing, published: true, updatedAt: new Date() }
    this.store.set(id, updated)
    return updated
  }

  async unpublish(id: string): Promise<Project> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    const updated = { ...existing, published: false, updatedAt: new Date() }
    this.store.set(id, updated)
    return updated
  }

  async feature(id: string): Promise<Project> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    const updated = { ...existing, featured: true, updatedAt: new Date() }
    this.store.set(id, updated)
    return updated
  }

  async unfeature(id: string): Promise<Project> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    const updated = { ...existing, featured: false, updatedAt: new Date() }
    this.store.set(id, updated)
    return updated
  }

  async reorder(orders: { id: string; displayOrder: number }[]): Promise<void> {
    for (const { id, displayOrder } of orders) {
      const existing = this.store.get(id)
      if (existing) this.store.set(id, { ...existing, displayOrder, updatedAt: new Date() })
    }
  }
}
