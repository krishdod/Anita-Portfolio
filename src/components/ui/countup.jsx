import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'

/**
 * CountUp component that animates numbers when they come into view
 * @param {number} end - The target number to count up to
 * @param {number} duration - Animation duration in seconds (default: 2)
 * @param {string} suffix - Text to append after the number (e.g., '+', '%')
 * @param {string} prefix - Text to prepend before the number (e.g., '$')
 * @param {number} decimals - Number of decimal places (default: 0)
 * @param {string} separator - Thousands separator (default: ',')
 * @param {string} className - Additional CSS classes
 * @param {boolean} enableScrollSpy - Enable scroll-triggered animation (default: true)
 * @param {number} start - Starting number (default: 0)
 * @param {number} delay - Delay before animation starts in seconds (default: 0)
 */
export function CountUpNumber({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  decimals = 0,
  separator = ',',
  className = '',
  enableScrollSpy = true,
  start = 0,
  delay = 0,
  ...props
}) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView && enableScrollSpy && !hasAnimated) {
      const timer = setTimeout(() => {
        setHasAnimated(true)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [inView, enableScrollSpy, hasAnimated, delay])

  const shouldAnimate = enableScrollSpy ? hasAnimated : true

  return (
    <span ref={ref} className={className}>
      {shouldAnimate ? (
        <CountUp
          start={start}
          end={end}
          duration={duration}
          suffix={suffix}
          prefix={prefix}
          decimals={decimals}
          separator={separator}
          {...props}
        />
      ) : (
        <span>{start}{suffix}</span>
      )}
    </span>
  )
}

