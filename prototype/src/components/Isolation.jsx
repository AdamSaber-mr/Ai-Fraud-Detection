import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Eyebrow, Kinetic, Reveal } from '../anim'

// Kandidaten die het model om de beurt isoleert — verspreid over het veld,
// elk in een rustige hoek zodat hun cel schoon kan worden uitgesneden.
const CANDIDATES = [
  { x: 476, y: 92,  score: '−0.81' },
  { x: 96,  y: 86,  score: '−0.74' },
  { x: 104, y: 300, score: '−0.69' },
  { x: 470, y: 300, score: '−0.77' },
  { x: 508, y: 196, score: '−0.66' },
]
const CW = 51, CH = 58
const CAPS = ['splitsing 1 — bedrag', 'splitsing 2 — uur', 'splitsing 3 — locatie', 'splitsing 4 — frequentie']

function buildBgDots() {
  let s = 20240620
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  const near = (x, y) => CANDIDATES.some((c) => Math.abs(x - c.x) < CW + 14 && Math.abs(y - c.y) < CH + 14)
  const dots = []
  let made = 0, guard = 0
  while (made < 40 && guard < 4000) {
    guard++
    const x = 40 + rnd() * 480
    const y = 44 + rnd() * 300
    if (near(x, y)) continue
    dots.push({ x, y })
    made++
  }
  return dots
}

function geomFor(p) {
  const left = Math.max(6, p.x - CW), right = Math.min(554, p.x + CW)
  const top = Math.max(6, p.y - CH), bottom = Math.min(374, p.y + CH)
  const lines = [
    { x1: left,  y1: 0, x2: left,  y2: 380, hx: left,  hy: 0, dx: 0, dy: 380 },
    { x1: right, y1: 0, x2: right, y2: 380, hx: right, hy: 0, dx: 0, dy: 380 },
    { x1: 0, y1: top,    x2: 560, y2: top,    hx: 0, hy: top,    dx: 560, dy: 0 },
    { x1: 0, y1: bottom, x2: 560, y2: bottom, hx: 0, hy: bottom, dx: 560, dy: 0 },
  ]
  const regions = [
    { x: left, y: 0,   w: 560 - left,   h: 380 },
    { x: left, y: 0,   w: right - left, h: 380 },
    { x: left, y: top, w: right - left, h: 380 - top },
    { x: left, y: top, w: right - left, h: bottom - top },
  ]
  const right_ = p.x < 280
  const tagX = right_ ? Math.min(540, p.x + 64) : Math.max(70, p.x - 64)
  const tagY = p.y < 190 ? Math.min(360, p.y + 42) : Math.max(22, p.y - 32)
  return {
    left, right, top, bottom,
    lines, regions,
    cell: { x: left, y: top, w: right - left, h: bottom - top },
    tag: { x1: p.x + (right_ ? 8 : -8), y1: p.y + (p.y < 190 ? 8 : -8), x2: tagX, y2: tagY,
           tx: tagX + (right_ ? 4 : -4), anchor: right_ ? 'start' : 'end' },
  }
}

