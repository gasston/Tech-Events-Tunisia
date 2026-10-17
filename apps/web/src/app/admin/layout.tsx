import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin — Tech Events Tunisia' },
  robots: 'noindex',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[calc(100vh-3.5rem)] bg-surface-2/40">{children}</div>
}
