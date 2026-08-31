import {
  AssessmentQuestion,
  AssessmentResult,
  LearnerProfile,
  RoleMatch,
  RoadmapMilestone,
  LearningPersona,
} from "@/types/trailmark";
import {
  initialRoleMatches,
  initialRoadmapMilestones,
  adaptiveAssessmentQuestions,
  sampleAssessmentResult,
} from "./mockData";
import {
  profileApi,
  rolesApi,
  roadmapApi,
  assessmentApi,
  aiGuideApi,
} from "./apiClient";

export async function generateOnboardingResponse(
  userMessage: string,
  turnCount: number,
  personaHint?: LearningPersona
): Promise<{
  reply: string;
  suggestedOptions?: string[];
  isBlueprintReady?: boolean;
  detectedPersona?: LearningPersona;
}> {
  const apiRes = await profileApi.onboardingChat(userMessage, turnCount, personaHint);
  if (apiRes) {
    return apiRes;
  }

  // Fallback
  const lower = userMessage.toLowerCase();
  if (turnCount === 0 || lower.includes("machine learning") || lower.includes("pivot") || lower.includes("analytics")) {
    return {
      reply:
        "A rigorous transition, Eleanor. Given your analytical background in marketing data, we can leverage your strengths in statistical modeling and hypothesis testing. What is your preferred study intensity and weekly time commitment?",
      suggestedOptions: [
        "10-15 hrs/week (Deep & Thorough)",
        "5-8 hrs/week (Accelerated Core)",
        "20+ hrs/week (Full-Immersion Sprint)",
      ],
    };
  }

  if (turnCount === 1 || lower.includes("hrs") || lower.includes("week") || lower.includes("time")) {
    return {
      reply:
        "Excellent. How would you describe your preferred pedagogical mode? Do you prefer deriving principles from first principles with academic citations ('Digger Mode') or rapid executive synthesis with applied code ('Surface Mode')?",
      suggestedOptions: [
        "Digger Mode (Proofs, Citations, Deep Foundations)",
        "Surface Mode (High-Yield Syntheses, Practical Applications)",
      ],
    };
  }

  return {
    reply:
      "I have synthesized your background, timeline, and scholarly profile. I've formulated three calibrated role trajectories. Review the role recommendations to lock in your custom learning trail.",
    isBlueprintReady: true,
  };
}

export async function fetchRoleRecommendations(
  _profile?: LearnerProfile
): Promise<RoleMatch[]> {
  const apiRes = await rolesApi.getRecommendations();
  if (apiRes && apiRes.length > 0) {
    return apiRes;
  }
  return initialRoleMatches;
}

export async function generateRoadmapForRole(
  roleId: string,
  persona: "digger" | "surface" | "motivation" = "digger",
  weeklyHours?: number
): Promise<RoadmapMilestone[]> {
  const apiRes = await roadmapApi.generate(roleId, persona, weeklyHours);
  if (apiRes && apiRes.milestones) {
    return apiRes.milestones;
  }

  return initialRoadmapMilestones.map((ms) => ({
    ...ms,
    description:
      persona === "surface"
        ? ms.surfaceSummary?.join(" ") || ms.description
        : ms.description,
  }));
}

export async function fetchAssessmentQuestions(
  topic: string = "Deep Learning Fundamentals"
): Promise<AssessmentQuestion[]> {
  const apiRes = await assessmentApi.getQuestions(topic);
  if (apiRes && apiRes.length > 0) {
    return apiRes;
  }
  return adaptiveAssessmentQuestions;
}

export async function evaluateAssessmentSubmission(
  answers: Record<string, string>,
  timeSpentSeconds: number,
  topic: string = "Deep Learning Fundamentals"
): Promise<AssessmentResult> {
  const apiRes = await assessmentApi.submit(topic, answers, timeSpentSeconds);
  if (apiRes) {
    return apiRes;
  }

  let correctCount = 0;
  adaptiveAssessmentQuestions.forEach((q) => {
    if (answers[q.id] === q.correctOptionId) {
      correctCount++;
    }
  });

  const percentage = Math.round((correctCount / adaptiveAssessmentQuestions.length) * 100);

  return {
    ...sampleAssessmentResult,
    correctCount,
    totalQuestions: adaptiveAssessmentQuestions.length,
    scorePercentage: percentage,
    timeSpentMinutes: Math.max(1, Math.round(timeSpentSeconds / 60)),
    passed: percentage >= 70,
    awardedPoints: correctCount * 50,
  };
}

export async function askTrailGuideAssistant(
  prompt: string,
  context?: { topic?: string; mode?: LearningPersona; currentMilestone?: string }
): Promise<{
  reply: string;
  citations?: string[];
  suggestedFollowUps?: string[];
}> {
  const apiRes = await aiGuideApi.chat(prompt, context?.topic, context?.mode, context?.currentMilestone);
  if (apiRes) {
    return apiRes;
  }

  const lower = prompt.toLowerCase();

  if (lower.includes("activation") || lower.includes("relu") || lower.includes("vanishing")) {
    return {
      reply:
        "In deep networks, sigmoid activations saturate at $f'(x) \\approx 0$ when $|x|$ is large, causing early layer gradients to vanish exponentially through repeated multiplication. ReLU addresses this by providing a constant gradient of 1 for $x > 0$. However, beware the 'dying ReLU' problem if weights shift all inputs into negative territory; LeakyReLU or GELU are standard modern remedies.",
      citations: [
        "Glorot, X., & Bengio, Y. (2010). Understanding the difficulty of training deep feedforward neural networks.",
        "Hendrycks, D., & Gimpel, K. (2016). Gaussian Error Linear Units (GELUs).",
      ],
      suggestedFollowUps: [
        "How does SwiGLU differ from standard ReLU in Llama?",
        "Derive the gradient of GELU with respect to input x",
        "Show PyTorch code for custom activation layer",
      ],
    };
  }

  if (lower.includes("adamw") || lower.includes("optimizer") || lower.includes("weight decay")) {
    return {
      reply:
        "Standard Adam applies L2 weight regularization directly to the gradient $g_t$, which gets rescaled inversely by $\\sqrt{v_t}$. As a result, parameters with historically large gradients experience significantly less relative decay. AdamW decouples weight decay directly from the gradient update: $\\theta_{t+1} = \\theta_t - \\eta \\lambda \\theta_t - \\frac{\\eta}{\\sqrt{\\hat{v}_t} + \\epsilon} \\hat{m}_t$.",
      citations: [
        "Loshchilov, I., & Hutter, F. (2019). Decoupled Weight Decay Regularization. ICLR.",
      ],
      suggestedFollowUps: [
        "Why is AdamW preferred for Transformer pre-training?",
        "Compare Lion optimizer vs AdamW memory footprint",
      ],
    };
  }

  return {
    reply: `Analyzing context regarding **${context?.topic || "your current module"}** in **${context?.mode || "Digger"} Mode**.\n\nTo master this concept rigorously, we examine both the empirical benchmarks and the underlying tensor dynamics. What specific theorem or implementation detail would you like to dissect further?`,
    citations: [
      "Goodfellow et al. (2016). Deep Learning. MIT Press.",
    ],
    suggestedFollowUps: [
      "Explain the mathematical proof",
      "Show practical code implementation",
      "Give me a conceptual intuition summary",
    ],
  };
}
