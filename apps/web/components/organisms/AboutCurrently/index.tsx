import SectionHeading from '@/components/molecules/SectionHeading'
import NowCard from '@/components/molecules/NowCard'

const CURRENTLY = [
  {
    verb: 'BUILDING',
    what: 'A 7B-model upgrade for the site chat',
    detail: 'Testing whether the quality gain justifies the latency cost.',
  },
  {
    verb: 'READING',
    what: 'Designing Data-Intensive Applications',
    detail: "For the third time. It reads differently once you've felt the pain.",
  },
  {
    verb: 'LEARNING',
    what: 'The internals of llama.cpp',
    detail: 'Quantization, KV-cache, and what actually moves first-token latency.',
  },
]

const AboutCurrently = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="05" label="RIGHT NOW" title="Currently" />
    <div className="grid grid-cols-3 gap-4 max-[760px]:grid-cols-1">
      {CURRENTLY.map((c) => (
        <NowCard key={c.verb} {...c} />
      ))}
    </div>
  </section>
)

export default AboutCurrently
