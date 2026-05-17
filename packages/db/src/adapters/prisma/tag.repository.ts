import type { PrismaClient } from '@prisma'
import type { ITagRepository } from '@db/ports/repositories/tag.repository'
import type { Tag, CreateTagInput, UpdateTagInput } from '@portfolio/shared'

export class PrismaTagRepository implements ITagRepository {
  constructor(private readonly db: PrismaClient) {}

  findAll(): Promise<Tag[]> {
    return this.db.tag.findMany({ orderBy: { label: 'asc' } })
  }

  findBySlug(slug: string): Promise<Tag | null> {
    return this.db.tag.findUnique({ where: { slug } })
  }

  findBySlugs(slugs: string[]): Promise<Tag[]> {
    return this.db.tag.findMany({ where: { slug: { in: slugs } } })
  }

  create(data: CreateTagInput): Promise<Tag> {
    return this.db.tag.create({ data })
  }

  update(id: string, data: UpdateTagInput): Promise<Tag> {
    return this.db.tag.update({ where: { id }, data })
  }

  async delete(id: string): Promise<void> {
    await this.db.tag.delete({ where: { id } })
  }
}
