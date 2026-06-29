import { PALETTES, hexA } from './theme'
import { STATUS } from './constants'

// A soft top-to-bottom gradient from a lighter tint of the colour down to the
// colour itself — gives flat segments and bars a bit of dimension.
const grad = (color) => ({
  type: 'linear',
  x: 0,
  y: 0,
  x2: 0,
  y2: 1,
  colorStops: [
    { offset: 0, color: hexA(color, 0.95) },
    { offset: 1, color: hexA(color, 0.6) },
  ],
})

// Honour the user's reduced-motion preference — ECharts' animation engine is
// outside CSS's reach, so it needs an explicit check.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Chart animation timing, aligned with the app's ~120-320ms motion vocabulary.
const anim = (ms) => {
  const d = prefersReducedMotion() ? 0 : ms
  return { animationDuration: d, animationEasing: 'cubicOut', animationDurationUpdate: d, animationEasingUpdate: 'cubicOut' }
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
          { value: bands.normaal, name: 'Normaal', itemStyle: { color: grad(p.safe) } },
          { value: bands.verdacht, name: 'Verdacht', itemStyle: { color: grad(p.warn) } },
          { value: bands.fraude, name: 'Fraude', itemStyle: { color: grad(p.danger) } },
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
        itemStyle: { color: grad(p.safe), borderRadius: [0, 0, 2, 2] },
        barWidth: '62%',
      },
      {
        name: 'Verdacht',
        type: 'bar',
        stack: 'a',
        data: susp,
        itemStyle: { color: grad(p.danger), borderRadius: [3, 3, 0, 0] },
      },
    ],
  }
}
