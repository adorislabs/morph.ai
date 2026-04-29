// safeStr: Gemini sometimes returns {text, link} objects instead of strings
const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || JSON.stringify(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-text-primary)'

const btn = (a, style = {}) => ({
  display: 'inline-block', padding: '0.875rem 2.25rem', background: a, color: '#fff',
  border: 'none', borderRadius: 'var(--morph-radius)', fontWeight: 700, cursor: 'pointer',
  fontFamily: 'var(--morph-font-heading)', fontSize: 'calc(0.95rem * var(--morph-font-scale, 1))',
  transition: 'opacity 0.2s', ...style,
})

export default function Hero({ variant, layoutHint, accent, data }) {
  const a = acc(accent)
  const title = safeStr(data?.title, 'Transform Every Visit')
  const subtitle = safeStr(data?.subtitle, 'AI-powered personalization that converts.')
  const cta_text = safeStr(data?.cta_text, 'Get Started')
  const supporting = safeStr(data?.supporting_element, '')
  const B = btn(a)
  const h1 = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', lineHeight: 1.1, fontWeight: 800 }

  // 1. CINEMATIC — full-screen atmospheric, ghosted word behind
  if (variant === 'cinematic') return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(3rem,8vw,6rem) 2rem', position: 'relative', overflow: 'hidden' }}>
      {data?.image_b64 && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <img src={`data:image/jpeg;base64,${data.image_b64}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.12, filter: 'blur(2px) saturate(0.5)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, var(--morph-bg-primary) 0%, transparent 30%, transparent 70%, var(--morph-bg-primary) 100%)' }} />
        </div>
      )}
      {!data?.image_b64 && (
        <div aria-hidden style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ fontSize: 'clamp(7rem,22vw,18rem)', fontWeight: 900, opacity: 0.035, fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', whiteSpace: 'nowrap', lineHeight: 1 }}>
            {(title || 'MORPH').split(' ')[0].toUpperCase()}
          </span>
        </div>
      )}
      {supporting && <p style={{ color: a, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.22em', marginBottom: '2rem' }}>{supporting}</p>}
      <h1 style={{ ...h1, fontSize: 'clamp(2.5rem,6vw,5rem)', maxWidth: '44rem', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>{title}</h1>
      <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1.1rem * var(--morph-font-scale, 1))', maxWidth: '32rem', lineHeight: 1.75, marginBottom: '2.75rem' }}>{subtitle}</p>
      <button style={B}>{cta_text}</button>
    </section>
  )

  // 2. SPLIT-CODE — left copy, right terminal window
  if (variant === 'split-code') return (
    <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', padding: 'clamp(4rem,10vw,7rem) 3rem', minHeight: '85vh' }}>
      <div>
        <h1 style={{ ...h1, fontSize: 'clamp(2rem,4vw,3.2rem)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1.05rem * var(--morph-font-scale, 1))', lineHeight: 1.72, marginBottom: '2.25rem' }}>{subtitle}</p>
        <button style={B}>{cta_text}</button>
      </div>
      <div style={{ background: '#0d1117', borderRadius: '10px', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.78rem', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ background: '#161b22', padding: '0.55rem 1rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <div style={{ padding: '1.5rem', lineHeight: 2, color: '#cdd9e5' }}>
          <div><span style={{ color: '#4ec9b0' }}>$</span> <span style={{ color: '#9cdcfe' }}>morph personalize</span> <span style={{ color: '#ce9178' }}>--url</span> <span style={{ color: '#b5cea8' }}>site.com</span></div>
          <div style={{ color: '#6b9955' }}>  ✓ Content extracted {supporting ? `(${supporting})` : ''}</div>
          <div style={{ color: '#6b9955' }}>  ✓ Persona analyzed</div>
          <div style={{ color: '#6b9955' }}>  ✓ Components selected</div>
          <div><span style={{ color: '#4ec9b0' }}>→ Page ready</span><span style={{ animation: 'blink 1s step-end infinite', color: '#4ec9b0' }}>█</span></div>
        </div>
      </div>
    </section>
  )

  // 3. STAT-DRIVEN — giant stat number dominates, copy beneath
  if (variant === 'stat-driven') return (
    <section style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(3rem,8vw,6rem) 2rem' }}>
      <div style={{ fontSize: 'clamp(5rem,18vw,13rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: a, lineHeight: 0.9, marginBottom: '1.5rem', letterSpacing: '-0.05em' }}>{supporting || '10×'}</div>
      <h1 style={{ ...h1, fontSize: 'clamp(1.4rem,3vw,2.4rem)', maxWidth: '36rem', marginBottom: '1rem' }}>{title}</h1>
      <p style={{ color: 'var(--morph-text-muted)', fontSize: 'calc(1rem * var(--morph-font-scale, 1))', maxWidth: '28rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>{subtitle}</p>
      <button style={B}>{cta_text}</button>
    </section>
  )

  // 4. EDITORIAL — large left image block, right text column
  const imageB64 = data?.image_b64
  if (variant === 'editorial') return (
    <section style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', minHeight: '85vh' }}>
      <div style={{ background: 'var(--morph-bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: imageB64 ? 0 : '3rem', position: 'relative', overflow: 'hidden' }}>
        {imageB64 ? (
          <img
            src={`data:image/jpeg;base64,${imageB64}`}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }}
          />
        ) : (
          <div style={{ width: '75%', aspectRatio: '4/3', background: `linear-gradient(135deg, ${a}1a, ${a}33)`, borderRadius: 'var(--morph-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${a}22` }}>
            <span style={{ color: a, opacity: 0.5, fontSize: '3.5rem' }}>◈</span>
          </div>
        )}
        {supporting && <span style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: a, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.68rem', opacity: 0.6, background: 'rgba(0,0,0,0.45)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>{supporting}</span>}
      </div>
      <div style={{ padding: 'clamp(3rem,6vw,5rem) 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ ...h1, fontSize: 'clamp(1.8rem,3vw,2.7rem)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ color: 'var(--morph-text-secondary)', lineHeight: 1.72, marginBottom: '2rem' }}>{subtitle}</p>
        <button style={B}>{cta_text}</button>
      </div>
    </section>
  )

  // 5. ASYMMETRIC-BOLD — massive bottom-anchored title, body + CTA lower right
  if (variant === 'asymmetric-bold') return (
    <section style={{ padding: 'clamp(4rem,10vw,7rem) 3rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden', position: 'relative' }}>
      <div aria-hidden style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '45%', height: '80%', background: `linear-gradient(135deg, ${a}0d, ${a}1a)`, borderRadius: 'var(--morph-radius)', transform: 'rotate(3deg)' }} />
      <h1 style={{ ...h1, fontSize: 'clamp(3rem,9vw,7.5rem)', letterSpacing: '-0.04em', maxWidth: '80%', marginBottom: '2rem', lineHeight: 0.92 }}>{title}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'flex-end' }}>
        <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1.05rem * var(--morph-font-scale, 1))', lineHeight: 1.7 }}>{subtitle}</p>
        <div style={{ textAlign: 'right' }}>
          {supporting && <p style={{ color: a, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', marginBottom: '1rem' }}>{supporting}</p>}
          <button style={B}>{cta_text}</button>
        </div>
      </div>
    </section>
  )

  // 6. MANIFESTO — full-bleed typography statement, no decoration
  if (variant === 'manifesto') return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(4rem,10vw,8rem) clamp(2rem,8vw,8rem)', borderBottom: `1px solid rgba(128,128,128,0.12)` }}>
      {supporting && <p style={{ color: a, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.28em', marginBottom: '3rem', fontFamily: 'var(--morph-font-heading)' }}>{supporting}</p>}
      <h1 style={{ fontFamily: 'var(--morph-font-heading)', fontWeight: 900, fontSize: 'clamp(2.5rem,7vw,6rem)', color: 'var(--morph-text-primary)', lineHeight: 1.05, maxWidth: '22ch', marginBottom: '3rem', letterSpacing: '-0.03em' }}>
        {title.split(' ').map((word, i) => (
          <span key={i} style={{ display: 'inline-block', marginRight: '0.3em', color: i % 4 === 2 ? a : 'var(--morph-text-primary)' }}>{word}</span>
        ))}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
        <button style={B}>{cta_text}</button>
        <p style={{ color: 'var(--morph-text-muted)', fontSize: 'calc(0.95rem * var(--morph-font-scale, 1))', maxWidth: '28rem', lineHeight: 1.7 }}>{subtitle}</p>
      </div>
    </section>
  )

  // 8. PRODUCT-HERO — text left, framed screenshot right
  if (variant === 'product-hero') return (
    <section style={{ minHeight: '92vh', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '4rem', alignItems: 'center', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,3rem)', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      <div>
        {supporting && <p style={{ color: a, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.25rem', fontFamily: 'var(--morph-font-heading)' }}>{supporting}</p>}
        <h1 style={{ ...h1, fontSize: 'clamp(2rem,4vw,3.5rem)', marginBottom: '1.25rem', letterSpacing: '-0.025em' }}>{title}</h1>
        <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1rem * var(--morph-font-scale, 1))', lineHeight: 1.78, maxWidth: '36rem', marginBottom: '2.25rem' }}>{subtitle}</p>
        <button style={B}>{cta_text}</button>
      </div>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(128,128,128,0.14)', boxShadow: '0 24px 64px rgba(0,0,0,0.22)', background: 'var(--morph-bg-secondary)' }}>
        {data?.image_b64
          ? <img src={`data:image/jpeg;base64,${data.image_b64}`} alt="product" style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top' }} />
          : (
            <>
              <div style={{ background: 'rgba(0,0,0,0.08)', padding: '0.65rem 1rem', display: 'flex', gap: '5px', alignItems: 'center', borderBottom: '1px solid rgba(128,128,128,0.1)' }}>
                {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.65 }} />)}
              </div>
              <div style={{ padding: '2rem', minHeight: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '4rem', color: a, opacity: 0.2 }}>◈</span>
              </div>
            </>
          )
        }
      </div>
    </section>
  )

  // 9. SPLIT-BENEFITS — headline left, bullet benefits right
  if (variant === 'split-benefits') return (
    <section style={{ minHeight: '80vh', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,3rem)', maxWidth: '1200px', margin: '0 auto', gap: '5rem', boxSizing: 'border-box' }}>
      <div>
        {supporting && <p style={{ color: a, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '1.25rem' }}>{supporting}</p>}
        <h1 style={{ ...h1, fontSize: 'clamp(2.2rem,4.5vw,4rem)', letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>{title}</h1>
        <button style={B}>{cta_text}</button>
      </div>
      <div>
        <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1rem * var(--morph-font-scale, 1))', lineHeight: 1.78, marginBottom: '2rem' }}>{subtitle}</p>
        {supporting && supporting.includes(',') && supporting.split(',').map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.9rem' }}>
            <span style={{ color: a, fontWeight: 700, flexShrink: 0, marginTop: '0.05rem' }}>✓</span>
            <span style={{ color: 'var(--morph-text-primary)', fontSize: '0.92rem' }}>{item.trim()}</span>
          </div>
        ))}
      </div>
    </section>
  )

  // 7. VS-COMPARISON — two-column before/after or self vs others
  if (variant === 'vs-comparison') return (
    <section style={{ minHeight: '85vh', display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '85vh' }}>
      <div style={{ padding: 'clamp(3rem,6vw,5rem)', background: 'var(--morph-bg-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(128,128,128,0.12)' }}>
        <div style={{ color: 'var(--morph-text-muted)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>Before</div>
        <p style={{ color: 'var(--morph-text-muted)', fontSize: 'clamp(1rem,2vw,1.3rem)', lineHeight: 1.6, fontStyle: 'italic' }}>{subtitle}</p>
      </div>
      <div style={{ padding: 'clamp(3rem,6vw,5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: `${a}0a` }}>
        <div style={{ color: a, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>After</div>
        <h1 style={{ ...h1, fontSize: 'clamp(1.8rem,3.5vw,3rem)', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>{title}</h1>
        {supporting && <p style={{ color: a, fontSize: '0.78rem', fontFamily: "'JetBrains Mono', monospace", marginBottom: '1.5rem' }}>{supporting}</p>}
        <button style={B}>{cta_text}</button>
      </div>
    </section>
  )

  // 10. TYPEWRITER / default: minimal-centered
  return (
    <section style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(4rem,10vw,8rem) 2rem' }}>
      {supporting && <p style={{ color: a, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '2rem' }}>{supporting}</p>}
      <h1 style={{ ...h1, fontSize: 'clamp(2.2rem,5.5vw,4.5rem)', maxWidth: '44rem', marginBottom: '1.25rem', letterSpacing: '-0.025em' }}>{title}</h1>
      <p style={{ color: 'var(--morph-text-secondary)', fontSize: 'calc(1.1rem * var(--morph-font-scale, 1))', maxWidth: '32rem', lineHeight: 1.75, marginBottom: '2.75rem' }}>{subtitle}</p>
      <button style={B}>{cta_text}</button>
    </section>
  )
}
