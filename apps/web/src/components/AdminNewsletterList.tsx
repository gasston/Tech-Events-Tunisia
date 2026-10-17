'use client'
import { useState } from 'react'
import { Download, Plus, Trash2, AlertCircle, Search } from 'lucide-react'
import type { Subscriber } from '@/lib/api'
import { addNewsletterSubscriber, deleteNewsletterSubscriber } from '@/lib/api'
import { Button } from '@/components/ui/Button'

function fmt(iso: string) {
  return new Intl.DateTimeFormat('fr-TN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function AdminNewsletterList({ initial }: { initial: Subscriber[] }) {
  const [subs, setSubs] = useState(initial)
  const [email, setEmail] = useState('')
  const [q, setQ] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    setError('')
    try {
      const row = await addNewsletterSubscriber(email)
      setSubs((s) => [row, ...s])
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Erreur')
    } finally {
      setAdding(false)
    }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet abonné ?')) return
    setLoading(id)
    try {
      await deleteNewsletterSubscriber(id)
      setSubs((s) => s.filter((x) => x.id !== id))
    } finally {
      setLoading(null)
    }
  }

  function exportCsv() {
    const header = 'email,inscrit_le\n'
    const body = subs.map((s) => `${s.email},${s.createdAt}`).join('\n')
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const filtered = q ? subs.filter((s) => s.email.toLowerCase().includes(q.toLowerCase())) : subs
  const inputCls = 'h-9 rounded-md border border-line bg-surface px-3 text-[13px] text-fg outline-none transition-colors placeholder:text-muted focus:border-accent'

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <form onSubmit={add} className="flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ajouter@email.com"
            className={inputCls}
          />
          <Button type="submit" size="sm" disabled={adding}>
            <Plus size={14} />
            {adding ? 'Ajout…' : 'Ajouter'}
          </Button>
        </form>

        <div className="relative ml-auto">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filtrer…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <Button type="button" size="sm" variant="outline" onClick={exportCsv} disabled={subs.length === 0}>
          <Download size={14} />
          Export CSV
        </Button>
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-2 text-[13px] text-red-500">
          <AlertCircle size={13} /> {error}
        </div>
      )}

      <p className="mb-3 text-[13px] text-muted">
        {subs.length} abonné{subs.length > 1 ? 's' : ''}{q && ` · ${filtered.length} affiché${filtered.length > 1 ? 's' : ''}`}
      </p>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Aucun abonné.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-line bg-surface-2/50 text-left">
                <th className="px-4 py-2.5 text-[12px] font-semibold text-muted">Email</th>
                <th className="px-4 py-2.5 text-[12px] font-semibold text-muted">Inscrit le</th>
                <th className="px-4 py-2.5 text-right text-[12px] font-semibold text-muted">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={i < filtered.length - 1 ? 'border-b border-line' : ''}>
                  <td className="px-4 py-3 text-sm text-fg">{s.email}</td>
                  <td className="px-4 py-3 text-[13px] text-muted">{fmt(s.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(s.id)}
                      disabled={loading === s.id}
                      title="Supprimer"
                      className="p-1 text-muted transition-colors hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
