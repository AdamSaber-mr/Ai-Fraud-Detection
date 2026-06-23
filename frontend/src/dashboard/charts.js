import { PALETTES, hexA } from './theme'
import { STATUS } from './constants'

const eur = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL')
const hh = (h) => String(Math.round(h)).padStart(2, '0') + ':00'

// Honour the user's reduced-motion preference — ECharts' animation engine is
// outside CSS's reach, so it needs an explicit check.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Chart animation timing, aligned with the app's ~120-320ms motion vocabulary.
const anim = (ms) => {
  const d = prefersReducedMotion() ? 0 : ms
  return { animationDuration: d, animationEasing: 'cubicOut', animationDurationUpdate: d, animationEasingUpdate: 'cubicOut' }
}

// 3D point cloud — every transaction is a dot; outliers drift to the edges and
// colour red. Uses echarts-gl scatter3D with auto-rotation, mirroring the design.
export function scatterOption(transactions, theme) {
  const p = PALETTES[theme] || PALETTES.donker
  const pts = transactions.map((t) => [t.amount, t.hour, t.daily_frequency, t.risk])
  const axis = (name, extra = {}) => ({
    name,
    type: 'value',
    nameTextStyle: { color: p.text3, fontSize: 11 },
    axisLine: { lineStyle: { color: p.axis } },
    axisLabel: { color: p.text3, fontSize: 10 },
    splitLine: { lineStyle: { color: p.split } },
    ...extra,
  })
  return {
    ...anim(280),
    tooltip: {
      backgroundColor: p.surface,
      borderColor: p.border,
      textStyle: { color: p.text, fontSize: 12 },
      formatter: (pm) =>
        'Bedrag: ' + eur(pm.value[0]) +
        '<br>Uur: ' + hh(pm.value[1]) +
        '<br>Frequentie: ' + Math.round(pm.value[2]) + '×' +
        '<br>Risico: ' + pm.value[3],
    },
    visualMap: {
      show: false,
      dimension: 3,
      min: 0,
      max: 100,
      inRange: { color: [p.safe, p.warn, p.danger] },
    },
    xAxis3D: axis('bedrag'),
    yAxis3D: axis('uur', { min: 0, max: 24 }),
    zAxis3D: axis('freq'),
    grid3D: {
      boxWidth: 100,
      boxDepth: 100,
      boxHeight: 75,
      axisLine: { lineStyle: { color: p.axis } },
      axisPointer: { lineStyle: { color: p.text3 } },
      splitLine: { lineStyle: { color: p.split } },
      // blend the 3D scene into the page's depth backdrop (no visible card box)
      environment: 'transparent',
      viewControl: {
        autoRotate: true,
        autoRotateSpeed: 9,
        distance: 185,
        alpha: 18,
        beta: 30,
        rotateSensitivity: 1,
      },
      left: 0,
      right: 0,
      top: -8,
      bottom: 0,
    },
    series: [
      {
        type: 'scatter3D',
        data: pts,
        symbolSize: (v) => 5 + (v[3] / 100) * 14,
        itemStyle: { opacity: 0.88, borderWidth: 0 },
        emphasis: { itemStyle: { color: p.accent, opacity: 1 } },
      },
    ],
  }
}

// Status distribution donut (Normaal / Verdacht / Fraude).
export function donutOption(bands, theme) {
  const p = PALETTES[theme] || PALETTES.donker
  return {
    ...anim(280),
    tooltip: {
      backgroundColor: p.surface,
      borderColor: p.border,
      textStyle: { color: p.text, fontSize: 12 },
      formatter: '{b}: {c} ({d}%)',
    },
    series: [
      {
        type: 'pie',
        radius: ['62%', '86%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        padAngle: 2,
        itemStyle: { borderRadius: 5, borderColor: p.surface, borderWidth: 2 },
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value: bands.normaal, name: 'Normaal', itemStyle: { color: p.safe } },
          { value: bands.verdacht, name: 'Verdacht', itemStyle: { color: p.warn } },
          { value: bands.fraude, name: 'Fraude', itemStyle: { color: p.danger } },
        ],
      },
    ],
  }
}

// Transactions per hour, stacked: normal vs suspicious+fraud.
export function barOption(transactions, theme) {
  const p = PALETTES[theme] || PALETTES.donker
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const normal = hours.map((h) => transactions.filter((t) => t.hour === h && t.status === STATUS.NORMAAL).length)
  const susp = hours.map((h) => transactions.filter((t) => t.hour === h && t.status !== STATUS.NORMAAL).length)
  return {
    ...anim(240),
    tooltip: {
      trigger: 'axis',
      backgroundColor: p.surface,
      borderColor: p.border,
      textStyle: { color: p.text, fontSize: 12 },
      axisPointer: { type: 'shadow' },
    },
    grid: { left: 8, right: 8, top: 14, bottom: 22, containLabel: true },
    xAxis: {
      type: 'category',
      data: hours.map((h) => String(h).padStart(2, '0')),
      axisLine: { lineStyle: { color: p.border } },
      axisTick: { show: false },
      axisLabel: { color: p.text3, fontSize: 10, interval: 2 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: p.split } },
      axisLabel: { color: p.text3, fontSize: 10 },
    },
    series: [
      {
        name: 'Normaal',
        type: 'bar',
        stack: 'a',
        data: normal,
        itemStyle: { color: hexA(p.safe, 0.55), borderRadius: [0, 0, 2, 2] },
        barWidth: '62%',
      },
      {
        name: 'Verdacht',
        type: 'bar',
        stack: 'a',
        data: susp,
        itemStyle: { color: p.danger, borderRadius: [3, 3, 0, 0] },
      },
    ],
  }
}
