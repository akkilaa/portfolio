import type { Request, Response } from 'express'
import type { PostsService } from '@api/services/posts.service'

type SlugParams = { slug: string }
type IdParams = { id: string }

export class PostsController {
  constructor(private readonly service: PostsService) {}

  getPublished = async (req: Request, res: Response) => {
    const { cursor, limit, tag } = req.query
    const result = await this.service.getPublished({
      cursor: cursor as string | undefined,
      limit: limit ? Number(limit) : undefined,
      tag: tag as string | undefined,
    })
    res.json(result)
  }

  getBySlug = async (req: Request<SlugParams>, res: Response) => {
    const post = await this.service.getBySlug(req.params.slug)
    if (!post) return res.status(404).json({ error: 'Not found' })
    res.json(post)
  }

  getAll = async (req: Request, res: Response) => {
    const { cursor, limit, includeDeleted } = req.query
    const result = await this.service.getAll({
      cursor: cursor as string | undefined,
      limit: limit ? Number(limit) : undefined,
      includeDeleted: includeDeleted === 'true',
    })
    res.json(result)
  }

  create = async (req: Request, res: Response) => {
    const post = await this.service.create(req.body)
    res.status(201).json(post)
  }

  update = async (req: Request<IdParams>, res: Response) => {
    const post = await this.service.update(req.params.id, req.body)
    res.json(post)
  }

  publish = async (req: Request<IdParams>, res: Response) => {
    const post = await this.service.publish(req.params.id)
    res.json(post)
  }

  unpublish = async (req: Request<IdParams>, res: Response) => {
    const post = await this.service.unpublish(req.params.id)
    res.json(post)
  }

  delete = async (req: Request<IdParams>, res: Response) => {
    await this.service.delete(req.params.id)
    res.status(204).send()
  }
}
