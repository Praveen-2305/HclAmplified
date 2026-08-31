"use client";

import React, { useState } from "react";
import { useTrailmark } from "@/context/TrailmarkContext";

export default function AiAssistantPage() {
  const { learningMode, setLearningMode } = useTrailmark();
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: "guide" | "user";
      text: string;
      citations?: string[];
      code?: string;
    }>
  >([
    {
      id: "ai-1",
      sender: "guide",
      text: "Welcome back, Eleanor. I'm actively analyzing **Deep Learning Fundamentals** in **Digger Mode**.\n\nIn our last session, we discussed backpropagation. To move forward, we should look at how activation functions introduce non-linearity into computational graphs without suffering from exponential vanishing gradients.",
      citations: [
        "Glorot, X., & Bengio, Y. (2010). Understanding the difficulty of training deep feedforward neural networks. AISTATS.",
      ],
      code: `def relu(x):\n    return np.maximum(0, x)\n\ndef relu_derivative(x):\n    return np.where(x > 0, 1, 0)`,
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim() || isTyping) return;

    setInputVal("");
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user" as const,
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: "guide" as const,
        text: `Analysis in **${learningMode === "digger" ? "Digger Mode (Proofs & Citations)" : "Surface Mode"}**:\n\nRegarding your question on *"${text}"*:\n\nWhen training deep multilayer perceptrons, the gradient at layer $l$ is given by the chain rule product $\\prod_{k=l}^L W_k^T \\text{diag}(f'(z_k))$. With bounded activations like $\\sigma(x) = \\frac{1}{1 + e^{-x}}$, the maximum derivative is $0.25$. As depth $L-l$ increases, $(0.25)^{L-l} \\to 0$ exponentially.\n\nUsing ReLU guarantees $f'(z) = 1$ for positive inputs, maintaining constant gradient scale across arbitrary network depths.`,
        citations: [
          "He et al. (2015) — Delving Deep into Rectifiers: Surpassing Human-Level Performance on ImageNet",
          "Loshchilov & Hutter (2019) — Decoupled Weight Decay Regularization (AdamW)",
        ],
        code: `# Gradient propagation step\ndL_dz = dL_da * activation_derivative(z)\ndL_dW = np.dot(dL_dz, a_prev.T)`,
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 850);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 h-[calc(100vh-110px)] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-widest mb-0.5">
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            <span>Trail Guide Academic Assistant</span>
          </div>
          <h1 className="font-serif text-[24px] sm:text-[28px] font-bold text-primary">
            Socratic AI Research Sidekick
          </h1>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-on-surface-variant font-medium">Pedagogy:</span>
          <div className="flex bg-surface-container rounded p-0.5 border border-outline-variant/60">
            <button
              onClick={() => setLearningMode("digger")}
              className={`px-3 py-1 rounded text-[11.5px] font-semibold transition-all ${
                learningMode === "digger"
                  ? "bg-secondary text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Digger Mode
            </button>
            <button
              onClick={() => setLearningMode("surface")}
              className={`px-3 py-1 rounded text-[11.5px] font-semibold transition-all ${
                learningMode === "surface"
                  ? "bg-secondary text-white shadow-xs"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Surface Mode
            </button>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-6">
        {messages.map((m) => {
          const isGuide = m.sender === "guide";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[92%] ${
                isGuide ? "self-start" : "self-end ml-auto flex-row-reverse"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-xs ${
                  isGuide ? "bg-primary text-white" : "bg-secondary text-white font-bold text-[12px]"
                }`}
              >
                {isGuide ? (
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                ) : (
                  "EV"
                )}
              </div>

              <div className="space-y-3">
                <div
                  className={`p-5 rounded-2xl text-[14px] leading-relaxed shadow-xs ${
                    isGuide
                      ? "bg-surface-container-low border border-outline-variant text-on-surface rounded-tl-xs"
                      : "bg-primary-container text-white rounded-tr-xs"
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{m.text}</div>

                  {/* Code block if any */}
                  {m.code && (
                    <div className="mt-3 bg-primary text-white p-3 rounded font-mono text-[12.5px] overflow-x-auto border border-white/10">
                      <pre>{m.code}</pre>
                    </div>
                  )}

                  {/* Citations Box */}
                  {m.citations && (
                    <div className="mt-4 pt-3 border-t border-outline-variant/40 space-y-1">
                      <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">menu_book</span>
                        Primary Literature Citations
                      </span>
                      {m.citations.map((c, i) => (
                        <p key={i} className="text-[12px] text-on-surface-variant font-serif italic">
                          • {c}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Feedback Loop Action Buttons */}
                {isGuide && (
                  <div className="flex items-center gap-2 text-[11.5px] text-on-surface-variant">
                    <button
                      onClick={() => handleSend("Can you derive the mathematical proof step-by-step?")}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-primary font-medium"
                    >
                      Show Step-by-Step Proof
                    </button>
                    <button
                      onClick={() => handleSend("Explain in simpler intuitive terms")}
                      className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-primary font-medium"
                    >
                      Simplify Intuition
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-[13px] text-on-surface-variant italic p-3 bg-surface-container-low rounded-lg w-fit border border-outline-variant/60">
            <span className="material-symbols-outlined text-[16px] animate-spin text-secondary">
              progress_activity
            </span>
            <span>Trail Guide is synthesizing academic literature...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a technical or mathematical question..."
          className="flex-1 bg-surface-container-lowest border border-outline-variant rounded px-4 py-2.5 text-[13.5px] text-on-surface outline-none focus:border-secondary"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputVal.trim() || isTyping}
          className="px-5 py-2.5 bg-secondary text-white font-serif text-[13px] font-semibold rounded hover:bg-secondary/90 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm flex items-center gap-1.5"
        >
          <span>Ask Guide</span>
          <span className="material-symbols-outlined text-[16px]">send</span>
        </button>
      </div>
    </div>
  );
}
