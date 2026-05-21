import Background from '@/components/organisms/Background'
import TopBar from '@/components/organisms/TopBar'
import Hero from '@/components/organisms/Hero'
import Projects from '@/components/organisms/Projects'
import Contact from '@/components/organisms/Contact'
import Footer from '@/components/organisms/Footer'

export default function Page() {
  return (
    <>
      <Background />
      <TopBar />
      <main className="relative z-[1] max-w-[1200px] mx-auto px-8">
        <Hero />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
