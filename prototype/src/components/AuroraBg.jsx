import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { useMouse } from '../hooks/useMouse'

// Zachte, traag drijvende lavendel-gloed. Beweegt mee met scroll + muis (parallax).
export default function AuroraBg() {
  const { scrollY } = useScroll()
  const { x, y } = useMouse(50, 16)
  const tx = useTransform(x, (v) => v * 18)
  const ty = useTransform([scrollY, y], ([s, my]) => s * 0.06 + my * 14)
  const transform = useMotionTemplate`translate3d(${tx}px, ${ty}px, 0)`

  return (
    <motion.div className="aurora" style={{ transform }} aria-hidden>
      <b className="b1" />
      <b className="b2" />
      <b className="b3" />
    </motion.div>
  )
}
