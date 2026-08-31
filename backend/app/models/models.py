from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    Text,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

# ==========================================
# 1. Learner Profile & Persona
# ==========================================
class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    email = Column(String(128), default="scholar@trailmark.ai")
    avatar = Column(String(256), default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
    current_role = Column(String(128), default="Marketing Analytics Specialist")
    target_role = Column(String(128), default="AI Engineer")
    target_timeline_months = Column(Integer, default=18)
    persona = Column(String(32), default="digger")  # digger | surface | motivation
    scholar_level = Column(String(64), default="Fellow, Stage II")
    joined_date = Column(String(64), default="Autumn 2025")
    total_points = Column(Integer, default=1420)
    streak_days = Column(Integer, default=19)
    freeze_days_available = Column(Integer, default=2)
    current_module_id = Column(String(64), default="mod-02")
    weekly_goal_hours = Column(Float, default=12.0)
    hours_completed_this_week = Column(Float, default=8.5)
    bio = Column(Text, default="Pivoting from quantitative marketing analysis into deep learning systems and transformer architectures.")
    preferred_language = Column(String(32), default="English")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    persona_scores = relationship("PersonaScore", back_populates="profile", uselist=False, cascade="all, delete-orphan")
    history_entries = relationship("ProfileHistory", back_populates="profile", cascade="all, delete-orphan")
    roadmaps = relationship("Roadmap", back_populates="profile", cascade="all, delete-orphan")
    submissions = relationship("AssessmentSubmission", back_populates="profile", cascade="all, delete-orphan")
    weak_points = relationship("WeakPoint", back_populates="profile", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="profile", cascade="all, delete-orphan")
    redemptions = relationship("RewardRedemption", back_populates="profile", cascade="all, delete-orphan")
    lab_bookings = relationship("LabBooking", back_populates="profile", cascade="all, delete-orphan")


class PersonaScore(Base):
    __tablename__ = "persona_scores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False, unique=True)
    digger_weight = Column(Float, default=0.65)
    surface_weight = Column(Float, default=0.20)
    motivation_weight = Column(Float, default=0.15)
    last_recalibrated_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="persona_scores")


class ProfileHistory(Base):
    __tablename__ = "profile_history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    snapshot_title = Column(String(128), nullable=False)
    skills_count = Column(Integer, default=0)
    milestone_count = Column(Integer, default=0)
    recorded_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="history_entries")


# ==========================================
# 2. Roles & Skills
# ==========================================
class Role(Base):
    __tablename__ = "roles"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    match_percentage = Column(Integer, default=85)
    salary_range = Column(String(64), default="$160k - $210k")
    tag = Column(String(64), default="Top Match")  # Top Match | High Growth | Strategic Pivot
    summary = Column(Text, nullable=False)
    alignment_reason = Column(Text, nullable=False)
    milestones_count = Column(Integer, default=4)
    est_time_to_mastery = Column(String(64), default="6-8 Months")
    primary_domain = Column(String(64), default="Artificial Intelligence")
    market_demand = Column(String(64), default="High (+28% YoY)")
    skills_json = Column(Text, default="[]")  # JSON: [{name, matchScore, status}]


# ==========================================
# 3. Roadmaps & Milestones
# ==========================================
class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(String(64), primary_key=True, index=True)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    role_id = Column(String(64), nullable=False)
    title = Column(String(128), nullable=False)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="roadmaps")
    milestones = relationship("Milestone", back_populates="roadmap", cascade="all, delete-orphan")


class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String(64), primary_key=True, index=True)
    roadmap_id = Column(String(64), ForeignKey("roadmaps.id"), nullable=False)
    number = Column(Integer, nullable=False)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(32), default="in_progress")  # completed | in_progress | locked
    completed_date = Column(String(64), nullable=True)
    estimated_hours = Column(Integer, default=24)
    badge_title = Column(String(128), default="Scholar Badge")
    surface_summary_json = Column(Text, default="[]")
    digger_reading_list_json = Column(Text, default="[]")
    digger_academic_papers_json = Column(Text, default="[]")
    digger_theoretical_foundation = Column(Text, default="")
    prerequisite_ids_json = Column(Text, default="[]")

    roadmap = relationship("Roadmap", back_populates="milestones")
    modules = relationship("SyllabusModule", back_populates="milestone", cascade="all, delete-orphan")


