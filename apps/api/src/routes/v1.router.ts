import { Router } from 'express'
import { ROUTES } from '@api/constants/routes'
import { createAuthRouter } from '@api/routes/auth.router'
import { createPostsRouter } from '@api/routes/posts.router'
import { createProjectsRouter } from '@api/routes/projects.router'
import { createContactRouter } from '@api/routes/contact.router'
import { createUsersRouter } from '@api/routes/users.router'
import type { AuthController } from '@api/controllers/auth.controller'
import type { PostsController } from '@api/controllers/posts.controller'
import type { ProjectsController } from '@api/controllers/projects.controller'
import type { ContactController } from '@api/controllers/contact.controller'
import type { UsersController } from '@api/controllers/users.controller'

type V1Controllers = {
  auth: AuthController
  posts: PostsController
  projects: ProjectsController
  contact: ContactController
  users: UsersController
}

export function createV1Router(controllers: V1Controllers): Router {
  const router = Router()

  router.use(ROUTES.AUTH, createAuthRouter(controllers.auth))
  router.use(ROUTES.POSTS, createPostsRouter(controllers.posts))
  router.use(ROUTES.PROJECTS, createProjectsRouter(controllers.projects))
  router.use(ROUTES.CONTACT, createContactRouter(controllers.contact))
  router.use(ROUTES.USERS, createUsersRouter(controllers.users))

  return router
}
