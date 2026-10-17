'use client'
import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  label?: string
}

export function EventMap({ lat, lng, label }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current || mapRef.current) return

    // Dynamic import to avoid SSR
    import('leaflet').then((L) => {
      // Fix default icon
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!ref.current) return
      const map = L.map(ref.current, { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 15)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      if (label) L.marker([lat, lng]).addTo(map).bindPopup(label).openPopup()
      else L.marker([lat, lng]).addTo(map)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [lat, lng, label])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div
        ref={ref}
        style={{
          height: 300,
          borderRadius: 8,
          border: '1px solid #E9E9E7',
          overflow: 'hidden',
        }}
      />
    </>
  )
}
