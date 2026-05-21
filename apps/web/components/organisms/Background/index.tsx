'use client'

import './style.css'
import useMouseBackgroundEffect from '@/hooks/useMouseBackgroundEffect'

const Background = () => {
  useMouseBackgroundEffect()

  return (
    <>
      <div className="bg-layer bg-grid" />
      <div className="bg-layer bg-dots-base" />
      <div className="bg-layer bg-dots-torch" />
      <div className="bg-layer bg-vignette" />
    </>
  )
}

export default Background
