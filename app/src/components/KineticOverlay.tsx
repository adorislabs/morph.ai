"use client";

import { KineticState } from "@/types";
import { motion } from "framer-motion";

const EMOTION_CONFIG: Record<
  string,
  { color: string; bg: string; darkBg: string; label: string; emoji: string }
> = {
  NEUTRAL: { color: "#6B7280", bg: "#F3F4F6", darkBg: "#1f2937", label: "Neutral", emoji: "😐" },
  CONFUSED: { color: "#EF4444", bg: "#FEE2E2", darkBg: "#451a1a", label: "Confused", emoji: "😕" },
  SKEPTICAL: { color: "#F59E0B", bg: "#FEF3C7", darkBg: "#451a03", label: "Skeptical", emoji: "🤨" },
  URGENT: { color: "#8B5CF6", bg: "#EDE9FE", darkBg: "#2e1065", label: "Urgent", emoji: "⚡" },
  ENGAGED: { color: "#10B981", bg: "#D1FAE5", darkBg: "#064e3b", label: "Engaged", emoji: "🎯" },
  BROWSING: { color: "#3B82F6", bg: "#DBEAFE", darkBg: "#1e3a5f", label: "Browsing", emoji: "👀" },
};

export default function KineticOverlay({
  kineticState,
  darkMode = false,
}: {
  kineticState: KineticState;
  darkMode?: boolean;
}) {
  const config = EMOTION_CONFIG[kineticState.emotionalState] || EMOTION_CONFIG.NEUTRAL;

  const panelBg = darkMode ? "bg-gray-950/90" : "bg-white/90";
  const panelBorder = darkMode ? "border-white/10" : "border-gray-200";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-500";
  const trackBg = darkMode ? "bg-gray-800" : "bg-gray-100";
  const historyBorder = darkMode ? "border-white/5" : "border-gray-100";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`fixed bottom-4 left-4 z-50 rounded-2xl border ${panelBorder} ${panelBg} backdrop-blur-xl shadow-2xl p-4 w-72`}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className={`text-xs font-semibold ${textMuted} uppercase tracking-wider`}>
          Kinetic Intent Engine
        </span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <motion.div
          key={kineticState.emotionalState}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="text-3xl"
          role="img"
          aria-label={config.label}
        >
          {config.emoji}
        </motion.div>
        <div>
          <motion.div
            key={kineticState.emotionalState}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-bold text-lg"
            style={{ color: config.color }}
          >
            {config.label}
          </motion.div>
          <div className={`text-xs ${textMuted}`}>
            Confidence: {Math.round(kineticState.confidence * 100)}%
          </div>
        </div>
      </div>

      {/* Signal bars */}
      <div className="space-y-2">
        <SignalBar label="Cursor Speed" value={Math.min(kineticState.signals.cursorVelocity / 10, 100)} color="#FF5C28" trackBg={trackBg} textMuted={textMuted} />
        <SignalBar label="Scroll Depth" value={kineticState.signals.scrollDepth} color="#3B82F6" trackBg={trackBg} textMuted={textMuted} />
        <SignalBar label="Hesitations" value={Math.min(kineticState.signals.hesitationCount * 20, 100)} color="#F59E0B" trackBg={trackBg} textMuted={textMuted} />
        <SignalBar label="Engagement" value={kineticState.emotionalState === "ENGAGED" ? 85 : kineticState.emotionalState === "BROWSING" ? 40 : 60} color="#10B981" trackBg={trackBg} textMuted={textMuted} />
      </div>

      {/* History strip */}
      {kineticState.history.length > 0 && (
        <div className={`mt-3 pt-3 border-t ${historyBorder}`}>
          <div className={`text-xs ${textMuted} mb-1`}>State History</div>
          <div className="flex gap-0.5">
            {kineticState.history.slice(-20).map((s, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-sm"
                style={{
                  backgroundColor: EMOTION_CONFIG[s]?.color || "#6B7280",
                  opacity: 0.4 + (i / 20) * 0.6,
                }}
                title={s}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SignalBar({
  label,
  value,
  color,
  trackBg,
  textMuted,
}: {
  label: string;
  value: number;
  color: string;
  trackBg: string;
  textMuted: string;
}) {
  return (
    <div>
      <div className={`flex justify-between text-xs ${textMuted} mb-0.5`}>
        <span>{label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className={`h-1.5 ${trackBg} rounded-full overflow-hidden`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
