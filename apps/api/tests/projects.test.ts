import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { composeApp } from '../src/container'
import { PostsService } from '../src/services/posts.service'
import { PostsController } from '../src/controllers/posts.controller'
import { ProjectsService } from '../src/services/projects.service'
import { ProjectsController } from '../src/controllers/projects.controller'
import { InMemoryPostRepository } from './fakes/InMemoryPostRepository'
import { InMemoryProjectRepository } from './fakes/InMemoryProjectRepository'
import {
  draftProjectInput,
  publishedProjectInput,
  deletedProjectInput,
  featuredProjectInput,
} from './fixtures/projects.fixtures'
import type { CreateProjectInput } from '@portfolio/shared'

let repo: InMemoryProjectRepository

beforeEach(() => {
  repo = new InMemoryProjectRepository()
})

function app() {
  return composeApp({
    posts: new PostsController(new PostsService(new InMemoryPostRepository())),
    projects: new ProjectsController(new ProjectsService(repo)),
  })
}

async function createDraft(input: CreateProjectInput = draftProjectInput) {
  const res = await request(app()).post('/v1/projects').send(input)
  return res.body
}

async function createPublished(input: CreateProjectInput = publishedProjectInput) {
  const draft = await createDraft(input)
  await request(app()).patch(`/v1/projects/${draft.id}/publish`)
  return draft
}

async function createDeleted(input: CreateProjectInput = deletedProjectInput) {
  const draft = await createDraft(input)
  await request(app()).delete(`/v1/projects/${draft.id}`)
  return draft
}

async function createFeatured(input: CreateProjectInput = featuredProjectInput) {
  const draft = await createDraft(input)
  await request(app()).patch(`/v1/projects/${draft.id}/publish`)
  return draft
}

describe('Public project listing', () => {
  it('given published, draft, and deleted projects exist, only the published one should be visible', async () => {
    await createPublished()
    await createDraft()
    await createDeleted()

    const res = await request(app()).get('/v1/projects')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].slug).toBe(publishedProjectInput.slug)
  })

  it('given no published projects exist, the listing should be empty with no next page', async () => {
    await createDraft()
    await createDeleted()

    const res = await request(app()).get('/v1/projects')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
    expect(res.body.nextCursor).toBeNull()
  })

  it('given more projects than the requested page size, a cursor to load the next page should be returned', async () => {
    for (const slug of ['project-1', 'project-2', 'project-3']) {
      await createPublished({ ...publishedProjectInput, slug })
    }

    const res = await request(app()).get('/v1/projects?limit=2')

    expect(res.body.items).toHaveLength(2)
    expect(res.body.nextCursor).not.toBeNull()
  })
})

describe('Featured projects listing', () => {
  it('given a published featured project exists, it should appear in the featured listing', async () => {
    await createFeatured()

    const res = await request(app()).get('/v1/projects/featured')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].slug).toBe(featuredProjectInput.slug)
  })

  it('given a featured project that is not published, it should not appear in the featured listing', async () => {
    await createDraft(featuredProjectInput)

    const res = await request(app()).get('/v1/projects/featured')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(0)
  })

  it('given a non-featured published project, it should not appear in the featured listing', async () => {
    await createPublished()

    const res = await request(app()).get('/v1/projects/featured')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(0)
  })
})

describe('Reading a project by its slug', () => {
  it('given a valid published slug, the full project content should be returned', async () => {
    await createPublished()

    const res = await request(app()).get(`/v1/projects/${publishedProjectInput.slug}`)

    expect(res.status).toBe(200)
    expect(res.body.slug).toBe(publishedProjectInput.slug)
    expect(res.body.title).toBe(publishedProjectInput.title)
  })

  it('given a slug that does not match any project, a not-found response should be returned', async () => {
    const res = await request(app()).get('/v1/projects/non-existent')

    expect(res.status).toBe(404)
  })

  it('given a deleted project, its slug should no longer return any content', async () => {
    await createDeleted()

    const res = await request(app()).get(`/v1/projects/${deletedProjectInput.slug}`)

    expect(res.status).toBe(404)
  })
})

describe('Creating a project', () => {
  it('a newly created project should start as a draft and not be publicly visible', async () => {
    const res = await request(app()).post('/v1/projects').send(draftProjectInput)

    expect(res.status).toBe(201)
    expect(res.body.slug).toBe(draftProjectInput.slug)
    expect(res.body.published).toBe(false)
  })

  it('a draft project should not appear in the public listing until it is published', async () => {
    await createDraft()

    const res = await request(app()).get('/v1/projects')

    expect(
      res.body.items.find((p: { slug: string }) => p.slug === draftProjectInput.slug),
    ).toBeUndefined()
  })
})

describe('Publishing a project', () => {
  it('given an existing draft project, publishing it should make it publicly visible', async () => {
    const draft = await createDraft()

    const res = await request(app()).patch(`/v1/projects/${draft.id}/publish`)

    expect(res.status).toBe(200)
    expect(res.body.published).toBe(true)
  })

  it('given an existing draft project, publishing it should make it appear in the public listing', async () => {
    const draft = await createDraft()
    await request(app()).patch(`/v1/projects/${draft.id}/publish`)

    const res = await request(app()).get('/v1/projects')

    expect(
      res.body.items.find((p: { slug: string }) => p.slug === draftProjectInput.slug),
    ).toBeDefined()
  })
})

describe('Unpublishing a project', () => {
  it('given a published project, unpublishing it should immediately hide it from the public listing', async () => {
    const project = await createPublished()

    await request(app()).patch(`/v1/projects/${project.id}/unpublish`)

    const res = await request(app()).get('/v1/projects')

    expect(res.body.items).toHaveLength(0)
  })

  it('given a published project, unpublishing it should return the project with published set to false', async () => {
    const project = await createPublished()

    const res = await request(app()).patch(`/v1/projects/${project.id}/unpublish`)

    expect(res.status).toBe(200)
    expect(res.body.published).toBe(false)
  })
})

describe('Deleting a project', () => {
  it('given an existing project, deleting it should succeed', async () => {
    const project = await createPublished()

    const res = await request(app()).delete(`/v1/projects/${project.id}`)

    expect(res.status).toBe(204)
  })

  it('given a deleted project, its slug should no longer resolve to any content', async () => {
    const project = await createPublished()
    await request(app()).delete(`/v1/projects/${project.id}`)

    const res = await request(app()).get(`/v1/projects/${publishedProjectInput.slug}`)

    expect(res.status).toBe(404)
  })
})

describe('Restoring a deleted project', () => {
  it('given a deleted project, restoring it should make it accessible by slug again', async () => {
    const project = await createDeleted()

    await request(app()).patch(`/v1/projects/${project.id}/restore`)

    const res = await request(app()).get(`/v1/projects/${deletedProjectInput.slug}`)

    expect(res.status).toBe(200)
    expect(res.body.slug).toBe(deletedProjectInput.slug)
  })

  it('given a deleted project, restoring and publishing it should make it visible in the public listing', async () => {
    const project = await createDeleted()
    await request(app()).patch(`/v1/projects/${project.id}/restore`)
    await request(app()).patch(`/v1/projects/${project.id}/publish`)

    const res = await request(app()).get('/v1/projects')

    expect(
      res.body.items.find((p: { slug: string }) => p.slug === deletedProjectInput.slug),
    ).toBeDefined()
  })
})
