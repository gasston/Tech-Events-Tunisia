import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Mail } from 'lucide-react'
import { getEvents } from '@/lib/api'
import { EventCard } from '@/components/EventCard'
import { EventFilters } from '@/components/EventFilters'
import { Button } from '@/components/ui/Button'
import { NewsletterForm } from '@/components/NewsletterForm'
import type { EventWithStatus } from '@tet/shared'

export const metadata: Metadata = {
  title: 'Tech Events Tunisia — Événements tech en Tunisie',
  description: 'Découvrez les prochains meetups, conférences et workshops tech en Tunisie.',
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const sp = await searchParams
  const filters = { format: sp.format, city: sp.city, category: sp.category, q: sp.q }

  const upcoming = await getEvents({ status: 'upcoming', ...filters, limit: 50 }).catch(() => ({
    events: [], total: 0, page: 1, limit: 50,
  }))
  const past = await getEvents({ status: 'past', ...filters, limit: 8 }).catch(() => ({
    events: [], total: 0, page: 1, limit: 8,
  }))

  const hasFilters = !!(sp.format || sp.city || sp.category || sp.q)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-hot/15 blur-[120px]" />
        <div className="relative mx-auto max-w-content px-6 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-muted">
            <Sparkles size={13} className="text-accent" />
            {upcoming.total} événement{upcoming.total > 1 ? 's' : ''} à venir en Tunisie
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            L'agenda de la{' '}
            <span className="bg-gradient-to-r from-accent to-hot bg-clip-text text-transparent">
              tech tunisienne
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">
            Meetups, conférences, hackathons et workshops. Tous les événements au même endroit —
            trouve le prochain, propose le tien.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/submit">
              <Button size="lg">
                Proposer un événement
                <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#events">
              <Button size="lg" variant="outline">Voir l'agenda</Button>
            </a>
          </div>

          {/* Newsletter capture */}
          <div className="mt-8 max-w-md rounded-lg border border-line bg-surface/60 p-4 backdrop-blur-sm">
            <p className="mb-2.5 flex items-center gap-2 text-[13px] font-medium text-fg">
              <Mail size={14} className="text-accent" />
              Reçois l'agenda tech par email
            </p>
            <NewsletterForm buttonLabel="S'inscrire" />
          </div>
        </div>
      </section>

      <div id="events" className="mx-auto max-w-content px-6 py-10">
        {/* Filters */}
        <div className="mb-8">
          <Suspense fallback={null}>
            <EventFilters />
          </Suspense>
        </div>

        {/* Upcoming */}
        {upcoming.events.length > 0 && (
          <section className="mb-16">
            <SectionTitle label="À venir" count={upcoming.events.length} />
            <EventGrid events={upcoming.events} />
          </section>
        )}

        {/* Past */}
        {past.events.length > 0 && !hasFilters && (
          <section>
            <SectionTitle label="Passés" count={past.events.length} muted />
            <EventGrid events={past.events} />
          </section>
        )}

        {upcoming.events.length === 0 && past.events.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-sm text-muted">Aucun événement trouvé.</p>
            {hasFilters && (
              <Link href="/" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                Effacer les filtres
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionTitle({ label, count, muted }: { label: string; count: number; muted?: boolean }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className={`font-display text-xl font-bold tracking-tight ${muted ? 'text-muted' : 'text-fg'}`}>
        {label}
      </h2>
      <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-[12px] font-semibold text-muted">
        {count}
      </span>
    </div>
  )
}

function EventGrid({ events }: { events: EventWithStatus[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((e) => (
        <EventCard key={e.id} event={e} />
      ))}
    </div>
  )
}
