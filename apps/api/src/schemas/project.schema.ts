import { z } from 'zod'

const slug = z
  .string()
  .min(1)
  .max(100)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must be lowercase alphanumeric words separated by hyphens',
  )

const safeUrl = z.url()

export const CreateProjectSchema = z.object({
  slug,
  title: z.string().min(1).max(200),
  descriptionMd: z.string().min(1).max(100_000),
  shortDescription: z.string().min(1).max(500),
  tagline: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  startedAt: z.iso.datetime().optional(),
  endedAt: z.iso.datetime().optional(),
  liveUrl: safeUrl.optional(),
  repoUrl: safeUrl.optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).optional(),
  tagSlugs: z.array(z.string().min(1).max(100)).max(20).optional(),
})

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
  liveUrl: safeUrl.nullish(),
  repoUrl: safeUrl.nullish(),
  endedAt: z.iso.datetime().nullish(),
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
