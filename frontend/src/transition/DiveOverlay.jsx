import { useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Full-screen transition that "dives" through a fraude-netwerk (the same motif as
// the hero) straight into the fraud cluster, blooms into a soft lavender flash,
// then fades to reveal the dashboard underneath. Deterministic SVG geometry —
// no 3D library — so it stays light and replays identically every time.

const W = 1000
const H = 620
const CX = 690 // fraud-cluster centre = the point we dive into
const CY = 296
const ORIGIN = `${(CX / W) * 100}% ${(CY / H) * 100}%`

const LAV = '#bca6f5'
const LAV_HI = '#e4d9ff'

function buildNetwork() {
  let s = 20260628
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
  const N = 56
  const nodes = []
  for (let i = 0; i < N; i++) {
    nodes.push({ x: 24 + rnd() * (W - 48), y: 24 + rnd() * (H - 48), r: 2 + rnd() * 2.3, d: rnd() })
  }

  // Dense fraud clique around (CX, CY): a centre node ringed by a tight cluster.
  const center = nodes.length
  nodes.push({ x: CX, y: CY, r: 4.8, d: rnd() })
  const ring = [center]
  const ringCount = 6
  for (let i = 0; i < ringCount; i++) {
    const a = (i / ringCount) * Math.PI * 2 + rnd() * 0.5
    const rr = 22 + rnd() * 26
    nodes.push({ x: CX + Math.cos(a) * rr, y: CY + Math.sin(a) * rr, r: 3 + rnd() * 1.3, d: rnd() })
    ring.push(nodes.length - 1)
  }
  const ringSet = new Set(ring)

  const edges = []
  const seen = new Set()
  const add = (i, j, fraud) => {
    if (i === j) return
    const k = i < j ? `${i}-${j}` : `${j}-${i}`
    if (seen.has(k)) return
    seen.add(k)
    edges.push({ a: i, b: j, fraud })
  }
  // spokes + cycle inside the clique
  for (let i = 1; i < ring.length; i++) add(center, ring[i], true)
  for (let i = 1; i < ring.length; i++) add(ring[i], ring[i === ring.length - 1 ? 1 : i + 1], true)
  // connect every node to its two nearest neighbours -> organic web with bridges
  nodes.forEach((n, i) => {
    const order = nodes
      .map((m, j) => ({ j, dist: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.dist - q.dist)
    add(i, order[0].j)
    add(i, order[1].j)
  })

  const pulses = edges.filter((e) => e.fraud).concat(edges.filter((e) => !e.fraud).slice(0, 7))
  return { nodes, edges, ringSet, center, pulses }
}

export default function DiveOverlay({ onArrive, onDone }) {
  const net = useMemo(() => buildNetwork(), [])
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      onArrive()
      const t = setTimeout(onDone, 380)
      return () => clearTimeout(t)
    }
    const tArrive = setTimeout(onArrive, 1550) // dashboard mounts hidden under the overlay
    const tDone = setTimeout(onDone, 2650)
    return () => {
      clearTimeout(tArrive)
      clearTimeout(tDone)
    }
  }, [reduce, onArrive, onDone])

  const base = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    overflow: 'hidden',
    background: `radial-gradient(120% 90% at ${ORIGIN}, rgba(188,166,245,0.12), transparent 55%), #0a0810`,
  }

  // Reduced motion: skip the dive, just a brief calm cross-fade.
  if (reduce) {
    return (
      <motion.div style={base} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.38, times: [0, 0.4, 1] }} />
    )
  }

  return (
    <motion.div
      style={base}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: 2.65, times: [0, 0.08, 0.5, 0.82, 1], ease: 'linear' }}
    >
      {/* the network we fly into: scales up around the fraud cluster, then fades */}
      <motion.div
        style={{ position: 'absolute', inset: 0, transformOrigin: ORIGIN, willChange: 'transform, opacity' }}
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: [1, 1.5, 9.5], opacity: [0, 1, 0] }}
        transition={{ duration: 1.95, times: [0, 0.4, 1], ease: [0.45, 0, 0.7, 0] }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%' }}>
          {/* edges */}
          <g>
            {net.edges.map((e, i) => {
              const a = net.nodes[e.a]
              const b = net.nodes[e.b]
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={LAV}
                  strokeWidth={e.fraud ? 1.3 : 0.8}
                  opacity={e.fraud ? 0.55 : 0.16}
                />
              )
            })}
          </g>

          {/* expanding glow rings on the heart of the cluster */}
          {[0, 1].map((k) => (
            <motion.circle
              key={`g${k}`}
              cx={CX}
              cy={CY}
              r={10}
              fill="none"
              stroke={LAV}
              strokeWidth={1.4}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              animate={{ scale: [0.5, 3.4], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: k * 0.7 }}
            />
          ))}

          {/* nodes */}
          <g>
            {net.nodes.map((n, i) => {
              const fraud = net.ringSet.has(i)
              return (
                <circle
                  key={i}
                  cx={n.x}
                  cy={n.y}
                  r={fraud ? n.r * 1.4 : n.r}
                  fill={fraud ? LAV_HI : LAV}
                  opacity={fraud ? 1 : 0.5}
                  style={fraud ? { filter: 'drop-shadow(0 0 6px rgba(188,166,245,0.9))' } : undefined}
                />
              )
            })}
          </g>

          {/* signal pulses travelling along the connections */}
          {net.pulses.map((e, i) => {
            const a = net.nodes[e.a]
            const b = net.nodes[e.b]
            const len = Math.hypot(b.x - a.x, b.y - a.y)
            const dur = Math.min(2.6, Math.max(1.1, len / 170))
            return (
              <motion.circle
                key={`p${i}`}
                r={e.fraud ? 2.6 : 2}
                fill={e.fraud ? LAV_HI : LAV}
                cx={a.x}
                cy={a.y}
                animate={{ cx: [a.x, b.x], cy: [a.y, b.y], opacity: [0, 1, 1, 0] }}
                transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay: (i % 5) * 0.4 }}
              />
            )
          })}
        </svg>
      </motion.div>

      {/* lavender bloom as we punch through the cluster */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${ORIGIN}, ${LAV_HI} 0%, rgba(188,166,245,0.45) 26%, transparent 64%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0.95, 0] }}
        transition={{ duration: 2.65, times: [0, 0.52, 0.66, 0.92], ease: 'easeOut' }}
      />
    </motion.div>
  )
}
