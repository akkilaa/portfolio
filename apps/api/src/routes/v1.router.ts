import { Router } from 'express'
import { ROUTES } from '@api/constants/routes'
import { createPostsRouter } from '@api/routes/posts.router'
import { createProjectsRouter } from '@api/routes/projects.router'
import type { PostsController } from '@api/controllers/posts.controller'
import type { ProjectsController } from '@api/controllers/projects.controller'

type V1Controllers = {
  posts: PostsController
  projects: ProjectsController
}

export function createV1Router(controllers: V1Controllers): Router {
  const router = Router()

  router.use(ROUTES.POSTS, createPostsRouter(controllers.posts))
  router.use(ROUTES.PROJECTS, createProjectsRouter(controllers.projects))

  return router
}
