export type Tag = {
  id: string
  slug: string
  label: string
  color: string | null
}

export type CreateTagInput = {
  slug: string
  label: string
  color?: string
}

export type UpdateTagInput = Partial<CreateTagInput>
