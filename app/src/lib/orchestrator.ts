import { GoogleGenerativeAI } from "@google/generative-ai";
import { VisitorSignals, MutationBlueprint, KineticState } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const DEFAULT_BLUEPRINT: MutationBlueprint = {
  persona: "General Visitor",
  headline: "Your Website, Evolved.",
  subheadline:
    "morph.ai turns every URL into a living agent that adapts to each visitor in real-time.",
  ctaText: "Start Free Trial",
  ctaColor: "#FF5C28",
  secondaryCtaText: "See How It Works",
  heroLayout: "centered",
  tone: "professional",
  sectionOrder: ["hero", "features", "social-proof", "pricing", "cta"],
  colorScheme: {
    primary: "#FF5C28",
    secondary: "#1a1a2e",
    accent: "#FF8C64",
    background: "#ffffff",
    heroBg: "#ffffff",
  },
  features: [
    {
      icon: "Zap",
      title: "Zero-Flicker Mutations",
      description:
        "Pages arrive pre-built for each visitor. No layout shifts, no flashing.",
      priority: 1,
    },
    {
      icon: "Brain",
      title: "Kinetic Intent Engine",
      description:
        "Reads cursor body language to understand emotional state in real-time.",
      priority: 2,
    },
    {
      icon: "Bot",
      title: "Cross-Agent Protocol",
      description:
        "AI agents negotiate content directly via JSON-RPC. Built for the machine web.",
      priority: 3,
    },
    {
      icon: "BarChart3",
      title: "Synthetic Simulator",
      description:
        "5,000 AI personas stress-test pages before real traffic arrives.",
      priority: 4,
    },
  ],
  stats: [
    { value: "<200ms", label: "Edge Latency" },
    { value: "40%", label: "Lower Bounce Rate" },
    { value: "2.5×", label: "ROAS Improvement" },
  ],
  testimonial: {
    quote:
      "morph.ai reduced our bounce rate by 41% in the first week. The pages feel like they were built for each visitor.",
    author: "Sarah Chen",
    role: "VP Marketing, TechCorp",
    metric: "41% lower bounce rate",
  },
  socialProof:
    "Trusted by 200+ brands to reduce bounce rates by 40% and increase ROAS by 2.5×",
  reasoning: ["Default blueprint — no visitor signals detected yet."],
};

export async function generateMutationBlueprint(
  signals: VisitorSignals,
  kineticState?: KineticState
): Promise<MutationBlueprint> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 1.0,
        responseMimeType: "application/json",
      },
    });

    const prompt = buildPrompt(signals, kineticState);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = JSON.parse(text) as Partial<MutationBlueprint>;

    return {
      ...DEFAULT_BLUEPRINT,
      ...parsed,
      features: parsed.features?.length
        ? parsed.features
        : DEFAULT_BLUEPRINT.features,
      stats: parsed.stats?.length ? parsed.stats : DEFAULT_BLUEPRINT.stats,
      testimonial: parsed.testimonial?.quote
        ? parsed.testimonial
        : DEFAULT_BLUEPRINT.testimonial,
      colorScheme: {
        ...DEFAULT_BLUEPRINT.colorScheme,
        ...(parsed.colorScheme || {}),
      },
      reasoning: parsed.reasoning || [
        "Generated via Gemini AI Orchestrator.",
      ],
    };
  } catch (error) {
    console.error("Gemini orchestrator error:", error);
    return {
      ...DEFAULT_BLUEPRINT,
      reasoning: [
        "Fallback: Gemini orchestrator failed, serving default blueprint.",
        `Error: ${error instanceof Error ? error.message : "Unknown"}`,
      ],
    };
  }
}

