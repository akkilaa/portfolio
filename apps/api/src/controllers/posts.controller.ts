import type { NextFunction, Request, Response } from 'express'
import type { PostsService } from '@api/services/posts.service'
import { NotFoundError } from '@portfolio/shared'
import type {
  CreatePostInput,
  UpdatePostInput,
  PostsQuery,
  AdminPostsQuery,
  PostResponse,
  PostDetailResponse,
  PostListResponse,
  AdminPostListResponse,
} from '@portfolio/shared'
import {
  serializePost,
  serializePostDetail,
  serializePostList,
  serializeAdminPostList,
} from '@api/serializers/post.serializer'

type AnyParams = Record<string, string>
type SlugParams = { slug: string }
type IdParams = { id: string }

export class PostsController {
  constructor(private readonly service: PostsService) {}

  getPublished = async (
    req: Request<AnyParams, PostListResponse, unknown, PostsQuery>,
    res: Response<PostListResponse>,
    next: NextFunction,
  ) => {
    try {
      const { cursor, limit, tag } = req.query
      const result = await this.service.getPublished({
        cursor,
        limit: limit ? Number(limit) : undefined,
        tag,
      })
      res.json(serializePostList(result))
    } catch (err) {
      next(err)
    }
  }

  getBySlug = async (
    req: Request<SlugParams, PostDetailResponse>,
    res: Response<PostDetailResponse>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.getBySlug(req.params.slug)
      if (!post) throw new NotFoundError('Post not found')
      res.json(serializePostDetail(post))
    } catch (err) {
      next(err)
    }
  }

  getAll = async (
    req: Request<AnyParams, AdminPostListResponse, unknown, AdminPostsQuery>,
    res: Response<AdminPostListResponse>,
    next: NextFunction,
  ) => {
    try {
      const { cursor, limit, includeDeleted } = req.query
      const result = await this.service.getAll({
        cursor,
        limit: limit ? Number(limit) : undefined,
        includeDeleted: includeDeleted === 'true',
      })
      res.json(serializeAdminPostList(result))
    } catch (err) {
      next(err)
    }
  }

  create = async (
    req: Request<AnyParams, PostResponse, CreatePostInput>,
    res: Response<PostResponse>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.create(req.body)
      res.status(201).json(serializePost(post))
    } catch (err) {
      next(err)
    }
  }

  update = async (
    req: Request<IdParams, PostResponse, UpdatePostInput>,
    res: Response<PostResponse>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.update(req.params.id, req.body)
      res.json(serializePost(post))
    } catch (err) {
      next(err)
    }
  }

  publish = async (
    req: Request<IdParams, PostResponse>,
    res: Response<PostResponse>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.publish(req.params.id)
      res.json(serializePost(post))
    } catch (err) {
      next(err)
    }
  }

  unpublish = async (
    req: Request<IdParams, PostResponse>,
    res: Response<PostResponse>,
    next: NextFunction,
  ) => {
    try {
      const post = await this.service.unpublish(req.params.id)
      res.json(serializePost(post))
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
