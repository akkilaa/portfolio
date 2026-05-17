import type { AuditLog, CreateAuditLogInput, Paginated, PaginationOpts } from '@portfolio/shared'

export interface IAuditLogRepository {
  create(data: CreateAuditLogInput): Promise<AuditLog>
  findAll(opts: PaginationOpts): Promise<Paginated<AuditLog>>
}
