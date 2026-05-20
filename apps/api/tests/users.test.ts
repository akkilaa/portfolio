import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { composeApp } from '../src/container'
import { PostsService } from '../src/services/posts.service'
import { PostsController } from '../src/controllers/posts.controller'
import { ProjectsService } from '../src/services/projects.service'
import { ProjectsController } from '../src/controllers/projects.controller'
import { ContactService } from '../src/services/contact.service'
import { ContactController } from '../src/controllers/contact.controller'
import { UsersService } from '../src/services/users.service'
import { UsersController } from '../src/controllers/users.controller'
import { AuthService } from '../src/services/auth.service'
import { AuthController } from '../src/controllers/auth.controller'
import { InMemoryEmailService } from './fakes/InMemoryEmailService'
import { InMemoryPostRepository } from './fakes/InMemoryPostRepository'
import { InMemoryProjectRepository } from './fakes/InMemoryProjectRepository'
import { InMemoryContactRepository } from './fakes/InMemoryContactRepository'
import { InMemoryUserRepository } from './fakes/InMemoryUserRepository'

let repo: InMemoryUserRepository

beforeEach(() => {
  repo = new InMemoryUserRepository()
})

function app() {
  return composeApp({
    posts: new PostsController(new PostsService(new InMemoryPostRepository())),
    projects: new ProjectsController(new ProjectsService(new InMemoryProjectRepository())),
    contact: new ContactController(new ContactService(new InMemoryContactRepository())),
    users: new UsersController(new UsersService(repo)),
    auth: new AuthController(
      new AuthService(new InMemoryUserRepository(), new InMemoryEmailService()),
    ),
  })
}

describe('Reading a user by ID', () => {
  it('given an existing user, the details should be returned without a password hash', async () => {
    const user = await repo.create({ email: 'admin@example.com', passwordHash: 'hashed' })

    const res = await request(app()).get(`/v1/users/${user.id}`)

    expect(res.status).toBe(200)
    expect(res.body.email).toBe('admin@example.com')
    expect(res.body.passwordHash).toBeUndefined()
  })

  it('given an ID that does not match any user, a not-found response should be returned', async () => {
    const res = await request(app()).get('/v1/users/non-existent-id')

    expect(res.status).toBe(404)
  })
})
