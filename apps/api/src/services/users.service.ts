import type { IUserRepository } from '@api/ports/user.repository'
import { NotFoundError } from '@portfolio/shared'

export class UsersService {
  constructor(private readonly users: IUserRepository) {}

  async getById(id: string) {
    const user = await this.users.findById(id)
    if (!user) throw new NotFoundError('User not found')
    return user
  }
}
