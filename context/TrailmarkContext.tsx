"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
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
import {
  profileApi,
  rolesApi,
  roadmapApi,
  assessmentApi,
  communityApi,
  gamificationApi,
  certificatesApi,
  aiGuideApi,
} from "@/services/apiClient";

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
  const [roles, setRoles] = useState<RoleMatch[]>(initialRoleMatches);
  const [selectedRole, setSelectedRole] = useState<RoleMatch | null>(initialRoleMatches[0]);
  const [learningMode, setLearningModeState] = useState<LearningPersona>("digger");
  const [roadmap, setRoadmap] = useState<RoadmapMilestone[]>(initialRoadmapMilestones);
  const [isRoadmapApproved, setIsRoadmapApproved] = useState<boolean>(true);

  // Assessment
  const [assessmentQuestions, setAssessmentQuestions] = useState<AssessmentQuestion[]>(adaptiveAssessmentQuestions);
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
  const [certificate, setCertificate] = useState<CertificateData>(sampleCertificate);

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

  // Sync initial data from backend if available
  useEffect(() => {
    async function loadBackendData() {
      const [backendProfile, backendRoles, backendRoadmap, backendQuestions, backendPosts, backendRewards, backendLeaderboard, backendCert] =
        await Promise.all([
          profileApi.getMe(),
          rolesApi.getRecommendations(),
          roadmapApi.getCurrent(learningMode),
          assessmentApi.getQuestions(),
          communityApi.getPosts(),
          gamificationApi.getRewards(),
          gamificationApi.getLeaderboard(),
          certificatesApi.getMe(),
        ]);

      if (backendProfile) {
        setProfile(backendProfile);
        if (backendProfile.persona) {
          setLearningModeState(backendProfile.persona);
        }
      }
      if (backendRoles && backendRoles.length > 0) {
        setRoles(backendRoles);
        setSelectedRole(backendRoles[0]);
      }
      if (backendRoadmap && backendRoadmap.milestones) {
        setRoadmap(backendRoadmap.milestones);
        setIsRoadmapApproved(backendRoadmap.isApproved);
      }
      if (backendQuestions && backendQuestions.length > 0) {
        setAssessmentQuestions(backendQuestions);
      }
      if (backendPosts && backendPosts.length > 0) {
        setCommunityPosts(backendPosts);
      }
      if (backendRewards && backendRewards.length > 0) {
        setRewards(backendRewards);
      }
      if (backendLeaderboard && backendLeaderboard.length > 0) {
        setLeaderboard(backendLeaderboard);
      }
      if (backendCert) {
        setCertificate(backendCert);
      }
    }
    loadBackendData();
  }, []);

  const updateProfile = useCallback((updates: Partial<LearnerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    profileApi.updateMe(updates).catch(() => {});
  }, []);

  const selectRole = (roleId: string) => {
    const found = roles.find((r) => r.id === roleId) || roles[0];
    setSelectedRole(found);
    updateProfile({ targetRole: found.title });
    // Trigger roadmap generation on backend
    roadmapApi.generate(roleId, learningMode).then((res) => {
      if (res && res.milestones) {
        setRoadmap(res.milestones);
      }
    }).catch(() => {});
  };

  const setLearningMode = (mode: LearningPersona) => {
    setLearningModeState(mode);
    updateProfile({ persona: mode });
    // Refresh roadmap adapted for this mode
    roadmapApi.getCurrent(mode).then((res) => {
      if (res && res.milestones) {
        setRoadmap(res.milestones);
      }
    }).catch(() => {});
  };

  const approveRoadmap = () => {
    setIsRoadmapApproved(true);
    roadmapApi.approve().catch(() => {});
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
    roadmapApi.toggleModule(moduleId).then((res) => {
      if (res && res.updatedTotalPoints) {
        setProfile((prev) => ({ ...prev, totalPoints: res.updatedTotalPoints }));
      }
    }).catch(() => {});
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

  const submitAssessment = async () => {
    const topic = "Deep Learning Fundamentals";
    const res = await assessmentApi.submit(topic, selectedAnswers, 240);
    if (res) {
      setAssessmentResult(res);
      setProfile((prev) => ({ ...prev, totalPoints: prev.totalPoints + res.awardedPoints }));
      return;
    }

    // Local fallback
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
    communityApi.upvotePost(postId).catch(() => {});
  };

  const addPost = async (title: string, content: string, domainTag: string, codeSnippet?: string) => {
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

    const serverPost = await communityApi.createPost(title, content, domainTag, codeSnippet);
    if (serverPost) {
      setCommunityPosts((prev) => [serverPost, ...prev.filter((p) => p.id !== newPost.id)]);
    }
  };

  const addAnswer = async (postId: string, content: string) => {
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
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          repliesCount: p.repliesCount + 1,
          answers: [...(p.answers || []), newAns],
        };
      })
    );
    updateProfile({ totalPoints: profile.totalPoints + 35 });
    communityApi.addAnswer(postId, content).catch(() => {});
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
    gamificationApi.redeem(rewardId).catch(() => {});
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

    const apiRes = await aiGuideApi.chat(text, "Deep Learning Fundamentals", learningMode);
    if (apiRes) {
      const guideMsg = {
        id: `msg-${Date.now() + 1}`,
        sender: "guide" as const,
        text: apiRes.reply,
        citations: apiRes.citations,
        timestamp: "Just now",
      };
      setAiGuideMessages((prev) => [...prev, guideMsg]);
      return;
    }

    // Fallback simulation
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
