const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }
const h2s = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '2.5rem', textAlign: 'center' }

export default function Team({ variant, accent, data }) {
  const a = acc(accent)
  const { headline = 'The Team', members = [] } = data || {}

  if (variant === 'advisor-strip') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={{ ...h2s, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--morph-text-muted)' }}>{headline}</h2>
      <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
        {members.map((m, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--morph-text-primary)', fontWeight: 700, fontFamily: 'var(--morph-font-heading)', fontSize: '0.95rem' }}>{m.name}</div>
            <div style={{ color: 'var(--morph-text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{m.title}</div>
          </div>
        ))}
      </div>
    </section>
  )

  // founder-cards (default)
  return (
    <section style={{ ...sec }}>
      <h2 style={h2s}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', maxWidth: '60rem', margin: '0 auto' }}>
        {members.map((m, i) => (
          <div key={i} style={{ background: 'var(--morph-surface-bg)', border: 'var(--morph-surface-border)', borderRadius: 'var(--morph-radius)', padding: '1.75rem', boxShadow: 'var(--morph-surface-shadow)', backdropFilter: 'var(--morph-surface-backdrop)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${a}22, ${a}44)`, border: `2px solid ${a}44`, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a, fontWeight: 800, fontSize: '1.2rem', fontFamily: 'var(--morph-font-heading)' }}>{(m.name || 'A')[0]}</div>
            <div style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{m.name}</div>
            <div style={{ color: a, fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.75rem' }}>{m.title}</div>
            <p style={{ color: 'var(--morph-text-muted)', fontSize: '0.82rem', lineHeight: 1.6 }}>{m.bio}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
