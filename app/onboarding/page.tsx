"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTrailmark } from "@/context/TrailmarkContext";
import { LearningPersona } from "@/types/trailmark";
import { generateOnboardingResponse } from "@/services/aiService";

interface ChatMessage {
  id: string;
  sender: "guide" | "user";
  text: string;
  options?: { id: LearningPersona | string; label: string; sub: string; icon?: string }[];
  isBlueprintCTA?: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { profile, updateProfile, learningMode, setLearningMode } = useTrailmark();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "guide",
      text: "Welcome to Trailmark. I'm your Guide. To curate a syllabus that respects your time, let's start with your objectives.\n\nWhat career transition or specific skill set are you focusing on?",
    },
    {
      id: "m-2",
      sender: "user",
      text: "I'm currently a senior marketing manager, but I want to pivot entirely into data analytics and machine learning over the next 18 months.",
    },
    {
      id: "m-3",
      sender: "guide",
      text: "A rigorous pivot. Transitioning from marketing to ML requires a strong foundation in statistics and Python.\n\nBefore we build the roadmap, I need to understand your learning persona. How do you prefer to absorb new technical concepts?",
      options: [
        {
          id: "digger",
          label: "Digger Mode",
          sub: "I want primary sources, citations, and deep theoretical dives.",
        },
        {
          id: "surface",
          label: "Surface Mode",
          sub: "Just the core essentials, summaries, and bullet points.",
        },
        {
          id: "motivation",
          label: "Pragmatist",
          sub: "Project-based only. I learn by building immediately.",
        },
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [blueprintProgress, setBlueprintProgress] = useState(65);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSelectPersona = (persona: LearningPersona) => {
    setLearningMode(persona);
    const personaLabel =
      persona === "digger"
        ? "Digger Mode (Rigorous Proofs & Citations)"
        : persona === "surface"
        ? "Surface Mode (High-Yield Syntheses)"
        : "Pragmatist Mode";

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: `Selected: ${personaLabel}`,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setBlueprintProgress(90);

    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "guide",
        text: `Understood. We will calibrate your learning trail for **${personaLabel}**.\n\nAssessments and reading modules will adapt directly to this depth. Your initial syllabus blueprint has been formulated across 3 target career tracks.`,
        isBlueprintCTA: true,
      };
      setMessages((prev) => [...prev, aiReply]);
      setBlueprintProgress(100);
    }, 900);
  };

  const handleSendText = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const userText = inputVal;
    setInputVal("");

    const newMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const response = await generateOnboardingResponse(userText, messages.length);
      setIsTyping(false);

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "guide",
        text: response.reply,
        isBlueprintCTA: response.isBlueprintReady,
      };
      setMessages((prev) => [...prev, aiReply]);
      setBlueprintProgress((prev) => Math.min(100, prev + 15));
    } catch {
      setIsTyping(false);
    }
  };

  const handleSimulateResume = () => {
    setResumeUploaded(true);
    setBlueprintProgress(100);
    updateProfile({
      bio: "Parsed Resume: 7+ yrs in Statistical Marketing, Python pandas/scikit-learn experimentation, predictive cohort modeling.",
    });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: "Uploaded Resume: Eleanor_Vance_Curriculum_Vitae.pdf",
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "guide",
        text: "Resume analyzed successfully. We identified 14 verified baseline competencies (including Exploratory Data Analysis, Linear Regression, SQL, and A/B Testing). Fast-tracking role matching now.",
        isBlueprintCTA: true,
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 800);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] max-w-7xl mx-auto">
      {/* Center Chat Area */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-card">
        {/* Chat Banner */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </div>
            <div>
              <h2 className="font-serif text-[15px] font-semibold text-on-surface">
                Trail Guide • Pedagogical Intake
              </h2>
              <p className="text-[11px] text-on-surface-variant">Calibrating learner archetype & timeline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-[12px] font-medium text-secondary">Session Active</span>
          </div>
        </div>

        {/* Scrollable Message Flow */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m) => {
            const isGuide = m.sender === "guide";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[88%] ${
                  isGuide ? "self-start" : "self-end ml-auto flex-row-reverse"
                }`}
              >
                {isGuide ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <span className="material-symbols-outlined text-[16px] text-on-primary">
                      smart_toy
                    </span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 border border-outline-variant"
                  />
                )}

                <div className="space-y-3">
                  <div
                    className={`px-5 py-4 rounded-2xl text-[14px] leading-relaxed shadow-xs ${
                      isGuide
                        ? "bg-secondary-fixed/20 text-on-surface border border-secondary-fixed/40 rounded-tl-xs"
                        : "bg-surface-container text-on-surface border border-outline-variant rounded-tr-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line font-sans">{m.text}</div>
                  </div>

                  {/* Interactive Options if provided */}
                  {m.options && (
                    <div className="flex flex-col gap-2.5 pt-1">
                      {m.options.map((opt) => {
                        const isSelected = learningMode === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => handleSelectPersona(opt.id as LearningPersona)}
                            className={`group flex items-center justify-between p-3.5 rounded-lg border transition-all text-left ${
                              isSelected
                                ? "border-2 border-secondary bg-secondary/10 shadow-xs"
                                : "border-outline-variant bg-surface-container-lowest hover:border-secondary hover:bg-secondary/5"
                            }`}
                          >
                            <div>
                              <span
                                className={`block font-serif text-[14px] font-semibold mb-0.5 ${
                                  isSelected ? "text-secondary" : "text-primary group-hover:text-secondary"
                                }`}
                              >
                                {opt.label}
                              </span>
                              <span className="block text-[12px] text-on-surface-variant">
                                {opt.sub}
                              </span>
                            </div>
                            <span
                              className={`material-symbols-outlined text-[20px] transition-colors ${
                                isSelected ? "text-secondary" : "text-outline-variant group-hover:text-secondary"
                              }`}
                            >
                              {isSelected ? "check_circle" : "arrow_forward"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Role Blueprint CTA */}
                  {m.isBlueprintCTA && (
                    <div className="p-4 bg-primary-container text-white rounded-lg border border-secondary-fixed/30 flex items-center justify-between gap-4 mt-2">
                      <div>
                        <h4 className="font-serif text-[14px] font-semibold text-secondary-fixed">
                          Blueprint Calibrated: 3 Target Roles Formulated
                        </h4>
                        <p className="text-[12px] text-on-primary-container mt-0.5">
                          View the full skill matrix and choose your target path.
                        </p>
                      </div>
                      <button
                        onClick={() => router.push("/recommendations")}
                        className="px-4 py-2 bg-secondary text-white font-semibold text-[13px] rounded hover:bg-secondary/90 transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                      >
                        <span>View Roles</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center text-on-surface-variant text-[13px] italic bg-surface-container-low px-4 py-2.5 rounded-lg border border-outline-variant/60 w-fit">
              <span className="material-symbols-outlined text-[18px] animate-spin text-secondary">
                progress_activity
              </span>
              <span>Trail Guide is synthesizing pedagogical pathways...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar & Fast-Track Actions */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant space-y-3">
          {/* Quick Action Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSimulateResume}
              disabled={resumeUploaded}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-[12px] font-medium transition-all ${
                resumeUploaded
                  ? "bg-secondary-fixed/30 text-secondary border-secondary font-semibold"
                  : "border-primary text-primary hover:bg-primary/5"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {resumeUploaded ? "check" : "upload_file"}
              </span>
              <span>{resumeUploaded ? "Resume Synced" : "Upload Resume (PDF)"}</span>
            </button>

            <button
              onClick={() => {
                setInputVal("I can dedicate 12 hours per week to mathematical foundations.");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary text-[12px] transition-all"
            >
              <span>Commit 12h/week</span>
            </button>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Describe your background or ask a question about the curriculum..."
              className="flex-1 bg-surface-container-lowest border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded px-4 py-2.5 text-[13.5px] outline-none text-on-surface placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="w-11 h-11 rounded bg-secondary text-white flex items-center justify-center hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Right Live Profile Blueprint Card */}
      <aside className="w-full lg:w-[340px] bg-surface-container-lowest border border-outline-variant rounded-lg p-6 flex flex-col justify-between shadow-card h-fit lg:h-full overflow-y-auto">
        <div className="space-y-6">
          <div className="border-b border-outline-variant pb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-[17px] font-semibold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  architecture
                </span>
                Live Profile Blueprint
              </h3>
            </div>
            <p className="text-[12px] text-on-surface-variant mt-1">
              Real-time curriculum synthesis
            </p>
          </div>

          {/* Detected Persona */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Active Persona
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary pulse-ring" />
            </div>
            <div className="p-3.5 bg-tertiary-fixed/20 border border-tertiary-fixed-dim rounded">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-variant">
                  {learningMode === "digger" ? "menu_book" : "speed"}
                </span>
                <span className="font-serif text-[13.5px] font-semibold text-tertiary-fixed-variant capitalize">
                  {learningMode} Learner
                </span>
              </div>
              <p className="text-[12px] text-on-surface leading-snug">
                {learningMode === "digger"
                  ? "Rigorous first-principles approach. Prioritizes proofs, academic citations, and tensor mechanics."
                  : "High-yield conceptual summaries and applied implementations for rapid skill velocity."}
              </p>
            </div>
          </div>

          {/* Primary Goal */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Target Transition
            </span>
            <div className="p-3.5 bg-surface border border-outline-variant rounded relative">
              <div className="absolute left-0 top-3 bottom-3 w-1 bg-secondary rounded-r" />
              <p className="text-[13px] font-semibold text-primary ml-2">
                Senior Marketing Analytics → {profile.targetRole || "AI Engineer"}
              </p>
              <p className="text-[11.5px] text-on-surface-variant mt-1 ml-2">
                Timeline: {profile.targetTimelineMonths} Months • 12 hrs/wk
              </p>
            </div>
          </div>

          {/* Baseline Skills */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Extracted Baseline Competencies
            </span>
            <div className="p-3 bg-surface-container rounded border border-outline-variant/70 space-y-1.5 text-[12px]">
              <div className="flex items-center justify-between text-on-surface">
                <span>Statistical Modeling</span>
                <span className="font-semibold text-secondary">Strong</span>
              </div>
              <div className="flex items-center justify-between text-on-surface">
                <span>Python & SQL Data Wrangling</span>
                <span className="font-semibold text-secondary">Strong</span>
              </div>
              <div className="flex items-center justify-between text-on-surface">
                <span>Tensor Calculus & Neural Networks</span>
                <span className="font-semibold text-tertiary-fixed-variant">Learning Target</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress & Next Screen Action */}
        <div className="pt-6 border-t border-outline-variant mt-6 space-y-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="font-medium text-on-surface-variant">Syllabus Synthesis</span>
            <span className="font-semibold text-secondary">{blueprintProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-500"
              style={{ width: `${blueprintProgress}%` }}
            />
          </div>

          <button
            onClick={() => router.push("/recommendations")}
            className="w-full py-2.5 bg-primary text-white rounded font-serif text-[13.5px] font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Role Matches</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
