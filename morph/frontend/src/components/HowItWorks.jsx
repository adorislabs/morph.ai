const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }
const h2s = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '2.5rem', textAlign: 'center' }

const TermChrome = ({ label }) => (
  <div style={{ background: '#161b22', padding: '0.55rem 1rem', display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
    {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
    <span style={{ marginLeft: '0.75rem', color: '#6b7280', fontSize: '0.66rem', fontFamily: "'JetBrains Mono', monospace" }}>{label || 'terminal'}</span>
  </div>
)

export default function HowItWorks({ variant, accent, data }) {
  const a = acc(accent)
  const { headline = 'How It Works', steps = [] } = data || {}

  if (variant === 'alternating-visual') return (
    <section style={{ ...sec }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '68rem', margin: '0 auto' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr', gap: '4rem', alignItems: 'center', padding: '3rem 0', borderBottom: i < steps.length - 1 ? '1px solid rgba(128,128,128,0.1)' : 'none', direction: i % 2 === 0 ? 'ltr' : 'rtl' }}>
            <div style={{ direction: 'ltr' }}>
              <div style={{ color: a, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '0.75rem', fontFamily: 'var(--morph-font-heading)' }}>Step 0{i + 1}</div>
              <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.1rem,2.2vw,1.5rem)', marginBottom: '0.75rem', lineHeight: 1.25 }}>{step.title}</h3>
              <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{step.description}</p>
            </div>
            <div style={{ direction: 'ltr', background: `${a}0d`, border: `1px solid ${a}22`, borderRadius: 'var(--morph-radius)', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: a, opacity: 0.22, letterSpacing: '-0.04em' }}>0{i + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'split-steps') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5rem', maxWidth: '72rem', margin: '0 auto', alignItems: 'flex-start' }}>
        <div style={{ position: 'sticky', top: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 800, fontSize: 'clamp(1.6rem,3vw,2.4rem)', lineHeight: 1.15, margin: '0 0 1.5rem' }}>{headline}</h2>
          <div style={{ width: '2.5rem', height: '3px', background: a, borderRadius: '2px' }} />
        </div>
        <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
          <div style={{ position: 'absolute', left: '0.65rem', top: '1.2rem', bottom: '1.2rem', width: '2px', background: `${a}2a` }} />
          {steps.map((step, i) => (
            <div key={i} style={{ position: 'relative', paddingBottom: '2.5rem' }}>
              <div style={{ position: 'absolute', left: '-1.85rem', top: '0.15rem', width: 18, height: 18, borderRadius: '50%', background: a, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--morph-font-heading)' }}>{i + 1}</div>
              <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.87rem', lineHeight: 1.65, margin: 0 }}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )

  if (variant === 'command-line') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ background: '#0d1117', borderRadius: '10px', overflow: 'hidden', fontFamily: "'JetBrains Mono', monospace", maxWidth: '48rem', margin: '0 auto', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' }}>
        <TermChrome label="morph.ai — setup" />
        <div style={{ padding: '1.5rem', fontSize: '0.8rem', lineHeight: 2 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ marginBottom: '0.75rem' }}>
              <div><span style={{ color: '#6b9955' }}># Step {i + 1}:</span> <span style={{ color: '#cdd9e5' }}>{step.title}</span></div>
              <div><span style={{ color: '#4ec9b0' }}>$ </span><span style={{ color: '#9cdcfe' }}>morph</span> <span style={{ color: '#ce9178' }}>{step.title.toLowerCase().replace(/\s+/g, '-')}</span></div>
              <div style={{ color: '#6b7280', paddingLeft: '1.25rem', fontSize: '0.74rem' }}>{step.description}</div>
            </div>
          ))}
          <span style={{ color: '#00ff41', animation: 'blink 1s step-end infinite' }}>█</span>
        </div>
      </div>
    </section>
  )

  if (variant === 'visual-flow') return (
    <section style={{ ...sec }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', overflowX: 'auto', maxWidth: '72rem', margin: '0 auto' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: '140px' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '0 1rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: a, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', margin: '0 auto 1rem', fontFamily: 'var(--morph-font-heading)' }}>{i + 1}</div>
              <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{step.title}</h3>
              <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{step.description}</p>
            </div>
            {i < steps.length - 1 && <div style={{ paddingTop: '1.25rem', color: 'var(--morph-text-muted)', fontSize: '1.2rem', flexShrink: 0 }}>→</div>}
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'timeline') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ maxWidth: '40rem', margin: '0 auto', position: 'relative', paddingLeft: '2rem' }}>
        <div style={{ position: 'absolute', left: '0.55rem', top: 0, bottom: 0, width: '2px', background: `${a}33` }} />
        {steps.map((step, i) => (
          <div key={i} style={{ position: 'relative', paddingBottom: '2.5rem' }}>
            <div style={{ position: 'absolute', left: '-1.45rem', top: '0.1rem', width: 14, height: 14, borderRadius: '50%', background: a, border: '3px solid var(--morph-bg-secondary)' }} />
            <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem' }}>{step.title}</h3>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.85rem', lineHeight: 1.65 }}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )

  // numbered-steps (default)
  return (
    <section style={{ ...sec }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', maxWidth: '72rem', margin: '0 auto' }}>
        {steps.map((step, i) => (
          <div key={i}>
            <div style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, fontFamily: 'var(--morph-font-heading)', color: a, opacity: 0.25, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.75rem' }}>0{i + 1}</div>
            <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{step.title}</h3>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.85rem', lineHeight: 1.65 }}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
