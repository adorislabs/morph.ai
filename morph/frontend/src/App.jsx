import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import Renderer from './Renderer'

const API = 'http://localhost:8000'

const PERSONA_LINES = [
  { role: 'a skeptical senior developer', accent: '#67e8f9', layout: 'terminal',
    hero: ['68%','50%','38%'], ctaBg: true, ctaLabel: 'View Docs', cards: [[18,72,50],[20,68,45],[16,75,52]] },
  { role: 'a CFO evaluating SaaS spend',  accent: '#fbbf24', layout: 'pricing',
    hero: ['82%','62%','44%'], ctaBg: true, ctaLabel: 'See Pricing', cards: [[22,80,60],[18,65,50],[24,70,55]] },
  { role: 'an enterprise IT buyer',       accent: '#a78bfa', layout: 'sidebar',
    hero: ['75%','55%','34%'], ctaBg: true, ctaLabel: 'Request Demo', cards: [[20,78,58],[16,60,42],[22,72,48]] },
  { role: 'a solo founder bootstrapping', accent: '#4ade80', layout: 'minimal',
    hero: ['60%','44%','52%'], ctaBg: true, ctaLabel: 'Start Free', cards: [[14,70,48],[18,55,38],[20,62,44]] },
  { role: 'a luxury brand consumer',      accent: '#f9a8d4', layout: 'luxury',
    hero: ['50%','70%','30%'], ctaBg: false, ctaLabel: 'Explore', cards: [[16,60,40],[22,75,55],[12,50,35]] },
  { role: 'a VC scanning opportunities',  accent: '#fb923c', layout: 'metrics',
    hero: ['90%','70%','55%'], ctaBg: true, ctaLabel: 'See Metrics', cards: [[24,88,65],[20,72,50],[26,80,60]] },
]

const PLACEHOLDERS = [
  'A skeptical senior dev burned by overhyped tools — needs proof, not promises',
  'A cost-conscious CFO evaluating SaaS: ROI, payback period, risk reduction',
  'An enterprise IT buyer: compliance, security, vendor stability',
  'A luxury consumer making an emotional purchase — values exclusivity',
  'A solo founder bootstrapping — every dollar has to justify itself',
  'A VC screening portfolio tools — wants data density, not marketing fluff',
]
const DEFAULT_STEPS = ['Fetching site...', 'Analyzing persona...', 'Building layout...', 'Applying theme...', 'Finalizing copy...']

