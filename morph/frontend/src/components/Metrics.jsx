const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || String(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }

export default function Metrics({ variant, accent, data }) {
  const a = acc(accent)
  const headline = safeStr(data?.headline, '')
  const rawStats = Array.isArray(data?.stats) ? data.stats : []
  const stats = rawStats.map(s => ({
    value: safeStr(s?.value, '—'),
    label: safeStr(s?.label, ''),
    change: safeStr(s?.change, ''),
  }))
  const h2 = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', textAlign: 'center', marginBottom: '3rem' }

  // STAT CARDS — cards with large number + label + optional change indicator
  if (variant === 'stat-cards') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length || 2, 4)}, 1fr)`, gap: '1px', maxWidth: '72rem', margin: '0 auto', background: 'rgba(128,128,128,0.1)' }}>
        {(stats.length > 0 ? stats : [{ value: '—', label: '', change: '' }]).map((stat, i) => (
          <div key={i} style={{ background: 'var(--morph-bg-secondary)', padding: 'clamp(2rem,4vw,3rem) 1.5rem', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--morph-font-heading)', fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, color: a, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.5rem' }}>{stat.value}</div>
            <div style={{ color: 'var(--morph-text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.35rem' }}>{stat.label}</div>
            {stat.change && <div style={{ color: stat.change.startsWith('+') || stat.change.startsWith('↑') ? '#22c55e' : 'var(--morph-text-muted)', fontSize: '0.75rem' }}>{stat.change}</div>}
          </div>
        ))}
      </div>
    </section>
  )

  // PULSE BAR — horizontal bar chart style
  if (variant === 'pulse-bar') return (
    <section style={sec}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {stats.map((stat, i) => {
          const pct = Math.min(95, 30 + i * 18 + (parseInt(stat.value) || 0) % 40)
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--morph-text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{stat.label}</span>
                <span style={{ fontFamily: 'var(--morph-font-heading)', fontWeight: 900, fontSize: '1.2rem', color: a }}>{stat.value}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(128,128,128,0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: a, borderRadius: '999px', transition: 'width 1s ease' }} />
              </div>
              {stat.change && <div style={{ color: 'var(--morph-text-muted)', fontSize: '0.72rem', marginTop: '0.3rem' }}>{stat.change}</div>}
            </div>
          )
        })}
      </div>
    </section>
  )

  // COMPARISON BAR — side by side big numbers (default)
  return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(3rem,8vw,7rem)', flexWrap: 'wrap', maxWidth: '72rem', margin: '0 auto' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: '120px' }}>
            <div style={{ fontFamily: 'var(--morph-font-heading)', fontSize: 'clamp(2.8rem,7vw,5rem)', fontWeight: 900, color: i === 0 ? a : 'var(--morph-text-primary)', letterSpacing: '-0.05em', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ color: 'var(--morph-text-secondary)', fontSize: '0.82rem', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</div>
            {stat.change && <div style={{ color: '#22c55e', fontSize: '0.72rem', marginTop: '0.25rem' }}>{stat.change}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}
