import { useEffect } from 'react'

const useMouseBackgroundEffect = () => {
  useEffect(() => {
    let raf: number
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let tx = mx
    let ty = my

    const onMove = (e: PointerEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    const onLeave = () => {
      mx = -9999
      my = -9999
    }
    const tick = () => {
      tx += (mx - tx) * 0.18
      ty += (my - ty) * 0.18
      document.documentElement.style.setProperty('--mx', tx + 'px')
      document.documentElement.style.setProperty('--my', ty + 'px')
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])
}

export default useMouseBackgroundEffect
