export function isPrismaValidationError(err: unknown): err is Error {
  return err instanceof Error && err.constructor.name === 'PrismaClientValidationError'
}

export function isPrismaError(err: unknown, code: string): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === code
  )
}
