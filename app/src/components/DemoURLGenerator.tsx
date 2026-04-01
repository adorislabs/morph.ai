"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Link,
  Copy,
  Check,
  Megaphone,
  Code,
  ShoppingCart,
  Briefcase,
  Bot,
  Search,
  ExternalLink,
  AtSign,
  Share2,
} from "lucide-react";

const PRESETS = [
  {
    label: "Google Ads — Pricing",
    icon: <Megaphone className="w-4 h-4" />,
    params: "utm_source=google&utm_medium=cpc&utm_campaign=pricing&utm_term=web+personalization+pricing",
    description: "ROI-focused, data cards right, blue theme",
    color: "#2563EB",
    layout: "split-left",
  },
  {
    label: "HackerNews — Technical",
    icon: <Code className="w-4 h-4" />,
    params: "ref=news.ycombinator.com&utm_source=hackernews&utm_medium=referral",
    description: "Dark mode, terminal aesthetic, green accents",
    color: "#10B981",
    layout: "dark-hero",
  },
  {
    label: "Instagram — D2C Brand",
    icon: <ShoppingCart className="w-4 h-4" />,
    params: "utm_source=instagram&utm_medium=social&utm_campaign=d2c_brands&utm_content=carousel",
    description: "Bold gradient background, vibrant pink",
    color: "#EC4899",
    layout: "gradient-wave",
  },
  {
    label: "LinkedIn — Enterprise",
    icon: <Briefcase className="w-4 h-4" />,
    params: "utm_source=linkedin&utm_medium=cpc&utm_campaign=enterprise_demo&utm_content=ciso",
    description: "Premium asymmetric layout, indigo",
    color: "#6366F1",
    layout: "asymmetric",
  },
  {
    label: "AI Agent (Bot)",
    icon: <Bot className="w-4 h-4" />,
    params: "utm_source=agent&utm_medium=bot&agent_id=gpt-shopping-v2",
    description: "Full-screen dramatic, dark mode, amber",
    color: "#F59E0B",
    layout: "full-impact",
  },
  {
    label: "SEO — Organic Search",
    icon: <Search className="w-4 h-4" />,
    params: "utm_source=google&utm_medium=organic&q=best+landing+page+personalization+tool",
    description: "Clean minimal layout, empathetic orange",
    color: "#FF5C28",
    layout: "minimal",
  },
  {
    label: "Twitter / X — Product Hunt",
    icon: <AtSign className="w-4 h-4" />,
    params: "utm_source=twitter&utm_medium=social&utm_campaign=product_launch&utm_content=thread",
    description: "Witty centered hero, sky blue theme",
    color: "#0EA5E9",
    layout: "centered",
  },
  {
    label: "Facebook / Meta Ads",
    icon: <Share2 className="w-4 h-4" />,
    params: "utm_source=facebook&utm_medium=cpc&utm_campaign=retargeting&utm_content=video_ad",
    description: "Feature grid left, urgency banner, purple",
    color: "#7C3AED",
    layout: "split-right",
  },
];

export default function DemoURLGenerator() {
  const [copied, setCopied] = useState<string | null>(null);
  const [customParams, setCustomParams] = useState("");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

  const copyToClipboard = (params: string) => {
    const url = `${baseUrl}/morph?${params}`;
    navigator.clipboard.writeText(url);
    setCopied(params);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PRESETS.map((preset) => (
          <motion.a
            key={preset.label}
            href={`/morph?${preset.params}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-start gap-4 p-5 rounded-2xl border-2 hover:shadow-lg transition-all cursor-pointer bg-white"
            style={{ borderColor: `${preset.color}25` }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
              style={{ backgroundColor: preset.color }}
            >
              {preset.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                {preset.label}
                <ExternalLink className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {preset.description}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                  {preset.layout}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                copyToClipboard(preset.params);
              }}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors mt-0.5"
              title="Copy URL"
            >
              {copied === preset.params ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-300" />
              )}
            </button>
          </motion.a>
        ))}
      </div>

      {/* Custom URL builder */}
      <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
          <Link className="w-4 h-4" />
          Custom URL Builder
        </h3>
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-0 rounded-lg border border-gray-200 bg-white overflow-hidden">
            <span className="px-3 text-sm text-gray-400 flex-shrink-0 bg-gray-50 py-2.5 border-r border-gray-200">
              {baseUrl}/morph?
            </span>
            <input
              type="text"
              value={customParams}
              onChange={(e) => setCustomParams(e.target.value)}
              placeholder="utm_source=google&utm_medium=cpc"
              className="flex-1 px-3 py-2.5 text-sm text-gray-900 outline-none"
            />
          </div>
          <a
            href={customParams ? `/morph?${customParams}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => { if (!customParams) e.preventDefault(); }}
            className="px-6 py-2.5 rounded-lg bg-[#FF5C28] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
          >
            Morph <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
