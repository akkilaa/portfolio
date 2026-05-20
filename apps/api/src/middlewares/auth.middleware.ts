import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { UserRole } from '@portfolio/shared'
import type { AuthenticatedRequest } from '@api/types/express'

type AccessTokenPayload = { sub: string; role: UserRole }

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.accessToken
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AccessTokenPayload
    ;(req as AuthenticatedRequest).user = { id: payload.sub, role: payload.role }
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
