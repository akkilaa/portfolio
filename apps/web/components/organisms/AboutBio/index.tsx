import SectionHeading from '@/components/molecules/SectionHeading'

const AboutBio = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="01" label="THE LONGER VERSION" title="A bit about me" />
    <div className="columns-2 gap-10 max-[760px]:columns-1">
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-[1.1em] text-wrap-pretty break-inside-avoid first-letter:text-[var(--accent)] first-letter:font-[family-name:var(--font-mono)] first-letter:text-[2em] first-letter:font-semibold first-letter:float-left first-letter:leading-[0.8] first-letter:mr-1 first-letter:mt-1">
        I&apos;m a fullstack developer and AI engineer based in Belgrade. My path into software
        started back in high school, around 2017, when I built a{' '}
        <strong className="text-[var(--text-bright)] font-semibold">C#</strong>&nbsp;application for
        a travel agency. It let them store client details, organize and schedule their clients&apos;
        vacations, and even draw apartment reservation maps pixel by pixel. The code was messy, with
        functions that ran for hundreds of lines, but it worked, and real bookings were being made
        through it. That was the moment something clicked for me: the thing I wrote had come to
        life, and people were actually using it. That feeling was unbelievable, and it&apos;s still
        what drives me today.
      </p>
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-[1.1em] text-wrap-pretty break-inside-avoid">
        I studied Computer Science at the School of Electrical and Computer Engineering, where I
        learned just how much the fundamentals matter. Algorithms, data structures, and the
        reasoning behind them are the part that never goes out of style. Frameworks and tools change
        every year, but understanding why things work the way they do is what lets you choose the
        right approach instead of guessing, and it&apos;s what makes debugging the hard problems
        possible. My professional journey began in 2019 at a Serbian company called Avokado, where I
        worked as a backend developer. From there I moved to Kortechs and stepped into frontend,
        followed by Skylead, 8Entity, and most recently Thrust.com, where I kept growing and proving
        my expertise. Recently I came back to my roots and now work across the whole stack.
      </p>
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-[1.1em] text-wrap-pretty break-inside-avoid">
        Lately I&apos;ve been focused on staying current with where the industry is heading,
        spending a lot of time experimenting with large language models and finding practical ways
        to put them to use. This portfolio is part of that: I treat it as a playground to showcase
        what these models can do once they&apos;re wired into a real product.
      </p>
      <p className="text-[15px] leading-[1.7] text-[var(--text)] mt-0 mb-0 text-wrap-pretty break-inside-avoid">
        When I&apos;m away from the keyboard, I&apos;m usually working with my hands. I&apos;m
        restoring a 1986 Mercedes 190E, and I built most of what fills my flat myself, from the
        kitchen to the wardrobes. I also love getting out on the river with my boat. And last but
        not least, I&apos;m completely addicted to sunsets.
      </p>
    </div>
  </section>
)

export default AboutBio
