import { useEffect, useState } from 'react'
import { animate as fmAnimate } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

// A number that ticks up from 0 to `to` when it mounts — the dashboard's
// equivalent of the landing story's CountUp, so KPIs feel "computed" live.
export function CountUp({ to, prefix = '', suffix = '', group = false, dur = 1.1 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const controls = fmAnimate(0, to, {
      duration: reduce ? 0 : dur,
      ease: EASE,
      onUpdate: (x) => setV(Math.round(x)),
    })
    return () => controls.stop()
  }, [to, dur])
  return (
    <span>
      {prefix}
      {group ? v.toLocaleString('nl-NL') : v}
      {suffix}
    </span>
  )
}
