'use client'

import clarity from '@microsoft/clarity'
import { useEffect } from 'react'

export function ClarityScript() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    if (id && process.env.NODE_ENV === 'production') {
      clarity.init(id)
    }
  }, [])

  return null
}
