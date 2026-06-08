'use client'

import clarity from '@microsoft/clarity'
import { useEffect } from 'react'

export function ClarityScript() {
  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    console.log('id', id, process.env.NODE_ENV)
    if (id && process.env.NODE_ENV === 'production') {
      console.log('INITILAZED')
      clarity.init(id)
    }
  }, [])

  return null
}
