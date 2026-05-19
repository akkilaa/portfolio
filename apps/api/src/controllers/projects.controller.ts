import type { NextFunction, Request, Response } from 'express'
import type { ProjectsService } from '@api/services/projects.service'
import { NotFoundError } from '@portfolio/shared'
import type {
  CreateProjectInput,
  UpdateProjectInput,
  ProjectsQuery,
  AdminProjectsQuery,
  ProjectResponse,
  ProjectDetailResponse,
  ProjectListResponse,
  AdminProjectListResponse,
} from '@portfolio/shared'
import {
  serializeProject,
  serializeProjectDetail,
  serializeProjectList,
  serializeAdminProjectList,
} from '@api/serializers/project.serializer'

type AnyParams = Record<string, string>
type SlugParams = { slug: string }
type IdParams = { id: string }

export class ProjectsController {
  constructor(private readonly service: ProjectsService) {}

  getPublished = async (
    req: Request<AnyParams, ProjectListResponse, unknown, ProjectsQuery>,
    res: Response<ProjectListResponse>,
    next: NextFunction,
  ) => {
    try {
      const { cursor, limit, tag } = req.query
      const result = await this.service.getPublished({
        cursor,
        limit: limit ? Number(limit) : undefined,
        tag,
      })
      res.json(serializeProjectList(result))
    } catch (err) {
      next(err)
    }
  }

  getFeatured = async (
    _req: Request,
    res: Response<ProjectDetailResponse[]>,
    next: NextFunction,
  ) => {
    try {
      const projects = await this.service.getFeatured()
      res.json(projects.map(serializeProjectDetail))
    } catch (err) {
      next(err)
    }
  }

  getBySlug = async (
    req: Request<SlugParams, ProjectDetailResponse>,
    res: Response<ProjectDetailResponse>,
    next: NextFunction,
  ) => {
    try {
      const project = await this.service.getBySlug(req.params.slug)
      if (!project) throw new NotFoundError('Project not found')
      res.json(serializeProjectDetail(project))
    } catch (err) {
      next(err)
    }
  }

  getAll = async (
    req: Request<AnyParams, AdminProjectListResponse, unknown, AdminProjectsQuery>,
    res: Response<AdminProjectListResponse>,
    next: NextFunction,
  ) => {
    try {
      const { cursor, limit, includeDeleted } = req.query
      const result = await this.service.getAll({
        cursor,
        limit: limit ? Number(limit) : undefined,
        includeDeleted: includeDeleted === 'true',
      })
      res.json(serializeAdminProjectList(result))
    } catch (err) {
      next(err)
    }
  }

  create = async (
    req: Request<AnyParams, ProjectResponse, CreateProjectInput>,
    res: Response<ProjectResponse>,
    next: NextFunction,
  ) => {
    try {
      const project = await this.service.create(req.body)
      res.status(201).json(serializeProject(project))
    } catch (err) {
      next(err)
    }
  }

  update = async (
    req: Request<IdParams, ProjectResponse, UpdateProjectInput>,
    res: Response<ProjectResponse>,
    next: NextFunction,
  ) => {
    try {
      const project = await this.service.update(req.params.id, req.body)
      res.json(serializeProject(project))
    } catch (err) {
      next(err)
    }
  }

  publish = async (
    req: Request<IdParams, ProjectResponse>,
    res: Response<ProjectResponse>,
    next: NextFunction,
  ) => {
    try {
      const project = await this.service.publish(req.params.id)
      res.json(serializeProject(project))
    } catch (err) {
      next(err)
    }
  }

  unpublish = async (
    req: Request<IdParams, ProjectResponse>,
    res: Response<ProjectResponse>,
    next: NextFunction,
  ) => {
    try {
      const project = await this.service.unpublish(req.params.id)
      res.json(serializeProject(project))
    } catch (err) {
      next(err)
    }
  }

  delete = async (req: Request<IdParams>, res: Response<void>, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  restore = async (
    req: Request<IdParams, ProjectResponse>,
    res: Response<ProjectResponse>,
    next: NextFunction,
  ) => {
    try {
      const project = await this.service.restore(req.params.id)
      res.json(serializeProject(project))
    } catch (err) {
      next(err)
    }
  }
}
