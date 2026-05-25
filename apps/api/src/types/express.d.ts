import type { Request } from 'express'
import type { UserRole } from '@portfolio/shared'

export type AuthenticatedRequest = Request & {
  user: { id: string; role: UserRole }
}

export type AuthorRequest = Request & {
  author: { id: string }
}
