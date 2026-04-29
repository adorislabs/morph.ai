const BG_MODES = {
  dark: { bg_primary: '#0d0f14', bg_secondary: '#161923', text_primary: '#f1f5f9', text_secondary: '#94a3b8', text_muted: '#475569' },
  light: { bg_primary: '#ffffff', bg_secondary: '#f8fafc', text_primary: '#0f172a', text_secondary: '#334155', text_muted: '#94a3b8' },
  'high-contrast': { bg_primary: '#000000', bg_secondary: '#111111', text_primary: '#ffffff', text_secondary: '#e5e5e5', text_muted: '#737373' },
  'editorial-light': { bg_primary: '#f5f4f0', bg_secondary: '#eae8e3', text_primary: '#1a1917', text_secondary: '#44403c', text_muted: '#78716c' },
  'deep-black': { bg_primary: '#0a0a0a', bg_secondary: '#141414', text_primary: '#e5e5e5', text_secondary: '#a3a3a3', text_muted: '#525252' },
  'warm-paper': { bg_primary: '#faf7f2', bg_secondary: '#f0ebe1', text_primary: '#1c1917', text_secondary: '#44403c', text_muted: '#78716c' },
}

const COLORS = {
  indigo: '#6366f1', emerald: '#10b981', rose: '#f43f5e', amber: '#f59e0b',
  cyan: '#06b6d4', violet: '#8b5cf6', orange: '#f97316', slate: '#64748b',
  red: '#ef4444', teal: '#14b8a6', gold: '#d97706',
}

const FONTS = {
  sans: "'Plus Jakarta Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
  serif: "'Lora', Georgia, serif",
  display: "'Syne', sans-serif",
  condensed: "'Barlow Condensed', sans-serif",
}

const FONT_SCALE = { compact: '0.9', normal: '1', large: '1.15' }
const RADIUS = { sharp: '0px', soft: '6px', rounded: '14px' }

function getSurface(style, bg, accent) {
  const dark = ['dark', 'high-contrast', 'deep-black'].includes(bg)
  switch (style) {
    case 'glassy': return {
      bg: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      border: dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
      shadow: 'none',
      backdrop: 'blur(12px)',
    }
    case 'outlined': return { bg: 'transparent', border: `1px solid ${accent}`, shadow: 'none', backdrop: 'none' }
    case 'elevated': return {
      bg: 'var(--morph-bg-secondary)',
      border: 'none',
      shadow: dark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
      backdrop: 'none',
    }
    default: return { bg: 'transparent', border: 'none', shadow: 'none', backdrop: 'none' }
  }
}

export function applyTheme(theme, el) {
  const bg = BG_MODES[theme.background_mode] || BG_MODES.dark
  const accent = COLORS[theme.primary_color] || COLORS.indigo
  const surface = getSurface(theme.surface_style, theme.background_mode, accent)
  const density = theme.density === 'spacious' ? '1.6' : theme.density === 'dense' ? '0.7' : '1'

  const vars = {
    '--morph-bg-primary': bg.bg_primary,
    '--morph-bg-secondary': bg.bg_secondary,
    '--morph-text-primary': bg.text_primary,
    '--morph-text-secondary': bg.text_secondary,
    '--morph-text-muted': bg.text_muted,
    '--morph-accent-primary': accent,
    '--morph-accent-secondary': COLORS[theme.secondary_color] || COLORS.emerald,
    '--morph-font-heading': FONTS[theme.font_heading] || FONTS.sans,
    '--morph-font-body': FONTS[theme.font_body] || FONTS.sans,
    '--morph-font-scale': FONT_SCALE[theme.font_size_scale] || '1',
    '--morph-radius': RADIUS[theme.border_radius] || RADIUS.soft,
    '--morph-density': density,
    '--morph-surface-bg': surface.bg,
    '--morph-surface-border': surface.border,
    '--morph-surface-shadow': surface.shadow,
    '--morph-surface-backdrop': surface.backdrop,
  }

  Object.entries(vars).forEach(([k, v]) => el.style.setProperty(k, v))
  return vars
}
