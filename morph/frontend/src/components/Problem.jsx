const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-text-secondary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }
const h2 = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700 }

export default function Problem({ variant, layoutHint, accent, data }) {
  const a = acc(accent)
  const { headline = '', body = '', stat = '' } = data || {}

  if (variant === 'narrative-split') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '5rem', maxWidth: '72rem', margin: '0 auto', alignItems: 'center' }}>
        <div>
          <p style={{ color: a, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '1.25rem' }}>The problem</p>
          <h2 style={{ ...h2, fontSize: 'clamp(1.8rem,3.5vw,3rem)', lineHeight: 1.15, marginBottom: '1.5rem' }}>{headline}</h2>
          <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1.05rem * var(--morph-font-scale, 1))', lineHeight: 1.8 }}>{body}</p>
        </div>
        <div style={{ background: 'var(--morph-bg-primary)', borderRadius: 'var(--morph-radius)', padding: '2.5rem', border: `1px solid ${a}22`, borderLeft: `4px solid ${a}` }}>
          {stat && <div style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, color: a, fontFamily: 'var(--morph-font-heading)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.75rem' }}>{stat}</div>}
          <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.92rem', lineHeight: 1.7, fontStyle: 'italic' }}>{body}</p>
        </div>
      </div>
    </section>
  )

  if (variant === 'pain-cards') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2, fontSize: 'clamp(1.4rem,3vw,2rem)', textAlign: 'center', marginBottom: '2.5rem' }}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', maxWidth: '64rem', margin: '0 auto' }}>
        {(body || '').split(/[.;]/).filter(s => s.trim().length > 10).slice(0, 4).map((point, i) => (
          <div key={i} style={{ padding: '1.5rem', background: 'var(--morph-bg-secondary)', borderRadius: 'var(--morph-radius)', border: '1px solid rgba(239,68,68,0.12)', borderTop: '3px solid #ef4444' }}>
            <div style={{ color: '#ef4444', fontSize: '1.2rem', marginBottom: '0.75rem' }}>!</div>
            <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65 }}>{point.trim()}</p>
          </div>
        ))}
      </div>
      {stat && <div style={{ textAlign: 'center', marginTop: '2.5rem', color: a, fontWeight: 700, fontSize: '0.92rem' }}>{stat}</div>}
    </section>
  )

  if (variant === 'before-after') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={{ ...h2, fontSize: 'clamp(1.5rem,3vw,2.2rem)', textAlign: 'center', marginBottom: '2.5rem' }}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', maxWidth: '60rem', margin: '0 auto' }}>
        <div style={{ padding: '2.5rem', background: 'rgba(239,68,68,0.07)', borderLeft: '3px solid #ef4444' }}>
          <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '1rem' }}>Before</div>
          <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.75 }}>{body}</p>
        </div>
        <div style={{ padding: '2.5rem', background: `${a}11`, borderLeft: `3px solid ${a}` }}>
          <div style={{ color: a, fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '1rem' }}>After</div>
          <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.75 }}>{stat || 'Every visitor gets a page built exactly for them.'}</p>
        </div>
      </div>
    </section>
  )

  if (variant === 'data-backed') return (
    <section style={{ ...sec, textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(3.5rem,9vw,7rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: a, letterSpacing: '-0.04em', lineHeight: 0.9, marginBottom: '1.5rem' }}>{stat}</div>
      <h2 style={{ ...h2, fontSize: 'clamp(1.4rem,3vw,2rem)', maxWidth: '36rem', margin: '0 auto 1.25rem' }}>{headline}</h2>
      <p style={{ color: 'var(--morph-text-muted)', maxWidth: '28rem', margin: '0 auto', lineHeight: 1.72 }}>{body}</p>
    </section>
  )

  if (variant === 'empathy-lead') return (
    <section style={{ ...sec, maxWidth: '44rem', margin: '0 auto' }}>
      <p style={{ color: a, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.5rem', fontFamily: 'var(--morph-font-heading)' }}>We understand</p>
      <h2 style={{ ...h2, fontSize: 'clamp(1.6rem,3.5vw,2.5rem)', lineHeight: 1.2, marginBottom: '1.5rem' }}>{headline}</h2>
      <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1.05rem * var(--morph-font-scale, 1))', lineHeight: 1.8 }}>{body}</p>
      {stat && <div style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: `${a}12`, borderLeft: `3px solid ${a}`, color: 'var(--morph-text-primary)', fontStyle: 'italic', borderRadius: '0 var(--morph-radius) var(--morph-radius) 0' }}>{stat}</div>}
    </section>
  )

  // pain-agitate (default)
  const centered = layoutHint === 'centered'
  return (
    <section style={{ ...sec, textAlign: centered ? 'center' : 'left', maxWidth: centered ? '44rem' : '100%', margin: centered ? '0 auto' : '0' }}>
      <h2 style={{ ...h2, fontSize: 'clamp(1.75rem,3.5vw,2.8rem)', lineHeight: 1.15, marginBottom: '1.25rem' }}>{headline}</h2>
      <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1.05rem * var(--morph-font-scale, 1))', lineHeight: 1.8 }}>{body}</p>
      {stat && <p style={{ color: a, fontWeight: 700, fontSize: 'calc(1.05rem * var(--morph-font-scale, 1))', marginTop: '1.5rem' }}>{stat}</p>}
    </section>
  )
}
