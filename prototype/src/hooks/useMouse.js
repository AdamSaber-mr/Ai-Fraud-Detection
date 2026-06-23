import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

// Genormaliseerde muispositie (-1..1) met zachte spring-demping.
export function useMouse(stiffness = 60, damping = 18) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness, damping })
  const sy = useSpring(y, { stiffness, damping })

  useEffect(() => {
    const onMove = (e) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2)
      y.set((e.clientY / window.innerHeight - 0.5) * 2)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [x, y])

  return { x: sx, y: sy }
}
