import { Router } from 'express'
import { requireAuth } from '@api/middlewares/auth.middleware'
import { requireAuthorAuth } from '@api/middlewares/author-auth.middleware'
import type { RecommendationController } from '@api/controllers/recommendation.controller'

export function createRecommendationRouter(controller: RecommendationController): Router {
  const router = Router()

  // Public
  router.get('/', (req, res, next) => controller.getApproved(req, res, next))

  // Author — /me before /:id to avoid shadowing
  router.get('/me', requireAuthorAuth, (req, res, next) => controller.getMe(req, res, next))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.post('/', requireAuthorAuth, (req, res, next) => controller.create(req as any, res, next))

  // Admin — /admin before /:id to avoid shadowing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.get('/admin', requireAuth, (req, res, next) => controller.getAll(req as any, res, next))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.get('/:id', requireAuth, (req, res, next) => controller.getById(req as any, res, next))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.patch('/:id/approve', requireAuth, (req, res, next) =>
    controller.approve(req as any, res, next),
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.patch('/:id/reject', requireAuth, (req, res, next) =>
    controller.reject(req as any, res, next),
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router.delete('/:id', requireAuth, (req, res, next) => controller.delete(req as any, res, next))

  return router
}
