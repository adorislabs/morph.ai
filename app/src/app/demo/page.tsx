import Navbar from "@/components/Navbar";
import DemoURLGenerator from "@/components/DemoURLGenerator";
import { ArrowRight, Sparkles, MousePointer, Zap, Bot } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF5C28]/20 text-[#FF5C28] text-sm font-medium mb-6 bg-[#FF5C28]/5">
              <Sparkles className="w-3.5 h-3.5" />
              Interactive Demo
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Watch The Same URL <span className="text-[#FF5C28]">Morph</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Each link below simulates a different visitor arriving at the same
              URL. The AI orchestrator generates a completely different
              experience for each — different layout, colors, copy, and content. Open them in separate tabs to compare.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {[
              {
                icon: <MousePointer className="w-5 h-5" />,
                title: "1. Click a Scenario",
                desc: "Each link carries different UTM signals — just like a real ad click.",
              },
              {
                icon: <Zap className="w-5 h-5" />,
                title: "2. AI Orchestrates",
                desc: "Gemini analyzes signals and generates a Mutation Blueprint in real-time.",
              },
              {
                icon: <Bot className="w-5 h-5" />,
                title: "3. Page Morphs",
                desc: "The landing page renders completely personalized. Toggle God Mode to see the reasoning.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="p-5 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FF5C28]/10 text-[#FF5C28] flex items-center justify-center mb-3">
                  {step.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* URL Generator */}
          <DemoURLGenerator />

          {/* Quick morph link */}
          <div className="mt-8 text-center">
            <Link
              href="/morph"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#FF5C28] transition-colors"
            >
              Or visit the morph page directly (no signals — default experience)
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
