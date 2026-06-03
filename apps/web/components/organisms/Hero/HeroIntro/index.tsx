import Link from 'next/link'
import Blip from '@/components/atoms/Blip'
import Button from '@/components/atoms/Button'
import IconButtonLink from '@/components/atoms/IconButtonLink'
import GithubIcon from '@/components/atoms/GithubIcon'
import LinkedinIcon from '@/components/atoms/LinkedinIcon'
import MailIcon from '@/components/atoms/MailIcon'
import PageHeading from '@/components/organisms/PageHeading'
import { countYearsUntilToday } from '@/utils/dateUtils'

const HeroIntro = () => (
  <div>
    <div className="inline-flex items-center gap-2.5 font-[family-name:var(--font-mono)] text-[12px] tracking-[0.04em] text-[var(--text-dim)] py-1.5 px-3 border border-[var(--border)] rounded-full bg-[var(--surface)] mb-7 whitespace-nowrap">
      <Blip />
      <span>AVAILABLE · open to roles &amp; freelance</span>
    </div>
    <PageHeading
      leadingDollar
      title={
        <>
          hi, I&apos;m <span className="text-[var(--accent)]">Aleksa</span>
        </>
      }
      middle="Full-Stack Developer | AI Engineer | Belgrade ↔ Remote"
      description={
        <>
          I build and ship{' '}
          <em className="text-[var(--accent)] not-italic">production software end-to-end</em>, web
          and mobile: real-time trading dashboards, React Native apps in the stores, the design
          systems beneath them. In{' '}
          <em className="text-[var(--accent)] not-italic">
            {countYearsUntilToday('2019-02-01')} years
          </em>{' '}
          I&apos;ve gone from frontend to full-stack, and lately I&apos;ve been wiring{' '}
          <em className="text-[var(--accent)] not-italic">local LLMs</em> into real product
          surfaces. <em className="text-[var(--accent)] not-italic">akkila.dev</em>, the site
          you&apos;re reading, is the latest.
        </>
      }
    />
    <div className="flex flex-wrap gap-3 items-center">
      <Button as={Link} href="#contact" variant="primary">
        get in touch
      </Button>
      <Button as={Link} href="#projects">
        ls projects/
      </Button>
      <div className="ml-auto flex gap-2">
        <IconButtonLink
          href="https://github.com/akkilaa"
          icon={<GithubIcon />}
          label="GitHub"
          external
        />
        <IconButtonLink
          href="https://www.linkedin.com/in/aleksa-janjic"
          icon={<LinkedinIcon />}
          label="LinkedIn"
          external
        />
        <IconButtonLink href="mailto:hello@akkila.dev" icon={<MailIcon />} label="Email" />
      </div>
    </div>
  </div>
)

export default HeroIntro
