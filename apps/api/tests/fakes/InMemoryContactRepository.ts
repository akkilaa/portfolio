import type { IContactRepository } from '../../src/ports/contact.repository'
import type {
  ContactSubmission,
  CreateContactInput,
  Paginated,
  PaginationOpts,
} from '@portfolio/shared'

export class InMemoryContactRepository implements IContactRepository {
  private store = new Map<string, ContactSubmission>()
  private nextId = 1

  seed(submissions: ContactSubmission[]): this {
    for (const submission of submissions) this.store.set(submission.id, submission)
    return this
  }

  async create(data: CreateContactInput): Promise<ContactSubmission> {
    const submission: ContactSubmission = {
      id: String(this.nextId++),
      name: data.name,
      email: data.email,
      message: data.message,
      ip: data.ip ?? null,
      userAgent: data.userAgent ?? null,
      createdAt: new Date(),
    }
    this.store.set(submission.id, submission)
    return submission
  }

  async findAll({ limit = 20, cursor }: PaginationOpts): Promise<Paginated<ContactSubmission>> {
    let items = [...this.store.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )
    if (cursor) {
      const idx = items.findIndex((s) => s.id === cursor)
      items = items.slice(idx + 1)
    }
    const hasMore = items.length > limit
    const page = hasMore ? items.slice(0, limit) : items
    return { items: page, nextCursor: hasMore ? page[page.length - 1].id : null }
  }

  async findById(id: string): Promise<ContactSubmission | null> {
    return this.store.get(id) ?? null
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id)
  }
}
