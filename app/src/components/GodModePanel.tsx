"use client";

import { AgentThought, MutationBlueprint, VisitorSignals, KineticState } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Brain,
  Paintbrush,
  PenTool,
  Shield,
  Activity,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const AGENT_ICONS: Record<string, React.ReactNode> = {
  orchestrator: <Brain className="w-3.5 h-3.5" />,
  design: <Paintbrush className="w-3.5 h-3.5" />,
  copy: <PenTool className="w-3.5 h-3.5" />,
  guardrail: <Shield className="w-3.5 h-3.5" />,
  kinetic: <Activity className="w-3.5 h-3.5" />,
};

const AGENT_COLORS: Record<string, string> = {
  orchestrator: "#FF5C28",
  design: "#8B5CF6",
  copy: "#3B82F6",
  guardrail: "#10B981",
  kinetic: "#F59E0B",
};

interface GodModeProps {
  isOpen: boolean;
  onToggle: () => void;
  blueprint: MutationBlueprint | null;
  signals: VisitorSignals | null;
  kineticState: KineticState | null;
  thoughts: AgentThought[];
  latency: number | null;
  topOffset?: number;
}

export default function GodModePanel({
  isOpen,
  onToggle,
  blueprint,
  signals,
  kineticState,
  thoughts,
  latency,
  topOffset = 0,
}: GodModeProps) {
  const [section, setSection] = useState<"reasoning" | "signals" | "blueprint" | "thoughts">("reasoning");

  // Esc key to close
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onToggle();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onToggle]);

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={onToggle}
        aria-label={isOpen ? "Close God Mode panel" : "Open God Mode panel"}
        aria-expanded={isOpen}
        className="fixed right-4 z-[70] flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium shadow-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF5C28] focus:ring-offset-2 focus:ring-offset-gray-950"
        style={{ top: `${topOffset + 12}px` }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Eye className="w-4 h-4" />
        God Mode
        {isOpen ? (
          <X className="w-3.5 h-3.5" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5" />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="fixed right-4 left-4 sm:left-auto z-[65] sm:w-[420px] max-h-[75vh] overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 text-white shadow-2xl"
            style={{ top: `${topOffset + 52}px` }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF5C28] animate-pulse" />
                <span className="text-sm font-bold">
                  morph.ai — Agent Reasoning
                </span>
              </div>
              {latency && (
                <span className="text-xs text-gray-400">
                  {latency}ms · Gemini Flash
                </span>
              )}
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-gray-800">
              {(["reasoning", "signals", "blueprint", "thoughts"] as const).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setSection(tab)}
                    className={`flex-1 px-3 py-2 text-xs font-medium capitalize transition-colors ${
                      section === tab
                        ? "text-[#FF5C28] border-b-2 border-[#FF5C28]"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh] p-4">
              {section === "reasoning" && blueprint && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Orchestrator Reasoning Chain
                  </div>
                  {blueprint.reasoning.map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF5C28]/20 text-[#FF5C28] flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {r}
                      </p>
                    </motion.div>
                  ))}
                  {blueprint.kineticAdaptation && (
                    <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-center gap-2 text-xs text-yellow-400 font-semibold mb-1">
                        <Activity className="w-3.5 h-3.5" />
                        Kinetic Adaptation
                      </div>
                      <p className="text-sm text-yellow-200">
                        {blueprint.kineticAdaptation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {section === "signals" && signals && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Captured Visitor Signals
                  </div>
                  <SignalRow label="Source" value={signals.utm_source || "direct"} />
                  <SignalRow label="Medium" value={signals.utm_medium || "none"} />
                  <SignalRow label="Campaign" value={signals.utm_campaign || "none"} />
                  <SignalRow label="Term" value={signals.utm_term || "none"} />
                  <SignalRow label="Referrer" value={signals.referrer || "direct"} />
                  <SignalRow label="Device" value={signals.device || "desktop"} />
                  <SignalRow label="Bot" value={signals.isBot ? "Yes 🤖" : "No"} />

                  {kineticState && (
                    <>
                      <div className="text-xs text-gray-400 uppercase tracking-wider mt-4 mb-2">
                        Kinetic Signals (Live)
                      </div>
                      <SignalRow
                        label="Emotional State"
                        value={kineticState.emotionalState}
                        highlight
                      />
                      <SignalRow
                        label="Confidence"
                        value={`${Math.round(kineticState.confidence * 100)}%`}
                      />
                      <SignalRow
                        label="Cursor Velocity"
                        value={`${Math.round(kineticState.signals.cursorVelocity)} px/s`}
                      />
                      <SignalRow
                        label="Scroll Depth"
                        value={`${Math.round(kineticState.signals.scrollDepth)}%`}
                      />
                      <SignalRow
                        label="Hesitations"
                        value={String(kineticState.signals.hesitationCount)}
                      />
                      <SignalRow
                        label="Rage Clicks"
                        value={String(kineticState.signals.rageclickCount)}
                      />
                    </>
                  )}
                </div>
              )}

              {section === "blueprint" && blueprint && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Active Mutation Blueprint
                  </div>
                  <pre className="text-xs text-gray-300 bg-gray-900 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        persona: blueprint.persona,
                        tone: blueprint.tone,
                        heroLayout: blueprint.heroLayout,
                        headline: blueprint.headline,
                        ctaText: blueprint.ctaText,
                        sectionOrder: blueprint.sectionOrder,
                        colorScheme: blueprint.colorScheme,
                        featureCount: blueprint.features.length,
                        stats: blueprint.stats,
                        testimonial: blueprint.testimonial,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              {section === "thoughts" && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    Agent Activity Log
                  </div>
                  {thoughts.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No agent activity yet. Interact with the page to trigger mutations.
                    </p>
                  ) : (
                    thoughts.map((t, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 p-2 rounded-lg bg-gray-900"
                      >
                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: `${AGENT_COLORS[t.agent]}20`,
                            color: AGENT_COLORS[t.agent],
                          }}
                        >
                          {AGENT_ICONS[t.agent]}
                        </div>
                        <div>
                          <div className="text-xs font-semibold capitalize" style={{ color: AGENT_COLORS[t.agent] }}>
                            {t.agent} Agent
                          </div>
                          <p className="text-xs text-gray-400">{t.thought}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SignalRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-1 px-2 rounded bg-gray-900/50">
      <span className="text-xs text-gray-500">{label}</span>
      <span
        className={`text-xs font-mono ${
          highlight ? "text-[#FF5C28] font-bold" : "text-gray-300"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
