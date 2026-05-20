import type { User } from '@portfolio/shared'
import type { UserResponse } from '@portfolio/shared'

export function serializeUser(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    failedAttempts: user.failedAttempts,
    lockedUntil: user.lockedUntil?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }
}
