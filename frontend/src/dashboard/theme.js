// Clean dark skin — a near-black aubergine canvas lit by a single lavender
// accent, matching the landing story. The data spectrum is purple-forward:
// normaal (dim lavender) → verdacht (bright lavender) → fraude (rose pop), so
// flagged transactions read louder than normal ones without a noisy rainbow.
export const PALETTES = {
  donker: {
    bg: '#0a0810',
    bg2: '#100c19',
    surface: '#171221',
    surface2: '#1f1830',
    border: '#2b2340',
    text: '#f3effb',
    text2: '#b2a9c8',
    text3: '#7d7398',
    accent: '#bca6f5',
    safe: '#6f6594',
    warn: '#a78cf0',
    danger: '#ec6a9f',
    axis: '#241d36',
    split: '#191325',
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
    // A calm lavender glow bleeding down from the top into a black floor — clean,
    // no texture. Gives the flat cards something quiet to sit on.
    '--depth': `radial-gradient(120% 75% at 50% -10%, ${hexA(p.accent, 0.08)} 0%, transparent 50%), radial-gradient(100% 100% at 50% 120%, ${hexA('#000000', 0.4)} 0%, transparent 60%), ${p.bg}`,
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
