import Background from '@/components/organisms/Background'
import TopBar from '@/components/organisms/TopBar'
import Footer from '@/components/organisms/Footer'

const RegularLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Background />
    <TopBar />
    <main className="relative z-[1] max-w-[1200px] mx-auto px-8">{children}</main>
    <Footer />
  </>
)

export default RegularLayout
