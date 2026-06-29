export default function Topbar() {
  return (
    <header
      style={{
        height: 60,
        flexShrink: 0,
        borderBottom: '1px solid color-mix(in srgb, var(--border) 70%, transparent)',
        background: 'color-mix(in srgb, var(--bg2) 85%, transparent)',
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
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--warn)', boxShadow: '0 0 8px 0 var(--warn)' }} />
          DEMO-MODUS
        </span>
        <span style={{ fontSize: 12.5, color: 'var(--text3)', fontFamily: "'IBM Plex Mono'", letterSpacing: '.02em' }}>Anomaliedetectie zonder fraudevoorbeelden</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: "'IBM Plex Mono'",
            fontSize: 11.5,
            fontWeight: 600,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: 'var(--safe)',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--safe)', boxShadow: '0 0 10px 1px var(--safe)', animation: 'fd-pulse 2.4s infinite' }} />
          Model actief
        </span>
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
