import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Eyebrow, CountUp } from '../anim'
import { TX, ST_LABEL, HOURS, FLAG_HOURS } from '../data'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] } } }

function Kpi({ label, to, w, accent, prefix, group }) {
  return (
    <motion.div className={'kpi' + (accent ? ' accent' : '')} variants={item} style={{ '--w': w }}>
      <div className="l">{label}</div>
      <div className="v mono"><CountUp to={to} prefix={prefix} group={group} dur={1.3} /></div>
      <div className="track"><i /></div>
    </motion.div>
  )
}

export default function Dashboard({ onBack }) {
  const [go, setGo] = useState(false)
  useEffect(() => {
    window.scrollTo(0, 0)
    const t = setTimeout(() => setGo(true), 250)
    return () => clearTimeout(t)
  }, [])
  const max = Math.max(...HOURS)

  return (
    <div className={'dash' + (go ? ' go' : '')}>
      <motion.div className="dash-inner" variants={container} initial="hidden" animate="show">

        <motion.div className="dash-head" variants={item}>
          <div>
            <Eyebrow>Live overzicht</Eyebrow>
            <h2>Eén nacht, in één oogopslag</h2>
          </div>
          <button className="cta ghost" onClick={onBack}>← Terug naar verhaal</button>
        </motion.div>

        <div className="kpis">
          <Kpi label="Transacties geanalyseerd" to={200} w="100%" />
          <Kpi label="Gemarkeerd · 7%" to={14} w="7%" />
          <Kpi label="Fraude-alerts" to={9} w="64%" accent />
          <Kpi label="Gemarkeerd bedrag" to={16480} w="48%" prefix="€ " group />
        </div>

        <div className="dash-grid">
          <motion.div className="panel" variants={item}>
            <div className="ph"><h3>Transacties</h3><span className="sub">gesorteerd op risico</span></div>
            <table className="tx">
              <thead>
                <tr><th>Begunstigde</th><th>Tijd</th><th className="r">Bedrag</th><th>Risico</th><th className="r">Status</th></tr>
              </thead>
              <tbody>
                {TX.map((t, i) => (
                  <tr key={i}>
                    <td><div className="m">{t.m}</div><div className="sub mono">{t.loc}</div></td>
                    <td className="mono">{t.time}</td>
                    <td className="r mono">{t.amt}</td>
                    <td>
                      <span className="rb"><i style={{ '--w': t.risk + '%' }} /></span>
                      <span className="mono rv">{t.risk}</span>
                    </td>
                    <td className="r"><span className={'st ' + t.st}>{ST_LABEL[t.st]}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div variants={item}>
            <div className="panel" style={{ marginBottom: 18 }}>
              <div className="ph"><h3>Transacties per uur</h3><span className="sub">markeringen 's nachts</span></div>
              <div className="hours">
                {HOURS.map((c, h) => (
                  <div
                    key={h}
                    className={'h' + (FLAG_HOURS.includes(h) ? ' flag' : '')}
                    style={{ height: (c / max * 100) + '%', transitionDelay: (h * 0.018) + 's' }}
                  />
                ))}
              </div>
              <div className="hours-x"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span></div>
            </div>

            <div className="panel">
              <div className="ph"><h3>Verdeling</h3><span className="sub">200 transacties</span></div>
              <div className="dist">
                <span className="n" style={{ '--w': '93%' }} />
                <span className="v" style={{ '--w': '2.5%' }} />
                <span className="f" style={{ '--w': '4.5%' }} />
              </div>
              <div className="legend">
                <span><i style={{ background: '#4a4360' }} />Normaal 186</span>
                <span><i style={{ background: 'var(--verdacht)' }} />Verdacht 5</span>
                <span><i style={{ background: 'var(--accent)' }} />Fraude 9</span>
              </div>
            </div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  )
}
