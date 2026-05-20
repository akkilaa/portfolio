import type { NextFunction, Request, Response } from 'express'
import type { ContactService } from '@api/services/contact.service'
import type {
  PaginatedQuery,
  ContactSubmissionResponse,
  ContactListResponse,
} from '@portfolio/shared'
import {
  serializeContactSubmission,
  serializeContactList,
} from '@api/serializers/contact.serializer'

type AnyParams = Record<string, string>
type IdParams = { id: string }

type SubmitBody = {
  name: string
  email: string
  message: string
}

export class ContactController {
  constructor(private readonly service: ContactService) {}

  submit = async (
    req: Request<AnyParams, ContactSubmissionResponse, SubmitBody>,
    res: Response<ContactSubmissionResponse>,
    next: NextFunction,
  ) => {
    try {
      const { name, email, message } = req.body
      const submission = await this.service.submit({
        name,
        email,
        message,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      })
      res.status(201).json(serializeContactSubmission(submission))
    } catch (err) {
      next(err)
    }
  }

  getAll = async (
    req: Request<AnyParams, ContactListResponse, unknown, PaginatedQuery>,
    res: Response<ContactListResponse>,
    next: NextFunction,
  ) => {
    try {
      const { cursor, limit } = req.query
      const result = await this.service.getAll({
        cursor,
        limit: limit ? Number(limit) : undefined,
      })
      res.json(serializeContactList(result))
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
