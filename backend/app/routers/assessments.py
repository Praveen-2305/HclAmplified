from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import LearnerProfile
from backend.app.schemas.schemas import (
    AssessmentQuestionSchema,
    AssessmentSubmissionRequest,
    AssessmentResultSchema,
    WeakPointSchema,
    PartnerLabSchema,
    LabBookingRequest,
    LabBookingResponse,
)
from backend.app.services.assessment_service import assessment_service

router = APIRouter(prefix="/assessments", tags=["Adaptive Assessment Engine & Lab Bookings"])

@router.get("/questions", response_model=List[AssessmentQuestionSchema])
def get_assessment_questions(
    topic: str = Query(default="Deep Learning Fundamentals"),
    db: Session = Depends(get_db),
):
    """
    Returns adaptive assessment questions tailored to the requested topic.
    """
    return assessment_service.get_questions_for_topic(db, topic)

@router.post("/submit", response_model=AssessmentResultSchema)
def submit_assessment(
    payload: AssessmentSubmissionRequest,
    db: Session = Depends(get_db),
):
    """
    Evaluates assessment submission in real time: scores answers, analyzes strengths/weaknesses,
    flags remedial points, and credits points.
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return assessment_service.grade_submission(
        db=db,
        profile=profile,
        topic=payload.topic,
        answers=payload.answers,
        time_spent_seconds=payload.timeSpentSeconds,
    )

@router.get("/weak-points", response_model=List[WeakPointSchema])
def get_weak_points(db: Session = Depends(get_db)):
    """
    Retrieves flagged weak points from past tests for remedial path synthesis.
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    return assessment_service.get_weak_points(db, profile.id)

@router.get("/partner-labs", response_model=List[PartnerLabSchema])
def get_partner_labs(db: Session = Depends(get_db)):
    """
    Lists affiliated college/lab test centers and available hands-on practical exam slots.
    """
    return assessment_service.get_partner_labs(db)

@router.post("/book-lab-slot", response_model=LabBookingResponse)
def book_lab_slot(
    payload: LabBookingRequest,
    db: Session = Depends(get_db),
):
    """
    Reserves a proctored in-person hands-on test slot at a partner facility.
    """
    profile = db.query(LearnerProfile).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    try:
        return assessment_service.book_lab_slot(
            db=db,
            profile=profile,
            slot_id=payload.slotId,
            domain=payload.domain,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
