import { Router } from 'express'
import { AUTH_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import { LoginSchema } from '@api/schemas/auth.schema'
import type { AuthController } from '@api/controllers/auth.controller'

export function createAuthRouter(controller: AuthController): Router {
  const router = Router()

  router.post(AUTH_ROUTES.LOGIN, validate(LoginSchema), (req, res, next) =>
    controller.login(req, res, next),
  )
  router.get(AUTH_ROUTES.VERIFY, (req, res, next) => controller.verify(req, res, next))
  router.post(AUTH_ROUTES.REFRESH, (req, res, next) => controller.refresh(req, res, next))
  router.post(AUTH_ROUTES.LOGOUT, (req, res, _) => controller.logout(req, res))

  return router
}
