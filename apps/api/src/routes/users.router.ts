import { Router } from 'express'
import { USER_ROUTES } from '@api/constants/routes'
import type { UsersController } from '@api/controllers/users.controller'

export function createUsersRouter(controller: UsersController): Router {
  const router = Router()

  router.get(USER_ROUTES.BY_ID, controller.getById)

  return router
}
