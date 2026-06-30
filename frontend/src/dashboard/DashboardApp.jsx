import { useEffect, useRef, useState } from 'react'
import './styles/index.css'
import { cssVars } from './theme'
import { loadDemoData, uploadCSV } from './api'
import { adaptResponse } from './adapt'
import { exportTransactionsCSV } from './exportCsv'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import DataScreen from './components/DataScreen'
import Dashboard from './components/Dashboard'
import TransactionsScreen from './components/TransactionsScreen'
import HowItWorks from './components/HowItWorks'
import DetailPanel from './components/DetailPanel'
import EmptyState from './components/EmptyState'
import LoadingOverlay from './components/LoadingOverlay'
import Toast from './components/Toast'

// Dark-only: the dashboard wears the landing story's aubergine/lavender skin.
const theme = 'donker'

export default function App() {
  const [screen, setScreen] = useState('data')
  const [filter, setFilter] = useState('alle')
  const [loading, setLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)
  const [data, setData] = useState(null)
  const [selId, setSelId] = useState(null)
  const [toast, setToast] = useState('')
  const [error, setError] = useState(null)

  const stepTimer = useRef(null)
  const toastTimer = useRef(null)

  useEffect(
    () => () => {
      clearInterval(stepTimer.current)
      clearTimeout(toastTimer.current)
    },
    [],
  )

  const flash = (msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(''), 2800)
  }

  // Runs the loading overlay (stepped) while the real backend request resolves.
  const runRequest = async (request, successMsg) => {
    if (loading) return
    setError(null)
    setLoading(true)
    setLoadStep(0)
    setToast('')
    clearInterval(stepTimer.current)
    stepTimer.current = setInterval(() => {
      setLoadStep((s) => Math.min(s + 1, 2))
    }, 480)

    const startedAt = Date.now()
    try {
      const resp = await request()
      if (resp.data.status === 'error') throw new Error(resp.data.message || 'Onbekende fout')
      const adapted = adaptResponse(resp.data)
      // Let the training animation breathe for at least ~1.2s.
      const elapsed = Date.now() - startedAt
      if (elapsed < 1200) await new Promise((r) => setTimeout(r, 1200 - elapsed))
      clearInterval(stepTimer.current)
      setData(adapted)
      setScreen('dashboard')
      setLoading(false)
      flash(successMsg)
    } catch (e) {
      clearInterval(stepTimer.current)
      setLoading(false)
      const msg = e.response?.data?.message || e.message || 'Er ging iets mis bij het verwerken.'
      setError(msg)
    }
  }

  const onLoadDemo = () => runRequest(loadDemoData, 'Demo data geladen, model uitgevoerd')
  const onUpload = (file) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Alleen .csv-bestanden worden ondersteund.')
      return
    }
    runRequest(() => uploadCSV(file), `“${file.name}” verwerkt, model uitgevoerd`)
  }

  const onNav = (s) => {
    setScreen(s)
    setSelId(null)
  }

  const hasData = !!data
  const selectedTx = hasData && selId != null ? data.transactions.find((t) => t.id === selId) : null

  const showDashboard = screen === 'dashboard' && hasData
  const showTx = screen === 'transacties' && hasData
  const showEmpty = (screen === 'dashboard' || screen === 'transacties') && !hasData

  return (
    <div
      className="fd-theme-fade fd-depth"
      style={{
        ...cssVars(theme),
        colorScheme: 'dark',
        display: 'flex',
        height: '100vh',
        minHeight: 620,
        width: '100%',
        color: 'var(--text)',
        fontFamily: "'IBM Plex Sans',system-ui,sans-serif",
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div className="fd-aurora" aria-hidden>
        <b className="a1" />
        <b className="a2" />
        <b className="a3" />
      </div>

      <Sidebar screen={screen} onNav={onNav} />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Topbar onExport={hasData ? () => exportTransactionsCSV(data.transactions) : null} />

        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          {error && (
            <div style={{ padding: '16px 28px 0' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  background: 'color-mix(in srgb,var(--danger) 12%,var(--surface))',
                  border: '1px solid color-mix(in srgb,var(--danger) 45%,var(--border))',
                  borderRadius: 12,
                  padding: '12px 16px',
                  color: 'var(--text)',
                }}
              >
                <span style={{ fontSize: 13.5 }}>
                  <strong style={{ color: 'var(--danger)' }}>Fout:</strong> {error}
                </span>
                <button
                  onClick={() => setError(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {screen === 'data' && <DataScreen onLoadDemo={onLoadDemo} onUpload={onUpload} />}

          {showEmpty && <EmptyState onGoData={() => setScreen('data')} />}

          {showDashboard && (
            <Dashboard
              kpi={data.kpi}
              bands={data.bands}
              transactions={data.transactions}
              theme={theme}
              onRowClick={setSelId}
              onGoTx={() => setScreen('transacties')}
            />
          )}

          {showTx && (
            <TransactionsScreen transactions={data.transactions} filter={filter} onFilter={setFilter} onRowClick={setSelId} />
          )}

          {screen === 'uitleg' && <HowItWorks />}
        </div>
      </main>

      {selectedTx && <DetailPanel tx={selectedTx} onClose={() => setSelId(null)} />}
      {loading && <LoadingOverlay step={loadStep} />}
      <Toast message={toast} />
    </div>
  )
}
