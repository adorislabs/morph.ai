"use client";

import { KineticSignal, KineticState, EmotionalState } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_SIGNAL: KineticSignal = {
  cursorVelocity: 0,
  hesitationCount: 0,
  scrollDepth: 0,
  scrollVelocity: 0,
  hoverDuration: 0,
  rageclickCount: 0,
  idleTime: 0,
  backtrackCount: 0,
  timestamp: Date.now(),
};

function classifyEmotion(signal: KineticSignal): {
  state: EmotionalState;
  confidence: number;
} {
  const {
    cursorVelocity,
    hesitationCount,
    rageclickCount,
    scrollVelocity,
    idleTime,
    backtrackCount,
    scrollDepth,
  } = signal;

  // Rage clicks → CONFUSED
  if (rageclickCount >= 3) {
    return { state: "CONFUSED", confidence: 0.92 };
  }

  // High hesitation + backtracking → SKEPTICAL
  if (hesitationCount >= 4 && backtrackCount >= 2) {
    return { state: "SKEPTICAL", confidence: 0.85 };
  }

  // Very fast scroll, high velocity → URGENT
  if (scrollVelocity > 800 && cursorVelocity > 500) {
    return { state: "URGENT", confidence: 0.8 };
  }

  // Slow, deliberate navigation with good depth → ENGAGED
  if (
    scrollDepth > 50 &&
    cursorVelocity < 300 &&
    hesitationCount <= 2 &&
    idleTime < 5000
  ) {
    return { state: "ENGAGED", confidence: 0.78 };
  }

  // Moderate hesitation → CONFUSED
  if (hesitationCount >= 3 || backtrackCount >= 3) {
    return { state: "CONFUSED", confidence: 0.7 };
  }

  // Long idle → BROWSING
  if (idleTime > 8000) {
    return { state: "BROWSING", confidence: 0.65 };
  }

  // Default
  return { state: "NEUTRAL", confidence: 0.5 };
}

export function useKineticEngine(): KineticState {
  const [state, setState] = useState<KineticState>({
    emotionalState: "NEUTRAL",
    confidence: 0.5,
    signals: INITIAL_SIGNAL,
    history: [],
  });

  const signalRef = useRef<KineticSignal>({ ...INITIAL_SIGNAL });
  const lastPos = useRef({ x: 0, y: 0, t: Date.now() });
  const lastScroll = useRef({ y: 0, t: Date.now() });
  const clickTimes = useRef<number[]>([]);
  const lastActivityRef = useRef(Date.now());
  const scrollDirectionRef = useRef<"down" | "up">("down");
  const backtrackCountRef = useRef(0);
  const hesitationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hesitationCountRef = useRef(0);

  const updateClassification = useCallback(() => {
    const signal = { ...signalRef.current, timestamp: Date.now() };
    const { state: emotionalState, confidence } = classifyEmotion(signal);
    setState((prev) => ({
      emotionalState,
      confidence,
      signals: signal,
      history: [...prev.history.slice(-19), emotionalState],
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastPos.current.t;
      if (dt < 16) return; // throttle to ~60fps

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const velocity = dt > 0 ? (dist / dt) * 1000 : 0;

      signalRef.current.cursorVelocity =
        signalRef.current.cursorVelocity * 0.7 + velocity * 0.3;

      lastPos.current = { x: e.clientX, y: e.clientY, t: now };
      lastActivityRef.current = now;

      // Detect hesitation (cursor stops)
      if (hesitationTimerRef.current)
        clearTimeout(hesitationTimerRef.current);
      hesitationTimerRef.current = setTimeout(() => {
        hesitationCountRef.current++;
        signalRef.current.hesitationCount = hesitationCountRef.current;
      }, 800);
    };

    const handleScroll = () => {
      const now = Date.now();
      const scrollY = window.scrollY;
      const dt = now - lastScroll.current.t;
      const dy = scrollY - lastScroll.current.y;

      if (dt > 0) {
        signalRef.current.scrollVelocity = Math.abs((dy / dt) * 1000);
      }

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      signalRef.current.scrollDepth =
        maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

      // Detect backtracking
      const newDirection = dy >= 0 ? "down" : "up";
      if (
        newDirection !== scrollDirectionRef.current &&
        scrollDirectionRef.current === "down"
      ) {
        backtrackCountRef.current++;
        signalRef.current.backtrackCount = backtrackCountRef.current;
      }
      scrollDirectionRef.current = newDirection;

      lastScroll.current = { y: scrollY, t: now };
      lastActivityRef.current = now;
    };

    const handleClick = () => {
      const now = Date.now();
      clickTimes.current.push(now);
      // Keep only clicks from last 2 seconds
      clickTimes.current = clickTimes.current.filter(
        (t) => now - t < 2000
      );
      // 3+ clicks in 2s = rage click
      if (clickTimes.current.length >= 3) {
        signalRef.current.rageclickCount++;
      }
      lastActivityRef.current = now;
    };

    // Idle time tracker
    const idleInterval = setInterval(() => {
      signalRef.current.idleTime = Date.now() - lastActivityRef.current;
    }, 500);

    // Classification interval
    const classifyInterval = setInterval(updateClassification, 1000);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClick);
      clearInterval(idleInterval);
      clearInterval(classifyInterval);
      if (hesitationTimerRef.current) clearTimeout(hesitationTimerRef.current);
    };
  }, [updateClassification]);

  return state;
}
