import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import sharp from 'sharp'
import { composeApp } from '../src/container'
import { MediaService } from '../src/services/media.service'
import { MediaController } from '../src/controllers/media.controller'
import { AskController } from '../src/controllers/ask.controller'
import { RecommendationController } from '../src/controllers/recommendation.controller'
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
import { InMemoryMediaRepository } from './fakes/InMemoryMediaRepository'
import { InMemoryStorage } from './fakes/InMemoryStorage'
import { pngImage, jpegWithExifOrientation, svgImage, notAnImage } from './fixtures/media.fixtures'

let storage: InMemoryStorage
let mediaRepo: InMemoryMediaRepository
let token: string

beforeAll(() => {
  process.env.JWT_SECRET ??= 'test-secret'
  // A real, validly-signed admin token — requireAuth verifies it for real.
  token = jwt.sign({ sub: 'admin-1', role: 'ADMIN' }, process.env.JWT_SECRET)
})

beforeEach(() => {
  storage = new InMemoryStorage()
  mediaRepo = new InMemoryMediaRepository()
})

// The app shares the per-test `storage` / `mediaRepo`, so multiple requests in a
// single test (upload then read) hit the same backing state.
function app() {
  return composeApp({
    posts: new PostsController(new PostsService(new InMemoryPostRepository())),
    projects: new ProjectsController(new ProjectsService(new InMemoryProjectRepository())),
    contact: new ContactController(new ContactService(new InMemoryContactRepository())),
    users: new UsersController(new UsersService(new InMemoryUserRepository())),
    auth: new AuthController(
      new AuthService(new InMemoryUserRepository(), new InMemoryEmailService()),
      {},
      {},
    ),
    media: new MediaController(new MediaService(storage, mediaRepo)),
    ask: new AskController({}),
    recommendations: new RecommendationController({}),
  })
}

function uploadImage(
  buffer: Buffer,
  opts: { filename?: string; contentType?: string; alt?: string } = {},
) {
  const { filename = 'image.png', contentType = 'image/png', alt } = opts
  const req = request(app()).post('/v1/media').set('Cookie', `accessToken=${token}`)
  if (alt !== undefined) req.field('alt', alt)
  return req.attach('file', buffer, { filename, contentType })
}

function keyFromUrl(url: string): string {
  return url.replace('https://test.media/', '')
}

describe('Uploading an image', () => {
  it('given a valid image, it should be stored as webp with dimensions and a blur placeholder', async () => {
    const res = await uploadImage(await pngImage({ width: 400, height: 300 }))

    expect(res.status).toBe(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.mime).toBe('image/webp')
    expect(res.body.width).toBe(400)
    expect(res.body.height).toBe(300)
    expect(res.body.sizeBytes).toBeGreaterThan(0)
    expect(res.body.blurDataUrl).toMatch(/^data:image\/webp;base64,/)
    expect(res.body.url).toContain('.webp')
    expect(storage.objects.size).toBe(1)
  })

  it('given an image larger than the max dimension, it should be downscaled to fit', async () => {
    const res = await uploadImage(await pngImage({ width: 3000, height: 1500 }))

    expect(res.status).toBe(201)
    expect(res.body.width).toBe(2400)
    expect(res.body.height).toBe(1200)
  })

  it('given alt text, it should be persisted on the asset', async () => {
    const res = await uploadImage(await pngImage(), { alt: 'A blue rectangle' })

    expect(res.status).toBe(201)
    expect(res.body.alt).toBe('A blue rectangle')
  })

  it('given the same image twice, it should de-duplicate to one stored object and row', async () => {
    const buffer = await pngImage({ width: 200, height: 200, r: 5, g: 5, b: 5 })

    const first = await uploadImage(buffer)
    const second = await uploadImage(buffer)

    expect(second.status).toBe(201)
    expect(second.body.id).toBe(first.body.id)
    expect(storage.objects.size).toBe(1)
  })
})

describe('Rejecting bad uploads', () => {
  it('given no file in the request, it should be a 400', async () => {
    const res = await request(app()).post('/v1/media').set('Cookie', `accessToken=${token}`)

    expect(res.status).toBe(400)
  })

  it('given a file that is not an image, it should be a 400 and store nothing', async () => {
    const res = await uploadImage(notAnImage, { filename: 'notes.txt', contentType: 'text/plain' })

    expect(res.status).toBe(400)
    expect(storage.objects.size).toBe(0)
  })

  it('given an unsupported image format (SVG), it should be a 400', async () => {
    const res = await uploadImage(svgImage(), {
      filename: 'icon.svg',
      contentType: 'image/svg+xml',
    })

    expect(res.status).toBe(400)
  })
})

describe('Privacy: EXIF stripping and orientation', () => {
  it('given an image with EXIF orientation, the stored bytes are re-oriented and EXIF is removed', async () => {
    const res = await uploadImage(await jpegWithExifOrientation(), {
      filename: 'photo.jpg',
      contentType: 'image/jpeg',
    })

    expect(res.status).toBe(201)
    // 100x200 tagged orientation 6 (90° CW) bakes down to 200x100.
    expect(res.body.width).toBe(200)
    expect(res.body.height).toBe(100)

    const stored = storage.objects.get(keyFromUrl(res.body.url))
    expect(stored).toBeDefined()
    const meta = await sharp(stored!).metadata()
    expect(meta.format).toBe('webp')
    expect(meta.orientation).toBeUndefined()
  })
})

describe('Reading a media asset by id', () => {
  it('given an uploaded asset, fetching it by id should return it', async () => {
    const created = await uploadImage(await pngImage())

    const res = await request(app())
      .get(`/v1/media/${created.body.id}`)
      .set('Cookie', `accessToken=${token}`)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(created.body.id)
    expect(res.body.url).toBe(created.body.url)
  })

  it('given an unknown id, it should be a 404', async () => {
    const res = await request(app())
      .get('/v1/media/does-not-exist')
      .set('Cookie', `accessToken=${token}`)

    expect(res.status).toBe(404)
  })
})

describe('Deleting a media asset', () => {
  it('given an existing asset, deleting it should succeed and remove it from reads', async () => {
    const created = await uploadImage(await pngImage())

    const del = await request(app())
      .delete(`/v1/media/${created.body.id}`)
      .set('Cookie', `accessToken=${token}`)
    expect(del.status).toBe(204)

    const after = await request(app())
      .get(`/v1/media/${created.body.id}`)
      .set('Cookie', `accessToken=${token}`)
    expect(after.status).toBe(404)
  })
})

describe('Authentication', () => {
  it('given no auth cookie, upload should be rejected with 401', async () => {
    const res = await request(app())
      .post('/v1/media')
      .attach('file', await pngImage(), { filename: 'image.png', contentType: 'image/png' })

    expect(res.status).toBe(401)
  })

  it('given an invalid token, upload should be rejected with 401', async () => {
    const res = await request(app())
      .post('/v1/media')
      .set('Cookie', 'accessToken=not-a-real-token')
      .attach('file', await pngImage(), { filename: 'image.png', contentType: 'image/png' })

    expect(res.status).toBe(401)
  })
})
