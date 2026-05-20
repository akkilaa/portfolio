import type { CreateUserInput } from '@portfolio/shared'

export const userInput: CreateUserInput = {
  email: 'admin@example.com',
  passwordHash: '$2b$10$hashedpasswordvalue',
}

export const anotherUserInput: CreateUserInput = {
  email: 'editor@example.com',
  passwordHash: '$2b$10$anotherhashvalue',
}
