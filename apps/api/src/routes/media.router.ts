import { Router } from 'express'
import { MEDIA_ROUTES } from '@api/constants/routes'
import { requireAuth } from '@api/middlewares/auth.middleware'
import { uploadImage } from '@api/middlewares/upload'
import type { MediaController } from '@api/controllers/media.controller'

export function createMediaRouter(controller: MediaController): Router {
  const router = Router()

  // All media routes are admin-only — apply auth once for the whole sub-router.
  // Doing it here (rather than per-route) keeps the handlers free of inline
  // middleware, so Express infers each handler's params from the literal path
  // (`/:id` -> `{ id: string }`) and no casts are needed. Handlers stay wrapped
  // in arrows so the controller is resolved per-request, matching the other
  // routers (an app composed without this controller won't blow up at build).
  router.use(requireAuth)

  router.post(MEDIA_ROUTES.ROOT, uploadImage, (req, res, next) => controller.upload(req, res, next))
  router.get(MEDIA_ROUTES.BY_ID, (req, res, next) => controller.getById(req, res, next))
  router.delete(MEDIA_ROUTES.BY_ID, (req, res, next) => controller.delete(req, res, next))

  return router
}
