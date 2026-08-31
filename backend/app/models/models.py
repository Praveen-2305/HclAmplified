from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import (
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.core.database import Base

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

# ==========================================
# 1. Learner Profile & Persona
# ==========================================
class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str] = mapped_column(String(128), default="scholar@trailmark.ai")
    avatar: Mapped[str] = mapped_column(String(256), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
    current_role: Mapped[str] = mapped_column(String(128), default="Marketing Analytics Specialist")
    target_role: Mapped[str] = mapped_column(String(128), default="AI Engineer")
    target_timeline_months: Mapped[int] = mapped_column(Integer, default=18)
    persona: Mapped[str] = mapped_column(String(32), default="digger")  # digger | surface | motivation
    scholar_level: Mapped[str] = mapped_column(String(64), default="Fellow, Stage II")
    joined_date: Mapped[str] = mapped_column(String(64), default="Autumn 2025")
    total_points: Mapped[int] = mapped_column(Integer, default=1420)
    streak_days: Mapped[int] = mapped_column(Integer, default=19)
    freeze_days_available: Mapped[int] = mapped_column(Integer, default=2)
    current_module_id: Mapped[str] = mapped_column(String(64), default="mod-02")
    weekly_goal_hours: Mapped[float] = mapped_column(Float, default=12.0)
    hours_completed_this_week: Mapped[float] = mapped_column(Float, default=8.5)
    bio: Mapped[str] = mapped_column(Text, default="Pivoting from quantitative marketing analysis into deep learning systems and transformer architectures.")
    preferred_language: Mapped[str] = mapped_column(String(32), default="English")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    persona_scores: Mapped[Optional["PersonaScore"]] = relationship("PersonaScore", back_populates="profile", uselist=False, cascade="all, delete-orphan")
    history_entries: Mapped[List["ProfileHistory"]] = relationship("ProfileHistory", back_populates="profile", cascade="all, delete-orphan")
    roadmaps: Mapped[List["Roadmap"]] = relationship("Roadmap", back_populates="profile", cascade="all, delete-orphan")
    submissions: Mapped[List["AssessmentSubmission"]] = relationship("AssessmentSubmission", back_populates="profile", cascade="all, delete-orphan")
    weak_points: Mapped[List["WeakPoint"]] = relationship("WeakPoint", back_populates="profile", cascade="all, delete-orphan")
    certificates: Mapped[List["Certificate"]] = relationship("Certificate", back_populates="profile", cascade="all, delete-orphan")
    redemptions: Mapped[List["RewardRedemption"]] = relationship("RewardRedemption", back_populates="profile", cascade="all, delete-orphan")
    lab_bookings: Mapped[List["LabBooking"]] = relationship("LabBooking", back_populates="profile", cascade="all, delete-orphan")


class PersonaScore(Base):
    __tablename__ = "persona_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False, unique=True)
    digger_weight: Mapped[float] = mapped_column(Float, default=0.65)
    surface_weight: Mapped[float] = mapped_column(Float, default=0.20)
    motivation_weight: Mapped[float] = mapped_column(Float, default=0.15)
    last_recalibrated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="persona_scores")


class ProfileHistory(Base):
    __tablename__ = "profile_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    snapshot_title: Mapped[str] = mapped_column(String(128), nullable=False)
    skills_count: Mapped[int] = mapped_column(Integer, default=0)
    milestone_count: Mapped[int] = mapped_column(Integer, default=0)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="history_entries")


# ==========================================
# 2. Roles & Skills
# ==========================================
class Role(Base):
    __tablename__ = "roles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    match_percentage: Mapped[int] = mapped_column(Integer, default=85)
    salary_range: Mapped[str] = mapped_column(String(64), default="$160k - $210k")
    tag: Mapped[str] = mapped_column(String(64), default="Top Match")
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    alignment_reason: Mapped[str] = mapped_column(Text, nullable=False)
    milestones_count: Mapped[int] = mapped_column(Integer, default=4)
    est_time_to_mastery: Mapped[str] = mapped_column(String(64), default="6-8 Months")
    primary_domain: Mapped[str] = mapped_column(String(64), default="Artificial Intelligence")
    market_demand: Mapped[str] = mapped_column(String(64), default="High (+28% YoY)")
    skills_json: Mapped[str] = mapped_column(Text, default="[]")


