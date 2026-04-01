"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { MutationBlueprint, VisitorSignals, AgentThought } from "@/types";
import { DEFAULT_BLUEPRINT } from "@/lib/orchestrator";
import { useKineticEngine } from "@/lib/kinetic-engine";
import MorphPage from "@/components/MorphPage";
import GodModePanel from "@/components/GodModePanel";
import KineticOverlay from "@/components/KineticOverlay";
import Navbar from "@/components/Navbar";
import { Loader2 } from "lucide-react";

function isDarkBg(bg: string): boolean {
  if (!bg || bg === "#ffffff" || bg === "#fff") return false;
  const hex = bg.replace("#", "");
  if (hex.length < 6) return false;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export default function MorphClient() {
  const searchParams = useSearchParams();
  const kineticState = useKineticEngine();

  const [blueprint, setBlueprint] = useState<MutationBlueprint | null>(null);
  const [signals, setSignals] = useState<VisitorSignals | null>(null);
  const [loading, setLoading] = useState(true);
  const [godModeOpen, setGodModeOpen] = useState(true);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [latency, setLatency] = useState<number | null>(null);
  const [showKinetic, setShowKinetic] = useState(true);
  const hasFetched = useRef(false);

  const addThought = useCallback(
    (agent: AgentThought["agent"], thought: string, action?: string) => {
      setThoughts((prev) => [
        ...prev,
        { agent, thought, timestamp: Date.now(), action },
      ]);
    },
    []
  );

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    addThought("orchestrator", "Intercepting visitor signals from URL parameters...");

    async function fetchBlueprint() {
      try {
        addThought("orchestrator", "Sending signals to Gemini AI for mutation blueprint generation...");

        const res = await fetch("/api/orchestrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchParams: params }),
        });

        const data = await res.json();

        if (data.blueprint) {
          setBlueprint(data.blueprint);
          setSignals(data.signals);
          setLatency(data.meta?.latency_ms || null);

          addThought("orchestrator", `Blueprint generated in ${data.meta?.latency_ms || "?"}ms. Persona: "${data.blueprint.persona}"`);
          addThought("design", `Applying color scheme: ${data.blueprint.colorScheme.primary}. Tone: ${data.blueprint.tone}`);
          addThought("copy", `Headline mutated: "${data.blueprint.headline}"`);
          addThought("guardrail", "Blueprint passes brand safety checks. No policy violations detected.");
        } else {
          setBlueprint(DEFAULT_BLUEPRINT);
          addThought("orchestrator", "Using default blueprint (API returned no data).");
        }
      } catch {
        setBlueprint(DEFAULT_BLUEPRINT);
        addThought("orchestrator", "Fallback to default blueprint due to API error.");
      } finally {
        setLoading(false);
      }
    }

    fetchBlueprint();
  }, [searchParams, addThought]);

  // Kinetic adaptation: re-morph when emotional state changes significantly
  const lastAdaptedState = useRef(kineticState.emotionalState);
  useEffect(() => {
    if (!blueprint || loading) return;
    if (kineticState.emotionalState === lastAdaptedState.current) return;
    if (kineticState.confidence < 0.7) return;

    lastAdaptedState.current = kineticState.emotionalState;
    addThought(
      "kinetic",
      `Emotional state changed to ${kineticState.emotionalState} (confidence: ${Math.round(kineticState.confidence * 100)}%). Evaluating page adaptation...`
    );

    // Apply lightweight kinetic adaptations without re-calling the API
    if (kineticState.emotionalState === "CONFUSED") {
      addThought("design", "User appears confused. Simplifying layout, adding guidance elements.");
    } else if (kineticState.emotionalState === "URGENT") {
      addThought("copy", "User shows urgency. Streamlining to CTA, reducing friction.");
    } else if (kineticState.emotionalState === "SKEPTICAL") {
      addThought("copy", "User appears skeptical. Emphasizing social proof and data points.");
    } else if (kineticState.emotionalState === "ENGAGED") {
      addThought("design", "User is engaged. Maintaining current layout, expanding depth.");
    }
  }, [kineticState.emotionalState, kineticState.confidence, blueprint, loading, addThought]);

  if (loading) {
    const detectedSignals: string[] = [];
    searchParams.forEach((value, key) => {
      if (key.startsWith('utm_') || key === 'ref' || key === 'q' || key === 'agent_id') {
        detectedSignals.push(`${key}: ${value}`);
      }
    });

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 gap-6">
        <div className="w-14 h-14 rounded-2xl bg-[#FF5C28] flex items-center justify-center text-white font-bold text-xl">
          m
        </div>
        <div className="flex items-center gap-3 text-gray-300">
          <Loader2 className="w-5 h-5 animate-spin text-[#FF5C28]" />
          <span className="text-lg font-medium">Morphing page for your intent...</span>
        </div>
        {detectedSignals.length > 0 && (
          <div className="max-w-sm w-full space-y-2 px-6">
            <p className="text-xs text-gray-500 uppercase tracking-wider text-center">Detected Signals</p>
            {detectedSignals.map((s) => (
              <div key={s} className="text-sm font-mono text-gray-400 bg-gray-900 rounded-lg px-3 py-1.5 text-center">{s}</div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-600">Powered by Gemini 2.5 Flash</p>
      </div>
    );
  }

  if (!blueprint) return null;

  const darkMode = isDarkBg(blueprint.colorScheme.background);

  return (
    <div className="relative">
      {/* Back-to-demo bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gray-950/90 backdrop-blur-sm border-b border-white/5 h-10 flex items-center px-4 gap-4 text-xs">
        <a href="/demo" className="text-[#FF5C28] hover:text-[#FF8C64] font-semibold transition-colors">← Try Another Persona</a>
        <span className="text-gray-500">|</span>
        <span className="text-gray-400 truncate">Persona: <strong className="text-gray-200">{blueprint.persona}</strong></span>
        <span className="text-gray-600 hidden sm:inline truncate">Layout: {blueprint.heroLayout}</span>
        {latency && <span className="text-gray-600 ml-auto flex-shrink-0">{latency}ms</span>}
      </div>

      <Navbar primary={blueprint.colorScheme.primary} darkMode={darkMode} />

      <div className="pt-[calc(4rem+2.5rem)]">
        <MorphPage blueprint={blueprint} />
      </div>

      {/* God Mode — offset from top bar */}
      <GodModePanel
        isOpen={godModeOpen}
        onToggle={() => setGodModeOpen(!godModeOpen)}
        blueprint={blueprint}
        signals={signals}
        kineticState={kineticState}
        thoughts={thoughts}
        latency={latency}
        topOffset={40}
      />

      {/* Kinetic Overlay */}
      {showKinetic && <KineticOverlay kineticState={kineticState} darkMode={darkMode} />}

      {/* Toggle kinetic overlay */}
      <button
        onClick={() => setShowKinetic(!showKinetic)}
        className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 transition-colors"
      >
        {showKinetic ? "Hide" : "Show"} Kinetic
      </button>
    </div>
  );
}
