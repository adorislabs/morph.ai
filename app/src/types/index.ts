// ---- Signal Types ----
export interface VisitorSignals {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  searchQuery?: string;
  device?: "mobile" | "desktop" | "tablet";
  timestamp: number;
  userAgent?: string;
  isBot?: boolean;
}

// ---- Kinetic Intent Types ----
export type EmotionalState =
  | "NEUTRAL"
  | "CONFUSED"
  | "SKEPTICAL"
  | "URGENT"
  | "ENGAGED"
  | "BROWSING";

export interface KineticSignal {
  cursorVelocity: number;
  hesitationCount: number;
  scrollDepth: number;
  scrollVelocity: number;
  hoverDuration: number;
  rageclickCount: number;
  idleTime: number;
  backtrackCount: number;
  timestamp: number;
}

export interface KineticState {
  emotionalState: EmotionalState;
  confidence: number;
  signals: KineticSignal;
  history: EmotionalState[];
}

// ---- Mutation Blueprint Types ----
export interface MutationBlueprint {
  persona: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaColor: string;
  secondaryCtaText: string;
  heroLayout: "centered" | "split-left" | "split-right" | "dark-hero" | "minimal" | "gradient-wave" | "asymmetric" | "full-impact" | "magazine" | "terminal" | "bento" | "luxury";
  tone: "professional" | "casual" | "urgent" | "empathetic" | "technical";
  sectionOrder: string[];
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    heroBg: string;
  };
  features: FeatureCard[];
  stats: StatItem[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    metric: string;
  };
  urgencyBanner?: string;
  socialProof: string;
  reasoning: string[];
  kineticAdaptation?: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  priority: number;
}

export interface StatItem {
  value: string;
  label: string;
}

// ---- God Mode Types ----
export interface AgentThought {
  agent: "orchestrator" | "design" | "copy" | "guardrail" | "kinetic";
  thought: string;
  timestamp: number;
  action?: string;
}

// ---- Cross-Agent Protocol Types ----
export interface AgentHandshakeRequest {
  agent_id: string;
  agent_type: string;
  capabilities: string[];
  query: {
    intent: string;
    parameters: Record<string, string>;
  };
}

export interface AgentHandshakeResponse {
  protocol: "morph-agent-v1";
  status: "ok";
  data: {
    product: Record<string, unknown>;
    pricing: Record<string, unknown>;
    features: string[];
    negotiable: string[];
  };
  meta: {
    latency_ms: number;
    mutations_applied: number;
  };
}

// ---- Dashboard Types ----
export interface SessionData {
  id: string;
  visitorSignals: VisitorSignals;
  kineticState: KineticState;
  blueprint: MutationBlueprint | null;
  thoughts: AgentThought[];
  startTime: number;
  mutations: number;
}
