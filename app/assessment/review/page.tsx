"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrailmark } from "@/context/TrailmarkContext";
import Link from "next/link";

export default function FinalAssessmentReviewPage() {
  const router = useRouter();
  const { assessmentResult, assessmentQuestions, selectedAnswers, resetAssessment } =
    useTrailmark();
  const [showQuestionBreakdown, setShowQuestionBreakdown] = useState(true);

  const result = assessmentResult || {
    id: "res-default",
    topic: "Deep Learning Fundamentals & Optimization",
    scorePercentage: 92,
    correctCount: 5,
    totalQuestions: 5,
    timeSpentMinutes: 8,
    speedComparison: "15% faster than cohort average",
    passed: true,
    strengths: [
      "Flawless application of chain-rule calculations across multi-layer graphs.",
      "Precise conceptual differentiation between AdamW decoupled decay and standard L2 regularization.",
      "Comprehensive grasp of GPU memory bottlenecks in quadratic attention mechanics.",
    ],
    areasForRefinement: [
      "Review continuous batching edge-cases in asynchronous KV-cache eviction policies.",
    ],
    trailGuideNote:
      "Your grasp on Backpropagation algorithms was exceptional. You completed complex gradient flow proofs with outstanding accuracy and speed.",
    certificationEligible: true,
    awardedPoints: 250,
  };

  const masteryPercent = result.scorePercentage;
  const strokeDashoffset = Math.round(289 - (289 * masteryPercent) / 100);

  return (
    <div className="max-w-3xl mx-auto space-y-10 py-6 pb-20">
      {/* Header */}
      <header className="text-center space-y-2">
        <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
          Milestone Evaluation Complete
        </span>
        <h1 className="font-serif text-[36px] sm:text-[44px] font-bold text-primary tracking-tight">
          Final Review
        </h1>
        <p className="text-[16px] text-on-surface-variant">{result.topic}</p>
      </header>

      {/* Radial Performance Card */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center shadow-card relative overflow-hidden">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-surface-container-high"
              cx="50"
              cy="50"
              fill="none"
              r="46"
              stroke="currentColor"
              strokeWidth="5"
            />
            <circle
              className="text-secondary transition-all duration-1000 ease-out"
              cx="50"
              cy="50"
              fill="none"
              r="46"
              stroke="currentColor"
              strokeDasharray="289"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              strokeWidth="5"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-[38px] sm:text-[44px] font-bold text-primary">
              {masteryPercent}%
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              Mastery Score
            </span>
          </div>
        </div>

        <p className="mt-8 text-center text-[15px] text-on-surface max-w-lg leading-relaxed">
          {result.passed ? (
            <>
              <strong>Outstanding performance.</strong> You have demonstrated a comprehensive understanding of core neural network architectures, gradient derivations, and optimization strategies.
            </>
          ) : (
            <>
              Good progress. Review the highlighted concepts below and attempt the adaptive re-test to meet the 70% certification threshold.
            </>
          )}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[13px]">
          <span className="px-3 py-1 bg-surface-container rounded-full border border-outline-variant/60 font-medium text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-secondary">timer</span>
            Time: {result.timeSpentMinutes} min ({result.speedComparison})
          </span>
          <span className="px-3 py-1 bg-tertiary-fixed/30 rounded-full border border-tertiary-fixed-dim font-medium text-tertiary-fixed-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            Awarded: +{result.awardedPoints} Scholar Points
          </span>
        </div>
      </section>

      {/* Bento-Style Feedback Cards (Strengths & Growth Areas) */}
      <section className="grid sm:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between shadow-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary" />
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-secondary">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
              <h2 className="font-serif text-[17px] font-bold text-primary">Key Strengths</h2>
            </div>
            <div className="bg-secondary-container/15 rounded border border-secondary-container/40 p-3.5">
              <span className="text-[10.5px] font-semibold text-secondary uppercase tracking-wider block mb-1">
                Trail Guide Note
              </span>
              <p className="text-[12.5px] text-on-surface leading-relaxed">
                {result.trailGuideNote}
              </p>
            </div>
            <ul className="space-y-2 border-t border-outline-variant/50 pt-3">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5 shrink-0">
                    check
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Growth Areas */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col justify-between shadow-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-tertiary-fixed-variant" />
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-tertiary-fixed-variant">
              <span className="material-symbols-outlined text-[20px]">psychology</span>
              <h2 className="font-serif text-[17px] font-bold text-primary">Growth Areas</h2>
            </div>
            <div className="bg-tertiary-fixed/20 rounded border border-tertiary-fixed-dim/50 p-3.5">
              <span className="text-[10.5px] font-semibold text-tertiary-fixed-variant uppercase tracking-wider block mb-1">
                Trail Guide Recommendation
              </span>
              <p className="text-[12.5px] text-on-surface leading-relaxed">
                Review memory bandwidth bottlenecks in speculative decoding before starting production model deployment.
              </p>
            </div>
            <ul className="space-y-2 border-t border-outline-variant/50 pt-3">
              {result.areasForRefinement.map((g, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px] text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-variant mt-0.5 shrink-0">
                    arrow_forward
                  </span>
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Question Breakdown Toggle */}
      <section className="space-y-4">
        <div className="flex items-center justify-between p-5 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-card">
          <div>
            <h3 className="font-serif text-[16px] font-bold text-primary">
              Detailed Question Synthesis
            </h3>
            <p className="text-[12.5px] text-on-surface-variant">
              Review answers, explanations, and literature citations.
            </p>
          </div>
          <button
            onClick={() => setShowQuestionBreakdown(!showQuestionBreakdown)}
            className="text-[13px] font-semibold text-secondary hover:underline"
          >
            {showQuestionBreakdown ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {showQuestionBreakdown && (
          <div className="space-y-4">
            {assessmentQuestions.map((q, idx) => {
              const userOpt = selectedAnswers[q.id];
              const isCorrectAnswer = userOpt === q.correctOptionId;

              return (
                <div
                  key={q.id}
                  className={`p-6 bg-surface-container-lowest border rounded-xl shadow-card space-y-3 ${
                    isCorrectAnswer
                      ? "border-l-4 border-l-secondary border-outline-variant"
                      : "border-l-4 border-l-error border-outline-variant"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCorrectAnswer
                          ? "bg-secondary/15 text-secondary"
                          : "bg-error-container/30 text-error"
                      }`}
                    >
                      Question {idx + 1} • {isCorrectAnswer ? "Correct" : "Needs Review"}
                    </span>
                    <span className="text-[11.5px] text-on-surface-variant font-medium">
                      Tag: {q.conceptTag}
                    </span>
                  </div>

                  <h4 className="font-serif text-[16px] font-semibold text-primary leading-snug">
                    {q.prompt}
                  </h4>

                  <p className="text-[13px] text-on-surface-variant leading-relaxed">
                    {q.explanation}
                  </p>

                  <div className="text-[11.5px] text-secondary font-serif italic pt-1">
                    Citation: {q.citation}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-outline-variant">
        <button
          onClick={() => {
            resetAssessment();
            router.push("/assessment");
          }}
          className="w-full sm:w-auto px-5 py-2.5 border border-primary text-primary hover:bg-primary/5 rounded font-serif text-[13.5px] font-semibold transition-colors"
        >
          Retake Assessment
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-serif text-[13.5px] font-semibold text-center transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/certification"
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-secondary text-white hover:bg-secondary/90 rounded font-serif text-[13.5px] font-semibold text-center transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Claim Certificate</span>
            <span className="material-symbols-outlined text-[16px]">verified</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
