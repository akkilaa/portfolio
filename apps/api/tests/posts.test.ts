import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { composeApp } from '../src/container'
import { PostsService } from '../src/services/posts.service'
import { PostsController } from '../src//controllers/posts.controller'
import { InMemoryPostRepository } from './fakes/InMemoryPostRepository'
import { publishedPost, draftPost, deletedPost } from './fixtures/posts.fixtures'

let repo: InMemoryPostRepository

beforeEach(() => {
  repo = new InMemoryPostRepository()
})

function app() {
  return composeApp({ posts: new PostsController(new PostsService(repo)) })
}

describe('GET /v1/posts', () => {
  it('returns only published posts', async () => {
    repo.seed([publishedPost, draftPost, deletedPost])

    const res = await request(app()).get('/v1/posts')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].slug).toBe(publishedPost.slug)
  })

  it('returns empty list when no posts are published', async () => {
    repo.seed([draftPost, deletedPost])

    const res = await request(app()).get('/v1/posts')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(0)
    expect(res.body.nextCursor).toBeNull()
  })

  it('paginates with limit and returns nextCursor', async () => {
    repo.seed([
      { ...publishedPost, id: '1', slug: 'post-1' },
      { ...publishedPost, id: '2', slug: 'post-2' },
      { ...publishedPost, id: '3', slug: 'post-3' },
    ])

    const res = await request(app()).get('/v1/posts?limit=2')

    expect(res.body.items).toHaveLength(2)
    expect(res.body.nextCursor).toBe('2')
  })
})

describe('GET /v1/posts/:slug', () => {
  it('returns a published post by slug', async () => {
    repo.seed([publishedPost])

    const res = await request(app()).get(`/v1/posts/${publishedPost.slug}`)

    expect(res.status).toBe(200)
    expect(res.body.slug).toBe(publishedPost.slug)
    expect(res.body.title).toBe(publishedPost.title)
  })

  it('returns 404 for a slug that does not exist', async () => {
    const res = await request(app()).get('/v1/posts/non-existent')

    expect(res.status).toBe(404)
  })

  it('returns 404 for a deleted post', async () => {
    repo.seed([deletedPost])

    const res = await request(app()).get(`/v1/posts/${deletedPost.slug}`)

    expect(res.status).toBe(404)
  })
})

describe('POST /v1/posts', () => {
  it('creates a post in draft state', async () => {
    const res = await request(app())
      .post('/v1/posts')
      .send({
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

  it('created post does not appear in public listing until published', async () => {
    await request(app())
      .post('/v1/posts')
      .send({
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

describe('PATCH /v1/posts/:id/publish', () => {
  it('publishes a draft post', async () => {
    repo.seed([draftPost])

    const res = await request(app()).patch(`/v1/posts/${draftPost.id}/publish`)

    expect(res.status).toBe(200)
    expect(res.body.publishedAt).not.toBeNull()
  })

  it('published post appears in public listing', async () => {
    repo.seed([draftPost])
    await request(app()).patch(`/v1/posts/${draftPost.id}/publish`)

    const res = await request(app()).get('/v1/posts')

    expect(res.body.items.find((p: { slug: string }) => p.slug === draftPost.slug)).toBeDefined()
  })
})

describe('PATCH /v1/posts/:id/unpublish', () => {
  it('hides a published post from public listing', async () => {
    repo.seed([publishedPost])
    await request(app()).patch(`/v1/posts/${publishedPost.id}/unpublish`)

    const res = await request(app()).get('/v1/posts')

    expect(res.body.items).toHaveLength(0)
  })
})

describe('DELETE /v1/posts/:id', () => {
  it('soft deletes a post', async () => {
    repo.seed([publishedPost])

    const del = await request(app()).delete(`/v1/posts/${publishedPost.id}`)

    expect(del.status).toBe(204)
  })

  it('deleted post no longer accessible by slug', async () => {
    repo.seed([publishedPost])
    await request(app()).delete(`/v1/posts/${publishedPost.id}`)

    const res = await request(app()).get(`/v1/posts/${publishedPost.slug}`)

    expect(res.status).toBe(404)
  })
})
