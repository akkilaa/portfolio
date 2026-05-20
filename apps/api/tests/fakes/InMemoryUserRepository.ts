import type { IUserRepository } from '../../src/ports/user.repository'
import type { User, CreateUserInput, UpdateUserInput } from '@portfolio/shared'

export class InMemoryUserRepository implements IUserRepository {
  private store = new Map<string, User>()
  private nextId = 1

  seed(users: User[]): this {
    for (const user of users) this.store.set(user.id, user)
    return this
  }

  async findById(id: string): Promise<User | null> {
    return this.store.get(id) ?? null
  }

  async findByEmail(email: string): Promise<User | null> {
    return [...this.store.values()].find((u) => u.email === email) ?? null
  }

  async create(data: CreateUserInput): Promise<User> {
    const user: User = {
      id: String(this.nextId++),
      email: data.email,
      passwordHash: data.passwordHash,
      role: 'ADMIN',
      failedAttempts: 0,
      lockedUntil: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.store.set(user.id, user)
    return user
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`User ${id} not found`)
    const updated: User = { ...existing, ...data, updatedAt: new Date() }
    this.store.set(id, updated)
    return updated
  }

  async incrementFailedAttempts(id: string): Promise<void> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`User ${id} not found`)
    this.store.set(id, { ...existing, failedAttempts: existing.failedAttempts + 1 })
  }

  async lockUntil(id: string, until: Date): Promise<void> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`User ${id} not found`)
    this.store.set(id, { ...existing, lockedUntil: until })
  }

  async resetFailedAttempts(id: string): Promise<void> {
    const existing = this.store.get(id)
    if (!existing) throw new Error(`User ${id} not found`)
    this.store.set(id, { ...existing, failedAttempts: 0, lockedUntil: null })
  }
}
