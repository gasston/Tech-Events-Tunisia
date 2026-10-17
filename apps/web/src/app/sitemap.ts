import type { MetadataRoute } from 'next'
import { getEvents } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let eventUrls: MetadataRoute.Sitemap = []
  try {
    const { events } = await getEvents({ limit: 100 })
    eventUrls = events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: new Date(e.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch {}

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/submit`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...eventUrls,
  ]
}
