import { VisitorSignals } from "@/types";

export function extractSignals(
  searchParams: Record<string, string | string[] | undefined>,
  headers: { referer?: string; userAgent?: string }
): VisitorSignals {
  const ua = headers.userAgent || "";
  const isBot =
    /bot|crawl|spider|agent|gpt|claude|perplexity|gemini/i.test(ua);

  let device: "mobile" | "desktop" | "tablet" = "desktop";
  if (/mobile|android|iphone/i.test(ua)) device = "mobile";
  else if (/ipad|tablet/i.test(ua)) device = "tablet";

  return {
    utm_source: asString(searchParams.utm_source),
    utm_medium: asString(searchParams.utm_medium),
    utm_campaign: asString(searchParams.utm_campaign),
    utm_content: asString(searchParams.utm_content),
    utm_term: asString(searchParams.utm_term),
    referrer: headers.referer || asString(searchParams.ref),
    searchQuery: asString(searchParams.q) || asString(searchParams.utm_term),
    device,
    timestamp: Date.now(),
    userAgent: ua,
    isBot,
  };
}

function asString(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function describeSignals(signals: VisitorSignals): string {
  const parts: string[] = [];
  if (signals.utm_source) parts.push(`Source: ${signals.utm_source}`);
  if (signals.utm_medium) parts.push(`Medium: ${signals.utm_medium}`);
  if (signals.utm_campaign) parts.push(`Campaign: ${signals.utm_campaign}`);
  if (signals.referrer) parts.push(`Referrer: ${signals.referrer}`);
  if (signals.searchQuery) parts.push(`Search: "${signals.searchQuery}"`);
  if (signals.device) parts.push(`Device: ${signals.device}`);
  if (signals.isBot) parts.push(`🤖 Bot detected`);
  if (parts.length === 0) parts.push("Direct visit — no signals");
  return parts.join(" · ");
}
