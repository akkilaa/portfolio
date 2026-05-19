export abstract class AppError extends Error {
  abstract readonly status: number
}

export class NotFoundError extends AppError {
  readonly status = 404
  constructor(message = 'Not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  readonly status = 409
  constructor(message = 'Conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}

export class ForeignKeyError extends AppError {
  readonly status = 422
  constructor(message = 'Referenced resource does not exist') {
    super(message)
    this.name = 'ForeignKeyError'
  }
}

export class BadRequestError extends AppError {
  readonly status = 400
  constructor(message = 'Bad request') {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class ValidationError extends AppError {
  readonly status = 400
  constructor(message = 'Validation error') {
    super(message)
    this.name = 'ValidationError'
  }
}
