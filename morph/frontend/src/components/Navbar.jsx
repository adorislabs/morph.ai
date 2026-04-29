const safeStr = (v, fb = '') => {
  if (v === null || v === undefined) return fb
  if (typeof v === 'object') return v.text || v.label || v.value || fb
  return String(v)
}

export default function Navbar({ data }) {
  const logo = safeStr(data?.logo, 'Brand')
  const links = Array.isArray(data?.links) ? data.links.map(l => safeStr(l)).filter(Boolean) : []
  const ctaText = safeStr(data?.cta_text, 'Get Started')
  const a = 'var(--morph-accent-primary)'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(1.5rem, 5vw, 3rem)',
      height: '56px',
      background: 'var(--morph-bg-primary)',
      borderBottom: '1px solid rgba(128,128,128,0.08)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
    }}>
      <span style={{
        fontFamily: 'var(--morph-font-heading)',
        fontWeight: 800,
        fontSize: '1.05rem',
        color: 'var(--morph-text-primary)',
        letterSpacing: '-0.02em',
        cursor: 'default',
      }}>{logo}</span>

      <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
        {links.slice(0, 4).map((link, i) => (
          <span key={i} style={{
            color: 'var(--morph-text-secondary)',
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'var(--morph-font-body)',
          }}>{link}</span>
        ))}
      </div>

      <button style={{
        background: a,
        color: '#fff',
        border: 'none',
        borderRadius: 'var(--morph-radius)',
        padding: '0.45rem 1.1rem',
        fontFamily: 'var(--morph-font-heading)',
        fontWeight: 700,
        fontSize: '0.8rem',
        cursor: 'pointer',
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
      }}>{ctaText}</button>
    </nav>
  )
}
