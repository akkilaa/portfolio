import type { NextFunction, Request, Response } from 'express'
import { streamText } from 'ai'
import { z } from 'zod'
import type { LlmChatService } from '@api/services/llm-chat.service'
import { llama, LLM_MODEL, OFFLINE_MSG } from '@api/constants/ai'
import {
  dropConsecutiveDuplicateRolesStartingWithUser,
  keepLastNMessagesStartingWithUser,
  appendConcisenessReminderToLastUserMessage,
  injectSystemPromptIntoFirstUserMessage,
} from '@api/utils/ask.utils'

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      }),
    )
    .max(50),
  id: z.string().optional(),
})

export class AskController {
  constructor(private readonly service: LlmChatService) {}

  ask = async (
    req: Request<Record<string, string>, void, unknown>,
    res: Response<void>,
    next: NextFunction,
  ) => {
    try {
      const parse = chatSchema.safeParse(req.body)
      if (!parse.success) {
        console.error('[ask] validation failed:', JSON.stringify(parse.error.flatten(), null, 2))
        res
          .status(400)
          .json({ error: 'Invalid request', details: parse.error.flatten() } as unknown as void)
        return
      }

      const { messages: rawMessages, id: sessionId = crypto.randomUUID() } = parse.data

      /**
       * Transform the raw client message history into a model-ready sequence.
       *
       * Input:  rawMessages — up to 50 mixed-role messages sent by the client,
       *         potentially containing consecutive same-role entries or a long history.
       *
       * Steps:
       *  1. Enforce strict user→assistant alternation (Gemma requirement).
       *  2. Slide a window over the last 4 messages so the context stays small.
       *  3. Append a conciseness reminder to the final user message.
       *  4. Prepend the system prompt to the first user message content -
       *     Gemma has no system role, so persona/instructions live here.
       *
       * Output: messagesForModel - a clean [user, assistant?, ...] sequence
       *         with persona context baked into the first turn, ready for streamText.
       */
      const alternating = dropConsecutiveDuplicateRolesStartingWithUser(rawMessages)
      const windowed = keepLastNMessagesStartingWithUser(alternating)
      const messages = appendConcisenessReminderToLastUserMessage(windowed)
      const messagesForModel = injectSystemPromptIntoFirstUserMessage(messages)

      const lastUser = [...messages].reverse().find((m) => m.role === 'user')
      const prompt = lastUser?.content ?? ''
      const start = Date.now()

      try {
        const result = streamText({
          model: llama(LLM_MODEL),
          messages: messagesForModel,
          maxOutputTokens: 250,
          onFinish: ({ text }) => {
            if (prompt) {
              void this.service.log({
                sessionId,
                prompt,
                responseText: text,
                durationMs: Date.now() - start,
                model: LLM_MODEL,
                ip: req.ip,
              })
            }
          },
        })

        result.pipeTextStreamToResponse(res)
      } catch {
        if (prompt) {
          void this.service.log({
            sessionId,
            prompt,
            responseText: OFFLINE_MSG,
            durationMs: Date.now() - start,
            model: 'none',
            ip: req.ip,
          })
        }
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.write(OFFLINE_MSG)
        res.end()
      }
    } catch (err) {
      next(err)
    }
  }
}
