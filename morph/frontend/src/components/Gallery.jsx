const safeStr = (v, fallback = '') => {
  if (v === null || v === undefined) return fallback
  if (typeof v === 'object') return v.text || v.label || v.value || String(v)
  return String(v)
}

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }

function ImgOrPlaceholder({ b64, alt, style }) {
  if (b64) {
    return <img src={`data:image/jpeg;base64,${b64}`} alt={alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />
  }
  return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(128,128,128,0.08), rgba(128,128,128,0.16))', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <span style={{ color: 'rgba(128,128,128,0.3)', fontSize: '2rem' }}>◈</span>
    </div>
  )
}

export default function Gallery({ variant, accent, data }) {
  const a = acc(accent)
  const headline = safeStr(data?.headline, '')
  const caption = safeStr(data?.caption, '')
  const images_b64 = Array.isArray(data?.images_b64) ? data.images_b64 : []
  const img0 = images_b64[0] || null
  const img1 = images_b64[1] || null
  const img2 = images_b64[2] || null
  const h2 = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', textAlign: 'center', marginBottom: '2.5rem' }

  // MASONRY GRID — primary + 2 smaller stacked
  if (variant === 'masonry-grid') return (
    <section style={sec}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'repeat(2, 260px)', gap: '8px', maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ gridRow: '1 / 3', borderRadius: 'var(--morph-radius)', overflow: 'hidden' }}>
          <ImgOrPlaceholder b64={img0} alt="Primary" style={{ height: '100%' }} />
        </div>
        <div style={{ borderRadius: 'var(--morph-radius)', overflow: 'hidden' }}>
          <ImgOrPlaceholder b64={img1} alt="Secondary" style={{ height: '100%' }} />
        </div>
        <div style={{ borderRadius: 'var(--morph-radius)', overflow: 'hidden', position: 'relative' }}>
          <ImgOrPlaceholder b64={img2} alt="Tertiary" style={{ height: '100%' }} />
          {caption && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', color: '#fff', fontSize: '0.82rem' }}>{caption}</div>}
        </div>
      </div>
    </section>
  )

  // SPOTLIGHT — single full-width dramatic image
  if (variant === 'spotlight') return (
    <section style={{ ...sec, padding: '0' }}>
      <div style={{ position: 'relative', width: '100%', height: 'clamp(320px, 55vh, 600px)', overflow: 'hidden' }}>
        <ImgOrPlaceholder b64={img0} alt={headline} style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }} />
        {(headline || caption) && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(2rem,5vw,4rem)' }}>
            {headline && <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: '#fff', fontWeight: 800, fontSize: 'clamp(1.5rem,3.5vw,2.5rem)', marginBottom: '0.5rem' }}>{headline}</h2>}
            {caption && <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{caption}</p>}
          </div>
        )}
      </div>
    </section>
  )

  // FILM STRIP — horizontal scroll of images
  return (
    <section style={sec}>
      {headline && <h2 style={h2}>{headline}</h2>}
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
        {(images_b64.length > 0 ? images_b64 : [null, null, null]).map((b64, i) => (
          <div key={i} style={{ flexShrink: 0, width: 'clamp(240px, 35vw, 400px)', height: '260px', borderRadius: 'var(--morph-radius)', overflow: 'hidden' }}>
            <ImgOrPlaceholder b64={b64} alt={`Image ${i + 1}`} style={{ height: '100%' }} />
          </div>
        ))}
      </div>
      {caption && <p style={{ textAlign: 'center', color: 'var(--morph-text-muted)', fontSize: '0.82rem', marginTop: '1.25rem' }}>{caption}</p>}
    </section>
  )
}
