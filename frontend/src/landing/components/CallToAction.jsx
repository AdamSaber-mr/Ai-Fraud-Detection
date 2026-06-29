import { Kinetic, Reveal } from '../anim'

export default function CallToAction({ onTry }) {
  return (
    <section className="outro center band band-cta">
      <Kinetic
        as="h2"
        className="kin"
        lines={[<>Genoeg verteld.</>, <>Open het <span className="accent-word">dashboard</span>.</>]}
      />
      <Reveal as="p" className="lead" delay={0.2}>
        Bekijk dezelfde nacht als een live overzicht, de cijfers, de transacties en
        het moment waarop het model afwijkingen naar boven brengt.
      </Reveal>
      <Reveal delay={0.3}>
        <button className="cta-big" onClick={onTry}>
          Probeer het uit <span className="arr">→</span>
        </button>
      </Reveal>
    </section>
  )
}
