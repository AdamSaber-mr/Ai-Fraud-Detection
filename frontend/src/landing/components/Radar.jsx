import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'

const SCORES = ['−0.81', '−0.74', '−0.69', '−0.77', '−0.66', '−0.72', '−0.79']
const NORMAL = '#8b80a6'
const FLAG = '#b9a3f0'

// 30 willekeurige (maar deterministische) bolletjes binnen de radarcirkel.
// Puur statische geometrie — wordt gerenderd en nooit gemuteerd.
function buildBlips() {
  let s = 998877
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  const angleOf = (x, y) => { let a = Math.atan2(y - 200, x - 200) * 180 / Math.PI; return a < 0 ? a + 360 : a }
  const list = []
  for (let i = 0; i < 30; i++) {
    const a = rnd() * Math.PI * 2
    const r = 52 + rnd() * 128
    const x = 200 + Math.cos(a) * r
    const y = 200 + Math.sin(a) * r
    list.push({ x, y, r: 2.4 + rnd() * 1.2, ang: angleOf(x, y) })
  }
  return list
}

// Cleane radar met echte scan: de beam draait rond, elke stip licht op als de
// straal er overheen veegt, en steeds wordt een ander bolletje "gevonden" en
// gemarkeerd als verdacht — alsof het systeem transactie na transactie scant.
export default function Radar() {
  const scanRef = useRef(null)
  const dotRefs = useRef([])
  const clock = useRef({ ang: 0, last: 0 })
  const pendingRef = useRef(null)   // volgend doelwit (index), wacht op de beam
  const flaggedRef = useRef(null)   // huidig gemarkeerd (index)
  const scoreN = useRef(0)
  const keyN = useRef(1)
  const [flag, setFlag] = useState(null) // { x, y, score, key }

  // Statische geometrie: veilig om te renderen.
  const blips = useMemo(() => buildBlips(), [])
  // Veranderlijke animatiestatus per bolletje (glow/flagged) leeft los in een
  // ref — die wordt elke frame gemuteerd en via de DOM toegepast, niet gerenderd.
  const fxRef = useRef(null)

  // start: markeer meteen het buitenste bolletje zodat er iets staat bij het laden
  useEffect(() => {
    const fx = blips.map(() => ({ glow: 0, flagged: false }))
    fxRef.current = fx
    let outer = 0
    for (let i = 1; i < blips.length; i++) {
      if (Math.hypot(blips[i].x - 200, blips[i].y - 200) > Math.hypot(blips[outer].x - 200, blips[outer].y - 200)) outer = i
    }
    fx[outer].flagged = true
    flaggedRef.current = outer
    setFlag({ x: blips[outer].x, y: blips[outer].y, score: SCORES[scoreN.current++ % SCORES.length], key: keyN.current++ })
  }, [blips])

  // kies regelmatig een nieuw doelwit; de beam "vindt" het bij de volgende passage
  useEffect(() => {
    const pick = () => {
      let i = Math.floor(Math.random() * blips.length)
      if (i === flaggedRef.current) i = (i + 1) % blips.length
      pendingRef.current = i
    }
    const id = setInterval(pick, 3600)
    return () => clearInterval(id)
  }, [blips])

  const inArc = (a, lo, hi) => (lo <= hi ? a > lo && a <= hi : a > lo || a <= hi)

  useAnimationFrame((t) => {
    const fx = fxRef.current
    if (!fx) return
    const c = clock.current
    if (!c.last) c.last = t
    const dt = Math.min(0.05, (t - c.last) / 1000)
    c.last = t
    const prev = c.ang
    c.ang = (c.ang + dt * 82) % 360
    if (scanRef.current) scanRef.current.style.transform = `rotate(${c.ang}deg)`

    // promoot het wachtende doelwit zodra de beam er overheen veegt
    const p = pendingRef.current
    if (p != null && inArc(blips[p].ang, prev, c.ang)) {
      if (flaggedRef.current != null) fx[flaggedRef.current].flagged = false
      fx[p].flagged = true
      fx[p].glow = 1
      flaggedRef.current = p
      pendingRef.current = null
      setFlag({ x: blips[p].x, y: blips[p].y, score: SCORES[scoreN.current++ % SCORES.length], key: keyN.current++ })
    }

    for (let i = 0; i < blips.length; i++) {
      const b = blips[i]
      const s = fx[i]
      const el = dotRefs.current[i]
      if (!el) continue
      if (inArc(b.ang, prev, c.ang)) s.glow = 1
      const floor = s.flagged ? 0.55 : 0.3
      s.glow = Math.max(floor, s.glow - dt * 1.6)
      el.setAttribute('opacity', s.glow)
      el.setAttribute('r', (s.flagged ? b.r * 1.6 : b.r) * (1 + (s.glow - floor) * 0.7))
      el.setAttribute('fill', s.flagged ? FLAG : NORMAL)
    }
  })

  return (
    <div className="scope">
      <div className="scope-ring" />
      <div className="scope-ring r2" />
      <div className="scope-ring r3" />
      <div className="scope-ring r4" />
      <div className="scope-cross h" />
      <div className="scope-cross v" />
      <div className="scope-face"><div className="scan" ref={scanRef} /></div>
      <svg viewBox="0 0 400 400">
        {blips.map((b, i) => (
          <circle
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
            cx={b.x} cy={b.y} r={b.r} fill={NORMAL}
          />
        ))}

        {flag && (
          <g key={flag.key}>
            {[0, 0.8].map((d, k) => (
              <motion.circle
                key={k} className="pring" cx={flag.x} cy={flag.y} r={9}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                animate={{ scale: [0.4, 2.4], opacity: [0.7, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut', delay: d }}
              />
            ))}
            <Label x={flag.x} y={flag.y} score={flag.score} />
          </g>
        )}
      </svg>
    </div>
  )
}

// Radiaal naar buiten wijzend label met de score.
function Label({ x, y, score }) {
  const ang = Math.atan2(y - 200, x - 200)
  const tx = Math.max(16, Math.min(384, x + Math.cos(ang) * 30))
  const ty = Math.max(18, Math.min(384, y + Math.sin(ang) * 30))
  const anchor = Math.cos(ang) >= 0 ? 'start' : 'end'
  return (
    <motion.g className="slabel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
      <line x1={x + Math.cos(ang) * 7} y1={y + Math.sin(ang) * 7} x2={tx} y2={ty} />
      <text x={tx + (anchor === 'start' ? 4 : -4)} y={ty + 4} textAnchor={anchor}>{score}</text>
    </motion.g>
  )
}
