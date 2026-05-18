import type { IPostRepository } from '@api/ports/post.repository'
import type {
  CreatePostInput,
  UpdatePostInput,
  PaginationOpts,
  AdminListOpts,
} from '@portfolio/shared'

export class PostsService {
  constructor(private readonly posts: IPostRepository) {}

  getPublished(opts: PaginationOpts & { tag?: string }) {
    return this.posts.findPublished(opts)
  }

  getBySlug(slug: string) {
    return this.posts.findBySlug(slug)
  }

  getAll(opts: AdminListOpts) {
    return this.posts.findAll(opts)
  }

  create(data: CreatePostInput) {
    return this.posts.create(data)
  }

  update(id: string, data: UpdatePostInput) {
    return this.posts.update(id, data)
  }

  publish(id: string) {
    return this.posts.publish(id)
  }

  unpublish(id: string) {
    return this.posts.unpublish(id)
  }

  delete(id: string) {
    return this.posts.delete(id)
  }
}
