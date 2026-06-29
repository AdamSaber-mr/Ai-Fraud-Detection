// Clean dark skin — a neutral near-black canvas so content stays legible, lit by
// a single lavender accent. The data spectrum uses three *distinct* hues rather
// than three purples: normaal (neutral slate, low emphasis) → verdacht (lavender)
// → fraude (rose pop), so the three statuses are easy to tell apart.
export const PALETTES = {
  donker: {
    bg: '#070709',
    bg2: '#0d0d11',
    surface: '#141418',
    surface2: '#1d1d23',
    border: '#2a2a32',
    text: '#f5f4f8',
    text2: '#bfbfca',
    text3: '#8a8a96',
    accent: '#bca6f5',
    safe: '#6f6f80',
    warn: '#a98cf0',
    danger: '#f0688f',
    axis: '#23232b',
    split: '#16161b',
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
    '--accent-dp': '#9a82e4',
    '--safe': p.safe,
    '--warn': p.warn,
    '--danger': p.danger,
    // Whisper of lavender glow at the very top over a black floor — barely there,
    // so the background reads as clean black and the cards stand out.
    '--depth': `radial-gradient(120% 70% at 50% -12%, ${hexA(p.accent, 0.05)} 0%, transparent 48%), radial-gradient(100% 100% at 50% 120%, ${hexA('#000000', 0.35)} 0%, transparent 60%), ${p.bg}`,
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