class SyllabusModule(Base):
    __tablename__ = "syllabus_modules"

    id = Column(String(64), primary_key=True, index=True)
    milestone_id = Column(String(64), ForeignKey("milestones.id"), nullable=False)
    title = Column(String(128), nullable=False)
    type = Column(String(32), default="concept")  # concept | assessment | lab | project
    duration = Column(String(64), default="45 min")
    completed = Column(Boolean, default=False)
    digger_notes = Column(Text, default="")
    citations_json = Column(Text, default="[]")
    rubric_json = Column(Text, default="{}")

    milestone = relationship("Milestone", back_populates="modules")


# ==========================================
# 4. Adaptive Assessments & Weak Points
# ==========================================
class AssessmentTopic(Base):
    __tablename__ = "assessment_topics"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    domain = Column(String(64), default="AI & ML")
    description = Column(Text, default="")

    questions = relationship("Question", back_populates="topic", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(64), primary_key=True, index=True)
    topic_id = Column(String(64), ForeignKey("assessment_topics.id"), nullable=False)
    question_number = Column(Integer, nullable=False)
    total_questions = Column(Integer, default=5)
    level = Column(String(32), default="Intermediate")  # Beginner | Intermediate | Advanced
    prompt = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    options_json = Column(Text, nullable=False)  # JSON: [{id, text}]
    correct_option_id = Column(String(32), nullable=False)
    explanation = Column(Text, nullable=False)
    citation = Column(String(256), default="")
    concept_tag = Column(String(64), default="")

    topic = relationship("AssessmentTopic", back_populates="questions")


class AssessmentSubmission(Base):
    __tablename__ = "assessment_submissions"

    id = Column(String(64), primary_key=True, index=True)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    topic = Column(String(128), nullable=False)
    score_percentage = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    total_questions = Column(Integer, default=5)
    time_spent_minutes = Column(Integer, default=4)
    speed_comparison = Column(String(64), default="Top 15% pace")
    passed = Column(Boolean, default=True)
    awarded_points = Column(Integer, default=250)
    strengths_json = Column(Text, default="[]")
    areas_for_refinement_json = Column(Text, default="[]")
    trail_guide_note = Column(Text, default="")
    certification_eligible = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="submissions")


class WeakPoint(Base):
    __tablename__ = "weak_points"

    id = Column(Integer, primary_key=True, autoincrement=True)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    concept_tag = Column(String(64), nullable=False)
    severity = Column(String(32), default="Moderate")  # High | Moderate | Resolved
    remedial_recommended = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="weak_points")


# ==========================================
# 5. Certificates & Hands-On Partner Labs
# ==========================================
class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(String(64), primary_key=True, index=True)
    certificate_number = Column(String(64), unique=True, nullable=False)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    recipient_name = Column(String(128), nullable=False)
    recipient_title = Column(String(128), default="Chartered Machine Learning Scholar")
    path_title = Column(String(128), default="Advanced Machine Learning & Neural Systems")
    completion_date = Column(String(64), default="Winter 2025")
    grade = Column(String(32), default="High Distinction (96.4%)")
    verified_competencies_json = Column(Text, default="[]")
    issuer = Column(String(128), default="Trailmark Academic Institute & HCL Consortium")
    verification_hash = Column(String(128), unique=True, nullable=False)
    honors_distinction = Column(String(128), default="Magna Cum Laude in Algorithmic Rigor")

    profile = relationship("LearnerProfile", back_populates="certificates")


class PartnerLab(Base):
    __tablename__ = "partner_labs"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    location = Column(String(128), nullable=False)
    address = Column(String(256), nullable=False)
    facilities_json = Column(Text, default="[]")  # JSON: ["GPU Clusters", "Robotics Bench", "Oscilloscopes"]

    slots = relationship("LabSlot", back_populates="lab", cascade="all, delete-orphan")


class LabSlot(Base):
    __tablename__ = "lab_slots"

    id = Column(String(64), primary_key=True, index=True)
    lab_id = Column(String(64), ForeignKey("partner_labs.id"), nullable=False)
    date = Column(String(32), nullable=False)
    start_time = Column(String(32), nullable=False)
    end_time = Column(String(32), nullable=False)
    capacity = Column(Integer, default=15)
    booked_count = Column(Integer, default=0)

    lab = relationship("PartnerLab", back_populates="slots")
    bookings = relationship("LabBooking", back_populates="slot", cascade="all, delete-orphan")


