from fastapi import APIRouter
from backend.app.schemas.schemas import (
    AiGuideRequest,
    AiGuideResponse,
    ExplainStepRequest,
)
from backend.app.services.ai_service import ai_service

router = APIRouter(prefix="/ai-guide", tags=["AI Explainability & Persistent Trail Guide"])

@router.post("/chat", response_model=AiGuideResponse)
async def chat_with_trail_guide(payload: AiGuideRequest):
    """
    Persistent Trail Guide AI tutor: answers queries with theoretical depth,
    LaTeX equations, and literature citations.
    """
    result = await ai_service.answer_ai_guide(
        prompt=payload.prompt,
        topic=payload.topic or "Deep Learning Fundamentals",
        mode=payload.mode or "digger",
        current_milestone=payload.currentMilestone or "Milestone 2",
    )
    return AiGuideResponse(**result)

@router.post("/explain-step", response_model=AiGuideResponse)
async def explain_roadmap_step(payload: ExplainStepRequest):
    """
    Explainability Engine: Explains why a specific roadmap step/module was recommended.
    """
    prompt = f"Explain why milestone {payload.milestoneId} is placed here for target role {payload.targetRole}."
    result = await ai_service.answer_ai_guide(
        prompt=prompt,
        topic=payload.targetRole,
        mode="digger",
        current_milestone=payload.milestoneId,
    )
    return AiGuideResponse(**result)
