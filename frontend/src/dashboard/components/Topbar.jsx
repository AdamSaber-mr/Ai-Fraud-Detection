export default function Topbar({ onExport }) {
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
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Anomaliedetectie zonder fraudevoorbeelden</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onExport && (
          <button
            onClick={onExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              height: 34,
              padding: '0 14px',
              borderRadius: 9,
              background: 'color-mix(in srgb,var(--accent) 18%,var(--surface))',
              border: '1px solid color-mix(in srgb,var(--accent) 40%,var(--border))',
              color: 'var(--accent)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: "'IBM Plex Sans',system-ui,sans-serif",
            }}
          >
            ↓ Exporteer CSV
          </button>
        )}
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
