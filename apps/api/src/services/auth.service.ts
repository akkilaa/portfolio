import jwt from 'jsonwebtoken'
import { compare } from 'bcrypt'
import type { IUserRepository } from '@api/ports/user.repository'
import type { IEmailService } from '@api/ports/email.port'
import type { UserRole } from '@portfolio/shared'
import { BadRequestError } from '@portfolio/shared'

type JwtPayload = { sub: string; purpose?: string; role?: UserRole }

export class AuthService {
  constructor(
    private readonly users: IUserRepository,
    private readonly email: IEmailService,
  ) {}

  async login(email: string, password: string): Promise<void> {
    const user = await this.users.findByEmail(email)

    if (user) {
      const passwordMatch = await compare(password, user.passwordHash)
      if (passwordMatch) {
        const token = jwt.sign({ sub: email, purpose: 'magic-link' }, process.env.JWT_SECRET!, {
          expiresIn: '15m',
        })
        const link = `${process.env.APP_URL}/admin/verify?token=${token}`
        await this.email.sendMagicLink(email, link)
      }
    }
    // Always resolves — never reveal if email/password is wrong
  }

  async verify(token: string): Promise<{ userId: string; role: UserRole }> {
    let payload: JwtPayload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
    } catch {
      throw new BadRequestError('Invalid or expired login link')
    }

    if (payload.purpose !== 'magic-link' || !payload.sub) {
      throw new BadRequestError('Invalid token')
    }

    const user = await this.users.findByEmail(payload.sub)
    if (!user) throw new BadRequestError('Invalid token')

    return { userId: user.id, role: user.role }
  }
}
