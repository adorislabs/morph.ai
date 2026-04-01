"use client";

import { MutationBlueprint } from "@/types";
import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Bot,
  BarChart3,
  Shield,
  Globe,
  Sparkles,
  Target,
  ArrowRight,
  Check,
  Code,
  Lock,
  Gauge,
  Users,
  Terminal,
  AlertTriangle,
} from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-6 h-6" />,
  Brain: <Brain className="w-6 h-6" />,
  Bot: <Bot className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Lock: <Lock className="w-6 h-6" />,
  Gauge: <Gauge className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
};

function isDark(bg: string): boolean {
  if (!bg || bg === "#ffffff" || bg === "#fff") return false;
  const hex = bg.replace("#", "");
  if (hex.length < 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export default function MorphPage({
  blueprint,
}: {
  blueprint: MutationBlueprint;
}) {
  const { colorScheme } = blueprint;
  const darkMode = isDark(colorScheme.background);

  const sections: Record<string, React.ReactNode> = {
    hero: <HeroSection blueprint={blueprint} darkMode={darkMode} />,
    features: <FeaturesSection blueprint={blueprint} darkMode={darkMode} />,
    "social-proof": <SocialProofSection blueprint={blueprint} darkMode={darkMode} />,
    pricing: <PricingSection blueprint={blueprint} darkMode={darkMode} />,
    cta: <CTASection blueprint={blueprint} darkMode={darkMode} />,
  };

  return (
    <div
      className="min-h-screen transition-colors duration-700"
      style={{ backgroundColor: colorScheme.background, color: darkMode ? "#e2e8f0" : "#0f172a" }}
    >
      {/* Urgency Banner */}
      {blueprint.urgencyBanner && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center py-2.5 px-4 text-sm font-semibold flex items-center justify-center gap-2"
          style={{ backgroundColor: colorScheme.primary, color: "#fff" }}
        >
          <AlertTriangle className="w-4 h-4" />
          {blueprint.urgencyBanner}
        </motion.div>
      )}

      {blueprint.sectionOrder.map((sectionKey, i) => (
        <motion.div
          key={sectionKey}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
        >
          {sections[sectionKey]}
        </motion.div>
      ))}
    </div>
  );
}

/* ─── HERO VARIANTS ──────────────────────────────────── */

function HeroSection({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const layout = blueprint.heroLayout || "centered";
  switch (layout) {
    case "split-left":
      return <HeroSplitLeft blueprint={blueprint} darkMode={darkMode} />;
    case "split-right":
      return <HeroSplitRight blueprint={blueprint} darkMode={darkMode} />;
    case "dark-hero":
      return <HeroDark blueprint={blueprint} />;
    case "minimal":
      return <HeroMinimal blueprint={blueprint} darkMode={darkMode} />;
    case "gradient-wave":
      return <HeroGradientWave blueprint={blueprint} />;
    case "asymmetric":
      return <HeroAsymmetric blueprint={blueprint} darkMode={darkMode} />;
    case "full-impact":
      return <HeroFullImpact blueprint={blueprint} />;
    case "magazine":
      return <HeroMagazine blueprint={blueprint} darkMode={darkMode} />;
    case "terminal":
      return <HeroTerminal blueprint={blueprint} />;
    case "bento":
      return <HeroBento blueprint={blueprint} darkMode={darkMode} />;
    case "luxury":
      return <HeroLuxury blueprint={blueprint} darkMode={darkMode} />;
    default:
      return <HeroCentered blueprint={blueprint} darkMode={darkMode} />;
  }
}

function HeroCentered({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: colorScheme.heroBg || colorScheme.background }}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${colorScheme.primary}18 0%, transparent 60%)`,
        }}
      />
      <div className="relative max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
        <PersonaBadge blueprint={blueprint} />
        <motion.h1
          key={blueprint.headline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6"
          style={{ color: textColor }}
        >
          {blueprint.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: mutedColor }}
        >
          {blueprint.subheadline}
        </motion.p>
        <HeroCTAs blueprint={blueprint} darkMode={darkMode} center />
        <StatsBar blueprint={blueprint} darkMode={darkMode} center />
      </div>
    </section>
  );
}

function HeroSplitLeft({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: colorScheme.heroBg || colorScheme.background }}>
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left copy */}
        <div>
          <PersonaBadge blueprint={blueprint} />
          <motion.h1
            key={blueprint.headline}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            style={{ color: textColor }}
          >
            {blueprint.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl mb-8 leading-relaxed"
            style={{ color: mutedColor }}
          >
            {blueprint.subheadline}
          </motion.p>
          <HeroCTAs blueprint={blueprint} darkMode={darkMode} />
          <StatsBar blueprint={blueprint} darkMode={darkMode} />
        </div>
        {/* Right visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl p-8 border relative overflow-hidden"
          style={{
            borderColor: `${colorScheme.primary}20`,
            background: darkMode
              ? `linear-gradient(135deg, ${colorScheme.primary}10, ${colorScheme.primary}05)`
              : `linear-gradient(135deg, ${colorScheme.primary}08, ${colorScheme.accent || colorScheme.primary}05)`,
          }}
        >
          <div className="space-y-4">
            {blueprint.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
              >
                <span className="font-medium" style={{ color: mutedColor }}>{stat.label}</span>
                <span className="text-2xl font-bold" style={{ color: colorScheme.primary }}>{stat.value}</span>
              </motion.div>
            ))}
          </div>
          {/* Decorative */}
          <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: colorScheme.primary }} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroDark({ blueprint }: { blueprint: MutationBlueprint }) {
  const { colorScheme } = blueprint;
  const heroBg = colorScheme.heroBg && colorScheme.heroBg !== "#ffffff" ? colorScheme.heroBg : "#0f172a";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: heroBg }}>
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(${colorScheme.primary}40 1px, transparent 1px), linear-gradient(90deg, ${colorScheme.primary}40 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      {/* Terminal glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 blur-[100px]"
        style={{ backgroundColor: colorScheme.primary }}
      />

      <div className="relative max-w-5xl mx-auto px-6 pt-32 pb-24">
        <PersonaBadge blueprint={blueprint} dark />
        <motion.h1
          key={blueprint.headline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6 text-white"
        >
          {blueprint.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xl md:text-2xl max-w-2xl mb-10 leading-relaxed text-slate-400"
        >
          {blueprint.subheadline}
        </motion.p>
        <HeroCTAs blueprint={blueprint} darkMode />
        {/* Code block style stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-14 max-w-lg rounded-xl border p-5 font-mono text-sm"
          style={{ borderColor: `${colorScheme.primary}30`, backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="flex items-center gap-2 mb-3 text-slate-500">
            <Terminal className="w-4 h-4" />
            <span>morph.ai — live metrics</span>
          </div>
          {blueprint.stats.map((stat) => (
            <div key={stat.label} className="flex justify-between py-1.5 border-b border-white/5 last:border-0">
              <span className="text-slate-400">{stat.label}</span>
              <span className="font-bold" style={{ color: colorScheme.primary }}>{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HeroMinimal({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <section style={{ backgroundColor: colorScheme.heroBg || colorScheme.background }}>
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-20">
        <PersonaBadge blueprint={blueprint} dark={darkMode} />
        <motion.h1
          key={blueprint.headline}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.15] mb-5"
          style={{ color: textColor }}
        >
          {blueprint.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl mb-8 leading-relaxed"
          style={{ color: mutedColor }}
        >
          {blueprint.subheadline}
        </motion.p>
        <HeroCTAs blueprint={blueprint} darkMode={darkMode} />
        <div className="mt-12 pt-8 border-t" style={{ borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}>
          <p className="text-sm mb-4" style={{ color: mutedColor }}>{blueprint.socialProof}</p>
          <StatsBar blueprint={blueprint} darkMode={darkMode} />
        </div>
      </div>
    </section>
  );
}

/* ─── SHARED HERO PARTS ──────────────────────────────── */

function PersonaBadge({ blueprint, dark }: { blueprint: MutationBlueprint; dark?: boolean }) {
  const { colorScheme } = blueprint;
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
      style={{
        border: `1px solid ${dark ? `${colorScheme.primary}40` : `${colorScheme.primary}30`}`,
        color: colorScheme.primary,
        backgroundColor: dark ? `${colorScheme.primary}15` : `${colorScheme.primary}08`,
      }}
    >
      <Sparkles className="w-3.5 h-3.5" />
      Personalized for: {blueprint.persona}
    </motion.div>
  );
}

function HeroCTAs({ blueprint, darkMode, center }: { blueprint: MutationBlueprint; darkMode?: boolean; center?: boolean }) {
  const { colorScheme } = blueprint;
  return (
    <div className={`flex flex-wrap gap-4 items-center ${center ? "justify-center" : ""}`}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg flex items-center gap-2 transition-shadow hover:shadow-xl"
        style={{
          backgroundColor: blueprint.ctaColor || colorScheme.primary,
          boxShadow: `0 8px 30px ${blueprint.ctaColor || colorScheme.primary}40`,
        }}
      >
        {blueprint.ctaText}
        <ArrowRight className="w-5 h-5" />
      </motion.button>
      <button
        className="px-6 py-4 rounded-xl border font-medium text-lg transition-colors"
        style={{
          borderColor: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
          color: darkMode ? "#e2e8f0" : "#374151",
          backgroundColor: "transparent",
        }}
      >
        {blueprint.secondaryCtaText || "Learn More"}
      </button>
    </div>
  );
}

function StatsBar({ blueprint, darkMode, center }: { blueprint: MutationBlueprint; darkMode?: boolean; center?: boolean }) {
  const { colorScheme } = blueprint;
  if (!blueprint.stats?.length) return null;

  return (
    <div className={`mt-14 grid gap-8 max-w-2xl ${center ? "mx-auto" : ""}`} style={{ gridTemplateColumns: `repeat(${Math.min(blueprint.stats.length, 4)}, 1fr)` }}>
      {blueprint.stats.map((stat) => (
        <div key={stat.label} className={center ? "text-center" : ""}>
          <div className="text-3xl font-bold" style={{ color: colorScheme.primary }}>
            {stat.value}
          </div>
          <div className="text-sm mt-1" style={{ color: darkMode ? "#94a3b8" : "#6b7280" }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── NEW HERO VARIANTS ──────────────────────────────── */

function HeroSplitRight({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: colorScheme.heroBg || colorScheme.background }}>
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: feature cards grid */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 gap-3 order-2 lg:order-1"
        >
          {blueprint.features.slice(0, 4).map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="p-4 rounded-xl border"
              style={{
                borderColor: darkMode ? "rgba(255,255,255,0.08)" : `${colorScheme.primary}15`,
                backgroundColor: darkMode ? "rgba(255,255,255,0.04)" : `${colorScheme.primary}05`,
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${colorScheme.primary}15`, color: colorScheme.primary }}>
                {ICONS[f.icon] || <Sparkles className="w-6 h-6" />}
              </div>
              <div className="text-sm font-semibold" style={{ color: textColor }}>{f.title}</div>
            </motion.div>
          ))}
        </motion.div>
        {/* Right: copy */}
        <div className="order-1 lg:order-2">
          <PersonaBadge blueprint={blueprint} dark={darkMode} />
          <motion.h1
            key={blueprint.headline}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            style={{ color: textColor }}
          >
            {blueprint.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl mb-8 leading-relaxed"
            style={{ color: mutedColor }}
          >
            {blueprint.subheadline}
          </motion.p>
          <HeroCTAs blueprint={blueprint} darkMode={darkMode} />
          <StatsBar blueprint={blueprint} darkMode={darkMode} />
        </div>
      </div>
    </section>
  );
}

