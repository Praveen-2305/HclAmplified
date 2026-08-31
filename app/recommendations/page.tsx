"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrailmark } from "@/context/TrailmarkContext";
import { RoleMatch } from "@/types/trailmark";

export default function RoleRecommendationsPage() {
  const router = useRouter();
  const { roles, selectRole, selectedRole, profile } = useTrailmark();
  const [selectedId, setSelectedId] = useState<string>(selectedRole?.id || "ai-engineer");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChooseRole = async (role: RoleMatch) => {
    setSelectedId(role.id);
    setIsGenerating(true);
    selectRole(role.id);

    setTimeout(() => {
      setIsGenerating(false);
      router.push("/roadmap");
    }, 600);
  };

  const topMatch = roles[0];
  const secondaryMatches = roles.slice(1);

  const additionalRoles = [
    {
      id: "nlp-specialist",
      title: "NLP Specialist",
      match: "74%",
      salary: "$155k - $190k",
      icon: "psychology",
      desc: "Combines computational linguistics with deep transformer sequence modeling.",
    },
    {
      id: "analytics-engineer",
      title: "Analytics Engineer",
      match: "68%",
      salary: "$135k - $165k",
      icon: "insights",
      desc: "Bridges the gap between raw data pipelines, dbt modeling, and high-performance warehousing.",
    },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <header className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">hub</span>
          <span>Calibrated Career Trajectories</span>
        </div>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-primary tracking-tight leading-tight">
          Your Recommended Roles
        </h1>
        <p className="text-[16px] text-on-surface-variant leading-relaxed">
          Based on your {profile.targetTimelineMonths}-month goal and {profile.persona === "digger" ? "Digger" : "Surface"} learning persona, we have mapped paths where your statistical foundation intersects with market demand. Select a target role to generate your custom learning trail.
        </p>
      </header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Match Hero Card (8 Cols) */}
        {topMatch && (
          <article
            className={`col-span-1 lg:col-span-8 bg-surface-container-lowest border rounded-xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden transition-all duration-300 shadow-card ${
              selectedId === topMatch.id ? "border-2 border-secondary" : "border-outline-variant hover:border-secondary"
            }`}
          >
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-tertiary-fixed-dim/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="flex-1 z-10 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="bg-secondary/15 text-secondary font-label-md text-[11.5px] px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    Top Match
                  </span>
                  <span className="font-serif text-[22px] font-bold text-primary">
                    {topMatch.matchPercentage}% Match
                  </span>
                  <span className="text-[13px] text-on-surface-variant font-medium">
                    • {topMatch.salaryRange}
                  </span>
                </div>

                <h2 className="font-serif text-[26px] sm:text-[30px] font-bold text-primary mb-3">
                  {topMatch.title}
                </h2>
                <p className="text-[14px] text-on-surface-variant leading-relaxed mb-6">
                  {topMatch.summary}
                </p>

                {/* Skill Overlap Breakdown */}
                <div className="space-y-2.5 mb-8">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block">
                    Curriculum Alignment Rationale
                  </span>
                  {topMatch.skills.map((skill, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2">
                        <span
                          className={`material-symbols-outlined text-[18px] ${
                            skill.status === "strong" ? "text-secondary" : "text-tertiary-fixed-variant"
                          }`}
                        >
                          {skill.status === "strong" ? "check_circle" : "radio_button_unchecked"}
                        </span>
                        <span className="text-on-surface font-medium">{skill.name}</span>
                      </div>
                      <span
                        className={`text-[12px] font-semibold ${
                          skill.status === "strong" ? "text-secondary" : "text-on-surface-variant"
                        }`}
                      >
                        {skill.matchScore}% Synergy
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleChooseRole(topMatch)}
                disabled={isGenerating}
                className="w-full sm:w-fit px-8 py-3 bg-secondary text-white rounded font-serif text-[14.5px] font-semibold hover:bg-secondary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isGenerating && selectedId === topMatch.id ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      progress_activity
                    </span>
                    <span>Synthesizing Learning Trail...</span>
                  </>
                ) : (
                  <>
                    <span>Select Target Role</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>

            {/* Visual Node Diagram */}
            <div className="w-full md:w-2/5 bg-surface-container-low rounded-lg border border-outline-variant/60 p-5 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                  Trail Architecture
                </span>
                <p className="font-serif text-[14px] font-semibold text-primary">
                  {topMatch.milestonesCount} Milestones • {topMatch.estTimeToMastery}
                </p>
              </div>

              {/* Simulated Academic Blueprint Nodes */}
              <div className="space-y-3 my-4">
                <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/80 flex items-center gap-2 text-[12px]">
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="font-medium text-on-surface">1. Mathematics for ML</span>
                </div>
                <div className="p-2.5 rounded bg-secondary-fixed/30 border border-secondary-fixed flex items-center gap-2 text-[12px]">
                  <span className="w-2 h-2 rounded-full bg-secondary pulse-ring" />
                  <span className="font-semibold text-secondary">2. Deep Learning & Tensors</span>
                </div>
                <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-2 text-[12px] opacity-70">
                  <span className="w-2 h-2 rounded-full bg-outline-variant" />
                  <span className="font-medium text-on-surface">3. Sequence & Transformers</span>
                </div>
                <div className="p-2.5 rounded bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-2 text-[12px] opacity-70">
                  <span className="w-2 h-2 rounded-full bg-outline-variant" />
                  <span className="font-medium text-on-surface">4. Production Serving</span>
                </div>
              </div>

              <div className="text-[11px] text-on-surface-variant italic">
                Calibrated for {profile.persona === "digger" ? "Digger Mode" : "Surface Mode"}
              </div>
            </div>
          </article>
        )}

        {/* Secondary Matches Column (4 Cols) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          {secondaryMatches.map((role) => (
            <article
              key={role.id}
              className={`bg-surface-container-lowest border rounded-xl p-6 flex flex-col justify-between transition-all duration-300 shadow-card ${
                selectedId === role.id ? "border-2 border-secondary" : "border-outline-variant hover:border-secondary"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-[19px] font-bold text-primary">{role.title}</h3>
                  <span className="text-[12px] font-semibold text-tertiary-fixed-variant bg-tertiary-fixed/30 px-2.5 py-0.5 rounded">
                    {role.matchPercentage}% Match
                  </span>
                </div>
                <p className="text-[11.5px] text-secondary font-semibold mb-2">
                  {role.salaryRange} • {role.estTimeToMastery}
                </p>
                <p className="text-[13px] text-on-surface-variant leading-relaxed mb-6">
                  {role.summary}
                </p>
              </div>

              <button
                onClick={() => handleChooseRole(role)}
                className="w-full border border-primary text-primary hover:bg-primary/5 active:scale-[0.98] font-serif text-[13px] font-semibold py-2.5 px-4 rounded transition-colors"
              >
                Select Role
              </button>
            </article>
          ))}
        </div>

        {/* Additional Specialized Roles Row */}
        {additionalRoles.map((role) => (
          <article
            key={role.id}
            className="col-span-1 lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col sm:flex-row items-center gap-5 transition-all duration-300 hover:border-secondary shadow-card"
          >
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/60">
              <span className="material-symbols-outlined text-primary text-[28px]">{role.icon}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1">
                <h3 className="font-serif text-[18px] font-bold text-primary">{role.title}</h3>
                <span className="text-[12px] font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  {role.match}
                </span>
              </div>
              <p className="text-[12.5px] text-on-surface-variant leading-snug mb-2">{role.desc}</p>
              <span className="text-[11.5px] font-semibold text-secondary">{role.salary}</span>
            </div>
            <button
              onClick={() => {
                selectRole("ai-engineer");
                router.push("/roadmap");
              }}
              className="w-full sm:w-auto border border-primary text-primary hover:bg-primary/5 text-[12.5px] font-semibold py-2 px-5 rounded transition-colors whitespace-nowrap"
            >
              Select
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
