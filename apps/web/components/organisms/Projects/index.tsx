import ProjectCard, { type ProjectData } from '@/components/organisms/ProjectCard'
import SectionHeading from '@/components/molecules/SectionHeading'

const PROJECTS: ProjectData[] = [
  {
    num: '01',
    title: 'akkila.dev',
    year: '2026',
    role: 'solo · ongoing',
    desc: "A self-hosted fullstack portfolio with magic-link admin, MDX blog, and an embedded local LLM for visitor Q&A. The site you're reading.",
    tags: ['Next.js', 'Postgres', 'Prisma', 'Local LLM'],
    links: [
      { label: 'live', href: 'https://akkila.dev' },
      { label: 'repo', href: 'https://github.com/akkila' },
    ],
    litTags: [3],
  },
  {
    num: '02',
    title: 'lumen-rag',
    year: '2025',
    role: 'open source',
    desc: 'A retrieval-augmented chat layer over your own markdown notes. Streams ≥ 30 tok/s on a single GPU, with prompt-injection guardrails baked in.',
    tags: ['Python', 'pgvector', 'Llama 3', 'FastAPI'],
    links: [
      { label: 'repo', href: '#' },
      { label: 'demo', href: '#' },
    ],
    litTags: [2, 3],
  },
  {
    num: '03',
    title: 'tinytrack',
    year: '2025',
    role: 'client work',
    desc: 'Privacy-first analytics for indie SaaS — < 2KB script, no cookies, plausible-compatible export. Powers ~40k events/day on a $5 VPS.',
    tags: ['TypeScript', 'Express', 'ClickHouse'],
    links: [
      { label: 'live', href: '#' },
      { label: 'case study', href: '#' },
    ],
    litTags: [0],
  },
]

const Projects = () => (
  <section className="relative py-20" id="projects">
    <SectionHeading
      num="02"
      label="FEATURED WORK"
      title="Selected projects"
      aside={
        <>
          ~/projects/featured
          <br />
          <span style={{ color: 'var(--text-faint)' }}>3 of 12 visible</span>
        </>
      }
    />
    <div className="grid grid-cols-3 gap-[18px] max-[940px]:grid-cols-1">
      {PROJECTS.map((p) => (
        <ProjectCard key={p.num} project={p} />
      ))}
    </div>
  </section>
)

export default Projects
