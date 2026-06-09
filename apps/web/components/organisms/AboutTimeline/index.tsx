import SectionHeading from '@/components/molecules/SectionHeading'
import TimelineRow from '@/components/molecules/TimelineRow'

const TIMELINE = [
  {
    when: '2026',
    title: 'Building akkila.dev',
    body: 'Designing and shipping this self-hosted portfolio: full-stack TypeScript, a local LLM wired in as a showcase, and an admin panel I can update from my phone. Back to working across the whole stack after years in frontend.',
  },
  {
    when: '2023',
    title: 'Across product teams',
    body: 'Grew into harder problems across Skylead, 8Entity, and Thrust.com, owning features end to end and proving I could carry the parts of a product nobody else wanted to touch.',
  },
  {
    when: '2020',
    title: 'Found my home in frontend',
    body: 'Moved to Kortechs and stepped into frontend, where I spent most of my career. Learned that the interface is where the engineering actually meets the person using it.',
  },
  {
    when: '2019',
    title: 'First professional role',
    body: 'Started as a backend developer at Avokado, my first job out of the gate. Real systems, real users, real consequences for getting it wrong.',
  },
  {
    when: '2017',
    title: 'First lines of real code',
    body: 'Built a C# app for a travel agency in high school, mapping apartment reservations pixel by pixel. The code was messy, but it worked, people used it, and that was the moment I was hooked.',
  },
]

const AboutTimeline = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="03" label="HOW I GOT HERE" title="The short timeline" />
    <div>
      {TIMELINE.map((t) => (
        <TimelineRow key={t.when} {...t} />
      ))}
    </div>
  </section>
)

export default AboutTimeline
