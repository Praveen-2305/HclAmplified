from typing import List, Optional, Literal, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

# ==========================================
# 1. Profile & Persona Schemas
# ==========================================
LearningPersona = Literal["digger", "surface", "motivation"]

class SkillMatchSchema(BaseModel):
    name: str = Field(alias="name", default="")
    matchScore: int
    status: Literal["strong", "gap", "emerging"]

    class Config:
        populate_by_name = True


class PersonaScoresSchema(BaseModel):
    digger_weight: float
    surface_weight: float
    motivation_weight: float
    last_recalibrated_at: Optional[datetime] = None


class LearnerProfileSchema(BaseModel):
    id: str
    name: str
    avatar: str
    currentRole: str
    targetRole: str
    targetTimelineMonths: int
    persona: LearningPersona
    scholarLevel: str
    joinedDate: str
    totalPoints: int
    streakDays: int
    freezeDaysAvailable: Optional[int] = 2
    completedMilestoneIds: List[str] = []
    currentModuleId: str
    weeklyGoalHours: float
    hoursCompletedThisWeek: float
    bio: Optional[str] = ""
    preferredLanguage: Optional[str] = "English"

    class Config:
        populate_by_name = True


class LearnerProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    targetRole: Optional[str] = None
    targetTimelineMonths: Optional[int] = None
    persona: Optional[LearningPersona] = None
    scholarLevel: Optional[str] = None
    weeklyGoalHours: Optional[float] = None
    bio: Optional[str] = None
    preferredLanguage: Optional[str] = None
    totalPoints: Optional[int] = None
    streakDays: Optional[int] = None


class OnboardingChatRequest(BaseModel):
    userMessage: str
    turnCount: int = 0
    personaHint: Optional[LearningPersona] = None


class OnboardingChatResponse(BaseModel):
    reply: str
    suggestedOptions: Optional[List[str]] = None
    isBlueprintReady: Optional[bool] = False
    detectedPersona: Optional[LearningPersona] = None


class ResumeUploadResponse(BaseModel):
    success: bool
    filename: str
    extractedSkills: List[str]
    detectedYearsExperience: float
    summary: str
    profileBioSuggestion: str


# ==========================================
# 2. Roles & Recommendations
# ==========================================
class RoleMatchSchema(BaseModel):
    id: str
    title: str
    matchPercentage: int
    salaryRange: str
    tag: Optional[Literal["Top Match", "High Growth", "Strategic Pivot"]] = None
    summary: str
    alignmentReason: str
    skills: List[SkillMatchSchema]
    milestonesCount: int
    estTimeToMastery: str
    primaryDomain: str
    marketDemand: Optional[str] = "High"


class CustomRoleRequest(BaseModel):
    customTitle: str
    backgroundDescription: Optional[str] = ""


# ==========================================
# 3. Roadmap & Curriculum
# ==========================================
class SyllabusModuleSchema(BaseModel):
    id: str
    title: str
    type: Literal["concept", "assessment", "lab", "project"]
    duration: str
    completed: bool
    diggerNotes: Optional[str] = None
    citations: Optional[List[str]] = None
    rubric: Optional[Dict[str, Any]] = None


class DiggerDeepDiveSchema(BaseModel):
    readingList: List[str] = []
    academicPapers: List[str] = []
    theoreticalFoundation: str = ""


class RoadmapMilestoneSchema(BaseModel):
    id: str
    number: int
    title: str
    description: str
    status: Literal["completed", "in_progress", "locked"]
    completedDate: Optional[str] = None
    estimatedHours: int
    badgeTitle: Optional[str] = None
    modules: List[SyllabusModuleSchema]
    diggerDeepDive: Optional[DiggerDeepDiveSchema] = None
    surfaceSummary: Optional[List[str]] = None
    prerequisites: Optional[List[str]] = None


class RoadmapResponseSchema(BaseModel):
    roadmapId: str
    roleId: str
    roleTitle: str
    isApproved: bool
    milestones: List[RoadmapMilestoneSchema]


class RoadmapGenerateRequest(BaseModel):
    roleId: str
    persona: LearningPersona = "digger"
    weeklyHours: Optional[float] = 12.0


class ModuleToggleResponse(BaseModel):
    milestoneId: str
    moduleId: str
    completed: bool
    allMilestoneCompleted: bool
    updatedTotalPoints: int


# ==========================================
# 4. Dynamic Adaptive Assessment
# ==========================================
class QuestionOptionSchema(BaseModel):
    id: str
    text: str


class AssessmentQuestionSchema(BaseModel):
    id: str
    questionNumber: int
    totalQuestions: int
    level: Literal["Beginner", "Intermediate", "Advanced"]
    prompt: str
    codeSnippet: Optional[str] = None
    options: List[QuestionOptionSchema]
    correctOptionId: str
    explanation: str
    citation: str
    conceptTag: str


class AssessmentSubmissionRequest(BaseModel):
    topic: str = "Deep Learning Fundamentals"
    answers: Dict[str, str]  # questionId -> optionId
    timeSpentSeconds: int = 240


