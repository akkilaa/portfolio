import { Router } from 'express'
import { MEDIA_ROUTES } from '@api/constants/routes'
import { requireAuth } from '@api/middlewares/auth.middleware'
import { uploadImage } from '@api/middlewares/upload'
import type { MediaController } from '@api/controllers/media.controller'

export function createMediaRouter(controller: MediaController): Router {
  const router = Router()

  // All media routes are admin-only — apply auth once for the whole sub-router.
  // Doing it here (rather than per-route) keeps each route declaration simple
  // and avoids per-handler auth repetition.
  router.use(requireAuth)

  router.post(MEDIA_ROUTES.ROOT, uploadImage, controller.upload)
  router.get(MEDIA_ROUTES.BY_ID, controller.getById)
  router.delete(MEDIA_ROUTES.BY_ID, controller.delete)

  return router
}
