import { Router } from 'express'
import { ROUTES } from '@api/constants/routes'
import { createPostsRouter } from '@api/routes/posts.router'
import type { PostsController } from '@api/controllers/posts.controller'

type V1Controllers = {
  posts: PostsController
}

export function createV1Router(controllers: V1Controllers): Router {
  const router = Router()

  router.use(ROUTES.POSTS, createPostsRouter(controllers.posts))

  return router
}
