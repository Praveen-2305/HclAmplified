"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTrailmark } from "@/context/TrailmarkContext";

export default function AdaptiveAssessmentPage() {
  const router = useRouter();
  const {
    assessmentQuestions,
    currentQuestionIndex,
    selectedAnswers,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    submitAssessment,
  } = useTrailmark();

  const [showInstantFeedback, setShowInstantFeedback] = useState<boolean>(true);
  const currentQ = assessmentQuestions[currentQuestionIndex] || assessmentQuestions[0];
  const selectedOptId = selectedAnswers[currentQ.id];
  const isAnswered = Boolean(selectedOptId);
  const isCorrect = selectedOptId === currentQ.correctOptionId;
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1;

  const handleSelectOption = (optId: string) => {
    selectAnswer(currentQ.id, optId);
  };

  const handleNextOrFinish = () => {
    if (isLastQuestion) {
      submitAssessment();
      router.push("/assessment/review");
    } else {
      nextQuestion();
    }
  };

  const progressPercentage = Math.round(
    ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Assessment Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-widest mb-1">
            <span className="material-symbols-outlined text-[16px]">quiz</span>
            <span>Adaptive Milestone Exam</span>
          </div>
          <h1 className="font-serif text-[26px] sm:text-[30px] font-bold text-primary">
            Deep Learning: Neural Networks & Backprop
          </h1>
        </div>

        {/* Feedback Mode Toggle */}
        <div className="flex items-center gap-2 text-[12.5px] text-on-surface-variant">
          <span>Instant Feedback Loop:</span>
          <button
            onClick={() => setShowInstantFeedback(!showInstantFeedback)}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
              showInstantFeedback ? "bg-secondary" : "bg-surface-dim"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                showInstantFeedback ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-10 shadow-card space-y-8">
        {/* Question Header (Progress + Level) */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-semibold text-on-surface-variant uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
            </span>
            <div className="w-32 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-full border border-outline-variant/60 text-[12px]">
            <span className="material-symbols-outlined text-[15px] text-tertiary-fixed-variant">
              trending_up
            </span>
            <span className="font-medium text-on-surface-variant">
              Level: {currentQ.level}
            </span>
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-4">
          <h2 className="font-serif text-[20px] sm:text-[24px] font-semibold text-primary leading-snug">
            {currentQ.prompt}
          </h2>

          {/* Optional Code Snippet Block */}
          {currentQ.codeSnippet && (
            <div className="bg-primary-container text-white p-4 rounded-lg font-mono text-[13px] overflow-x-auto border border-white/10 shadow-xs">
              <pre>{currentQ.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOptId === opt.id;
            const isOptionCorrect = opt.id === currentQ.correctOptionId;

            let cardStyles =
              "border-outline-variant bg-surface-container-lowest hover:bg-surface-container/50 hover:border-secondary";
            if (isAnswered && showInstantFeedback) {
              if (isSelected && isCorrect) {
                cardStyles =
                  "border-2 border-secondary bg-secondary/10 shadow-xs";
              } else if (isSelected && !isCorrect) {
                cardStyles = "border-2 border-error bg-error-container/20";
              } else if (isOptionCorrect) {
                cardStyles = "border border-secondary bg-secondary/5";
              }
            } else if (isSelected) {
              cardStyles = "border-2 border-secondary bg-secondary/10";
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`w-full text-left p-4 sm:p-5 rounded-lg border transition-all flex items-center justify-between gap-4 group ${cardStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-serif text-[14px] font-bold text-on-surface-variant/70 shrink-0">
                    {idx + 1}.
                  </span>
                  <span
                    className={`font-sans text-[14.5px] leading-relaxed ${
                      isSelected ? "font-semibold text-primary" : "text-on-surface"
                    }`}
                  >
                    {opt.text}
                  </span>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected && isAnswered && showInstantFeedback
                      ? isCorrect
                        ? "bg-secondary border-secondary text-white"
                        : "bg-error border-error text-white"
                      : isSelected
                      ? "bg-secondary border-secondary text-white"
                      : "border-outline-variant group-hover:border-primary"
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px]">
                      {isAnswered && showInstantFeedback && !isCorrect ? "close" : "check"}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded Instant Feedback Loop */}
        {isAnswered && showInstantFeedback && (
          <div
            className={`p-5 sm:p-6 rounded-lg border space-y-3 transition-all ${
              isCorrect
                ? "bg-secondary-container/15 border-secondary-container text-on-surface"
                : "bg-error-container/20 border-error-container text-on-surface"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isCorrect ? "text-secondary" : "text-error"
                }`}
              >
                {isCorrect ? "lightbulb" : "info"}
              </span>
              <span
                className={`font-serif text-[15px] font-bold ${
                  isCorrect ? "text-secondary" : "text-error"
                }`}
              >
                {isCorrect ? "Correct Derivation!" : "Conceptual Refinement Required"}
              </span>
            </div>

            <p className="text-[13.5px] leading-relaxed font-sans text-on-surface">
              {currentQ.explanation}
            </p>

            <div className="pt-2 border-t border-outline-variant/30 flex items-center gap-2 text-[12px] text-on-surface-variant font-serif italic">
              <span className="material-symbols-outlined text-[15px] text-secondary">
                menu_book
              </span>
              <span>Citation: {currentQ.citation}</span>
            </div>
          </div>
        )}

        {/* Navigation & Submission Row */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-outline-variant rounded text-[13px] font-semibold text-on-surface-variant hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Previous</span>
          </button>

          <button
            onClick={handleNextOrFinish}
            disabled={!isAnswered}
            className="px-6 py-2.5 bg-secondary text-white rounded font-serif text-[14px] font-semibold hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
          >
            <span>{isLastQuestion ? "Submit & View Mastery Review" : "Next Question"}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
