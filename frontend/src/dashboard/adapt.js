// Maps the Flask backend response onto the data shape the Sentinel UI expects.
// The backend (Isolation Forest) returns the real model output per transaction:
//   transaction_id, amount, hour, location_score, daily_frequency,
//   is_fraud, anomaly_score, risk_level, risk (0-100), status
// plus a `stats` object computed over the full dataset.
//
// The backend doesn't store merchant / location names, so we synthesise those
// deterministically (purely cosmetic) from the transaction id, influenced by
// the real feature values, so the dashboard reads like a real ledger.
import { RISK, statusFromRisk, labelFromStatus, colorVarFromStatus } from './constants'

const MERCHANTS = [
  'Albert Heijn', 'Bol.com', 'Shell', 'Coolblue', 'PayPal', 'Booking.com',
  'Apple', 'Zalando', 'KLM', 'Steam', 'Jumbo', 'Decathlon', 'HelloFresh', 'Spotify',
]
const MERCHANTS_RISKY = [
  'Crypto-X Ltd', 'WU Transfer', 'OffshorePay', 'Marktplaats', 'QuickCash', 'GlobalWire',
]
const LOCS_KNOWN = ['Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven', 'Groningen', 'Tilburg']
const LOCS_UNKNOWN = ['Online', 'Lagos', 'Kiev', 'Onbekend', 'Offshore']

