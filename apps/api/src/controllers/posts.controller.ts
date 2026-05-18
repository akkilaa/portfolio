import type { NextFunction, Request, Response } from 'express'
import type { PostsService } from '@api/services/posts.service'

type SlugParams = { slug: string }
type IdParams = { id: string }

export class PostsController {
  constructor(private readonly service: PostsService) {}

  getPublished = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cursor, limit, tag } = req.query
      const result = await this.service.getPublished({
        cursor: cursor as string | undefined,
        limit: limit ? Number(limit) : undefined,
        tag: tag as string | undefined,
      })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  getBySlug = async (req: Request<SlugParams>, res: Response, next: NextFunction) => {
    try {
      const post = await this.service.getBySlug(req.params.slug)
      if (!post) return res.status(404).json({ error: 'Not found' })
      res.json(post)
    } catch (err) {
      next(err)
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cursor, limit, includeDeleted } = req.query
      const result = await this.service.getAll({
        cursor: cursor as string | undefined,
        limit: limit ? Number(limit) : undefined,
        includeDeleted: includeDeleted === 'true',
      })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await this.service.create(req.body)
      res.status(201).json(post)
    } catch (err) {
      next(err)
    }
  }

  update = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
      const post = await this.service.update(req.params.id, req.body)
      res.json(post)
    } catch (err) {
      next(err)
    }
  }

  publish = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
      const post = await this.service.publish(req.params.id)
      res.json(post)
    } catch (err) {
      next(err)
    }
  }

  unpublish = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
      const post = await this.service.unpublish(req.params.id)
      res.json(post)
    } catch (err) {
      next(err)
    }
  }

  delete = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
      await this.service.delete(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}