// ── Cinematic morph transition ──
function MorphTransition({ screenshotB64, onComplete }) {
  const [phase, setPhase] = useState('scan')
  const [statusIdx, setStatusIdx] = useState(0)
  const statuses = ['Parsing visual hierarchy...', 'Mapping conversion zones...', 'Rewriting for persona...', 'Assembling layout...']

  useEffect(() => {
    if (!screenshotB64) { onComplete(); return }
    const si = setInterval(() => setStatusIdx(i => (i + 1) % statuses.length), 650)
    const t1 = setTimeout(() => setPhase('dissolve'), 2200)
    const t2 = setTimeout(() => setPhase('done'), 3400)
    const t3 = setTimeout(() => onComplete(), 3800)
    return () => { clearInterval(si); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (!screenshotB64) { onComplete(); return null }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'done' ? 0 : 1 }}
      transition={{ duration: 0.45 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#0c0b09', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes morph-scan {
          from { top: -4px; opacity: 1; }
          to   { top: 102%; opacity: 0.6; }
        }
        @keyframes morph-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes morph-pulse {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.3; }
        }
      `}</style>

      <motion.img
        src={`data:image/png;base64,${screenshotB64}`}
        alt="original"
        animate={phase === 'dissolve' ? {
          filter: ['brightness(1) saturate(1)', 'brightness(1.6) saturate(0.2)', 'brightness(0.4) saturate(0)', 'brightness(0)'],
          scale: [1, 1.008, 1.003, 1],
        } : { filter: 'brightness(0.85) saturate(0.9)' }}
        transition={{ duration: 1.2, ease: [0.4, 0, 0.6, 1] }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
      />

      {phase === 'scan' && (
        <>
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '2px', top: 0,
            background: 'linear-gradient(90deg, transparent 3%, rgba(234,153,153,0.4) 20%, #fff9f0 50%, rgba(234,153,153,0.4) 80%, transparent 97%)',
            boxShadow: '0 0 24px 8px rgba(234,153,153,0.55), 0 0 60px 20px rgba(234,153,153,0.15)',
            animation: 'morph-scan 2.2s cubic-bezier(0.4,0,0.6,1) forwards',
            pointerEvents: 'none', zIndex: 11,
          }} />
          <motion.div
            animate={{ height: ['0%', '100%'] }}
            transition={{ duration: 2.2, ease: 'linear' }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'rgba(234,153,153,0.05)', pointerEvents: 'none', zIndex: 10 }}
          />
        </>
      )}

      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
        pointerEvents: 'none', zIndex: 12,
      }} />

      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(12,11,9,0.9)', backdropFilter: 'blur(16px)',
        border: '1px solid rgba(234,153,153,0.22)', borderRadius: '100px',
        padding: '0.6rem 1.5rem',
        display: 'flex', alignItems: 'center', gap: '0.85rem',
        zIndex: 20,
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EA9999', animation: 'morph-pulse 1.2s ease-in-out infinite', flexShrink: 0 }} />
        <AnimatePresence mode="wait">
          <motion.span key={statusIdx}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            style={{ color: 'rgba(245,240,232,0.75)', fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
          >
            {statuses[statusIdx]}
          </motion.span>
        </AnimatePresence>
        {phase === 'scan' && (
          <div style={{ width: 72, height: 2, background: 'rgba(234,153,153,0.18)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#EA9999', borderRadius: 2, animation: 'morph-progress 2.2s linear forwards' }} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Sherpa-style CRO Audit View ──
const STATUS_CONFIG = {
  'Should Fix':  { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  color: '#f87171', dot: '#ef4444' },
  'Doing Well':  { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.22)', color: '#4ade80', dot: '#22c55e' },
  'Nice to Fix': { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.22)', color: '#fbbf24', dot: '#f59e0b' },
}

function scoreGrade(n) {
  if (n >= 90) return { grade: 'A', color: '#4ade80', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.22)' }
  if (n >= 80) return { grade: 'B', color: '#38bdf8', bg: 'rgba(56,189,248,0.1)',  border: 'rgba(56,189,248,0.22)' }
  if (n >= 70) return { grade: 'C', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.22)' }
  if (n >= 60) return { grade: 'D', color: '#fb923c', bg: 'rgba(251,146,60,0.1)',  border: 'rgba(251,146,60,0.22)' }
  return              { grade: 'F', color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.22)' }
}

function AuditView({ cloneResult, persona, url, onBack }) {
  const [activePin, setActivePin] = useState(null)
  const cardRefs = useRef([])
  const screenshotRef = useRef(null)
  const leftPanelRef = useRef(null)
  const annotations = cloneResult?.annotations || []
  const scores = cloneResult?.scores || []
  const about = cloneResult?.about || ''
  const domain = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''

  const scrollToAnnotation = (ann, idx) => {
    setActivePin(idx)
    // Scroll left panel to y_pct position
    if (screenshotRef.current && leftPanelRef.current) {
      const imgH = screenshotRef.current.offsetHeight
      const panelH = leftPanelRef.current.offsetHeight
      const target = (ann.y_pct / 100) * imgH - panelH / 2
      leftPanelRef.current.scrollTo({ top: Math.max(0, target), behavior: 'smooth' })
    }
    // Scroll right panel card into view
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div style={{ height: '100vh', background: '#0d0c0b', color: '#f5f0e8', fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        .audit-pin { transition: all 0.15s cubic-bezier(0.16,1,0.3,1); cursor: pointer; }
        .audit-pin:hover { transform: translate(-50%,-50%) scale(1.18) !important; }
        .audit-card { transition: background 0.15s, border-color 0.15s; cursor: pointer; }
        .audit-card:hover { background: rgba(245,240,232,0.04) !important; }
      `}</style>

      {/* Top bar */}
      <div style={{
        flexShrink: 0, height: 50, display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0 1.5rem', background: 'rgba(13,12,11,0.98)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(245,240,232,0.07)',
      }}>
        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#EA9999', letterSpacing: '-0.02em', flexShrink: 0 }}>morph.ai</span>
        <div style={{ width: 1, height: 13, background: 'rgba(245,240,232,0.1)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.66rem', color: 'rgba(245,240,232,0.25)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em', flexShrink: 0 }}>Conversion Brief</span>
        {domain && (
          <>
            <div style={{ width: 1, height: 13, background: 'rgba(245,240,232,0.1)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.38)', flexShrink: 0 }}>{domain}</span>
          </>
        )}
        <div style={{ flex: 1 }} />
        {cloneResult?.cached_at && (
          <span style={{ fontSize: '0.6rem', color: 'rgba(245,240,232,0.3)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
            cached {new Date(cloneResult.cached_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        )}
        <button onClick={onBack} style={{
          fontSize: '0.68rem', color: 'rgba(245,240,232,0.4)',
          background: 'none', border: '1px solid rgba(245,240,232,0.1)',
          borderRadius: '5px', padding: '0.25rem 0.65rem', cursor: 'pointer',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}>Back</button>
      </div>

      {/* Score cards row */}
      {scores.length > 0 && (
        <div style={{
          flexShrink: 0, display: 'flex', gap: '0.65rem', alignItems: 'stretch',
          padding: '0.85rem 1.5rem', borderBottom: '1px solid rgba(245,240,232,0.07)',
          background: 'rgba(245,240,232,0.012)', overflowX: 'auto',
        }}>
          {scores.map((s, i) => {
            const g = scoreGrade(s.score)
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 24 }}
                style={{
                  flexShrink: 0, background: g.bg, border: `1px solid ${g.border}`,
                  borderRadius: '9px', padding: '0.6rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 155,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.1rem' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: g.color, lineHeight: 1, letterSpacing: '-0.04em' }}>{s.score}</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: g.color, lineHeight: 1 }}>{g.grade}</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(245,240,232,0.5)', fontWeight: 600, lineHeight: 1.35 }}>{s.label}</span>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* About section */}
      {about && (
        <div style={{
          flexShrink: 0, padding: '0.65rem 1.5rem',
          borderBottom: '1px solid rgba(245,240,232,0.06)',
          display: 'flex', alignItems: 'baseline', gap: '0.85rem',
          background: 'rgba(245,240,232,0.008)',
        }}>
          <span style={{ fontSize: '0.54rem', color: 'rgba(245,240,232,0.2)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>About</span>
          <p style={{ margin: 0, fontSize: '0.73rem', color: 'rgba(245,240,232,0.38)', lineHeight: 1.6 }}>{about}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', flex: 1, minHeight: 0 }}>

        {/* Left: full-page screenshot with pins */}
        <div ref={leftPanelRef} style={{ overflow: 'auto', background: '#06050d', padding: '1.25rem 1.5rem' }}>
          <div style={{ position: 'relative', display: 'block', width: '100%' }}>
            <img
              ref={screenshotRef}
              src={`data:image/jpeg;base64,${cloneResult.screenshot_b64}`}
              alt="full page screenshot"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '6px', border: '1px solid rgba(245,240,232,0.06)' }}
            />

            {annotations.map((ann, i) => {
              const isActive = activePin === i
              const cfg = STATUS_CONFIG[ann.status] || STATUS_CONFIG['Doing Well']
              const xPct = ann.x_pct ?? (i % 2 === 0 ? 22 : 76)
              return (
                <motion.div
                  key={i}
                  className="audit-pin"
                  onClick={() => scrollToAnnotation(ann, i)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.045, type: 'spring', stiffness: 380, damping: 26 }}
                  style={{
                    position: 'absolute',
                    top: `${ann.y_pct ?? 10}%`,
                    left: `${xPct}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isActive ? 32 : 27,
                    height: isActive ? 32 : 27,
                    borderRadius: '50%',
                    background: isActive ? cfg.dot : 'rgba(10,9,8,0.92)',
                    border: `2px solid ${isActive ? cfg.dot : cfg.dot + '88'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isActive ? '#0c0b09' : cfg.color,
                    fontSize: '0.58rem', fontWeight: 800,
                    zIndex: 20,
                    boxShadow: isActive
                      ? `0 0 0 5px ${cfg.dot}22, 0 4px 20px ${cfg.dot}55`
                      : '0 2px 10px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {ann.n ?? i + 1}
                </motion.div>
              )
            })}

            {/* Active pin ring */}
            {activePin !== null && annotations[activePin] && (() => {
              const ann = annotations[activePin]
              const xPct = ann.x_pct ?? (activePin % 2 === 0 ? 22 : 76)
              const cfg = STATUS_CONFIG[ann.status] || STATUS_CONFIG['Doing Well']
              return (
                <motion.div
                  key={`ring-${activePin}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    position: 'absolute',
                    top: `${ann.y_pct ?? 10}%`, left: `${xPct}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 52, height: 52, borderRadius: '50%',
                    border: `1.5px solid ${cfg.dot}44`,
                    pointerEvents: 'none', zIndex: 19,
                  }}
                />
              )
            })()}
          </div>
        </div>

        {/* Right: annotation cards */}
        <div style={{ overflow: 'auto', borderLeft: '1px solid rgba(245,240,232,0.06)', background: '#0e0d0b', display: 'flex', flexDirection: 'column' }}>
          {/* Persona card */}
          {(cloneResult.persona_summary || persona) && (
          <div style={{ padding: '0.85rem 1.1rem', borderBottom: '1px solid rgba(245,240,232,0.06)', flexShrink: 0 }}>
            <div style={{ fontSize: '0.54rem', color: 'rgba(234,153,153,0.5)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.3rem', fontFamily: "'JetBrains Mono', monospace" }}>Auditing for</div>
            <div style={{ fontSize: '0.76rem', color: 'rgba(245,240,232,0.55)', lineHeight: 1.5 }}>
              {(cloneResult.persona_summary || persona)?.slice(0, 100)}{(cloneResult.persona_summary || persona)?.length > 100 ? '…' : ''}
            </div>
          </div>
          )}

          {/* Annotation list header */}
          <div style={{ padding: '0.7rem 1.1rem 0.5rem', flexShrink: 0, borderBottom: '1px solid rgba(245,240,232,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(245,240,232,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Annotated Site Review</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(245,240,232,0.18)' }}>{annotations.length} obs.</span>
          </div>
          {/* Annotation list */}
          <div style={{ padding: '0.6rem 0.9rem', flex: 1, overflowY: 'auto' }}>
            {annotations.map((ann, i) => {
              const isActive = activePin === i
              const cfg = STATUS_CONFIG[ann.status] || STATUS_CONFIG['Doing Well']
              return (
                <div
                  key={i}
                  ref={el => cardRefs.current[i] = el}
                  className="audit-card"
                  onClick={() => scrollToAnnotation(ann, i)}
                  style={{
                    padding: '0.85rem 0.9rem', marginBottom: '0.5rem', borderRadius: '7px',
                    background: isActive ? cfg.bg : 'rgba(245,240,232,0.02)',
                    border: `1px solid ${isActive ? cfg.border : 'rgba(245,240,232,0.05)'}`,
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    {/* Number badge */}
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      background: isActive ? cfg.dot : 'rgba(245,240,232,0.05)',
                      border: `1.5px solid ${isActive ? cfg.dot : cfg.dot + '55'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.57rem', fontWeight: 800,
                      color: isActive ? '#0c0b09' : cfg.color,
                      marginTop: '1px',
                    }}>
                      {ann.n ?? i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Status badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.32rem' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
                          padding: '0.1rem 0.45rem', borderRadius: '100px', fontSize: '0.53rem', fontWeight: 700,
                          background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
                        }}>
                          <span style={{ width: 4, height: 4, borderRadius: '50%', background: cfg.dot }} />
                          {ann.status}
                        </span>
                      </div>
                      {/* Headline */}
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isActive ? '#f5f0e8' : 'rgba(245,240,232,0.82)', lineHeight: 1.3, marginBottom: '0.38rem' }}>
                        {ann.headline}
                      </div>
                      {/* Description */}
                      <div style={{ fontSize: '0.73rem', color: 'rgba(245,240,232,0.42)', lineHeight: 1.58 }}>
                        {ann.description}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── URL encode/decode helpers ──
const b64enc = (s) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
const b64dec = (s) => decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/'))))
const urlDomain = (url) => { try { return new URL(url).hostname.replace('www.', '') } catch { return url.replace(/https?:\/\//, '').split('/')[0] } }
const buildPath = (mode, url, persona) => `/${urlDomain(url)}/${mode}/${b64enc(url + '|' + (persona || ''))}`
const decodeHash = (hash) => { const s = b64dec(hash); const i = s.indexOf('|'); return { url: s.slice(0, i), persona: s.slice(i + 1) } }

// ── AuditPage ──
function AuditPage() {
  const { encodedUrl, domain } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cachePrompt, setCachePrompt] = useState(null)
  const { url: targetUrl, persona } = decodeHash(encodedUrl)

  useEffect(() => {
    let cancelled = false
    async function run(force = false) {
      setLoading(true)
      setError(null)
      if (!force) {
        try {
          const cr = await fetch(`${API}/clone/cached?url=${encodeURIComponent(targetUrl)}`)
          if (cr.ok) {
            const info = await cr.json()
            if (info.cached && !cancelled) {
              setLoading(false)
              setCachePrompt({ cachedAt: info.cached_at })
              return
            }
          }
        } catch {}
      }
      try {
        const res = await fetch(`${API}/clone`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl, persona, force }),
        })
        if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Server error') }
        const data = await res.json()
        if (!cancelled) setResult(data)
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run(false)
    return () => { cancelled = true }
  }, [encodedUrl])

  if (cachePrompt) {
    const domain = (() => { try { return new URL(targetUrl).hostname.replace('www.', '') } catch { return targetUrl } })()
    const dateStr = cachePrompt.cachedAt ? new Date(cachePrompt.cachedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'recently'
    return (
      <div style={{ minHeight: '100vh', background: '#0c0b09', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div style={{ background: 'rgba(24,22,18,0.97)', border: '1px solid rgba(245,240,232,0.1)', borderRadius: 14, padding: '2.2rem 2.5rem', maxWidth: 460, width: '90%', textAlign: 'center' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.62rem', color: '#EA9999', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>Cached Audit Found</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'rgba(245,240,232,0.95)', marginBottom: '0.5rem' }}>{domain}</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(245,240,232,0.45)', marginBottom: '1.5rem' }}>
            We processed this site on <strong style={{ color: 'rgba(245,240,232,0.7)' }}>{dateStr}</strong>.<br/>
            Do you think the website changed since then?
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button onClick={() => { setCachePrompt(null); setLoading(true); fetch(`${API}/clone`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ url: targetUrl, persona, force: false }) }).then(r=>r.json()).then(d=>{ setResult(d); setLoading(false) }).catch(e=>{ setError(e.message); setLoading(false) }) }}
              style={{ background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.12)', color: 'rgba(245,240,232,0.7)', borderRadius: 7, padding: '0.6rem 1.2rem', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
              Use Cached Audit
            </button>
            <button onClick={() => { setCachePrompt(null); setLoading(true); fetch(`${API}/clone`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ url: targetUrl, persona, force: true }) }).then(r=>r.json()).then(d=>{ setResult(d); setLoading(false) }).catch(e=>{ setError(e.message); setLoading(false) }) }}
              style={{ background: '#EA9999', color: '#0c0b09', border: 'none', borderRadius: 7, padding: '0.6rem 1.4rem', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
              Re-audit Now
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0c0b09', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ width: 14, height: 14, border: '2px solid rgba(234,153,153,0.2)', borderTop: '2px solid #EA9999', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(245,240,232,0.35)' }}>Auditing {(() => { try { return new URL(targetUrl).hostname } catch { return targetUrl } })()}…</span>
    </div>
  )
  if (error) return (
    <div style={{ minHeight: '100vh', background: '#0c0b09', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</div>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: '1px solid rgba(245,240,232,0.15)', color: 'rgba(245,240,232,0.5)', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.78rem' }}>Back</button>
    </div>
  )
  if (!result) return null
  return <AuditView cloneResult={result} persona={persona} url={targetUrl} onBack={() => navigate('/')} />
}

// ── RedesignPage ──
function RedesignPage() {
  const { encodedUrl, domain } = useParams()
  const navigate = useNavigate()
  const [schema, setSchema] = useState(null)
  const [morphScreenshot, setMorphScreenshot] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [steps, setSteps] = useState(DEFAULT_STEPS)
  const [step, setStep] = useState(0)
  const stepRef = useRef(null)
  const { url: targetUrl, persona } = decodeHash(encodedUrl)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API}/personalize`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: targetUrl, persona }),
        })
        if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Server error') }
        const data = await res.json()
        if (!cancelled) {
          if (data.loading_steps?.length) setSteps(data.loading_steps)
          setSchema(data)
          if (data.screenshot_b64) setMorphScreenshot(data.screenshot_b64)
          else setShowResult(true)
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [encodedUrl])

  useEffect(() => {
    if (loading) {
      setStep(0)
      stepRef.current = setInterval(() => setStep(s => (s + 1) % steps.length), 1200)
    } else {
      clearInterval(stepRef.current)
    }
    return () => clearInterval(stepRef.current)
  }, [loading, steps])

  if (error) return (
    <div style={{ minHeight: '100vh', background: '#0c0b09', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</div>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: '1px solid rgba(245,240,232,0.15)', color: 'rgba(245,240,232,0.5)', borderRadius: 6, padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.78rem' }}>Back</button>
    </div>
  )

  if (showResult && schema) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.7rem 1.5rem', gap: '1.5rem' }}>
          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#EA9999', letterSpacing: '-0.02em', flexShrink: 0 }}>morph.ai</span>
          <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{schema.persona_summary}</span>
          <button onClick={() => navigate('/')} style={{ flexShrink: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', background: 'none', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '6px', padding: '0.3rem 0.8rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>New Persona</button>
        </div>
        <div style={{ padding: '0.2rem 1.5rem 0.4rem', fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', borderTop: '1px solid rgba(255,255,255,0.04)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{schema.transformation_rationale}</div>
      </div>
      <div style={{ paddingTop: '72px' }}>
        <Renderer schema={schema} />
      </div>
    </div>
  )

  return (
    <>
      <AnimatePresence>
        {morphScreenshot && schema && (
          <MorphTransition
            screenshotB64={morphScreenshot}
            onComplete={() => { setMorphScreenshot(null); setShowResult(true) }}
          />
        )}
      </AnimatePresence>
      <div style={{ minHeight: '100vh', background: '#0c0b09', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <div style={{ width: 14, height: 14, border: '2px solid rgba(234,153,153,0.2)', borderTop: '2px solid #EA9999', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
        <AnimatePresence mode="wait">
          <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.16 }}
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.7rem', color: 'rgba(245,240,232,0.35)' }}>
            {steps[step % steps.length]}
          </motion.span>
        </AnimatePresence>
      </div>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:domain/audit/:encodedUrl" element={<AuditPage />} />
      <Route path="/:domain/redesign/:encodedUrl" element={<RedesignPage />} />
    </Routes>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const [url, setUrl] = useState('')
  const [persona, setPersona] = useState('')
  const [previewData, setPreviewData] = useState(null)
  const [error, setError] = useState(null)
  const [pIdx, setPIdx] = useState(0)
  const [mode, setMode] = useState('personalize')
  const [pRole, setPRole] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setPIdx(i => (i + 1) % PLACEHOLDERS.length), 3500)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setPRole(i => (i + 1) % PERSONA_LINES.length), 2400)
    return () => clearInterval(t)
  }, [])

  const normalizeUrl = (u) => {
    if (!u?.trim()) return ''
    const t = u.trim()
    return /^https?:\/\//i.test(t) ? t : 'https://' + t
  }

  const handleBlur = async () => {
    if (!url.trim()) return
    try {
      const res = await fetch(`${API}/preview`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizeUrl(url) }),
      })
      if (res.ok) setPreviewData(await res.json())
    } catch {}
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) { setError('Please enter a URL.'); return }
    const finalUrl = normalizeUrl(url)
    try { new URL(finalUrl) } catch { setError('Invalid URL — try stripe.com or https://stripe.com'); return }
    setError(null)
    if (mode === 'clone') navigate(buildPath('audit', finalUrl, persona.trim()))
    else navigate(buildPath('redesign', finalUrl, persona.trim()))
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .m-input {
          width: 100%; background: rgba(245,240,232,0.04); border: 1px solid rgba(245,240,232,0.09);
          border-radius: 8px; padding: 0.8rem 1rem; color: #f5f0e8; font-size: 0.87rem;
          outline: none; box-sizing: border-box; font-family: 'Plus Jakarta Sans', sans-serif;
          transition: border-color 0.18s;
        }
        .m-input:focus { border-color: rgba(234,153,153,0.4); }
        .m-input::placeholder { color: rgba(245,240,232,0.2); }
        .nav-link:hover { color: rgba(245,240,232,0.75) !important; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0c0b09', color: '#f5f0e8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Ambient glow */}
        <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(234,153,153,0.055) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* ── NAV ── */}
        <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(12,11,9,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '0 2rem', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#EA9999', letterSpacing: '-0.03em' }}>morph.ai</span>
            <a href="#try" style={{ background: '#EA9999', color: '#0c0b09', padding: '0.38rem 1rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.01em' }}>Try free</a>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ paddingTop: '50px', minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto', padding: '4rem 2rem 5rem', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4.5rem', alignItems: 'center' }}>

            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, ease: [0.16,1,0.3,1] }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                <span style={{ width: 20, height: 1, background: '#EA9999', display: 'inline-block' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: '#EA9999', letterSpacing: '0.14em', textTransform: 'uppercase' }}>AI-powered CRO</span>
              </div>
              <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', lineHeight: 1.12, marginBottom: '1.5rem', color: '#f5f0e8', margin: '0 0 1.5rem' }}>
                Every website,{' '}
                <span style={{ fontStyle: 'normal', fontWeight: 700 }}>seen through</span>
                <br />
                <span style={{ color: '#EA9999' }}>different eyes.</span>
              </h1>
              <p style={{ color: 'rgba(245,240,232,0.42)', fontSize: '0.95rem', lineHeight: 1.8, maxWidth: '380px', marginBottom: '2.5rem' }}>
                Paste any URL. Describe who's visiting. Get a fully custom page — copy, layout, and theme — built for that exact person.
              </p>
              <a href="#try" style={{ display: 'inline-block', background: '#EA9999', color: '#0c0b09', padding: '0.78rem 1.8rem', borderRadius: '5px', fontSize: '0.88rem', fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.01em' }}>Generate your first page</a>
              <div style={{ marginTop: '2.75rem', display: 'flex', gap: '2.25rem' }}>
                {[['&lt;30s','generation'],['60+','layout variants'],['30+','languages']].map(([v,l]) => (
                  <div key={v}>
                    <div dangerouslySetInnerHTML={{ __html: v }} style={{ fontWeight: 800, fontSize: '1.3rem', color: '#f5f0e8', letterSpacing: '-0.03em' }} />
                    <div style={{ fontSize: '0.68rem', color: 'rgba(245,240,232,0.28)', marginTop: '0.1rem' }}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: browser mockup */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.12, ease: [0.16,1,0.3,1] }}>
              <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(245,240,232,0.08)', background: '#111009', boxShadow: '0 32px 72px rgba(0,0,0,0.55)' }}>
                {/* Title bar */}
                <div style={{ background: '#1a1711', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.45rem', borderBottom: '1px solid rgba(245,240,232,0.06)' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.65 }} />)}
                  </div>
                  <div style={{ flex: 1, background: 'rgba(245,240,232,0.05)', borderRadius: '3px', padding: '0.2rem 0.55rem', fontSize: '0.6rem', color: 'rgba(245,240,232,0.18)', textAlign: 'center', fontFamily: "'JetBrains Mono', monospace" }}>
                    morph.ai — {PERSONA_LINES[pRole].role}
                  </div>
                </div>
                {/* Color accent tabs */}
                <div style={{ display: 'flex', background: '#131109' }}>
                  {PERSONA_LINES.map((p, i) => (
                    <div key={i} onClick={() => setPRole(i)} style={{ flex: 1, height: '16px', display: 'flex', alignItems: 'flex-end', cursor: 'pointer', padding: '0 0 0', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: i === pRole ? '3px' : '2px', background: i === pRole ? p.accent : 'rgba(245,240,232,0.07)', transition: 'all 0.22s' }} />
                    </div>
                  ))}
                </div>
                {/* Skeleton page */}
                <div style={{ padding: '1.2rem 1.5rem', minHeight: '300px' }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={pRole} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                      {/* Nav skeleton (all layouts) */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(245,240,232,0.06)', gap: '0.5rem' }}>
                        <div style={{ width: 55, height: 7, borderRadius: '3px', background: PERSONA_LINES[pRole].accent, opacity: 0.75 }} />
                        <div style={{ flex: 1 }} />
                        {[45,38,40].map((w,j) => <div key={j} style={{ width: w, height: '5px', borderRadius: '2px', background: 'rgba(245,240,232,0.09)' }} />)}
                        <div style={{ width: 48, height: 20, borderRadius: '3px', background: PERSONA_LINES[pRole].accent, opacity: 0.22 }} />
                      </div>

                      {/* TERMINAL layout — developer */}
                      {PERSONA_LINES[pRole].layout === 'terminal' && (
                        <div style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontFamily: "'JetBrains Mono', monospace', fontSize: '0.6rem" }}>
                          <div style={{ display: 'flex', gap: '4px', marginBottom: '0.6rem' }}>
                            {['#ff5f56','#ffbd2e','#27c93f'].map(c => <div key={c} style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7 }} />)}
                          </div>
                          {[['$ ','npm install morph-sdk', PERSONA_LINES[pRole].accent], ['> ','Connecting to API...', 'rgba(245,240,232,0.25)'], ['✓ ','Ready in 0.4s', '#4ade80'], ['$ ','_', 'rgba(245,240,232,0.35)']].map(([pre, text, col], j) => (
                            <div key={j} style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.3rem', fontSize: '0.62rem' }}>
                              <span style={{ color: col, flexShrink: 0 }}>{pre}</span>
                              <div style={{ height: 7, borderRadius: '2px', background: col, opacity: j===3?0:0.55, width: j===3?4:['78%','65%','55%','8%'][j] }} />
                            </div>
                          ))}
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                            <div style={{ height: 22, borderRadius: '3px', background: PERSONA_LINES[pRole].accent, opacity: 0.8, width: 72 }} />
                            <div style={{ height: 22, borderRadius: '3px', background: 'rgba(245,240,232,0.06)', border: '1px solid rgba(245,240,232,0.1)', width: 60 }} />
                          </div>
                        </div>
                      )}

                      {/* PRICING layout — CFO */}
                      {PERSONA_LINES[pRole].layout === 'pricing' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                          {[['Starter','rgba(245,240,232,0.04)',false],['Growth',`${PERSONA_LINES[pRole].accent}18`,true],['Enterprise','rgba(245,240,232,0.04)',false]].map(([tier, bg, featured], j) => (
                            <div key={j} style={{ background: bg, border: `1px solid ${featured ? PERSONA_LINES[pRole].accent+'44' : 'rgba(245,240,232,0.07)'}`, borderRadius: '6px', padding: '0.65rem 0.5rem' }}>
                              <div style={{ width: '60%', height: 5, borderRadius: '2px', background: featured ? PERSONA_LINES[pRole].accent : 'rgba(245,240,232,0.18)', marginBottom: '0.35rem', opacity: featured ? 0.9 : 0.6 }} />
                              <div style={{ width: '40%', height: 9, borderRadius: '2px', background: 'rgba(245,240,232,0.22)', marginBottom: '0.5rem' }} />
                              {[70,60,65,55].map((w, k) => (
                                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.22rem' }}>
                                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: featured ? PERSONA_LINES[pRole].accent : '#4ade80', opacity: 0.7, flexShrink: 0 }} />
                                  <div style={{ width: w+'%', height: 4, borderRadius: '2px', background: 'rgba(245,240,232,0.1)' }} />
                                </div>
                              ))}
                              <div style={{ width: '100%', height: 18, borderRadius: '3px', marginTop: '0.5rem', background: featured ? PERSONA_LINES[pRole].accent : 'rgba(245,240,232,0.07)', opacity: featured ? 0.85 : 0.5 }} />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* SIDEBAR layout — enterprise */}
                      {PERSONA_LINES[pRole].layout === 'sidebar' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                            {[65,75,55,70,60].map((w, j) => (
                              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.35rem', borderRadius: '4px', background: j===1 ? `${PERSONA_LINES[pRole].accent}18` : 'transparent', border: j===1 ? `1px solid ${PERSONA_LINES[pRole].accent}30` : '1px solid transparent' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '2px', background: j===1 ? PERSONA_LINES[pRole].accent : 'rgba(245,240,232,0.2)', opacity: 0.8, flexShrink: 0 }} />
                                <div style={{ width: w+'%', height: 4, borderRadius: '2px', background: j===1 ? `${PERSONA_LINES[pRole].accent}88` : 'rgba(245,240,232,0.1)' }} />
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ height: 8, width: '70%', borderRadius: '3px', background: 'rgba(245,240,232,0.18)', marginBottom: '0.45rem' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', marginBottom: '0.5rem' }}>
                              {[['#a78bfa','58'],['#67e8f9','72'],['#fbbf24','44'],['#4ade80','66']].map(([col,v],k) => (
                                <div key={k} style={{ background: `${col}12`, border: `1px solid ${col}25`, borderRadius: '4px', padding: '0.4rem 0.5rem' }}>
                                  <div style={{ width: 20, height: 7, borderRadius: '2px', background: col, opacity: 0.7, marginBottom: '0.2rem' }} />
                                  <div style={{ width: v+'%', height: 4, borderRadius: '2px', background: 'rgba(245,240,232,0.1)' }} />
                                </div>
                              ))}
                            </div>
                            <div style={{ width: 70, height: 20, borderRadius: '3px', background: PERSONA_LINES[pRole].accent, opacity: 0.8 }} />
                          </div>
                        </div>
                      )}

                      {/* MINIMAL layout — solo founder */}
                      {PERSONA_LINES[pRole].layout === 'minimal' && (
                        <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                          <div style={{ width: '55%', height: 12, borderRadius: '4px', background: 'rgba(245,240,232,0.18)', margin: '0 auto 0.45rem' }} />
                          <div style={{ width: '72%', height: 12, borderRadius: '4px', background: 'rgba(245,240,232,0.12)', margin: '0 auto 0.45rem' }} />
                          <div style={{ width: '40%', height: 8, borderRadius: '3px', background: 'rgba(245,240,232,0.06)', margin: '0 auto 1rem' }} />
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{ width: 90, height: 28, borderRadius: '5px', background: PERSONA_LINES[pRole].accent, opacity: 0.85 }} />
                          </div>
                          <div style={{ width: '80%', height: 1, background: 'rgba(245,240,232,0.06)', margin: '0 auto 0.75rem' }} />
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            {['42px','35px','45px'].map((size, j) => (
                              <div key={j} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                                <div style={{ width: size, height: 7, borderRadius: '2px', background: PERSONA_LINES[pRole].accent, opacity: 0.7 }} />
                                <div style={{ width: '80%', height: 4, borderRadius: '2px', background: 'rgba(245,240,232,0.08)' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* LUXURY layout — luxury consumer */}
                      {PERSONA_LINES[pRole].layout === 'luxury' && (
                        <div>
                          <div style={{ borderRadius: '6px', background: 'rgba(245,240,232,0.04)', border: `1px solid ${PERSONA_LINES[pRole].accent}22`, padding: '1.2rem', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '90px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `${PERSONA_LINES[pRole].accent}0d` }} />
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ width: 40, height: 1, background: PERSONA_LINES[pRole].accent, margin: '0 auto 0.5rem', opacity: 0.6 }} />
                              <div style={{ width: 100, height: 7, borderRadius: '2px', background: 'rgba(245,240,232,0.2)', margin: '0 auto 0.35rem' }} />
                              <div style={{ width: 70, height: 5, borderRadius: '2px', background: 'rgba(245,240,232,0.1)', margin: '0 auto 0.7rem' }} />
                              <div style={{ width: 60, height: 1, background: PERSONA_LINES[pRole].accent, margin: '0 auto', opacity: 0.4 }} />
                            </div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                            {[[100,'75%','55%'],[100,'65%','45%']].map(([h, w1, w2], j) => (
                              <div key={j} style={{ background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '5px', padding: '0.55rem 0.6rem' }}>
                                <div style={{ width: w1, height: 5, borderRadius: '2px', background: 'rgba(245,240,232,0.14)', marginBottom: '0.25rem' }} />
                                <div style={{ width: w2, height: 4, borderRadius: '2px', background: 'rgba(245,240,232,0.07)' }} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* METRICS layout — VC */}
                      {PERSONA_LINES[pRole].layout === 'metrics' && (
                        <div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginBottom: '0.6rem' }}>
                            {[['$12M','ARR'],['94%','NRR'],['3.2x','Growth']].map(([val, label], j) => (
                              <div key={j} style={{ background: `${PERSONA_LINES[pRole].accent}0e`, border: `1px solid ${PERSONA_LINES[pRole].accent}25`, borderRadius: '5px', padding: '0.5rem 0.4rem', textAlign: 'center' }}>
                                <div style={{ width: '65%', height: 9, borderRadius: '2px', background: PERSONA_LINES[pRole].accent, opacity: 0.75, margin: '0 auto 0.25rem' }} />
                                <div style={{ width: '50%', height: 4, borderRadius: '2px', background: 'rgba(245,240,232,0.12)', margin: '0 auto' }} />
                              </div>
                            ))}
                          </div>
                          <div style={{ background: 'rgba(245,240,232,0.03)', border: '1px solid rgba(245,240,232,0.07)', borderRadius: '5px', padding: '0.5rem 0.6rem', marginBottom: '0.4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: 40, marginBottom: '0.3rem' }}>
                              {[30,45,35,55,42,65,50,70,58,80].map((h, k) => (
                                <div key={k} style={{ flex: 1, borderRadius: '2px 2px 0 0', height: h+'%', background: k===9 ? PERSONA_LINES[pRole].accent : `${PERSONA_LINES[pRole].accent}40` }} />
                              ))}
                            </div>
                            <div style={{ width: '45%', height: 4, borderRadius: '2px', background: 'rgba(245,240,232,0.08)' }} />
                          </div>
                          <div style={{ width: 80, height: 22, borderRadius: '3px', background: PERSONA_LINES[pRole].accent, opacity: 0.8 }} />
                        </div>
                      )}

                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Status bar */}
                <div style={{ padding: '0.5rem 1.5rem', background: '#0f0e09', borderTop: '1px solid rgba(245,240,232,0.04)', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80' }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.58rem', color: 'rgba(245,240,232,0.22)' }}>Persona: {PERSONA_LINES[pRole].role}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── FORM ── */}
        <section id="try" style={{ background: 'rgba(245,240,232,0.02)', borderTop: '1px solid rgba(245,240,232,0.05)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '520px', margin: '0 auto', padding: '4.5rem 2rem 5rem' }}>
            {/* Mode tabs */}
            <div style={{ display: 'flex', marginBottom: '1rem', background: 'rgba(245,240,232,0.03)', borderRadius: '8px', padding: '3px', border: '1px solid rgba(245,240,232,0.07)' }}>
              {[['personalize', 'AI Redesign'], ['clone', 'Audit']].map(([m, label]) => (
                <button key={m} onClick={() => setMode(m)} style={{
                  flex: 1, padding: '0.48rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                  background: mode === m ? 'rgba(234,153,153,0.13)' : 'transparent',
                  color: mode === m ? '#EA9999' : 'rgba(245,240,232,0.28)',
                  border: mode === m ? '1px solid rgba(234,153,153,0.2)' : '1px solid transparent',
                  borderRadius: '6px', fontFamily: "'Plus Jakarta Sans', sans-serif",
                  transition: 'all 0.15s',
                }}>{label}</button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <input type="text" value={url} onChange={e => setUrl(e.target.value)} onBlur={handleBlur} placeholder="stripe.com" className="m-input" />
                {previewData && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '0.4rem', padding: '0.55rem 0.85rem', background: 'rgba(234,153,153,0.04)', border: '1px solid rgba(234,153,153,0.1)', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.74rem', color: '#f5f0e8', fontWeight: 600 }}>{previewData.title}</div>
                    <div style={{ fontSize: '0.67rem', color: 'rgba(245,240,232,0.32)', marginTop: '0.1rem' }}>{previewData.excerpt?.slice(0, 100)}{previewData.excerpt?.length > 100 ? '…' : ''}</div>
                  </motion.div>
                )}
              </div>
              <textarea value={persona} onChange={e => setPersona(e.target.value)} placeholder={mode === 'clone' ? 'e.g. skeptical developer, CFO evaluating SaaS — or leave blank for general audit' : PLACEHOLDERS[pIdx]} rows={3} {...(mode === 'personalize' ? { required: true } : {})} className="m-input" style={{ resize: 'none' }} />
              {error && <div style={{ color: '#fca5a5', fontSize: '0.77rem', padding: '0.6rem 0.85rem', background: 'rgba(239,68,68,0.07)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.18)' }}>{error}</div>}
              <button type="submit" style={{
                width: '100%', padding: '0.85rem', background: '#EA9999',
                color: '#0c0b09', border: 'none', borderRadius: '8px', fontSize: '0.87rem',
                fontWeight: 800, cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif", transition: 'background 0.18s',
              }}>
                {mode === 'clone' ? 'Run CRO Audit' : 'Generate Redesign'}
              </button>
            </form>
            <p style={{ marginTop: '0.85rem', textAlign: 'center', color: 'rgba(245,240,232,0.16)', fontSize: '0.67rem' }}>No account required · under 30 seconds</p>
          </div>
        </section>

        <footer style={{ borderTop: '1px solid rgba(245,240,232,0.05)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1160px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#EA9999', letterSpacing: '-0.03em' }}>morph.ai</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6rem', color: 'rgba(245,240,232,0.15)' }}>© {new Date().getFullYear()} morph.ai</span>
        </footer>
      </div>
    </>
  )
}
