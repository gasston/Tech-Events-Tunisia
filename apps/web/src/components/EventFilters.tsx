'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Search, X } from 'lucide-react'
import { CATEGORIES, CITIES } from '@tet/shared'

const selectCls =
  'h-9 rounded-md border border-line bg-surface px-3 text-[13px] text-fg outline-none transition-colors hover:border-accent/50 focus:border-accent cursor-pointer appearance-none'

export function EventFilters() {
  const router = useRouter()
  const params = useSearchParams()
  const [, startTransition] = useTransition()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    startTransition(() => router.push(`/?${next.toString()}#events`))
  }

  const hasFilters = params.has('q') || params.has('format') || params.has('city') || params.has('category') || params.has('status')

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Rechercher…"
          defaultValue={params.get('q') || ''}
          onChange={(e) => update('q', e.target.value)}
          className="h-9 w-48 rounded-md border border-line bg-surface pl-9 pr-3 text-[13px] text-fg outline-none transition-colors placeholder:text-muted hover:border-accent/50 focus:border-accent"
        />
      </div>

      <select value={params.get('format') || ''} onChange={(e) => update('format', e.target.value)} className={selectCls}>
        <option value="">Tous formats</option>
        <option value="onsite">Présentiel</option>
        <option value="online">En ligne</option>
        <option value="hybrid">Hybride</option>
      </select>

      <select value={params.get('city') || ''} onChange={(e) => update('city', e.target.value)} className={selectCls}>
        <option value="">Toutes villes</option>
        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={params.get('category') || ''} onChange={(e) => update('category', e.target.value)} className={selectCls}>
        <option value="">Toutes catégories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={params.get('status') || ''} onChange={(e) => update('status', e.target.value)} className={selectCls}>
        <option value="">À venir + passés</option>
        <option value="upcoming">À venir</option>
        <option value="past">Passés</option>
      </select>

      {hasFilters && (
        <button
          onClick={() => startTransition(() => router.push('/#events'))}
          className="flex h-9 items-center gap-1 rounded-md px-3 text-[13px] text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <X size={13} />
          Effacer
        </button>
      )}
    </div>
  )
}
