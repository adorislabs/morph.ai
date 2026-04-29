import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { applyTheme } from './theme'

// Recursively sanitize Gemini output — converts any {text, link} objects to strings
function sanitize(val) {
  if (val === null || val === undefined) return val
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return val
  if (Array.isArray(val)) return val.map(sanitize)
  if (typeof val === 'object') {
    // If it looks like a {text, link} stub, extract the text
    if (val.text !== undefined) return String(val.text)
    if (val.label !== undefined) return String(val.label)
    if (val.value !== undefined) return String(val.value)
    // Recursively sanitize each key
    const out = {}
    for (const k of Object.keys(val)) out[k] = sanitize(val[k])
    return out
  }
  return String(val)
}
import Hero from './components/Hero'
import Problem from './components/Problem'
import Features from './components/Features'
import SocialProof from './components/SocialProof'
import Pricing from './components/Pricing'
import CTA from './components/CTA'
import FAQ from './components/FAQ'
import HowItWorks from './components/HowItWorks'
import Trust from './components/Trust'
import Team from './components/Team'
import Gallery from './components/Gallery'
import Showcase from './components/Showcase'
import Metrics from './components/Metrics'
import Benefits from './components/Benefits'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const COMPONENTS = {
  HERO: Hero, PROBLEM: Problem, FEATURES: Features, SOCIALPROOF: SocialProof,
  PRICING: Pricing, CTA, FAQ, HOWITWORKS: HowItWorks, TRUST: Trust, TEAM: Team,
  GALLERY: Gallery, SHOWCASE: Showcase, METRICS: Metrics, BENEFITS: Benefits,
}

const WIDTHS = { narrow: '48rem', standard: '72rem', wide: '90rem', 'full-bleed': '100%' }

const ANIM = {
  none: { initial: {}, animate: {} },
  subtle: { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: 'easeOut' } },
  expressive: { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { type: 'spring', duration: 0.6, bounce: 0.3 } },
  cinematic: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Renderer({ schema }) {
  const ref = useRef(null)
  const { theme, layout, active_modules, nav, footer } = schema
  const anim = ANIM[theme.motion] || ANIM.subtle
  const maxWidth = WIDTHS[layout.page_width] || '72rem'
  const isCinematic = theme.motion === 'cinematic'

  useEffect(() => { if (ref.current) applyTheme(theme, ref.current) }, [theme])

  return (
    <div ref={ref} data-rhythm={layout.section_rhythm}
      style={{ background: 'var(--morph-bg-primary)', color: 'var(--morph-text-primary)', fontFamily: 'var(--morph-font-body)', minHeight: '100vh' }}>
      {nav && <Navbar data={sanitize(nav)} theme={theme} />}
      {active_modules.map((mod, i) => {
        const Comp = COMPONENTS[mod.id]
        if (!Comp) return null
        const isFullBleed = mod.id === 'HERO' || layout.page_width === 'full-bleed'
        return (
          <motion.div key={`${mod.id}-${i}`}
            initial={anim.initial}
            whileInView={anim.animate}
            viewport={{ once: true, amount: 0.08 }}
            transition={anim.transition ? { ...anim.transition, delay: isCinematic ? i * 0.12 : 0 } : undefined}>
            <div style={{ maxWidth: isFullBleed ? '100%' : maxWidth, margin: '0 auto' }}>
              <Comp variant={mod.variant} layoutHint={mod.layout_hint} accent={mod.accent} data={sanitize(mod.data)} theme={theme} />
            </div>
          </motion.div>
        )
      })}
      {footer && <Footer data={sanitize(footer)} theme={theme} />}
    </div>
  )
}
