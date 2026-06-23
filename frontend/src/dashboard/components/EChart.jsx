import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import 'echarts-gl' // side-effect: registers scatter3D / grid3D

// Thin React wrapper around an ECharts instance. Re-applies `option` whenever it
// changes (notMerge), keeps the chart sized to its container, and disposes on unmount.
export default function EChart({ option, style }) {
  const elRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return
    const chart = echarts.init(el)
    chartRef.current = chart
    const onResize = () => {
      try {
        chart.resize()
      } catch {
        /* noop */
      }
    }
    window.addEventListener('resize', onResize)
    // Container size may settle a frame after mount (flex/grid layout).
    const t = setTimeout(onResize, 60)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(t)
      chart.dispose()
      chartRef.current = null
    }
  }, [])

  useEffect(() => {
    const chart = chartRef.current
    if (chart && option) {
      try {
        chart.setOption(option, true)
      } catch {
        /* noop */
      }
    }
  }, [option])

  return <div ref={elRef} style={{ width: '100%', ...style }} />
}
