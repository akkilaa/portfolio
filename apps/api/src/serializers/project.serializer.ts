import type { Project, ProjectWithTagsAndImages, Paginated } from '@portfolio/shared'
import type {
  ProjectResponse,
  ProjectDetailResponse,
  ProjectListResponse,
  AdminProjectListResponse,
} from '@portfolio/shared'

export function serializeProject(project: Project): ProjectResponse {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    descriptionMd: project.descriptionMd,
    shortDescription: project.shortDescription,
    tagline: project.tagline,
    role: project.role,
    startedAt: project.startedAt?.toISOString() ?? null,
    endedAt: project.endedAt?.toISOString() ?? null,
    liveUrl: project.liveUrl,
    repoUrl: project.repoUrl,
    featured: project.featured,
    published: project.published,
    displayOrder: project.displayOrder,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export function serializeProjectDetail(project: ProjectWithTagsAndImages): ProjectDetailResponse {
  return {
    ...serializeProject(project),
    tags: project.tags,
    images: project.images,
  }
}

export function serializeProjectList(
  paginated: Paginated<ProjectWithTagsAndImages>,
): ProjectListResponse {
  return {
    items: paginated.items.map(serializeProjectDetail),
    nextCursor: paginated.nextCursor,
  }
}

export function serializeAdminProjectList(paginated: Paginated<Project>): AdminProjectListResponse {
  return {
    items: paginated.items.map(serializeProject),
    nextCursor: paginated.nextCursor,
  }
}
