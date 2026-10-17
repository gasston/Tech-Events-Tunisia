import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus } from 'lucide-react'
import { getAdminStats, getAdminEvents, getNewsletterCount } from '@/lib/api'
import { Mail } from 'lucide-react'
import { AdminEventList } from '@/components/AdminEventList'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Tableau de bord' }

async function LogoutButton() {
  async function logout() {
    'use server'
    await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/auth/logout`, {
      method: 'POST',
      headers: { Cookie: (await cookies()).toString() },
    })
    redirect('/admin/login')
  }
  return (
    <form action={logout}>
      <Button type="submit" variant="outline" size="sm">
        <LogOut size={13} />
        Déconnexion
      </Button>
    </form>
  )
}

export default async function AdminPage() {
  const cookieHeader = (await cookies()).toString()

  let stats, events, newsletter
  try {
    ;[stats, events, newsletter] = await Promise.all([
      getAdminStats(cookieHeader),
      getAdminEvents(undefined, cookieHeader),
      getNewsletterCount(cookieHeader).catch(() => ({ count: 0 })),
    ])
  } catch {
    redirect('/admin/login')
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="mt-1 text-[13px] text-muted">Tech Events Tunisia · Administration</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link href="/submit"><Button size="sm"><Plus size={13} />Créer</Button></Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="En attente" value={stats.pending} tone="text-amber-500" />
        <StatCard label="Publiés" value={stats.published} tone="text-emerald-500" />
        <StatCard label="Rejetés" value={stats.rejected} tone="text-red-500" />
      </div>
      <Link
        href="/admin/newsletter"
        className="mb-7 flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:border-accent/40 hover:bg-surface-2"
      >
        <Mail size={16} className="text-accent" />
        <span className="text-[13px] text-muted">Abonnés newsletter — gérer / exporter</span>
        <span className="ml-auto font-display text-lg font-bold">{newsletter.count}</span>
      </Link>

      <div className="rounded-lg border border-line bg-surface p-6">
        <AdminEventList initialEvents={events} />
      </div>
    </div>
  )
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className={`text-[12px] font-medium ${tone || 'text-muted'}`}>{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${tone || 'text-fg'}`}>{value}</p>
    </div>
  )
}
