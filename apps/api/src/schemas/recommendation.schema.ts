import { z } from 'zod'

const linkedinProfileUrl = z.url().refine((value) => {
  const url = new URL(value)
  const isLinkedInHost = url.hostname === 'linkedin.com' || url.hostname === 'www.linkedin.com'
  const isProfilePath = /^\/(in|pub)\/.+/.test(url.pathname)

  return url.protocol === 'https:' && isLinkedInHost && isProfilePath
}, 'LinkedIn profile URL must be an https://linkedin.com/in/... or https://linkedin.com/pub/... URL')

export const CreateRecommendationSchema = z.object({
  comment: z.string().min(1).max(1000),
  linkedinUrl: linkedinProfileUrl.optional(),
})

export type CreateRecommendationInput = z.infer<typeof CreateRecommendationSchema>
