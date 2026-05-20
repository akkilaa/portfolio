import type { ContactSubmission, Paginated } from '@portfolio/shared'
import type { ContactSubmissionResponse, ContactListResponse } from '@portfolio/shared'

export function serializeContactSubmission(
  submission: ContactSubmission,
): ContactSubmissionResponse {
  return {
    id: submission.id,
    name: submission.name,
    email: submission.email,
    message: submission.message,
    ip: submission.ip,
    userAgent: submission.userAgent,
    createdAt: submission.createdAt.toISOString(),
  }
}

export function serializeContactList(paginated: Paginated<ContactSubmission>): ContactListResponse {
  return {
    items: paginated.items.map(serializeContactSubmission),
    nextCursor: paginated.nextCursor,
  }
}
