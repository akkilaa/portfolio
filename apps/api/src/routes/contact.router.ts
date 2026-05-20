import { Router } from 'express'
import { CONTACT_ROUTES } from '@api/constants/routes'
import type { ContactController } from '@api/controllers/contact.controller'

export function createContactRouter(controller: ContactController): Router {
  const router = Router()

  // Static routes before dynamic /:id
  router.get(CONTACT_ROUTES.ADMIN, (req, res, next) => controller.getAll(req, res, next))
  router.post(CONTACT_ROUTES.ROOT, (req, res, next) => controller.submit(req, res, next))
  router.delete(CONTACT_ROUTES.BY_ID, (req, res, next) => controller.delete(req, res, next))

  return router
}
