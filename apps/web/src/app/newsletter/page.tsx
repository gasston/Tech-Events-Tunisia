import type { Metadata } from 'next'
import { Mail, CalendarClock, Sparkles, ShieldCheck } from 'lucide-react'
import { NewsletterForm } from '@/components/NewsletterForm'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: "Reçois chaque semaine les meilleurs événements tech en Tunisie par email.",
}

const perks = [
  { icon: CalendarClock, title: 'Les événements à venir', desc: 'Meetups, conférences et workshops sélectionnés, avant tout le monde.' },
  { icon: Sparkles, title: 'Sélection, pas de bruit', desc: 'Un seul email, uniquement ce qui vaut le coup. Jamais de spam.' },
  { icon: ShieldCheck, title: 'Désinscription en un clic', desc: 'Ton email reste privé. Tu pars quand tu veux.' },
]

export default function NewsletterPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-hot/15 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl px-6 py-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-accent">
          <Mail size={13} />
          Newsletter
        </span>

        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
          L'agenda tech tunisien,{' '}
          <span className="bg-gradient-to-r from-accent to-hot bg-clip-text text-transparent">
            dans ta boîte mail
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
          Rejoins les passionné·es de tech en Tunisie et ne rate plus aucun meetup, conférence ou hackathon.
        </p>

        <div className="mx-auto mt-8 max-w-md">
          <NewsletterForm buttonLabel="Je m'inscris" />
        </div>

        <div className="mt-14 grid gap-6 text-left sm:grid-cols-3">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-line bg-surface p-5">
              <Icon size={20} className="text-accent" />
              <h3 className="mt-3 font-display text-base font-bold tracking-tight">{title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