function HeroGradientWave({ blueprint }: { blueprint: MutationBlueprint }) {
  const { colorScheme } = blueprint;

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center" style={{ background: `linear-gradient(135deg, ${colorScheme.primary}EE, ${colorScheme.accent || colorScheme.primary}, ${colorScheme.primary}BB)` }}>
      {/* Wavy overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="white" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,176C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
      {/* Floating circles */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "white" }} />
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "white" }} />

      <div className="relative max-w-4xl mx-auto px-6 py-32 text-center">
        <PersonaBadge blueprint={blueprint} dark />
        <motion.h1
          key={blueprint.headline}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6 text-white"
        >
          {blueprint.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 leading-relaxed text-white/80"
        >
          {blueprint.subheadline}
        </motion.p>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-xl bg-white font-semibold text-lg shadow-lg flex items-center gap-2 transition-shadow hover:shadow-xl"
            style={{ color: colorScheme.primary }}
          >
            {blueprint.ctaText}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
          <button className="px-6 py-4 rounded-xl border border-white/30 font-medium text-lg text-white hover:bg-white/10 transition-colors">
            {blueprint.secondaryCtaText || "Learn More"}
          </button>
        </div>
        {/* Stats on gradient */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {blueprint.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm mt-1 text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroAsymmetric({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: colorScheme.heroBg || colorScheme.background }}>
      {/* Asymmetric colored block */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.06]" style={{ backgroundColor: colorScheme.primary }} />
      <div className="absolute top-0 right-0 w-px h-full" style={{ backgroundColor: `${colorScheme.primary}20` }} />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="max-w-2xl">
          <PersonaBadge blueprint={blueprint} dark={darkMode} />
          <motion.h1
            key={blueprint.headline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
            style={{ color: textColor }}
          >
            {blueprint.headline}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-xl mb-8 leading-relaxed"
            style={{ color: mutedColor }}
          >
            {blueprint.subheadline}
          </motion.p>
          <HeroCTAs blueprint={blueprint} darkMode={darkMode} />
        </div>

        {/* Stats positioned asymmetrically on the right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-1/2 -translate-y-1/2 right-12 hidden xl:flex flex-col gap-6"
        >
          {blueprint.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-right"
            >
              <div className="text-4xl font-bold" style={{ color: colorScheme.primary }}>{stat.value}</div>
              <div className="text-sm" style={{ color: mutedColor }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile stats fallback */}
        <div className="xl:hidden mt-12">
          <StatsBar blueprint={blueprint} darkMode={darkMode} />
        </div>
      </div>
    </section>
  );
}

function HeroFullImpact({ blueprint }: { blueprint: MutationBlueprint }) {
  const { colorScheme } = blueprint;
  const heroBg = colorScheme.heroBg && colorScheme.heroBg !== "#ffffff" ? colorScheme.heroBg : "#0a0a0a";

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center" style={{ backgroundColor: heroBg }}>
      {/* Radial glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-15 blur-[120px]" style={{ backgroundColor: colorScheme.primary }} />
      </div>
      {/* Dotted grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(${colorScheme.primary} 1px, transparent 1px)`, backgroundSize: "24px 24px" }} />

      <div className="relative text-center px-6 max-w-5xl">
        <PersonaBadge blueprint={blueprint} dark />
        <motion.h1
          key={blueprint.headline}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.0] mb-6 text-white"
        >
          {blueprint.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed text-gray-400"
        >
          {blueprint.subheadline}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <HeroCTAs blueprint={blueprint} darkMode center />
        </motion.div>

        {/* Stats as floating pills */}
        <div className="mt-20 flex flex-wrap justify-center gap-4">
          {blueprint.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="px-5 py-3 rounded-full border flex items-center gap-3"
              style={{ borderColor: `${colorScheme.primary}30`, backgroundColor: `${colorScheme.primary}08` }}
            >
              <span className="text-lg font-bold" style={{ color: colorScheme.primary }}>{stat.value}</span>
              <span className="text-sm text-gray-400">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── EDITORIAL / BENTO / TERMINAL / LUXURY HEROES ─── */

function HeroMagazine({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const bg = colorScheme.heroBg || colorScheme.background;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: bg }}>
      {/* Thick top accent rule */}
      <div className="h-[3px] w-full" style={{ backgroundColor: colorScheme.primary }} />
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-0 items-start">
        {/* Left: editorial copy */}
        <div className="pr-0 lg:pr-16 pb-12 lg:pb-0 border-b lg:border-b-0 lg:border-r" style={{ borderColor: `${colorScheme.primary}20` }}>
          <PersonaBadge blueprint={blueprint} dark={darkMode} />
          <motion.h1
            key={blueprint.headline}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black leading-[0.92] tracking-tight mb-6"
            style={{ color: textColor, fontFamily: '"Georgia", "Times New Roman", serif' }}
          >
            {blueprint.headline}
          </motion.h1>
          <div className="w-12 h-[3px] mb-6" style={{ backgroundColor: colorScheme.primary }} />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl mb-10 leading-relaxed max-w-xl"
            style={{ color: mutedColor }}
          >
            {blueprint.subheadline}
          </motion.p>
          <HeroCTAs blueprint={blueprint} darkMode={darkMode} />
        </div>
        {/* Right: metrics panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-12 lg:pt-20 pl-0 lg:pl-12 flex flex-col"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: colorScheme.primary }}>Key Metrics</p>
          {blueprint.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="py-5 border-b last:border-0"
              style={{ borderColor: `${colorScheme.primary}15` }}
            >
              <div className="text-5xl font-black leading-none" style={{ color: colorScheme.primary }}>{stat.value}</div>
              <div className="text-sm font-medium mt-2" style={{ color: mutedColor }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HeroTerminal({ blueprint }: { blueprint: MutationBlueprint }) {
  const { colorScheme } = blueprint;
  const termBg = colorScheme.heroBg && colorScheme.heroBg !== "#ffffff" ? colorScheme.heroBg : "#0d1117";

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center" style={{ backgroundColor: termBg }}>
      {/* Scan lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `repeating-linear-gradient(0deg, ${colorScheme.primary} 0px, ${colorScheme.primary} 1px, transparent 1px, transparent 4px)` }}
      />
      {/* Screen glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] opacity-20 blur-[80px]" style={{ backgroundColor: colorScheme.primary }} />

      <div className="relative max-w-4xl mx-auto px-6 py-24 font-mono">
        {/* Window chrome */}
        <div className="flex items-center gap-2 mb-8 pb-4 border-b" style={{ borderColor: `${colorScheme.primary}20` }}>
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-3 text-xs" style={{ color: `${colorScheme.primary}55` }}>
            morph.ai — orchestrator@edge:~
          </span>
        </div>

        <div className="space-y-1.5 text-sm mb-10" style={{ color: `${colorScheme.primary}55` }}>
          <div>$ morph init --persona=&quot;{blueprint.persona}&quot;</div>
          <div>&nbsp;&nbsp;↳ Analyzing signals... <span style={{ color: colorScheme.primary }}>DONE</span></div>
          <div>&nbsp;&nbsp;↳ Generating blueprint... <span style={{ color: colorScheme.primary }}>DONE</span></div>
          <div>&nbsp;&nbsp;↳ Selected layout: <span style={{ color: colorScheme.primary }}>terminal</span></div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <div className="text-xs mb-2" style={{ color: `${colorScheme.primary}50` }}>// OUTPUT</div>
          <h1
            className="text-4xl md:text-6xl font-black mb-4 leading-tight"
            style={{ color: colorScheme.primary, fontFamily: '"Courier New", "Lucida Console", monospace' }}
          >
            {blueprint.headline}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop", ease: "linear", times: [0, 0.5, 0.5] }}
              className="inline-block w-[3px] h-[0.8em] align-middle ml-2"
              style={{ backgroundColor: colorScheme.primary }}
            />
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-base mb-10 max-w-2xl leading-relaxed"
          style={{ fontFamily: '"Courier New", monospace' }}
        >
          <span style={{ color: `${colorScheme.primary}50` }}>// </span>
          {blueprint.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap gap-4 items-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 text-sm font-bold flex items-center gap-2"
            style={{
              backgroundColor: colorScheme.primary,
              color: "#0d1117",
              fontFamily: '"Courier New", monospace',
            }}
          >
            $ {blueprint.ctaText}
          </motion.button>
          <button
            className="px-6 py-3 text-sm border transition-colors hover:bg-white/5"
            style={{
              borderColor: `${colorScheme.primary}30`,
              color: `${colorScheme.primary}70`,
              fontFamily: '"Courier New", monospace',
            }}
          >
            --help
          </button>
        </motion.div>

        {/* Stats as terminal output */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-1.5 text-sm border-t pt-6"
          style={{ borderColor: `${colorScheme.primary}15`, fontFamily: '"Courier New", monospace' }}
        >
          {blueprint.stats.map((stat) => (
            <div key={stat.label} className="flex gap-4">
              <span style={{ color: `${colorScheme.primary}40` }}>&gt;</span>
              <span className="text-slate-500">{stat.label}:</span>
              <span className="font-bold" style={{ color: colorScheme.primary }}>{stat.value}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HeroBento({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : `${colorScheme.primary}06`;
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : `${colorScheme.primary}18`;

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: colorScheme.heroBg || colorScheme.background }}>
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-16">
        <PersonaBadge blueprint={blueprint} dark={darkMode} />
        <motion.h1
          key={blueprint.headline}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-4 max-w-3xl"
          style={{ color: textColor }}
        >
          {blueprint.headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl mb-8 max-w-2xl leading-relaxed"
          style={{ color: mutedColor }}
        >
          {blueprint.subheadline}
        </motion.p>
        <HeroCTAs blueprint={blueprint} darkMode={darkMode} />

        {/* Bento grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 auto-rows-[140px] gap-3">
          {/* Big tile: first stat fills 2×2 */}
          {blueprint.stats[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="col-span-2 row-span-2 rounded-2xl p-8 flex flex-col justify-between"
              style={{ backgroundColor: colorScheme.primary }}
            >
              <div className="text-white/60 text-sm font-medium">{blueprint.stats[0].label}</div>
              <div className="text-6xl font-black text-white leading-none">{blueprint.stats[0].value}</div>
            </motion.div>
          )}
          {/* Smaller stat tiles */}
          {blueprint.stats.slice(1).map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="rounded-2xl p-5 border flex flex-col justify-between"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <div className="text-2xl font-black" style={{ color: colorScheme.primary }}>{stat.value}</div>
              <div className="text-xs font-medium" style={{ color: mutedColor }}>{stat.label}</div>
            </motion.div>
          ))}
          {/* Feature highlight tile */}
          {blueprint.features[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55 }}
              className="col-span-2 rounded-2xl p-5 border flex items-center gap-4"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colorScheme.primary}20`, color: colorScheme.primary }}>
                {ICONS[blueprint.features[0].icon] || <Sparkles className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: textColor }}>{blueprint.features[0].title}</div>
                <div className="text-xs mt-0.5 leading-relaxed" style={{ color: mutedColor }}>{blueprint.features[0].description}</div>
              </div>
            </motion.div>
          )}
          {/* Testimonial tile */}
          {blueprint.testimonial?.quote && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65 }}
              className="col-span-2 rounded-2xl p-5 border flex flex-col justify-between"
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            >
              <p className="text-xs italic leading-relaxed line-clamp-2" style={{ color: mutedColor }}>
                &ldquo;{blueprint.testimonial.quote}&rdquo;
              </p>
              <p className="text-xs font-semibold mt-2" style={{ color: colorScheme.primary }}>{blueprint.testimonial.author}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroLuxury({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const bg = colorScheme.heroBg || colorScheme.background || "#fafaf8";
  const textColor = darkMode ? "#f1f5f9" : "#1a1a1a";
  const mutedColor = darkMode ? "#94a3b8" : "#6b7280";

  return (
    <section className="relative" style={{ backgroundColor: bg }}>
      {/* Top centered rule with dot */}
      <div className="max-w-5xl mx-auto px-8 md:px-12">
        <div className="pt-24 flex items-center gap-4">
          <div className="h-px flex-1" style={{ backgroundColor: `${colorScheme.primary}25` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colorScheme.primary }} />
          <div className="h-px flex-1" style={{ backgroundColor: `${colorScheme.primary}25` }} />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 md:px-12 pt-14 pb-20">
        <PersonaBadge blueprint={blueprint} dark={darkMode} />
        <motion.h1
          key={blueprint.headline}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl leading-[1.05] mb-8"
          style={{
            color: textColor,
            fontFamily: '"Palatino", "Palatino Linotype", "Book Antiqua", Georgia, serif',
            fontWeight: 300,
            letterSpacing: "-0.015em",
          }}
        >
          {blueprint.headline}
        </motion.h1>

        {/* Separator */}
        <div className="flex items-center gap-6 mb-10">
          <div className="h-[2px] w-16" style={{ backgroundColor: colorScheme.primary }} />
          <div className="h-px flex-1 opacity-20" style={{ backgroundColor: colorScheme.primary }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 items-start">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg leading-[1.85]"
            style={{ color: mutedColor, fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: "italic" }}
          >
            {blueprint.subheadline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-5"
          >
            <HeroCTAs blueprint={blueprint} darkMode={darkMode} />
            {/* Stats as refined ledger */}
            <div className="pt-5 border-t space-y-3" style={{ borderColor: `${colorScheme.primary}15` }}>
              {blueprint.stats.map((stat) => (
                <div key={stat.label} className="flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-[0.12em]" style={{ color: mutedColor }}>{stat.label}</span>
                  <span className="text-xl font-light" style={{ color: colorScheme.primary }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="max-w-5xl mx-auto px-8 md:px-12">
        <div className="pb-2 flex items-center gap-4">
          <div className="h-px flex-1" style={{ backgroundColor: `${colorScheme.primary}20` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `${colorScheme.primary}40` }} />
          <div className="h-px flex-1" style={{ backgroundColor: `${colorScheme.primary}20` }} />
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ──────────────────────────────────────── */

function FeaturesSection({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const sorted = [...blueprint.features].sort((a, b) => a.priority - b.priority);
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <section id="features" className="py-24 px-6" style={{ backgroundColor: colorScheme.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>
            {sorted[0]?.title ? "Why Teams Choose morph.ai" : "How morph.ai Works"}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: mutedColor }}>
            {blueprint.socialProof}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sorted.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group p-8 rounded-2xl border hover:shadow-xl transition-all duration-300"
              style={{
                borderColor: darkMode ? "rgba(255,255,255,0.08)" : `${colorScheme.primary}15`,
                backgroundColor: darkMode ? "rgba(255,255,255,0.03)" : colorScheme.background,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300"
                style={{
                  backgroundColor: `${colorScheme.primary}15`,
                  color: colorScheme.primary,
                }}
              >
                {ICONS[feature.icon] || <Sparkles className="w-6 h-6" />}
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>
                {feature.title}
              </h3>
              <p style={{ color: mutedColor }}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SOCIAL PROOF / TESTIMONIAL ─────────────────────── */

function SocialProofSection({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme, testimonial } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#6b7280";

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: darkMode ? "rgba(255,255,255,0.02)" : `${colorScheme.primary}05` }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Star rating */}
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {testimonial?.quote ? (
          <>
            <blockquote
              className="text-2xl md:text-3xl font-medium italic leading-relaxed mb-6"
              style={{ color: textColor }}
            >
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex flex-col items-center gap-1">
              <span className="font-semibold" style={{ color: textColor }}>{testimonial.author}</span>
              <span className="text-sm" style={{ color: mutedColor }}>{testimonial.role}</span>
              {testimonial.metric && (
                <span
                  className="mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${colorScheme.primary}15`, color: colorScheme.primary }}
                >
                  {testimonial.metric}
                </span>
              )}
            </div>
          </>
        ) : (
          <blockquote
            className="text-2xl md:text-3xl font-medium italic leading-relaxed mb-6"
            style={{ color: textColor }}
          >
            &ldquo;{blueprint.socialProof}&rdquo;
          </blockquote>
        )}
      </div>
    </section>
  );
}

