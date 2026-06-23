// Risk-score bands (0-100). Kept in sync with backend/scoring.py.
export const RISK = { SUSPICIOUS: 45, FRAUD: 70 }

export const STATUS = { NORMAAL: 'normaal', VERDACHT: 'verdacht', FRAUDE: 'fraude' }

export function statusFromRisk(risk) {
  if (risk >= RISK.FRAUD) return STATUS.FRAUDE
  if (risk >= RISK.SUSPICIOUS) return STATUS.VERDACHT
  return STATUS.NORMAAL
}

const LABELS = { normaal: 'Normaal', verdacht: 'Verdacht', fraude: 'Fraude' }
export function labelFromStatus(status) {
  return LABELS[status] || LABELS.normaal
}

const COLORS = { normaal: 'var(--safe)', verdacht: 'var(--warn)', fraude: 'var(--danger)' }
export function colorVarFromStatus(status) {
  return COLORS[status] || COLORS.normaal
}
