// Voorbeelddata voor het prototype — geen echte transacties.

export const TX = [
  { m: 'Onbekende begunstigde', loc: '—',        time: '01:58', amt: '€ 1.880', risk: 92, st: 'fraude' },
  { m: 'Crypto-X Ltd',          loc: 'Lagos',    time: '02:14', amt: '€ 1.700', risk: 87, st: 'fraude' },
  { m: 'WU Transfer',           loc: 'Kiev',     time: '03:41', amt: '€ 1.520', risk: 82, st: 'fraude' },
  { m: 'Late overboeking',      loc: '—',        time: '23:50', amt: '€ 580',   risk: 51, st: 'verdacht' },
  { m: 'Coolblue',              loc: 'Amsterdam',time: '13:12', amt: '€ 129',   risk: 22, st: 'normaal' },
  { m: 'Shell',                 loc: 'Den Haag', time: '18:45', amt: '€ 61',    risk: 14, st: 'normaal' },
  { m: 'Bol.com',               loc: 'Utrecht',  time: '11:20', amt: '€ 38',    risk: 11, st: 'normaal' },
  { m: 'Albert Heijn',          loc: 'Rotterdam',time: '14:03', amt: '€ 42',    risk: 8,  st: 'normaal' },
]

export const ST_LABEL = { fraude: 'Fraude', verdacht: 'Verdacht', normaal: 'Normaal' }

// transacties per uur (0..23)
export const HOURS = [3, 6, 8, 5, 2, 1, 1, 2, 4, 9, 14, 17, 15, 16, 13, 12, 11, 13, 15, 10, 7, 5, 8, 6]
export const FLAG_HOURS = [1, 2, 3, 23]

// de uitgelichte signalen in het verhaal
export const SIGNALS = [
  {
    rank: '01', merchant: 'Crypto-X Ltd', meta: ['Lagos', '02:14', '38× / dag'],
    why: 'Een hoog bedrag, midden in de nacht, naar een locatie die het model nooit eerder zag — en bijna veertig keer op één dag. Elk kenmerk apart kan; deze combinatie niet.',
    risk: 87, amt: '€ 1.700', score: '−0.74',
  },
  {
    rank: '02', merchant: 'WU Transfer', meta: ['Kiev', '03:41', '31× / dag'],
    why: 'Een overboeking ver buiten het normale patroon, op een tijdstip waarop dit account vrijwel nooit actief is. De frequentie verraadt geautomatiseerd gedrag.',
    risk: 82, amt: '€ 1.520', score: '−0.69',
  },
  {
    rank: '03', merchant: 'Onbekende begunstigde', meta: ['—', '01:58', '26× / dag'],
    why: 'Geen herkenbare tegenpartij, een bedrag bijna vijftig keer hoger dan gebruikelijk, en een locatiescore tegen nul. Het model isoleert deze betaling vrijwel meteen.',
    risk: 92, amt: '€ 1.880', score: '−0.81',
  },
]
