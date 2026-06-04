import { Router } from 'express'
import type { AskController } from '@api/controllers/ask.controller'
import { rateLimit } from '@api/middlewares/rate-limit.middleware'

const askRateLimit = rateLimit(
  15,
  5 * 60_000,
  "you've sent too many messages — wait a few minutes before trying again.",
)

export function createAskRouter(controller: AskController): Router {
  const router = Router()
  router.post('/', askRateLimit, controller.ask)
  return router
}
