import type { User } from '../domain/user'

export interface UserResponse extends Omit<
  User,
  'passwordHash' | 'lockedUntil' | 'createdAt' | 'updatedAt'
> {
  lockedUntil: string | null
  createdAt: string
  updatedAt: string
}
