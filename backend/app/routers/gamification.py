from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import LearnerProfile
from backend.app.schemas.schemas import (
    RewardItemSchema,
    RedeemRewardResponse,
    LeaderboardEntrySchema,
)
from backend.app.services.gamification_service import gamification_service

router = APIRouter(prefix="/gamification", tags=["Gamification, Rewards & Leaderboard"])

@router.get("/rewards", response_model=List[RewardItemSchema])
def get_rewards(db: Session = Depends(get_db)):
    """
    Returns available reward items in the point redemption store.
    """
    profile = db.query(LearnerProfile).first()
    profile_id = profile.id if profile else "eleanor-vance"
    return gamification_service.get_rewards(db, profile_id)

@router.post("/rewards/{reward_id}/redeem", response_model=RedeemRewardResponse)
def redeem_reward(reward_id: str, db: Session = Depends(get_db)):
    """
    Redeems a reward item using earned points.
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return gamification_service.redeem_reward(db, profile, reward_id)

@router.get("/leaderboard", response_model=List[LeaderboardEntrySchema])
def get_leaderboard(
    domain: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    """
    Retrieves global or domain-filtered scholar rankings and streaks.
    """
    return gamification_service.get_leaderboard(db, domain)
