import Link from 'next/link'
import PageHeading from '@/components/organisms/PageHeading'

const ProjectsHero = ({ count }: { count: number }) => (
  <section className="pt-[88px] pb-14 max-[940px]:pt-14 max-[940px]:pb-10">
    <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] mb-[18px] flex items-center gap-2">
      <Link href="/" className="transition-colors duration-150 hover:text-[var(--accent)]">
        ~
      </Link>
      <span className="text-[var(--text-faint)]">/</span>
      <span className="text-[var(--text-bright)]">projects</span>
      <span className="text-[var(--text-faint)]">·</span>
      <span>{count} entries</span>
    </div>
    <PageHeading
      leadingDollar
      title={
        <>
          ls -al <span className="text-[var(--accent)]">~/projects</span>
        </>
      }
      description={
        <>
          A full index of things I&apos;ve built — products, tools, and experiments. Some shipped,
          some abandoned, all instructive.
        </>
      }
    />
  </section>
)

export default ProjectsHero
