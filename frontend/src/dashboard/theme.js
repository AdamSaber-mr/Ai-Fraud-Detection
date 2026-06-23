// Aubergine-noir + lavender — one dark signature palette, matching the landing
// story. Lavender is the system accent; the three status colours (teal → gold →
// rose) form the safe→warn→danger data spectrum used across charts and risk bars
// and stay inside the cool/warm purple family so nothing clashes with the story.
export const PALETTES = {
  donker: {
    bg: '#15111c',
    bg2: '#1d1727',
    surface: '#241d34',
    surface2: '#2f2645',
    border: '#3f3659',
    text: '#f2eff8',
    text2: '#b7aecb',
    text3: '#897ea4',
    accent: '#b9a3f0',
    safe: '#7fb8a6',
    warn: '#d6a85f',
    danger: '#e0729a',
    axis: '#352c4a',
    split: '#241d33',
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
    '--accent-dp': '#8b72d6',
    '--safe': p.safe,
    '--warn': p.warn,
    '--danger': p.danger,
    // Cinematic depth backdrop: a lit lavender centre that falls off into a dark
    // aubergine vignette, evoking looking into the 3D transaction field.
    '--depth': `radial-gradient(120% 90% at 50% -10%, ${hexA(p.accent, 0.1)} 0%, transparent 46%), radial-gradient(90% 80% at 86% 16%, ${hexA(p.safe, 0.05)} 0%, transparent 55%), radial-gradient(100% 100% at 50% 125%, ${hexA('#000000', 0.3)} 0%, transparent 60%), ${p.bg}`,
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
