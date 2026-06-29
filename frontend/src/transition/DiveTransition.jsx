import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import DiveOverlay from './DiveOverlay'
import { DiveContext } from './diveContext'

// Provides a `dive(path)` action that plays the full-screen fraude-netwerk dive
// (see DiveOverlay) and navigates partway through, so the dashboard fades in from
// behind the animation. Lives above <Routes> so the overlay survives the route
// change. Replays on every call.
export function DiveTransitionProvider({ children }) {
  const navigate = useNavigate()
  const [target, setTarget] = useState(null)
  const navigated = useRef(false)

  const dive = useCallback((to) => {
    setTarget((cur) => cur || to) // ignore re-presses while a dive is running
  }, [])

  const handleArrive = useCallback(() => {
    if (navigated.current || !target) return
    navigated.current = true
    navigate(target)
  }, [navigate, target])

  const handleDone = useCallback(() => {
    navigated.current = false
    setTarget(null)
  }, [])

  return (
    <DiveContext.Provider value={dive}>
      {children}
      <AnimatePresence>
        {target && <DiveOverlay key="dive" onArrive={handleArrive} onDone={handleDone} />}
      </AnimatePresence>
    </DiveContext.Provider>
  )
}
