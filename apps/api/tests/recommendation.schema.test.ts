import { describe, expect, it } from 'vitest'
import { CreateRecommendationSchema } from '../src/schemas/recommendation.schema'

describe('CreateRecommendationSchema', () => {
  it('accepts a LinkedIn profile URL', () => {
    const result = CreateRecommendationSchema.safeParse({
      comment: 'Worked with Aleksa on a difficult migration and he was excellent.',
      linkedinUrl: 'https://www.linkedin.com/in/example-profile',
    })

    expect(result.success).toBe(true)
  })

  it('rejects non-https LinkedIn URLs', () => {
    const result = CreateRecommendationSchema.safeParse({
      comment: 'Worked with Aleksa on a difficult migration and he was excellent.',
      linkedinUrl: 'http://www.linkedin.com/in/example-profile',
    })

    expect(result.success).toBe(false)
  })

  it('rejects non-LinkedIn URLs', () => {
    const result = CreateRecommendationSchema.safeParse({
      comment: 'Worked with Aleksa on a difficult migration and he was excellent.',
      linkedinUrl: 'https://example.com/in/example-profile',
    })

    expect(result.success).toBe(false)
  })

  it('rejects javascript URLs', () => {
    const result = CreateRecommendationSchema.safeParse({
      comment: 'Worked with Aleksa on a difficult migration and he was excellent.',
      linkedinUrl: 'javascript:alert(1)',
    })

    expect(result.success).toBe(false)
  })
})
