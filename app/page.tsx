"use client";

import React from "react";
import Link from "next/link";
import { useTrailmark } from "@/context/TrailmarkContext";

export default function RootPortalPage() {
  const { profile, selectedRole, learningMode } = useTrailmark();

  const journeySteps = [
    {
      step: "01",
      title: "Pedagogical Intake",
      desc: "Socratic AI Guide chat to discover goals, timeline, and calibrate Digger vs Surface learning personas.",
      href: "/onboarding",
      icon: "psychology",
      badge: "Discovery",
      color: "border-secondary",
    },
    {
      step: "02",
      title: "Role Trajectories",
      desc: "Calculated skill synergy overlaps and salary benchmarks for target AI & engineering specializations.",
      href: "/recommendations",
      icon: "hub",
      badge: "Targeting",
      color: "border-outline-variant",
    },
    {
      step: "03",
      title: "Personalized Learning Trail",
      desc: "Connected 4px vertical syllabus spine with Digger/Surface mode switching and cohort pod approval.",
      href: "/roadmap",
      icon: "alt_route",
      badge: "Active",
      color: "border-secondary",
    },
    {
      step: "04",
      title: "Adaptive Assessment",
      desc: "Dynamic difficulty questions with live feedback loops and citations from academic literature.",
      href: "/assessment",
      icon: "quiz",
      badge: "Evaluation",
      color: "border-outline-variant",
    },
    {
      step: "05",
      title: "Progress Dashboard",
      desc: "Comprehensive progress rings, scholar points, consecutive study streaks, and daily target pacing.",
      href: "/dashboard",
      icon: "space_dashboard",
      badge: "Tracking",
      color: "border-outline-variant",
    },
    {
      step: "06",
      title: "Community Discussions",
      desc: "Peer derivations, code debugging snippets, verified answers, and Study Pod Alpha collaboration.",
      href: "/community",
      icon: "forum",
      badge: "Network",
      color: "border-outline-variant",
    },
    {
      step: "07",
      title: "Study Group Hub",
      desc: "Cohort workspace with 45 active scholars, weekly syllabus syncs, and shared academic resources.",
      href: "/study-groups",
      icon: "groups",
      badge: "Cohort",
      color: "border-outline-variant",
    },
    {
      step: "08",
      title: "Leader Dashboard",
      desc: "Cohort facilitator metrics, 84% average mastery tracking, and scholar intervention alerts.",
      href: "/leader-dashboard",
      icon: "monitoring",
      badge: "Faculty",
      color: "border-outline-variant",
    },
    {
      step: "09",
      title: "Trail Guide AI Assistant",
      desc: "Dedicated scholarly tutor for first-principles derivations, LaTeX explanations, and paper lookups.",
      href: "/ai-assistant",
      icon: "smart_toy",
      badge: "AI Sidekick",
      color: "border-secondary",
    },
    {
      step: "10",
      title: "Rewards & Leaderboard",
      desc: "Point redemption store for academic privileges, research spotlights, and pod leaderboard rankings.",
      href: "/rewards",
      icon: "redeem",
      badge: "Gamification",
      color: "border-tertiary-fixed-dim",
    },
    {
      step: "11",
      title: "Scholar Profile",
      desc: "Verified competency matrix, academic level certifications, and scholar portfolio.",
      href: "/profile",
      icon: "school",
      badge: "Portfolio",
      color: "border-outline-variant",
    },
    {
      step: "12",
      title: "Certificate of Mastery",
      desc: "Official institutional diploma with cotton archival border, wax seal, and cryptographic hash.",
      href: "/certification",
      icon: "verified",
      badge: "Distinction",
      color: "border-secondary",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-2">
      {/* Welcome Hero Banner */}
      <header className="bg-surface-container-lowest border-2 border-primary-container rounded-xl p-8 sm:p-10 shadow-ambient relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-widest">
            <span className="material-symbols-outlined text-[18px]">route</span>
            <span>Ink & Canvas • Modern Academic Learning Platform</span>
          </div>

          <h1 className="font-serif text-[34px] sm:text-[46px] font-bold text-primary tracking-tight leading-tight">
            Trailmark Learning Ecosystem
          </h1>

          <p className="text-[15.5px] text-on-surface-variant leading-relaxed">
            Welcome, <strong>{profile.name}</strong> ({profile.scholarLevel}). You are currently pursuing the{" "}
            <strong>{selectedRole?.title || profile.targetRole || "AI Engineer"}</strong> trail in{" "}
            <strong className="capitalize">{learningMode} Mode</strong>. Explore the full curriculum pathway below or jump into your active milestone.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-secondary text-white font-serif text-[14px] font-semibold rounded hover:bg-secondary/90 shadow-sm flex items-center gap-2"
            >
              <span>Open Progress Dashboard</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>

            <Link
              href="/roadmap"
              className="px-5 py-3 border border-primary text-primary hover:bg-primary/5 rounded font-serif text-[14px] font-semibold transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">alt_route</span>
              <span>Continue Learning Trail</span>
            </Link>

            <Link
              href="/onboarding"
              className="px-5 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-serif text-[14px] font-semibold transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">psychology</span>
              <span>Restart Intake Flow</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Complete Application Flow Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3">
          <div>
            <h2 className="font-serif text-[22px] font-bold text-primary">
              All Application Screens & Pathways
            </h2>
            <p className="text-[13px] text-on-surface-variant">
              Every screen built directly from the Google Stitch design system
            </p>
          </div>
          <span className="text-[12px] font-semibold text-secondary">12 Interactive Routes</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {journeySteps.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`bg-surface-container-lowest border rounded-xl p-5 shadow-card hover:shadow-ambient hover:border-secondary transition-all flex flex-col justify-between group ${item.color}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    {item.badge}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-[12px] font-bold text-secondary font-mono">
                      {item.step}
                    </span>
                    <h3 className="font-serif text-[16.5px] font-bold text-primary group-hover:text-secondary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[12.5px] text-on-surface-variant leading-relaxed mt-1 font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/40 mt-4 flex items-center justify-between text-[12px] text-secondary font-semibold">
                <span>Launch Screen</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
