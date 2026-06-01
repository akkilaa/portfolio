import { Router } from 'express'
import { ROUTES } from '@api/constants/routes'
import { createAuthRouter } from '@api/routes/auth.router'
import { createPostsRouter } from '@api/routes/posts.router'
import { createProjectsRouter } from '@api/routes/projects.router'
import { createContactRouter } from '@api/routes/contact.router'
import { createUsersRouter } from '@api/routes/users.router'
import { createRecommendationRouter } from '@api/routes/recommendation.router'
import { createAskRouter } from '@api/routes/ask.router'
import { createMediaRouter } from '@api/routes/media.router'
import type { AuthController } from '@api/controllers/auth.controller'
import type { PostsController } from '@api/controllers/posts.controller'
import type { ProjectsController } from '@api/controllers/projects.controller'
import type { ContactController } from '@api/controllers/contact.controller'
import type { UsersController } from '@api/controllers/users.controller'
import type { RecommendationController } from '@api/controllers/recommendation.controller'
import type { AskController } from '@api/controllers/ask.controller'
import type { MediaController } from '@api/controllers/media.controller'

type V1Controllers = {
  auth: AuthController
  posts: PostsController
  projects: ProjectsController
  contact: ContactController
  users: UsersController
  recommendations: RecommendationController
  ask: AskController
  media: MediaController
}

export function createV1Router(controllers: V1Controllers): Router {
  const router = Router()

  router.use(ROUTES.AUTH, createAuthRouter(controllers.auth))
  router.use(ROUTES.POSTS, createPostsRouter(controllers.posts))
  router.use(ROUTES.PROJECTS, createProjectsRouter(controllers.projects))
  router.use(ROUTES.CONTACT, createContactRouter(controllers.contact))
  router.use(ROUTES.USERS, createUsersRouter(controllers.users))
  router.use(ROUTES.RECOMMENDATIONS, createRecommendationRouter(controllers.recommendations))
  router.use(ROUTES.ASK, createAskRouter(controllers.ask))
  router.use(ROUTES.MEDIA, createMediaRouter(controllers.media))

  return router
}
