import type { ContactSubmission } from '../domain/contact'

export interface ContactSubmissionResponse extends Omit<ContactSubmission, 'createdAt'> {
  createdAt: string
}

export type ContactListResponse = {
  items: ContactSubmissionResponse[]
  nextCursor: string | null
}
