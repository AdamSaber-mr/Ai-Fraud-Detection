export default function Toast({ message }) {
  if (!message) return null
  return (
    <div
      className="fd-glass"
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        borderRadius: 999,
        padding: '13px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        animation: 'fd-fade .26s var(--ease-out) both',
        color: 'var(--text)',
      }}
    >
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: '50%',
          background: 'var(--safe)',
          boxShadow: '0 0 0 3px color-mix(in srgb,var(--safe) 22%,transparent)',
        }}
      />
      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{message}</span>
    </div>
  )
}
