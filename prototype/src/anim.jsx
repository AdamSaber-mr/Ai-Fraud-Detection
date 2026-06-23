import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate as fmAnimate } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1]

/* Algemene reveal: faden + omhoog schuiven zodra in beeld. */
export function Reveal({ children, as = 'div', className, delay = 0, y = 26, amount = 0.2 }) {
  const Comp = motion[as] || motion.div
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </Comp>
  )
}

/* Kinetische typografie: regels schuiven uit een masker omhoog, gestaggerd. */
export function Kinetic({ lines, as = 'h1', className }) {
  const Comp = motion[as] || motion.h1
  return (
    <Comp
      className={className}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
    >
      {lines.map((line, i) => (
        <span className="ln" key={i}>
          <motion.span
            style={{ display: 'block' }}
            variants={{ hidden: { y: '115%' }, show: { y: 0, transition: { duration: 1, ease: EASE } } }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Comp>
  )
}

/* Eyebrow-label met een accent-streepje dat uitschuift. */
export function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <motion.span
        className="tick"
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE }}
      />
      {children}
    </div>
  )
}

/* Sectiekop met hoofdstuknummer + label + scheidingslijn die uitschuift. */
export function SectionHead({ no, children }) {
  return (
    <motion.div
      className="sec-head"
      initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      <motion.span className="sec-no mono" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>{no}</motion.span>
      <motion.span className="sec-label" variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>{children}</motion.span>
    </motion.div>
  )
}

/* Cijfer dat optelt zodra het in beeld komt. */
export function CountUp({ to, prefix = '', group = false, dur = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = fmAnimate(0, to, {
      duration: dur, ease: EASE, onUpdate: (x) => setV(Math.round(x)),
    })
    return () => controls.stop()
  }, [inView, to, dur])
  return <span ref={ref}>{prefix}{group ? v.toLocaleString('nl-NL') : v}</span>
}

/* Balk die van links inschuift (scaleX) zodra in beeld. */
export function GrowBar({ to = '100%', grad = false, h = 2, delay = 0 }) {
  return (
    <span className="gtrack" style={{ height: h }}>
      <motion.i
        className={grad ? 'grad' : ''}
        style={{ width: to, originX: 0 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: EASE, delay }}
      />
    </span>
  )
}
