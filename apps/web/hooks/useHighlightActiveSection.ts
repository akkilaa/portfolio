import { useEffect, useState } from 'react'

const useHighlightActiveSection = (ids: string[], initialId?: string) => {
  const [active, setActive] = useState(initialId ?? ids[0] ?? '')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      )
      observer.observe(el)
      observers.push(observer)
    })

    // When scrolled to the bottom, the last section heading can never reach the
    // active zone — activate the last item explicitly in that case.
    const handleScroll = () => {
      const lastId = ids[ids.length - 1]
      if (!lastId) return
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) setActive(lastId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observers.forEach((o) => o.disconnect())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [ids])

  return active
}

export default useHighlightActiveSection
