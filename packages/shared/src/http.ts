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

export type ProjectsQuery = PaginatedQuery & {
  tag?: string
}

export type AdminProjectsQuery = PaginatedQuery & {
  includeDeleted?: string
}
