"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar({ primary = "#FF5C28", darkMode = false }: { primary?: string; darkMode?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const bg = darkMode ? "bg-gray-950/80" : "bg-white/80";
  const border = darkMode ? "border-white/5" : "border-gray-100";
  const text = darkMode ? "text-white" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900";
  const mobileBg = darkMode ? "bg-gray-950" : "bg-white";
  const mobileBorder = darkMode ? "border-white/5" : "border-gray-100";

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 ${bg} backdrop-blur-xl border-b ${border}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primary }}
          >
            m
          </div>
          <span className={`font-bold text-lg ${text}`}>
            morph<span style={{ color: primary }}>.ai</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className={`text-sm ${textMuted} transition-colors`}>
            Features
          </a>
          <a href="#pricing" className={`text-sm ${textMuted} transition-colors`}>
            Pricing
          </a>
          <a href="/dashboard" className={`text-sm ${textMuted} transition-colors`}>
            Dashboard
          </a>
          <a
            href="/demo"
            className="px-5 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: primary }}
          >
            Try Demo
          </a>
        </div>

        <button
          className={`md:hidden ${darkMode ? "text-white" : "text-gray-900"}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className={`md:hidden border-t ${mobileBorder} ${mobileBg} px-6 py-4 space-y-3`}
        >
          <a href="#features" className={`block text-sm ${textMuted}`}>Features</a>
          <a href="#pricing" className={`block text-sm ${textMuted}`}>Pricing</a>
          <a href="/dashboard" className={`block text-sm ${textMuted}`}>Dashboard</a>
          <a
            href="/demo"
            className="block px-5 py-2 rounded-lg text-white text-sm font-medium text-center"
            style={{ backgroundColor: primary }}
          >
            Try Demo
          </a>
        </motion.div>
      )}
    </nav>
  );
}
