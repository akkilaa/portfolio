import type { ILlmChatLogRepository } from '@api/ports/llm-chat-log.repository'
import type { CreateLlmChatLogInput } from '@portfolio/shared'

export class LlmChatService {
  constructor(private readonly repo: ILlmChatLogRepository) {}

  log(data: CreateLlmChatLogInput) {
    return this.repo.create(data)
  }

  getSession(sessionId: string) {
    return this.repo.findBySession(sessionId)
  }
}
