const safeStr = (v, fb = '') => {
  if (v === null || v === undefined) return fb
  if (typeof v === 'object') return v.text || v.label || v.value || fb
  return String(v)
}

export default function Footer({ data }) {
  const company = safeStr(data?.company, '')
  const tagline = safeStr(data?.tagline, '')
  const copyright = safeStr(data?.copyright, '')
  const columns = Array.isArray(data?.columns) ? data.columns : []
  const yr = new Date().getFullYear()

  return (
    <footer style={{
      padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 3rem) 2rem',
      borderTop: '1px solid rgba(128,128,128,0.08)',
      background: 'var(--morph-bg-primary)',
      fontFamily: 'var(--morph-font-body)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: columns.length > 0
          ? `1.5fr ${columns.slice(0, 3).map(() => '1fr').join(' ')}`
          : '1fr',
        gap: 'clamp(2rem, 4vw, 3.5rem)',
        marginBottom: '2.5rem',
        maxWidth: '72rem',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--morph-font-heading)',
            fontWeight: 800,
            fontSize: '1.05rem',
            color: 'var(--morph-text-primary)',
            marginBottom: '0.6rem',
            letterSpacing: '-0.02em',
          }}>{company}</div>
          <p style={{
            color: 'var(--morph-text-muted)',
            fontSize: '0.85rem',
            lineHeight: 1.65,
            maxWidth: '18rem',
            margin: 0,
          }}>{tagline}</p>
        </div>

        {columns.slice(0, 3).map((col, i) => (
          <div key={i}>
            <div style={{
              fontFamily: 'var(--morph-font-heading)',
              fontWeight: 700,
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--morph-text-secondary)',
              marginBottom: '0.9rem',
            }}>{safeStr(col?.heading)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {(Array.isArray(col?.links) ? col.links : []).slice(0, 6).map((link, j) => (
                <span key={j} style={{
                  color: 'var(--morph-text-muted)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  lineHeight: 1.4,
                }}>{safeStr(link)}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: '72rem',
        margin: '0 auto',
        borderTop: '1px solid rgba(128,128,128,0.08)',
        paddingTop: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span style={{ color: 'var(--morph-text-muted)', fontSize: '0.78rem' }}>
          {copyright || `© ${yr} ${company}. All rights reserved.`}
        </span>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {['Privacy', 'Terms', 'Cookies'].map(t => (
            <span key={t} style={{ color: 'var(--morph-text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>{t}</span>
          ))}
        </div>
      </div>
    </footer>
  )
}
