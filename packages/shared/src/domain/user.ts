export type UserRole = 'ADMIN'

export type User = {
  id: string
  email: string
  passwordHash: string
  role: UserRole
  failedAttempts: number
  lockedUntil: Date | null
  createdAt: Date
  updatedAt: Date
}

export type CreateUserInput = {
  email: string
  passwordHash: string
}

export type UpdateUserInput = Partial<{
  email: string
  passwordHash: string
  failedAttempts: number
  lockedUntil: Date | null
}>
