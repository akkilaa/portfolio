import type { Request, Response, NextFunction } from 'express'

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const csrfHeader = req.headers['x-csrf-token']
  const csrfCookie = req.cookies?.csrfToken

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    res.status(403).json({ error: 'Invalid CSRF token' })
    return
  }
  next()
}
