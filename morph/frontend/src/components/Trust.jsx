const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || String(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 3rem) clamp(1.5rem, 5vw, 3rem)' }
const h2s = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.2rem,2.5vw,1.6rem)', marginBottom: '1.5rem', textAlign: 'center' }

export default function Trust({ variant, accent, data }) {
  const a = acc(accent)
  const { headline = '', items = [] } = data || {}

  if (variant === 'metrics-bar') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)', borderTop: `1px solid ${a}22`, borderBottom: `1px solid ${a}22` }}>
      <div style={{ display: 'flex', gap: '0', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '72rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ flex: 1, minWidth: '140px', textAlign: 'center', padding: '1.25rem 1rem', borderRight: i < items.length - 1 ? '1px solid rgba(128,128,128,0.1)' : 'none' }}>
            <div style={{ fontSize: 'clamp(1.2rem,3vw,1.8rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: a, letterSpacing: '-0.03em' }}>{safeStr(item.value)}</div>
            <div style={{ color: 'var(--morph-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{safeStr(item.label)}</div>
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'guarantee') return (
    <section style={{ ...sec, textAlign: 'center', background: `${a}0a` }}>
      <div style={{ maxWidth: '36rem', margin: '0 auto' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛡️</div>
        <h2 style={{ ...h2s }}>{headline || items[0]?.label || 'Guarantee'}</h2>
        <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.7, fontSize: '0.9rem' }}>{items[0]?.value || 'Risk-free. No questions asked.'}</p>
      </div>
    </section>
  )

  if (variant === 'media-mentions') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, color: 'var(--morph-text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em' }}>As seen in</h2>
      <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {items.map((item, i) => (
          <span key={i} style={{ color: 'var(--morph-text-muted)', fontWeight: 700, fontSize: 'clamp(0.85rem,1.5vw,1.1rem)', opacity: 0.55 }}>{safeStr(item.label) || safeStr(item.value)}</span>
        ))}
      </div>
    </section>
  )

  // certifications (default)
  return (
    <section style={{ ...sec }}>
      {headline && <h2 style={h2s}>{headline}</h2>}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: '0.75rem 1.25rem', background: 'var(--morph-surface-bg)', border: `1px solid ${a}33`, borderRadius: 'var(--morph-radius)', textAlign: 'center', backdropFilter: 'var(--morph-surface-backdrop)' }}>
            <div style={{ color: a, fontWeight: 800, fontSize: '0.85rem' }}>{safeStr(item.value)}</div>
            <div style={{ color: 'var(--morph-text-muted)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{safeStr(item.label)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
