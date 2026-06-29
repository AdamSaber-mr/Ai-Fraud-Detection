import { buildVerdict, detailFeatures } from '../adapt'

export default function DetailPanel({ tx, onClose }) {
  if (!tx) return null
  const verdict = buildVerdict(tx)
  const features = detailFeatures(tx)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(3,5,9,.55)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 472,
          maxWidth: '92vw',
          background: 'color-mix(in srgb, var(--bg2) 86%, transparent)',
          backdropFilter: 'blur(26px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(26px) saturate(1.2)',
          borderLeft: '1px solid color-mix(in srgb, #fff 8%, var(--border))',
          boxShadow: '-28px 0 70px -20px rgba(0,0,0,.6)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fd-slide .34s var(--ease-drawer) both',
          color: 'var(--text)',
        }}
      >
        <div style={{ padding: '22px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', gap: 13, alignItems: 'center' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'IBM Plex Mono'",
                fontWeight: 600,
                fontSize: 16,
                color: 'var(--text2)',
              }}
            >
              {tx.initial}
            </div>
            <div>
              <div style={{ fontFamily: "'Chakra Petch'", fontSize: 18, fontWeight: 600 }}>{tx.merchant}</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12, color: 'var(--text3)' }}>
                {tx.ref} · {tx.location}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="fd-press"
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--text2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
            <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 13, padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 7 }}>Bedrag</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 22, fontWeight: 600 }}>{tx.amountFmt}</div>
            </div>
            <div style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 13, padding: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 7 }}>Risicoscore</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 22, fontWeight: 600, color: tx.chipColor }}>
                {tx.risk}
                <span style={{ fontSize: 13, color: 'var(--text3)' }}> / 100</span>
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'IBM Plex Mono'",
                  padding: '3px 9px',
                  borderRadius: 999,
                  background: `color-mix(in srgb,${tx.chipColor} 15%,transparent)`,
                  color: tx.chipColor,
                }}
              >
                {tx.statusLabel}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'color-mix(in srgb,var(--accent) 7%,var(--surface))',
              border: '1px solid color-mix(in srgb,var(--accent) 26%,var(--border))',
              borderRadius: 13,
              padding: '16px 18px',
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
              Waarom gemarkeerd
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--text)' }}>{verdict}</p>
          </div>

          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 14 }}>
            Bijdrage per kenmerk
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {features.map((f) => (
              <div key={f.label}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{f.label}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12.5, color: 'var(--text2)' }}>{f.val}</span>
                </div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--surface2)', overflow: 'hidden', marginBottom: 6 }}>
                  <div style={{ height: '100%', borderRadius: 999, width: f.pct + '%', background: f.color, transformOrigin: 'left', animation: 'fd-grow .5s var(--ease-out) both' }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{f.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
