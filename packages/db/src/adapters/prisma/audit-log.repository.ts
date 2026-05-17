import type { AuditLog as PrismaAuditLog, PrismaClient } from '@prisma'
import type { IAuditLogRepository } from '@db/ports/repositories/audit-log.repository'
import type { AuditLog, CreateAuditLogInput, Paginated, PaginationOpts } from '@portfolio/shared'

function toAuditLogMetadata(metadata: PrismaAuditLog['metadata']): Record<string, unknown> | null {
  if (metadata === null) return null
  if (typeof metadata !== 'object' || Array.isArray(metadata)) {
    throw new TypeError('Invalid audit log metadata: expected object or null')
  }
  return metadata as Record<string, unknown>
}

function toDomainAuditLog(row: PrismaAuditLog): AuditLog {
  return {
    ...row,
    metadata: toAuditLogMetadata(row.metadata),
  }
}

export class PrismaAuditLogRepository implements IAuditLogRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: CreateAuditLogInput): Promise<AuditLog> {
    const row = await this.db.auditLog.create({ data })
    return toDomainAuditLog(row)
  }

  async findAll({ limit = 50, cursor }: PaginationOpts): Promise<Paginated<AuditLog>> {
    const rows = await this.db.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
    })

    const hasMore = rows.length > limit
    const items = (hasMore ? rows.slice(0, limit) : rows).map(toDomainAuditLog)
    return {
      items,
      nextCursor: hasMore ? items[items.length - 1].id : null,
    }
  }
}
