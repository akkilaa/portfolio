import { Router } from 'express'
import { requireAuth } from '@api/middlewares/auth.middleware'
import { requireAuthorAuth } from '@api/middlewares/author-auth.middleware'
import { validate } from '@api/middlewares/validate'
import { CreateRecommendationSchema } from '@api/schemas/recommendation.schema'
import type { RecommendationController } from '@api/controllers/recommendation.controller'

export function createRecommendationRouter(controller: RecommendationController): Router {
  const router = Router()

  // Public
  router.get('/', controller.getApproved)

  // Author — /me before /:id to avoid shadowing
  router.get('/me', requireAuthorAuth, controller.getMe)

  router.post('/', requireAuthorAuth, validate(CreateRecommendationSchema), controller.create)

  // Admin — /admin before /:id to avoid shadowing

  router.get('/admin', requireAuth, controller.getAll)

  router.get('/:id', requireAuth, controller.getById)

  router.patch('/:id/approve', requireAuth, controller.approve)

  router.patch('/:id/reject', requireAuth, controller.reject)

  router.delete('/:id', requireAuth, controller.delete)

  return router
}
