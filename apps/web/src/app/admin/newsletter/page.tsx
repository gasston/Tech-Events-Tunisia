import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getNewsletterSubscribers } from '@/lib/api'
import { AdminNewsletterList } from '@/components/AdminNewsletterList'

export const metadata: Metadata = { title: 'Newsletter' }

export default async function AdminNewsletterPage() {
  const cookieHeader = (await cookies()).toString()

  let subscribers
  try {
    subscribers = await getNewsletterSubscribers(cookieHeader)
  } catch {
    redirect('/admin/login')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link href="/admin" className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-fg">
        <ChevronLeft size={14} />
        Tableau de bord
      </Link>

      <h1 className="font-display text-2xl font-bold tracking-tight">Newsletter</h1>
      <p className="mb-7 mt-1 text-[13px] text-muted">Abonnés, ajout manuel et export CSV.</p>

      <div className="rounded-lg border border-line bg-surface p-6">
        <AdminNewsletterList initial={subscribers} />
      </div>
    </div>
  )
}
