import { useState } from 'react'

const acc = (accent) =>
  accent === 'primary' ? 'var(--morph-accent-primary)' :
  accent === 'secondary' ? 'var(--morph-accent-secondary)' : 'var(--morph-accent-primary)'

const sec = { padding: 'calc(var(--morph-density, 1) * 4rem) clamp(1.5rem, 5vw, 3rem)' }
const h2s = { fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: 'clamp(1.4rem,3vw,2rem)', marginBottom: '2rem' }

function Accordion({ items }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0', maxWidth: '52rem', margin: '0 auto' }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderTop: i === 0 ? '1px solid rgba(128,128,128,0.15)' : 'none', borderBottom: '1px solid rgba(128,128,128,0.15)' }}>
          <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 600, fontSize: '0.92rem' }}>{item.question}</span>
            <span style={{ color: 'var(--morph-text-muted)', fontSize: '1.1rem', flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
          </button>
          {open === i && <div style={{ paddingBottom: '1.25rem', color: 'var(--morph-text-secondary)', fontSize: '0.88rem', lineHeight: 1.72 }}>{item.answer}</div>}
        </div>
      ))}
    </div>
  )
}

export default function FAQ({ variant, accent, data }) {
  const a = acc(accent)
  const { headline = 'FAQ', items = [] } = data || {}

  if (variant === 'chatlike') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ maxWidth: '36rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {items.map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <div style={{ background: a, color: '#fff', padding: '0.75rem 1rem', borderRadius: '16px 16px 3px 16px', maxWidth: '80%', fontSize: '0.88rem', lineHeight: 1.55 }}>{item.question}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'var(--morph-surface-bg, var(--morph-bg-secondary))', border: 'var(--morph-surface-border, 1px solid rgba(128,128,128,0.15))', color: 'var(--morph-text-secondary)', padding: '0.75rem 1rem', borderRadius: '16px 16px 16px 3px', maxWidth: '80%', fontSize: '0.88rem', lineHeight: 1.6 }}>{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'two-column') return (
    <section style={{ ...sec, background: 'var(--morph-bg-secondary)' }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem 3rem', maxWidth: '64rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i}>
            <h3 style={{ fontFamily: 'var(--morph-font-heading)', color: 'var(--morph-text-primary)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.6rem' }}>{item.question}</h3>
            <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.86rem', lineHeight: 1.7 }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )

  if (variant === 'objection-handler') return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '52rem', margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} style={{ padding: '1.5rem', background: 'var(--morph-surface-bg)', border: 'var(--morph-surface-border, 1px solid rgba(128,128,128,0.1))', borderLeft: `3px solid ${a}`, borderRadius: 'var(--morph-radius)', backdropFilter: 'var(--morph-surface-backdrop)' }}>
            <p style={{ color: 'var(--morph-text-primary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.6rem' }}>{item.question}</p>
            <p style={{ color: 'var(--morph-text-secondary)', fontSize: '0.86rem', lineHeight: 1.7 }}>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )

  // accordion (default)
  return (
    <section style={{ ...sec }}>
      <h2 style={{ ...h2s, textAlign: 'center' }}>{headline}</h2>
      <Accordion items={items} />
    </section>
  )
}
