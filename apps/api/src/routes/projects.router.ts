import { Router } from 'express'
import { PROJECT_ROUTES } from '@api/constants/routes'
import type { ProjectsController } from '@api/controllers/projects.controller'

export function createProjectsRouter(controller: ProjectsController): Router {
  const router = Router()

  // Static routes must come before dynamic /:slug and /:id
  router.get(PROJECT_ROUTES.FEATURED, (req, res, next) => controller.getFeatured(req, res, next))
  router.get(PROJECT_ROUTES.ADMIN, (req, res, next) => controller.getAll(req, res, next))
  router.get(PROJECT_ROUTES.ROOT, (req, res, next) => controller.getPublished(req, res, next))
  router.get(PROJECT_ROUTES.BY_SLUG, (req, res, next) => controller.getBySlug(req, res, next))

  router.post(PROJECT_ROUTES.ROOT, (req, res, next) => controller.create(req, res, next))
  router.patch(PROJECT_ROUTES.BY_ID, (req, res, next) => controller.update(req, res, next))
  router.patch(PROJECT_ROUTES.PUBLISH, (req, res, next) => controller.publish(req, res, next))
  router.patch(PROJECT_ROUTES.UNPUBLISH, (req, res, next) => controller.unpublish(req, res, next))
  router.patch(PROJECT_ROUTES.RESTORE, (req, res, next) => controller.restore(req, res, next))
  router.patch(PROJECT_ROUTES.FEATURE, (req, res, next) => controller.feature(req, res, next))
  router.patch(PROJECT_ROUTES.UNFEATURE, (req, res, next) => controller.unfeature(req, res, next))
  router.delete(PROJECT_ROUTES.BY_ID, (req, res, next) => controller.delete(req, res, next))

  return router
}
