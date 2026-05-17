export type LlmChatLog = {
  id: string
  sessionId: string
  prompt: string
  responseText: string | null
  durationMs: number | null
  model: string
  ip: string | null
  createdAt: Date
}

export type CreateLlmChatLogInput = {
  sessionId: string
  prompt: string
  responseText?: string
  durationMs?: number
  model: string
  ip?: string
}
