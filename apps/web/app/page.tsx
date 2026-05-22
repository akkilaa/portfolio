import RegularLayout from '@/components/layouts/RegularLayout'
import Hero from '@/components/organisms/Hero'
import Projects from '@/components/organisms/Projects'
import Contact from '@/components/organisms/Contact'

export default function Page() {
  return (
    <RegularLayout>
      <Hero />
      <Projects />
      <Contact />
    </RegularLayout>
  )
}
