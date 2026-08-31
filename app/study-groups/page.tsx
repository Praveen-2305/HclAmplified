"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTrailmark } from "@/context/TrailmarkContext";

export default function StudyGroupPage() {
  const { profile } = useTrailmark();
  const [activeTab, setActiveTab] = useState<"Overview" | "Discussions" | "Resources">("Overview");

  const members = [
    { name: "Dr. Sanjay Patel", role: "Cohort Lead & Facilitator", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", status: "online" },
    { name: "Elena Rostova", role: "Doctoral Researcher", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", status: "online" },
    { name: "Eleanor Vance", role: "Level IV Academic Scholar (You)", avatar: profile.avatar, status: "online" },
    { name: "Julian Thorne", role: "Systems Architect", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", status: "offline" },
    { name: "Marcus Aurelius Vance", role: "Statistical Theorist", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", status: "online" },
  ];

  const syllabusSchedule = [
    { week: "Week 1-2", topic: "Vector Calculus & Jacobian Matrix Formulation", status: "Completed" },
    { week: "Week 3-4", topic: "Activation Dynamics & Vanishing Gradient Mitigations", status: "In Progress" },
    { week: "Week 5-6", topic: "Stochastic Optimizers (AdamW vs Lion) & SVD LoRA", status: "Upcoming" },
    { week: "Week 7-8", topic: "Multi-Head Attention & KV-Cache Implementations", status: "Upcoming" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant pb-6">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-secondary uppercase tracking-widest mb-1">
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span>Cohort Alpha</span>
          </div>
          <h1 className="font-serif text-[28px] sm:text-[36px] font-bold text-primary">
            Deep Learning Fundamentals
          </h1>
          <p className="text-[14px] text-on-surface-variant mt-1">
            An intensive collaborative study pod focused on neural architectures and backpropagation proofs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/leader-dashboard"
            className="px-4 py-2 border border-primary text-primary hover:bg-primary/5 rounded font-serif text-[12.5px] font-semibold transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">monitoring</span>
            <span>Leader Dashboard</span>
          </Link>
          <button className="px-5 py-2 bg-secondary text-white font-serif text-[13px] font-semibold rounded hover:bg-secondary/90 shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">group_add</span>
            <span>Invite Scholar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-outline-variant text-[13.5px] font-semibold">
        {(["Overview", "Discussions", "Resources"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition-colors ${
              activeTab === tab
                ? "text-primary border-b-2 border-secondary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Syllabus & Schedule (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-4">
              <h2 className="font-serif text-[19px] font-bold text-primary">
                Weekly Pod Milestone Schedule
              </h2>
              <div className="space-y-3">
                {syllabusSchedule.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded bg-surface-container-low border border-outline-variant/60 text-[13px]"
                  >
                    <div>
                      <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block">
                        {item.week}
                      </span>
                      <span className="font-medium text-primary mt-0.5 block">{item.topic}</span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                        item.status === "Completed"
                          ? "bg-secondary/15 text-secondary"
                          : item.status === "In Progress"
                          ? "bg-primary-container text-white"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Pod Threads */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[19px] font-bold text-primary">
                  Active Pod Discussion Threads
                </h2>
                <Link href="/discussions" className="text-[12px] text-secondary font-semibold hover:underline">
                  View All &gt;
                </Link>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded bg-surface-container-low border border-outline-variant/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11.5px] text-on-surface-variant">
                    <span>Initiated by Elena Rostova • 2h ago</span>
                    <span className="text-secondary font-semibold">Module 4: Backpropagation</span>
                  </div>
                  <h3 className="font-serif text-[15px] font-bold text-primary">
                    Intuition behind Vanishing Gradients in deep networks?
                  </h3>
                  <p className="text-[12.5px] text-on-surface-variant">
                    Analyzing whether piecewise linear activations permanently resolve saturation manifolds...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Member Roster (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-[17px] font-bold text-primary">
                  Pod Roster (45 Active)
                </h3>
                <span className="w-2 h-2 rounded-full bg-secondary pulse-ring" />
              </div>

              <div className="space-y-3">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-[12.5px]">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
                      <div>
                        <span className="font-semibold text-primary block">{m.name}</span>
                        <span className="text-[11px] text-on-surface-variant">{m.role}</span>
                      </div>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${m.status === "online" ? "bg-secondary" : "bg-outline-variant"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Discussions" && (
        <div className="p-8 bg-surface-container-lowest border border-outline-variant rounded-xl text-center space-y-3">
          <p className="text-[14px] text-on-surface-variant">
            Explore dedicated peer threads in the discussions module.
          </p>
          <Link
            href="/discussions"
            className="inline-block px-5 py-2.5 bg-secondary text-white rounded font-serif text-[13px] font-semibold hover:bg-secondary/90"
          >
            Open Dedicated Module Discussion Feed
          </Link>
        </div>
      )}

      {activeTab === "Resources" && (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 space-y-3">
          <h3 className="font-serif text-[17px] font-bold text-primary">Pod Reading List</h3>
          <ul className="space-y-2 text-[13px] text-on-surface font-serif italic">
            <li>• Goodfellow et al. — Deep Learning (Chapters 6-8)</li>
            <li>• Glorot & Bengio (2010) — Understanding difficulty of training deep feedforward neural networks</li>
            <li>• Loshchilov & Hutter (2019) — Decoupled Weight Decay Regularization (AdamW)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
