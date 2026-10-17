import Link from 'next/link'
import { MapPin, Globe, Eye, CalendarDays } from 'lucide-react'
import type { EventWithStatus } from '@tet/shared'
import { FORMAT_LABELS } from '@tet/shared'
import { formatDateShort, formatTime, getDaysUntil } from '@/lib/utils'
import { CategoryBadge } from '@/components/ui/Badge'
import { DefaultCover } from '@/components/DefaultCover'

export function EventCard({ event }: { event: EventWithStatus }) {
  const days = getDaysUntil(event.startDate)
  const isOngoing = event.temporalStatus === 'ongoing'
  const isPast = event.temporalStatus === 'past'

  const countdown = isOngoing
    ? 'En cours'
    : isPast
    ? 'Terminé'
    : days === 0
    ? "Aujourd'hui"
    : days === 1
    ? 'Demain'
    : `J-${days}`

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-line bg-surface transition-all duration-200 group-hover:-translate-y-1 group-hover:border-accent/40 group-hover:shadow-lift">
        {/* Visual */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04] ${isPast ? 'opacity-50 grayscale' : ''}`}
            />
          ) : (
            <DefaultCover category={event.categories[0]} />
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Date pill */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            <CalendarDays size={12} />
            {formatDateShort(event.startDate)} · {formatTime(event.startDate)}
          </div>

          {/* Countdown pill */}
          <div
            className={`absolute right-3 top-3 rounded-md px-2 py-1 text-[11px] font-bold backdrop-blur-sm ${
              isOngoing
                ? 'bg-emerald-500 text-white'
                : isPast
                ? 'bg-black/60 text-white/70'
                : days <= 1
                ? 'bg-hot text-white'
                : 'bg-accent text-accent-fg'
            }`}
          >
            {countdown}
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {event.categories.slice(0, 2).map((c) => (
              <CategoryBadge key={c} category={c} />
            ))}
            <span className="inline-flex items-center rounded-sm bg-surface-2 px-2 py-0.5 text-[11px] font-semibold text-muted">
              {FORMAT_LABELS[event.format]}
            </span>
          </div>

          <h3 className="font-display text-[17px] font-bold leading-snug tracking-tight text-fg">
            {event.title}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-[13px] text-muted">
            {event.format === 'online' && !event.city ? (
              <><Globe size={13} /> En ligne</>
            ) : (
              <><MapPin size={13} /> {event.address || event.city || '—'}</>
            )}
          </p>

          <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
            <span className="truncate text-[12px] text-muted">
              par <span className="font-medium text-fg">{event.organizer}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[12px] text-muted">
              <Eye size={13} />
              {event.views}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
