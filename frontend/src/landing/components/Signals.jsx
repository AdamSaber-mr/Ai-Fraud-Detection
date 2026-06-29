import { Kinetic, Reveal, GrowBar } from '../anim'
import { SIGNALS } from '../data'

export default function Signals() {
  return (
    <section id="signalen" className="band band-mid">
      <Kinetic
        as="h2"
        className="kin"
        lines={[<>Elk detail normaal.</>, <>Samen onmogelijk.</>]}
      />
      <div className="cards">
        {SIGNALS.map((s, i) => (
          <Reveal className="card" key={s.rank} delay={i * 0.1}>
            <div className="rank mono">{s.rank}</div>
            <div>
              <div className="merchant">{s.merchant}</div>
              <div className="meta mono">{s.meta.map((m, j) => <span key={j}>{m}</span>)}</div>
              <div className="why">{s.why}</div>
              <div className="riskline">
                <div className="t"><span>Risico</span><span className="mono">{s.risk}</span></div>
                <GrowBar to={s.risk + '%'} grad h={3} delay={0.15} />
              </div>
            </div>
            <div className="score">
              <div className="amt mono">{s.amt}</div>
              <div className="lvl">Fraude</div>
              <div className="s mono">score {s.score}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
