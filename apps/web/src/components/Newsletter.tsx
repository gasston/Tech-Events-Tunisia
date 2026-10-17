import Link from 'next/link'
import { Mail, ArrowRight } from 'lucide-react'
import { NewsletterForm } from '@/components/NewsletterForm'

export function Newsletter() {
  return (
    <div className="rounded-lg border border-line bg-surface-2/50 p-6 sm:p-8">
      <div className="flex items-center gap-2 text-accent">
        <Mail size={18} />
        <span className="font-display text-sm font-bold uppercase tracking-wider">Newsletter</span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold tracking-tight sm:text-2xl">
        Ne rate aucun événement tech
      </h3>
      <p className="mt-2 max-w-md text-sm text-muted">
        Reçois les prochains meetups et conférences tech en Tunisie directement par email.
      </p>

      <NewsletterForm className="mt-5 max-w-md" />

      <Link
        href="/newsletter"
        className="mt-3 inline-flex items-center gap-1 text-[13px] text-muted transition-colors hover:text-accent"
      >
        En savoir plus
        <ArrowRight size={13} />
      </Link>
    </div>
  )
}