/* ─── PRICING ────────────────────────────────────────── */

function PricingSection({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;
  const textColor = darkMode ? "#f1f5f9" : "#0f172a";
  const mutedColor = darkMode ? "#94a3b8" : "#64748b";

  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "For testing and small projects",
      features: ["10K mutations/month", "5 pages", "Basic analytics", "Community support"],
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$0.002",
      period: "/mutation",
      description: "For growing teams and agencies",
      features: ["Unlimited mutations", "Unlimited pages", "Kinetic Intent Engine", "Synthetic Simulator", "Priority support"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large-scale deployments",
      features: ["Everything in Pro", "Cross-Agent Protocol", "SOC 2 / GDPR", "Custom SLA (99.99%)", "Dedicated support"],
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6" style={{ backgroundColor: colorScheme.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>
            Simple, Usage-Based Pricing
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: mutedColor }}>
            Start free. Scale as you grow. Only pay for mutations served.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-8 ${plan.highlighted ? "ring-2 relative" : ""}`}
              style={{
                borderColor: plan.highlighted ? colorScheme.primary : (darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"),
                backgroundColor: darkMode ? "rgba(255,255,255,0.03)" : colorScheme.background,
                "--tw-ring-color": plan.highlighted ? colorScheme.primary : undefined,
              } as React.CSSProperties}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: colorScheme.primary }}
                >
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-1" style={{ color: textColor }}>{plan.name}</h3>
              <p className="text-sm mb-4" style={{ color: mutedColor }}>{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold" style={{ color: textColor }}>{plan.price}</span>
                <span style={{ color: mutedColor }}>{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: colorScheme.primary }} />
                    <span style={{ color: darkMode ? "#cbd5e1" : "#4b5563" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{
                  backgroundColor: plan.highlighted ? colorScheme.primary : `${colorScheme.primary}15`,
                  color: plan.highlighted ? "#fff" : colorScheme.primary,
                }}
              >
                {plan.highlighted ? blueprint.ctaText : "Get Started"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ──────────────────────────────────────── */

function CTASection({ blueprint, darkMode }: { blueprint: MutationBlueprint; darkMode: boolean }) {
  const { colorScheme } = blueprint;

  return (
    <section className="py-24 px-6" style={{ backgroundColor: colorScheme.background }}>
      <div
        className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${colorScheme.primary}, ${colorScheme.accent || colorScheme.primary}CC)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Evolve Your Web?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
            {blueprint.socialProof}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-4 bg-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
            style={{ color: colorScheme.primary }}
          >
            {blueprint.ctaText} →
          </motion.button>
        </div>
      </div>
    </section>
  );
}
