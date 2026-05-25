import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { IRecommendationAuthorRepository } from '@api/ports/recommendation.repository'

type LinkedInUser = {
  sub: string
  name: string
  given_name?: string
  picture?: string
}

const LINKEDIN_AUTHORIZE_URL = 'https://www.linkedin.com/oauth/v2/authorization'
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken'
const LINKEDIN_USER_URL = 'https://api.linkedin.com/v2/userinfo'

const AUTHOR_TOKEN_TTL_MS = 24 * 60 * 60 * 1000

export class LinkedInOAuthService {
  constructor(private readonly authors: IRecommendationAuthorRepository) {}

  generateState(): string {
    return randomBytes(16).toString('hex')
  }

  buildRedirectUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      redirect_uri: process.env.LINKEDIN_CALLBACK_URL!,
      scope: 'openid profile',
      state,
    })
    return `${LINKEDIN_AUTHORIZE_URL}?${params}`
  }

  async exchange(code: string): Promise<{ authorId: string }> {
    // LinkedIn requires form-encoded body for token exchange
    const tokenRes = await fetch(LINKEDIN_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        redirect_uri: process.env.LINKEDIN_CALLBACK_URL!,
      }),
    })

    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string }
    if (!tokenData.access_token) throw new Error('Failed to exchange code for access token')

    const userRes = await fetch(LINKEDIN_USER_URL, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const liUser = (await userRes.json()) as LinkedInUser

    const author = await this.authors.upsert({
      provider: 'linkedin',
      providerId: liUser.sub,
      displayName: liUser.name,
      avatarUrl: liUser.picture,
    })

    return { authorId: author.id }
  }

  issueAuthorToken(authorId: string): { token: string; maxAge: number } {
    const token = jwt.sign(
      { sub: authorId, type: 'recommendation-author' },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
    )
    return { token, maxAge: AUTHOR_TOKEN_TTL_MS }
  }
}
