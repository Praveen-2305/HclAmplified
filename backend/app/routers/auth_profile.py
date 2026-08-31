from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import LearnerProfile, ProfileHistory
from backend.app.schemas.schemas import (
    LearnerProfileSchema,
    LearnerProfileUpdateSchema,
    OnboardingChatRequest,
    OnboardingChatResponse,
    ResumeUploadResponse,
)
from backend.app.services.ai_service import ai_service
from backend.app.services.resume_parser import resume_parser_service

router = APIRouter(prefix="/profile", tags=["Learner Profile & Onboarding"])

@router.post("/onboarding/chat", response_model=OnboardingChatResponse)
async def onboarding_chat(payload: OnboardingChatRequest):
    """
    Conversational intake endpoint: analyzes user message, guides persona classification,
    and signals blueprint readiness.
    """
    result = await ai_service.generate_onboarding_response(
        user_message=payload.userMessage,
        turn_count=payload.turnCount,
        persona_hint=payload.personaHint,
    )
    return OnboardingChatResponse(**result)

@router.post("/upload-resume", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Parses an uploaded PDF/text resume, extracts verified skills, years of experience,
    and updates the active profile bio.
    """
    contents = await file.read()
    parsed_result = resume_parser_service.parse_pdf_bytes(contents, file.filename or "Uploaded_Resume.pdf")

    # Update active profile bio with extracted insights
    profile = db.query(LearnerProfile).first()
    if profile:
        profile.bio = parsed_result["profileBioSuggestion"]
        # Record profile evolution
        history = ProfileHistory(
            profile_id=str(profile.id),
            snapshot_title="Resume Ingestion & Baseline Skill Verification",
            skills_count=len(parsed_result["extractedSkills"]),
            milestone_count=1,
        )
        db.add(history)
        db.commit()

    return ResumeUploadResponse(**parsed_result)

@router.get("/me", response_model=LearnerProfileSchema)
def get_current_profile(db: Session = Depends(get_db)):
    """
    Retrieves the active scholar profile.
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return LearnerProfileSchema(
        id=str(profile.id),
        name=str(profile.name),
        avatar=str(profile.avatar or ""),
        currentRole=str(profile.current_role or "Marketing Analytics Specialist"),
        targetRole=str(profile.target_role or "AI Engineer"),
        targetTimelineMonths=int(profile.target_timeline_months or 18),
        persona=profile.persona if profile.persona in ["digger", "surface", "motivation"] else "digger",
        scholarLevel=str(profile.scholar_level or "Fellow, Stage II"),
        joinedDate=str(profile.joined_date or "Autumn 2025"),
        totalPoints=int(profile.total_points or 1420),
        streakDays=int(profile.streak_days or 19),
        freezeDaysAvailable=int(profile.freeze_days_available or 2),
        completedMilestoneIds=["ms-01"],
        currentModuleId=str(profile.current_module_id or "mod-02"),
        weeklyGoalHours=float(profile.weekly_goal_hours or 12.0),
        hoursCompletedThisWeek=float(profile.hours_completed_this_week or 8.5),
        bio=str(profile.bio or ""),
        preferredLanguage=str(profile.preferred_language or "English"),
    )

@router.patch("/me", response_model=LearnerProfileSchema)
def update_current_profile(
    updates: LearnerProfileUpdateSchema,
    db: Session = Depends(get_db),
):
    """
    Updates the active scholar profile (persona mode, target role, weekly hours, etc.).
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    if updates.name is not None:
        profile.name = updates.name
    if updates.targetRole is not None:
        profile.target_role = updates.targetRole
    if updates.targetTimelineMonths is not None:
        profile.target_timeline_months = updates.targetTimelineMonths
    if updates.persona is not None:
        profile.persona = updates.persona
    if updates.scholarLevel is not None:
        profile.scholar_level = updates.scholarLevel
    if updates.weeklyGoalHours is not None:
        profile.weekly_goal_hours = updates.weeklyGoalHours
    if updates.bio is not None:
        profile.bio = updates.bio
    if updates.preferredLanguage is not None:
        profile.preferred_language = updates.preferredLanguage
    if updates.totalPoints is not None:
        profile.total_points = updates.totalPoints
    if updates.streakDays is not None:
        profile.streak_days = updates.streakDays

    db.commit()
    db.refresh(profile)

    return LearnerProfileSchema(
        id=str(profile.id),
        name=str(profile.name),
        avatar=str(profile.avatar or ""),
        currentRole=str(profile.current_role or "Marketing Analytics Specialist"),
        targetRole=str(profile.target_role or "AI Engineer"),
        targetTimelineMonths=int(profile.target_timeline_months or 18),
        persona=profile.persona if profile.persona in ["digger", "surface", "motivation"] else "digger",
        scholarLevel=str(profile.scholar_level or "Fellow, Stage II"),
        joinedDate=str(profile.joined_date or "Autumn 2025"),
        totalPoints=int(profile.total_points or 1420),
        streakDays=int(profile.streak_days or 19),
        freezeDaysAvailable=int(profile.freeze_days_available or 2),
        completedMilestoneIds=["ms-01"],
        currentModuleId=str(profile.current_module_id or "mod-02"),
        weeklyGoalHours=float(profile.weekly_goal_hours or 12.0),
        hoursCompletedThisWeek=float(profile.hours_completed_this_week or 8.5),
        bio=str(profile.bio or ""),
        preferredLanguage=str(profile.preferred_language or "English"),
    )
