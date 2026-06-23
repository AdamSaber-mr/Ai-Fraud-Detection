export default function EmptyState({ onGoData }) {
  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 48,
      }}
    >
      <div
        className="fd-glass"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          textAlign: 'center',
          padding: '40px 44px',
          maxWidth: 460,
          animation: 'fd-fade .28s var(--ease-out) both',
        }}
      >
        <div style={{ fontFamily: "'Space Grotesk'", fontSize: 22, fontWeight: 600 }}>Nog geen data geanalyseerd</div>
        <p style={{ color: 'var(--text2)', maxWidth: 380, margin: 0, lineHeight: 1.5 }}>
          Laad eerst transactiedata in zodat het model de resultaten kan tonen.
        </p>
        <button
          onClick={onGoData}
          className="fd-btn fd-press"
          style={{
            cursor: 'pointer',
            font: 'inherit',
            fontWeight: 600,
            fontSize: 14,
            color: '#fff',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 999,
            padding: '11px 22px',
          }}
        >
          Data inladen
        </button>
      </div>
    </div>
  )
}
