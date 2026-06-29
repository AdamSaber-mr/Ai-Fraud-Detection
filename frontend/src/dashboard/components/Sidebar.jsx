import { useNavigate } from 'react-router-dom'

const NAV = [
  {
    key: 'data',
    label: 'Data inladen',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="5 5, 8.5 1.5, 12 5" />
        <line x1="8.5" y1="1.5" x2="8.5" y2="10.5" />
        <path d="M2.5 11.5 V15 H14.5 V11.5" />
      </svg>
    ),
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="1" y="1" width="6.2" height="6.2" rx="1.6" />
        <rect x="9.8" y="1" width="6.2" height="6.2" rx="1.6" />
        <rect x="1" y="9.8" width="6.2" height="6.2" rx="1.6" />
        <rect x="9.8" y="9.8" width="6.2" height="6.2" rx="1.6" />
      </svg>
    ),
  },
  {
    key: 'transacties',
    label: 'Transacties',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <line x1="6" y1="3.5" x2="15" y2="3.5" />
        <line x1="6" y1="8.5" x2="15" y2="8.5" />
        <line x1="6" y1="13.5" x2="15" y2="13.5" />
        <circle cx="2.4" cy="3.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="2.4" cy="8.5" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="2.4" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'uitleg',
    label: 'Hoe werkt het',
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="8.5" cy="8.5" r="7" />
        <text x="8.5" y="12.2" fontSize="9.5" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="'IBM Plex Sans'" fontWeight="700">?</text>
      </svg>
    ),
  },
]

export default function Sidebar({ screen, onNav }) {
  const navigate = useNavigate()
  return (
    <aside
      style={{
        width: 248,
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
        background: 'color-mix(in srgb, var(--bg2) 92%, transparent)',
        backdropFilter: 'blur(18px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.1)',
        borderRight: '1px solid color-mix(in srgb, var(--border) 80%, transparent)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
      }}
    >
      <button
        onClick={() => navigate('/')}
        className="fd-press"
        title="Terug naar het verhaal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          padding: '4px 8px 22px',
          background: 'none',
          border: 'none',
          font: 'inherit',
          color: 'inherit',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 7,
            background: 'linear-gradient(135deg,var(--accent),var(--safe))',
            boxShadow: '0 0 18px -2px color-mix(in srgb,var(--accent) 75%,transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div style={{ width: 11, height: 11, background: '#04201d', transform: 'rotate(45deg)', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span className="fd-neon" style={{ fontFamily: "'Chakra Petch'", fontWeight: 700, fontSize: 16, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text)' }}>Sentinel</span>
          <span style={{ fontSize: 10.5, color: 'var(--text3)', fontFamily: "'IBM Plex Mono'", letterSpacing: '.08em', textTransform: 'uppercase' }}>AI fraudedetectie</span>
        </div>
      </button>

      <div style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text3)', letterSpacing: '.12em', textTransform: 'uppercase', padding: '0 10px 10px' }}>
        Werkruimte
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map((item) => {
          const on = screen === item.key
          return (
            <button
              key={item.key}
              onClick={() => onNav(item.key)}
              className="fd-press fd-seg-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                width: '100%',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid ' + (on ? 'color-mix(in srgb, var(--accent) 30%, var(--border))' : 'transparent'),
                background: on ? 'color-mix(in srgb, var(--accent) 12%, var(--surface2))' : 'transparent',
                color: on ? 'var(--text)' : 'var(--text2)',
                font: 'inherit',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
              }}
            >
              <span
                className="fd-indicator"
                style={{
                  position: 'absolute',
                  left: -14,
                  top: 9,
                  bottom: 9,
                  width: 3,
                  borderRadius: '0 3px 3px 0',
                  background: 'var(--accent)',
                  boxShadow: '0 0 12px 0 var(--accent)',
                  opacity: on ? 1 : 0,
                }}
              />
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </nav>

      <div style={{ marginTop: 'auto', border: '1px solid var(--border)', borderRadius: 12, padding: '13px 14px', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--safe)',
              boxShadow: '0 0 0 3px color-mix(in srgb,var(--safe) 22%,transparent)',
              animation: 'fd-pulse 2.4s infinite',
            }}
          />
          <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11.5, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: 'var(--safe)' }}>Model actief</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text3)', fontFamily: "'IBM Plex Mono'", lineHeight: 1.5 }}>
          Isolation Forest
          <br />
          200 bomen · scikit-learn
        </div>
      </div>
    </aside>
  )
}
