// "Depth Field" palettes — dark is the cinematic signature, light is a clean
// daylight variant. One cool system accent; the three status colours form the
// continuous safe→warn→danger data spectrum used across charts and risk bars.
export const PALETTES = {
  donker: {
    bg: '#06070d',
    bg2: '#0a0c14',
    surface: '#11141d',
    surface2: '#171b26',
    border: '#232838',
    text: '#eef1f7',
    text2: '#9aa3b5',
    text3: '#5a6478',
    accent: '#5b8cff',
    safe: '#2ee6a6',
    warn: '#ffb84d',
    danger: '#ff5a6e',
    axis: '#2c3242',
    split: '#161b27',
  },
  licht: {
    bg: '#f4f6fb',
    bg2: '#eef1f8',
    surface: '#ffffff',
    surface2: '#f3f6fc',
    border: '#e2e7f0',
    text: '#121622',
    text2: '#566173',
    text3: '#94a0b2',
    accent: '#2f5fe0',
    safe: '#0f9d76',
    warn: '#cf8312',
    danger: '#e23b4e',
    axis: '#c7cfdb',
    split: '#e9eef6',
  },
}

// Build the CSS custom properties used across the inline styles.
export function cssVars(theme) {
  const p = PALETTES[theme] || PALETTES.donker
  const dark = theme !== 'licht'
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
    '--safe': p.safe,
    '--warn': p.warn,
    '--danger': p.danger,
    // Cinematic depth backdrop: a lit centre that falls off into a dark
    // vignette, evoking looking into the 3D transaction field.
    '--depth': dark
      ? `radial-gradient(120% 90% at 50% -10%, ${hexA(p.accent, 0.12)} 0%, transparent 42%), radial-gradient(90% 80% at 88% 18%, ${hexA(p.safe, 0.06)} 0%, transparent 55%), radial-gradient(100% 100% at 50% 120%, ${hexA('#000000', 0.55)} 0%, transparent 60%), ${p.bg}`
      : `radial-gradient(120% 90% at 50% -10%, ${hexA(p.accent, 0.08)} 0%, transparent 45%), radial-gradient(90% 80% at 88% 18%, ${hexA(p.safe, 0.05)} 0%, transparent 55%), ${p.bg}`,
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
