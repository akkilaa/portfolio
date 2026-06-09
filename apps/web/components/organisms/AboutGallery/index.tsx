'use client'
import { LightboxImage } from '@/components/atoms/ImageLightbox'
import SectionHeading from '@/components/molecules/SectionHeading'

const shots = [
  {
    src: 'https://akkila.dev/media/1a/1a782dc13cd9bbd564f6148b5714380941c85f7319465eef12a71302fdb151d2.webp',
    alt: 'My working setup',
    label: '~/me/setup.webp',
  },
  {
    src: 'https://akkila.dev/media/71/714681e50dd574690614f314be1baeee69db971744d143b5ef93b6a1283d264f.webp',
    alt: 'Working remotely',
    label: '~/me/remote.webp',
  },
  {
    src: 'https://akkila.dev/media/59/59ee19d5c3791cf13b67293b72bc003955748744cb1867aa6d251576d185a0b3.webp',
    alt: 'Enjoying a coffee',
    label: '~/me/coffee.webp',
  },
  {
    src: 'https://akkila.dev/media/2c/2ca9e0ac38202605a0e38d5a199886dd358e7a27ad562e126d7514b123b358b9.webp',
    alt: 'Team work',
    label: '~/me/team.webp',
  },
  {
    src: 'https://akkila.dev/media/49/49d2ba51d5e303e4e341c4b27a8f297366ed601abcd12ead3c9f2c1c83068f01.webp',
    alt: 'Working and enjoying',
    label: '~/me/flow.webp',
  },
  {
    src: 'https://akkila.dev/media/be/be3adb8c411f20cbde0f7e1696c6d716894d604d38263e215b35f738b3a52e2f.webp',
    alt: 'Working from the office',
    label: '~/me/office.webp',
  },
]

const AboutGallery = () => (
  <section className="py-16 border-t border-[var(--border)]">
    <SectionHeading num="02" label="OFF THE CLOCK" title="A few moments" />
    <div className="columns-3 gap-3 max-[640px]:columns-2">
      {shots.map(({ src, alt, label }) => (
        <div
          key={src}
          className="break-inside-avoid mb-3 relative border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--surface)] transition-[border-color,transform] duration-200 hover:border-[var(--accent)] hover:-translate-y-0.5"
        >
          <LightboxImage src={src} alt={alt} />
          <span className="absolute bottom-2.5 left-2.5 font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-dim)] bg-[var(--surface)]/80 px-2 py-0.5 rounded-[4px] backdrop-blur-sm">
            {label}
          </span>
        </div>
      ))}
    </div>
  </section>
)

export default AboutGallery
