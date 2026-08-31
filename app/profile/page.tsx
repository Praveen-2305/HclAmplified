"use client";

import React, { useState } from "react";
import { useTrailmark } from "@/context/TrailmarkContext";
import Link from "next/link";

export default function ScholarProfilePage() {
  const { profile, updateProfile, learningMode, setLearningMode } = useTrailmark();
  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(profile.bio || "");

  const handleSaveBio = () => {
    updateProfile({ bio: bioInput });
    setIsEditing(false);
  };

  const certifications = [
    {
      id: "cert-1",
      title: "Deep Learning Fundamentals & Neural Architectures",
      distinction: "Highest Distinction (92% Mastery)",
      date: "October 2024",
      skills: ["Backpropagation", "AdamW Optimization", "GELU/ReLU Dynamics"],
      status: "Verified",
    },
    {
      id: "cert-2",
      title: "Mathematics & Tensor Calculus for Machine Learning",
      distinction: "Honors Distinction (88% Mastery)",
      date: "September 2024",
      skills: ["Linear Algebra", "Matrix Decompositions", "Jacobian Matrices"],
      status: "Verified",
    },
  ];

  const skillMaturity = [
    { name: "Multivariable Gradient Flow", score: 94, level: "Advanced" },
    { name: "Adaptive Optimizers (AdamW)", score: 90, level: "Advanced" },
    { name: "Transformer Attention Mechanics", score: 72, level: "Intermediate" },
    { name: "vLLM Distributed Serving", score: 48, level: "Emerging" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Profile Header Hero Card */}
      <header className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 z-10">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-secondary shadow-sm"
            />
            <div className="absolute -bottom-2 -right-2 bg-secondary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-2 border-white shadow-xs flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">
                {learningMode === "digger" ? "menu_book" : "speed"}
              </span>
              <span>{learningMode}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-[26px] sm:text-[32px] font-bold text-primary">
                {profile.name}
              </h1>
              <span className="px-3 py-0.5 rounded-full text-[11.5px] font-semibold bg-tertiary-fixed/30 text-tertiary-fixed-variant border border-tertiary-fixed-dim">
                {profile.scholarLevel}
              </span>
            </div>
            <p className="text-[14px] text-on-surface-variant">
              Target: <strong>{profile.targetRole || "AI Engineer"}</strong> • Joined {profile.joinedDate}
            </p>
            <p className="text-[12.5px] text-on-surface leading-snug max-w-xl italic pt-1">
              &quot;{profile.bio}&quot;
            </p>
          </div>
        </div>

        {/* Header Stats */}
        <div className="flex sm:flex-col items-end gap-3 self-end md:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-outline-variant/60 w-full sm:w-auto justify-between sm:justify-start">
          <div className="text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block">
              Total Contribution
            </span>
            <span className="font-serif text-[26px] font-bold text-primary">
              {profile.totalPoints.toLocaleString()} pts
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 border border-primary text-primary hover:bg-primary/5 rounded text-[12px] font-semibold transition-colors"
            >
              {isEditing ? "Cancel Edit" : "Edit Scholar Bio"}
            </button>
            <Link
              href="/certification"
              className="px-4 py-1.5 bg-secondary text-white rounded font-serif text-[12px] font-semibold hover:bg-secondary/90 shadow-sm"
            >
              View Certificate
            </Link>
          </div>
        </div>
      </header>

      {/* Edit Bio Drawer / Box if Open */}
      {isEditing && (
        <div className="bg-surface-container-lowest border-2 border-secondary rounded-xl p-5 shadow-card space-y-3">
          <label className="font-serif text-[14px] font-bold text-primary block">
            Update Academic Profile Bio
          </label>
          <textarea
            value={bioInput}
            onChange={(e) => setBioInput(e.target.value)}
            rows={2}
            className="w-full bg-surface-container-low border border-outline-variant rounded p-3 text-[13.5px] text-on-surface outline-none focus:border-secondary"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-[12px] text-on-surface-variant"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBio}
              className="px-4 py-1.5 bg-secondary text-white rounded text-[12px] font-semibold hover:bg-secondary/90"
            >
              Save Bio
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid: Mastery Certifications & Skill Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Certifications (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-[20px] font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[22px]">
                workspace_premium
              </span>
              Mastery Certifications
            </h2>
            <Link href="/certification" className="text-[12.5px] text-secondary font-semibold hover:underline">
              Official Records &gt;
            </Link>
          </div>

          <div className="space-y-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-secondary uppercase tracking-wider block">
                      {cert.distinction}
                    </span>
                    <h3 className="font-serif text-[17px] font-bold text-primary mt-0.5">
                      {cert.title}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-secondary/15 text-secondary shrink-0">
                    {cert.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cert.skills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-surface-container text-[11px] text-on-surface-variant font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between text-[11.5px] text-on-surface-variant">
                  <span>Issued: {cert.date}</span>
                  <Link
                    href="/certification"
                    className="text-secondary font-semibold hover:underline"
                  >
                    View Credential
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Skill Competency Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="font-serif text-[20px] font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-fixed-variant text-[22px]">
              analytics
            </span>
            Skill Competency Matrix
          </h2>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-5">
            {skillMaturity.map((skill, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-on-surface">{skill.name}</span>
                  <span className="text-[12px] font-semibold text-primary">{skill.score}%</span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full transition-all duration-700"
                    style={{ width: `${skill.score}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-outline-variant/50">
              <div className="flex items-center justify-between text-[12px] text-on-surface-variant">
                <span>Pedagogical Focus:</span>
                <span className="font-semibold text-secondary capitalize">
                  {learningMode} Mode
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
