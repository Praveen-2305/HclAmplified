"use client";

import React, { useState } from "react";
import { useTrailmark } from "@/context/TrailmarkContext";

export default function CommunityFeedPage() {
  const { profile, communityPosts, upvotePost, addPost, addAnswer } = useTrailmark();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDomain, setNewDomain] = useState("AI_Engineering");
  const [newCode, setNewCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);

  // Active reply open state
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addPost(newTitle, newContent, newDomain, newCode.trim() || undefined);
    setNewTitle("");
    setNewContent("");
    setNewCode("");
    setShowCodeInput(false);
    setIsComposerOpen(false);
  };

  const handleSendAnswer = (postId: string) => {
    if (!replyContent.trim()) return;
    addAnswer(postId, replyContent);
    setReplyContent("");
    setReplyOpenId(null);
  };

  const filteredPosts = communityPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.domainTag.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === "All") return true;
    if (activeFilter === "Verified") return post.isHelpfulAnswered;
    return post.domainTag === activeFilter;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search discussions, derivations, code implementations, or tags..."
          className="w-full pl-12 pr-4 py-3.5 rounded-full bg-surface-container-lowest border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-[14px] text-on-surface shadow-xs outline-none placeholder:text-on-surface-variant/60"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header & Filter Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-[26px] sm:text-[30px] font-bold text-primary">
                Community Discussion Feed
              </h1>
              <p className="text-[13.5px] text-on-surface-variant">
                Collaborative problem solving and peer derivations across Study Pods
              </p>
            </div>

            <button
              onClick={() => setIsComposerOpen(!isComposerOpen)}
              className="px-5 py-2.5 bg-secondary text-white font-serif text-[13.5px] font-semibold rounded hover:bg-secondary/90 shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isComposerOpen ? "close" : "edit_square"}
              </span>
              <span>{isComposerOpen ? "Cancel Post" : "Start Discussion"}</span>
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["All", "Verified", "AI_Engineering", "Production_ML", "Mathematics"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all shrink-0 ${
                  activeFilter === f
                    ? "bg-secondary text-white shadow-xs font-semibold"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {f === "Verified" ? "Verified Solutions" : f === "All" ? "All Threads" : `#${f}`}
              </button>
            ))}
          </div>

          {/* New Post Composer Card */}
          {isComposerOpen && (
            <form
              onSubmit={handleCreatePost}
              className="bg-surface-container-lowest border-2 border-secondary rounded-xl p-6 shadow-card space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-[16px] font-bold text-primary">
                  Start an Academic Discussion
                </h3>
                <span className="text-[11.5px] text-secondary font-semibold">
                  +20 Scholar Points on Publish
                </span>
              </div>

              <div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Thread title or research query..."
                  className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary rounded p-3 text-[14px] text-on-surface outline-none"
                  required
                />
              </div>

              <div>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explain the theoretical context, problem formulation, or where gradients are stalling..."
                  rows={3}
                  className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary rounded p-3 text-[13.5px] text-on-surface outline-none resize-none"
                  required
                />
              </div>

              {/* Optional Code Snippet Toggle */}
              {showCodeInput ? (
                <div>
                  <textarea
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Paste PyTorch / NumPy code or mathematical derivation..."
                    rows={4}
                    className="w-full bg-primary-container text-white font-mono text-[12.5px] p-3 rounded outline-none border border-white/10"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCodeInput(true)}
                  className="text-[12px] text-secondary flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">code</span>
                  <span>Attach Code / Equation Snippet</span>
                </button>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-[12px]">
                  <span className="text-on-surface-variant font-medium">Domain:</span>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="bg-surface-container border border-outline-variant rounded px-2.5 py-1 text-on-surface outline-none font-medium"
                  >
                    <option value="AI_Engineering">#AI_Engineering</option>
                    <option value="Production_ML">#Production_ML</option>
                    <option value="Mathematics">#Mathematics</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposerOpen(false)}
                    className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded text-[13px] hover:text-primary font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-secondary text-white rounded font-serif text-[13px] font-semibold hover:bg-secondary/90 shadow-sm"
                  >
                    Publish Thread
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Posts Feed List */}
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-7 shadow-card space-y-4 hover:border-secondary/60 transition-all"
              >
                {/* Author Info & Timestamp */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-[15px] font-bold text-primary">
                          {post.author.name}
                        </span>
                        {post.author.scholarLevel && (
                          <span className="text-[11px] text-tertiary-fixed-variant bg-tertiary-fixed/25 px-2 py-0.2 rounded font-medium">
                            {post.author.scholarLevel}
                          </span>
                        )}
                      </div>
                      <span className="text-[11.5px] text-on-surface-variant">
                        {post.timestamp} • {post.author.role}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-surface-container text-secondary">
                    #{post.domainTag}
                  </span>
                </div>

                {/* Title & Body */}
                <div className="space-y-2">
                  <h3 className="font-serif text-[18px] font-bold text-primary leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-[13.5px] text-on-surface leading-relaxed font-sans">
                    {post.content}
                  </p>
                </div>

                {/* Code Snippet */}
                {post.codeSnippet && (
                  <div className="bg-primary-container text-white p-4 rounded-lg font-mono text-[12.5px] overflow-x-auto border border-white/10 shadow-xs">
                    <pre>{post.codeSnippet}</pre>
                  </div>
                )}

                {/* Accepted Helpful Answers Breakdown */}
                {post.answers && post.answers.length > 0 && (
                  <div className="pt-2 space-y-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Accepted Peer Solution
                    </span>
                    {post.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className="bg-secondary/5 border-l-4 border-secondary p-4 rounded-r-lg space-y-2"
                      >
                        <div className="flex items-center justify-between text-[12px]">
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={ans.author.avatar}
                              alt={ans.author.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-semibold text-primary">{ans.author.name}</span>
                            <span className="text-secondary font-medium">• {ans.author.badge}</span>
                          </div>
                          <span className="text-on-surface-variant text-[11px]">{ans.timestamp}</span>
                        </div>
                        <p className="text-[13px] text-on-surface leading-relaxed">{ans.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Post Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-outline-variant/60 text-[12.5px]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => upvotePost(post.id)}
                      className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                      <span>{post.upvotes} Helpful</span>
                    </button>

                    <button
                      onClick={() => setReplyOpenId(replyOpenId === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary font-medium transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">reply</span>
                      <span>{post.repliesCount} Responses</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setReplyOpenId(post.id)}
                    className="text-secondary font-semibold hover:underline"
                  >
                    Reply to Thread
                  </button>
                </div>

                {/* Inline Reply Form */}
                {replyOpenId === post.id && (
                  <div className="pt-3 border-t border-outline-variant/50 space-y-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Write your mathematical derivation or solution..."
                      rows={2}
                      className="w-full bg-surface-container-low border border-outline-variant focus:border-secondary rounded p-3 text-[13px] text-on-surface outline-none resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyOpenId(null)}
                        className="px-3 py-1.5 text-[12px] text-on-surface-variant hover:text-primary"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendAnswer(post.id)}
                        className="px-4 py-1.5 bg-secondary text-white rounded text-[12px] font-semibold hover:bg-secondary/90"
                      >
                        Submit Response (+35 pts)
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Active Pods & Leaderboard (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Study Group Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Assigned Study Pod
              </span>
              <span className="w-2 h-2 rounded-full bg-secondary pulse-ring" />
            </div>
            <div>
              <h3 className="font-serif text-[18px] font-bold text-primary">
                Deep Learning Fundamentals
              </h3>
              <p className="text-[12.5px] text-on-surface-variant mt-1 leading-snug">
                Cohort Alpha • 45 Active Scholars analyzing neural backpropagation and transformer dynamics.
              </p>
            </div>

            <div className="pt-2 border-t border-outline-variant/50 space-y-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Lead Facilitator:</span>
                <span className="font-semibold text-primary">Dr. Sanjay Patel</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Weekly Sync:</span>
                <span className="font-medium text-on-surface">Thursdays @ 18:00 UTC</span>
              </div>
            </div>
          </div>

          {/* Academic Community Guidelines */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-card space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-secondary text-[20px]">
                policy
              </span>
              <h3 className="font-serif text-[16px] font-bold">Scholarly Standards</h3>
            </div>
            <ul className="space-y-2 text-[12px] text-on-surface-variant">
              <li className="flex items-start gap-2">
                <span className="text-secondary font-bold">•</span>
                <span>Include formal academic citations for non-trivial claims.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary font-bold">•</span>
                <span>Attach reproducible Python snippets when debugging loss functions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary font-bold">•</span>
                <span>Earn +35 contribution points for verified peer reviews.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
