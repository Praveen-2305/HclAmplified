import json
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import (
    CommunityPost,
    PostAnswer,
    StudyGroup,
    LearnerProfile,
)
from backend.app.schemas.schemas import (
    CommunityPostSchema,
    HelpfulAnswerSchema,
    CreatePostRequest,
    CreateAnswerRequest,
    StudyGroupSchema,
)

router = APIRouter(prefix="/community", tags=["Peer Learning & Community Module"])

@router.get("/posts", response_model=List[CommunityPostSchema])
def get_posts(
    domain: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    """
    Returns discussion threads and Q&A posts.
    """
    query = db.query(CommunityPost).order_by(CommunityPost.created_at.desc())
    if domain:
        query = query.filter(CommunityPost.domain_tag.ilike(f"%{domain}%"))

    posts = query.all()
    results = []
    for p in posts:
        try:
            tags = json.loads(str(p.tags_json or "[]"))
        except Exception:
            tags = [str(p.domain_tag)]

        answers = [
            HelpfulAnswerSchema(
                id=str(a.id),
                author={
                    "name": str(a.author_name),
                    "avatar": str(a.author_avatar or ""),
                    "role": str(a.author_role or "Peer Reviewer"),
                    "badge": str(a.badge or "Peer Reviewer"),
                },
                timestamp=str(a.timestamp_str or "Just now"),
                content=str(a.content),
                upvotes=int(a.upvotes or 1),
                isAccepted=bool(a.is_accepted),
            )
            for a in p.answers
        ]

        results.append(
            CommunityPostSchema(
                id=str(p.id),
                author={
                    "name": str(p.author_name),
                    "avatar": str(p.author_avatar or ""),
                    "role": str(p.author_role or "Scholar"),
                    "scholarLevel": str(p.author_scholar_level or "Fellow, Stage II"),
                },
                timestamp=str(p.timestamp_str or "Just now"),
                domainTag=str(p.domain_tag or "Deep Learning"),
                title=str(p.title),
                content=str(p.content),
                codeSnippet=str(p.code_snippet) if p.code_snippet else None,
                upvotes=int(p.upvotes or 1),
                repliesCount=len(p.answers),
                isHelpfulAnswered=bool(p.is_helpful_answered),
                answers=answers,
                tags=tags,
            )
        )
    return results

@router.post("/posts", response_model=CommunityPostSchema)
def create_post(
    payload: CreatePostRequest,
    db: Session = Depends(get_db),
):
    """
    Creates a new community discussion thread.
    """
    profile = db.query(LearnerProfile).first()
    post_id = f"post-{uuid.uuid4().hex[:8]}"

    tags = payload.tags or [payload.domainTag]

    new_post = CommunityPost(
        id=post_id,
        author_name=str(profile.name) if profile else "Eleanor Vance",
        author_avatar=str(profile.avatar) if profile else "",
        author_role=str(profile.target_role) if profile else "AI Scholar",
        author_scholar_level=str(profile.scholar_level) if profile else "Fellow, Stage II",
        timestamp_str="Just now",
        domain_tag=payload.domainTag,
        title=payload.title,
        content=payload.content,
        code_snippet=payload.codeSnippet,
        upvotes=1,
        replies_count=0,
        tags_json=json.dumps(tags),
    )
    db.add(new_post)
    if profile:
        profile.total_points = int(profile.total_points or 0) + 20  # Contribution reward
    db.commit()
    db.refresh(new_post)

    return CommunityPostSchema(
        id=str(new_post.id),
        author={
            "name": str(new_post.author_name),
            "avatar": str(new_post.author_avatar or ""),
            "role": str(new_post.author_role or "Scholar"),
            "scholarLevel": str(new_post.author_scholar_level or "Fellow, Stage II"),
        },
        timestamp=str(new_post.timestamp_str or "Just now"),
        domainTag=str(new_post.domain_tag),
        title=str(new_post.title),
        content=str(new_post.content),
        codeSnippet=str(new_post.code_snippet) if new_post.code_snippet else None,
        upvotes=int(new_post.upvotes or 1),
        repliesCount=0,
        isHelpfulAnswered=False,
        answers=[],
        tags=tags,
    )

@router.post("/posts/{post_id}/upvote")
def upvote_post(post_id: str, db: Session = Depends(get_db)):
    """
    Upvotes a discussion post.
    """
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.upvotes = int(post.upvotes or 0) + 1
    db.commit()
    return {"success": True, "upvotes": post.upvotes}

@router.post("/posts/{post_id}/answers", response_model=HelpfulAnswerSchema)
def add_answer(
    post_id: str,
    payload: CreateAnswerRequest,
    db: Session = Depends(get_db),
):
    """
    Submits a helpful answer to a discussion thread.
    """
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    profile = db.query(LearnerProfile).first()
    answer_id = f"ans-{uuid.uuid4().hex[:8]}"

    ans = PostAnswer(
        id=answer_id,
        post_id=post.id,
        author_name=str(profile.name) if profile else "Eleanor Vance",
        author_avatar=str(profile.avatar) if profile else "",
        author_role=str(profile.target_role) if profile else "AI Scholar",
        badge="Peer Reviewer",
        timestamp_str="Just now",
        content=payload.content,
        upvotes=1,
        is_accepted=False,
    )
    db.add(ans)
    post.replies_count = int(post.replies_count or 0) + 1
    if profile:
        profile.total_points = int(profile.total_points or 0) + 35  # Higher contribution points for answering
    db.commit()
    db.refresh(ans)

    return HelpfulAnswerSchema(
        id=str(ans.id),
        author={
            "name": str(ans.author_name),
            "avatar": str(ans.author_avatar or ""),
            "role": str(ans.author_role or "Peer Reviewer"),
            "badge": str(ans.badge or "Peer Reviewer"),
        },
        timestamp=str(ans.timestamp_str or "Just now"),
        content=str(ans.content),
        upvotes=int(ans.upvotes or 1),
        isAccepted=bool(ans.is_accepted),
    )

@router.get("/study-groups", response_model=List[StudyGroupSchema])
def get_study_groups(db: Session = Depends(get_db)):
    """
    Lists active collaborative study pods and live co-study rooms.
    """
    groups = db.query(StudyGroup).all()
    return [
        StudyGroupSchema(
            id=str(g.id),
            name=str(g.name),
            domain=str(g.domain),
            description=str(g.description or ""),
            activeMembersCount=int(g.active_members_count or 0),
            currentTopic=str(g.current_topic or ""),
            nextSyncTime=str(g.next_sync_time or ""),
            isLive=bool(g.is_live),
            roomUrl=str(g.room_url) if g.room_url else None,
        )
        for g in groups
    ]
