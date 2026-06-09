import SectionHeading from '@/components/molecules/SectionHeading'
import { SITE_AUTHOR } from '@/lib/site'

const SOCIALS = [
  {
    href: SITE_AUTHOR.github,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.05.78 2.13v3.16c0 .31.21.68.79.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
    label: 'github',
    meta: '/akkila',
    external: true,
  },
  {
    href: SITE_AUTHOR.linkedin,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5C.02 2.12 1.13 1 2.5 1S4.98 2.12 4.98 3.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.45h-4.56v-6.61c0-1.58-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.72V8z" />
      </svg>
    ),
    label: 'linkedin',
    meta: '/in/akkila',
    external: true,
  },
  {
    href: `mailto:${SITE_AUTHOR.email}`,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    label: 'email',
    meta: SITE_AUTHOR.email,
    external: false,
  },
  {
    href: '/#contact',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    label: 'contact form',
    meta: '→ reply < 24h',
    external: false,
  },
]

const AboutSocials = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="06" label="ELSEWHERE" title="Find me" />
    <div className="flex flex-wrap gap-3">
      {SOCIALS.map(({ href, icon, label, meta, external }) => (
        <a
          key={label}
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group inline-flex items-center gap-2.5 px-[18px] py-[13px] border border-[var(--border-strong)] rounded-[10px] bg-[var(--surface)] font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-bright)] transition-[border-color,color,transform] duration-[180ms] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:-translate-y-0.5"
        >
          {icon}
          <span>{label}</span>
          <span className="text-[var(--text-dim)] transition-colors duration-[180ms] group-hover:text-[var(--accent)]">
            {meta}
          </span>
        </a>
      ))}
    </div>
  </section>
)

export default AboutSocials
