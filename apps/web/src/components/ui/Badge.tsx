import { cn } from '@/lib/utils'
import { getCategoryColor } from '@/lib/utils'

export function Badge({
  children,
  className,
  tone = 'neutral',
}: {
  children: React.ReactNode
  className?: string
  tone?: 'neutral' | 'accent' | 'hot' | 'success'
}) {
  const tones = {
    neutral: 'bg-surface-2 text-muted',
    accent: 'bg-accent/15 text-accent',
    hot: 'bg-hot/15 text-hot',
    success: 'bg-emerald-500/15 text-emerald-500',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

/** Category chip with its own color, translucent so it reads on light + dark. */
export function CategoryBadge({ category }: { category: string }) {
  const c = getCategoryColor(category)
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide"
      style={{ background: `${c.text}1f`, color: c.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.text }} />
      {category}
    </span>
  )
}
