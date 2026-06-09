import { Router } from 'express'
import { POST_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import { CreatePostSchema, UpdatePostSchema } from '@api/schemas/post.schema'
import type { PostsController } from '@api/controllers/posts.controller'

export function createPostsRouter(controller: PostsController): Router {
  const router = Router()

  // Admin (must come before /:slug to avoid being matched as a slug param)
  router.get(POST_ROUTES.ADMIN, controller.getAll)

  // Public
  router.get(POST_ROUTES.ROOT, controller.getPublished)
  router.get(POST_ROUTES.BY_SLUG, controller.getBySlug)
  router.post(POST_ROUTES.ROOT, validate(CreatePostSchema), controller.create)
  router.patch(POST_ROUTES.BY_ID, validate(UpdatePostSchema), controller.update)
  router.patch(POST_ROUTES.PUBLISH, controller.publish)
  router.patch(POST_ROUTES.UNPUBLISH, controller.unpublish)
  router.delete(POST_ROUTES.BY_ID, controller.delete)

  return router
}
