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
import { AskController } from '../src/controllers/ask.controller'
import { RecommendationController } from '../src/controllers/recommendation.controller'
import { MediaService } from '../src/services/media.service'
import { MediaController } from '../src/controllers/media.controller'
import { InMemoryEmailService } from './fakes/InMemoryEmailService'
import { InMemoryPostRepository } from './fakes/InMemoryPostRepository'
import { InMemoryProjectRepository } from './fakes/InMemoryProjectRepository'
import { InMemoryContactRepository } from './fakes/InMemoryContactRepository'
import { InMemoryUserRepository } from './fakes/InMemoryUserRepository'
import { InMemoryMediaRepository } from './fakes/InMemoryMediaRepository'
import { InMemoryStorage } from './fakes/InMemoryStorage'
import { contactInput, anotherContactInput } from './fixtures/contact.fixtures'
import type { CreateContactInput } from '@portfolio/shared'

let repo: InMemoryContactRepository

beforeEach(() => {
  repo = new InMemoryContactRepository()
})

function app() {
  return composeApp({
    posts: new PostsController(new PostsService(new InMemoryPostRepository())),
    projects: new ProjectsController(new ProjectsService(new InMemoryProjectRepository())),
    contact: new ContactController(new ContactService(repo)),
    users: new UsersController(new UsersService(new InMemoryUserRepository())),
    auth: new AuthController(
      new AuthService(new InMemoryUserRepository(), new InMemoryEmailService()),
      {},
      {},
    ),
    ask: new AskController({} as never),
    recommendations: new RecommendationController({} as never),
    media: new MediaController(
      new MediaService(new InMemoryStorage(), new InMemoryMediaRepository()),
    ),
  })
}

async function submitContact(input: CreateContactInput = contactInput) {
  const res = await request(app()).post('/v1/contact').send(input)
  return res.body
}

describe('Submitting a contact form', () => {
  it('given valid details, the submission should be accepted and returned', async () => {
    const res = await request(app()).post('/v1/contact').send(contactInput)

    expect(res.status).toBe(201)
    expect(res.body.name).toBe(contactInput.name)
    expect(res.body.email).toBe(contactInput.email)
    expect(res.body.message).toBe(contactInput.message)
    expect(res.body.createdAt).toBeDefined()
  })

  it('given a submission, the response should include an assigned id', async () => {
    const res = await request(app()).post('/v1/contact').send(contactInput)

    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
  })
})

describe('Admin contact submissions listing', () => {
  it('given existing submissions, all of them should appear in the admin listing', async () => {
    await submitContact(contactInput)
    await submitContact(anotherContactInput)

    const res = await request(app()).get('/v1/contact/admin')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(2)
  })

  it('given no submissions, the listing should be empty with no next page', async () => {
    const res = await request(app()).get('/v1/contact/admin')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
    expect(res.body.nextCursor).toBeNull()
  })

  it('given more submissions than the page size, a cursor to load the next page should be returned', async () => {
    for (let i = 0; i < 3; i++) {
      await submitContact({ ...contactInput, email: `user${i}@example.com` })
    }

    const res = await request(app()).get('/v1/contact/admin?limit=2')

    expect(res.body.items).toHaveLength(2)
    expect(res.body.nextCursor).not.toBeNull()
  })
})

describe('Deleting a contact submission', () => {
  it('given an existing submission, deleting it should succeed', async () => {
    const submission = await submitContact()

    const res = await request(app()).delete(`/v1/contact/${submission.id}`)

    expect(res.status).toBe(204)
  })

  it('given a deleted submission, it should no longer appear in the admin listing', async () => {
    const submission = await submitContact()
    await request(app()).delete(`/v1/contact/${submission.id}`)

    const res = await request(app()).get('/v1/contact/admin')

    expect(res.body.items).toHaveLength(0)
  })
})
