import { Router } from 'express'
import { POST_ROUTES } from '@api/constants/routes'
import type { PostsController } from '@api/controllers/posts.controller'

export function createPostsRouter(controller: PostsController): Router {
  const router = Router()

  // Public
  router.get(POST_ROUTES.ROOT, (req, res, next) => controller.getPublished(req, res, next))
  router.get(POST_ROUTES.BY_SLUG, (req, res, next) => controller.getBySlug(req, res, next))

  // Admin
  router.get(POST_ROUTES.ADMIN, (req, res, next) => controller.getAll(req, res, next))
  router.post(POST_ROUTES.ROOT, (req, res, next) => controller.create(req, res, next))
  router.patch(POST_ROUTES.BY_ID, (req, res, next) => controller.update(req, res, next))
  router.patch(POST_ROUTES.PUBLISH, (req, res, next) => controller.publish(req, res, next))
  router.patch(POST_ROUTES.UNPUBLISH, (req, res, next) => controller.unpublish(req, res, next))
  router.delete(POST_ROUTES.BY_ID, (req, res, next) => controller.delete(req, res, next))

  return router
}
