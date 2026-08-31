from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import LearnerProfile, Roadmap, Milestone, SyllabusModule
from backend.app.schemas.schemas import (
    RoadmapResponseSchema,
    RoadmapGenerateRequest,
    ModuleToggleResponse,
    LearningPersona,
)
from backend.app.services.roadmap_service import roadmap_service

router = APIRouter(prefix="/roadmaps", tags=["Personalized Learning Path Generator"])

@router.get("/current", response_model=RoadmapResponseSchema)
def get_current_roadmap(
    mode: Optional[LearningPersona] = Query(default=None),
    db: Session = Depends(get_db),
):
    """
    Returns the active structured learning roadmap, adapted for Digger vs Surface mode.
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    active_mode = mode or profile.persona or "digger"
    return roadmap_service.get_or_create_roadmap(db, profile, profile.target_role or "ai-engineer", active_mode)

@router.post("/generate", response_model=RoadmapResponseSchema)
def generate_roadmap(
    payload: RoadmapGenerateRequest,
    db: Session = Depends(get_db),
):
    """
    Generates a calibrated course roadmap for a selected role with prerequisites,
    milestone sizing, and academic foundations.
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    roadmap = roadmap_service.generate_roadmap_for_role(
        db=db,
        profile=profile,
        role_id=payload.roleId,
        persona=payload.persona,
        weekly_hours=payload.weeklyHours or profile.weekly_goal_hours,
    )
    return roadmap_service.format_roadmap_response(roadmap, payload.persona)

@router.post("/approve")
def approve_roadmap(db: Session = Depends(get_db)):
    """
    Human-in-the-loop checkpoint: locks in the proposed learning path after learner review.
    """
    profile = db.query(LearnerProfile).first()
    roadmap = db.query(Roadmap).filter(Roadmap.profile_id == profile.id).first()
    if roadmap:
        roadmap.is_approved = True
        db.commit()
    return {"success": True, "message": "Roadmap syllabus approved and locked in."}

@router.patch("/modules/{module_id}/toggle", response_model=ModuleToggleResponse)
def toggle_module(
    module_id: str,
    db: Session = Depends(get_db),
):
    """
    Toggles completion status of a module and checks if milestone is completed.
    """
    profile = db.query(LearnerProfile).first()
    module = db.query(SyllabusModule).filter(SyllabusModule.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    module.completed = not module.completed
    
    # Check if all sibling modules in milestone are complete
    milestone = module.milestone
    all_completed = all(m.completed for m in milestone.modules)
    if all_completed and milestone.status != "completed":
        milestone.status = "completed"
        milestone.completed_date = "Just completed"
        profile.total_points += 150  # Milestone completion bonus

    db.commit()

    return ModuleToggleResponse(
        milestoneId=milestone.id,
        moduleId=module.id,
        completed=module.completed,
        allMilestoneCompleted=all_completed,
        updatedTotalPoints=profile.total_points,
    )

@router.post("/milestones/{milestone_id}/skip")
def skip_milestone_with_proof(
    milestone_id: str,
    db: Session = Depends(get_db),
):
    """
    Allows a learner to mark a milestone as skipped/verified after placement check.
    """
    ms = db.query(Milestone).filter(Milestone.id == milestone_id).first()
    if not ms:
        raise HTTPException(status_code=404, detail="Milestone not found")

    ms.status = "completed"
    ms.completed_date = "Verified via Placement Proof"
    for mod in ms.modules:
        mod.completed = True

    db.commit()
    return {"success": True, "message": f"Milestone '{ms.title}' marked completed via verification."}
