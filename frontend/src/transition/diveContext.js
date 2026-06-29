import { createContext, useContext } from 'react'

// Shared context for the dashboard dive transition. Kept separate from the
// provider component so the module exports only non-components (keeps React Fast
// Refresh happy). `dive(path)` plays the animation and navigates.
export const DiveContext = createContext(() => {})

export const useDive = () => useContext(DiveContext)
