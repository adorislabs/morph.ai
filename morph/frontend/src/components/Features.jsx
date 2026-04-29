const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }

// Map icon names (Lucide/common) → emoji so they render visually
const ICON_WORDS = {
  rocket:'🚀', 'dollar-sign':'💰', dollar:'💰', money:'💰', shield:'🛡️', lock:'🔒',
  code:'⌨️', database:'🗄️', server:'🖥️', cloud:'☁️', zap:'⚡', lightning:'⚡',
  users:'👥', user:'👤', globe:'🌐', chart:'📊', 'bar-chart':'📊', 'trending-up':'📈',
  analytics:'📊', security:'🔐', api:'⚙️', scale:'⚖️', layers:'◼️', package:'📦',
  star:'⭐', award:'🏆', target:'🎯', check:'✅', 'check-circle':'✅', fire:'🔥',
  clock:'⏱️', settings:'⚙️', tool:'🔧', wrench:'🔧', gear:'⚙️', key:'🔑',
  mail:'✉️', bell:'🔔', search:'🔍', eye:'👁️', link:'🔗', send:'📤',
  credit:'💳', card:'💳', payment:'💳', invoice:'🧾', tax:'📑', report:'📋',
}
const iconEmoji = (hint) => {
  if (!hint) return '◈'
  const key = String(hint).toLowerCase().trim().replace(/[_\s]+/g, '-')
  if (ICON_WORDS[key]) return ICON_WORDS[key]
  // Try first word
  const first = key.split('-')[0]
  if (ICON_WORDS[first]) return ICON_WORDS[first]
  // If it's already an emoji or 1-2 chars, use it
  if ([...hint].length <= 2) return hint
  // Fall back to first letter as a styled monogram
  return hint.slice(0, 2).toUpperCase()
}
const h2s = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '2.5rem' }

