export type EventFormat = 'onsite' | 'online' | 'hybrid'
export type ModerationStatus = 'pending' | 'published' | 'rejected'
export type TemporalStatus = 'upcoming' | 'ongoing' | 'past'

export interface Event {
  id: string
  slug: string
  title: string
  description: string
  organizer: string
  organizerLogo?: string | null
  coverImage?: string | null
  startDate: string
  endDate?: string | null
  format: EventFormat
  city?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  onlineUrl?: string | null
  targetAudience: string[]
  categories: string[]
  registrationUrl?: string | null
  websiteUrl?: string | null
  isFree: boolean
  price?: string | null
  views: number
  moderationStatus: ModerationStatus
  createdAt: string
  updatedAt: string
}

export interface EventWithStatus extends Event {
  temporalStatus: TemporalStatus
}

export const CATEGORIES = [
  'IA',
  'Développement',
  'Startup',
  'Cloud',
  'Cybersécurité',
  'Data',
  'Design',
  'Business',
  'DevOps',
  'Web3',
  'Autre',
] as const

export const CITIES = [
  'Tunis',
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Sousse',
  'Sfax',
  'Autre',
] as const

export const AUDIENCES = [
  'Développeurs',
  'Designers',
  'Entrepreneurs',
  'Étudiants',
  'Managers',
  'Data Scientists',
  'DevOps',
  'Tous publics',
] as const

export const FORMAT_LABELS: Record<EventFormat, string> = {
  onsite: 'Présentiel',
  online: 'En ligne',
  hybrid: 'Hybride',
}

// Vivid hues that stay legible on a translucent chip in both light and dark.
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'IA':            { bg: '#DBEAFE', text: '#3b82f6' },
  'Développement': { bg: '#DCFCE7', text: '#22c55e' },
  'Startup':       { bg: '#FEF3C7', text: '#f59e0b' },
  'Cloud':         { bg: '#E0F2FE', text: '#0ea5e9' },
  'Cybersécurité': { bg: '#FEE2E2', text: '#ef4444' },
  'Data':          { bg: '#F3E8FF', text: '#a855f7' },
  'Design':        { bg: '#FCE7F3', text: '#ec4899' },
  'Business':      { bg: '#FEF9C3', text: '#eab308' },
  'DevOps':        { bg: '#CCFBF1', text: '#14b8a6' },
  'Web3':          { bg: '#E0E7FF', text: '#6366f1' },
  'Autre':         { bg: '#F3F4F6', text: '#94a3b8' },
}

export function getTemporalStatus(startDate: string, endDate?: string | null): TemporalStatus {
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  if (now < start) return 'upcoming'
  if (end && now > end) return 'past'
  if (!end && now > start) return 'past'
  return 'ongoing'
}
