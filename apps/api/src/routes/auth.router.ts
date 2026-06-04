import { Router } from 'express'
import { AUTH_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import { LoginSchema } from '@api/schemas/auth.schema'
import type { AuthController } from '@api/controllers/auth.controller'

export function createAuthRouter(controller: AuthController): Router {
  const router = Router()

  router.post(AUTH_ROUTES.LOGIN, validate(LoginSchema), controller.login)
  router.get(AUTH_ROUTES.VERIFY, controller.verify)
  router.post(AUTH_ROUTES.REFRESH, controller.refresh)
  router.post(AUTH_ROUTES.LOGOUT, controller.logout)

  // OAuth callbacks registered before the redirect initiators (more specific path first)
  router.get(AUTH_ROUTES.GITHUB_CALLBACK, controller.githubCallback)
  router.get(AUTH_ROUTES.GITHUB, controller.githubRedirect)

  router.get(AUTH_ROUTES.LINKEDIN_CALLBACK, controller.linkedinCallback)
  router.get(AUTH_ROUTES.LINKEDIN, controller.linkedinRedirect)

  return router
}
