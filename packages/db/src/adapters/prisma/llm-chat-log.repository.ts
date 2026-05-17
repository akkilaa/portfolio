import type { PrismaClient } from '@prisma'
import type { ILlmChatLogRepository } from '@db/ports/repositories/llm-chat-log.repository'
import type { LlmChatLog, CreateLlmChatLogInput } from '@portfolio/shared'

export class PrismaLlmChatLogRepository implements ILlmChatLogRepository {
  constructor(private readonly db: PrismaClient) {}

  create(data: CreateLlmChatLogInput): Promise<LlmChatLog> {
    return this.db.llmChatLog.create({ data })
  }

  findBySession(sessionId: string): Promise<LlmChatLog[]> {
    return this.db.llmChatLog.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    })
  }
}
