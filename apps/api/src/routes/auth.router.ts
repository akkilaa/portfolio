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

  // OAuth callbacks registered before the redirect initiators (more specific path first)
  router.get(AUTH_ROUTES.GITHUB_CALLBACK, (req, res, next) =>
    controller.githubCallback(req, res, next),
  )
  router.get(AUTH_ROUTES.GITHUB, (req, res) => controller.githubRedirect(req, res))

  router.get(AUTH_ROUTES.LINKEDIN_CALLBACK, (req, res, next) =>
    controller.linkedinCallback(req, res, next),
  )
  router.get(AUTH_ROUTES.LINKEDIN, (req, res) => controller.linkedinRedirect(req, res))

  return router
}
