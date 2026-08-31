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
        scholars_raw = json.loads(str(cohort.scholars_json or "[]"))
    except Exception:
        scholars_raw = []

    try:
        alerts_raw = json.loads(str(cohort.facilitator_alerts_json or "[]"))
    except Exception:
        alerts_raw = []

    return CohortAnalyticsResponse(
        cohortName=str(cohort.cohort_name),
        domain=str(cohort.domain),
        totalEnrolled=int(cohort.total_enrolled or 24),
        avgMastery=int(cohort.avg_mastery or 84),
        peerReviewVelocity=float(cohort.peer_review_velocity or 2.4),
        engagementLevel=str(cohort.engagement_level or "High"),
        activeSyncSession=bool(cohort.active_sync_session),
        scholars=[ScholarSnapshotSchema(**s) for s in scholars_raw],
        facilitatorAlerts=[FacilitatorAlertSchema(**a) for a in alerts_raw],
    )
