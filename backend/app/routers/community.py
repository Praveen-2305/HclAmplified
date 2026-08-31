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
            tags = json.loads(p.tags_json)
        except Exception:
            tags = [p.domain_tag]

        answers = [
            HelpfulAnswerSchema(
                id=a.id,
                author={
                    "name": a.author_name,
                    "avatar": a.author_avatar,
                    "role": a.author_role,
                    "badge": a.badge,
                },
                timestamp=a.timestamp_str,
                content=a.content,
                upvotes=a.upvotes,
                isAccepted=a.is_accepted,
            )
            for a in p.answers
        ]

        results.append(
            CommunityPostSchema(
                id=p.id,
                author={
                    "name": p.author_name,
                    "avatar": p.author_avatar,
                    "role": p.author_role,
                    "scholarLevel": p.author_scholar_level,
                },
                timestamp=p.timestamp_str,
                domainTag=p.domain_tag,
                title=p.title,
                content=p.content,
                codeSnippet=p.code_snippet,
                upvotes=p.upvotes,
                repliesCount=len(p.answers),
                isHelpfulAnswered=p.is_helpful_answered,
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
        author_name=profile.name if profile else "Eleanor Vance",
        author_avatar=profile.avatar if profile else "",
        author_role=profile.target_role if profile else "AI Scholar",
        author_scholar_level=profile.scholar_level if profile else "Fellow, Stage II",
        timestamp_str="Just now",
        domain_tag=payload.domainTag,
        title=payload.title,
        content=payload.content,
        codeSnippet=payload.codeSnippet,
        upvotes=1,
        replies_count=0,
        tags_json=json.dumps(tags),
    )
    db.add(new_post)
    if profile:
        profile.total_points += 20  # Contribution reward
    db.commit()
    db.refresh(new_post)

    return CommunityPostSchema(
        id=new_post.id,
        author={
            "name": new_post.author_name,
            "avatar": new_post.author_avatar,
            "role": new_post.author_role,
            "scholarLevel": new_post.author_scholar_level,
        },
        timestamp=new_post.timestamp_str,
        domainTag=new_post.domain_tag,
        title=new_post.title,
        content=new_post.content,
        codeSnippet=new_post.code_snippet,
        upvotes=new_post.upvotes,
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

    post.upvotes += 1
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
        author_name=profile.name if profile else "Eleanor Vance",
        author_avatar=profile.avatar if profile else "",
        author_role=profile.target_role if profile else "AI Scholar",
        badge="Peer Reviewer",
        timestamp_str="Just now",
        content=payload.content,
        upvotes=1,
        is_accepted=False,
    )
    db.add(ans)
    post.replies_count += 1
    if profile:
        profile.total_points += 35  # Higher contribution points for answering
    db.commit()
    db.refresh(ans)

    return HelpfulAnswerSchema(
        id=ans.id,
        author={
            "name": ans.author_name,
            "avatar": ans.author_avatar,
            "role": ans.author_role,
            "badge": ans.badge,
        },
        timestamp=ans.timestamp_str,
        content=ans.content,
        upvotes=ans.upvotes,
        isAccepted=ans.is_accepted,
    )

@router.get("/study-groups", response_model=List[StudyGroupSchema])
def get_study_groups(db: Session = Depends(get_db)):
    """
    Lists active collaborative study pods and live co-study rooms.
    """
    groups = db.query(StudyGroup).all()
    return [
        StudyGroupSchema(
            id=g.id,
            name=g.name,
            domain=g.domain,
            description=g.description,
            activeMembersCount=g.active_members_count,
            currentTopic=g.current_topic,
            nextSyncTime=g.next_sync_time,
            isLive=g.is_live,
            roomUrl=g.room_url,
        )
        for g in groups
    ]
