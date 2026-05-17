import type { Tag, CreateTagInput, UpdateTagInput } from '@portfolio/shared'

export interface ITagRepository {
  findAll(): Promise<Tag[]>
  findBySlug(slug: string): Promise<Tag | null>
  findBySlugs(slugs: string[]): Promise<Tag[]>
  create(data: CreateTagInput): Promise<Tag>
  update(id: string, data: UpdateTagInput): Promise<Tag>
  delete(id: string): Promise<void>
}
