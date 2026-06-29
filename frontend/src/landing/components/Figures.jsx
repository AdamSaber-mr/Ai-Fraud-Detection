import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SectionHead, Kinetic, Reveal, CountUp } from '../anim'

// 200 transacties als puntenraster; 9 fraude + 5 verdacht lichten op.
function buildCells() {
  let s = 4242
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  const cls = new Array(200).fill('')
  const place = (n, c) => { let k = 0; while (k < n) { const i = Math.floor(rnd() * 200); if (cls[i] === '') { cls[i] = c; k++ } } }
  place(9, 'f')
  place(5, 'v')
  return cls
}

const cellV = { hidden: { opacity: 0, scale: 0 }, show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }

function Stat({ to, label, accent, prefix, group }) {
  return (
    <div className={'stat' + (accent ? ' accent' : '')}>
      <div className="snum mono"><CountUp to={to} prefix={prefix} group={group} /></div>
      <div className="slabel">{label}</div>
    </div>
  )
}

export default function Figures() {
  const cells = useMemo(() => buildCells(), [])

  return (
    <section id="cijfers" className="head-center band band-light">
      <SectionHead no="01">Wat het model zag</SectionHead>
      <Kinetic
        as="h2"
        className="kin"
        lines={[<>Eén nacht aan transacties,</>, <>in seconden <span className="accent-word">gewogen</span>.</>]}
      />

      <div className="cijfers-grid">
        <div className="stats">
          <Stat to={200} label="transacties geanalyseerd" />
          <Stat to={14} label="gemarkeerd voor controle · 7%" />
          <Stat to={9} label="fraude-alerts" accent />
          <Stat to={16480} label="gemarkeerd bedrag" prefix="€ " group />
        </div>

        <div className="matrix-wrap">
          <motion.div
            className="matrix"
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.004 } } }}
          >
            {cells.map((c, i) => (
              <motion.span key={i} className={'cell ' + c} variants={cellV} />
            ))}
          </motion.div>
          <div className="legend">
            <span><i style={{ background: '#3a3450' }} />Normaal 186</span>
            <span><i style={{ background: 'var(--verdacht)' }} />Verdacht 5</span>
            <span><i style={{ background: 'var(--accent)' }} />Fraude 9</span>
          </div>
          <Reveal as="div" className="matrix-cap" delay={0.2}>
            Elk bolletje is één betaling. <b>14 van de 200</b> vielen op, niet omdat ze
            op eerdere fraude leken, maar omdat ze zich anders gedroegen dan de rest.
          </Reveal>
        </div>
      </div>
    </section>
  )
}
