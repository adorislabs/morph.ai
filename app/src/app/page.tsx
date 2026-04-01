import { ArrowRight, Brain, Zap, Bot, BarChart3, Globe, Shield, Eye, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF5C28] flex items-center justify-center text-white font-bold text-sm">
              m
            </div>
            <span className="font-bold text-lg text-gray-900">
              morph<span className="text-[#FF5C28]">.ai</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Dashboard</a>
            <Link href="/demo" className="px-5 py-2 rounded-lg bg-[#FF5C28] text-white text-sm font-medium hover:opacity-90 transition-opacity">
              Try Demo
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 30% 20%, #FF5C28 0%, transparent 50%), radial-gradient(circle at 70% 80%, #FF8C64 0%, transparent 50%)",
        }} />
        <div className="relative max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF5C28]/20 text-[#FF5C28] text-sm font-medium mb-8 bg-[#FF5C28]/5">
            <Sparkles className="w-3.5 h-3.5" />
            The Agentic Web Experience Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 max-w-4xl leading-[1.1] mb-6">
            Every URL, a Living{" "}
            <span className="text-[#FF5C28]">Sensing Agent</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
            morph.ai reads intent, emotion, and behavior — then reconstructs your website&apos;s DNA in under 200ms. Zero flicker. Pure conversion.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/demo" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FF5C28] text-white font-semibold text-lg shadow-lg shadow-[#FF5C28]/30 hover:shadow-xl transition-shadow">
              See It In Action <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#how-it-works" className="px-6 py-4 rounded-xl border border-gray-200 text-gray-700 font-medium text-lg hover:bg-gray-50 transition-colors">
              How It Works
            </a>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl">
            <div>
              <div className="text-3xl font-bold text-[#FF5C28]">&lt;200ms</div>
              <div className="text-sm text-gray-500 mt-1">Edge Latency</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FF5C28]">40%</div>
              <div className="text-sm text-gray-500 mt-1">Lower Bounce Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FF5C28]">2.5×</div>
              <div className="text-sm text-gray-500 mt-1">ROAS Lift</div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Three Layers of Intelligence</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              morph.ai doesn&apos;t just change headlines. It evolves the entire web experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Intent Alignment",
                subtitle: "Layer 1 — The Foundation",
                description: "Ads personalization, journey tracking, audience tailoring, LLM-based personalization, A/B experimentation, and enterprise compliance. The complete platform.",
                color: "#3B82F6",
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Kinetic Intent Engine",
                subtitle: "Layer 2 — Inside The User's Head",
                description: "Reads cursor body language — hesitations, scroll velocity, hover patterns — to classify emotional state. The page adapts to how someone behaves, not just who they are.",
                color: "#FF5C28",
              },
              {
                icon: <Bot className="w-8 h-8" />,
                title: "Cross-Agent Protocol",
                subtitle: "Layer 3 — Beyond The Human",
                description: "When an AI agent visits, morph opens a machine-to-machine JSON-RPC channel. Your website talks to their AI. Built for a web that's half-human, half-machine.",
                color: "#8B5CF6",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: `${pillar.color}10`, color: pillar.color }}>
                  {pillar.icon}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: pillar.color }}>{pillar.subtitle}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-gray-500 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Full-Stack Agentic Platform</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Everything you need to make your web presence sentient.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-5 h-5" />, title: "Zero-Flicker Mutations", desc: "Edge-rendered DOM mutations arrive before the first byte. No layout shifts." },
              { icon: <Brain className="w-5 h-5" />, title: "Kinetic Intent Engine", desc: "CNN + LSTM classifies cursor body language into emotional states in <50ms." },
              { icon: <Bot className="w-5 h-5" />, title: "Cross-Agent Protocol", desc: "JSON-RPC handshake for AI agents. Pricing and features negotiated programmatically." },
              { icon: <BarChart3 className="w-5 h-5" />, title: "Synthetic Simulator", desc: "5,000 LLM-driven personas stress-test every page before real traffic arrives." },
              { icon: <Eye className="w-5 h-5" />, title: "God Mode Dashboard", desc: "See the AI's reasoning in real-time. Full transparency into every mutation decision." },
              { icon: <Shield className="w-5 h-5" />, title: "Enterprise Compliance", desc: "SOC 2, ISO 27001, GDPR, CCPA. Brand guardrails on every mutation." },
            ].map((feature) => (
              <div key={feature.title} className="p-6 rounded-xl border border-gray-100 hover:border-[#FF5C28]/20 hover:shadow-md transition-all group">
                <div className="w-10 h-10 rounded-lg bg-[#FF5C28]/10 text-[#FF5C28] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center bg-gradient-to-br from-[#FF5C28] to-[#FF8C64] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">See morph.ai in action</h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
              Watch the same URL transform into completely different experiences based on who visits it.
            </p>
            <Link href="/demo" className="inline-flex items-center gap-2 px-10 py-4 bg-white rounded-xl text-[#FF5C28] font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow">
              Launch Demo <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#FF5C28] flex items-center justify-center text-white font-bold text-xs">m</div>
            <span className="font-bold text-gray-900">morph<span className="text-[#FF5C28]">.ai</span></span>
          </div>
          <p className="text-sm text-gray-400">
            The web isn&apos;t coming — it&apos;s here. morph.ai is the infrastructure for a web that thinks.
          </p>
        </div>
      </footer>
    </div>
  );
}
