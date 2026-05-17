import type {
  Post,
  PostWithTags,
  PostSummary,
  CreatePostInput,
  UpdatePostInput,
  Paginated,
  PaginationOpts,
  AdminListOpts,
} from '@portfolio/shared'

export interface IPostRepository {
  findBySlug(slug: string): Promise<PostWithTags | null>
  findById(id: string): Promise<Post | null>
  findPublished(opts: PaginationOpts & { tag?: string }): Promise<Paginated<PostSummary>>
  findAll(opts: AdminListOpts): Promise<Paginated<Post>>
  create(data: CreatePostInput): Promise<Post>
  update(id: string, data: UpdatePostInput): Promise<Post>
  delete(id: string): Promise<void>
  publish(id: string): Promise<Post>
  unpublish(id: string): Promise<Post>
}
