import { useMemo } from 'react'
import { motion } from 'framer-motion'

// Full-bleed fraude-netwerk achter de hero: knooppunten = rekeningen/transacties,
// lijnen = geldstromen. Eén dichte kliek rechts is de "fraude-ring" die oplicht,
// en signaalpulsen lopen over de verbindingen alsof het systeem stromen volgt.
// Pure, deterministische geometrie (SVG + framer-motion) — geen 3D-library.

function buildNetwork() {
  let s = 20260628
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff }
  const W = 1000, H = 620, N = 46

  const nodes = []
  for (let i = 0; i < N; i++) {
    nodes.push({ x: 30 + rnd() * (W - 60), y: 30 + rnd() * (H - 60), rad: 2.2 + rnd() * 2.4, d: rnd() })
  }

  // Plant een compacte fraude-kliek rechts-midden: een centraal knooppunt met een
  // dichte ring eromheen. Bewust strak zodat het als één verdacht cluster leest.
  const fx = 700, fy = 300, ringCount = 6
  const center = nodes.length
  nodes.push({ x: fx, y: fy, rad: 4.2, d: rnd() })
  const near = [center]
  for (let i = 0; i < ringCount; i++) {
    const a = (i / ringCount) * Math.PI * 2 + rnd() * 0.4
    const rr = 26 + rnd() * 30
    nodes.push({ x: fx + Math.cos(a) * rr, y: fy + Math.sin(a) * rr, rad: 3 + rnd() * 1.4, d: rnd() })
    near.push(nodes.length - 1)
  }
  const ring = new Set(near)

  const edges = []
  const seen = new Set()
  const add = (i, j, ring = false) => {
    if (i === j) return
    const k = i < j ? `${i}-${j}` : `${j}-${i}`
    if (!seen.has(k)) { seen.add(k); edges.push({ a: i, b: j, ring }) }
  }

  // ring-verbindingen eerst (krijgen voorrang in stijl): spaken + cyclus + kruisen
  for (let i = 1; i < near.length; i++) add(center, near[i], true)
  for (let i = 1; i < near.length; i++) {
    add(near[i], near[i === near.length - 1 ? 1 : i + 1], true)
    add(near[i], near[((i + 1) % ringCount) + 1], true)
  }

  // verbind elk knooppunt met zijn 2 dichtstbijzijnde buren -> organisch web,
  // dat trekt vanzelf een paar "bruggen" vanuit het veld naar de fraude-kliek
  nodes.forEach((n, i) => {
    const order = nodes
      .map((m, j) => ({ j, dist: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.dist - q.dist)
    for (let k = 0; k < 2; k++) add(i, order[k].j)
  })

  // pulsen: ring-verbindingen + een paar gewone stromen aan de zichtbare rechterkant
  const ringEdges = edges.filter((e) => e.ring)
  const flowEdges = edges
    .filter((e) => !e.ring)
    .sort((p, q) => (nodes[q.a].x + nodes[q.b].x) - (nodes[p.a].x + nodes[p.b].x))
    .slice(0, 8)

  return { W, H, nodes, edges, ring, near, center, pulses: [...ringEdges, ...flowEdges] }
}

export default function FraudNetwork() {
  const { W, H, nodes, edges, ring, center, pulses } = useMemo(() => buildNetwork(), [])

  return (
    <div className="fraudnet" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <g className="fn-edges">
          {edges.map((e, i) => {
            const a = nodes[e.a], b = nodes[e.b]
            return (
              <line key={i} className={e.ring ? 'fn-edge ring' : 'fn-edge'}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
            )
          })}
        </g>

        <g className="fn-nodes">
          {nodes.map((n, i) => (
            <circle key={i} className={ring.has(i) ? 'fn-node fraud' : 'fn-node'}
              cx={n.x} cy={n.y} r={ring.has(i) ? n.rad * 1.5 : n.rad}
              style={{ animationDelay: `${(-n.d * 4).toFixed(2)}s` }} />
          ))}
        </g>

        {/* expanderende ringen op het hart van het fraude-cluster */}
        {[0, 1.4].map((delay, k) => (
          <motion.circle key={`g${k}`} className="fn-glow"
            cx={nodes[center].x} cy={nodes[center].y} r={10}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            animate={{ scale: [0.5, 3.6], opacity: [0.55, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay }} />
        ))}

        {/* signaalpulsen die over de verbindingen lopen */}
        {pulses.map((e, i) => {
          const a = nodes[e.a], b = nodes[e.b]
          const len = Math.hypot(b.x - a.x, b.y - a.y)
          const dur = Math.min(3.4, Math.max(1.6, len / 150))
          return (
            <motion.circle key={`p${i}`} className={e.ring ? 'fn-pulse ring' : 'fn-pulse'}
              r={e.ring ? 2.6 : 2} cx={a.x} cy={a.y}
              animate={{ cx: [a.x, b.x], cy: [a.y, b.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay: (i % 5) * 0.55 }} />
          )
        })}

        <Label x={nodes[center].x} y={nodes[center].y} />
      </svg>
    </div>
  )
}

// Klein label dat het cluster aanwijst — geeft het netwerk een "detail"-gevoel.
function Label({ x, y }) {
  const tx = x + 28, ty = y - 34
  return (
    <motion.g className="fn-label"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}>
      <line x1={x + 8} y1={y - 8} x2={tx} y2={ty} />
      <text x={tx + 6} y={ty - 5}>cluster</text>
      <text x={tx + 6} y={ty + 12} className="sc">score −0.79</text>
    </motion.g>
  )
}
