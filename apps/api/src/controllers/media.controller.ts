import type { NextFunction, Request, Response } from 'express'
import { BadRequestError, NotFoundError } from '@portfolio/shared'
import type { MediaAssetResponse } from '@portfolio/shared'
import type { MediaService } from '@api/services/media.service'
import { serializeMedia } from '@api/serializers/media.serializer'

type IdParams = { id: string }

export class MediaController {
  constructor(private readonly service: MediaService) {}

  upload = async (req: Request, res: Response<MediaAssetResponse>, next: NextFunction) => {
    try {
      const file = req.file
      if (!file) throw new BadRequestError('No file uploaded (expected field "file")')
      const alt = typeof req.body?.alt === 'string' ? req.body.alt : undefined
      const asset = await this.service.upload(file.buffer, file.mimetype, alt)
      res.status(201).json(serializeMedia(asset, this.service.resolveUrl(asset)))
    } catch (err) {
      next(err)
    }
  }

  getById = async (
    req: Request<IdParams, MediaAssetResponse>,
    res: Response<MediaAssetResponse>,
    next: NextFunction,
  ) => {
    try {
      const asset = await this.service.getById(req.params.id)
      if (!asset) throw new NotFoundError('Media not found')
      res.json(serializeMedia(asset, this.service.resolveUrl(asset)))
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
