from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import LearnerProfile, Role
from backend.app.schemas.schemas import RoleMatchSchema, CustomRoleRequest
from backend.app.services.recommender_service import recommender_service

router = APIRouter(prefix="/roles", tags=["Role & Recommendation Engine"])

@router.get("/recommendations", response_model=List[RoleMatchSchema])
def get_recommendations(db: Session = Depends(get_db)):
    """
    Returns calibrated career trajectory matches, ranked by synergy percentage with skill gap analysis.
    """
    profile = db.query(LearnerProfile).first()
    return recommender_service.get_role_recommendations(db, profile)

@router.get("/{role_id}", response_model=RoleMatchSchema)
def get_role_by_id(role_id: str, db: Session = Depends(get_db)):
    """
    Returns specific role trajectory details and skill graph.
    """
    profile = db.query(LearnerProfile).first()
    roles = recommender_service.get_role_recommendations(db, profile)
    for r in roles:
        if r.id == role_id:
            return r
    raise HTTPException(status_code=404, detail=f"Role '{role_id}' not found")

@router.post("/custom-match", response_model=RoleMatchSchema)
def match_custom_role(payload: CustomRoleRequest):
    """
    Dynamically maps a custom target role against the ontology and returns skill gap synergy.
    """
    return recommender_service.match_custom_role(
        custom_title=payload.customTitle,
        background=payload.backgroundDescription or "",
    )