# ==========================================
# 3. Roadmaps & Milestones
# ==========================================
class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    role_id: Mapped[str] = mapped_column(String(64), nullable=False)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="roadmaps")
    milestones: Mapped[List["Milestone"]] = relationship("Milestone", back_populates="roadmap", cascade="all, delete-orphan")


class Milestone(Base):
    __tablename__ = "milestones"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    roadmap_id: Mapped[str] = mapped_column(String(64), ForeignKey("roadmaps.id"), nullable=False)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="in_progress")  # completed | in_progress | locked
    completed_date: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    estimated_hours: Mapped[int] = mapped_column(Integer, default=24)
    badge_title: Mapped[str] = mapped_column(String(128), default="Scholar Badge")
    surface_summary_json: Mapped[str] = mapped_column(Text, default="[]")
    digger_reading_list_json: Mapped[str] = mapped_column(Text, default="[]")
    digger_academic_papers_json: Mapped[str] = mapped_column(Text, default="[]")
    digger_theoretical_foundation: Mapped[str] = mapped_column(Text, default="")
    prerequisite_ids_json: Mapped[str] = mapped_column(Text, default="[]")

    roadmap: Mapped["Roadmap"] = relationship("Roadmap", back_populates="milestones")
    modules: Mapped[List["SyllabusModule"]] = relationship("SyllabusModule", back_populates="milestone", cascade="all, delete-orphan")


