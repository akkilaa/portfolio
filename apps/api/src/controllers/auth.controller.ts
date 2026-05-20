import { randomBytes } from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthService } from '@api/services/auth.service'
import type { LoginInput } from '@api/schemas/auth.schema'
import { BadRequestError } from '@portfolio/shared'

const ACCESS_TOKEN_TTL_MS = 1 * 24 * 60 * 60 * 1000
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function cookieDefaults() {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
  }
}

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as LoginInput
      await this.service.login(email, password)
      res.json({
        message: 'If your credentials are valid, a login link has been sent to your email.',
      })
    } catch (err) {
      next(err)
    }
  }

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.query.token
      if (typeof token !== 'string') throw new BadRequestError('Missing token')

      const { userId, role } = await this.service.verify(token)

      const accessToken = jwt.sign({ sub: userId, role }, process.env.JWT_SECRET!, {
        expiresIn: '1d',
      })
      const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      const csrfToken = randomBytes(32).toString('hex')

      const base = cookieDefaults()

      res.cookie('accessToken', accessToken, { ...base, maxAge: ACCESS_TOKEN_TTL_MS })
      res.cookie('refreshToken', refreshToken, { ...base, maxAge: REFRESH_TOKEN_TTL_MS })
      // csrfToken must NOT be httpOnly — the client JS needs to read it
      res.cookie('csrfToken', csrfToken, {
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: REFRESH_TOKEN_TTL_MS,
      })

      res.json({ message: 'Logged in successfully' })
    } catch (err) {
      next(err)
    }
  }

  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refreshToken
      if (!token) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      let payload: { sub: string }
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
      } catch {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const accessToken = jwt.sign({ sub: payload.sub }, process.env.JWT_SECRET!, {
        expiresIn: '15m',
      })
      const csrfToken = randomBytes(32).toString('hex')

      const base = cookieDefaults()
      res.cookie('accessToken', accessToken, { ...base, maxAge: ACCESS_TOKEN_TTL_MS })
      res.cookie('csrfToken', csrfToken, {
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: REFRESH_TOKEN_TTL_MS,
      })

      res.json({ message: 'Token refreshed' })
    } catch (err) {
      next(err)
    }
  }

  logout = (_req: Request, res: Response) => {
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.clearCookie('csrfToken')
    res.json({ message: 'Logged out' })
  }
}
