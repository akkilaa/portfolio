import type { PrismaClient } from '@prisma'
import type { IContactRepository } from '@db/ports/repositories/contact.repository'
import type { ContactSubmission, CreateContactInput, Paginated, PaginationOpts } from '@portfolio/shared'

export class PrismaContactRepository implements IContactRepository {
  constructor(private readonly db: PrismaClient) {}

  create(data: CreateContactInput): Promise<ContactSubmission> {
    return this.db.contactSubmission.create({ data })
  }

  async findAll({ limit = 20, cursor }: PaginationOpts): Promise<Paginated<ContactSubmission>> {
    const rows = await this.db.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    })

    const hasMore = rows.length > limit
    const items = hasMore ? rows.slice(0, limit) : rows
    return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
  }

  findById(id: string): Promise<ContactSubmission | null> {
    return this.db.contactSubmission.findUnique({ where: { id } })
  }

  async delete(id: string): Promise<void> {
    await this.db.contactSubmission.delete({ where: { id } })
  }
}
