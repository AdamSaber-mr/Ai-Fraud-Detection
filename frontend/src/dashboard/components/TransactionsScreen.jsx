import { STATUS } from '../constants'

const COLS = '42px 1.4fr 90px 110px 1fr 80px 150px 120px'

export default function TransactionsScreen({ transactions, filter, onFilter, onRowClick }) {
  const filtered = transactions.filter((t) => {
    if (filter === 'verdacht') return t.status === STATUS.VERDACHT
    if (filter === 'fraude') return t.status === STATUS.FRAUDE
    return true
  })

  const filterBtn = (key, label) => {
    const on = filter === key
    return (
      <button
        onClick={() => onFilter(key)}
        className="fd-seg-btn"
        style={{
          font: 'inherit',
          fontSize: 12.5,
          fontWeight: 600,
          padding: '7px 14px',
          borderRadius: 999,
          border: 'none',
          background: on ? 'var(--accent)' : 'transparent',
          color: on ? '#1a1326' : 'var(--text2)',
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ padding: '26px 28px 40px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 className="fd-neon" style={{ fontFamily: "'Chakra Petch'", fontSize: 26, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text)', margin: '0 0 4px' }}>Transacties</h1>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)' }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--text)' }}>{filtered.length}</span> resultaten · klik voor detail
          </p>
        </div>
        <div className="fd-glass" style={{ display: 'inline-flex', borderRadius: 999, padding: 4, gap: 3 }}>
          {filterBtn('alle', 'Alle')}
          {filterBtn('verdacht', 'Verdacht')}
          {filterBtn('fraude', 'Fraude')}
        </div>
      </div>

      <div className="fd-glass" style={{ overflow: 'hidden' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: COLS,
            alignItems: 'center',
            gap: 14,
            padding: '13px 20px',
            borderBottom: '1px solid color-mix(in srgb,var(--border) 70%,transparent)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '.06em',
            textTransform: 'uppercase',
            color: 'var(--text3)',
            background: 'color-mix(in srgb,var(--surface2) 50%,transparent)',
          }}
        >
          <span />
          <span>Transactie</span>
          <span style={{ textAlign: 'right' }}>Tijd</span>
          <span style={{ textAlign: 'right' }}>Bedrag</span>
          <span>Locatie</span>
          <span style={{ textAlign: 'right' }}>Freq.</span>
          <span>Risicoscore</span>
          <span style={{ textAlign: 'right' }}>Status</span>
        </div>

        {filtered.map((t) => (
          <div
            key={t.id}
            onClick={() => onRowClick(t.id)}
            className="fd-row"
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              alignItems: 'center',
              gap: 14,
              padding: '12px 20px',
              borderBottom: '1px solid color-mix(in srgb,var(--border) 60%,transparent)',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--surface2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'IBM Plex Mono'",
                fontWeight: 600,
                fontSize: 13,
                color: 'var(--text2)',
              }}
            >
              {t.initial}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.merchant}</div>
              <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11.5, color: 'var(--text3)' }}>{t.ref}</div>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, color: 'var(--text2)', textAlign: 'right' }}>{t.hourFmt}</div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontWeight: 600, fontSize: 14, textAlign: 'right' }}>{t.amountFmt}</div>
            <div style={{ fontSize: 13, color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {t.location} <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11, color: 'var(--text3)' }}>({t.locFmt})</span>
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 13, color: 'var(--text2)', textAlign: 'right' }}>{t.freq}×</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div
                style={{
                  flex: 1,
                  height: 7,
                  borderRadius: 999,
                  overflow: 'hidden',
                  background: 'linear-gradient(90deg, color-mix(in srgb,var(--safe) 28%,transparent), color-mix(in srgb,var(--warn) 28%,transparent), color-mix(in srgb,var(--danger) 28%,transparent))',
                }}
              >
                <div style={{ height: '100%', borderRadius: 999, width: t.risk + '%', background: t.barColor, transformOrigin: 'left', animation: 'fd-grow .8s var(--ease-out) both' }} />
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12.5, fontWeight: 600, width: 26, textAlign: 'right' }}>{t.risk}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 600,
                  fontFamily: "'IBM Plex Mono'",
                  padding: '4px 11px',
                  borderRadius: 999,
                  background: `color-mix(in srgb,${t.chipColor} 15%,transparent)`,
                  color: t.chipColor,
                  whiteSpace: 'nowrap',
                }}
              >
                {t.statusLabel}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text3)', fontSize: 13.5 }}>Geen transacties in deze categorie.</div>
        )}
      </div>
    </div>
  )
}
