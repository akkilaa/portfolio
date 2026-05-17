export type PaginationOpts = {
  limit?: number
  cursor?: string
}

export type Paginated<T> = {
  items: T[]
  nextCursor: string | null
}

export type AdminListOpts = PaginationOpts & {
  includeDeleted?: boolean
}