class LabBooking(Base):
    __tablename__ = "lab_bookings"

    id = Column(String(64), primary_key=True, index=True)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    slot_id = Column(String(64), ForeignKey("lab_slots.id"), nullable=False)
    domain = Column(String(64), default="Hardware & Edge AI Practical")
    status = Column(String(32), default="confirmed")
    confirmation_code = Column(String(64), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="lab_bookings")
    slot = relationship("LabSlot", back_populates="bookings")


# ==========================================
# 6. Peer Community & Discussions
# ==========================================
class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(String(64), primary_key=True, index=True)
    author_name = Column(String(128), nullable=False)
    author_avatar = Column(String(256), default="")
    author_role = Column(String(128), default="Scholar")
    author_scholar_level = Column(String(64), default="Fellow, Stage II")
    timestamp_str = Column(String(64), default="Just now")
    domain_tag = Column(String(64), default="Deep Learning")
    title = Column(String(256), nullable=False)
    content = Column(Text, nullable=False)
    code_snippet = Column(Text, nullable=True)
    upvotes = Column(Integer, default=1)
    replies_count = Column(Integer, default=0)
    is_helpful_answered = Column(Boolean, default=False)
    tags_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

    answers = relationship("PostAnswer", back_populates="post", cascade="all, delete-orphan")


class PostAnswer(Base):
    __tablename__ = "post_answers"

    id = Column(String(64), primary_key=True, index=True)
    post_id = Column(String(64), ForeignKey("community_posts.id"), nullable=False)
    author_name = Column(String(128), nullable=False)
    author_avatar = Column(String(256), default="")
    author_role = Column(String(128), default="Peer Reviewer")
    badge = Column(String(64), default="Peer Reviewer")
    timestamp_str = Column(String(64), default="Just now")
    content = Column(Text, nullable=False)
    upvotes = Column(Integer, default=1)
    is_accepted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("CommunityPost", back_populates="answers")


class StudyGroup(Base):
    __tablename__ = "study_groups"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    domain = Column(String(64), default="Deep Learning")
    description = Column(Text, default="")
    active_members_count = Column(Integer, default=18)
    current_topic = Column(String(128), default="Transformer Multi-Head Attention Proofs")
    next_sync_time = Column(String(64), default="Thursday 18:00 UTC")
    is_live = Column(Boolean, default=False)
    room_url = Column(String(256), default="")


# ==========================================
# 7. Gamification & Rewards
# ==========================================
class RewardItem(Base):
    __tablename__ = "reward_items"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(128), nullable=False)
    category = Column(String(64), default="Recognition")  # Recognition | Mentorship | Resource | Badge
    point_cost = Column(Integer, default=500)
    icon = Column(String(64), default="military_tech")
    description = Column(Text, nullable=False)
    available = Column(Boolean, default=True)


class RewardRedemption(Base):
    __tablename__ = "reward_redemptions"

    id = Column(String(64), primary_key=True, index=True)
    profile_id = Column(String(64), ForeignKey("learner_profiles.id"), nullable=False)
    reward_id = Column(String(64), ForeignKey("reward_items.id"), nullable=False)
    redeemed_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="redemptions")
    reward = relationship("RewardItem")


class LeaderboardRecord(Base):
    __tablename__ = "leaderboard_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    rank = Column(Integer, nullable=False)
    name = Column(String(128), nullable=False)
    avatar = Column(String(256), default="")
    domain = Column(String(64), default="AI Engineering")
    points = Column(Integer, default=1000)
    streak_days = Column(Integer, default=10)
    badge = Column(String(64), default="Scholar")
    change = Column(String(16), default="same")  # up | down | same


# ==========================================
# 8. Facilitator & Cohort Analytics
# ==========================================
class CohortMetric(Base):
    __tablename__ = "cohort_metrics"

    id = Column(String(64), primary_key=True, index=True)
    cohort_name = Column(String(128), default="Cohort Alpha")
    domain = Column(String(64), default="Deep Learning Fundamentals")
    total_enrolled = Column(Integer, default=24)
    avg_mastery = Column(Integer, default=84)
    peer_review_velocity = Column(Float, default=2.4)
    engagement_level = Column(String(32), default="High")
    active_sync_session = Column(Boolean, default=True)
    scholars_json = Column(Text, default="[]")
    facilitator_alerts_json = Column(Text, default="[]")
