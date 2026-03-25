import { cn } from '../../lib/utils'

export const AnimatedWaves = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="wave-gradient-1"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.15)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
          </linearGradient>

          <linearGradient
            id="wave-gradient-2"
            x1="0%"
            x2="100%"
            y1="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.1)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
          </linearGradient>
        </defs>

        {/* Wave 1 */}
        <path
          fill="url(#wave-gradient-1)"
          d="M0,420 Q300,315 600,420 T1200,420 L1200,800 L0,800 Z"
        />

        {/* Wave 2 */}
        <path
          fill="url(#wave-gradient-2)"
          d="M0,520 Q300,470 600,520 T1200,520 L1200,800 L0,800 Z"
        />
      </svg>
    </div>
  )
}

