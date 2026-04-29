const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || String(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }

function ProductShot({ b64, alt, style }) {
  if (b64) {
    return <img src={`data:image/jpeg;base64,${b64}`} alt={alt || 'Product screenshot'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
  }
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(128,128,128,0.06), rgba(128,128,128,0.14))', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <div style={{ textAlign: 'center', color: 'rgba(128,128,128,0.3)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⬚</div>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product Screenshot</div>
      </div>
    </div>
  )
}

export default function Showcase({ variant, accent, data }) {
  const a = acc(accent)
  const headline = safeStr(data?.headline, '')
  const subtitle = safeStr(data?.subtitle, '')
  const image_b64 = data?.image_b64 || null
  const feature_tags = Array.isArray(data?.feature_tags)
    ? data.feature_tags.map(t => safeStr(t))
    : typeof data?.feature_tags === 'string'
    ? data.feature_tags.split(',').map(t => t.trim()).filter(Boolean)
    : []
  const h2 = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.5rem,3vw,2.2rem)', marginBottom: '1rem', letterSpacing: '-0.02em' }

  // BROWSER CHROME — screenshot in a browser window frame
  if (variant === 'browser-chrome') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      {headline && <h2 style={{ ...h2, textAlign: 'center' }}>{headline}</h2>}
      {subtitle && <p style={{ textAlign: 'center', color: 'var(--morph-text-secondary)', maxWidth: '38rem', margin: '0 auto 2.5rem', lineHeight: 1.7 }}>{subtitle}</p>}
      <div style={{ maxWidth: '72rem', margin: '0 auto', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.3)', border: '1px solid rgba(128,128,128,0.15)' }}>
        {/* Browser chrome */}
        <div style={{ background: '#1e1e1e', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', gap: '5px' }}>
            {['#ff5f57', '#febc2e', '#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, marginLeft: '0.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '22px', display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', fontFamily: 'monospace' }}>https://...</span>
          </div>
        </div>
        <div style={{ height: 'clamp(280px, 48vh, 560px)', overflow: 'hidden' }}>
          <ProductShot b64={image_b64} alt={headline} style={{ height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
        </div>
      </div>
      {feature_tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
          {feature_tags.map((tag, i) => (
            <span key={i} style={{ padding: '0.3rem 0.9rem', borderRadius: '999px', border: `1px solid ${a}44`, color: a, fontSize: '0.78rem', fontFamily: 'var(--morph-font-heading)', fontWeight: 600 }}>{tag}</span>
          ))}
        </div>
      )}
    </section>
  )

  // MOCKUP SPLIT — left content, right screenshot
  if (variant === 'mockup-split') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '4rem', alignItems: 'center', maxWidth: '72rem', margin: '0 auto' }}>
        <div>
          {headline && <h2 style={h2}>{headline}</h2>}
          {subtitle && <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>{subtitle}</p>}
          {feature_tags.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              {feature_tags.map((tag, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--morph-text-primary)', fontSize: '0.9rem' }}>
                  <span style={{ color: a, fontSize: '0.75rem' }}>✓</span>
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ borderRadius: 'var(--morph-radius)', overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', border: '1px solid rgba(128,128,128,0.12)', aspectRatio: '16/10' }}>
          <ProductShot b64={image_b64} alt={headline} style={{ height: '100%' }} />
        </div>
      </div>
    </section>
  )

  // FEATURE HIGHLIGHT — image top with feature tags below
  return (
    <section style={sec}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', textAlign: 'center' }}>
        {headline && <h2 style={{ ...h2, textAlign: 'center' }}>{headline}</h2>}
        {subtitle && <p style={{ color: 'var(--morph-text-secondary)', marginBottom: '2.5rem', lineHeight: 1.7 }}>{subtitle}</p>}
        <div style={{ borderRadius: 'var(--morph-radius)', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: `1px solid ${a}22`, aspectRatio: '16/9', marginBottom: '2rem' }}>
          <ProductShot b64={image_b64} alt={headline} style={{ height: '100%' }} />
        </div>
        {feature_tags.length > 0 && (
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {feature_tags.map((tag, i) => (
              <span key={i} style={{ color: 'var(--morph-text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: a }}>◆</span>{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
