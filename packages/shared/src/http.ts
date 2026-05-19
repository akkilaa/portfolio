export type PaginatedQuery = {
  cursor?: string
  limit?: string
}

export type PostsQuery = PaginatedQuery & {
  tag?: string
}

export type AdminPostsQuery = PaginatedQuery & {
  includeDeleted?: string
}
