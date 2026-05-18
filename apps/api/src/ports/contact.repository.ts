import type {
  ContactSubmission,
  CreateContactInput,
  Paginated,
  PaginationOpts,
} from '@portfolio/shared'

export interface IContactRepository {
  create(data: CreateContactInput): Promise<ContactSubmission>
  findAll(opts: PaginationOpts): Promise<Paginated<ContactSubmission>>
  findById(id: string): Promise<ContactSubmission | null>
  delete(id: string): Promise<void>
}
