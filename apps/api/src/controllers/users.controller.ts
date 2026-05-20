import type { NextFunction, Request, Response } from 'express'
import type { UsersService } from '@api/services/users.service'
import type { UserResponse } from '@portfolio/shared'
import { serializeUser } from '@api/serializers/user.serializer'

type IdParams = { id: string }

export class UsersController {
  constructor(private readonly service: UsersService) {}

  getById = async (
    req: Request<IdParams, UserResponse>,
    res: Response<UserResponse>,
    next: NextFunction,
  ) => {
    try {
      const user = await this.service.getById(req.params.id)
      res.json(serializeUser(user))
    } catch (err) {
      next(err)
    }
  }
}
