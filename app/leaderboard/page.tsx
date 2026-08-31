"use client";

import React, { useState } from "react";
import { useTrailmark } from "@/context/TrailmarkContext";

export default function LeaderboardPage() {
  const { leaderboard } = useTrailmark();
  const [scopeTab, setScopeTab] = useState<"Global" | "Pod">("Global");
  const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("week");
  const [domainFilter, setDomainFilter] = useState("All");

  const topThree = leaderboard.slice(0, 3);
  const remainingScholars = leaderboard.slice(3);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <header className="space-y-2 border-b border-outline-variant pb-6">
        <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
          Academic Merit & Collaboration
        </span>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-primary tracking-tight">
          Community Leaderboard
        </h1>
        <p className="text-[15px] text-on-surface-variant max-w-2xl leading-relaxed">
          Celebrating academic rigor, peer problem-solving contributions, and mastery progression across research pods.
        </p>
      </header>

      {/* Filter and Timeframe Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-3">
        {/* Scope Tabs */}
        <div className="flex items-center gap-6 text-[13.5px] font-semibold">
          <button
            onClick={() => setScopeTab("Global")}
            className={`pb-2.5 transition-colors relative ${
              scopeTab === "Global"
                ? "text-primary border-b-2 border-secondary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Global Scholars
          </button>
          <button
            onClick={() => setScopeTab("Pod")}
            className={`pb-2.5 transition-colors relative ${
              scopeTab === "Pod"
                ? "text-primary border-b-2 border-secondary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Study Pod Alpha
          </button>
        </div>

        {/* Timeframe & Domain Pill Selectors */}
        <div className="flex items-center gap-2 text-[12px]">
          <div className="flex bg-surface-container rounded p-0.5 border border-outline-variant/50">
            {(["week", "month", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded capitalize font-semibold transition-all ${
                  timeframe === t
                    ? "bg-secondary text-white shadow-xs"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t === "week" ? "This Week" : t === "month" ? "This Month" : "All Time"}
              </button>
            ))}
          </div>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="bg-surface-container border border-outline-variant rounded px-2.5 py-1 text-on-surface text-[12px] font-medium outline-none"
          >
            <option value="All">All Domains</option>
            <option value="AI Engineering">AI Engineering</option>
            <option value="Neural Architectures">Neural Architectures</option>
          </select>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* 2nd Place */}
        {topThree[1] && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card flex flex-col items-center text-center relative order-2 md:order-1">
            <div className="w-8 h-8 rounded-full bg-surface-dim text-primary flex items-center justify-center font-serif text-[14px] font-bold absolute -top-4 shadow-sm border border-outline-variant">
              2
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={topThree[1].avatar}
              alt={topThree[1].name}
              className="w-16 h-16 rounded-full object-cover border-2 border-surface-dim shadow-xs mt-2 mb-3"
            />
            <h3 className="font-serif text-[17px] font-bold text-primary">{topThree[1].name}</h3>
            <span className="text-[12px] text-on-surface-variant font-medium">{topThree[1].domain}</span>
            <div className="mt-3 px-3 py-1 bg-surface-container rounded-full text-[12.5px] font-bold text-primary">
              {topThree[1].points.toLocaleString()} pts
            </div>
            <span className="text-[11px] text-secondary mt-1.5 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              {topThree[1].streakDays}d Streak
            </span>
          </div>
        )}

        {/* 1st Place (Hero in Center) */}
        {topThree[0] && (
          <div className="bg-surface-container-lowest border-2 border-tertiary-fixed-dim rounded-xl p-7 shadow-ambient flex flex-col items-center text-center relative order-1 md:order-2">
            <div className="w-9 h-9 rounded-full bg-tertiary-fixed-dim text-primary flex items-center justify-center font-serif text-[15px] font-bold absolute -top-4.5 shadow-md border-2 border-white">
              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-variant">
                crown
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={topThree[0].avatar}
              alt={topThree[0].name}
              className="w-20 h-20 rounded-full object-cover border-3 border-tertiary-fixed-dim shadow-sm mt-2 mb-3"
            />
            <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-tertiary-fixed/30 text-tertiary-fixed-variant mb-1">
              {topThree[0].badge}
            </span>
            <h3 className="font-serif text-[19px] font-bold text-primary">{topThree[0].name}</h3>
            <span className="text-[12.5px] text-on-surface-variant font-medium">{topThree[0].domain}</span>
            <div className="mt-3 px-4 py-1 bg-tertiary-fixed/30 text-tertiary-fixed-variant border border-tertiary-fixed-dim rounded-full text-[14px] font-serif font-bold">
              {topThree[0].points.toLocaleString()} pts
            </div>
            <span className="text-[11.5px] text-secondary mt-2 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[15px]">local_fire_department</span>
              {topThree[0].streakDays} Day Study Streak
            </span>
          </div>
        )}

        {/* 3rd Place */}
        {topThree[2] && (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card flex flex-col items-center text-center relative order-3">
            <div className="w-8 h-8 rounded-full bg-surface-dim text-primary flex items-center justify-center font-serif text-[14px] font-bold absolute -top-4 shadow-sm border border-outline-variant">
              3
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={topThree[2].avatar}
              alt={topThree[2].name}
              className="w-16 h-16 rounded-full object-cover border-2 border-surface-dim shadow-xs mt-2 mb-3"
            />
            <h3 className="font-serif text-[17px] font-bold text-primary">{topThree[2].name}</h3>
            <span className="text-[12px] text-on-surface-variant font-medium">{topThree[2].domain}</span>
            <div className="mt-3 px-3 py-1 bg-surface-container rounded-full text-[12.5px] font-bold text-primary">
              {topThree[2].points.toLocaleString()} pts
            </div>
            <span className="text-[11px] text-secondary mt-1.5 flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
              {topThree[2].streakDays}d Streak
            </span>
          </div>
        )}
      </div>

      {/* Complete Rankings Table */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/60 bg-surface-container-low flex items-center justify-between">
          <h3 className="font-serif text-[16px] font-bold text-primary">
            Full Cohort Leaderboard Rankings
          </h3>
          <span className="text-[12px] text-on-surface-variant font-medium">
            Updated Hourly
          </span>
        </div>

        <div className="divide-y divide-outline-variant/40">
          {leaderboard.map((entry) => {
            const isMe = entry.isCurrentUser;
            return (
              <div
                key={entry.rank}
                className={`flex items-center justify-between px-6 py-4 transition-colors ${
                  isMe
                    ? "bg-secondary-container/15 border-l-4 border-secondary font-medium"
                    : "hover:bg-surface-container/30"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-serif text-[16px] font-bold text-on-surface-variant w-6 text-center">
                    {entry.rank}
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.avatar}
                    alt={entry.name}
                    className="w-10 h-10 rounded-full object-cover border border-outline-variant/60"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[15px] font-bold text-primary">
                        {entry.name}
                      </span>
                      {isMe && (
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-secondary text-white">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-on-surface-variant">
                      {entry.domain} • {entry.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-[12px] text-secondary font-semibold hidden sm:flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">
                      local_fire_department
                    </span>
                    {entry.streakDays}d
                  </span>
                  <span className="font-serif text-[15px] font-bold text-primary w-24 text-right">
                    {entry.points.toLocaleString()} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