function buildPrompt(
  signals: VisitorSignals,
  kineticState?: KineticState
): string {
  return `You are the morph.ai Orchestrator. Your job: produce a UNIQUE website mutation blueprint for each visitor. The ENTIRE page changes — layout, colors, copy, section order, features shown, stats, testimonials — EVERYTHING must be tailored.

VISITOR SIGNALS:
- UTM Source: ${signals.utm_source || "direct"}
- UTM Medium: ${signals.utm_medium || "none"}
- UTM Campaign: ${signals.utm_campaign || "none"}
- UTM Content: ${signals.utm_content || "none"}
- UTM Term/Search Query: ${signals.utm_term || signals.searchQuery || "none"}
- Referrer: ${signals.referrer || "direct"}
- Device: ${signals.device || "desktop"}
- Is Bot: ${signals.isBot || false}
${kineticState ? `
KINETIC INTENT (real-time):
- Emotional State: ${kineticState.emotionalState} (confidence: ${kineticState.confidence})
- Cursor Velocity: ${kineticState.signals.cursorVelocity}px/s
- Hesitations: ${kineticState.signals.hesitationCount}
- Scroll Depth: ${kineticState.signals.scrollDepth}%
- Rage Clicks: ${kineticState.signals.rageclickCount}
` : ""}

CRITICAL RULES — each persona MUST look completely different:

GOOGLE ADS / PRICING visitor → heroLayout: "split-left", primary color: "#2563EB" (blue), tone: "professional", lead with ROI stats, pricing section first after hero, CTA: "Calculate Your ROI", stats about money saved / CAC reduction / revenue increase. Features focus on analytics and A/B testing.

HACKERNEWS / DEVELOPER visitor → heroLayout: "terminal", primary: "#10B981" (green), heroBg: "#0d1117", background: "#0d1117", secondary: "#e2e8f0", tone: "technical", show architecture details, CTA: "View API Docs", stats about latency/uptime/edge nodes. Features focus on Edge Wasm, SDK, API. No marketing fluff. Terminal aesthetic with monospace font.

INSTAGRAM / SOCIAL / D2C visitor → heroLayout: "gradient-wave", primary: "#EC4899" (pink), accent: "#F472B6", tone: "casual", energetic short copy, CTA: "Boost My Conversions", stats about conversion lifts / engagement. Gradient hero with vibrant feel. Features focus on personalization, audiences, creative testing.

LINKEDIN / ENTERPRISE visitor → heroLayout: "bento", primary: "#6366F1" (indigo), tone: "professional", emphasis on compliance/security/scale, CTA: "Book a Demo", stats about enterprise clients / uptime / compliance certs. Modern bento grid layout. Features focus on SOC2, GDPR, SSO, SLA.

AI AGENT / BOT visitor → heroLayout: "full-impact", primary: "#F59E0B" (amber), heroBg: "#0a0a0a", background: "#0a0a0a", secondary: "#fafaf9", tone: "technical", focus on M2M protocol, CTA: "Explore Protocol Docs", stats about API response time / endpoints. Full-screen impact. Features focus on JSON-RPC, negotiation, structured data.

ORGANIC SEARCH / SEO visitor → heroLayout: "luxury", primary: "#FF5C28" (orange), tone: "empathetic", address the search query directly in headline, CTA: "Try Free — No Credit Card", stats about ease-of-use / time-to-value. Ultra-refined serif layout. Features balanced across all capabilities.

TWITTER / X / PRODUCT HUNT visitor → heroLayout: "magazine", primary: "#0EA5E9" (sky blue), tone: "casual", editorial bold serif headline, witty and concise subhead, CTA: "See It In Action", stats about speed and social proof. Features focus on novelty and developer experience.

FACEBOOK / META ADS visitor → heroLayout: "split-right", primary: "#7C3AED" (purple), tone: "urgent", urgencyBanner for limited offer, CTA: "Claim Your Free Trial", stats about conversion and ad spend ROI. Features focus on audiences and creative optimization.

AVAILABLE HERO LAYOUTS (use variety — each one looks completely different!):
- "centered" — classic centered hero, broad audiences
- "split-left" — copy left, stats/visual right, ROI-focused
- "split-right" — feature grid left, copy right
- "dark-hero" — dark bg with grid/terminal glow, developers
- "minimal" — stripped-down, clean, empathetic
- "gradient-wave" — bold full-gradient, vibrant/social personas
- "asymmetric" — off-center with floating stats, enterprise
- "full-impact" — full-screen dark dramatic, M2M/bold statements
- "magazine" — editorial Georgia serif headline + metrics panel, Twitter/viral
- "terminal" — monospace CLI aesthetic dark bg, developer/hacker
- "bento" — headline + bento stats grid, modern SaaS/LinkedIn
- "luxury" — ultra-thin Palatino serif, refined whitespace, SEO/organic

Also vary these DRAMATICALLY per persona:
- sectionOrder: reorder sections based on what matters most (e.g. pricing-first for pricing visitors, features-first for technical)
- stats: 3 stats that are most compelling for THIS persona (different numbers and labels)
- testimonial: different person, role, company, and metric relevant to the persona
- features: 4 features most relevant to THIS visitor, with persona-specific descriptions
- socialProof: one line of social proof relevant to this persona's industry  
- secondaryCtaText: contextual secondary action text
- urgencyBanner: optional — a top-of-page urgency banner (only for urgent/promotional contexts)

Return valid JSON matching this exact schema:
{
  "persona": "string - specific persona description like 'Senior DevOps Engineer from Hacker News'",
  "headline": "string - punchy headline tailored to this persona (max 10 words)",
  "subheadline": "string - supporting text that speaks to their specific pain points",
  "ctaText": "string - action-oriented CTA",
  "ctaColor": "string - hex color matching the persona theme",
  "secondaryCtaText": "string - secondary action text",
  "heroLayout": "centered | split-left | split-right | dark-hero | minimal | gradient-wave | asymmetric | full-impact | magazine | terminal | bento | luxury",
  "tone": "professional | casual | urgent | empathetic | technical",
  "sectionOrder": ["hero", "features", "social-proof", "pricing", "cta"],
  "colorScheme": {
    "primary": "#hex",
    "secondary": "#hex",
    "accent": "#hex",
    "background": "#hex (white for light themes, dark for dark themes)",
    "heroBg": "#hex"
  },
  "features": [
    {"icon": "Zap|Brain|Bot|BarChart3|Shield|Globe|Sparkles|Target|Code|Lock|Gauge|Users", "title": "string", "description": "string", "priority": 1}
  ],
  "stats": [
    {"value": "string like '<200ms' or '41%'", "label": "string"}
  ],
  "testimonial": {
    "quote": "string - realistic testimonial from someone in this persona's world",
    "author": "string - name",
    "role": "string - title, Company",
    "metric": "string - key metric like '41% lower bounce rate'"
  },
  "urgencyBanner": "string or null - optional urgency banner for the top of the page",
  "socialProof": "string - credibility line for this persona's industry",
  "reasoning": ["step 1 explaining your analysis...", "step 2...", "step 3...", "step 4..."],
  "kineticAdaptation": "string or null"
}`;
}

export { DEFAULT_BLUEPRINT };
