import type { Metadata } from 'next'
import './globals.css'
import { inter, display } from '@/lib/fonts'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { NewsletterModal } from '@/components/NewsletterModal'

export const metadata: Metadata = {
  title: { default: 'Tech Events Tunisia', template: '%s · Tech Events Tunisia' },
  description: 'Le calendrier des événements tech en Tunisie. Meetups, conférences, hackathons et workshops.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: { type: 'website', siteName: 'Tech Events Tunisia' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${display.variable}`}>
      <body>
        <ThemeProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <NewsletterModal />
        </ThemeProvider>
      </body>
    </html>
  )
}
