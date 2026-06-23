import { Kinetic, Reveal } from '../anim'
import Radar from './Radar'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <Kinetic
          as="h1"
          className="kin"
          lines={[
            <>Tweehonderd betalingen.</>,
            <><span className="accent-word">Eén</span> die niet klopt.</>,
          ]}
        />
        <Reveal as="p" className="lead" delay={0.2}>
          Sentinel zoekt geen bekende fraude. Het leert hoe <b>gewoon</b> eruitziet —
          en zet alles apart wat daarvan afdwaalt.
        </Reveal>
        <Reveal className="scrollhint" delay={0.3}>
          <span className="bar" />Scroll om mee te kijken
        </Reveal>
      </div>

      <div className="hero-visual">
        <Radar />
      </div>
    </section>
  )
}
