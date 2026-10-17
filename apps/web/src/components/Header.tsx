'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  const path = usePathname()
  const isAdmin = path?.startsWith('/admin')

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg">
            <Zap size={16} fill="currentColor" />
          </span>
          <span className="font-display text-[15px] font-bold tracking-tight">
            Tech Events <span className="text-accent">Tunisia</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {!isAdmin ? (
            <>
              <NavLink href="/" active={path === '/'}>Événements</NavLink>
              <NavLink href="/newsletter" active={path === '/newsletter'}>Newsletter</NavLink>
              <ThemeToggle />
              <Link href="/submit" className="ml-2">
                <Button size="sm">
                  <Plus size={15} />
                  Ajouter
                </Button>
              </Link>
            </>
          ) : (
            <>
              <NavLink href="/admin" active={path === '/admin'}>Tableau de bord</NavLink>
              <ThemeToggle />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
        active ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2 hover:text-fg'
      )}
    >
      {children}
    </Link>
  )
}
