import { randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { IRecommendationAuthorRepository } from '@api/ports/recommendation.repository'

type GithubUser = {
  id: number
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_USER_URL = 'https://api.github.com/user'

const AUTHOR_TOKEN_TTL_MS = 24 * 60 * 60 * 1000

export class GithubOAuthService {
  constructor(private readonly authors: IRecommendationAuthorRepository) {}

  generateState(): string {
    return randomBytes(16).toString('hex')
  }

  buildRedirectUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      redirect_uri: process.env.GITHUB_CALLBACK_URL!,
      scope: 'read:user',
      state,
    })
    return `${GITHUB_AUTHORIZE_URL}?${params}`
  }

  async exchange(code: string): Promise<{ authorId: string }> {
    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      }),
    })

    const tokenData = (await tokenRes.json()) as { access_token?: string; error?: string }
    if (!tokenData.access_token) throw new Error('Failed to exchange code for access token')

    const userRes = await fetch(GITHUB_USER_URL, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    })
    const ghUser = (await userRes.json()) as GithubUser

    const author = await this.authors.upsert({
      provider: 'github',
      providerId: String(ghUser.id),
      displayName: ghUser.name ?? ghUser.login,
      username: ghUser.login,
      avatarUrl: ghUser.avatar_url,
      profileUrl: ghUser.html_url,
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
