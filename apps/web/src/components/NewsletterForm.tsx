'use client'
import { useState } from 'react'
import { Check, AlertCircle } from 'lucide-react'
import { subscribeNewsletter } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface Props {
  buttonLabel?: string
  placeholder?: string
  className?: string
  autoFocus?: boolean
  onDone?: () => void
}

export function NewsletterForm({
  buttonLabel = "S'inscrire",
  placeholder = 'ton@email.com',
  className,
  autoFocus,
  onDone,
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await subscribeNewsletter(email)
      setStatus('done')
      setEmail('')
      onDone?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-500">
        <Check size={16} />
        Inscription confirmée — à bientôt !
      </div>
    )
  }

  return (
    <div className={className}>
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          autoFocus={autoFocus}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="h-11 flex-1 rounded-md border border-line bg-surface px-3.5 text-sm text-fg outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
        <Button type="submit" size="lg" disabled={status === 'loading'}>
          {status === 'loading' ? 'Inscription…' : buttonLabel}
        </Button>
      </form>
      {status === 'error' && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-red-500">
          <AlertCircle size={13} />
          Une erreur est survenue. Réessaie.
        </p>
      )}
    </div>
  )
}
