import type { LlmChatLog, CreateLlmChatLogInput } from '@portfolio/shared'

export interface ILlmChatLogRepository {
  create(data: CreateLlmChatLogInput): Promise<LlmChatLog>
  findBySession(sessionId: string): Promise<LlmChatLog[]>
}