class AssessmentResultSchema(BaseModel):
    id: str
    topic: str
    scorePercentage: int
    correctCount: int
    totalQuestions: int
    timeSpentMinutes: int
    speedComparison: str
    passed: bool
    strengths: List[str]
    areasForRefinement: List[str]
    trailGuideNote: str
    certificationEligible: bool
    awardedPoints: int


class WeakPointSchema(BaseModel):
    id: int
    conceptTag: str
    severity: str
    remedialRecommended: bool
    createdAt: datetime


# ==========================================
# 5. Certificates & Hands-On Partner Labs
# ==========================================
class CertificateDataSchema(BaseModel):
    id: str
    certificateNumber: str
    recipientName: str
    recipientTitle: str
    pathTitle: str
    completionDate: str
    grade: str
    verifiedCompetencies: List[str]
    issuer: str
    verificationHash: str
    honorsDistinction: Optional[str] = None


class CertificateVerificationResponse(BaseModel):
    isValid: bool
    certificate: Optional[CertificateDataSchema] = None
    verificationTimestamp: datetime = Field(default_factory=datetime.utcnow)
    issuerSignature: str = "VALIDATED_BY_TRAILMARK_BLOCKCHAIN_REGISTRY"


class LabSlotSchema(BaseModel):
    id: str
    labId: str
    date: str
    startTime: str
    endTime: str
    capacity: int
    bookedCount: int
    isAvailable: bool


class PartnerLabSchema(BaseModel):
    id: str
    name: str
    location: str
    address: str
    facilities: List[str]
    availableSlots: List[LabSlotSchema] = []


class LabBookingRequest(BaseModel):
    slotId: str
    domain: str = "Hardware & Edge AI Practical"


class LabBookingResponse(BaseModel):
    bookingId: str
    status: str
    confirmationCode: str
    labName: str
    date: str
    time: str


# ==========================================
# 6. Community & Study Pods
# ==========================
class HelpfulAnswerSchema(BaseModel):
    id: str
    author: Dict[str, Any]
    timestamp: str
    content: str
    upvotes: int
    isAccepted: bool


class CommunityPostSchema(BaseModel):
    id: str
    author: Dict[str, Any]
    timestamp: str
    domainTag: str
    title: str
    content: str
    codeSnippet: Optional[str] = None
    upvotes: int
    repliesCount: int
    isHelpfulAnswered: Optional[bool] = False
    answers: Optional[List[HelpfulAnswerSchema]] = []
    tags: List[str] = []


class CreatePostRequest(BaseModel):
    title: str
    content: str
    domainTag: str = "Deep Learning"
    codeSnippet: Optional[str] = None
    tags: Optional[List[str]] = []


class CreateAnswerRequest(BaseModel):
    content: str


class StudyGroupSchema(BaseModel):
    id: str
    name: str
    domain: str
    description: str
    activeMembersCount: int
    currentTopic: str
    nextSyncTime: str
    isLive: bool
    roomUrl: Optional[str] = None


# ==========================================
# 7. Gamification & Leaderboard
# ==========================================
class RewardItemSchema(BaseModel):
    id: str
    title: str
    category: Literal["Recognition", "Mentorship", "Resource", "Badge"]
    pointCost: int
    icon: str
    description: str
    available: bool
    redeemed: Optional[bool] = False


class RedeemRewardResponse(BaseModel):
    success: bool
    rewardId: str
    remainingPoints: int
    message: str


class LeaderboardEntrySchema(BaseModel):
    rank: int
    name: str
    avatar: str
    domain: str
    points: int
    streakDays: int
    badge: str
    isCurrentUser: Optional[bool] = False
    change: Optional[Literal["up", "down", "same"]] = "same"


# ==========================================
# 8. AI Guide & Explainability
# ==========================================
class AiGuideRequest(BaseModel):
    prompt: str
    topic: Optional[str] = "Deep Learning Fundamentals"
    mode: Optional[LearningPersona] = "digger"
    currentMilestone: Optional[str] = "Milestone 2"


class AiGuideResponse(BaseModel):
    reply: str
    citations: Optional[List[str]] = []
    suggestedFollowUps: Optional[List[str]] = []


class ExplainStepRequest(BaseModel):
    milestoneId: str
    moduleId: Optional[str] = None
    targetRole: str = "AI Engineer"


# ==========================================
# 9. Facilitator / Cohort Analytics
# ==========================================
class ScholarSnapshotSchema(BaseModel):
    name: str
    mastery: str
    velocity: str
    status: str
    alert: str


class FacilitatorAlertSchema(BaseModel):
    severity: str
    message: str
    recommendedAction: str


class CohortAnalyticsResponse(BaseModel):
    cohortName: str
    domain: str
    totalEnrolled: int
    avgMastery: int
    peerReviewVelocity: float
    engagementLevel: str
    activeSyncSession: bool
    scholars: List[ScholarSnapshotSchema]
    facilitatorAlerts: List[FacilitatorAlertSchema]
