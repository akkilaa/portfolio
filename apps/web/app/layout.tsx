import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { SITE_META, personJsonLd } from '@/lib/site'
import { ClarityScript } from '@/components/atoms/clarity'
import { GoogleAnalytics } from '@/components/atoms/google-analytics'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = SITE_META

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${geist.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <ClarityScript />
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
