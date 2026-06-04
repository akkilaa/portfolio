import type { IProjectRepository } from '@api/ports/project.repository'
import type {
  CreateProjectInput,
  UpdateProjectInput,
  PaginationOpts,
  AdminListOpts,
} from '@portfolio/shared'

export class ProjectsService {
  constructor(private readonly projects: IProjectRepository) {}

  getPublished(opts: PaginationOpts & { tag?: string }) {
    return this.projects.findPublished(opts)
  }

  getFeatured() {
    return this.projects.findFeatured()
  }

  getBySlug(slug: string) {
    return this.projects.findBySlug(slug)
  }

  getAll(opts: AdminListOpts) {
    return this.projects.findAll(opts)
  }

  create(data: CreateProjectInput) {
    return this.projects.create(data)
  }

  update(id: string, data: UpdateProjectInput) {
    return this.projects.update(id, data)
  }

  publish(id: string) {
    return this.projects.publish(id)
  }

  unpublish(id: string) {
    return this.projects.unpublish(id)
  }

  delete(id: string) {
    return this.projects.delete(id)
  }

  restore(id: string) {
    return this.projects.restore(id)
  }

  feature(id: string) {
    return this.projects.feature(id)
  }

  unfeature(id: string) {
    return this.projects.unfeature(id)
  }
}
