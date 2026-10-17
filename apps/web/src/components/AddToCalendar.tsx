'use client'
import { useState, useRef, useEffect } from 'react'
import { CalendarPlus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Props {
  title: string
  description?: string
  location?: string
  startDate: string
  endDate?: string | null
  url?: string
}

// Format to iCal UTC stamp: YYYYMMDDTHHMMSSZ
function toStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function fallbackEnd(start: string) {
  return new Date(new Date(start).getTime() + 2 * 3600 * 1000).toISOString()
}

export function AddToCalendar({ title, description = '', location = '', startDate, endDate, url }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const start = toStamp(startDate)
  const end = toStamp(endDate || fallbackEnd(startDate))
  const details = [description, url].filter(Boolean).join('\n\n')

  const googleUrl =
    'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`

  const outlookUrl =
    'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent' +
    `&subject=${encodeURIComponent(title)}` +
    `&startdt=${new Date(startDate).toISOString()}` +
    `&enddt=${new Date(endDate || fallbackEnd(startDate)).toISOString()}` +
    `&body=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(location)}`

  function downloadIcs() {
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Tech Events Tunisia//FR',
      'BEGIN:VEVENT',
      `UID:${start}-${Math.random().toString(36).slice(2)}@tech-events-tunisia`,
      `DTSTAMP:${toStamp(new Date().toISOString())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(details)}`,
      `LOCATION:${escapeIcs(location)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
    link.click()
    URL.revokeObjectURL(link.href)
    setOpen(false)
  }

  const item =
    'flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-fg transition-colors hover:bg-surface-2'

  return (
    <div ref={ref} className="relative">
      <Button variant="outline" size="lg" className="w-full" onClick={() => setOpen((o) => !o)}>
        <CalendarPlus size={16} />
        Ajouter à l'agenda
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-md border border-line bg-surface py-1 shadow-lift">
          <a href={googleUrl} target="_blank" rel="noreferrer" className={item} onClick={() => setOpen(false)}>
            Google Agenda
          </a>
          <a href={outlookUrl} target="_blank" rel="noreferrer" className={item} onClick={() => setOpen(false)}>
            Outlook
          </a>
          <button type="button" onClick={downloadIcs} className={item}>
            Apple / autre (.ics)
          </button>
        </div>
      )}
    </div>
  )
}

function escapeIcs(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}
