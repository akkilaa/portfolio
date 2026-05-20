import { Router } from 'express'
import { ROUTES } from '@api/constants/routes'
import { createPostsRouter } from '@api/routes/posts.router'
import { createProjectsRouter } from '@api/routes/projects.router'
import { createContactRouter } from '@api/routes/contact.router'
import type { PostsController } from '@api/controllers/posts.controller'
import type { ProjectsController } from '@api/controllers/projects.controller'
import type { ContactController } from '@api/controllers/contact.controller'

type V1Controllers = {
  posts: PostsController
  projects: ProjectsController
  contact: ContactController
}

export function createV1Router(controllers: V1Controllers): Router {
  const router = Router()

  router.use(ROUTES.POSTS, createPostsRouter(controllers.posts))
  router.use(ROUTES.PROJECTS, createProjectsRouter(controllers.projects))
  router.use(ROUTES.CONTACT, createContactRouter(controllers.contact))

  return router
}
