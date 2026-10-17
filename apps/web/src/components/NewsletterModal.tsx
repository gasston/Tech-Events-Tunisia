'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Mail, X } from 'lucide-react'
import { NewsletterForm } from '@/components/NewsletterForm'

const STORAGE_KEY = 'newsletter_modal_seen'
const DELAY_MS = 6000

export function NewsletterModal() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // Never on admin or the dedicated newsletter page
    if (pathname?.startsWith('/admin') || pathname === '/newsletter') return
    if (localStorage.getItem(STORAGE_KEY)) return

    const t = setTimeout(() => setOpen(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [pathname])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1') // once per visitor — never again
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-up" onClick={dismiss} />

      <div className="relative w-full max-w-md animate-fade-up overflow-hidden rounded-lg border border-line bg-surface shadow-lift">
        {/* accent banner */}
        <div className="relative h-24 bg-gradient-to-br from-accent to-hot">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.25) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-black/20 text-white transition-colors hover:bg-black/40"
          >
            <X size={15} />
          </button>
          <div className="absolute -bottom-5 left-6 flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-surface text-accent">
            <Mail size={20} />
          </div>
        </div>

        <div className="p-6 pt-8">
          <h3 className="font-display text-xl font-bold tracking-tight">
            Reste dans la boucle tech 🇹🇳
          </h3>
          <p className="mt-2 text-sm text-muted">
            Un email, les meilleurs meetups et conférences tech en Tunisie. Pas de spam, désinscription en un clic.
          </p>

          <NewsletterForm className="mt-5" buttonLabel="Je m'inscris" onDone={() => setTimeout(dismiss, 1500)} />

          <button onClick={dismiss} className="mt-3 text-[12px] text-muted transition-colors hover:text-fg">
            Non merci
          </button>
        </div>
      </div>
    </div>
  )
}
