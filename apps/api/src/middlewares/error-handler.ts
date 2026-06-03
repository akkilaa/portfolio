import type { Request, Response, NextFunction } from 'express'
import { ZodError, z } from 'zod'
import { AppError } from '@portfolio/shared'
import { isPrismaValidationError, isPrismaError } from '@portfolio/db'

function extractPrismaValidationMessage(err: Error): string {
  // Prisma validation errors embed file paths and code context before the actual
  // user-relevant summary. The last non-empty line is always the human-readable message.
  const lines = err.message.split('\n').filter((l) => l.trim())
  return lines[lines.length - 1]?.trim() ?? 'Invalid input data'
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: err.message })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation failed', details: z.flattenError(err).fieldErrors })
    return
  }

  // Prisma: type/shape validation failures (wrong type, missing required field, unknown argument)
  if (isPrismaValidationError(err)) {
    res.status(400).json({ error: extractPrismaValidationMessage(err as Error) })
    return
  }

  // Prisma: unique constraint violation (e.g. duplicate slug)
  if (isPrismaError(err, 'P2002')) {
    const target = (err as { meta?: { target?: unknown } }).meta?.target
    // meta.target is populated in standard Prisma; with the pg driver adapter it may be absent,
    // so fall back to parsing the field name from the error message.
    let fields: string
    if (Array.isArray(target) && target.length > 0) {
      fields = (target as string[]).join(', ')
    } else {
      const match = (err as Error).message?.match(/`([^`]+)`\s*\)$/)
      fields = match ? match[1] : 'field'
    }
    res.status(409).json({ error: `${fields} is already taken` })
    return
  }

  // Prisma: record not found (update/delete on non-existent id, or connect to missing relation)
  if (isPrismaError(err, 'P2025')) {
    res.status(404).json({ error: 'Record not found' })
    return
  }

  // Prisma: foreign key constraint (connected record does not exist)
  if (isPrismaError(err, 'P2003')) {
    res.status(422).json({ error: 'Referenced resource does not exist' })
    return
  }

  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
