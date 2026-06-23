import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import AuroraBg from './components/AuroraBg'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Figures from './components/Figures'
import Isolation from './components/Isolation'
import Signals from './components/Signals'
import CallToAction from './components/CallToAction'
import Dashboard from './components/Dashboard'

export default function App() {
  const [dash, setDash] = useState(false)
  const open = () => { setDash(true); window.scrollTo(0, 0) }
  const close = () => { setDash(false); window.scrollTo(0, 0) }
  const onBrand = () => (dash ? close() : window.scrollTo({ top: 0, behavior: 'smooth' }))

  return (
    <>
      <AuroraBg />
      <div className="veil" />
      <Navbar onTry={open} onBrand={onBrand} dash={dash} />

      <AnimatePresence mode="wait">
        {dash ? (
          <motion.div
            key="dash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Dashboard onBack={close} />
          </motion.div>
        ) : (
          <motion.main
            key="story" id="story"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero />
            <Figures />
            <Isolation />
            <Signals />
            <CallToAction onTry={open} />
          </motion.main>
        )}
      </AnimatePresence>
    </>
  )
}
