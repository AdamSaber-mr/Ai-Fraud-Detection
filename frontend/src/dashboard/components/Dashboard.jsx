import { useMemo } from 'react'
import EChart from './EChart'
import { scatterOption, donutOption, barOption } from '../charts'
import { CountUp } from '../anim'

const panel = { padding: '18px 20px' }
const sgTitle = { fontFamily: "'Space Grotesk'", fontSize: 15, fontWeight: 600 }

const rotatePill = {
  fontSize: 10.5,
  fontFamily: "'IBM Plex Mono'",
  color: 'var(--accent)',
  border: '1px solid color-mix(in srgb,var(--accent) 40%,transparent)',
  borderRadius: 999,
  padding: '3px 9px',
  background: 'color-mix(in srgb,var(--accent) 10%,transparent)',
}

function Kpi({ label, value, dot, valueColor, sub }) {
  return (
    <div className="fd-glass" style={{ display: 'flex', flexDirection: 'column', gap: 9, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, color: 'var(--text2)', fontWeight: 500 }}>{label}</span>
        <span style={{ width: 9, height: 9, borderRadius: 999, background: dot, boxShadow: `0 0 0 4px color-mix(in srgb,${dot} 18%,transparent)` }} />
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 33, fontWeight: 600, lineHeight: 1, letterSpacing: '-.02em', color: valueColor || 'var(--text)' }}>
        {value}
      </span>
      <span style={{ fontSize: 12, color: 'var(--text3)' }}>{sub}</span>
    </div>
  )
}

// Spectrum risk bar: a faint full safe→warn→danger track shows the scale; the
// solid fill marks where this transaction sits on it.
function RiskBar({ risk, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 999,
          overflow: 'hidden',
          background: 'linear-gradient(90deg, color-mix(in srgb,var(--safe) 28%,transparent), color-mix(in srgb,var(--warn) 28%,transparent), color-mix(in srgb,var(--danger) 28%,transparent))',
        }}
      >
        <div style={{ height: '100%', borderRadius: 999, width: risk + '%', background: color, transformOrigin: 'left', animation: 'fd-grow .9s var(--ease-out) both' }} />
      </div>
      <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12, fontWeight: 600, width: 24, textAlign: 'right' }}>{risk}</span>
    </div>
  )
}

function RiskRow({ t, cols, onRowClick, compact }) {
  return (
    <div
      onClick={() => onRowClick(t.id)}
      className="fd-row"
      style={{
        display: 'grid',
        gridTemplateColumns: cols,
        alignItems: 'center',
        gap: compact ? 12 : 14,
        padding: compact ? '8px 6px' : '10px 6px',
        borderRadius: 9,
        cursor: 'pointer',
        borderBottom: '1px solid color-mix(in srgb,var(--border) 70%,transparent)',
        fontSize: compact ? 13 : 'inherit',
      }}
    >
      {!compact && (
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
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.merchant}
          {compact && (
            <span style={{ color: 'var(--text3)', fontFamily: "'IBM Plex Mono'", fontSize: 11, fontWeight: 400 }}> {t.ref}</span>
          )}
        </div>
        {!compact && (
          <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 11.5, color: 'var(--text3)' }}>
            {t.ref} · {t.hourFmt}
          </div>
        )}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono'", fontWeight: 600, fontSize: 14, textAlign: 'right' }}>{t.amountFmt}</div>
      {compact && <div style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--text2)', textAlign: 'right' }}>{t.hourFmt}</div>}
      {compact && <div style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--text2)', textAlign: 'right' }}>{t.freq}×</div>}
      <RiskBar risk={t.risk} color={t.barColor} />
      <span
        style={{
          fontSize: compact ? 11 : 11.5,
          fontWeight: 600,
          fontFamily: "'IBM Plex Mono'",
          padding: compact ? '3px 9px' : '4px 10px',
          borderRadius: 999,
          background: `color-mix(in srgb,${t.chipColor} 15%,transparent)`,
          color: t.chipColor,
          whiteSpace: 'nowrap',
        }}
      >
        {t.statusLabel}
      </span>
    </div>
  )
}

