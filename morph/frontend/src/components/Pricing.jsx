const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || String(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }
const h2s = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '2.5rem', textAlign: 'center' }
const btn = (a) => ({ display: 'block', width: '100%', padding: '0.875rem', textAlign: 'center', background: a, color: '#fff', border: 'none', borderRadius: 'var(--morph-radius)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--morph-font-heading)', fontSize: '0.9rem', transition: 'opacity 0.2s' })

export default function Pricing({ variant, accent, data }) {
  const a = acc(accent)
  const headline = safeStr(data?.headline, 'Pricing')
  const plans = Array.isArray(data?.plans) ? data.plans.map(p => ({
    name: safeStr(p?.name, ''),
    price: safeStr(p?.price, ''),
    description: safeStr(p?.description, ''),
    cta_text: safeStr(p?.cta_text, 'Get Started'),
    highlighted: String(p?.highlighted) === 'true',
  })) : []

  if (variant === 'single-focus') {
    const plan = plans[0] || {}
    return (
      <section style={{ ...sec, textAlign: 'center' }}>
        <h2 style={h2s}>{headline}</h2>
        <div style={{ maxWidth: '28rem', margin: '0 auto', background: 'var(--morph-surface-bg)', border: `2px solid ${a}`, borderRadius: 'var(--morph-radius)', padding: '2.5rem', boxShadow: `0 0 40px ${a}22` }}>
          <div style={{ color: a, fontFamily: 'var(--morph-font-heading)', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '1rem' }}>{plan.name}</div>
          <div style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>{plan.price}</div>
          <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.88rem', marginBottom: '2rem', lineHeight: 1.6 }}>{plan.description}</p>
          <button style={btn(a)}>{plan.cta_text}</button>
        </div>
      </section>
    )
  }

  if (variant === 'contact-sales') {
    const plan = plans[0] || {}
    // Pick 4 enterprise-sounding trust badges from description or defaults
    const desc = plan.description || ''
    const badges = desc.split(/[,;·|]+/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 40).slice(0, 4)
    const fallbackBadges = ['Custom SLA', 'SSO/SAML', 'Dedicated CSM', 'Volume pricing']
    const displayBadges = badges.length >= 2 ? badges : fallbackBadges
    return (
      <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
        <div style={{ maxWidth: '52rem', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <p style={{ color: a, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.75rem', fontFamily: 'var(--morph-font-heading)' }}>{plan.name || 'Enterprise'}</p>
            <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.2rem)', marginBottom: '1rem', lineHeight: 1.2 }}>{headline}</h2>
            <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.75, marginBottom: '1.75rem', fontSize: '0.92rem' }}>{plan.description || 'Custom pricing for your scale. Let\'s build the right package together.'}</p>
            <button style={{ ...btn(a), width: 'auto', display: 'inline-block', padding: '0.875rem 2rem' }}>{plan.cta_text}</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {displayBadges.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1.1rem', background: `${a}0d`, borderRadius: 'var(--morph-radius)', border: `1px solid ${a}22` }}>
                <span style={{ color: a, fontSize: '0.85rem', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'var(--morph-text-primary)', fontSize: '0.88rem', fontWeight: 600 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // tiered-table (default + comparison, usage-based)
  return (
    <section style={{ ...sec }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(plans.length || 1, 3)}, 1fr)`, gap: '1.25rem', maxWidth: '60rem', margin: '0 auto', alignItems: 'start' }}>
        {(plans.length > 0 ? plans : [{ name: 'Pro', price: 'Custom', description: 'Contact us for pricing.', cta_text: 'Get Started', highlighted: true }]).map((plan, i) => (
          <div key={i} style={{
            padding: '2rem', position: 'relative',
            background: plan.highlighted ? 'var(--morph-surface-bg)' : 'var(--morph-bg-secondary)',
            border: plan.highlighted ? `2px solid ${a}` : '1px solid rgba(128,128,128,0.12)',
            borderRadius: 'var(--morph-radius)',
            boxShadow: plan.highlighted ? `var(--morph-surface-shadow), 0 0 30px ${a}18` : 'none',
            backdropFilter: plan.highlighted ? 'var(--morph-surface-backdrop)' : 'none',
          }}>
            {plan.highlighted && (
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: a, color: '#fff', fontSize: '0.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.25rem 0.9rem', borderRadius: '100px', whiteSpace: 'nowrap' }}>Recommended</div>
            )}
            <div style={{ color: plan.highlighted ? a : 'var(--morph-text-secondary)', fontFamily: 'var(--morph-font-heading)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{plan.name}</div>
            <div style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{plan.price}</div>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>{plan.description}</p>
            <button style={{ display: 'block', width: '100%', padding: '0.75rem', textAlign: 'center', background: plan.highlighted ? a : 'transparent', color: plan.highlighted ? '#fff' : a, border: `1px solid ${a}`, borderRadius: 'var(--morph-radius)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--morph-font-heading)', fontSize: '0.88rem' }}>{plan.cta_text}</button>
          </div>
        ))}
      </div>
    </section>
  )
}
