import type { Project, ProjectWithTagsAndImages } from '../domain/project'

export interface ProjectResponse extends Omit<
  Project,
  'deletedAt' | 'startedAt' | 'endedAt' | 'createdAt' | 'updatedAt'
> {
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ProjectDetailResponse extends Omit<
  ProjectWithTagsAndImages,
  'deletedAt' | 'startedAt' | 'endedAt' | 'createdAt' | 'updatedAt'
> {
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectListResponse = {
  items: ProjectDetailResponse[]
  nextCursor: string | null
}

export type AdminProjectListResponse = {
  items: ProjectResponse[]
  nextCursor: string | null
}
