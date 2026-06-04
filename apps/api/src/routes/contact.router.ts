import { Router } from 'express'
import { CONTACT_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import { ContactSchema } from '@api/schemas/contact.schema'
import type { ContactController } from '@api/controllers/contact.controller'

export function createContactRouter(controller: ContactController): Router {
  const router = Router()

  // Static routes before dynamic /:id
  router.get(CONTACT_ROUTES.ADMIN, controller.getAll)
  router.post(CONTACT_ROUTES.ROOT, validate(ContactSchema), controller.submit)
  router.delete(CONTACT_ROUTES.BY_ID, controller.delete)

  return router
}
