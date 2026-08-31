"use client";

import React, { useState } from "react";
import { useTrailmark } from "@/context/TrailmarkContext";
import Link from "next/link";

export default function RewardsShopPage() {
  const { profile, rewards, redeemReward } = useTrailmark();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRedeem = (rewardId: string, title: string) => {
    const success = redeemReward(rewardId);
    if (success) {
      setSuccessMessage(`Successfully redeemed: "${title}"`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header & Balance Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-variant pb-8">
        <div>
          <span className="text-[12px] font-semibold text-secondary uppercase tracking-widest">
            Scholar Recognition
          </span>
          <h1 className="font-serif text-[32px] sm:text-[40px] font-bold text-primary tracking-tight">
            Scholar Rewards & Perks
          </h1>
          <p className="text-[15px] text-on-surface-variant max-w-xl mt-1">
            Exchange contribution points earned through milestone completion and peer problem solving for academic privileges and mentorship.
          </p>
        </div>

        {/* Balance Badge */}
        <div className="bg-surface-container-lowest border-2 border-tertiary-fixed-dim rounded-xl p-6 shadow-card shrink-0 flex items-center gap-5">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed/30 text-tertiary-fixed-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">stars</span>
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Available Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-[32px] font-bold text-tertiary-fixed-variant">
                {profile.totalPoints.toLocaleString()}
              </span>
              <span className="text-[13px] text-on-surface-variant font-medium">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 bg-secondary-container/20 border border-secondary text-secondary rounded-lg flex items-center gap-2 text-[13.5px] font-semibold animate-pulse">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* Rewards Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rewards.map((item) => {
          const canAfford = profile.totalPoints >= item.pointCost;
          const isRedeemed = item.redeemed;

          return (
            <div
              key={item.id}
              className={`bg-surface-container-lowest border rounded-xl p-6 sm:p-7 shadow-card flex flex-col justify-between transition-all ${
                isRedeemed
                  ? "border-secondary/40 bg-secondary/5 opacity-85"
                  : canAfford
                  ? "border-outline-variant hover:border-secondary"
                  : "border-outline-variant opacity-75"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary border border-outline-variant/60">
                    <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-surface-container text-on-surface-variant">
                      {item.category}
                    </span>
                    <span className="font-serif text-[15px] font-bold text-tertiary-fixed-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">stars</span>
                      {item.pointCost} pts
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-[19px] font-bold text-primary">{item.title}</h2>
                  <p className="text-[13px] text-on-surface-variant leading-relaxed mt-1.5 font-sans">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/50 mt-6 flex items-center justify-between">
                <span className="text-[12px] text-on-surface-variant">
                  {isRedeemed
                    ? "Active in Profile"
                    : canAfford
                    ? "Available to Redeem"
                    : `Need ${item.pointCost - profile.totalPoints} more pts`}
                </span>

                <button
                  onClick={() => handleRedeem(item.id, item.title)}
                  disabled={isRedeemed || !canAfford}
                  className={`px-5 py-2 rounded font-serif text-[13px] font-semibold transition-all flex items-center gap-1.5 shadow-sm ${
                    isRedeemed
                      ? "bg-surface-container text-secondary cursor-default"
                      : canAfford
                      ? "bg-secondary text-white hover:bg-secondary/90 active:scale-98"
                      : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                  }`}
                >
                  {isRedeemed ? (
                    <>
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Redeemed</span>
                    </>
                  ) : (
                    <>
                      <span>Redeem Perk</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Point History & Earning Table */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8 shadow-card space-y-4">
        <h3 className="font-serif text-[18px] font-bold text-primary">
          Point Accumulation Log
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-outline-variant text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">
                <th className="pb-3">Academic Activity</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Timestamp</th>
                <th className="pb-3 text-right">Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              <tr>
                <td className="py-3 font-medium text-on-surface">
                  Adaptive Milestone Exam (92% Mastery)
                </td>
                <td className="py-3 text-secondary">Milestone Exam</td>
                <td className="py-3 text-on-surface-variant">Today</td>
                <td className="py-3 font-bold text-secondary text-right">+250 pts</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-on-surface">
                  Verified Peer Solution on GradNorm Loss
                </td>
                <td className="py-3 text-secondary">Community Peer Review</td>
                <td className="py-3 text-on-surface-variant">Yesterday</td>
                <td className="py-3 font-bold text-secondary text-right">+35 pts</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-on-surface">
                  5-Day Consecutive Study Streak Bonus
                </td>
                <td className="py-3 text-tertiary-fixed-variant">Consistency Streak</td>
                <td className="py-3 text-on-surface-variant">Oct 24</td>
                <td className="py-3 font-bold text-secondary text-right">+50 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
