'use client'
import { useState, useEffect } from 'react'

interface Props {
  startDate: string
  endDate?: string | null
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  }
}

export function CountdownTimer({ startDate, endDate }: Props) {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(start))
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(start))
      setNow(new Date())
    }, 1000)
    return () => clearInterval(id)
  }, [startDate])

  if (now >= start && (!end || now <= end)) {
    return (
      <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-500">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        En cours
      </div>
    )
  }

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center rounded-md bg-surface-2 px-4 py-2 text-sm text-muted">
        Événement terminé
      </div>
    )
  }

  const parts: { label: string; value: number }[] = []
  if (timeLeft.d > 0) parts.push({ label: 'jours', value: timeLeft.d })
  if (timeLeft.d < 7) {
    parts.push({ label: 'h', value: timeLeft.h }, { label: 'min', value: timeLeft.m })
    if (timeLeft.d === 0) parts.push({ label: 'sec', value: timeLeft.s })
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 p-2">
      {parts.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-accent/40">:</span>}
          <div className="flex flex-col items-center px-1.5">
            <span className="font-display text-2xl font-bold tabular-nums leading-none text-fg">
              {String(value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-wider text-muted">{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
