"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LearnerProfile,
  RoleMatch,
  RoadmapMilestone,
  AssessmentQuestion,
  AssessmentResult,
  CommunityPost,
  RewardItem,
  LeaderboardEntry,
  CertificateData,
  LearningPersona,
} from "@/types/trailmark";
import {
  initialLearnerProfile,
  initialRoleMatches,
  initialRoadmapMilestones,
  adaptiveAssessmentQuestions,
  sampleAssessmentResult,
  initialCommunityPosts,
  initialRewardItems,
  initialLeaderboardEntries,
  sampleCertificate,
} from "@/services/mockData";

interface TrailmarkContextType {
  profile: LearnerProfile;
  setProfile: React.Dispatch<React.SetStateAction<LearnerProfile>>;
  updateProfile: (updates: Partial<LearnerProfile>) => void;
  roles: RoleMatch[];
  selectedRole: RoleMatch | null;
  selectRole: (roleId: string) => void;
  learningMode: LearningPersona;
  setLearningMode: (mode: LearningPersona) => void;
  roadmap: RoadmapMilestone[];
  isRoadmapApproved: boolean;
  approveRoadmap: () => void;
  toggleModuleCompletion: (milestoneId: string, moduleId: string) => void;
  
  // Assessment
  assessmentQuestions: AssessmentQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  selectAnswer: (questionId: string, optionId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  assessmentResult: AssessmentResult | null;
  submitAssessment: () => void;
  resetAssessment: () => void;

  // Community
  communityPosts: CommunityPost[];
  upvotePost: (postId: string) => void;
  addPost: (title: string, content: string, domainTag: string, codeSnippet?: string) => void;
  addAnswer: (postId: string, content: string) => void;

  // Rewards
  rewards: RewardItem[];
  redeemReward: (rewardId: string) => boolean;

  // Leaderboard
  leaderboard: LeaderboardEntry[];

  // Certificate
  certificate: CertificateData;

  // Persistent Trail Guide AI Drawer
  isAiGuideOpen: boolean;
  toggleAiGuide: (open?: boolean) => void;
  aiGuideMessages: Array<{
    id: string;
    sender: "guide" | "user";
    text: string;
    citations?: string[];
    timestamp: string;
  }>;
  sendAiGuideMessage: (text: string) => Promise<void>;
}

const TrailmarkContext = createContext<TrailmarkContextType | undefined>(undefined);

export function TrailmarkProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<LearnerProfile>(initialLearnerProfile);
  const [roles] = useState<RoleMatch[]>(initialRoleMatches);
  const [selectedRole, setSelectedRole] = useState<RoleMatch | null>(initialRoleMatches[0]);
  const [learningMode, setLearningModeState] = useState<LearningPersona>("digger");
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>(initialRoadmapMilestones);
  const [isRoadmapApproved, setIsRoadmapApproved] = useState<boolean>(true);

