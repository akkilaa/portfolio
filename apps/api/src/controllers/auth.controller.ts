import { randomBytes } from 'node:crypto'
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { AuthService } from '@api/services/auth.service'
import type { GithubOAuthService } from '@api/services/github-oauth.service'
import type { LinkedInOAuthService } from '@api/services/linkedin-oauth.service'
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
  constructor(
    private readonly service: AuthService,
    private readonly githubOAuth: GithubOAuthService,
    private readonly linkedinOAuth: LinkedInOAuthService,
  ) {}

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

  githubRedirect = (_req: Request, res: Response) => {
    const state = this.githubOAuth.generateState()
    // lax required — cookie must survive the cross-site redirect back from GitHub
    res.cookie('oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000,
    })
    res.redirect(this.githubOAuth.buildRedirectUrl(state))
  }

  githubCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.query
      const storedState = req.cookies?.oauth_state

      if (!storedState || state !== storedState) {
        res.status(400).json({ error: 'Invalid OAuth state' })
        return
      }
      if (typeof code !== 'string') {
        res.status(400).json({ error: 'Missing authorization code' })
        return
      }

      res.clearCookie('oauth_state')

      const { authorId } = await this.githubOAuth.exchange(code)
      const { token, maxAge } = this.githubOAuth.issueAuthorToken(authorId)

      res.cookie('authorToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge,
      })

      const appUrl = process.env.APP_URL ?? 'http://localhost:3000'
      res.redirect(`${appUrl}/recommendations`)
    } catch (err) {
      next(err)
    }
  }

  linkedinRedirect = (_req: Request, res: Response) => {
    const state = this.linkedinOAuth.generateState()
    res.cookie('oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000,
    })
    res.redirect(this.linkedinOAuth.buildRedirectUrl(state))
  }

  linkedinCallback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, state } = req.query
      const storedState = req.cookies?.oauth_state

      if (!storedState || state !== storedState) {
        res.status(400).json({ error: 'Invalid OAuth state' })
        return
      }
      if (typeof code !== 'string') {
        res.status(400).json({ error: 'Missing authorization code' })
        return
      }

      res.clearCookie('oauth_state')

      const { authorId } = await this.linkedinOAuth.exchange(code)
      const { token, maxAge } = this.linkedinOAuth.issueAuthorToken(authorId)

      res.cookie('authorToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge,
      })

      const appUrl = process.env.APP_URL ?? 'http://localhost:3000'
      res.redirect(`${appUrl}/recommendations`)
    } catch (err) {
      next(err)
    }
  }
}
