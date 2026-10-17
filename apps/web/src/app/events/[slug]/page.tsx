import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Globe, Calendar, Users, Eye, ExternalLink, ChevronLeft, Ticket } from 'lucide-react'
import { getEvent } from '@/lib/api'
import { FORMAT_LABELS } from '@tet/shared'
import { formatDateRange } from '@/lib/utils'
import { CountdownTimer } from '@/components/CountdownTimer'
import { EventMap } from '@/components/EventMap'
import { CategoryBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AddToCalendar } from '@/components/AddToCalendar'
import { DefaultCover } from '@/components/DefaultCover'
import { ViewTracker } from './ViewTracker'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const event = await getEvent(slug)
    return {
      title: event.title,
      description: event.description.slice(0, 160),
      openGraph: {
        title: event.title,
        description: event.description.slice(0, 160),
        images: event.coverImage ? [{ url: event.coverImage }] : [],
        type: 'website',
      },
    }
  } catch {
    return { title: 'Événement introuvable' }
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  let event
  try {
    event = await getEvent(slug)
  } catch {
    notFound()
  }

  const isPast = event.temporalStatus === 'past'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      event.format === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : event.format === 'hybrid'
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.latitude
      ? {
          '@type': 'Place',
          name: event.address || event.city,
          address: event.address || event.city,
          geo: { '@type': 'GeoCoordinates', latitude: event.latitude, longitude: event.longitude },
        }
      : { '@type': 'VirtualLocation', url: event.onlineUrl },
    organizer: { '@type': 'Organization', name: event.organizer },
    offers: {
      '@type': 'Offer',
      price: event.isFree ? '0' : event.price,
      priceCurrency: 'TND',
      availability: 'https://schema.org/InStock',
      url: event.registrationUrl,
    },
    image: event.coverImage,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ViewTracker eventId={event.id} />

      {/* Hero banner */}
      <div className="relative h-64 w-full overflow-hidden border-b border-line sm:h-80">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className={`h-full w-full object-cover ${isPast ? 'grayscale' : ''}`} />
        ) : (
          <DefaultCover category={event.categories[0]} size="hero" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
      </div>

      <div className="mx-auto -mt-24 max-w-content px-6 pb-32">
        <Link href="/" className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg">
          <ChevronLeft size={14} />
          Retour à l'agenda
        </Link>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_340px]">
          {/* Main */}
          <div className="animate-fade-up">
            <div className="mb-4 flex flex-wrap gap-1.5">
              {event.categories.map((c) => <CategoryBadge key={c} category={c} />)}
              <span className="inline-flex items-center rounded-sm bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted">
                {FORMAT_LABELS[event.format]}
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {event.title}
            </h1>

            {!isPast && (
              <div className="mt-6">
                <CountdownTimer startDate={event.startDate} endDate={event.endDate} />
              </div>
            )}

            <div className="mt-8 whitespace-pre-wrap text-[15px] leading-relaxed text-fg/90">
              {event.description}
            </div>

            {event.latitude && event.longitude && (
              <div className="mt-10">
                <h3 className="mb-3 font-display text-lg font-bold tracking-tight">Localisation</h3>
                <EventMap lat={event.latitude} lng={event.longitude} label={event.address || event.title} />
                {event.address && (
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
                    <MapPin size={13} />
                    {event.address}{event.city ? `, ${event.city}` : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="animate-fade-up lg:sticky lg:top-20">
            <div className="rounded-lg border border-line bg-surface p-5">
              <InfoRow icon={<Calendar size={15} />} label="Date">
                {formatDateRange(event.startDate, event.endDate)}
              </InfoRow>
              {event.city && (
                <InfoRow icon={<MapPin size={15} />} label="Lieu">
                  {event.address ? `${event.address}, ${event.city}` : event.city}
                </InfoRow>
              )}
              {event.format === 'online' && event.onlineUrl && (
                <InfoRow icon={<Globe size={15} />} label="Accès">
                  <a href={event.onlineUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    Lien en ligne
                  </a>
                </InfoRow>
              )}
              <InfoRow icon={<Users size={15} />} label="Public">
                {event.targetAudience.join(', ') || '—'}
              </InfoRow>
              <InfoRow icon={<Eye size={15} />} label="Vues">{event.views}</InfoRow>

              <div className="my-4 border-t border-line" />

              <div className="mb-1 text-[12px] text-muted">Organisé par</div>
              <div className="font-display text-base font-bold">{event.organizer}</div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold">
                  {event.isFree ? 'Gratuit' : event.price ? `${event.price} TND` : 'Payant'}
                </span>
              </div>

              {event.registrationUrl && (
                <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="mt-4 block">
                  <Button size="lg" className="w-full">
                    <Ticket size={16} />
                    S'inscrire
                  </Button>
                </a>
              )}
              {event.websiteUrl && (
                <a href={event.websiteUrl} target="_blank" rel="noreferrer" className="mt-2 block">
                  <Button size="lg" variant="outline" className="w-full">
                    Site officiel
                    <ExternalLink size={14} />
                  </Button>
                </a>
              )}

              <div className="mt-2">
                <AddToCalendar
                  title={event.title}
                  description={event.description}
                  location={event.address ? `${event.address}${event.city ? ', ' + event.city : ''}` : event.city || ''}
                  startDate={event.startDate}
                  endDate={event.endDate}
                  url={`${process.env.NEXT_PUBLIC_APP_URL || ''}/events/${event.slug}`}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky mobile CTA (Shotgun-style) */}
      {event.registrationUrl && !isPast && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-content items-center justify-between gap-3">
            <div>
              <div className="font-display text-base font-bold leading-none">
                {event.isFree ? 'Gratuit' : event.price ? `${event.price} TND` : 'Payant'}
              </div>
              <div className="mt-1 text-[12px] text-muted">{event.organizer}</div>
            </div>
            <a href={event.registrationUrl} target="_blank" rel="noreferrer">
              <Button size="lg">
                <Ticket size={16} />
                S'inscrire
              </Button>
            </a>
          </div>
        </div>
      )}
    </>
  )
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-muted">{icon}</span>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted">{label}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-fg">{children}</p>
      </div>
    </div>
  )
}
