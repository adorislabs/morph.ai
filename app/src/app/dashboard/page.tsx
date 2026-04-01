"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  BarChart3,
  Brain,
  Bot,
  Zap,
  Eye,
  Activity,
  ArrowUpRight,
  Users,
  Clock,
  MousePointer,
  Send,
  Loader2,
  Check,
  Copy,
} from "lucide-react";

export default function DashboardPage() {
  const [agentResponse, setAgentResponse] = useState<string | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const testAgentHandshake = async () => {
    setAgentLoading(true);
    setAgentResponse(null);
    try {
      const res = await fetch("/api/agent-handshake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agent_id: "demo-shopping-bot-v1",
          agent_type: "shopping_assistant",
          capabilities: ["price_comparison", "feature_analysis", "negotiation"],
          query: {
            intent: "compare_pricing",
            parameters: {
              category: "web_personalization",
              budget: "500/month",
              requirements: "enterprise_compliance,api_access",
            },
          },
        }),
      });
      const data = await res.json();
      setAgentResponse(JSON.stringify(data, null, 2));
    } catch (e) {
      setAgentResponse(`Error: ${e instanceof Error ? e.message : "Unknown"}`);
    } finally {
      setAgentLoading(false);
    }
  };

  const copyResponse = () => {
    if (agentResponse) {
      navigator.clipboard.writeText(agentResponse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              morph.ai Dashboard
            </h1>
            <p className="text-gray-500">
              Monitor mutations, kinetic signals, and agent activity in
              real-time.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                label: "Mutations Served",
                value: "12,847",
                change: "+23%",
                color: "#FF5C28",
              },
              {
                icon: <Users className="w-5 h-5" />,
                label: "Unique Visitors",
                value: "4,291",
                change: "+18%",
                color: "#3B82F6",
              },
              {
                icon: <Clock className="w-5 h-5" />,
                label: "Avg. Latency",
                value: "142ms",
                change: "-12%",
                color: "#10B981",
              },
              {
                icon: <MousePointer className="w-5 h-5" />,
                label: "Bounce Rate",
                value: "28.4%",
                change: "-41%",
                color: "#8B5CF6",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${stat.color}10`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${stat.color}10`,
                      color: stat.color,
                    }}
                  >
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Mutations */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#FF5C28]" />
                  Recent Mutations
                </h2>
                <a
                  href="/demo"
                  className="text-xs text-[#FF5C28] font-medium flex items-center gap-1 hover:underline"
                >
                  Generate new <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
              <div className="space-y-3">
                {[
                  {
                    persona: "D2C Marketing Manager",
                    source: "instagram/social",
                    tone: "casual",
                    latency: "187ms",
                    time: "2 min ago",
                  },
                  {
                    persona: "Senior Developer",
                    source: "hackernews/referral",
                    tone: "technical",
                    latency: "134ms",
                    time: "5 min ago",
                  },
                  {
                    persona: "Enterprise Buyer (CISO)",
                    source: "linkedin/cpc",
                    tone: "professional",
                    latency: "156ms",
                    time: "12 min ago",
                  },
                  {
                    persona: "Price-Conscious Startup",
                    source: "google/cpc",
                    tone: "empathetic",
                    latency: "142ms",
                    time: "18 min ago",
                  },
                  {
                    persona: "AI Shopping Agent",
                    source: "agent/bot",
                    tone: "technical",
                    latency: "23ms",
                    time: "25 min ago",
                  },
                ].map((mutation, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF5C28]/10 text-[#FF5C28] flex items-center justify-center text-xs font-bold">
                      {mutation.persona[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {mutation.persona}
                      </div>
                      <div className="text-xs text-gray-500">
                        {mutation.source} · {mutation.tone}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-mono text-green-600">
                        {mutation.latency}
                      </div>
                      <div className="text-xs text-gray-400">
                        {mutation.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kinetic State Distribution */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-5">
                <Brain className="w-4 h-4 text-[#FF5C28]" />
                Kinetic State Distribution
              </h2>
              <div className="space-y-4">
                {[
                  { state: "Engaged", pct: 42, color: "#10B981" },
                  { state: "Neutral", pct: 28, color: "#6B7280" },
                  { state: "Browsing", pct: 14, color: "#3B82F6" },
                  { state: "Confused", pct: 9, color: "#EF4444" },
                  { state: "Skeptical", pct: 5, color: "#F59E0B" },
                  { state: "Urgent", pct: 2, color: "#8B5CF6" },
                ].map((item) => (
                  <div key={item.state}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">
                        {item.state}
                      </span>
                      <span className="text-gray-500">{item.pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100">
                <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Conversion by State
                </h3>
                <div className="space-y-2">
                  {[
                    { state: "Urgent", cvr: "8.2%" },
                    { state: "Engaged", cvr: "5.1%" },
                    { state: "Neutral", cvr: "3.4%" },
                    { state: "Browsing", cvr: "1.8%" },
                    { state: "Confused", cvr: "0.9%" },
                  ].map((item) => (
                    <div
                      key={item.state}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-gray-500">{item.state}</span>
                      <span className="font-mono text-gray-900 font-medium">
                        {item.cvr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cross-Agent Protocol Tester */}
          <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#FF5C28]" />
                Cross-Agent Protocol Tester
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 font-medium">
                Protocol v1 · Active
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Test the machine-to-machine handshake endpoint. This simulates an
              AI shopping agent querying morph.ai for pricing and features.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Request */}
              <div className="flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Request
                </div>
                <pre className="text-xs bg-gray-950 text-gray-300 p-4 rounded-lg overflow-x-auto">
                  {JSON.stringify(
                    {
                      agent_id: "demo-shopping-bot-v1",
                      agent_type: "shopping_assistant",
                      capabilities: [
                        "price_comparison",
                        "feature_analysis",
                        "negotiation",
                      ],
                      query: {
                        intent: "compare_pricing",
                        parameters: {
                          category: "web_personalization",
                          budget: "500/month",
                        },
                      },
                    },
                    null,
                    2
                  )}
                </pre>
                <button
                  onClick={testAgentHandshake}
                  disabled={agentLoading}
                  className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5C28] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {agentLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {agentLoading ? "Handshaking..." : "Send Handshake"}
                </button>
              </div>

              {/* Response */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Response
                  </div>
                  {agentResponse && (
                    <button
                      onClick={copyResponse}
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      {copied ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  )}
                </div>
                <pre className="text-xs bg-gray-950 text-green-400 p-4 rounded-lg overflow-x-auto min-h-[200px]">
                  {agentResponse || "// Response will appear here after handshake..."}
                </pre>
              </div>
            </div>

            {/* Discovery endpoint */}
            <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">
                  Discovery endpoint:
                </span>{" "}
                <code className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                  GET /api/agent-handshake
                </code>{" "}
                — Returns protocol capabilities and available endpoints for AI
                agent auto-discovery.
              </div>
            </div>
          </div>

          {/* God Mode info */}
          <div className="mt-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-5 h-5 text-[#FF5C28]" />
              <h2 className="font-bold">God Mode — Agent Transparency</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Every morph page includes a &quot;God Mode&quot; toggle that shows the
              AI&apos;s internal reasoning chain. See which signals were captured,
              how each agent contributed, and why the page looks the way it does.
            </p>
            <a
              href="/demo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5C28] text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Try It Now <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
