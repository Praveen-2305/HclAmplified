import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.models import (
    RewardItem,
    RewardRedemption,
    LeaderboardRecord,
    LearnerProfile,
)
from backend.app.schemas.schemas import (
    RewardItemSchema,
    RedeemRewardResponse,
    LeaderboardEntrySchema,
)

class GamificationService:
    """
    Gamification, Streaks, Rewards & Leaderboard Engine.
    """

    def get_rewards(self, db: Session, profile_id: str) -> List[RewardItemSchema]:
        rewards = db.query(RewardItem).all()
        redemptions = {str(r.reward_id) for r in db.query(RewardRedemption).filter(RewardRedemption.profile_id == profile_id).all()}

        return [
            RewardItemSchema(
                id=str(r.id),
                title=str(r.title),
                category=r.category if r.category in ["Badge", "Mentorship", "Recognition", "Resource"] else "Recognition",
                pointCost=int(r.point_cost or 500),
                icon=str(r.icon or "military_tech"),
                description=str(r.description),
                available=bool(r.available),
                redeemed=str(r.id) in redemptions,
            )
            for r in rewards
        ]

    def redeem_reward(self, db: Session, profile: LearnerProfile, reward_id: str) -> RedeemRewardResponse:
        reward = db.query(RewardItem).filter(RewardItem.id == reward_id).first()
        current_points = int(profile.total_points or 0)
        if not reward:
            return RedeemRewardResponse(success=False, rewardId=reward_id, remainingPoints=current_points, message="Reward not found.")

        # Check if already redeemed
        existing = db.query(RewardRedemption).filter(
            RewardRedemption.profile_id == str(profile.id),
            RewardRedemption.reward_id == reward_id
        ).first()
        if existing:
            return RedeemRewardResponse(success=False, rewardId=reward_id, remainingPoints=current_points, message="Reward has already been redeemed.")

        cost = int(reward.point_cost or 0)
        if current_points < cost:
            return RedeemRewardResponse(
                success=False,
                rewardId=reward_id,
                remainingPoints=current_points,
                message=f"Insufficient points. Required: {cost}, Available: {current_points}"
            )

        # Deduct points and create redemption
        profile.total_points = current_points - cost
        redemption = RewardRedemption(
            id=f"rdm-{uuid.uuid4().hex[:8]}",
            profile_id=str(profile.id),
            reward_id=reward_id,
        )
        db.add(redemption)
        db.commit()

        return RedeemRewardResponse(
            success=True,
            rewardId=reward_id,
            remainingPoints=int(profile.total_points),
            message=f"Successfully redeemed '{reward.title}' for {cost} points!",
        )

    def get_leaderboard(self, db: Session, domain: Optional[str] = None) -> List[LeaderboardEntrySchema]:
        query = db.query(LeaderboardRecord)
        if domain:
            query = query.filter(LeaderboardRecord.domain.ilike(f"%{domain}%"))

        records = query.order_by(LeaderboardRecord.rank).all()
        return [
            LeaderboardEntrySchema(
                rank=int(r.rank),
                name=str(r.name),
                avatar=str(r.avatar or ""),
                domain=str(r.domain or "AI Engineering"),
                points=int(r.points or 0),
                streakDays=int(r.streak_days or 0),
                badge=str(r.badge or "Scholar"),
                isCurrentUser="Eleanor Vance" in str(r.name),
                change=r.change if r.change in ["down", "same", "up"] else "same",
            )
            for r in records
        ]

gamification_service = GamificationService()
