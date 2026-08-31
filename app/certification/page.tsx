"use client";

import React, { useState, useEffect } from "react";
import { useTrailmark } from "@/context/TrailmarkContext";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function CertificationPage() {
  const { profile, certificate } = useTrailmark();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fire celebration confetti once on mount
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#1a6a5b", "#ac8225", "#16213a", "#a7f1de"],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(certificate.verificationHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20 pt-4 flex flex-col items-center">
      {/* Milestone Header */}
      <div className="text-center space-y-2 max-w-xl">
        <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
          Final Milestone Reached
        </span>
        <h1 className="font-serif text-[34px] sm:text-[44px] font-bold text-primary tracking-tight">
          Academic Path Certification
        </h1>
        <p className="text-[15px] text-on-surface-variant leading-relaxed">
          You have successfully completed all theoretical derivations and adaptive assessments. Your academic record has been permanently verified.
        </p>
      </div>

      {/* Certificate of Mastery (Skeuomorphic Cotton Archival Canvas) */}
      <div className="w-full bg-surface-container-lowest border-2 border-outline-variant shadow-ambient p-8 sm:p-16 rounded-xl relative overflow-hidden print:border-none print:shadow-none">
        {/* Double Inner Archival Border */}
        <div className="absolute inset-3 sm:inset-5 border border-outline-variant/60 pointer-events-none rounded-lg" />
        <div className="absolute inset-4 sm:inset-6 border border-outline-variant/30 pointer-events-none rounded" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          {/* Institutional Medallion Seal */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-secondary bg-surface-container-lowest flex items-center justify-center relative shadow-sm">
            <div className="absolute inset-1.5 rounded-full border border-secondary/40 border-dashed" />
            <span className="material-symbols-outlined text-secondary text-[40px] sm:text-[48px]">
              stars
            </span>
            <div className="absolute -bottom-2.5 bg-surface-container-lowest px-2 text-[10px] font-bold text-secondary tracking-widest uppercase">
              TRAILMARK
            </div>
          </div>

          {/* Certificate Main Title */}
          <div className="space-y-1 pt-2">
            <h2 className="font-serif text-[32px] sm:text-[42px] font-bold text-primary leading-none tracking-tight">
              Certificate <span className="font-normal italic text-on-surface-variant">of</span> Mastery
            </h2>
            <p className="text-[12px] font-semibold uppercase tracking-widest text-secondary pt-2">
              Trailmark Academic Council & AI Institute
            </p>
          </div>

          {/* Acknowledgment Body */}
          <p className="text-[14px] text-on-surface-variant max-w-xl leading-relaxed font-sans">
            This certifies that the candidate has demonstrated exceptional proficiency, first-principles mathematical rigor, and successful defense in the designated curriculum:
          </p>

          {/* Recipient & Pathway */}
          <div className="space-y-2 py-2">
            <h3 className="font-serif text-[28px] sm:text-[34px] font-bold text-primary border-b-2 border-outline-variant/60 pb-2 px-8 inline-block">
              {profile.name}
            </h3>
            <p className="font-serif text-[18px] sm:text-[20px] font-semibold text-secondary">
              {certificate.pathTitle}
            </p>
            <span className="inline-block px-3 py-1 bg-tertiary-fixed/30 text-tertiary-fixed-variant border border-tertiary-fixed-dim rounded-full text-[12px] font-serif font-bold">
              {certificate.honorsDistinction}
            </span>
          </div>

          {/* Verified Competencies Pill Cloud */}
          <div className="pt-2 max-w-2xl">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block mb-2">
              Verified Academic Competencies
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {certificate.verifiedCompetencies.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded bg-surface-container text-[11.5px] text-on-surface font-medium border border-outline-variant/50"
                >
                  ✓ {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Signatures & Date Row */}
          <div className="flex flex-col sm:flex-row justify-between w-full max-w-2xl px-4 pt-10 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-outline-variant mb-1.5 h-8 flex items-end justify-center pb-1">
                <span className="font-serif text-[18px] font-bold text-primary italic">
                  Dr. E. Turing
                </span>
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Lead Curriculum Architect
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 border-b border-outline-variant mb-1.5 h-8 flex items-end justify-center pb-1 font-mono text-[13px] text-primary">
                {certificate.completionDate}
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                Date of Issuance
              </span>
            </div>
          </div>

          {/* Verification Hash Stamp */}
          <div className="pt-8 text-[11px] text-on-surface-variant font-mono flex items-center gap-2">
            <span>Verification Hash: {certificate.verificationHash}</span>
            <button
              onClick={handleCopyHash}
              className="text-secondary hover:underline font-semibold"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-primary text-white rounded font-serif text-[14px] font-semibold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Download PDF Diploma</span>
        </button>

        <button
          onClick={handleCopyHash}
          className="px-6 py-3 border border-primary text-primary hover:bg-primary/5 rounded font-serif text-[14px] font-semibold transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
          <span>{copied ? "Hash Copied to Clipboard" : "Share Verified Credential"}</span>
        </button>

        <Link
          href="/dashboard"
          className="px-6 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-serif text-[14px] font-semibold transition-all flex items-center gap-2"
        >
          <span>Return to Dashboard</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
