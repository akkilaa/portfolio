import type { User, CreateUserInput, UpdateUserInput } from '@portfolio/shared'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserInput): Promise<User>
  update(id: string, data: UpdateUserInput): Promise<User>
  incrementFailedAttempts(id: string): Promise<void>
  lockUntil(id: string, until: Date): Promise<void>
  resetFailedAttempts(id: string): Promise<void>
}
