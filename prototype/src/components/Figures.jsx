import { Eyebrow, Kinetic, Reveal, CountUp, GrowBar } from '../anim'

function Fig({ to, cap, w, alert, prefix, group }) {
  return (
    <div className={'fig' + (alert ? ' alert' : '')}>
      <div className="num mono"><CountUp to={to} prefix={prefix} group={group} /></div>
      <div className="cap">{cap}</div>
      <GrowBar to={w} />
    </div>
  )
}

export default function Figures() {
  return (
    <section id="cijfers">
      <Eyebrow>Wat het model zag</Eyebrow>
      <Kinetic
        as="h2"
        className="kin"
        lines={[<>Eén nacht aan transacties,</>, <>in seconden gewogen.</>]}
      />
      <div className="figures">
        <Fig to={200} cap="geanalyseerd" w="100%" />
        <Fig to={14} cap="gemarkeerd · 7%" w="7%" />
        <Fig to={9} cap="fraude-alerts" w="64%" alert />
        <Fig to={16480} cap="gemarkeerd bedrag" w="48%" prefix="€ " group />
      </div>
      <Reveal as="p" className="body" delay={0.3}>
        Niet omdat ze op eerdere fraude leken — er was geen voorbeeld. Maar omdat ze
        zich anders gedroegen dan alle andere.
      </Reveal>
    </section>
  )
}
