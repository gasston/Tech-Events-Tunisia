import { CATEGORY_COLORS } from '@tet/shared'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('fr-TN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat('fr-TN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(iso))
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat('fr-TN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function formatDateRange(start: string, end?: string | null) {
  const s = new Date(start)
  const e = end ? new Date(end) : null

  if (!e) return `${formatDate(start)} · ${formatTime(start)}`

  const sameDay =
    s.getFullYear() === e.getFullYear() &&
    s.getMonth() === e.getMonth() &&
    s.getDate() === e.getDate()

  if (sameDay) {
    return `${formatDateShort(start)} · ${formatTime(start)} – ${formatTime(end!)}`
  }

  return `${formatDateShort(start)} – ${formatDateShort(end!)} ${s.getFullYear()}`
}

export function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS['Autre']
}

export function getDaysUntil(iso: string): number {
  const now = new Date()
  const target = new Date(iso)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function pluralize(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`
}