  // Assessment
  const [assessmentQuestions] = useState<AssessmentQuestion[]>(adaptiveAssessmentQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({
    "q-01": "opt-3", // default answered to show realistic feedback screen
  });
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(sampleAssessmentResult);

  // Community
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(initialCommunityPosts);

  // Rewards
  const [rewards, setRewards] = useState<RewardItem[]>(initialRewardItems);

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(initialLeaderboardEntries);

  // Certificate
  const [certificate] = useState<CertificateData>(sampleCertificate);

  // Trail Guide Drawer
  const [isAiGuideOpen, setIsAiGuideOpen] = useState<boolean>(false);
  const [aiGuideMessages, setAiGuideMessages] = useState<
    Array<{
      id: string;
      sender: "guide" | "user";
      text: string;
      citations?: string[];
      timestamp: string;
    }>
  >([
    {
      id: "msg-01",
      sender: "guide",
      text: "Welcome back, Eleanor. I'm actively analyzing Deep Learning Fundamentals in Digger Mode. In our last session, we discussed backpropagation across computational graphs. How can I assist your mathematical derivation today?",
      citations: ["Goodfellow et al. (2016). Deep Learning. MIT Press."],
      timestamp: "Just now",
    },
  ]);

  const updateProfile = (updates: Partial<LearnerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const selectRole = (roleId: string) => {
    const found = roles.find((r) => r.id === roleId) || roles[0];
    setSelectedRole(found);
    updateProfile({ targetRole: found.title });
  };

  const setLearningMode = (mode: LearningPersona) => {
    setLearningModeState(mode);
    updateProfile({ persona: mode });
  };

  const approveRoadmap = () => {
    setIsRoadmapApproved(true);
  };

  const toggleModuleCompletion = (milestoneId: string, moduleId: string) => {
    setRoadmap((prev) =>
      prev.map((ms) => {
        if (ms.id !== milestoneId) return ms;
        const updatedModules = ms.modules.map((mod) =>
          mod.id === moduleId ? { ...mod, completed: !mod.completed } : mod
        );
        return { ...ms, modules: updatedModules };
      })
    );
  };

  const selectAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const submitAssessment = () => {
    let correct = 0;
    assessmentQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correct++;
      }
    });
    const percentage = Math.round((correct / assessmentQuestions.length) * 100);
    const result: AssessmentResult = {
      ...sampleAssessmentResult,
      correctCount: correct,
      totalQuestions: assessmentQuestions.length,
      scorePercentage: percentage,
      passed: percentage >= 70,
      awardedPoints: correct * 50,
    };
    setAssessmentResult(result);
    // Add awarded points to profile
    updateProfile({ totalPoints: profile.totalPoints + result.awardedPoints });
  };

  const resetAssessment = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setAssessmentResult(null);
  };

  const upvotePost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
  };

  const addPost = (title: string, content: string, domainTag: string, codeSnippet?: string) => {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        name: profile.name,
        avatar: profile.avatar,
        role: profile.targetRole || "Scholar",
        scholarLevel: profile.scholarLevel,
      },
      timestamp: "Just now",
      domainTag,
      title,
      content,
      codeSnippet,
      upvotes: 1,
      repliesCount: 0,
      tags: [domainTag],
    };
    setCommunityPosts((prev) => [newPost, ...prev]);
    updateProfile({ totalPoints: profile.totalPoints + 20 });
  };

  const addAnswer = (postId: string, content: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newAns = {
          id: `ans-${Date.now()}`,
          author: {
            name: profile.name,
            avatar: profile.avatar,
            role: profile.targetRole,
            badge: "Peer Reviewer",
          },
          timestamp: "Just now",
          content,
          upvotes: 1,
          isAccepted: false,
        };
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          answers: [...(p.answers || []), newAns],
        };
      })
    );
    updateProfile({ totalPoints: profile.totalPoints + 35 });
  };

  const redeemReward = (rewardId: string): boolean => {
    const item = rewards.find((r) => r.id === rewardId);
    if (!item || item.redeemed || profile.totalPoints < item.pointCost) {
      return false;
    }
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, redeemed: true } : r))
    );
    updateProfile({ totalPoints: profile.totalPoints - item.pointCost });
    return true;
  };

  const toggleAiGuide = (open?: boolean) => {
    setIsAiGuideOpen((prev) => (open !== undefined ? open : !prev));
  };

  const sendAiGuideMessage = async (text: string) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: "user" as const,
      text,
      timestamp: "Just now",
    };
    setAiGuideMessages((prev) => [...prev, userMsg]);

    // Simulate AI response
    setTimeout(() => {
      const guideMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "guide" as const,
        text: `Analysis in **${learningMode === "digger" ? "Digger Mode (Rigorous)" : "Surface Mode"}**:\n\nRegarding *"${text}"*, the mathematical foundation centers on gradient descent trajectories in high-dimensional non-convex manifolds. Ensuring numerical stability during matrix multiplications prevents underflow in attention scores.`,
        citations: [
          "Goodfellow et al. — Deep Learning (2016)",
          "Vaswani et al. — Attention Is All You Need (2017)",
        ],
        timestamp: "Just now",
      };
      setAiGuideMessages((prev) => [...prev, guideMsg]);
    }, 800);
  };

  return (
    <TrailmarkContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        roles,
        selectedRole,
        selectRole,
        learningMode,
        setLearningMode,
        roadmap,
        isRoadmapApproved,
        approveRoadmap,
        toggleModuleCompletion,
        assessmentQuestions,
        currentQuestionIndex,
        selectedAnswers,
        selectAnswer,
        nextQuestion,
        prevQuestion,
        assessmentResult,
        submitAssessment,
        resetAssessment,
        communityPosts,
        upvotePost,
        addPost,
        addAnswer,
        rewards,
        redeemReward,
        leaderboard,
        certificate,
        isAiGuideOpen,
        toggleAiGuide,
        aiGuideMessages,
        sendAiGuideMessage,
      }}
    >
      {children}
    </TrailmarkContext.Provider>
  );
}

export function useTrailmark() {
  const context = useContext(TrailmarkContext);
  if (!context) {
    throw new Error("useTrailmark must be used within a TrailmarkProvider");
  }
  return context;
}
