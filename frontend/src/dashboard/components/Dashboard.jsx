import { useMemo } from 'react'
import EChart from './EChart'
import { donutOption, barOption } from '../charts'
import { CountUp } from '../anim'

// Clean, single-view overview: a calm KPI band, two quiet charts and a short
// "highest risk" list. No layout tabs, no 3D cloud — just the essentials,
// dressed in the landing story's aubergine/lavender skin.

const label = { fontSize: 11.5, letterSpacing: '.04em', textTransform: 'uppercase', color: 'var(--text3)', fontWeight: 600 }
const cardTitle = { fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 600, color: 'var(--text)' }

function Kpi({ label: lbl, value, sub, dot }) {
  return (
    <div className="fd-glass" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={label}>{lbl}</span>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: dot, boxShadow: `0 0 0 4px color-mix(in srgb,${dot} 16%,transparent)` }} />
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 34, fontWeight: 600, lineHeight: 1, letterSpacing: '-.02em', color: 'var(--text)' }}>
        {value}
      </span>
      <span style={{ fontSize: 12.5, color: 'var(--text3)' }}>{sub}</span>
    </div>
  )
}

// A faint full track shows the 0-100 scale; the solid fill marks where this
// transaction sits, coloured by its status.
function RiskBar({ risk, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 999, overflow: 'hidden', background: 'color-mix(in srgb,var(--border) 70%,transparent)' }}>
        <div style={{ height: '100%', borderRadius: 999, width: risk + '%', background: color, transformOrigin: 'left', animation: 'fd-grow .9s var(--ease-out) both' }} />
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12.5, fontWeight: 600, width: 26, textAlign: 'right', color: 'var(--text2)' }}>{risk}</span>
    </div>
  )
}

function RiskRow({ t, onRowClick }) {
  return (
    <div
      onClick={() => onRowClick(t.id)}
      className="fd-row"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 120px 150px 96px',
        alignItems: 'center',
        gap: 16,
        padding: '13px 12px',
        borderRadius: 10,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <span style={{ width: 34, height: 34, flexShrink: 0, borderRadius: 9, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Mono'", fontWeight: 600, fontSize: 13, color: 'var(--text2)' }}>
          {t.initial}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.merchant}</div>
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11.5, color: 'var(--text3)' }}>{t.ref} · {t.hourFmt}</div>
        </div>
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono'", fontWeight: 600, fontSize: 14.5, textAlign: 'right' }}>{t.amountFmt}</div>
      <RiskBar risk={t.risk} color={t.barColor} />
      <span style={{ justifySelf: 'end', fontSize: 11.5, fontWeight: 600, padding: '4px 11px', borderRadius: 999, background: `color-mix(in srgb,${t.chipColor} 15%,transparent)`, color: t.chipColor, whiteSpace: 'nowrap' }}>
        {t.statusLabel}
      </span>
    </div>
  )
}

function Legend() {
  const item = (color, text) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text2)' }}>
      <span style={{ width: 8, height: 8, borderRadius: 3, background: color }} />
      {text}
    </span>
  )
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 10 }}>
      {item('var(--safe)', 'Normaal')}
      {item('var(--warn)', 'Verdacht')}
      {item('var(--danger)', 'Fraude')}
    </div>
  )
}

export default function Dashboard({ kpi, bands, transactions, theme, onRowClick, onGoTx }) {
  const donut = useMemo(() => donutOption(bands, theme), [bands, theme])
  const bar = useMemo(() => barOption(transactions, theme), [transactions, theme])
  const topTx = transactions.slice(0, 6)

  return (
    <div style={{ padding: '34px 36px 56px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <header style={{ marginBottom: 30 }}>
        <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: 30, fontWeight: 600, letterSpacing: '-.02em', margin: '0 0 6px' }}>Overzicht</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--text2)' }}>
          <span style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--text)' }}>{kpi.total.toLocaleString('nl-NL')}</span> transacties geanalyseerd door het model
        </p>
      </header>

      {/* KPI band */}
      <div className="fd-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 30 }}>
        <Kpi label="Transacties" value={<CountUp to={kpi.total} group />} dot="var(--accent)" sub="volledig geanalyseerd" />
        <Kpi label="Verdacht" value={<CountUp to={kpi.suspicious} group />} dot="var(--warn)" sub={`${kpi.pct}% van het totaal`} />
        <Kpi label="Fraude-alerts" value={<CountUp to={kpi.fraudAlerts} group />} dot="var(--danger)" sub="hoog risico" />
        <Kpi label="Bedrag gemarkeerd" value={<CountUp to={kpi.flaggedAmount} prefix="€ " group />} dot="var(--text3)" sub="in verdachte transacties" />
      </div>

      {/* Two quiet charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18, marginBottom: 30 }}>
        <div className="fd-glass" style={{ padding: '20px 22px', position: 'relative' }}>
          <div style={cardTitle}>Statusverdeling</div>
          <EChart option={donut} style={{ height: 210 }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{kpi.total.toLocaleString('nl-NL')}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>transacties</div>
          </div>
          <Legend />
        </div>
        <div className="fd-glass" style={{ padding: '20px 22px' }}>
          <div style={cardTitle}>Activiteit per uur</div>
          <div style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 2, marginBottom: 6 }}>Verdachte activiteit piekt 's nachts</div>
          <EChart option={bar} style={{ height: 232 }} />
        </div>
      </div>

      {/* Highest risk */}
      <div className="fd-glass" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={cardTitle}>Hoogste risico</div>
          <button onClick={onGoTx} className="fd-link" style={{ font: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
            Bekijk alle →
          </button>
        </div>
        <div className="fd-stagger">
          {topTx.map((t) => (
            <RiskRow key={t.id} t={t} onRowClick={onRowClick} />
          ))}
        </div>
      </div>
    </div>
  )
}
