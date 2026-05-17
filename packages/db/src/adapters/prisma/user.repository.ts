import type { PrismaClient } from '@prisma'
import type { IUserRepository } from '@db/ports/repositories/user.repository'
import type { User, CreateUserInput, UpdateUserInput } from '@portfolio/shared'

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClient) {}

  findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } })
  }

  create(data: CreateUserInput): Promise<User> {
    return this.db.user.create({ data })
  }

  update(id: string, data: UpdateUserInput): Promise<User> {
    return this.db.user.update({ where: { id }, data })
  }

  async incrementFailedAttempts(id: string): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { failedAttempts: { increment: 1 } },
    })
  }

  async lockUntil(id: string, until: Date): Promise<void> {
    await this.db.user.update({ where: { id }, data: { lockedUntil: until } })
  }

  async resetFailedAttempts(id: string): Promise<void> {
    await this.db.user.update({
      where: { id },
      data: { failedAttempts: 0, lockedUntil: null },
    })
  }
}
