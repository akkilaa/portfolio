import type { Project, ProjectWithTagsAndImages, CreateProjectInput, UpdateProjectInput, Paginated, PaginationOpts, AdminListOpts } from '@portfolio/shared'

export interface IProjectRepository {
  findBySlug(slug: string): Promise<ProjectWithTagsAndImages | null>
  findById(id: string): Promise<Project | null>
  findPublished(opts: PaginationOpts & { tag?: string }): Promise<Paginated<ProjectWithTagsAndImages>>
  findFeatured(): Promise<ProjectWithTagsAndImages[]>
  findAll(opts: AdminListOpts): Promise<Paginated<Project>>
  create(data: CreateProjectInput): Promise<Project>
  update(id: string, data: UpdateProjectInput): Promise<Project>
  delete(id: string): Promise<void>
  restore(id: string): Promise<Project>
  publish(id: string): Promise<Project>
  unpublish(id: string): Promise<Project>
}
