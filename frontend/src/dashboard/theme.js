// Clean dark skin — a neutral near-black canvas so content stays legible, lit by
// a single lavender accent. The data spectrum uses three *distinct* hues rather
// than three purples: normaal (neutral slate, low emphasis) → verdacht (orange)
// → fraude (rose pop), so the three statuses are easy to tell apart.
export const PALETTES = {
  donker: {
    bg: '#08070c',
    bg2: '#100c18',
    surface: '#16131e',
    surface2: '#221d30',
    border: '#2f2a3d',
    text: '#f5f4f8',
    text2: '#c5bfd6',
    text3: '#928aa3',
    accent: '#bca6f5',
    safe: '#52c8c0',
    warn: '#f0883e',
    danger: '#f0688f',
    amber: '#f5b56b',
    axis: '#2a2536',
    split: '#1a1624',
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
    '--amber': p.amber,
    // A warmer, more alive backdrop: a lavender glow up top, a teal wash bottom-left
    // and a rose hint bottom-right over a deep aubergine floor — enough colour to feel
    // lit, still dark enough to keep the cards crisp.
    '--depth': `radial-gradient(110% 70% at 50% -10%, ${hexA(p.accent, 0.1)} 0%, transparent 50%), radial-gradient(80% 80% at 8% 108%, ${hexA(p.safe, 0.07)} 0%, transparent 55%), radial-gradient(80% 80% at 96% 112%, ${hexA(p.danger, 0.06)} 0%, transparent 55%), radial-gradient(100% 100% at 50% 120%, ${hexA('#000000', 0.3)} 0%, transparent 60%), ${p.bg}`,
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
