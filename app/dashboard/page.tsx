"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTrailmark } from "@/context/TrailmarkContext";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const { profile, selectedRole, learningMode, roadmap } = useTrailmark();

  const completedCount = roadmap.filter((m) => m.status === "completed").length;
  const overallProgress = Math.round((completedCount / roadmap.length) * 100) || 34;
  const activeMilestone = roadmap.find((m) => m.status === "in_progress") || roadmap[1] || roadmap[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <span className="text-[11.5px] font-semibold text-secondary uppercase tracking-widest">
            Scholar Workspace
          </span>
          <h1 className="font-serif text-[28px] sm:text-[36px] font-bold text-primary tracking-tight">
            Welcome back, {profile.name}
          </h1>
          <p className="text-[14.5px] text-on-surface-variant mt-0.5">
            Path: <strong>{selectedRole?.title || profile.targetRole || "AI Engineer"}</strong> • {profile.scholarLevel}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/roadmap"
            className="px-4 py-2 bg-secondary text-white font-serif text-[13px] font-semibold rounded hover:bg-secondary/90 shadow-sm flex items-center gap-1.5"
          >
            <span>View Full Trail</span>
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
          </Link>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Progress Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card hover:border-secondary transition-all">
          <span className="text-[11.5px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
            Curriculum Progress
          </span>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-serif text-[38px] font-bold text-primary">
              {overallProgress}%
            </span>
            <span className="text-[12.5px] text-on-surface-variant">
              ({completedCount} of {roadmap.length} Milestones)
            </span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div
              className="bg-secondary h-full rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Scholar Points Card */}
        <Link
          href="/rewards"
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card hover:border-tertiary-fixed-dim transition-all group"
        >
          <span className="text-[11.5px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
            Scholar Points
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[38px] font-bold text-tertiary-fixed-variant group-hover:scale-105 transition-transform">
              {profile.totalPoints.toLocaleString()}
            </span>
            <span className="text-[13px] text-on-surface-variant font-medium">pts</span>
          </div>
          <p className="text-[11.5px] text-secondary font-medium mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">redeem</span>
            <span>View rewards & redeem</span>
          </p>
        </Link>

        {/* Current Streak Card */}
        <Link
          href="/leaderboard"
          className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card hover:border-secondary transition-all group"
        >
          <span className="text-[11.5px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">
            Current Study Streak
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[38px] font-bold text-secondary group-hover:scale-105 transition-transform flex items-center gap-1">
              <span className="material-symbols-outlined text-[32px] text-tertiary-fixed-variant">
                local_fire_department
              </span>
              {profile.streakDays}
            </span>
            <span className="text-[13px] text-on-surface-variant font-medium">Consecutive Days</span>
          </div>
          <p className="text-[11.5px] text-on-surface-variant mt-2">
            Global Rank: <strong>#4 in Cohort Alpha</strong>
          </p>
        </Link>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Learning Trail Snapshot */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/60 pb-4">
            <h2 className="font-serif text-[22px] font-bold text-primary">
              Your Learning Trail
            </h2>
            <span className="text-[12px] font-medium text-secondary bg-secondary/10 px-3 py-1 rounded-full">
              Milestone 2 Active
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8">
            {/* The Trail Spine Line */}
            <div className="absolute left-3 sm:left-4 top-3 bottom-4 w-[3px] bg-surface-container rounded-full">
              <div className="w-full bg-secondary rounded-full" style={{ height: "45%" }} />
            </div>

            {/* Completed Node */}
            <div className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-[12px] shrink-0 z-10">
                <span className="material-symbols-outlined text-[15px]">check</span>
              </div>
              <div className="bg-surface-container-low border border-outline-variant/70 rounded-lg p-4 flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                  Mastered • Oct 12
                </span>
                <h3 className="font-serif text-[16px] font-bold text-primary mt-0.5">
                  Mathematics for Machine Learning
                </h3>
                <p className="text-[12.5px] text-on-surface-variant mt-1">
                  Mastered linear algebra, partial derivatives, and probability manifolds.
                </p>
              </div>
            </div>

            {/* Active Node with Pulse */}
            <div className="flex gap-4 items-start">
              <div className="relative shrink-0 z-10 mt-1">
                <div className="w-6 h-6 rounded-full bg-secondary pulse-ring absolute inset-0" />
                <div className="w-6 h-6 rounded-full bg-secondary border-2 border-white flex items-center justify-center text-white text-[11px] font-bold">
                  2
                </div>
              </div>
              <div className="bg-surface-container-lowest border-2 border-secondary rounded-lg p-5 sm:p-6 flex-1 shadow-ambient relative overflow-hidden space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded text-[10.5px] font-semibold bg-secondary text-white uppercase tracking-wider">
                    Current Focus
                  </span>
                  <span className="text-[12px] text-on-surface-variant font-medium">
                    Module 1 of 4 In Progress
                  </span>
                </div>
                <h3 className="font-serif text-[18px] font-bold text-primary">
                  {activeMilestone.title}
                </h3>
                <p className="text-[13px] text-on-surface-variant leading-relaxed">
                  Focusing on activation dynamics (ReLU vs GELU), gradient flow mitigation, and loss optimization.
                </p>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => router.push("/assessment")}
                    className="px-5 py-2 bg-secondary text-white font-serif text-[13px] font-semibold rounded hover:bg-secondary/90 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Launch Adaptive Quiz</span>
                    <span className="material-symbols-outlined text-[16px]">quiz</span>
                  </button>
                  <button
                    onClick={() => router.push("/roadmap")}
                    className="px-4 py-2 border border-primary text-primary hover:bg-primary/5 text-[13px] font-semibold rounded transition-all"
                  >
                    View Syllabus Units
                  </button>
                </div>
              </div>
            </div>

            {/* Future Node */}
            <div className="flex gap-4 items-start opacity-60">
              <div className="w-6 h-6 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant flex items-center justify-center text-[11px] font-semibold shrink-0 z-10 mt-1">
                3
              </div>
              <div className="border border-dashed border-outline-variant rounded-lg p-4 flex-1">
                <h3 className="font-serif text-[15px] font-bold text-on-surface">
                  Sequence Models & Transformer Mechanics
                </h3>
                <p className="text-[12px] text-on-surface-variant mt-0.5">
                  Locked until current module completion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Persona Guide, Weekly Goal & Review Targets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Persona Guide Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-tertiary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">insights</span>
              <h3 className="font-serif text-[16px] font-bold text-primary">Persona Guide</h3>
            </div>
            <p className="text-[13px] text-on-surface leading-relaxed italic border-l-2 border-tertiary-fixed-dim pl-3 py-0.5">
              &quot;You&apos;re currently in <strong>{learningMode === "digger" ? "Digger Mode" : "Surface Mode"}</strong>. Your deep theoretical citations in backpropagation are pacing 15% ahead of cohort averages.&quot;
            </p>
            <div className="pt-2 text-[11.5px] text-on-surface-variant flex items-center justify-between">
              <span>Weekly Target: <strong>12 hrs</strong></span>
              <span className="font-semibold text-secondary">8.5 hrs logged</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: "70%" }} />
            </div>
          </div>

          {/* Review Targets */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-error">
              <span className="material-symbols-outlined text-[20px]">target</span>
              <h3 className="font-serif text-[16px] font-bold text-primary">Review Targets</h3>
            </div>
            <ul className="space-y-2.5 text-[12.5px]">
              <li className="flex items-center justify-between pb-2 border-b border-outline-variant/50">
                <span className="text-on-surface font-medium">Vanishing Gradient Proofs</span>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-secondary/15 text-secondary">
                  Mastered
                </span>
              </li>
              <li className="flex items-center justify-between pb-2 border-b border-outline-variant/50">
                <span className="text-on-surface font-medium">AdamW vs L2 Regularization</span>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-error-container/40 text-error">
                  Needs Review
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-on-surface font-medium">GPU SRAM Tiling</span>
                <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-surface-container text-on-surface-variant">
                  Upcoming
                </span>
              </li>
            </ul>
          </div>

          {/* Community & Study Pod Quick Widget */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-[16px] font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">groups</span>
                Study Pod Alpha
              </h3>
              <span className="text-[11px] text-secondary font-semibold">45 Members</span>
            </div>
            <p className="text-[12.5px] text-on-surface-variant leading-snug">
              Active discussion in <em>#loss-functions</em> with Dr. Sanjay Patel and Elena Rostova.
            </p>
            <Link
              href="/community"
              className="block w-full py-2 border border-primary text-primary hover:bg-primary/5 rounded font-serif text-[12.5px] font-semibold text-center transition-colors"
            >
              Open Community Feed
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
