"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTrailmark } from "@/context/TrailmarkContext";

export function TrailGuideDrawer() {
  const { isAiGuideOpen, toggleAiGuide, aiGuideMessages, sendAiGuideMessage, learningMode, setLearningMode } = useTrailmark();
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAiGuideOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiGuideMessages, isAiGuideOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const text = inputText;
    setInputText("");
    setIsSending(true);
    try {
      await sendAiGuideMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    "Derive the gradient of GELU activation",
    "Explain vanishing gradients in Digger Mode",
    "Why does AdamW decouple weight decay?",
    "Summarize attention matrix complexity",
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => toggleAiGuide()}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-primary-container text-white rounded-full shadow-ambient hover:bg-primary transition-all border border-secondary-fixed/30 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-secondary-fixed"
        aria-label="Toggle Trail Guide AI Assistant"
      >
        <span className="material-symbols-outlined text-secondary-fixed text-[22px] group-hover:rotate-12 transition-transform">
          smart_toy
        </span>
        <span className="text-[13px] font-semibold tracking-wide">Trail Guide AI</span>
        <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping" />
      </button>

      {/* Drawer Overlay */}
      {isAiGuideOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
          onClick={() => toggleAiGuide(false)}
        />
      )}

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-background text-on-background z-50 shadow-modal border-l border-outline-variant transform transition-transform duration-300 ease-in-out flex flex-col ${
          isAiGuideOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-primary-container text-white border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-secondary-fixed">
              <span className="material-symbols-outlined text-[24px]">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline-sm text-[18px] font-semibold text-white">Trail Guide</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary text-white uppercase tracking-wider">
                  Academic AI
                </span>
              </div>
              <p className="text-[12px] text-on-primary-container">Socratic Tutor & Research Synthesizer</p>
            </div>
          </div>

          <button
            onClick={() => toggleAiGuide(false)}
            className="text-on-primary-container hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close Assistant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mode & Topic Subheader */}
        <div className="px-5 py-3 bg-surface-container border-b border-outline-variant/60 flex items-center justify-between text-[12px]">
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">my_location</span>
            <span>Focus: <strong>Deep Learning Fundamentals</strong></span>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center bg-surface-container-high rounded p-0.5 border border-outline-variant/50">
            <button
              onClick={() => setLearningMode("digger")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                learningMode === "digger"
                  ? "bg-secondary text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Digger Mode
            </button>
            <button
              onClick={() => setLearningMode("surface")}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                learningMode === "surface"
                  ? "bg-secondary text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Surface Mode
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {aiGuideMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-lg text-[13.5px] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary-container text-white rounded-br-none"
                    : "bg-surface-container-lowest border border-outline-variant/70 text-on-surface rounded-bl-none shadow-xs"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Citations Box for AI responses */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-outline-variant/40">
                    <div className="text-[11px] font-semibold text-secondary flex items-center gap-1 mb-1 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[13px]">menu_book</span>
                      Academic Citations
                    </div>
                    <ul className="space-y-1">
                      {msg.citations.map((cite, i) => (
                        <li key={i} className="text-[11.5px] text-on-surface-variant italic font-serif">
                          • {cite}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <span className="text-[10.5px] text-on-surface-variant mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-on-surface-variant text-[12px] p-3 bg-surface-container-lowest rounded-md border border-outline-variant/60 w-fit">
              <span className="material-symbols-outlined text-[16px] animate-spin text-secondary">
                progress_activity
              </span>
              <span>Consulting academic literature and synthesizing proof...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-5 py-2.5 bg-surface-container-low border-t border-outline-variant/60">
          <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
            Suggested Scholarly Prompts:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(p);
                }}
                className="text-[11.5px] px-2.5 py-1 rounded bg-surface-container-lowest border border-outline-variant hover:border-secondary hover:text-secondary text-on-surface transition-all text-left truncate max-w-full"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-surface-container-lowest border-t border-outline-variant flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask a mathematical or conceptual question..."
            className="flex-1 bg-surface-container-low border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary rounded-md px-3.5 py-2.5 text-[13.5px] outline-none text-on-surface placeholder:text-on-surface-variant/70"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="px-4 py-2.5 bg-secondary text-white rounded-md font-semibold text-[13px] hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </>
  );
}
