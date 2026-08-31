"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrailmark } from "@/context/TrailmarkContext";
import Link from "next/link";

export default function RoadmapPage() {
  const router = useRouter();
  const {
    roadmap,
    selectedRole,
    learningMode,
    setLearningMode,
    isRoadmapApproved,
    approveRoadmap,
    toggleModuleCompletion,
  } = useTrailmark();

  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string>("ms-02");
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const targetRoleTitle = selectedRole?.title || "AI Engineer";

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant pb-8">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-widest mb-1.5">
            <span className="material-symbols-outlined text-[16px]">alt_route</span>
            <span>Personalized Pathway</span>
          </div>
          <h1 className="font-serif text-[32px] sm:text-[42px] font-bold text-primary tracking-tight">
            Target: {targetRoleTitle}
          </h1>
          <p className="text-[15px] text-on-surface-variant max-w-2xl mt-1 leading-relaxed">
            A curated curriculum focusing on deep neural network architectures and production deployment, calibrated for your statistical foundation and 18-month roadmap.
          </p>
        </div>

        {/* Digger / Surface Mode Pill Toggle */}
        <div className="flex bg-surface-container border border-outline-variant rounded-full p-1 shadow-sm shrink-0 self-start md:self-auto">
          <button
            onClick={() => setLearningMode("digger")}
            className={`px-5 py-2 rounded-full text-[12.5px] font-serif font-semibold transition-all flex items-center gap-2 ${
              learningMode === "digger"
                ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/60 font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">menu_book</span>
            <span>Digger Mode</span>
          </button>
          <button
            onClick={() => setLearningMode("surface")}
            className={`px-5 py-2 rounded-full text-[12.5px] font-serif font-semibold transition-all flex items-center gap-2 ${
              learningMode === "surface"
                ? "bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/60 font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">speed</span>
            <span>Surface Mode</span>
          </button>
        </div>
      </div>

      {/* Approval Status Banner if unapproved or approved */}
      {!isRoadmapApproved ? (
        <div className="p-5 bg-tertiary-fixed/30 border border-tertiary-fixed-dim rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-tertiary-fixed-variant">
              pending_actions
            </span>
            <div>
              <h3 className="font-serif text-[15px] font-semibold text-primary">
                Review & Approve Learning Trail
              </h3>
              <p className="text-[12.5px] text-on-surface-variant">
                Approve your curriculum structure to lock in weekly milestones and activate cohort study pod matching.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              approveRoadmap();
              setShowApprovalModal(true);
            }}
            className="px-6 py-2.5 bg-secondary text-white rounded font-serif text-[13px] font-semibold hover:bg-secondary/90 shadow-sm shrink-0"
          >
            Approve Learning Trail
          </button>
        </div>
      ) : (
        <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-xl flex items-center justify-between gap-4 text-[13px]">
          <div className="flex items-center gap-2.5 text-secondary font-medium">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Learning Trail Approved & Synchronized with Cohort Pod Alpha</span>
          </div>
          <span className="text-[12px] text-on-surface-variant">
            Milestone 2 of 4 Active
          </span>
        </div>
      )}

      {/* THE TRAIL (Vertical Spine connected layout) */}
      <div className="relative pl-2 sm:pl-8 space-y-10">
        {/* Continuous 4px Vertical Spine Line */}
        <div className="absolute left-6 sm:left-[52px] top-6 bottom-10 w-[4px] bg-outline-variant/50 rounded-full" />
        
        {/* Green Completed Overlay Line */}
        <div className="absolute left-6 sm:left-[52px] top-6 h-[28%] w-[4px] bg-secondary rounded-full" />

        {roadmap.map((milestone) => {
          const isCompleted = milestone.status === "completed";
          const isInProgress = milestone.status === "in_progress";
          const isLocked = milestone.status === "locked";
          const isExpanded = expandedMilestoneId === milestone.id;

          return (
            <div key={milestone.id} className="relative flex items-start gap-4 sm:gap-6 group">
              {/* Node Indicator */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-[14px] font-bold z-10 shrink-0 border-2 transition-all ${
                  isCompleted
                    ? "bg-secondary text-white border-secondary shadow-sm"
                    : isInProgress
                    ? "bg-surface-container-lowest text-secondary border-secondary shadow-ambient ring-4 ring-secondary/20 pulse-ring"
                    : "bg-surface-container-low text-on-surface-variant/60 border-outline-variant"
                }`}
              >
                {isCompleted ? (
                  <span className="material-symbols-outlined text-[20px]">check</span>
                ) : (
                  milestone.number
                )}
              </div>

              {/* Milestone Card */}
              <div
                className={`flex-1 rounded-xl transition-all duration-300 ${
                  isInProgress
                    ? "bg-surface-container-lowest border-2 border-secondary shadow-ambient"
                    : isCompleted
                    ? "bg-surface-container-lowest border border-outline-variant opacity-85 hover:opacity-100 shadow-card"
                    : "border border-dashed border-outline-variant bg-surface-container-low/40 opacity-70"
                }`}
              >
                {/* Active Top Accent Line */}
                {isInProgress && <div className="h-1.5 w-full bg-secondary rounded-t-xl" />}

                <div className="p-5 sm:p-7 space-y-4">
                  {/* Card Header Info */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
                          isInProgress
                            ? "bg-primary-container text-white"
                            : isCompleted
                            ? "bg-secondary/15 text-secondary"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {isCompleted
                          ? "Mastered"
                          : isInProgress
                          ? "Active Milestone"
                          : "Locked"}
                      </span>
                      <span className="text-[12.5px] text-on-surface-variant">
                        {isCompleted && milestone.completedDate
                          ? `Completed • ${milestone.completedDate}`
                          : `Estimated: ${milestone.estimatedHours} Hours`}
                      </span>
                    </div>

                    {isInProgress && (
                      <span className="px-3 py-0.5 rounded-full border border-tertiary-fixed-dim text-tertiary-fixed-variant font-serif text-[11.5px] font-semibold bg-tertiary-fixed/20">
                        Crucial Benchmark
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-primary">
                      {milestone.title}
                    </h2>
                    <p className="text-[14px] text-on-surface-variant mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>

                  {/* Digger / Surface Content Display */}
                  {isInProgress && (
                    <div className="space-y-4 pt-2">
                      {learningMode === "digger" && milestone.diggerDeepDive ? (
                        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/60 space-y-3">
                          <h3 className="text-[12px] font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-secondary">
                              library_books
                            </span>
                            <span>Digger Mode Citations & Foundations</span>
                          </h3>
                          <p className="text-[12.5px] text-on-surface leading-relaxed italic font-serif">
                            &quot;{milestone.diggerDeepDive.theoreticalFoundation}&quot;
                          </p>
                          <ul className="space-y-1.5 pt-1">
                            {milestone.diggerDeepDive.readingList.map((book, i) => (
                              <li
                                key={i}
                                className="text-[12px] text-on-surface-variant flex items-start gap-2 font-serif"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                                <span>{book}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        milestone.surfaceSummary && (
                          <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/60 space-y-2">
                            <h3 className="text-[12px] font-semibold text-secondary uppercase tracking-wider flex items-center gap-2">
                              <span className="material-symbols-outlined text-[16px]">speed</span>
                              <span>Surface Mode Key Syntheses</span>
                            </h3>
                            <ul className="space-y-1">
                              {milestone.surfaceSummary.map((sum, i) => (
                                <li
                                  key={i}
                                  className="text-[12.5px] text-on-surface flex items-start gap-2"
                                >
                                  <span className="material-symbols-outlined text-[15px] text-secondary mt-0.5">
                                    check
                                  </span>
                                  <span>{sum}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}

                      {/* Interactive Syllabus Modules */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant">
                            Milestone Syllabus Units ({milestone.modules.length})
                          </span>
                          <button
                            onClick={() =>
                              setExpandedMilestoneId(isExpanded ? "" : milestone.id)
                            }
                            className="text-[12px] text-secondary hover:underline font-semibold"
                          >
                            {isExpanded ? "Collapse Modules" : "Expand Modules"}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="space-y-2 pt-1">
                            {milestone.modules.map((mod) => (
                              <div
                                key={mod.id}
                                className="flex items-center justify-between p-3 rounded bg-surface-container-lowest border border-outline-variant/80 hover:border-secondary transition-colors text-[13px]"
                              >
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      toggleModuleCompletion(milestone.id, mod.id)
                                    }
                                    className="text-secondary hover:scale-110 transition-transform"
                                  >
                                    <span className="material-symbols-outlined text-[20px]">
                                      {mod.completed
                                        ? "check_circle"
                                        : "radio_button_unchecked"}
                                    </span>
                                  </button>
                                  <span
                                    className={`font-medium ${
                                      mod.completed
                                        ? "line-through text-on-surface-variant"
                                        : "text-on-surface"
                                    }`}
                                  >
                                    {mod.title}
                                  </span>
                                </div>
                                <span className="text-[11.5px] text-on-surface-variant font-mono">
                                  {mod.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Begin Assessment Action */}
                      <div className="pt-2">
                        <button
                          onClick={() => router.push("/assessment")}
                          className="w-full py-3 bg-secondary text-white rounded font-serif text-[14.5px] font-semibold hover:bg-secondary/90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span>Begin Adaptive Assessment</span>
                          <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                          </span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* If completed, view summary link */}
                  {isCompleted && (
                    <div className="flex items-center justify-between pt-1 text-[12.5px]">
                      <span className="text-secondary font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">stars</span>
                        {milestone.badgeTitle || "Completed"}
                      </span>
                      <Link
                        href="/certification"
                        className="text-on-surface-variant hover:text-primary underline"
                      >
                        View Verification
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Approval Success Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border-2 border-primary-container max-w-md w-full p-6 rounded-xl shadow-modal space-y-4">
            <div className="w-12 h-12 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">verified</span>
            </div>
            <h3 className="font-serif text-[20px] font-bold text-center text-primary">
              Learning Trail Formally Locked
            </h3>
            <p className="text-[13.5px] text-on-surface-variant text-center leading-relaxed">
              Your syllabus has been registered to your academic profile with <strong>{learningMode === "digger" ? "Digger Mode" : "Surface Mode"}</strong> priority. You can begin Milestone 2 whenever you are ready.
            </p>
            <button
              onClick={() => setShowApprovalModal(false)}
              className="w-full py-2.5 bg-secondary text-white rounded font-serif font-semibold text-[13.5px] hover:bg-secondary/90 transition-all"
            >
              Continue to Syllabus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
