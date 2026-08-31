"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTrailmark } from "@/context/TrailmarkContext";

export default function GroupDiscussionFeedPage() {
  const { profile } = useTrailmark();
  const [replies, setReplies] = useState([
    {
      id: "rep-1",
      author: "Dr. Sanjay Patel",
      role: "Cohort Facilitator",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      timestamp: "1h ago",
      content:
        "Elena, your intuition is on point. The core mathematical cause is that the derivative of sigmoid f'(z) = f(z)(1-f(z)) achieves a theoretical maximum of 0.25 at z=0. Repeated multiplications across 10 layers causes (0.25)^10 ≈ 9.5e-7, which kills weight updates entirely.",
      upvotes: 14,
      isSolution: true,
    },
    {
      id: "rep-2",
      author: "Julian Thorne",
      role: "Systems Architect",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      timestamp: "45m ago",
      content:
        "This is also why residual skip connections (ResNet) work so well: they create an identity gradient shortcut d(x+f(x))/dx = 1 + f'(x), ensuring gradients flow cleanly without decaying to zero.",
      upvotes: 9,
      isSolution: false,
    },
  ]);

  const [newReply, setNewReply] = useState("");

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    const rep = {
      id: `rep-${Date.now()}`,
      author: profile.name,
      role: profile.targetRole || "Scholar",
      avatar: profile.avatar,
      timestamp: "Just now",
      content: newReply,
      upvotes: 1,
      isSolution: false,
    };

    setReplies((prev) => [...prev, rep]);
    setNewReply("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-outline-variant pb-6 space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-widest">
          <Link href="/study-groups" className="hover:underline">Study Group</Link>
          <span>/</span>
          <span>Module 4 Discussions</span>
        </div>
        <h1 className="font-serif text-[28px] sm:text-[34px] font-bold text-primary">
          Module 4: Backpropagation & Activation Dynamics
        </h1>
        <p className="text-[14px] text-on-surface-variant">
          Deep Learning Fundamentals Cohort Alpha Thread
        </p>
      </div>

      {/* Main Discussion Thread Hero */}
      <article className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Thread Starter Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
              alt="Elena Rostova"
              className="w-11 h-11 rounded-full object-cover border-2 border-secondary"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-[16px] font-bold text-primary">Elena Rostova</span>
                <span className="text-[11px] text-secondary font-semibold bg-secondary/10 px-2 py-0.2 rounded">
                  Top Contributor
                </span>
              </div>
              <span className="text-[12px] text-on-surface-variant">2 hours ago • Doctoral Researcher</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-[11.5px] font-semibold bg-surface-container text-primary">
            #Backpropagation
          </span>
        </div>

        {/* Question Content */}
        <div className="space-y-3">
          <h2 className="font-serif text-[20px] font-bold text-primary">
            Intuition behind Vanishing Gradients in deep non-linear networks?
          </h2>
          <p className="text-[14px] text-on-surface leading-relaxed font-sans">
            I am working through the mathematical proof for weight updates in a 12-layer MLP. When computing the gradient of the loss with respect to layer 1 weights, why does the gradient scale degrade so rapidly under standard Sigmoid activations compared to piecewise linear activations like ReLU and GELU?
          </p>
        </div>

        {/* AI Synthesis Callout */}
        <div className="bg-tertiary-fixed/20 border border-tertiary-fixed-dim rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-tertiary-fixed-variant">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span className="text-[11.5px] font-bold uppercase tracking-wider">
              Trail Guide AI Summary & Citation
            </span>
          </div>
          <p className="text-[12.5px] text-on-surface leading-relaxed">
            Elena is asking for the analytical root cause of gradient decay in saturated activation regimes. Key reference: <em>Glorot & Bengio (2010)</em>, demonstrating why layer variance collapses under sigmoid non-linearities.
          </p>
        </div>

        {/* Replies Section */}
        <div className="space-y-4 pt-4 border-t border-outline-variant/60">
          <h3 className="font-serif text-[16px] font-bold text-primary">
            Peer & Instructor Responses ({replies.length})
          </h3>

          {replies.map((rep) => (
            <div
              key={rep.id}
              className={`p-5 rounded-lg border space-y-2.5 ${
                rep.isSolution
                  ? "bg-secondary-container/10 border-secondary"
                  : "bg-surface-container-low border-outline-variant/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rep.avatar} alt={rep.author} className="w-7 h-7 rounded-full object-cover" />
                  <span className="font-serif text-[14px] font-bold text-primary">{rep.author}</span>
                  <span className="text-[11px] text-on-surface-variant">• {rep.role}</span>
                </div>
                <span className="text-[11.5px] text-on-surface-variant">{rep.timestamp}</span>
              </div>

              <p className="text-[13.5px] text-on-surface leading-relaxed font-sans">{rep.content}</p>

              <div className="flex items-center justify-between pt-1 text-[11.5px] text-on-surface-variant">
                <span className="flex items-center gap-1 font-semibold text-secondary">
                  <span className="material-symbols-outlined text-[15px]">thumb_up</span>
                  {rep.upvotes} Helpful
                </span>
                {rep.isSolution && (
                  <span className="text-secondary font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Verified Solution
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Composer Form */}
        <form onSubmit={handleAddReply} className="pt-4 border-t border-outline-variant space-y-3">
          <label className="font-serif text-[14px] font-bold text-primary block">
            Post an Academic Derivation or Insight
          </label>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your explanation or mathematical proof..."
            rows={3}
            className="w-full bg-surface-container-low border border-outline-variant rounded p-3.5 text-[13.5px] text-on-surface outline-none focus:border-secondary"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-secondary text-white rounded font-serif text-[13px] font-semibold hover:bg-secondary/90 shadow-sm"
            >
              Publish Response (+35 pts)
            </button>
          </div>
        </form>
      </article>
    </div>
  );
}
