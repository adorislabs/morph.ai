const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || String(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }
const btnStyle = (a) => ({ display: 'inline-block', padding: '0.875rem 2.25rem', background: a, color: '#fff', border: 'none', borderRadius: 'var(--morph-radius)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--morph-font-heading)', fontSize: 'calc(0.95rem * var(--morph-font-scale, 1))' })

export default function CTA({ variant, accent, data }) {
  const a = acc(accent)
  const headline = safeStr(data?.headline, 'Ready to start?')
  const subtext = safeStr(data?.subtext, '')
  const button_text = safeStr(data?.button_text, 'Get Started')
  const secondary_action = safeStr(data?.secondary_action, '')
  const B = btnStyle(a)

  if (variant === 'proof-split') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', maxWidth: '72rem', margin: '0 auto', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.6rem,3.5vw,2.5rem)', lineHeight: 1.15, marginBottom: '1rem' }}>{headline}</h2>
          {subtext && <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>{subtext}</p>}
          <button style={B}>{button_text}</button>
          {secondary_action && <p style={{ marginTop: '1rem', color: 'var(--morph-text-muted)', fontSize: '0.82rem' }}>{secondary_action}</p>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[secondary_action, subtext, headline].filter(Boolean).slice(0, 3).map((text, i) => (
            <div key={i} style={{ padding: '1.25rem', background: 'var(--morph-bg-primary)', borderRadius: 'var(--morph-radius)', border: `1px solid ${a}18`, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: a, fontWeight: 700, flexShrink: 0, fontSize: '0.9rem' }}>✓</span>
              <span style={{ color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (variant === 'email-capture') return (
    <section style={{ ...sec, textAlign: 'center', background: `${a}0a`, borderTop: `1px solid ${a}18`, borderBottom: `1px solid ${a}18` }}>
      <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,2.2rem)', marginBottom: '0.75rem' }}>{headline}</h2>
      {subtext && <p style={{ color: 'var(--morph-text-muted)', maxWidth: '30rem', margin: '0 auto 1.75rem', lineHeight: 1.7, fontSize: '0.92rem' }}>{subtext}</p>}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '480px', margin: '0 auto' }}>
        <input type="email" placeholder="you@company.com" style={{ flex: '1 1 220px', padding: '0.85rem 1.1rem', background: 'var(--morph-bg-primary)', border: '1px solid rgba(128,128,128,0.2)', borderRadius: 'var(--morph-radius)', color: 'var(--morph-text-primary)', fontFamily: 'var(--morph-font-body)', fontSize: '0.9rem', outline: 'none' }} />
        <button style={{ ...B, padding: '0.85rem 1.5rem', flexShrink: 0 }}>{button_text}</button>
      </div>
      {secondary_action && <p style={{ marginTop: '1rem', color: 'var(--morph-text-muted)', fontSize: '0.78rem' }}>{secondary_action}</p>}
    </section>
  )

  if (variant === 'full-bleed-centered') return (
    <section style={{ background: a, padding: 'calc(var(--morph-density, 1) * 5rem) 2rem', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--morph-font-heading)', fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, color: '#fff', maxWidth: '42rem', margin: '0 auto 1rem', lineHeight: 1.15 }}>{headline}</h2>
      {subtext && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'calc(1rem * var(--morph-font-scale, 1))', maxWidth: '32rem', margin: '0 auto 2.25rem', lineHeight: 1.7 }}>{subtext}</p>}
      <button style={{ ...B, background: '#fff', color: a }}>{button_text}</button>
      {secondary_action && <p style={{ marginTop: '1.25rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{secondary_action}</p>}
    </section>
  )

  if (variant === 'split-with-visual') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '64rem', margin: '0 auto' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.6rem,3.5vw,2.5rem)', lineHeight: 1.15, marginBottom: '1rem' }}>{headline}</h2>
          {subtext && <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>{subtext}</p>}
          <button style={B}>{button_text}</button>
          {secondary_action && <p style={{ marginTop: '1rem', color: 'var(--morph-text-muted)', fontSize: '0.82rem' }}>{secondary_action}</p>}
        </div>
        <div style={{ background: `linear-gradient(135deg, ${a}18, ${a}33)`, borderRadius: 'var(--morph-radius)', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${a}33` }}>
          <span style={{ fontSize: '4rem', color: a, opacity: 0.4 }}>◈</span>
        </div>
      </div>
    </section>
  )

  if (variant === 'urgency-banner') return (
    <section style={{ background: a, padding: 'calc(var(--morph-density, 1) * 3rem) clamp(1.5rem,5vw,3rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: '#fff', fontWeight: 800, fontSize: 'clamp(1.3rem,3vw,1.9rem)', lineHeight: 1.2 }}>{headline}</h2>
        {subtext && <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.88rem', marginTop: '0.4rem' }}>{subtext}</p>}
      </div>
      <button style={{ ...B, background: '#fff', color: a, flexShrink: 0 }}>{button_text}</button>
    </section>
  )

  if (variant === 'founder-note') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <div style={{ maxWidth: '38rem', margin: '0 auto' }}>
        <p style={{ color: a, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.5rem', fontFamily: 'var(--morph-font-heading)' }}>A personal note</p>
        <p style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontSize: 'clamp(1.3rem,2.5vw,1.7rem)', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.25rem' }}>{headline}</p>
        <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.8, fontSize: 'calc(0.95rem * var(--morph-font-scale, 1))', marginBottom: '2rem' }}>{subtext}</p>
        <button style={B}>{button_text}</button>
        {secondary_action && <p style={{ marginTop: '2rem', color: 'var(--morph-text-muted)', fontStyle: 'italic', fontSize: '0.88rem', borderTop: '1px solid rgba(128,128,128,0.15)', paddingTop: '1.25rem' }}>— {secondary_action}</p>}
      </div>
    </section>
  )

  return (
    <section style={{ ...sec, textAlign: 'center', background: 'var(--morph-bg-secondary)' }}>
      <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '0.75rem' }}>{headline}</h2>
      {subtext && <p style={{ color: 'var(--morph-text-muted)', maxWidth: '28rem', margin: '0 auto 1.75rem', lineHeight: 1.7 }}>{subtext}</p>}
      <button style={B}>{button_text}</button>
      {secondary_action && <p style={{ marginTop: '1rem', color: 'var(--morph-text-muted)', fontSize: '0.82rem' }}>{secondary_action}</p>}
    </section>
  )
}
