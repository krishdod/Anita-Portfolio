import { cn } from '../../lib/utils'
import { useMotionPreference } from '../../hooks/useMotionPreference'

export function AutoScroll({ items, direction = 'left', speed = 30, pauseOnHover = true, className, showIcons = false, iconMap = {} }) {
  const { reducedMotion } = useMotionPreference()
  const renderItems = (duplicate = false) => (
    <div className={reducedMotion ? 'flex flex-wrap justify-center gap-x-7 gap-y-3' : 'marquee-group'} aria-hidden={duplicate || undefined}>
      {items.map((item) => {
        const Icon = showIcons && iconMap[item]
        return <span key={item} className="inline-flex gap-2 items-center whitespace-nowrap font-semibold text-sm sm:text-base text-muted-foreground">{Icon && <Icon size={20} aria-hidden="true" />}{item}</span>
      })}
    </div>
  )
  return (
    <div className={cn('overflow-hidden', pauseOnHover && 'marquee-pause', className)}>
      {reducedMotion ? renderItems() : (
        <div className="marquee-track" style={{ '--marquee-duration': speed + 's', animationDirection: direction === 'right' ? 'reverse' : 'normal' }}>
          {renderItems()}{renderItems(true)}
        </div>
      )}
    </div>
  )
}

