'use client'
import { useEffect } from 'react'
import { trackView } from '@/lib/api'

export function ViewTracker({ eventId }: { eventId: string }) {
  useEffect(() => {
    const key = `viewed_${eventId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    trackView(eventId)
  }, [eventId])

  return null
}
