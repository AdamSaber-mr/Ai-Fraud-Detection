import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Landing from './landing/Landing'
import { DiveTransitionProvider } from './transition/DiveTransition'

// The dashboard pulls in ECharts + the full data pipeline, so it is
// code-split: the landing page stays light and only loads it on demand.
const DashboardApp = lazy(() => import('./dashboard/DashboardApp'))

export default function App() {
  return (
    <DiveTransitionProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={null}>
              <DashboardApp />
            </Suspense>
          }
        />
      </Routes>
    </DiveTransitionProvider>
  )
}
