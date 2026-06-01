import { Router } from 'express'
import type { AskController } from '@api/controllers/ask.controller'

export function createAskRouter(controller: AskController): Router {
  const router = Router()
  router.post('/', (req, res, next) => controller.ask(req, res, next))
  return router
}
