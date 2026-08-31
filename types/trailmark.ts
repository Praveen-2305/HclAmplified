export type LearningPersona = "digger" | "surface" | "motivation";

export interface SkillMatch {
  name: string;
  matchScore: number;
  status: "strong" | "gap" | "emerging";
}

export interface LearnerProfile {
  id: string;
  name: string;
  avatar: string;
  currentRole: string;
  targetRole: string;
  targetTimelineMonths: number;
  persona: LearningPersona;
  scholarLevel: string;
  joinedDate: string;
  totalPoints: number;
  streakDays: number;
  completedMilestoneIds: string[];
  currentModuleId: string;
  weeklyGoalHours: number;
  hoursCompletedThisWeek: number;
  bio?: string;
}

export interface RoleMatch {
  id: string;
  title: string;
  matchPercentage: number;
  salaryRange: string;
  tag?: "Top Match" | "High Growth" | "Strategic Pivot";
  summary: string;
  alignmentReason: string;
  skills: SkillMatch[];
  milestonesCount: number;
  estTimeToMastery: string;
  primaryDomain: string;
}

export interface SyllabusModule {
  id: string;
  title: string;
  type: "concept" | "assessment" | "lab" | "project";
  duration: string;
  completed: boolean;
  diggerNotes?: string;
  citations?: string[];
}

export interface RoadmapMilestone {
  id: string;
  number: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "locked";
  completedDate?: string;
  estimatedHours: number;
  badgeTitle?: string;
  modules: SyllabusModule[];
  diggerDeepDive?: {
    readingList: string[];
    academicPapers: string[];
    theoreticalFoundation: string;
  };
  surfaceSummary?: string[];
}

export interface AssessmentQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  prompt: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
  citation: string;
  conceptTag: string;
}

export interface AssessmentResult {
  id: string;
  topic: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentMinutes: number;
  speedComparison: string;
  passed: boolean;
  strengths: string[];
  areasForRefinement: string[];
  trailGuideNote: string;
  certificationEligible: boolean;
  awardedPoints: number;
}

export interface HelpfulAnswer {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    badge?: string;
  };
  timestamp: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
}

export interface CommunityPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    scholarLevel?: string;
  };
  timestamp: string;
  domainTag: string;
  title: string;
  content: string;
  codeSnippet?: string;
  upvotes: number;
  repliesCount: number;
  isHelpfulAnswered?: boolean;
  answers?: HelpfulAnswer[];
  tags: string[];
}

export interface RewardItem {
  id: string;
  title: string;
  category: "Recognition" | "Mentorship" | "Resource" | "Badge";
  pointCost: number;
  icon: string;
  description: string;
  available: boolean;
  redeemed?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  domain: string;
  points: number;
  streakDays: number;
  badge: string;
  isCurrentUser?: boolean;
  change?: "up" | "down" | "same";
}

export interface CertificateData {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientTitle: string;
  pathTitle: string;
  completionDate: string;
  grade: string;
  verifiedCompetencies: string[];
  issuer: string;
  verificationHash: string;
  honorsDistinction?: string;
}

export interface OnboardingChatTurn {
  id: string;
  sender: "guide" | "user";
  message: string;
  timestamp: string;
  options?: string[];
  isBlueprintPreview?: boolean;
}
