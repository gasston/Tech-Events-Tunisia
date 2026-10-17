import type { Metadata } from 'next'
import { SubmitForm } from '@/components/SubmitForm'

export const metadata: Metadata = {
  title: 'Proposer un événement',
  description: "Soumettez votre événement tech pour qu'il apparaisse dans l'annuaire.",
}

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Proposer un événement</h1>
        <p className="mt-2 text-sm text-muted">
          Votre événement sera examiné et publié après validation par notre équipe.
        </p>
      </div>
      <SubmitForm />
    </div>
  )
}
