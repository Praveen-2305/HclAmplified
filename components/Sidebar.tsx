"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTrailmark } from "@/context/TrailmarkContext";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { profile, toggleAiGuide } = useTrailmark();

  // Standard core navigation destinations matching Google Stitch design source
  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "space_dashboard" },
    { href: "/roadmap", label: "Roadmap", icon: "route" },
    { href: "/assessment", label: "Assessments", icon: "quiz" },
    { href: "/community", label: "Community", icon: "groups" },
    { href: "/rewards", label: "Rewards", icon: "workspace_premium" },
  ];

  return (
    <aside className="bg-primary-container text-on-primary w-[280px] h-full flex flex-col justify-between p-6 z-40 border-r border-primary-container select-none">
      {/* Top Brand Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-secondary-fixed rounded-md p-1"
          >
            <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 border border-white/10 flex items-center justify-center text-secondary-fixed group-hover:bg-secondary-fixed group-hover:text-primary-container transition-all">
              <span className="material-symbols-outlined text-[24px]">route</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-[20px] font-semibold text-white tracking-tight leading-none">
                Trailmark
              </h1>
              <p className="font-label-md text-[11px] text-on-primary-container mt-1 uppercase tracking-wider">
                Learning Trail
              </p>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-on-primary-container hover:text-white p-1 rounded-md"
              aria-label="Close sidebar"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>

        {/* Primary Action CTA */}
        <Link
          href="/onboarding"
          onClick={onCloseMobile}
          className="w-full py-2.5 px-4 rounded-lg bg-secondary text-white font-label-md text-[13px] flex items-center justify-center gap-2 mb-8 hover:bg-secondary/90 active:scale-[0.98] transition-all shadow-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Goal</span>
        </Link>

        {/* Standard Core Nav Links */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/roadmap" && pathname.startsWith("/recommendations")) ||
              (item.href === "/assessment" && pathname.startsWith("/assessment")) ||
              (item.href === "/community" && (pathname.startsWith("/study-groups") || pathname.startsWith("/discussions") || pathname.startsWith("/leader-dashboard")));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-[14px] transition-all font-medium ${
                  isActive
                    ? "bg-secondary text-white font-semibold shadow-sm"
                    : "text-on-primary-container hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? "text-white" : "text-on-primary-container"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.href === "/roadmap" && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed pulse-ring" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Navigation & Profile */}
      <div className="space-y-4 pt-6 border-t border-white/10 mt-auto">
        {/* Quick Utilities */}
        <div className="space-y-1">
          <button
            onClick={() => {
              toggleAiGuide(true);
              onCloseMobile?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-primary-container hover:text-white hover:bg-white/5 rounded-lg text-[13px] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            <span>AI Assistant</span>
          </button>
          <Link
            href="/leaderboard"
            onClick={onCloseMobile}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-primary-container hover:text-white hover:bg-white/5 rounded-lg text-[13px] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">military_tech</span>
            <span>Leaderboard</span>
          </Link>
        </div>

        {/* Scholar Profile Card */}
        <Link
          href="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group border border-white/5 bg-white/[0.02]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-9 h-9 rounded-full object-cover border border-secondary-fixed/40"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-white truncate group-hover:text-secondary-fixed transition-colors">
                {profile.name}
              </p>
              <span className="text-[11px] text-tertiary-fixed font-medium flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                {profile.streakDays}d
              </span>
            </div>
            <p className="text-[11px] text-on-primary-container truncate">{profile.scholarLevel}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
