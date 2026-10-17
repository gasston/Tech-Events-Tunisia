'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle } from 'lucide-react'
import { adminLogin } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await adminLogin(email, password)
      router.push('/admin')
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted focus:border-accent'

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-surface-2">
            <Lock size={18} className="text-muted" />
          </div>
          <h1 className="font-display text-xl font-bold tracking-tight">Connexion admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-line bg-surface p-6">
          <label className="mb-1.5 block text-[13px] font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required autoComplete="email" />

          <label className="mb-1.5 mt-4 block text-[13px] font-medium">Mot de passe</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required autoComplete="current-password" />

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-md bg-red-500/10 px-3 py-2 text-[13px] text-red-500">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="mt-5 w-full" size="lg">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  )
}