export default function Dashboard({ kpi, bands, transactions, theme, layout, onSeg, onRowClick, onGoTx }) {
  const scatter = useMemo(() => scatterOption(transactions, theme), [transactions, theme])
  const donut = useMemo(() => donutOption(bands, theme), [bands, theme])
  const bar = useMemo(() => barOption(transactions, theme), [transactions, theme])

  const topTx = transactions.slice(0, 5)
  const analyseTx = transactions.slice(0, 9)

  const seg = (key, label) => {
    const on = layout === key
    return (
      <button
        onClick={() => onSeg(key)}
        className="fd-seg-btn"
        style={{
          font: 'inherit',
          fontSize: 13,
          fontWeight: 600,
          padding: '7px 15px',
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
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 22 }}>
        <div>
          <h1 style={{ fontFamily: "'Space Grotesk'", fontSize: 26, fontWeight: 600, letterSpacing: '-.02em', margin: '0 0 4px' }}>Overzicht</h1>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text2)' }}>
            <span style={{ fontFamily: "'IBM Plex Mono'", color: 'var(--text)' }}>{kpi.total.toLocaleString('nl-NL')}</span> transacties geanalyseerd · zojuist
            bijgewerkt
          </p>
        </div>
        <div style={{ display: 'inline-flex', borderRadius: 999, padding: 4, gap: 3 }} className="fd-glass">
          {seg('overzicht', 'Overzicht')}
          {seg('visueel', 'Visueel')}
          {seg('analyse', 'Analyse')}
        </div>
      </div>

      {/* LAYOUT: OVERZICHT */}
      {layout === 'overzicht' && (
        <>
          {/* HERO — the 3D transaction cloud floating in the depth field */}
          <div style={{ position: 'relative', marginBottom: 8 }}>
            <div style={{ position: 'absolute', top: 4, left: 4, zIndex: 2, maxWidth: '60%' }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 17, fontWeight: 600 }}>Transactieruimte</div>
              <div style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 2 }}>Elke stip is één transactie — uitschieters drijven naar de randen en lichten op.</div>
            </div>
            <span style={{ ...rotatePill, position: 'absolute', top: 6, right: 6, zIndex: 2 }}>auto-roteert</span>
            <EChart option={scatter} style={{ height: 420 }} />
          </div>

          {/* KPI readouts float over the lower edge of the cloud */}
          <div className="fd-stagger" style={{ position: 'relative', zIndex: 3, display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: -36, marginBottom: 18 }}>
            <Kpi label="Transacties" value={<CountUp to={kpi.total} group />} dot="var(--accent)" sub="volledig geanalyseerd" />
            <Kpi label="Verdacht" value={<CountUp to={kpi.suspicious} group />} dot="var(--warn)" valueColor="var(--warn)" sub={`${kpi.pct}% van het totaal`} />
            <Kpi label="Fraude-alerts" value={<CountUp to={kpi.fraudAlerts} group />} dot="var(--danger)" valueColor="var(--danger)" sub="hoog risico · directe actie" />
            <Kpi label="Bedrag gemarkeerd" value={<CountUp to={kpi.flaggedAmount} prefix="€ " group />} dot="var(--text3)" sub="in verdachte transacties" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="fd-glass" style={{ ...panel, position: 'relative' }}>
              <div style={{ ...sgTitle, marginBottom: 2 }}>Statusverdeling</div>
              <EChart option={donut} style={{ height: 200 }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 132, textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{kpi.total.toLocaleString('nl-NL')}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>transacties</div>
              </div>
              <Legend />
            </div>
            <div className="fd-glass" style={panel}>
              <div style={{ ...sgTitle, marginBottom: 2 }}>Transacties per uur</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 4 }}>Verdachte activiteit piekt 's nachts</div>
              <EChart option={bar} style={{ height: 200 }} />
            </div>
          </div>

          <div className="fd-glass" style={{ ...panel, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={sgTitle}>Hoogste risico</div>
              <button onClick={onGoTx} className="fd-link" style={{ font: 'inherit', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Bekijk alle →
              </button>
            </div>
            <div className="fd-stagger">
              {topTx.map((t) => (
                <RiskRow key={t.id} t={t} cols="34px 1fr 130px 110px auto" onRowClick={onRowClick} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* LAYOUT: VISUEEL */}
      {layout === 'visueel' && (
        <>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <div style={{ position: 'absolute', top: 4, left: 4, zIndex: 2, maxWidth: '62%' }}>
              <div style={{ fontFamily: "'Space Grotesk'", fontSize: 16, fontWeight: 600 }}>Transactieruimte (3D)</div>
              <div style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 2 }}>
                Normale transacties klonteren samen in het midden — fraude drijft als heldere uitschieter naar de randen.
              </div>
            </div>
            <span style={{ ...rotatePill, position: 'absolute', top: 6, right: 6, zIndex: 2 }}>auto-roteert</span>
            <EChart option={scatter} style={{ height: 500 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="fd-glass" style={{ ...panel, position: 'relative' }}>
              <div style={sgTitle}>Statusverdeling</div>
              <EChart option={donut} style={{ height: 210 }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 26, fontWeight: 600, lineHeight: 1 }}>{kpi.total.toLocaleString('nl-NL')}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>transacties</div>
              </div>
            </div>
            <div className="fd-glass" style={panel}>
              <div style={{ ...sgTitle, marginBottom: 4 }}>Transacties per uur</div>
              <EChart option={bar} style={{ height: 210 }} />
            </div>
          </div>
        </>
      )}

      {/* LAYOUT: ANALYSE */}
      {layout === 'analyse' && (
        <>
          <div className="fd-stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
            <Kpi label="Transacties" value={<CountUp to={kpi.total} group />} dot="var(--accent)" sub="volledig geanalyseerd" />
            <Kpi label="Verdacht" value={<CountUp to={kpi.suspicious} group />} dot="var(--warn)" valueColor="var(--warn)" sub={`${kpi.pct}% van het totaal`} />
            <Kpi label="Fraude-alerts" value={<CountUp to={kpi.fraudAlerts} group />} dot="var(--danger)" valueColor="var(--danger)" sub="hoog risico · directe actie" />
            <Kpi label="Bedrag gemarkeerd" value={<CountUp to={kpi.flaggedAmount} prefix="€ " group />} dot="var(--text3)" sub="in verdachte transacties" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, marginBottom: 16 }}>
            <div className="fd-glass" style={panel}>
              <div style={{ ...sgTitle, marginBottom: 4 }}>Transacties per uur</div>
              <EChart option={bar} style={{ height: 230 }} />
            </div>
            <div className="fd-glass" style={{ ...panel, position: 'relative' }}>
              <div style={sgTitle}>Statusverdeling</div>
              <EChart option={donut} style={{ height: 230 }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 24, fontWeight: 600, lineHeight: 1 }}>{kpi.pct}%</div>
                <div style={{ fontSize: 11, color: 'var(--text3)' }}>verdacht</div>
              </div>
            </div>
          </div>
          <div className="fd-glass" style={panel}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={sgTitle}>Hoogste risico · op risico gesorteerd</div>
              <button onClick={onGoTx} className="fd-link" style={{ font: 'inherit', fontSize: 12.5, fontWeight: 600, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Volledige lijst →
              </button>
            </div>
            <div className="fd-stagger">
              {analyseTx.map((t) => (
                <RiskRow key={t.id} t={t} cols="1fr 90px 90px 70px 130px auto" onRowClick={onRowClick} compact />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Legend() {
  const item = (color, label) => (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text2)' }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
      {label}
    </span>
  )
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 6 }}>
      {item('var(--safe)', 'Normaal')}
      {item('var(--warn)', 'Verdacht')}
      {item('var(--danger)', 'Fraude')}
    </div>
  )
}
