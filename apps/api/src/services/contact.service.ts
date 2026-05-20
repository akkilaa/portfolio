import type { IContactRepository } from '@api/ports/contact.repository'
import type { CreateContactInput, PaginationOpts } from '@portfolio/shared'

export class ContactService {
  constructor(private readonly contact: IContactRepository) {}

  submit(data: CreateContactInput) {
    return this.contact.create(data)
  }

  getAll(opts: PaginationOpts) {
    return this.contact.findAll(opts)
  }

  delete(id: string) {
    return this.contact.delete(id)
  }
}
