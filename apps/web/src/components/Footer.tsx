'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Newsletter } from '@/components/Newsletter'

export function Footer() {
  const path = usePathname()
  if (path?.startsWith('/admin')) return null

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-content px-6 py-12">
        <Newsletter />

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-fg">
              <Zap size={13} fill="currentColor" />
            </span>
            <span className="font-display text-sm font-bold tracking-tight">Tech Events Tunisia</span>
          </Link>
          <div className="flex items-center gap-5 text-[13px] text-muted">
            <Link href="/" className="hover:text-fg">Événements</Link>
            <Link href="/submit" className="hover:text-fg">Proposer</Link>
          </div>
          <p className="text-[12px] text-muted">
            © {new Date().getFullYear()} Tech Events Tunisia
          </p>
        </div>
      </div>
    </footer>
  )
}
