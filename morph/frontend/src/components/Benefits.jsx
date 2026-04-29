const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || String(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }

const ICONS = { '🚀': '🚀', 'rocket': '🚀', 'lock': '🔒', 'security': '🔒', 'speed': '⚡', 'fast': '⚡', 'chart': '📈', 'analytics': '📊', 'team': '👥', 'support': '💬', 'code': '⌨️', 'api': '⌨️', 'global': '🌐', 'world': '🌐', 'check': '✓', 'star': '★', 'heart': '♥', 'bolt': '⚡', 'shield': '🔒', 'key': '🔑', 'data': '🗃️', 'ai': '✦', 'magic': '✦' }
const getIcon = (hint) => {
  if (!hint) return '◆'
  const k = hint.toLowerCase()
  for (const [word, icon] of Object.entries(ICONS)) {
    if (k.includes(word)) return icon
  }
  return '◆'
}

export default function Benefits({ variant, accent, data }) {
  const a = acc(accent)
  const headline = safeStr(data?.headline, '')
  const rawItems = Array.isArray(data?.items) ? data.items : []
  const items = rawItems.map(item => ({
    title: safeStr(item?.title, ''),
    description: safeStr(item?.description, ''),
    icon: getIcon(safeStr(item?.icon_hint, '')),
  }))
  const h2 = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', textAlign: 'center', marginBottom: '2.5rem' }

  // ALTERNATING SPLIT — each benefit alternates side with large accent number
  if (variant === 'alternating-split') return (
    <section style={{ ...sec }}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '64rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? 'auto 1fr' : '1fr auto', gap: '3.5rem', alignItems: 'center', padding: '3rem 0', borderBottom: i < items.length - 1 ? '1px solid rgba(128,128,128,0.1)' : 'none' }}>
            {i % 2 !== 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.1rem,2vw,1.4rem)', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{item.description}</p>
              </div>
            )}
            <div style={{ textAlign: i % 2 === 0 ? 'left' : 'right', flexShrink: 0 }}>
              <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: a, opacity: 0.18, lineHeight: 1, letterSpacing: '-0.04em' }}>0{i + 1}</div>
              <div style={{ fontSize: '2rem', color: a, marginTop: '-0.5rem' }}>{item.icon}</div>
            </div>
            {i % 2 === 0 && (
              <div>
                <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.1rem,2vw,1.4rem)', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{item.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )

  // SPLIT-HERO — large headline left + benefit grid right
  if (variant === 'split-hero') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', maxWidth: '72rem', margin: '0 auto', alignItems: 'flex-start' }}>
        <div style={{ position: 'sticky', top: '2rem' }}>
          {headline && <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', lineHeight: 1.15, margin: '0' }}>{headline}</h2>}
          <div style={{ width: '3rem', height: '4px', background: a, borderRadius: '2px', marginTop: '1.5rem' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {items.map((item, i) => (
            <div key={i} style={{ background: 'var(--morph-bg-primary)', borderRadius: 'var(--morph-radius)', padding: '1.5rem', border: `1px solid ${a}18` }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.4rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  // ICON LIST — vertical stacked list with large icons
  if (variant === 'icon-list') return (
    <section style={sec}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '3.5rem 1fr', gap: '1.25rem', alignItems: 'flex-start', padding: '1.5rem 0', borderBottom: i < items.length - 1 ? '1px solid rgba(128,128,128,0.1)' : 'none' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: 'var(--morph-radius)', background: `${a}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{item.icon}</div>
            <div>
              <div style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>{item.title}</div>
              <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  // TWO COL GRID — 2-column card layout
  if (variant === 'two-col-grid') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: 'var(--morph-bg-primary)', borderRadius: 'var(--morph-radius)', padding: '1.75rem', border: '1px solid rgba(128,128,128,0.1)' }}>
            <div style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{item.title}</div>
            <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.87rem', lineHeight: 1.65, margin: 0 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )

  // HORIZONTAL STRIP — inline scrollable chips / tags with descriptions
  return (
    <section style={sec}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '72rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ textAlign: 'center', maxWidth: '160px' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${a}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', margin: '0 auto 0.75rem' }}>{item.icon}</div>
            <div style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>{item.title}</div>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.78rem', lineHeight: 1.55, margin: 0 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
