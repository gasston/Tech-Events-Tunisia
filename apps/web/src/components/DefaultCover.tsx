import { Zap } from 'lucide-react'
import { getCategoryColor } from '@/lib/utils'

/**
 * Branded fallback cover for events without an image.
 * Server-safe (pure CSS, no SVG ids). Tinted by the first category.
 */
export function DefaultCover({
  category = 'Autre',
  size = 'card',
}: {
  category?: string
  size?: 'card' | 'hero'
}) {
  const c = getCategoryColor(category).text

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${c}E6 0%, ${c}80 50%, #0b0b0f 130%)` }}
    >
      {/* dot pattern */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: size === 'hero' ? '26px 26px' : '18px 18px',
        }}
      />
      {/* glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
      {/* bottom shade for legibility */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />

      {/* brand mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white/85">
          <span className="flex items-center justify-center rounded-md bg-white/20 p-1.5 backdrop-blur-sm">
            <Zap size={size === 'hero' ? 22 : 16} fill="currentColor" />
          </span>
          <span className={`font-display font-bold tracking-tight ${size === 'hero' ? 'text-lg' : 'text-[13px]'}`}>
            Tech Events Tunisia
          </span>
        </div>
      </div>
    </div>
  )
}
