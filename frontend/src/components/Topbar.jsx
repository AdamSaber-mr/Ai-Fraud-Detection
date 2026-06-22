export default function Topbar({ theme, onToggleTheme }) {
  const licht = theme === 'licht'
  return (
    <header
      style={{
        height: 60,
        flexShrink: 0,
        borderBottom: '1px solid color-mix(in srgb, var(--border) 70%, transparent)',
        background: 'color-mix(in srgb, var(--bg) 55%, transparent)',
        backdropFilter: 'blur(18px) saturate(1.1)',
        WebkitBackdropFilter: 'blur(18px) saturate(1.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 26px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'IBM Plex Mono'",
            letterSpacing: '.04em',
            color: 'var(--text2)',
            padding: '5px 11px',
            border: '1px solid var(--border)',
            borderRadius: 999,
            background: 'var(--surface)',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warn)' }} />
          DEMO-MODUS
        </span>
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Anomaliedetectie zonder fraudevoorbeelden</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onToggleTheme}
          title="Wissel thema"
          className="fd-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            height: 36,
            padding: '0 13px',
            border: '1px solid var(--border)',
            borderRadius: 10,
            background: 'var(--surface)',
            color: 'var(--text2)',
            font: 'inherit',
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {licht ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="8" cy="8" r="3.2" />
              <line x1="8" y1="1" x2="8" y2="2.6" />
              <line x1="8" y1="13.4" x2="8" y2="15" />
              <line x1="1" y1="8" x2="2.6" y2="8" />
              <line x1="13.4" y1="8" x2="15" y2="8" />
              <line x1="3" y1="3" x2="4.2" y2="4.2" />
              <line x1="11.8" y1="11.8" x2="13" y2="13" />
              <line x1="13" y1="3" x2="11.8" y2="4.2" />
              <line x1="4.2" y1="11.8" x2="3" y2="13" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" fill="currentColor" />
              <circle cx="10.6" cy="6" r="5" fill="var(--surface)" />
            </svg>
          )}
          <span>{licht ? 'Donker' : 'Licht'}</span>
        </button>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'color-mix(in srgb,var(--accent) 20%,var(--surface))',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'IBM Plex Mono'",
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--accent)',
          }}
        >
          RA
        </div>
      </div>
    </header>
  )
}
