'use client'
import { useState } from 'react'
import type { EventWithStatus } from '@tet/shared'
import { FORMAT_LABELS } from '@tet/shared'
import { formatDateShort } from '@/lib/utils'
import { publishEvent, rejectEvent, deleteEvent } from '@/lib/api'
import { CheckCircle, XCircle, Trash2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATUS: Record<string, { cls: string; label: string }> = {
  pending:   { cls: 'bg-amber-500/15 text-amber-500', label: 'En attente' },
  published: { cls: 'bg-emerald-500/15 text-emerald-500', label: 'Publié' },
  rejected:  { cls: 'bg-red-500/15 text-red-500', label: 'Rejeté' },
}

export function AdminEventList({ initialEvents }: { initialEvents: EventWithStatus[] }) {
  const [events, setEvents] = useState(initialEvents)
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('all')
  const [loading, setLoading] = useState<string | null>(null)

  async function action(id: string, fn: () => Promise<unknown>, newStatus: string) {
    setLoading(id)
    try {
      await fn()
      setEvents((ev) => ev.map((e) => (e.id === id ? { ...e, moderationStatus: newStatus as any } : e)))
    } finally {
      setLoading(null)
    }
  }
  async function remove(id: string) {
    if (!confirm('Supprimer cet événement ?')) return
    setLoading(id)
    try {
      await deleteEvent(id)
      setEvents((ev) => ev.filter((e) => e.id !== id))
    } finally {
      setLoading(null)
    }
  }

  const filtered = filter === 'all' ? events : events.filter((e) => e.moderationStatus === filter)

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {(['all', 'pending', 'published', 'rejected'] as const).map((s) => {
          const count = s === 'all' ? events.length : events.filter((e) => e.moderationStatus === s).length
          const active = filter === s
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-md border px-3 py-1.5 text-[13px] transition-colors',
                active ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-muted hover:text-fg'
              )}
            >
              {s === 'all' ? 'Tous' : STATUS[s].label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Aucun événement.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-2/50 text-left">
                <th className="px-4 py-2.5 text-[12px] font-semibold text-muted">Événement</th>
                <th className="px-4 py-2.5 text-[12px] font-semibold text-muted">Date</th>
                <th className="px-4 py-2.5 text-[12px] font-semibold text-muted">Statut</th>
                <th className="px-4 py-2.5 text-right text-[12px] font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event, i) => (
                <tr key={event.id} className={i < filtered.length - 1 ? 'border-b border-line' : ''}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-fg">{event.title}</p>
                    <p className="mt-0.5 text-[12px] text-muted">{event.organizer} · {FORMAT_LABELS[event.format]}</p>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted">{formatDateShort(event.startDate)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('rounded-sm px-2 py-0.5 text-[11px] font-semibold', STATUS[event.moderationStatus].cls)}>
                      {STATUS[event.moderationStatus].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {event.moderationStatus !== 'published' && (
                        <button onClick={() => action(event.id, () => publishEvent(event.id), 'published')} disabled={loading === event.id} title="Publier" className="p-1 text-emerald-500 hover:opacity-70">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {event.moderationStatus !== 'rejected' && (
                        <button onClick={() => action(event.id, () => rejectEvent(event.id), 'rejected')} disabled={loading === event.id} title="Rejeter" className="p-1 text-red-500 hover:opacity-70">
                          <XCircle size={16} />
                        </button>
                      )}
                      {event.moderationStatus === 'published' && (
                        <a href={`/events/${event.slug}`} target="_blank" rel="noreferrer" title="Voir" className="p-1 text-accent hover:opacity-70">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button onClick={() => remove(event.id)} disabled={loading === event.id} title="Supprimer" className="p-1 text-muted hover:text-fg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
