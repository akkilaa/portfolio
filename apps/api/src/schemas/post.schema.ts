import { z } from 'zod'

const slug = z
  .string()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric words separated by hyphens',
  )

export const CreatePostSchema = z.object({
  slug,
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  contentMd: z.string().min(1).max(100_000),
  authorId: z.string().min(1),
  coverImage: z.string().min(1).max(500).optional(),
  tagSlugs: z.array(z.string().min(1).max(100)).max(20).optional(),
})

export const UpdatePostSchema = CreatePostSchema.omit({ authorId: true }).partial()

export type CreatePostInput = z.infer<typeof CreatePostSchema>
export type UpdatePostInput = z.infer<typeof UpdatePostSchema>
