import { cn } from '../../lib/utils'

export const AnimatedGrid = ({ className }) => {
  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none',
        className,
      )}
      aria-hidden="true"
    >
      {/* Single-layer CSS grid (much cheaper than 40 framer-motion nodes) */}
      <div
        className="absolute inset-0 opacity-[0.65] motion-reduce:animate-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99,102,241,0.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168,85,247,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '96px 96px',
          maskImage:
            'radial-gradient(ellipse at center, black 45%, transparent 72%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 45%, transparent 72%)',
          animation: 'grid-drift 18s ease-in-out infinite alternate',
        }}
      />
    </div>
  )
}

