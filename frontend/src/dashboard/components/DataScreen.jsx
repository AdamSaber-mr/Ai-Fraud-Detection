import { useRef, useState } from 'react'

export default function DataScreen({ onLoadDemo, onUpload }) {
  const fileRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (file) onUpload(file)
  }

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="fd-orb-anim"
        style={{
          position: 'absolute',
          top: '10%',
          right: '14%',
          width: 360,
          height: 360,
          borderRadius: '50%',
          background: 'radial-gradient(circle,color-mix(in srgb,var(--accent) 18%,transparent),transparent 68%)',
          filter: 'blur(44px)',
          animation: 'fd-orb 13s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', maxWidth: 760, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "'IBM Plex Mono'",
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 14,
            }}
          >
            Stap 1 · Data
          </span>
          <h1 className="fd-neon" style={{ fontFamily: "'Chakra Petch'", fontSize: 38, fontWeight: 600, letterSpacing: '.01em', color: 'var(--text)', margin: '0 0 12px', lineHeight: 1.08 }}>
            Laad transactiedata in
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text2)', margin: '0 auto', maxWidth: 520, lineHeight: 1.55 }}>
            Het Isolation-Forest-model leert wat normaal gedrag is en markeert vervolgens elke transactie die daarvan afwijkt, zonder ooit een
            voorbeeld van fraude te zien.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <button
            onClick={onLoadDemo}
            className="fd-glass fd-card-hover fd-press"
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              font: 'inherit',
              color: 'var(--text)',
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: 'color-mix(in srgb,var(--accent) 16%,transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2.5" y="4" width="17" height="14" rx="2.5" />
                <line x1="2.5" y1="9" x2="19.5" y2="9" />
                <line x1="7" y1="13.5" x2="12" y2="13.5" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Chakra Petch'", fontSize: 19, fontWeight: 600, marginBottom: 6 }}>Demo data</div>
              <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.5 }}>
                Zo'n 200 voorbeeldtransacties met ingebouwde fraudepatronen, direct klaar om te analyseren.
              </div>
            </div>
            <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: 'var(--accent)' }}>
              Demo data laden
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="7.5" x2="12.5" y2="7.5" />
                <polyline points="8 3, 12.5 7.5, 8 12" />
              </svg>
            </span>
          </button>

          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              handleFile(e.dataTransfer.files && e.dataTransfer.files[0])
            }}
            className="fd-glass fd-card-hover fd-press"
            style={{
              textAlign: 'left',
              cursor: 'pointer',
              font: 'inherit',
              color: 'var(--text)',
              background: dragging ? 'color-mix(in srgb,var(--accent) 14%,var(--surface))' : undefined,
              border: dragging ? '1px solid var(--accent)' : undefined,
              padding: 26,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                background: 'color-mix(in srgb,var(--safe) 16%,transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--safe)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6.5 6.5, 11 2, 15.5 6.5" />
                <line x1="11" y1="2" x2="11" y2="13.5" />
                <path d="M3.5 15 V18 H18.5 V15" />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Chakra Petch'", fontSize: 19, fontWeight: 600, marginBottom: 6 }}>Upload CSV</div>
              <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.5 }}>
                Sleep je eigen bestand of klik om te kiezen. Verwacht:{' '}
                <span style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--text)', fontSize: 12 }}>amount, hour, location_score, daily_frequency</span>
              </div>
            </div>
            <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600, color: 'var(--text2)' }}>
              Bestand kiezen
            </span>
          </button>
        </div>
        <input
          type="file"
          accept=".csv"
          ref={fileRef}
          onChange={(e) => {
            handleFile(e.target.files && e.target.files[0])
            e.target.value = ''
          }}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  )
}
