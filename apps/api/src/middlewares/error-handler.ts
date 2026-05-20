import type { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'
import { AppError } from '@portfolio/shared'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message })
    return
  }
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: z.flattenError(err).fieldErrors })
    return
  }
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
