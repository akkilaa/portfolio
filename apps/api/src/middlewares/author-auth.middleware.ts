import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthorRequest } from '@api/types/express'

type AuthorTokenPayload = { sub: string; type: string }

export function requireAuthorAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.authorToken
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthorTokenPayload
    if (payload.type !== 'recommendation-author') throw new Error()
    ;(req as AuthorRequest).author = { id: payload.sub }
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
