import { useNavigate } from 'react-router-dom'
import AuroraBg from './components/AuroraBg'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Figures from './components/Figures'
import Isolation from './components/Isolation'
import Signals from './components/Signals'
import CallToAction from './components/CallToAction'
import Footer from './components/Footer'
import './styles.css'

export default function Landing() {
  const navigate = useNavigate()
  const open = () => navigate('/dashboard')
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div className="landing">
      <AuroraBg />
      <div className="veil" />
      <Navbar onTry={open} onBrand={toTop} />

      <main id="story">
        <Hero />
        <Figures />
        <Isolation />
        <Signals />
        <CallToAction onTry={open} />
      </main>

      <Footer onTry={open} onBrand={toTop} />
    </div>
  )
}
