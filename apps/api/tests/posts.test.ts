import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { composeApp } from '../src/container'
import { PostsService } from '../src/services/posts.service'
import { PostsController } from '../src//controllers/posts.controller'
import { ProjectsService } from '../src/services/projects.service'
import { ProjectsController } from '../src/controllers/projects.controller'
import { InMemoryPostRepository } from './fakes/InMemoryPostRepository'
import { InMemoryProjectRepository } from './fakes/InMemoryProjectRepository'
import { publishedPostInput, draftPostInput, deletedPostInput } from './fixtures/posts.fixtures'
import type { CreatePostInput } from '@portfolio/shared'

let repo: InMemoryPostRepository

beforeEach(() => {
  repo = new InMemoryPostRepository()
})

function app() {
  return composeApp({
    posts: new PostsController(new PostsService(repo)),
    projects: new ProjectsController(new ProjectsService(new InMemoryProjectRepository())),
  })
}

async function createDraft(input: CreatePostInput = draftPostInput) {
  const res = await request(app()).post('/v1/posts').send(input)
  return res.body
}

async function createPublished(input: CreatePostInput = publishedPostInput) {
  const draft = await createDraft(input)
  await request(app()).patch(`/v1/posts/${draft.id}/publish`)
  return draft
}

async function createDeleted(input: CreatePostInput = deletedPostInput) {
  const draft = await createDraft(input)
  await request(app()).delete(`/v1/posts/${draft.id}`)
  return draft
}

describe('Public post listing', () => {
  it('given published, draft, and deleted posts exist, only the published one should be visible', async () => {
    await createPublished()
    await createDraft()
    await createDeleted()

    const res = await request(app()).get('/v1/posts')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].slug).toBe(publishedPostInput.slug)
  })

  it('given no published posts exist, the listing should be empty with no next page', async () => {
    await createDraft()
    await createDeleted()

    const res = await request(app()).get('/v1/posts')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
    expect(res.body.nextCursor).toBeNull()
  })

  it('given more posts than the requested page size, a cursor to load the next page should be returned', async () => {
    for (const slug of ['post-1', 'post-2', 'post-3']) {
      await createPublished({ ...publishedPostInput, slug })
    }

    const res = await request(app()).get('/v1/posts?limit=2')

    expect(res.body.items).toHaveLength(2)
    expect(res.body.nextCursor).toBe('2')
  })
})

describe('Reading a post by its slug', () => {
  it('given a valid published slug, the full post content should be returned', async () => {
    await createPublished()

    const res = await request(app()).get(`/v1/posts/${publishedPostInput.slug}`)

    expect(res.status).toBe(200)
    expect(res.body.slug).toBe(publishedPostInput.slug)
    expect(res.body.title).toBe(publishedPostInput.title)
  })

  it('given a slug that does not match any post, a not-found response should be returned', async () => {
    const res = await request(app()).get('/v1/posts/non-existent')

    expect(res.status).toBe(404)
  })

  it('given a deleted post, its slug should no longer return any content', async () => {
    await createDeleted()

    const res = await request(app()).get(`/v1/posts/${deletedPostInput.slug}`)

    expect(res.status).toBe(404)
  })
})

describe('Creating a post', () => {
  it('a newly created post should start as a draft with no publication date', async () => {
    const res = await request(app()).post('/v1/posts').send({
      slug: 'new-post',
      title: 'New Post',
      excerpt: 'fresh',
      contentMd: '# New',
      authorId: 'author-1',
    })

    expect(res.status).toBe(201)
    expect(res.body.slug).toBe('new-post')
    expect(res.body.publishedAt).toBeNull()
  })

  it('a draft post should not appear in the public listing until it is published', async () => {
    await request(app()).post('/v1/posts').send({
      slug: 'new-post',
      title: 'New Post',
      excerpt: 'fresh',
      contentMd: '# New',
      authorId: 'author-1',
    })

    const res = await request(app()).get('/v1/posts')

    expect(res.body.items.find((p: { slug: string }) => p.slug === 'new-post')).toBeUndefined()
  })
})

describe('Publishing a post', () => {
  it('given an existing draft post, publishing it should set a publication date', async () => {
    const draft = await createDraft()

    const res = await request(app()).patch(`/v1/posts/${draft.id}/publish`)

    expect(res.status).toBe(200)
    expect(res.body.publishedAt).not.toBeNull()
  })

  it('given an existing draft post, publishing it should make it immediately visible in the public listing', async () => {
    const draft = await createDraft()
    await request(app()).patch(`/v1/posts/${draft.id}/publish`)

    const res = await request(app()).get('/v1/posts')

    expect(
      res.body.items.find((p: { slug: string }) => p.slug === draftPostInput.slug),
    ).toBeDefined()
  })
})

describe('Unpublishing a post', () => {
  it('given an existing published post, unpublishing it should immediately hide it from the public listing', async () => {
    const post = await createPublished()

    await request(app()).patch(`/v1/posts/${post.id}/unpublish`)

    const res = await request(app()).get('/v1/posts')

    expect(res.body.items).toHaveLength(0)
  })
})

describe('Deleting a post', () => {
  it('given an existing published post, deleting it should succeed', async () => {
    const post = await createPublished()

    const del = await request(app()).delete(`/v1/posts/${post.id}`)

    expect(del.status).toBe(204)
  })

  it('given a deleted post, its slug should no longer resolve to any content', async () => {
    const post = await createPublished()
    await request(app()).delete(`/v1/posts/${post.id}`)

    const res = await request(app()).get(`/v1/posts/${publishedPostInput.slug}`)

    expect(res.status).toBe(404)
  })
})
