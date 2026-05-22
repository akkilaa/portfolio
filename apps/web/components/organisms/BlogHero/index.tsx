import Link from 'next/link'
import PageHeading from '@/components/organisms/PageHeading'

const BlogHero = ({ count }: { count: number }) => (
  <section className="pt-[88px] pb-14 max-[940px]:pt-14 max-[940px]:pb-10">
    <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] mb-[18px] flex items-center gap-2">
      <Link href="/" className="transition-colors duration-150 hover:text-[var(--accent)]">
        ~
      </Link>
      <span className="text-[var(--text-faint)]">/</span>
      <span className="text-[var(--text-bright)]">blog</span>
      <span className="text-[var(--text-faint)]">·</span>
      <span>{count} entries</span>
    </div>
    <PageHeading
      leadingDollar
      title={
        <>
          cat <span className="text-[var(--accent)]">~/notes</span>
        </>
      }
      description={
        <>
          Field notes from building products end-to-end - fullstack TypeScript, self-hosted infra,
          and the occasional foray into local LLM inference. Mostly things I wish I&apos;d known six
          months ago.
        </>
      }
    />
  </section>
)

export default BlogHero
