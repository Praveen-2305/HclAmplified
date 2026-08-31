import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import CohortMetric
from backend.app.schemas.schemas import (
    CohortAnalyticsResponse,
    ScholarSnapshotSchema,
    FacilitatorAlertSchema,
)

router = APIRouter(prefix="/analytics", tags=["Leader & Facilitator Cohort Analytics"])

@router.get("/cohort", response_model=CohortAnalyticsResponse)
def get_cohort_analytics(db: Session = Depends(get_db)):
    """
    Returns facilitator analytics, cohort velocity, scholar pacing snapshots, and AI alerts.
    """
    cohort = db.query(CohortMetric).first()
    if not cohort:
        raise HTTPException(status_code=404, detail="Cohort data not found")

    try:
        scholars = json.loads(cohort.scholars_json)
    except Exception:
        scholars = []

    try:
        alerts = json.loads(cohort.facilitator_alerts_json)
    except Exception:
        alerts = []

    return CohortAnalyticsResponse(
        cohortName=cohort.cohort_name,
        domain=cohort.domain,
        totalEnrolled=cohort.total_enrolled,
        avgMastery=cohort.avg_mastery,
        peerReviewVelocity=cohort.peer_review_velocity,
        engagementLevel=cohort.engagement_level,
        activeSyncSession=cohort.active_sync_session,
        scholars=[ScholarSnapshotSchema(**s) for s in scholars],
        facilitatorAlerts=[FacilitatorAlertSchema(**a) for a in alerts],
    )