class SyllabusModule(Base):
    __tablename__ = "syllabus_modules"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    milestone_id: Mapped[str] = mapped_column(String(64), ForeignKey("milestones.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    type: Mapped[str] = mapped_column(String(32), default="concept")
    duration: Mapped[str] = mapped_column(String(64), default="45 min")
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    digger_notes: Mapped[str] = mapped_column(Text, default="")
    citations_json: Mapped[str] = mapped_column(Text, default="[]")
    rubric_json: Mapped[str] = mapped_column(Text, default="{}")

    milestone: Mapped["Milestone"] = relationship("Milestone", back_populates="modules")


# ==========================================
# 4. Adaptive Assessments & Weak Points
# ==========================================
class AssessmentTopic(Base):
    __tablename__ = "assessment_topics"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    domain: Mapped[str] = mapped_column(String(64), default="AI & ML")
    description: Mapped[str] = mapped_column(Text, default="")

    questions: Mapped[List["Question"]] = relationship("Question", back_populates="topic", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    topic_id: Mapped[str] = mapped_column(String(64), ForeignKey("assessment_topics.id"), nullable=False)
    question_number: Mapped[int] = mapped_column(Integer, nullable=False)
    total_questions: Mapped[int] = mapped_column(Integer, default=5)
    level: Mapped[str] = mapped_column(String(32), default="Intermediate")
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    code_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    options_json: Mapped[str] = mapped_column(Text, nullable=False)
    correct_option_id: Mapped[str] = mapped_column(String(32), nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    citation: Mapped[str] = mapped_column(String(256), default="")
    concept_tag: Mapped[str] = mapped_column(String(64), default="")

    topic: Mapped["AssessmentTopic"] = relationship("AssessmentTopic", back_populates="questions")


class AssessmentSubmission(Base):
    __tablename__ = "assessment_submissions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    topic: Mapped[str] = mapped_column(String(128), nullable=False)
    score_percentage: Mapped[int] = mapped_column(Integer, default=0)
    correct_count: Mapped[int] = mapped_column(Integer, default=0)
    total_questions: Mapped[int] = mapped_column(Integer, default=5)
    time_spent_minutes: Mapped[int] = mapped_column(Integer, default=4)
    speed_comparison: Mapped[str] = mapped_column(String(64), default="Top 15% pace")
    passed: Mapped[bool] = mapped_column(Boolean, default=True)
    awarded_points: Mapped[int] = mapped_column(Integer, default=250)
    strengths_json: Mapped[str] = mapped_column(Text, default="[]")
    areas_for_refinement_json: Mapped[str] = mapped_column(Text, default="[]")
    trail_guide_note: Mapped[str] = mapped_column(Text, default="")
    certification_eligible: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="submissions")


class WeakPoint(Base):
    __tablename__ = "weak_points"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    concept_tag: Mapped[str] = mapped_column(String(64), nullable=False)
    severity: Mapped[str] = mapped_column(String(32), default="Moderate")
    remedial_recommended: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="weak_points")


# ==========================================
# 5. Certificates & Hands-On Partner Labs
# ==========================================
class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    certificate_number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    recipient_name: Mapped[str] = mapped_column(String(128), nullable=False)
    recipient_title: Mapped[str] = mapped_column(String(128), default="Chartered Machine Learning Scholar")
    path_title: Mapped[str] = mapped_column(String(128), default="Advanced Machine Learning & Neural Systems")
    completion_date: Mapped[str] = mapped_column(String(64), default="Winter 2025")
    grade: Mapped[str] = mapped_column(String(32), default="High Distinction (96.4%)")
    verified_competencies_json: Mapped[str] = mapped_column(Text, default="[]")
    issuer: Mapped[str] = mapped_column(String(128), default="Trailmark Academic Institute & HCL Consortium")
    verification_hash: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    honors_distinction: Mapped[Optional[str]] = mapped_column(String(128), default="Magna Cum Laude in Algorithmic Rigor", nullable=True)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="certificates")


class PartnerLab(Base):
    __tablename__ = "partner_labs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    location: Mapped[str] = mapped_column(String(128), nullable=False)
    address: Mapped[str] = mapped_column(String(256), nullable=False)
    facilities_json: Mapped[str] = mapped_column(Text, default="[]")

    slots: Mapped[List["LabSlot"]] = relationship("LabSlot", back_populates="lab", cascade="all, delete-orphan")


class LabSlot(Base):
    __tablename__ = "lab_slots"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    lab_id: Mapped[str] = mapped_column(String(64), ForeignKey("partner_labs.id"), nullable=False)
    date: Mapped[str] = mapped_column(String(32), nullable=False)
    start_time: Mapped[str] = mapped_column(String(32), nullable=False)
    end_time: Mapped[str] = mapped_column(String(32), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=15)
    booked_count: Mapped[int] = mapped_column(Integer, default=0)

    lab: Mapped["PartnerLab"] = relationship("PartnerLab", back_populates="slots")
    bookings: Mapped[List["LabBooking"]] = relationship("LabBooking", back_populates="slot", cascade="all, delete-orphan")


class LabBooking(Base):
    __tablename__ = "lab_bookings"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    slot_id: Mapped[str] = mapped_column(String(64), ForeignKey("lab_slots.id"), nullable=False)
    domain: Mapped[str] = mapped_column(String(64), default="Hardware & Edge AI Practical")
    status: Mapped[str] = mapped_column(String(32), default="confirmed")
    confirmation_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="lab_bookings")
    slot: Mapped["LabSlot"] = relationship("LabSlot", back_populates="bookings")


# ==========================================
# 6. Peer Community & Discussions
# ==========================================
class CommunityPost(Base):
    __tablename__ = "community_posts"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    author_name: Mapped[str] = mapped_column(String(128), nullable=False)
    author_avatar: Mapped[str] = mapped_column(String(256), default="")
    author_role: Mapped[str] = mapped_column(String(128), default="Scholar")
    author_scholar_level: Mapped[str] = mapped_column(String(64), default="Fellow, Stage II")
    timestamp_str: Mapped[str] = mapped_column(String(64), default="Just now")
    domain_tag: Mapped[str] = mapped_column(String(64), default="Deep Learning")
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    code_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    upvotes: Mapped[int] = mapped_column(Integer, default=1)
    replies_count: Mapped[int] = mapped_column(Integer, default=0)
    is_helpful_answered: Mapped[bool] = mapped_column(Boolean, default=False)
    tags_json: Mapped[str] = mapped_column(Text, default="[]")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    answers: Mapped[List["PostAnswer"]] = relationship("PostAnswer", back_populates="post", cascade="all, delete-orphan")


