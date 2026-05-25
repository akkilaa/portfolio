import Link from 'next/link'
import PageHeading from '@/components/organisms/PageHeading'

const RecommendationsHero = ({ count }: { count: number }) => (
  <section className="pt-[88px] pb-14 max-[940px]:pt-14 max-[940px]:pb-10">
    <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] mb-[18px] flex items-center gap-2">
      <Link href="/" className="transition-colors duration-150 hover:text-[var(--accent)]">
        ~
      </Link>
      <span className="text-[var(--text-faint)]">/</span>
      <span className="text-[var(--text-bright)]">recommendations</span>
      <span className="text-[var(--text-faint)]">·</span>
      <span>{count} entries</span>
    </div>
    <PageHeading
      leadingDollar
      title={
        <>
          cat <span className="text-[var(--accent)]">~/references</span>
        </>
      }
      description={
        <>
          Real people, real words. Everyone here is a verified GitHub or LinkedIn contact I&apos;ve
          worked alongside, collaborated with, or shipped something together.
        </>
      }
    />
  </section>
)

export default RecommendationsHero
