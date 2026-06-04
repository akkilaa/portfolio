import { z } from 'zod'

export const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  message: z.string().min(1).max(2000),
})

export type ContactInput = z.infer<typeof ContactSchema>