export default function Isolation() {
  const bgDots = useMemo(buildBgDots, [])
  const stageRef = useRef(null)
  const inView = useInView(stageRef, { once: false, amount: 0.4 })
  const [step, setStep] = useState(0)   // 0 = punten, 1..4 = snedes, 5 = eindfocus
  const [cid, setCid] = useState(0)      // cyclus-id (her-triggert scan-sweep / lijnen)
  const [active, setActive] = useState(0) // welke kandidaat deze cyclus

  const geo = useMemo(() => geomFor(CANDIDATES[active]), [active])
  const target = CANDIDATES[active]

  useEffect(() => {
    if (!inView) return
    let alive = true
    const timers = []
    const wait = (ms, fn) => timers.push(setTimeout(fn, ms))
    const cycle = (idx) => {
      if (!alive) return
      setActive(idx)
      setCid((c) => c + 1)
      setStep(0)
      const base = 1000
      geomFor(CANDIDATES[idx]).lines.forEach((_, i) => wait(base + i * 740, () => setStep(i + 1)))
      wait(base + 4 * 740 + 340, () => setStep(5))
      wait(base + 4 * 740 + 340 + 3000, () => cycle((idx + 1) % CANDIDATES.length))
    }
    cycle(0)
    return () => { alive = false; timers.forEach(clearTimeout) }
  }, [inView])

  const focus = step === 5
  const caption = focus
    ? (<><b>1 betaling</b> — apart gezet na 4 snedes</>)
    : (step === 0 ? '47 betalingen scannen…' : CAPS[step - 1])

  const dim = (isTarget) => (focus ? (isTarget ? 1 : 0.12) : (isTarget ? 1 : 0.85))

  return (
    <section id="model">
      <Eyebrow>Hoe het model denkt</Eyebrow>
      <div className="iso-wrap">
        <div>
          <Kinetic
            as="h2"
            className="kin"
            lines={[<>Het kent geen fraude.</>, <>Alleen <span className="accent-word">gewoon</span>.</>]}
          />
          <Reveal as="p" className="body" delay={0.2}>
            Een <b>Isolation Forest</b> stelt willekeurige vragen — hoger of lager dan
            deze grens, voor of na dit uur? Een doodgewone betaling lijkt op honderden
            andere en is pas na véél vragen los te pellen.
          </Reveal>
          <Reveal as="p" className="body" delay={0.3}>
            Een uitschieter staat al na een paar snedes alleen. Hoe sneller iets te
            <b> isoleren</b> is, hoe verdachter. Kijk maar mee →
          </Reveal>
        </div>

        <div className="stage" ref={stageRef}>
          <svg viewBox="0 0 560 380" aria-hidden>
            <defs>
              <linearGradient id="sweepg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="rgba(185,163,240,0)" />
                <stop offset="0.5" stopColor="rgba(185,163,240,0.5)" />
                <stop offset="1" stopColor="rgba(185,163,240,0)" />
              </linearGradient>
            </defs>

            {/* versmallende focus-regio's */}
            {geo.regions.map((r, i) => (
              <motion.rect
                key={'r' + i + '-' + cid} className="region" x={r.x} y={r.y} width={r.w} height={r.h}
                animate={{ opacity: step > i ? (i === 3 ? 1 : 0.55) : 0 }}
                transition={{ duration: 0.6 }}
              />
            ))}

            {/* binnenkomende scan-sweep bij elke cyclus */}
            <motion.rect
              key={'sweep' + cid} className="iso-sweep" x={0} y={0} width={42} height={380}
              fill="url(#sweepg)"
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: [-60, 560], opacity: [0, 0.9, 0] }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
            />

            {/* gewone achtergrondpunten */}
            {bgDots.map((d, i) => (
              <motion.circle
                key={'b' + i} cx={d.x} cy={d.y} r={4.2} className="dot normal" fill="#7b6f93"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: dim(false), scale: 1 } : {}}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: focus ? 0 : 0.25 + i * 0.018 }}
              />
            ))}

            {/* kandidaten — de actieve is deze cyclus de uitschieter */}
            {CANDIDATES.map((c, i) => {
              const isT = i === active
              return (
                <motion.circle
                  key={'c' + i} cx={c.x} cy={c.y} r={isT ? 6.5 : 4.2}
                  className={'dot ' + (isT ? 'anom' : 'normal')} fill={isT ? undefined : '#7b6f93'}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? {
                    opacity: dim(isT),
                    scale: isT && focus ? 1.6 : 1,
                    filter: isT && focus
                      ? 'drop-shadow(0 0 9px rgba(185,163,240,0.95))'
                      : 'drop-shadow(0 0 0px rgba(185,163,240,0))',
                  } : {}}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: focus ? 0 : 0.3 }}
                />
              )
            })}

            {/* snedes + meelopende, gloeiende snij-kop */}
            {geo.lines.map((l, i) => step > i && (
              <g key={'l' + i + '-' + cid}>
                <motion.line
                  x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} className="split-l"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.6, 0, 0.2, 1] }}
                />
                <motion.circle
                  className="head" r={3.6}
                  initial={{ cx: l.hx, cy: l.hy, opacity: 1 }}
                  animate={{ cx: l.hx + l.dx, cy: l.hy + l.dy, opacity: [1, 1, 0] }}
                  transition={{ duration: 0.7, ease: [0.6, 0, 0.2, 1] }}
                />
              </g>
            ))}

            {/* eindfocus: cel tekent zich + vult, label, dubbele puls */}
            {focus && (
              <g key={'final' + cid}>
                <motion.rect
                  className="cell-fill" x={geo.cell.x} y={geo.cell.y} width={geo.cell.w} height={geo.cell.h} rx={4}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                />
                <motion.rect
                  className="cell-line" x={geo.cell.x} y={geo.cell.y} width={geo.cell.w} height={geo.cell.h} rx={4} fill="none"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: [0.6, 0, 0.2, 1] }}
                />
                <motion.line
                  className="tag-line" x1={geo.tag.x1} y1={geo.tag.y1} x2={geo.tag.x2} y2={geo.tag.y2}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                />
                <motion.text
                  className="iso-tag" x={geo.tag.tx} y={geo.tag.y2} textAnchor={geo.tag.anchor}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.5 }}
                >{target.score} · geïsoleerd</motion.text>
                {[0, 0.7].map((d, k) => (
                  <motion.circle
                    key={k} className="ring" cx={target.x} cy={target.y} r={14}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    animate={{ scale: [0.4, 2.1], opacity: [0.75, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: d }}
                  />
                ))}
              </g>
            )}
          </svg>
          <div className="badge">{caption}</div>
        </div>
      </div>
    </section>
  )
}