const TermChrome = () => (
  <div style={{ background: '#161b22', padding: '0.55rem 1rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
    {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
    <span style={{ marginLeft: '1rem', color: '#6b7280', fontSize: '0.66rem', fontFamily: "'JetBrains Mono', monospace" }}>morph.ai — features</span>
  </div>
)

const card = { background: 'var(--morph-surface-bg)', border: 'var(--morph-surface-border)', boxShadow: 'var(--morph-surface-shadow)', backdropFilter: 'var(--morph-surface-backdrop)', borderRadius: 'var(--morph-radius)', padding: '1.5rem' }

export default function Features({ variant, layoutHint, accent, data }) {
  const a = acc(accent)
  const { headline = 'Features', items = [] } = data || {}

  if (variant === 'terminal-log') return (
    <section style={{ ...sec }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ background: '#0d1117', borderRadius: '10px', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", boxShadow: '0 25px 60px rgba(0,0,0,0.5)', maxWidth: '52rem', margin: '0 auto' }}>
        <TermChrome />
        <div style={{ padding: '1.5rem', fontSize: '0.8rem', lineHeight: 1.9 }}>
          {items.map((item, i) => (
            <div key={i} style={{ marginBottom: '0.5rem' }}>
              <div><span style={{ color: '#00ff41' }}>$ </span><span style={{ color: '#9cdcfe' }}>{item.title}</span></div>
              <div style={{ color: '#6b7280', paddingLeft: '1.5rem', fontSize: '0.74rem' }}>{item.description}</div>
            </div>
          ))}
          <span style={{ color: '#00ff41', animation: 'blink 1s step-end infinite' }}>█</span>
        </div>
      </div>
    </section>
  )

  if (variant === 'comparison-table') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ overflowX: 'auto', maxWidth: '52rem', margin: '0 auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--morph-font-body)' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'var(--morph-text-muted)', fontWeight: 500, fontSize: '0.82rem' }}>Capability</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: a, background: `${a}14`, fontSize: '0.82rem', fontWeight: 700 }}>This product</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: 'var(--morph-text-muted)', fontSize: '0.82rem', fontWeight: 500 }}>Others</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderTop: '1px solid rgba(128,128,128,0.12)' }}>
                <td style={{ padding: '0.875rem 1rem', color: 'var(--morph-text-secondary)', fontSize: '0.88rem' }}>{item.title}</td>
                <td style={{ padding: '0.875rem', textAlign: 'center', color: '#22c55e', background: `${a}08`, fontSize: '1.1rem' }}>✓</td>
                <td style={{ padding: '0.875rem', textAlign: 'center', color: '#ef444488', fontSize: '1.1rem' }}>✗</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )

  if (variant === 'side-by-side') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '60rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', direction: i % 2 ? 'rtl' : 'ltr' }}>
            <div style={{ direction: 'ltr' }}>
              <div style={{ color: a, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>{item.icon_hint || '→'}</div>
              <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.1rem,2vw,1.4rem)', marginBottom: '0.75rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.72 }}>{item.description}</p>
            </div>
            <div style={{ ...card, direction: 'ltr', background: `${a}0d`, border: `1px solid ${a}22`, minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3.5rem', lineHeight: 1, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.18))' }}>{iconEmoji(item.icon_hint)}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'checklist') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: layoutHint === 'centered' ? 'center' : 'left' }}>{headline}</h2>
      <div style={{ columns: items.length > 3 ? 2 : 1, gap: '1rem', maxWidth: '48rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.6rem 0', breakInside: 'avoid' }}>
            <span style={{ color: a, fontWeight: 700, fontSize: '1rem', flexShrink: 0, marginTop: '0.1rem' }}>✓</span>
            <div>
              <div style={{ color: 'var(--morph-text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</div>
              <div style={{ color: 'var(--morph-text-muted)', fontSize: '0.82rem', lineHeight: 1.55 }}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'bento-grid') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto', gap: '1rem', maxWidth: '72rem', margin: '0 auto' }}>
        {items.map((item, i) => {
          const big = i === 0
          return (
            <div key={i} style={{ ...card, gridColumn: big ? 'span 2' : 'span 1', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: big ? `${a}0e` : 'var(--morph-surface-bg)', border: big ? `1px solid ${a}33` : 'var(--morph-surface-border)', minHeight: big ? '180px' : '140px', position: 'relative', overflow: 'hidden' }}>
              {big && <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: `${a}09`, pointerEvents: 'none' }} />}
              <div style={{ color: a, fontSize: big ? '2rem' : '1.4rem' }}>{iconChar(item.icon_hint)}</div>
              <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: big ? 'clamp(1.1rem,2vw,1.4rem)' : '0.95rem', margin: 0 }}>{item.title}</h3>
              <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.86rem', lineHeight: 1.65, margin: 0 }}>{item.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )

  if (variant === 'magazine-split') return (
    <section style={{ ...sec }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '4rem', maxWidth: '72rem', margin: '0 auto', alignItems: 'flex-start' }}>
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div style={{ color: a, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '1rem', fontFamily: 'var(--morph-font-heading)' }}>Features</div>
          <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', lineHeight: 1.15, margin: '0 0 1.25rem' }}>{headline}</h2>
          <div style={{ width: '2.5rem', height: '3px', background: a, borderRadius: '2px' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2.5rem 1fr', gap: '1.25rem', padding: '1.5rem 0', borderBottom: i < items.length - 1 ? '1px solid rgba(128,128,128,0.1)' : 'none', alignItems: 'flex-start' }}>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '8px', background: `${a}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{iconChar(item.icon_hint)}</div>
              <div>
                <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.97rem', marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.87rem', lineHeight: 1.68, margin: 0 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (variant === 'icon-ribbon') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ display: 'flex', gap: '0', maxWidth: '72rem', margin: '0 auto', flexWrap: 'wrap' }}>
        {items.map((item, i) => (
          <div key={i} style={{ flex: '1 1 160px', padding: '2rem 1.5rem', textAlign: 'center', borderRight: i < items.length - 1 ? '1px solid rgba(128,128,128,0.1)' : 'none', position: 'relative' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: `${a}18`, border: `1.5px solid ${a}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', margin: '0 auto 1rem' }}>{iconChar(item.icon_hint)}</div>
            <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{item.title}</h3>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'grid-2col') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', maxWidth: '64rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ ...card }}>
            <div style={{ color: a, fontSize: '1.25rem', marginBottom: '0.75rem' }}>{iconEmoji(item.icon_hint)}</div>
            <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, marginBottom: '0.6rem' }}>{item.title}</h3>
            <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.65 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )

  // grid-3col + tabbed (default)
  return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', maxWidth: '72rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ ...card, textAlign: 'center' }}>
            <div style={{ color: a, fontSize: '1.5rem', marginBottom: '0.75rem' }}>{iconEmoji(item.icon_hint)}</div>
            <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{item.title}</h3>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
