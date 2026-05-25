import type { NextFunction, Request, Response } from 'express'
import type { RecommendationService } from '@api/services/recommendation.service'
import type {
  RecommendationListResponse,
  AdminRecommendationListResponse,
  RecommendationResponse,
  AdminRecommendationQuery,
  CreateRecommendationBody,
  RecommendationStatus,
  RecommendationMeResponse,
} from '@portfolio/shared'
import type { AuthorRequest } from '@api/types/express'
import {
  serializeRecommendation,
  serializeRecommendationList,
  serializeAdminRecommendationList,
  serializeMe,
} from '@api/serializers/recommendation.serializer'

type IdParams = { id: string }

export class RecommendationController {
  constructor(private readonly service: RecommendationService) {}

  getMe = async (req: Request, res: Response<RecommendationMeResponse>, next: NextFunction) => {
    try {
      const { id: authorId } = (req as AuthorRequest).author
      const data = await this.service.getMe(authorId)
      res.json(serializeMe(data))
    } catch (err) {
      next(err)
    }
  }

  getApproved = async (
    _req: Request,
    res: Response<RecommendationListResponse>,
    next: NextFunction,
  ) => {
    try {
      const items = await this.service.getApproved()
      res.json(serializeRecommendationList(items))
    } catch (err) {
      next(err)
    }
  }

  getAll = async (
    req: Request<
      Record<string, string>,
      AdminRecommendationListResponse,
      unknown,
      AdminRecommendationQuery
    >,
    res: Response<AdminRecommendationListResponse>,
    next: NextFunction,
  ) => {
    try {
      const status = req.query.status as RecommendationStatus | undefined
      const items = await this.service.getAll({ status })
      res.json(serializeAdminRecommendationList(items))
    } catch (err) {
      next(err)
    }
  }

  getById = async (
    req: Request<IdParams, RecommendationResponse>,
    res: Response<RecommendationResponse>,
    next: NextFunction,
  ) => {
    try {
      const rec = await this.service.getById(req.params.id)
      res.json(serializeRecommendation(rec))
    } catch (err) {
      next(err)
    }
  }

  create = async (
    req: Request<Record<string, string>, RecommendationResponse, CreateRecommendationBody>,
    res: Response<RecommendationResponse>,
    next: NextFunction,
  ) => {
    try {
      const { id: authorId } = (req as AuthorRequest).author
      const { comment, linkedinUrl } = req.body
      const rec = await this.service.create(authorId, comment, linkedinUrl)
      // create returns Recommendation (no author), fetch the full record
      const full = await this.service.getById(rec.id)
      res.status(201).json(serializeRecommendation(full))
    } catch (err) {
      next(err)
    }
  }

  approve = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
      await this.service.approve(req.params.id)
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  reject = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
    try {
      await this.service.reject(req.params.id)
      res.status(204).send()
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
