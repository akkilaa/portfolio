import type { Expand } from '../helper-types'

export type AuditLog = {
  id: string
  actorId: string | null
  action: string
  entityType: string
  entityId: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
}

export type CreateAuditLogInput = Expand<
  Partial<Omit<AuditLog, 'id' | 'createdAt'>> & Pick<AuditLog, 'action' | 'entityType'>
>
