const card = { padding: 22 }

const FEATURES = [
  { code: 'amount', label: 'Bedrag', note: 'Hoog bedrag is ongewoon.' },
  { code: 'hour', label: 'Tijdstip', note: 'Midden in de nacht is verdacht.' },
  { code: 'location_score', label: 'Locatie', note: '0 = onbekend, 1 = vertrouwd.' },
  { code: 'daily_frequency', label: 'Frequentie', note: 'Veel transacties op één dag.' },
]

export default function HowItWorks() {
  return (
    <div style={{ padding: '26px 28px 48px', maxWidth: 1080 }}>
      <span
        style={{
          display: 'inline-block',
          fontSize: 11,
          fontWeight: 600,
          fontFamily: "'IBM Plex Mono'",
          letterSpacing: '.14em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          marginBottom: 12,
        }}
      >
        De techniek · Isolation Forest
      </span>
      <h1 className="fd-neon" style={{ fontFamily: "'Chakra Petch'", fontSize: 30, fontWeight: 600, letterSpacing: '.01em', color: 'var(--text)', margin: '0 0 12px', lineHeight: 1.12 }}>
        Hoe pikt het model fraude eruit?
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 680, lineHeight: 1.6, margin: '0 0 28px' }}>
        Het model heeft <strong style={{ color: 'var(--text)' }}>geen voorbeelden van fraude</strong> nodig. Het leert simpelweg wat normaal is, en
        alles wat daar ver van afwijkt, valt op. Stel je een spel voor: hoe weinig vragen heb je nodig om één punt te isoleren?
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
        <div className="fd-glass" style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--safe)' }} />
            <span style={{ fontFamily: "'Chakra Petch'", fontSize: 16, fontWeight: 600 }}>Normale transactie</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', margin: '0 0 14px', lineHeight: 1.5 }}>
            Zit middenin de massa. Je moet véél keer splitsen voor je 'm los hebt.
          </p>
          <svg viewBox="0 0 260 170" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <rect x="1" y="1" width="258" height="168" rx="10" fill="color-mix(in srgb,var(--safe) 6%,transparent)" stroke="var(--border)" />
            <line x1="90" y1="6" x2="90" y2="164" stroke="var(--safe)" strokeWidth="1.5" strokeDasharray="190" strokeDashoffset="190" style={{ animation: 'fd-draw .35s var(--ease-out) forwards .4s' }} />
            <line x1="90" y1="70" x2="254" y2="70" stroke="var(--safe)" strokeWidth="1.5" strokeDasharray="170" strokeDashoffset="170" style={{ animation: 'fd-draw .35s var(--ease-out) forwards .7s' }} />
            <line x1="150" y1="70" x2="150" y2="164" stroke="var(--safe)" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="100" style={{ animation: 'fd-draw .35s var(--ease-out) forwards 1.05s' }} />
            <line x1="150" y1="118" x2="254" y2="118" stroke="var(--safe)" strokeWidth="1.5" strokeDasharray="110" strokeDashoffset="110" style={{ animation: 'fd-draw .35s var(--ease-out) forwards 1.4s' }} />
            <line x1="196" y1="70" x2="196" y2="118" stroke="var(--safe)" strokeWidth="1.5" strokeDasharray="50" strokeDashoffset="50" style={{ animation: 'fd-draw .35s var(--ease-out) forwards 1.75s' }} />
            <circle cx="40" cy="40" r="3.5" fill="var(--text3)" />
            <circle cx="55" cy="110" r="3.5" fill="var(--text3)" />
            <circle cx="120" cy="40" r="3.5" fill="var(--text3)" />
            <circle cx="125" cy="140" r="3.5" fill="var(--text3)" />
            <circle cx="220" cy="40" r="3.5" fill="var(--text3)" />
            <circle cx="230" cy="150" r="3.5" fill="var(--text3)" />
            <circle cx="60" cy="60" r="3.5" fill="var(--text3)" />
            <circle cx="175" cy="145" r="3.5" fill="var(--text3)" />
            <circle cx="173" cy="95" r="6" fill="var(--safe)" style={{ transformOrigin: '173px 95px', animation: 'fd-pop .32s var(--ease-out) backwards 2.1s' }} />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>Splits nodig</span>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 20, fontWeight: 600, color: 'var(--safe)' }}>5 · diep</span>
          </div>
        </div>

        <div className="fd-glass" style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--danger)' }} />
            <span style={{ fontFamily: "'Chakra Petch'", fontSize: 16, fontWeight: 600 }}>Verdachte transactie</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', margin: '0 0 14px', lineHeight: 1.5 }}>Staat ver van de rest. Eén splitsing en hij is al geïsoleerd.</p>
          <svg viewBox="0 0 260 170" style={{ width: '100%', height: 'auto', display: 'block' }}>
            <rect x="1" y="1" width="258" height="168" rx="10" fill="color-mix(in srgb,var(--danger) 6%,transparent)" stroke="var(--border)" />
            <line x1="200" y1="6" x2="200" y2="164" stroke="var(--danger)" strokeWidth="1.5" strokeDasharray="190" strokeDashoffset="190" style={{ animation: 'fd-draw .35s var(--ease-out) forwards .4s' }} />
            <circle cx="55" cy="60" r="3.5" fill="var(--text3)" />
            <circle cx="70" cy="100" r="3.5" fill="var(--text3)" />
            <circle cx="90" cy="70" r="3.5" fill="var(--text3)" />
            <circle cx="80" cy="130" r="3.5" fill="var(--text3)" />
            <circle cx="110" cy="110" r="3.5" fill="var(--text3)" />
            <circle cx="60" cy="90" r="3.5" fill="var(--text3)" />
            <circle cx="100" cy="50" r="3.5" fill="var(--text3)" />
            <circle cx="125" cy="85" r="3.5" fill="var(--text3)" />
            <circle cx="232" cy="40" r="6.5" fill="var(--danger)" style={{ transformOrigin: '232px 40px', animation: 'fd-pop .32s var(--ease-out) backwards .7s' }} />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
            <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>Splits nodig</span>
            <span style={{ fontFamily: "'IBM Plex Mono'", fontSize: 20, fontWeight: 600, color: 'var(--danger)' }}>1 · ondiep</span>
          </div>
        </div>
      </div>

      <div
        style={{
          background: 'color-mix(in srgb,var(--accent) 8%,var(--surface))',
          border: '1px solid color-mix(in srgb,var(--accent) 30%,var(--border))',
          borderRadius: 14,
          padding: '18px 22px',
          marginBottom: 30,
          display: 'flex',
          gap: 14,
          alignItems: 'flex-start',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--accent)" strokeWidth="1.7" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="10" cy="10" r="8.5" />
          <line x1="10" y1="9" x2="10" y2="14.5" strokeLinecap="round" />
          <circle cx="10" cy="5.8" r="1" fill="var(--accent)" stroke="none" />
        </svg>
        <p style={{ margin: 0, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.6 }}>
          <strong>Snel geïsoleerd = verdacht.</strong> Het model bouwt 200 willekeurige beslisbomen en telt gemiddeld hoeveel splits elke transactie nodig
          heeft. Weinig splits → hoge risicoscore.
        </p>
      </div>

      <h2 style={{ fontFamily: "'Chakra Petch'", fontSize: 19, fontWeight: 600, margin: '0 0 14px' }}>Waar het model naar kijkt</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {FEATURES.map((f) => (
          <div key={f.code} className="fd-glass" style={{ padding: 18 }}>
            <div style={{ fontFamily: "'IBM Plex Mono'", fontSize: 12, color: 'var(--accent)', marginBottom: 9 }}>{f.code}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 5 }}>{f.label}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.5 }}>{f.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
