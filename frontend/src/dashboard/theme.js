// Cyber / SOC skin — a near-black operations console lit by neon. Cyan is the
// system accent; the three status colours (neon green → amber → hot pink-red)
// form the safe→warn→danger spectrum used across charts, risk bars and chips.
// The dashboard runs dark-only; the landing story keeps its own aubergine skin.
export const PALETTES = {
  donker: {
    bg: '#05080d',
    bg2: '#080d15',
    surface: '#0c131d',
    surface2: '#121b28',
    border: '#1d2c3d',
    text: '#e7f6f4',
    text2: '#8fa8bb',
    text3: '#5d7488',
    accent: '#2af0e0',
    safe: '#37f5a6',
    warn: '#ffc24d',
    danger: '#ff4d72',
    axis: '#18293a',
    split: '#101d29',
  },
}

// Build the CSS custom properties used across the inline styles.
export function cssVars(theme) {
  const p = PALETTES[theme] || PALETTES.donker
  return {
    '--bg': p.bg,
    '--bg2': p.bg2,
    '--surface': p.surface,
    '--surface2': p.surface2,
    '--border': p.border,
    '--text': p.text,
    '--text2': p.text2,
    '--text3': p.text3,
    '--accent': p.accent,
    '--accent-dp': '#13b6ab',
    '--safe': p.safe,
    '--warn': p.warn,
    '--danger': p.danger,
    // Console backdrop: a cool cyan glow bleeding down from the top, falling off
    // into a black floor vignette — the room the operations grid sits in.
    '--depth': `radial-gradient(120% 80% at 50% -8%, ${hexA(p.accent, 0.1)} 0%, transparent 48%), radial-gradient(80% 70% at 88% 12%, ${hexA(p.safe, 0.05)} 0%, transparent 55%), radial-gradient(100% 100% at 50% 120%, ${hexA('#000000', 0.55)} 0%, transparent 62%), ${p.bg}`,
  }
}

// rgba() helper (hexA in the prototype).
export function hexA(hex, a) {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}