function hashStr(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function eur(n) {
  return '€ ' + Math.round(n).toLocaleString('nl-NL')
}
function hh(h) {
  return String(Math.round(h)).padStart(2, '0') + ':00'
}

function decorate(t) {
  const seed = hashStr(String(t.transaction_id))
  const ls = Number(t.location_score)
  const known = ls >= 0.4
  const merchPool = known ? MERCHANTS : MERCHANTS_RISKY
  const locPool = known ? LOCS_KNOWN : LOCS_UNKNOWN
  const merchant = merchPool[seed % merchPool.length]
  const location = locPool[(seed >> 4) % locPool.length]
  const risk = Number(t.risk)
  const status = t.status || statusFromRisk(risk)
  return {
    id: t.transaction_id,
    ref: String(t.transaction_id),
    merchant,
    location,
    initial: merchant.charAt(0),
    amount: Number(t.amount),
    amountFmt: eur(t.amount),
    hour: Number(t.hour),
    hourFmt: hh(t.hour),
    location_score: ls,
    locFmt: ls.toFixed(2),
    daily_frequency: Number(t.daily_frequency),
    freq: Math.round(Number(t.daily_frequency)),
    anomaly_score: Number(t.anomaly_score),
    risk,
    status,
    statusLabel: labelFromStatus(status),
    barColor: colorVarFromStatus(status),
    chipColor: colorVarFromStatus(status),
    is_fraud: !!t.is_fraud,
    risk_level: t.risk_level,
    // Real model output for the "why flagged" panel (absent on older responses).
    contributions: t.contributions || null,
    reasons: Array.isArray(t.reasons) ? t.reasons : null,
  }
}

// Plain-language "why flagged" verdict. Prefers the model's own data-driven
// reasons (measured against the normal crowd); falls back to a simple heuristic
// only for responses that predate the explainability fields.
function composeVerdict(parts) {
  if (parts.length === 0)
    return 'Deze transactie past binnen het normale patroon. Het model ziet geen afwijkende signalen, er zijn veel splits nodig om ’m te isoleren.'
  if (parts.length === 1)
    return 'Het model ziet ' + parts[0] + '. Daardoor wijkt de transactie af van het normale patroon en wordt ze door de detectoren snel geïsoleerd.'
  return (
    'Het model combineert ' +
    parts.slice(0, -1).join(', ') +
    ' en ' +
    parts[parts.length - 1] +
    '. Die combinatie maakt de transactie ongewoon, waardoor de detectoren ’m al snel oppikken.'
  )
}

export function buildVerdict(t) {
  if (Array.isArray(t.reasons)) return composeVerdict(t.reasons)
  // Fallback heuristic (no backend reasons available).
  const parts = []
  if (t.amount > 400) parts.push('een hoog bedrag van ' + eur(t.amount))
  if (t.hour < 6 || t.hour >= 22) parts.push('een transactie midden in de nacht (' + hh(t.hour) + ')')
  if (t.location_score < 0.4) parts.push('een onbekende locatie (' + t.location + ')')
  if (t.daily_frequency > 7) parts.push(Math.round(t.daily_frequency) + ' transacties op één dag')
  return composeVerdict(parts)
}

// Per-feature contribution bars for the detail panel. Uses the model's own
// 0-100 contribution scores (how far each feature sits from the normal crowd);
// falls back to a heuristic only when the backend didn't supply them.
function bar(label, val, pct, hi, lo) {
  const color = pct >= 60 ? 'var(--danger)' : pct >= 35 ? 'var(--warn)' : 'var(--safe)'
  return { label, val, pct, color, note: pct > 45 ? hi : lo }
}

export function detailFeatures(t) {
  const c = t.contributions
  if (c) {
    return [
      bar('Bedrag', eur(t.amount), Math.round(c.amount), 'Hoog bedrag, ongewoon', 'Normaal bedrag'),
      bar('Tijdstip', hh(t.hour), Math.round(c.hour), 'Ongewoon tijdstip', 'Overdag, normaal'),
      bar('Locatie', t.location_score.toFixed(2) + ' · ' + t.location, Math.round(c.location), 'Onbekende locatie', 'Vertrouwde locatie'),
      bar('Frequentie', Math.round(t.daily_frequency) + '× vandaag', Math.round(c.frequency), 'Ongewoon vaak', 'Normaal tempo'),
    ]
  }
  // Fallback heuristic (no backend contributions available).
  const amtN = Math.min(t.amount / 1500, 1)
  const nightN = t.hour < 6 ? 1 : t.hour >= 22 ? 0.7 : 0.06
  const locN = 1 - t.location_score
  const freqN = Math.min(t.daily_frequency / 25, 1)
  return [
    bar('Bedrag', eur(t.amount), Math.round(amtN * 100), 'Hoog bedrag, ongewoon', 'Normaal bedrag'),
    bar('Tijdstip', hh(t.hour), Math.round(nightN * 100), 'Midden in de nacht', 'Overdag, normaal'),
    bar('Locatie', t.location_score.toFixed(2) + ' · ' + t.location, Math.round(locN * 100), 'Onbekende locatie', 'Vertrouwde locatie'),
    bar('Frequentie', Math.round(t.daily_frequency) + '× vandaag', Math.round(freqN * 100), 'Ongewoon vaak', 'Normaal tempo'),
  ]
}

export function adaptResponse(resp) {
  const stats = resp.stats || {}
  const transactions = (resp.transactions || []).map(decorate)
  // Sort by risk descending so "top risk" lists are meaningful.
  transactions.sort((a, b) => b.risk - a.risk)

  const total = stats.total ?? transactions.length
  // Full-dataset band counts come from the backend; fall back to the sample.
  const sampleSusp = transactions.filter((t) => t.risk >= RISK.SUSPICIOUS && t.risk < RISK.FRAUD).length
  const sampleFraud = transactions.filter((t) => t.risk >= RISK.FRAUD).length
  const suspicious = stats.suspicious_count ?? sampleSusp
  const fraudAlerts = stats.fraud_alert_count ?? sampleFraud
  const flagged = suspicious + fraudAlerts
  const normalBand = stats.normal_band_count ?? total - flagged
  const flaggedAmount =
    stats.flagged_amount ??
    transactions.filter((t) => t.risk >= RISK.SUSPICIOUS).reduce((s, t) => s + t.amount, 0)

  return {
    source: resp.source,
    transactions,
    kpi: {
      total,
      suspicious,
      fraudAlerts,
      flagged,
      pct: total ? Math.round(flagged / total * 100) : 0,
      flaggedAmount: Math.round(flaggedAmount),
      flaggedAmountFmt: eur(flaggedAmount),
    },
    bands: { normaal: normalBand, verdacht: suspicious, fraude: fraudAlerts },
  }
}
