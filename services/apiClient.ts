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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    if (!res.ok) {
      console.warn(`API request to ${endpoint} returned status ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    // Graceful offline fallback
    console.warn(`Backend unreachable at ${API_BASE_URL}${endpoint}. Using local simulated state.`);
    return null;
  }
}

export const profileApi = {
  getMe: async (): Promise<LearnerProfile | null> => {
    return request<LearnerProfile>("/profile/me");
  },
  updateMe: async (updates: Partial<LearnerProfile>): Promise<LearnerProfile | null> => {
    return request<LearnerProfile>("/profile/me", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },
  onboardingChat: async (userMessage: string, turnCount: number, personaHint?: LearningPersona) => {
    return request<{ reply: string; suggestedOptions?: string[]; isBlueprintReady?: boolean; detectedPersona?: LearningPersona }>(
      "/profile/onboarding/chat",
      {
        method: "POST",
        body: JSON.stringify({ userMessage, turnCount, personaHint }),
      }
    );
  },
  uploadResume: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/profile/upload-resume`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};

export const rolesApi = {
  getRecommendations: async (): Promise<RoleMatch[] | null> => {
    return request<RoleMatch[]>("/roles/recommendations");
  },
  getById: async (roleId: string): Promise<RoleMatch | null> => {
    return request<RoleMatch>(`/roles/${roleId}`);
  },
  customMatch: async (customTitle: string, backgroundDescription?: string): Promise<RoleMatch | null> => {
    return request<RoleMatch>("/roles/custom-match", {
      method: "POST",
      body: JSON.stringify({ customTitle, backgroundDescription }),
    });
  },
};

export interface RoadmapApiResponse {
  roadmapId: string;
  roleId: string;
  roleTitle: string;
  isApproved: boolean;
  milestones: RoadmapMilestone[];
}

export const roadmapApi = {
  getCurrent: async (mode?: LearningPersona): Promise<RoadmapApiResponse | null> => {
    const q = mode ? `?mode=${mode}` : "";
    return request<RoadmapApiResponse>(`/roadmaps/current${q}`);
  },
  generate: async (roleId: string, persona: LearningPersona = "digger", weeklyHours?: number): Promise<RoadmapApiResponse | null> => {
    return request<RoadmapApiResponse>("/roadmaps/generate", {
      method: "POST",
      body: JSON.stringify({ roleId, persona, weeklyHours }),
    });
  },
  approve: async () => {
    return request<{ success: boolean; message: string }>("/roadmaps/approve", { method: "POST" });
  },
  toggleModule: async (moduleId: string) => {
    return request<{ milestoneId: string; moduleId: string; completed: boolean; allMilestoneCompleted: boolean; updatedTotalPoints: number }>(
      `/roadmaps/modules/${moduleId}/toggle`,
      { method: "PATCH" }
    );
  },
  skipMilestone: async (milestoneId: string) => {
    return request(`/roadmaps/milestones/${milestoneId}/skip`, { method: "POST" });
  },
};

export const assessmentApi = {
  getQuestions: async (topic: string = "Deep Learning Fundamentals"): Promise<AssessmentQuestion[] | null> => {
    return request<AssessmentQuestion[]>(`/assessments/questions?topic=${encodeURIComponent(topic)}`);
  },
  submit: async (topic: string, answers: Record<string, string>, timeSpentSeconds: number): Promise<AssessmentResult | null> => {
    return request<AssessmentResult>("/assessments/submit", {
      method: "POST",
      body: JSON.stringify({ topic, answers, timeSpentSeconds }),
    });
  },
  getWeakPoints: async () => {
    return request("/assessments/weak-points");
  },
  getPartnerLabs: async () => {
    return request("/assessments/partner-labs");
  },
  bookLabSlot: async (slotId: string, domain: string) => {
    return request("/assessments/book-lab-slot", {
      method: "POST",
      body: JSON.stringify({ slotId, domain }),
    });
  },
};

export const aiGuideApi = {
  chat: async (prompt: string, topic?: string, mode?: LearningPersona, currentMilestone?: string) => {
    return request<{ reply: string; citations?: string[]; suggestedFollowUps?: string[] }>(
      "/ai-guide/chat",
      {
        method: "POST",
        body: JSON.stringify({ prompt, topic, mode, currentMilestone }),
      }
    );
  },
  explainStep: async (milestoneId: string, moduleId?: string, targetRole: string = "AI Engineer") => {
    return request<{ reply: string; citations?: string[]; suggestedFollowUps?: string[] }>(
      "/ai-guide/explain-step",
      {
        method: "POST",
        body: JSON.stringify({ milestoneId, moduleId, targetRole }),
      }
    );
  },
};

export const communityApi = {
  getPosts: async (domain?: string): Promise<CommunityPost[] | null> => {
    const q = domain ? `?domain=${encodeURIComponent(domain)}` : "";
    return request<CommunityPost[]>(`/community/posts${q}`);
  },
  createPost: async (title: string, content: string, domainTag: string, codeSnippet?: string, tags?: string[]): Promise<CommunityPost | null> => {
    return request<CommunityPost>("/community/posts", {
      method: "POST",
      body: JSON.stringify({ title, content, domainTag, codeSnippet, tags }),
    });
  },
  upvotePost: async (postId: string) => {
    return request(`/community/posts/${postId}/upvote`, { method: "POST" });
  },
  addAnswer: async (postId: string, content: string) => {
    return request(`/community/posts/${postId}/answers`, {
      method: "POST",
      body: JSON.stringify({ content }),
    });
  },
  getStudyGroups: async () => {
    return request("/community/study-groups");
  },
};

export const gamificationApi = {
  getRewards: async (): Promise<RewardItem[] | null> => {
    return request<RewardItem[]>("/gamification/rewards");
  },
  redeem: async (rewardId: string) => {
    return request<{ success: boolean; rewardId: string; remainingPoints: number; message: string }>(
      `/gamification/rewards/${rewardId}/redeem`,
      { method: "POST" }
    );
  },
  getLeaderboard: async (domain?: string): Promise<LeaderboardEntry[] | null> => {
    const q = domain ? `?domain=${encodeURIComponent(domain)}` : "";
    return request<LeaderboardEntry[]>(`/gamification/leaderboard${q}`);
  },
};

export const certificatesApi = {
  getMe: async (): Promise<CertificateData | null> => {
    return request<CertificateData>("/certificates/me");
  },
  verify: async (hash: string) => {
    return request<{ isValid: boolean; certificate?: CertificateData }>(`/certificates/verify/${hash}`);
  },
};

export const analyticsApi = {
  getCohort: async () => {
    return request("/analytics/cohort");
  },
};
