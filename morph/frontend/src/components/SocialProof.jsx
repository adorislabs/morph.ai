const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }
const h2s = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '2.5rem', textAlign: 'center' }
const card = { background: 'var(--morph-surface-bg)', border: 'var(--morph-surface-border)', boxShadow: 'var(--morph-surface-shadow)', backdropFilter: 'var(--morph-surface-backdrop)', borderRadius: 'var(--morph-radius)', padding: '1.75rem' }

export default function SocialProof({ variant, accent, data }) {
  const a = acc(accent)
  const { headline = '', items = [] } = data || {}

  if (variant === 'masonry') {
    const cols = [items.filter((_,i) => i % 2 === 0), items.filter((_,i) => i % 2 !== 0)]
    return (
      <section style={{ ...sec }}>
        <h2 style={h2s}>{headline}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '60rem', margin: '0 auto', alignItems: 'start' }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {col.map((item, i) => (
                <div key={i} style={{ ...card, background: `${a}08`, border: `1px solid ${a}1a` }}>
                  <div style={{ color: a, fontSize: '1.5rem', lineHeight: 1, marginBottom: '0.75rem', opacity: 0.55 }}>"</div>
                  <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.72, marginBottom: '1.1rem' }}>{item.content}</p>
                  <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.76rem', fontWeight: 600, borderTop: '1px solid rgba(128,128,128,0.1)', paddingTop: '0.75rem' }}>{item.attribution}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (variant === 'split-featured') {
    const featured = items[0] || {}
    const rest = items.slice(1)
    return (
      <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
        <h2 style={h2s}>{headline}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', maxWidth: '68rem', margin: '0 auto', alignItems: 'start' }}>
          <div style={{ ...card, borderLeft: `4px solid ${a}`, padding: '2.5rem' }}>
            <div style={{ color: a, fontSize: '2.5rem', lineHeight: 1, marginBottom: '1rem', opacity: 0.5 }}>"</div>
            <p style={{ color: 'var(--morph-text-primary)', fontSize: 'clamp(0.95rem,1.8vw,1.15rem)', lineHeight: 1.75, marginBottom: '1.5rem', fontStyle: 'italic' }}>{featured.content}</p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${a}22`, border: `2px solid ${a}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a, fontWeight: 700, fontSize: '0.95rem' }}>{(featured.attribution || 'A')[0]}</div>
              <span style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', fontWeight: 600 }}>{featured.attribution}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rest.map((item, i) => (
              <div key={i} style={{ ...card }}>
                <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.86rem', lineHeight: 1.65, marginBottom: '0.75rem' }}>"{item.content}"</p>
                <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.76rem', fontWeight: 600 }}>{item.attribution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'logo-ticker') {
    const names = items.map(i => (i.attribution || i.content || 'Company').replace(/\s*logo$/i, '').trim()).filter(Boolean)
    const doubled = [...names, ...names]
    return (
      <section style={{ ...sec, overflow: 'hidden' }}>
        <h2 style={h2s}>{headline}</h2>
        <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
          <div style={{ display: 'flex', gap: '4rem', animation: 'ticker 22s linear infinite', width: 'max-content', alignItems: 'center' }}>
            {doubled.map((name, i) => (
              <span key={i} style={{ color: 'var(--morph-text-muted)', fontWeight: 700, fontSize: 'clamp(0.85rem,1.5vw,1rem)', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{name}</span>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'stat-wall') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', maxWidth: '64rem', margin: '0 auto' }}>
        {items.map((item, i) => {
          const parts = (item.content || '').split(' ')
          const val = parts[0]
          const label = parts.slice(1).join(' ') || item.attribution || ''
          return (
            <div key={i} style={{ padding: '2.5rem 1.5rem', textAlign: 'center', borderRight: i < items.length - 1 ? '1px solid rgba(128,128,128,0.1)' : 'none' }}>
              <div style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: a, letterSpacing: '-0.04em', lineHeight: 1 }}>{val}</div>
              <div style={{ color: 'var(--morph-text-muted)', fontSize: '0.82rem', marginTop: '0.6rem', lineHeight: 1.4 }}>{label}</div>
            </div>
          )
        })}
      </div>
    </section>
  )

  if (variant === 'case-study') {
    const item = items[0] || {}
    return (
      <section style={{ ...sec }}>
        <h2 style={h2s}>{headline}</h2>
        <div style={{ ...card, maxWidth: '52rem', margin: '0 auto', borderLeft: `4px solid ${a}` }}>
          <p style={{ color: 'var(--morph-text-primary)', fontSize: 'clamp(1rem,2vw,1.2rem)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.5rem' }}>"{item.content}"</p>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${a}22`, border: `2px solid ${a}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a, fontWeight: 700, fontSize: '0.85rem' }}>{(item.attribution || 'A')[0]}</div>
            <span style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', fontWeight: 500 }}>{item.attribution}</span>
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'review-feed') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '48rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ ...card, display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: '50%', background: `${a}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a, fontWeight: 700, fontSize: '0.8rem' }}>{(item.attribution || 'U')[0]}</div>
            <div>
              <div style={{ color: a, fontSize: '0.7rem', marginBottom: '0.25rem' }}>{'★'.repeat(5)}</div>
              <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.content}</p>
              <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.75rem', marginTop: '0.5rem' }}>{item.attribution}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  // quote-cards (default + video-testimonial)
  return (
    <section style={{ ...sec }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', maxWidth: '72rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ ...card }}>
            <div style={{ color: a, fontSize: '2rem', lineHeight: 1, marginBottom: '0.75rem', opacity: 0.6 }}>"</div>
            <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1.25rem' }}>{item.content}</p>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>{item.attribution}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
