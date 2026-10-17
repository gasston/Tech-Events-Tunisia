import type { EventWithStatus } from '@tet/shared'

const BASE = process.env.NEXT_PUBLIC_APP_URL
  ? '' // relative calls work in browser
  : '' // SSR via Next.js rewrites also relative

// In Next.js, all fetch calls from server components go through the rewrite proxy
// so we always use relative paths — Next.js resolves them internally.
// For true server-side absolute base, use getServerBase().
function getBase() {
  if (typeof window === 'undefined') {
    // Server-side: need absolute URL
    return process.env.API_URL || 'http://localhost:3001'
  }
  return '' // browser: use relative /api/*
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const base = getBase()
  const url = base ? `${base}${path}` : path
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    cache: 'no-store',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export interface EventsResponse {
  events: EventWithStatus[]
  total: number
  page: number
  limit: number
}

export interface EventFilters {
  format?: string
  city?: string
  category?: string
  audience?: string
  status?: 'upcoming' | 'past'
  q?: string
  page?: number
  limit?: number
}

export function buildQuery(filters: EventFilters) {
  const p = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== '') p.set(k, String(v))
  })
  return p.toString() ? `?${p.toString()}` : ''
}

export async function getEvents(filters: EventFilters = {}): Promise<EventsResponse> {
  return apiFetch(`/api/events${buildQuery(filters)}`)
}

export async function getEvent(slug: string): Promise<EventWithStatus> {
  return apiFetch(`/api/events/${slug}`)
}

export async function submitEvent(data: unknown) {
  return apiFetch('/api/events', { method: 'POST', body: JSON.stringify(data) })
}

export async function trackView(id: string) {
  await fetch(`/api/events/${id}/view`, { method: 'POST' }).catch(() => {})
}

export async function subscribeNewsletter(email: string) {
  return apiFetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
}

export async function getNewsletterCount(cookie?: string): Promise<{ count: number }> {
  return apiFetch('/api/admin/newsletter/count', {
    headers: cookie ? { Cookie: cookie } : {},
    credentials: 'include',
  })
}

export interface Subscriber {
  id: string
  email: string
  createdAt: string
}

export async function getNewsletterSubscribers(cookie?: string): Promise<Subscriber[]> {
  return apiFetch('/api/admin/newsletter', {
    headers: cookie ? { Cookie: cookie } : {},
    credentials: 'include',
  })
}

export async function addNewsletterSubscriber(email: string): Promise<Subscriber> {
  return apiFetch('/api/admin/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
    credentials: 'include',
  })
}

export async function deleteNewsletterSubscriber(id: string) {
  return apiFetch(`/api/admin/newsletter/${id}`, { method: 'DELETE', credentials: 'include' })
}

// Admin
export async function adminLogin(email: string, password: string) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })
}

export async function adminLogout() {
  return apiFetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
}

export interface AdminStats {
  total: number
  pending: number
  published: number
  rejected: number
}

export async function getAdminStats(cookie?: string): Promise<AdminStats> {
  return apiFetch('/api/admin/stats', {
    headers: cookie ? { Cookie: cookie } : {},
    credentials: 'include',
  })
}

export async function getAdminEvents(status?: string, cookie?: string): Promise<EventWithStatus[]> {
  const q = status ? `?status=${status}` : ''
  return apiFetch(`/api/admin/events${q}`, {
    headers: cookie ? { Cookie: cookie } : {},
    credentials: 'include',
  })
}

export async function publishEvent(id: string) {
  return apiFetch(`/api/admin/events/${id}/publish`, { method: 'POST', credentials: 'include' })
}

export async function rejectEvent(id: string) {
  return apiFetch(`/api/admin/events/${id}/reject`, { method: 'POST', credentials: 'include' })
}

export async function deleteEvent(id: string) {
  return apiFetch(`/api/admin/events/${id}`, { method: 'DELETE', credentials: 'include' })
}

export interface ExtractedEvent {
  title: string
  organizer: string
  description: string
  startDate: string | null
  endDate: string | null
  format: 'onsite' | 'online' | 'hybrid'
  city: string | null
  address: string | null
  categories: string[]
  targetAudience: string[]
  isFree: boolean
  price: number | null
  registrationUrl: string | null
  websiteUrl: string | null
  onlineUrl: string | null
}

export async function extractEvent(opts: { file?: File; text?: string }): Promise<ExtractedEvent> {
  let res: Response
  if (opts.file) {
    const form = new FormData()
    form.append('file', opts.file)
    if (opts.text) form.append('text', opts.text)
    res = await fetch('/api/extract', { method: 'POST', body: form })
  } else {
    res = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: opts.text }),
    })
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  // The endpoint streams a heartbeat then the JSON; errors come back as
  // 200 + { error }. Parse the text (leading whitespace is valid JSON).
  const data = JSON.parse(await res.text())
  if (data && data.error) throw new Error(data.error)
  return data
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' })
  if (!res.ok) throw new Error('Upload failed')
  return res.json()
}
