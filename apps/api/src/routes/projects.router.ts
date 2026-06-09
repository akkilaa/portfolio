import { Router } from 'express'
import { PROJECT_ROUTES } from '@api/constants/routes'
import { validate } from '@api/middlewares/validate'
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  ReorderProjectsSchema,
} from '@api/schemas/project.schema'
import type { ProjectsController } from '@api/controllers/projects.controller'

export function createProjectsRouter(controller: ProjectsController): Router {
  const router = Router()

  // Static routes must come before dynamic /:slug and /:id
  router.get(PROJECT_ROUTES.FEATURED, controller.getFeatured)
  router.get(PROJECT_ROUTES.ADMIN, controller.getAll)
  router.get(PROJECT_ROUTES.ROOT, controller.getPublished)
  router.get(PROJECT_ROUTES.BY_SLUG, controller.getBySlug)

  router.post(PROJECT_ROUTES.ROOT, validate(CreateProjectSchema), controller.create)
  router.patch(PROJECT_ROUTES.REORDER, validate(ReorderProjectsSchema), controller.reorder)
  router.patch(PROJECT_ROUTES.BY_ID, validate(UpdateProjectSchema), controller.update)
  router.patch(PROJECT_ROUTES.PUBLISH, controller.publish)
  router.patch(PROJECT_ROUTES.UNPUBLISH, controller.unpublish)
  router.patch(PROJECT_ROUTES.RESTORE, controller.restore)
  router.patch(PROJECT_ROUTES.FEATURE, controller.feature)
  router.patch(PROJECT_ROUTES.UNFEATURE, controller.unfeature)
  router.delete(PROJECT_ROUTES.BY_ID, controller.delete)

  return router
}
