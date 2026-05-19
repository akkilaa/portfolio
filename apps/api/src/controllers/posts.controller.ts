import type { NextFunction, Request, Response } from 'express'
import type { PostsService } from '@api/services/posts.service'
import { NotFoundError } from '@portfolio/shared'
import type {
  Post,
  PostWithTags,
  PostSummary,
  CreatePostInput,
  UpdatePostInput,
  Paginated,
  PostsQuery,
  AdminPostsQuery,
} from '@portfolio/shared'

type SlugParams = { slug: string }
type IdParams = { id: string }

export class PostsController {
  constructor(private readonly service: PostsService) {}

  getPublished = async (
    req: Request<Record<string, never>, Paginated<PostSummary>, Record<string, never>, PostsQuery>,
    res: Response<Paginated<PostSummary>>,
    next: NextFunction,
  ) => {
    try {
      const { cursor, limit, tag } = req.query
      const result = await this.service.getPublished({
        cursor,
        limit: limit ? Number(limit) : undefined,
        tag,
      })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  getBySlug = async (
    req: Request<SlugParams, PostWithTags, Record<string, never>, Record<string, never>>,
    res: Response<PostWithTags>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.getBySlug(req.params.slug)
      if (!post) throw new NotFoundError('Post not found')
      res.json(post)
    } catch (err) {
      next(err)
    }
  }

  getAll = async (
    req: Request<Record<string, never>, Paginated<Post>, Record<string, never>, AdminPostsQuery>,
    res: Response<Paginated<Post>>,
    next: NextFunction,
  ) => {
    try {
      const { cursor, limit, includeDeleted } = req.query
      const result = await this.service.getAll({
        cursor,
        limit: limit ? Number(limit) : undefined,
        includeDeleted: includeDeleted === 'true',
      })
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  create = async (
    req: Request<Record<string, never>, Post, CreatePostInput>,
    res: Response<Post>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.create(req.body)

      res.status(201).json(post)
    } catch (err) {
      next(err)
    }
  }

  update = async (
    req: Request<IdParams, Post, UpdatePostInput>,
    res: Response<Post>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.update(req.params.id, req.body)
      res.json(post)
    } catch (err) {
      next(err)
    }
  }

  publish = async (req: Request<IdParams, Post>, res: Response<Post>, next: NextFunction) => {
    try {
      const post = await this.service.publish(req.params.id)
      res.json(post)
    } catch (err) {
      next(err)
    }
  }

  unpublish = async (req: Request<IdParams, Post>, res: Response<Post>, next: NextFunction) => {
    try {
      const post = await this.service.unpublish(req.params.id)
      res.json(post)
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
}
