"use client";

import React from "react";
import Link from "next/link";

export default function LeaderDashboardPage() {
  const scholars = [
    { name: "Elena Rostova", mastery: "94%", velocity: "3.1 / wk", status: "Excelling", alert: "Praise eligible" },
    { name: "Eleanor Vance", mastery: "92%", velocity: "2.8 / wk", status: "On Track", alert: "Milestone 2 Active" },
    { name: "Marcus Aurelius", mastery: "82%", velocity: "2.2 / wk", status: "On Track", alert: "Review Target: LoRA" },
    { name: "Julian Thorne", mastery: "76%", velocity: "1.9 / wk", status: "Pacing", alert: "Stalled on Module 3" },
    { name: "David Kim", mastery: "68%", velocity: "1.2 / wk", status: "Needs Support", alert: "Prerequisite support needed" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-widest mb-1">
            <Link href="/study-groups" className="hover:underline">Study Group</Link>
            <span>/</span>
            <span>Facilitator Portal</span>
          </div>
          <h1 className="font-serif text-[28px] sm:text-[36px] font-bold text-primary">
            Cohort Alpha Leader Dashboard
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            Deep Learning Fundamentals • 24 Enrolled Scholars
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-lg text-[12.5px]">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <span className="font-semibold text-primary">Active Cohort Sync Session</span>
        </div>
      </div>

      {/* Cohort Analytics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-2">
          <span className="text-[11.5px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Average Cohort Mastery
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-bold text-primary">84%</span>
            <span className="text-[12px] text-secondary font-semibold">+4% vs last week</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
            <div className="bg-secondary h-full rounded-full" style={{ width: "84%" }} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-2">
          <span className="text-[11.5px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Peer Review Velocity
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-bold text-primary">2.4</span>
            <span className="text-[13px] text-on-surface-variant">reviews / scholar / wk</span>
          </div>
          <p className="text-[11.5px] text-secondary font-medium">
            ↑ 12% faster than Cohort Beta
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-2">
          <span className="text-[11.5px] font-semibold uppercase tracking-wider text-on-surface-variant">
            Engagement Level
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-[36px] font-bold text-secondary">High</span>
          </div>
          <p className="text-[11.5px] text-on-surface-variant">
            Active in backpropagation proofs & loss functions.
          </p>
        </div>
      </div>

      {/* AI Priority Alerts */}
      <div className="p-4 bg-tertiary-fixed/20 border border-tertiary-fixed-dim rounded-xl flex items-center justify-between gap-4 text-[13px]">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-tertiary-fixed-variant text-[22px]">
            lightbulb
          </span>
          <div>
            <span className="font-bold text-primary">AI Priority Facilitator Alert: </span>
            <span className="text-on-surface">
              Elena Rostova & Eleanor Vance are pacing in the 90th percentile. Consider assigning them peer mentors for Module 4.
            </span>
          </div>
        </div>
        <button className="px-3.5 py-1.5 bg-secondary text-white rounded text-[12px] font-semibold hover:bg-secondary/90 shrink-0">
          Send Praise
        </button>
      </div>

      {/* Scholar Roster Table */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/60 bg-surface-container-low flex items-center justify-between">
          <h3 className="font-serif text-[16px] font-bold text-primary">Scholar Roster & Interventions</h3>
          <span className="text-[12px] text-on-surface-variant">5 of 24 Scholars Displayed</span>
        </div>

        <div className="divide-y divide-outline-variant/40 text-[13px]">
          {scholars.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-surface-container/30 transition-colors">
              <div>
                <span className="font-serif font-bold text-[14.5px] text-primary block">{s.name}</span>
                <span className="text-[11.5px] text-on-surface-variant">{s.alert}</span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-on-surface font-mono font-bold">{s.mastery} Mastery</span>
                <span className="text-on-surface-variant font-mono hidden sm:inline">{s.velocity}</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                    s.status === "Excelling"
                      ? "bg-secondary/15 text-secondary"
                      : s.status === "On Track"
                      ? "bg-surface-container text-primary"
                      : "bg-error-container/30 text-error"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
