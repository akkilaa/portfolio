import type { NextFunction, Request, Response } from 'express'

interface Entry {
  count: number
  resetAt: number
}

export function rateLimit(max: number, windowMs: number, message: string) {
  const store = new Map<string, Entry>()

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip ?? 'unknown'
    const now = Date.now()
    const entry = store.get(ip)

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs })
      return next()
    }
    if (entry.count >= max) {
      res.status(429).send(message)
      return
    }

    entry.count++
    next()
  }
}
