export type ContactSubmission = {
  id: string
  name: string
  email: string
  message: string
  ip: string | null
  userAgent: string | null
  createdAt: Date
}

export type CreateContactInput = {
  name: string
  email: string
  message: string
  ip?: string
  userAgent?: string
}
