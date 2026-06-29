const STEP_LABELS = [
  'Transactiedata inlezen',
  'Isolation Forest bouwen · 200 bomen',
  'Anomaliescores berekenen',
]

export default function LoadingOverlay({ step }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: 'color-mix(in srgb,var(--bg) 80%,transparent)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="fd-glass"
        style={{
          padding: '34px 38px',
          width: 420,
          maxWidth: '90vw',
          animation: 'fd-fade .3s var(--ease-out) both',
          color: 'var(--text)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          {/* scan box: the model sweeping the transaction field */}
          <div
            style={{
              position: 'relative',
              width: 44,
              height: 44,
              borderRadius: 12,
              overflow: 'hidden',
              flexShrink: 0,
              background: 'var(--surface2)',
              border: '1px solid color-mix(in srgb,var(--accent) 30%,var(--border))',
            }}
          >
            <span style={{ position: 'absolute', top: 11, left: 13, width: 3, height: 3, borderRadius: 999, background: 'var(--text3)' }} />
            <span style={{ position: 'absolute', top: 26, left: 22, width: 3, height: 3, borderRadius: 999, background: 'var(--text3)' }} />
            <span style={{ position: 'absolute', top: 18, left: 31, width: 3, height: 3, borderRadius: 999, background: 'var(--danger)' }} />
            <span style={{ position: 'absolute', top: 31, left: 14, width: 3, height: 3, borderRadius: 999, background: 'var(--text3)' }} />
            <div
              className="fd-scan-anim"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to bottom, transparent, color-mix(in srgb,var(--accent) 55%,transparent), transparent)',
                animation: 'fd-scan 1.4s linear infinite',
              }}
            />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk'", fontSize: 17, fontWeight: 600 }}>Model traint…</div>
            <div style={{ fontSize: 12.5, color: 'var(--text3)' }}>Isolation Forest op de data</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {STEP_LABELS.map((label, idx) => {
            const done = idx < step
            const active = idx === step
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: done || active ? 1 : 0.45 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: done ? 'var(--safe)' : active ? 'var(--accent)' : 'var(--border)',
                    color: '#fff',
                    fontSize: 11,
                    fontFamily: "'IBM Plex Mono'",
                  }}
                >
                  {done ? '✓' : ''}
                </span>
                <span style={{ fontSize: 14, color: done || active ? 'var(--text)' : 'var(--text3)' }}>{label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
