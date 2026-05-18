import { Router } from 'express'
import { postRepository } from '@api/container'
import { PostsService } from '@api/services/posts.service'
import { PostsController } from '@api/controllers/posts.controller'
import { POST_ROUTES } from '@api/constants/routes'

const service = new PostsService(postRepository)
const controller = new PostsController(service)

const router = Router()

// Public
router.get(POST_ROUTES.ROOT, controller.getPublished)
router.get(POST_ROUTES.BY_SLUG, controller.getBySlug)

// Admin
router.get(POST_ROUTES.ADMIN, controller.getAll)
router.post(POST_ROUTES.ROOT, controller.create)
router.patch(POST_ROUTES.BY_ID, controller.update)
router.patch(POST_ROUTES.PUBLISH, controller.publish)
router.patch(POST_ROUTES.UNPUBLISH, controller.unpublish)
router.delete(POST_ROUTES.BY_ID, controller.delete)

export default router
