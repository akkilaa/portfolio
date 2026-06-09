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
  slugExists(slug: string): Promise<boolean>
  findById(id: string): Promise<Post | null>
  findPublished(opts: PaginationOpts & { tag?: string }): Promise<Paginated<PostSummary>>
  findAll(opts: AdminListOpts): Promise<Paginated<PostWithTags>>
  create(data: CreatePostInput): Promise<PostWithTags>
  update(id: string, data: UpdatePostInput): Promise<PostWithTags>
  delete(id: string): Promise<void>
  publish(id: string): Promise<PostWithTags>
  unpublish(id: string): Promise<PostWithTags>
}
