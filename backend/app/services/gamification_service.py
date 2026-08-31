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
        redemptions = {r.reward_id for r in db.query(RewardRedemption).filter(RewardRedemption.profile_id == profile_id).all()}

        return [
            RewardItemSchema(
                id=r.id,
                title=r.title,
                category=r.category,
                pointCost=r.point_cost,
                icon=r.icon,
                description=r.description,
                available=r.available,
                redeemed=r.id in redemptions,
            )
            for r in rewards
        ]

    def redeem_reward(self, db: Session, profile: LearnerProfile, reward_id: str) -> RedeemRewardResponse:
        reward = db.query(RewardItem).filter(RewardItem.id == reward_id).first()
        if not reward:
            return RedeemRewardResponse(success=False, rewardId=reward_id, remainingPoints=profile.total_points, message="Reward not found.")

        # Check if already redeemed
        existing = db.query(RewardRedemption).filter(
            RewardRedemption.profile_id == profile.id,
            RewardRedemption.reward_id == reward_id
        ).first()
        if existing:
            return RedeemRewardResponse(success=False, rewardId=reward_id, remainingPoints=profile.total_points, message="Reward has already been redeemed.")

        if profile.total_points < reward.point_cost:
            return RedeemRewardResponse(
                success=False,
                rewardId=reward_id,
                remainingPoints=profile.total_points,
                message=f"Insufficient points. Required: {reward.point_cost}, Available: {profile.total_points}"
            )

        # Deduct points and create redemption
        profile.total_points -= reward.point_cost
        redemption = RewardRedemption(
            id=f"rdm-{uuid.uuid4().hex[:8]}",
            profile_id=profile.id,
            reward_id=reward_id,
        )
        db.add(redemption)
        db.commit()

        return RedeemRewardResponse(
            success=True,
            rewardId=reward_id,
            remainingPoints=profile.total_points,
            message=f"Successfully redeemed '{reward.title}' for {reward.point_cost} points!",
        )

    def get_leaderboard(self, db: Session, domain: Optional[str] = None) -> List[LeaderboardEntrySchema]:
        query = db.query(LeaderboardRecord)
        if domain:
            query = query.filter(LeaderboardRecord.domain.ilike(f"%{domain}%"))

        records = query.order_by(LeaderboardRecord.rank).all()
        return [
            LeaderboardEntrySchema(
                rank=r.rank,
                name=r.name,
                avatar=r.avatar,
                domain=r.domain,
                points=r.points,
                streakDays=r.streak_days,
                badge=r.badge,
                isCurrentUser="Eleanor Vance" in r.name,
                change=r.change,
            )
            for r in records
        ]

gamification_service = GamificationService()
