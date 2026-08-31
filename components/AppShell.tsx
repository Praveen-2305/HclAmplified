"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TrailGuideDrawer } from "./TrailGuideDrawer";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTrailmark } from "@/context/TrailmarkContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { learningMode, setLearningMode, profile } = useTrailmark();

  // Determine page title for top bar
  const getPageHeader = () => {
    if (pathname === "/") return "Trailmark Portal & Pathway Map";
    if (pathname.includes("onboarding")) return "Conversational Onboarding";
    if (pathname.includes("recommendations")) return "Recommended Roles";
    if (pathname.includes("roadmap")) return "Personalized Learning Trail";
    if (pathname.includes("assessment/review")) return "Final Assessment Review";
    if (pathname.includes("assessment")) return "Adaptive Assessment";
    if (pathname.includes("dashboard")) return "Progress Dashboard";
    if (pathname.includes("study-groups")) return "Study Group Alpha Hub";
    if (pathname.includes("discussions")) return "Module Discussions";
    if (pathname.includes("leader-dashboard")) return "Leader Facilitator Dashboard";
    if (pathname.includes("ai-assistant")) return "Trail Guide AI Assistant";
    if (pathname.includes("community")) return "Community Discussion Feed";
    if (pathname.includes("rewards")) return "Scholar Rewards Shop";
    if (pathname.includes("leaderboard")) return "Community Leaderboard";
    if (pathname.includes("profile")) return "Scholar Profile & Achievements";
    if (pathname.includes("certification")) return "Academic Path Certification";
    return "Trailmark";
  };

  return (
    <div className="flex h-screen w-full bg-background text-on-background overflow-hidden font-sans">
      {/* Desktop Sidebar (Fixed Left 280px) */}
      <div className="hidden md:block h-full shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-[280px] h-full">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-14 bg-surface-container-lowest border-b border-outline-variant/60 px-4 sm:px-8 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              aria-label="Open navigation menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <div>
              <h2 className="font-serif text-[16px] sm:text-[18px] font-semibold text-on-surface tracking-tight">
                {getPageHeader()}
              </h2>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Global Persona Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-surface-container p-1 rounded-md border border-outline-variant/50 text-[12px]">
              <span className="text-[11px] font-semibold uppercase text-on-surface-variant px-1.5">
                Mode:
              </span>
              <button
                onClick={() => setLearningMode("digger")}
                className={`px-2 py-0.5 rounded text-[11.5px] font-semibold transition-all ${
                  learningMode === "digger"
                    ? "bg-secondary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Digger Mode: First-principles proofs, citations, and deep theory"
              >
                Digger
              </button>
              <button
                onClick={() => setLearningMode("surface")}
                className={`px-2 py-0.5 rounded text-[11.5px] font-semibold transition-all ${
                  learningMode === "surface"
                    ? "bg-secondary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
                title="Surface Mode: High-yield summaries, practical applications"
              >
                Surface
              </button>
            </div>

            {/* Streak & Points Pill */}
            <Link
              href="/rewards"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/60 hover:border-tertiary-accent transition-colors text-[12px]"
            >
              <div className="flex items-center gap-1 text-tertiary-fixed-variant font-semibold">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-variant">
                  stars
                </span>
                <span>{profile.totalPoints.toLocaleString()} pts</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Floating Trail Guide AI Assistant */}
      <TrailGuideDrawer />
    </div>
  );
}