class PostAnswer(Base):
    __tablename__ = "post_answers"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    post_id: Mapped[str] = mapped_column(String(64), ForeignKey("community_posts.id"), nullable=False)
    author_name: Mapped[str] = mapped_column(String(128), nullable=False)
    author_avatar: Mapped[str] = mapped_column(String(256), default="")
    author_role: Mapped[str] = mapped_column(String(128), default="Peer Reviewer")
    badge: Mapped[str] = mapped_column(String(64), default="Peer Reviewer")
    timestamp_str: Mapped[str] = mapped_column(String(64), default="Just now")
    content: Mapped[str] = mapped_column(Text, nullable=False)
    upvotes: Mapped[int] = mapped_column(Integer, default=1)
    is_accepted: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    post: Mapped["CommunityPost"] = relationship("CommunityPost", back_populates="answers")


class StudyGroup(Base):
    __tablename__ = "study_groups"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    domain: Mapped[str] = mapped_column(String(64), default="Deep Learning")
    description: Mapped[str] = mapped_column(Text, default="")
    active_members_count: Mapped[int] = mapped_column(Integer, default=18)
    current_topic: Mapped[str] = mapped_column(String(128), default="Transformer Multi-Head Attention Proofs")
    next_sync_time: Mapped[str] = mapped_column(String(64), default="Thursday 18:00 UTC")
    is_live: Mapped[bool] = mapped_column(Boolean, default=False)
    room_url: Mapped[str] = mapped_column(String(256), default="")


# ==========================================
# 7. Gamification & Rewards
# ==========================================
class RewardItem(Base):
    __tablename__ = "reward_items"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(128), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Recognition")
    point_cost: Mapped[int] = mapped_column(Integer, default=500)
    icon: Mapped[str] = mapped_column(String(64), default="military_tech")
    description: Mapped[str] = mapped_column(Text, nullable=False)
    available: Mapped[bool] = mapped_column(Boolean, default=True)


class RewardRedemption(Base):
    __tablename__ = "reward_redemptions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    profile_id: Mapped[str] = mapped_column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    reward_id: Mapped[str] = mapped_column(String(64), ForeignKey("reward_items.id"), nullable=False)
    redeemed_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

    profile: Mapped["LearnerProfile"] = relationship("LearnerProfile", back_populates="redemptions")
    reward: Mapped["RewardItem"] = relationship("RewardItem")


class LeaderboardRecord(Base):
    __tablename__ = "leaderboard_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    rank: Mapped[int] = mapped_column(Integer, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    avatar: Mapped[str] = mapped_column(String(256), default="")
    domain: Mapped[str] = mapped_column(String(64), default="AI Engineering")
    points: Mapped[int] = mapped_column(Integer, default=1000)
    streak_days: Mapped[int] = mapped_column(Integer, default=10)
    badge: Mapped[str] = mapped_column(String(64), default="Scholar")
    change: Mapped[str] = mapped_column(String(16), default="same")


# ==========================================
# 8. Facilitator & Cohort Analytics
# ==========================================
class CohortMetric(Base):
    __tablename__ = "cohort_metrics"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    cohort_name: Mapped[str] = mapped_column(String(128), default="Cohort Alpha")
    domain: Mapped[str] = mapped_column(String(64), default="Deep Learning Fundamentals")
    total_enrolled: Mapped[int] = mapped_column(Integer, default=24)
    avg_mastery: Mapped[int] = mapped_column(Integer, default=84)
    peer_review_velocity: Mapped[float] = mapped_column(Float, default=2.4)
    engagement_level: Mapped[str] = mapped_column(String(32), default="High")
    active_sync_session: Mapped[bool] = mapped_column(Boolean, default=True)
    scholars_json: Mapped[str] = mapped_column(Text, default="[]")
    facilitator_alerts_json: Mapped[str] = mapped_column(Text, default="[]")
