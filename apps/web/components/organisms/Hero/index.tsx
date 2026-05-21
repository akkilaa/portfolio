import './style.css'
import ChatPanel from '@/components/organisms/ChatPanel'
import HeroIntro from './HeroIntro'

const Hero = () => (
  <section className="pt-[88px] pb-24 relative max-[940px]:pt-14 max-[940px]:pb-16" id="top">
    <div className="grid grid-cols-[1.05fr_1fr] gap-14 items-stretch max-[940px]:grid-cols-1 max-[940px]:gap-8">
      <HeroIntro />
      <ChatPanel />
    </div>
  </section>
)

export default Hero
