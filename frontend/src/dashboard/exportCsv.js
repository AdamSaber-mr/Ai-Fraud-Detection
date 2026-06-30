// Exporteert de transacties als een CSV-bestand dat de browser downloadt.
export function exportTransactionsCSV(transactions) {
  // De kolommen die in het bestand komen.
  const headers = ['transactie', 'bedrag', 'uur', 'merchant', 'locatie', 'anomaly_score', 'risico', 'status']

  // Eerst de koprij, daarna een regel per transactie.
  const rows = [headers.join(',')]
  for (const t of transactions) {
    const row = [t.ref, t.amount, t.hour, t.merchant, t.location, t.anomaly_score, t.risk, t.status]
    rows.push(row.join(','))
  }
  const csv = rows.join('\n')

  // Maak er een downloadbaar bestand van en start de download automatisch.
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'fraude-resultaten.csv'
  link.click()
  URL.revokeObjectURL(url)
}
