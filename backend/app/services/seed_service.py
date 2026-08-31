import json
from sqlalchemy.orm import Session
from backend.app.models.models import (
    LearnerProfile,
    PersonaScore,
    ProfileHistory,
    Role,
    Roadmap,
    Milestone,
    SyllabusModule,
    AssessmentTopic,
    Question,
    Certificate,
    PartnerLab,
    LabSlot,
    CommunityPost,
    PostAnswer,
    StudyGroup,
    RewardItem,
    LeaderboardRecord,
    CohortMetric,
)
from backend.app.services.roadmap_service import roadmap_service

def seed_database_if_empty(db: Session):
    """
    Populates the database with initial scholarly demo data if empty.
    """
    if db.query(LearnerProfile).first() is not None:
        return  # Already seeded

    # 1. Learner Profile
    profile = LearnerProfile(
        id="eleanor-vance",
        name="Eleanor Vance",
        email="eleanor.vance@trailmark.ai",
        avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        current_role="Marketing Analytics Specialist",
        target_role="AI Engineer",
        target_timeline_months=18,
        persona="digger",
        scholar_level="Fellow, Stage II",
        joined_date="Autumn 2025",
        total_points=1420,
        streak_days=19,
        freeze_days_available=2,
        current_module_id="mod-02",
        weekly_goal_hours=12.0,
        hours_completed_this_week=8.5,
        bio="Pivoting from quantitative marketing analysis into deep learning systems and transformer architectures.",
        preferred_language="English",
    )
    db.add(profile)
    db.flush()

    # Persona Score Weights
    ps = PersonaScore(
        profile_id=profile.id,
        digger_weight=0.65,
        surface_weight=0.20,
        motivation_weight=0.15,
    )
    db.add(ps)

    # 2. Roles & Skill Overlap
    roles_data = [
        {
            "id": "ai-engineer",
            "title": "AI Engineer",
            "match_percentage": 89,
            "salary_range": "$165k - $215k",
            "tag": "Top Match",
            "summary": "Designs, develops, and deploys high-scale deep learning models, custom transformer blocks, and production inference microservices.",
            "alignment_reason": "High synergy with your statistical modeling background. Main areas for growth are high-throughput tensor operations and PyTorch CUDA kernels.",
            "milestones_count": 4,
            "est_time_to_mastery": "6-8 Months",
            "primary_domain": "Artificial Intelligence",
            "market_demand": "Very High (+34% YoY)",
            "skills": [
                {"name": "Statistical Machine Learning", "matchScore": 94, "status": "strong"},
                {"name": "Python & NumPy Acceleration", "matchScore": 88, "status": "strong"},
                {"name": "Deep Learning & AutoDiff", "matchScore": 72, "status": "emerging"},
                {"name": "Transformer Architecture & Attention", "matchScore": 60, "status": "gap"},
                {"name": "Production MLOps & vLLM Serving", "matchScore": 45, "status": "gap"},
            ]
        },
        {
            "id": "ml-engineer",
            "title": "Machine Learning Systems Engineer",
            "match_percentage": 78,
            "salary_range": "$150k - $190k",
            "tag": "High Growth",
            "summary": "Focuses on scalable ML pipelines, model lifecycle management, feature stores, and distributed training clusters.",
            "alignment_reason": "Builds upon your structured data pipeline familiarity, requiring expansion into distributed Ray orchestration.",
            "milestones_count": 5,
            "est_time_to_mastery": "7-9 Months",
            "primary_domain": "ML Infrastructure",
            "market_demand": "High (+26% YoY)",
            "skills": [
                {"name": "Data Pipelines & SQL", "matchScore": 96, "status": "strong"},
                {"name": "scikit-learn Modeling", "matchScore": 90, "status": "strong"},
                {"name": "Docker & Kubernetes Orchestration", "matchScore": 65, "status": "emerging"},
                {"name": "Distributed Training (Ray/Dask)", "matchScore": 40, "status": "gap"},
            ]
        },
        {
            "id": "data-architect",
            "title": "Enterprise Data & AI Architect",
            "match_percentage": 71,
            "salary_range": "$175k - $230k",
            "tag": "Strategic Pivot",
            "summary": "Architects enterprise data meshes, lakehouses, vector database embeddings, and governance frameworks for enterprise AI readiness.",
            "alignment_reason": "Directly utilizes your analytics leadership experience, prioritizing governance and cloud data architecture over raw model training.",
            "milestones_count": 4,
            "est_time_to_mastery": "5-7 Months",
            "primary_domain": "Data Architecture",
            "market_demand": "High (+20% YoY)",
            "skills": [
                {"name": "Data Warehousing & Modeling", "matchScore": 92, "status": "strong"},
                {"name": "Cross-Functional Analytics Strategy", "matchScore": 95, "status": "strong"},
                {"name": "Vector DB & RAG Architectures", "matchScore": 55, "status": "gap"},
                {"name": "Enterprise AI Governance", "matchScore": 50, "status": "gap"},
            ]
        }
    ]

    for r_dict in roles_data:
        r = Role(
            id=r_dict["id"],
            title=r_dict["title"],
            match_percentage=r_dict["match_percentage"],
            salary_range=r_dict["salary_range"],
            tag=r_dict["tag"],
            summary=r_dict["summary"],
            alignment_reason=r_dict["alignment_reason"],
            milestones_count=r_dict["milestones_count"],
            est_time_to_mastery=r_dict["est_time_to_mastery"],
            primary_domain=r_dict["primary_domain"],
            market_demand=r_dict["market_demand"],
            skills_json=json.dumps(r_dict["skills"]),
        )
        db.add(r)

    # 3. Create Initial Roadmap
    roadmap_service.generate_roadmap_for_role(db, profile, "ai-engineer", "digger")

    # 4. Assessment Topics & Questions
    topic = AssessmentTopic(
        id="topic-dl-fundamentals",
        name="Deep Learning Fundamentals",
        domain="Artificial Intelligence",
        description="Comprehensive adaptive examination covering reverse-mode autodiff, loss geometry, activation dynamics, and optimizer regularization.",
    )
    db.add(topic)
    db.flush()

    questions_data = [
        {
            "id": "q-01",
            "question_number": 1,
            "total_questions": 5,
            "level": "Intermediate",
            "prompt": "Consider a deep neural network where gradients vanish in early layers during backpropagation. Which activation function formulation mathematically preserves non-saturating gradients for positive activations?",
            "code_snippet": "# Canonical PyTorch activation definition:\nclass CustomActivation(nn.Module):\n    def forward(self, x):\n        return torch.max(torch.zeros_like(x), x)",
            "options": [
                {"id": "opt-1", "text": "Sigmoid: σ(x) = 1 / (1 + exp(-x))"},
                {"id": "opt-2", "text": "Hyperbolic Tangent: tanh(x)"},
                {"id": "opt-3", "text": "Rectified Linear Unit (ReLU): f(x) = max(0, x)"},
                {"id": "opt-4", "text": "Softmax over dimension -1"},
            ],
            "correct_option_id": "opt-3",
            "explanation": "ReLU has a constant derivative f'(x) = 1 for all x > 0, preventing the exponential decay of gradient signals across deep layers that plagues sigmoid and tanh.",
            "citation": "Glorot, X., & Bengio, Y. (2010). Understanding the difficulty of training deep feedforward neural networks.",
            "concept_tag": "Activation Function Convergence",
        },
        {
            "id": "q-02",
            "question_number": 2,
            "total_questions": 5,
            "level": "Advanced",
            "prompt": "Why does AdamW decouple weight decay from the gradient update step, in contrast to standard L2 regularization in classical Adam?",
            "code_snippet": "# AdamW update step:\n# θ_{t+1} = θ_t - η_t * λ * θ_t - (η_t / (sqrt(v̂_t) + ε)) * m̂_t",
            "options": [
                {"id": "opt-1", "text": "To increase computational throughput by skipping tensor norm calculation."},
                {"id": "opt-2", "text": "In standard Adam, L2 penalty gets scaled inversely by historical gradient magnitudes (sqrt(v_t)), causing parameters with large gradients to decay disproportionately slowly."},
                {"id": "opt-3", "text": "To enforce sparse L1 lasso weights in Transformer MLP layers."},
                {"id": "opt-4", "text": "Decoupled weight decay is only required for batch normalization layers."},
            ],
            "correct_option_id": "opt-2",
            "explanation": "Loshchilov & Hutter (2019) demonstrated that standard L2 regularization with adaptive moment estimation causes weights with frequent/large gradients to experience less relative decay than weights with small gradients. AdamW corrects this by subtracting the weight decay directly from theta.",
            "citation": "Loshchilov, I., & Hutter, F. (2019). Decoupled Weight Decay Regularization. ICLR.",
            "concept_tag": "Decoupled Weight Decay Dynamics (AdamW vs L2)",
        },
        {
            "id": "q-03",
            "question_number": 3,
            "total_questions": 5,
            "level": "Advanced",
            "prompt": "In Scaled Dot-Product Attention, what is the mathematical rationale for dividing QK^T by sqrt(d_k)?",
            "code_snippet": "Attention(Q, K, V) = softmax( (Q @ K.T) / math.sqrt(d_k) ) @ V",
            "options": [
                {"id": "opt-1", "text": "To prevent the dot products from growing large in magnitude, which pushes the softmax function into regions with vanishingly small gradients."},
                {"id": "opt-2", "text": "To normalize the attention matrix so rows sum to exactly zero."},
                {"id": "opt-3", "text": "To invert the matrix determinant for faster SRAM caching."},
                {"id": "opt-4", "text": "To convert the attention scores into Gaussian probability densities."},
            ],
            "correct_option_id": "opt-1",
            "explanation": "For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. Scaling by 1/sqrt(d_k) counteracts this effect.",
            "citation": "Vaswani et al. (2017). Attention Is All You Need. NeurIPS.",
            "concept_tag": "Scaled Dot-Product Numerical Stability",
        },
        {
            "id": "q-04",
            "question_number": 4,
            "total_questions": 5,
            "level": "Intermediate",
            "prompt": "What primary advantage does He (Kaiming) initialization provide over Xavier (Glorot) initialization for networks with ReLU activation functions?",
            "code_snippet": "# Kaiming Normal:\nstd = math.sqrt(2.0 / fan_in)",
            "options": [
                {"id": "opt-1", "text": "It accounts for the fact that ReLU zeroes out approximately half of the neurons, adjusting variance by a factor of 2."},
                {"id": "opt-2", "text": "It guarantees that all initial weights are strictly positive."},
                {"id": "opt-3", "text": "It eliminates the need for learning rate schedules."},
                {"id": "opt-4", "text": "It enforces orthogonality between weight matrices across adjacent layers."},
            ],
            "correct_option_id": "opt-1",
            "explanation": "Because ReLU rectifies negative inputs to zero, the variance of the layer outputs is halved. Kaiming initialization compensates by setting the variance to 2/fan_in instead of 1/fan_in.",
            "citation": "He, K. et al. (2015). Delving Deep into Rectifiers. ICCV.",
            "concept_tag": "Weight Initialization (He/Xavier)",
        },
        {
            "id": "q-05",
            "question_number": 5,
            "total_questions": 5,
            "level": "Advanced",
            "prompt": "During reverse-mode automatic differentiation on a matrix multiplication Y = XW, what is the tensor derivative dL/dX given upstream gradient dL/dY?",
            "code_snippet": "# Dimensions: X: (N, D), W: (D, M), Y: (N, M), dL/dY: (N, M)",
            "options": [
                {"id": "opt-1", "text": "dL/dX = (dL/dY) @ W.T"},
                {"id": "opt-2", "text": "dL/dX = W.T @ (dL/dY)"},
                {"id": "opt-3", "text": "dL/dX = X.T @ (dL/dY)"},
                {"id": "opt-4", "text": "dL/dX = (dL/dY) * W"},
            ],
            "correct_option_id": "opt-1",
            "explanation": "Applying the matrix calculus chain rule: dL/dX = (dL/dY) @ W^T, matching dimension (N, M) @ (M, D) -> (N, D).",
            "citation": "Goodfellow et al. (2016). Deep Learning. MIT Press.",
            "concept_tag": "Backpropagation Vectorization",
        }
    ]

    for q_dict in questions_data:
        q = Question(
            id=q_dict["id"],
            topic_id=topic.id,
            question_number=q_dict["question_number"],
            total_questions=q_dict["total_questions"],
            level=q_dict["level"],
            prompt=q_dict["prompt"],
            code_snippet=q_dict["code_snippet"],
            options_json=json.dumps(q_dict["options"]),
            correct_option_id=q_dict["correct_option_id"],
            explanation=q_dict["explanation"],
            citation=q_dict["citation"],
            concept_tag=q_dict["concept_tag"],
        )
        db.add(q)

    # 5. Certificate
    cert = Certificate(
        id="cert-eleanor-vance",
        certificate_number="TM-2025-88492-DL",
        profile_id=profile.id,
        recipient_name="Eleanor Vance",
        recipient_title="Chartered Machine Learning Scholar",
        path_title="Advanced Machine Learning & Neural Systems",
        completion_date="Winter 2025",
        grade="High Distinction (96.4%)",
        verified_competencies_json=json.dumps([
            "Reverse-Mode AutoDiff Implementation",
            "Multi-Head Attention & Transformer Block Assembly",
            "Decoupled Weight Decay & Non-Convex Optimization",
            "FlashAttention Memory Tiling & Triton Kernels",
            "LoRA Parameter-Efficient Fine-Tuning",
        ]),
        issuer="Trailmark Academic Institute & HCL Consortium",
        verification_hash="0x8f4d9a2b1c7e6f0a3b5c8d9e2f4a6b8c1d3e5f7a9b0c2d4e6f8a1b3c5d7e9f0",
        honors_distinction="Magna Cum Laude in Algorithmic Rigor",
    )
    db.add(cert)

    # 6. Partner Labs
    labs_data = [
        {
            "id": "lab-stanford",
            "name": "Stanford AI & Robotics Collaborative Facility",
            "location": "Palo Alto, CA",
            "address": "450 Serra Mall, Stanford, CA 94305",
            "facilities": ["NVIDIA H100 GPU Pods", "Robotics Manipulation Benches", "Edge TPU Testbeds"],
            "slots": [
                {"id": "slot-01", "date": "2026-09-12", "start_time": "10:00 AM", "end_time": "01:00 PM", "capacity": 12, "booked_count": 4},
                {"id": "slot-02", "date": "2026-09-19", "start_time": "02:00 PM", "end_time": "05:00 PM", "capacity": 12, "booked_count": 9},
            ]
        },
        {
            "id": "lab-mit",
            "name": "MIT Lincoln Edge AI & Hardware Center",
            "location": "Cambridge, MA",
            "address": "77 Massachusetts Ave, Cambridge, MA 02139",
            "facilities": ["FPGA Synthesis Rigs", "Neuromorphic Computing Lab", "RF Signal Analyzers"],
            "slots": [
                {"id": "slot-03", "date": "2026-09-15", "start_time": "09:00 AM", "end_time": "12:00 PM", "capacity": 15, "booked_count": 6},
            ]
        }
    ]

    for l_dict in labs_data:
        lab = PartnerLab(
            id=l_dict["id"],
            name=l_dict["name"],
            location=l_dict["location"],
            address=l_dict["address"],
            facilities_json=json.dumps(l_dict["facilities"]),
        )
        db.add(lab)
        db.flush()

        for s_dict in l_dict["slots"]:
            slot = LabSlot(
                id=s_dict["id"],
                lab_id=lab.id,
                date=s_dict["date"],
                start_time=s_dict["start_time"],
                end_time=s_dict["end_time"],
                capacity=s_dict["capacity"],
                booked_count=s_dict["booked_count"],
            )
            db.add(slot)

    # 7. Community Posts & Answers
    post1 = CommunityPost(
        id="post-01",
        author_name="Marcus Aurelius",
        author_avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        author_role="AI Systems Fellow",
        author_scholar_level="Fellow, Stage III",
        timestamp_str="2 hours ago",
        domain_tag="Deep Learning",
        title="Deriving exact gradient flow through LayerNorm vs RMSNorm in Transformer backprop",
        content="When computing the backward pass for LayerNorm, we subtract the mean gradient component across the feature dimension. In RMSNorm (Zhang & Sennrich 2019), does skipping mean centering introduce measurable drift in early attention layers during 7B+ pretraining?",
        code_snippet="def rms_norm_backward(dL_dY, X, gamma, eps=1e-6):\n    rms = torch.sqrt(torch.mean(X ** 2, dim=-1, keepdim=True) + eps)\n    # Notice absence of mean centering term\n    return (dL_dY * gamma) / rms - X * (torch.sum(dL_dY * gamma * X, dim=-1, keepdim=True) / (rms**3 * X.shape[-1]))",
        upvotes=24,
        replies_count=2,
        is_helpful_answered=True,
        tags_json=json.dumps(["Deep Learning", "RMSNorm", "Transformers", "Backpropagation"]),
    )
    db.add(post1)
    db.flush()

    ans1 = PostAnswer(
        id="ans-01",
        post_id=post1.id,
        author_name="Elena Rostova",
        author_avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        author_role="Staff Research Scientist",
        badge="Lead Reviewer",
        timestamp_str="1 hour ago",
        content="Empirically, LLaMA and Mistral demonstrate zero instability from omitting the mean calculation. Because the activations are already zero-centered after attention residual connections, scaling by the Root Mean Square alone retains ~99.2% of the gradient variance while saving ~18% memory access in SRAM tiling.",
        upvotes=18,
        is_accepted=True,
    )
    db.add(ans1)

    # 8. Study Groups
    study_groups_data = [
        {
            "id": "group-01",
            "name": "Cohort Alpha: Deep Learning Fundamentals",
            "domain": "Deep Learning",
            "description": "Weekly rigorous proof dissection and code reviews for scholars enrolled in the AI Engineering track.",
            "active_members_count": 24,
            "current_topic": "Multi-Head Attention Vectorization & FlashAttention Proofs",
            "next_sync_time": "Thursday 18:00 UTC",
            "is_live": True,
            "room_url": "https://meet.trailmark.ai/cohort-alpha",
        },
        {
            "id": "group-02",
            "name": "Transformer Architecture Reading Group",
            "domain": "Natural Language Processing",
            "description": "Analyzing arXiv preprints on Rotary Embeddings, State Space Models (Mamba), and MoE routing.",
            "active_members_count": 42,
            "current_topic": "Mamba-2 State Space Duality with Attention",
            "next_sync_time": "Saturday 15:00 UTC",
            "is_live": False,
            "room_url": "https://meet.trailmark.ai/transformer-readers",
        }
    ]

    for g_dict in study_groups_data:
        g = StudyGroup(
            id=g_dict["id"],
            name=g_dict["name"],
            domain=g_dict["domain"],
            description=g_dict["description"],
            active_members_count=g_dict["active_members_count"],
            current_topic=g_dict["current_topic"],
            next_sync_time=g_dict["next_sync_time"],
            is_live=g_dict["is_live"],
            room_url=g_dict["room_url"],
        )
        db.add(g)

    # 9. Rewards Items
    rewards_data = [
        {"id": "r-01", "title": "1-on-1 Research Mentorship Session", "category": "Mentorship", "point_cost": 800, "icon": "psychology", "description": "45-minute private architecture review with a Principal AI Engineer or Faculty Mentor.", "available": True},
        {"id": "r-02", "title": "500 GPU Cluster Compute Credits", "category": "Resource", "point_cost": 500, "icon": "memory", "description": "Dedicated H100 GPU compute hours for training your custom capstone model.", "available": True},
        {"id": "r-03", "title": "Exclusive IEEE / NeurIPS Paper Archive Pass", "category": "Resource", "point_cost": 300, "icon": "menu_book", "description": "Full access to curated academic repositories with annotated scholar marginalia.", "available": True},
        {"id": "r-04", "title": "Distinction Medal: Algorithmic Rigor", "category": "Badge", "point_cost": 250, "icon": "military_tech", "description": "Digital credential badge displayed on your public profile and LinkedIn certificate.", "available": True},
    ]

    for rw in rewards_data:
        r_item = RewardItem(
            id=rw["id"],
            title=rw["title"],
            category=rw["category"],
            point_cost=rw["point_cost"],
            icon=rw["icon"],
            description=rw["description"],
            available=rw["available"],
        )
        db.add(r_item)

    # 10. Leaderboard Records
    leaderboard_data = [
        {"rank": 1, "name": "Elena Rostova", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "domain": "AI Engineering", "points": 2840, "streak_days": 42, "badge": "Grand Scholar", "change": "same"},
        {"rank": 2, "name": "Julian Thorne", "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "domain": "AI Engineering", "points": 2490, "streak_days": 31, "badge": "Lead Reviewer", "change": "up"},
        {"rank": 3, "name": "Eleanor Vance", "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "domain": "AI Engineering", "points": 1420, "streak_days": 19, "badge": "Fellow II", "change": "up"},
        {"rank": 4, "name": "Marcus Aurelius", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "domain": "ML Infrastructure", "points": 1380, "streak_days": 15, "badge": "Scholar", "change": "down"},
        {"rank": 5, "name": "David Kim", "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150", "domain": "Data Architecture", "points": 1120, "streak_days": 8, "badge": "Scholar", "change": "same"},
    ]

    for lb in leaderboard_data:
        rec = LeaderboardRecord(
            rank=lb["rank"],
            name=lb["name"],
            avatar=lb["avatar"],
            domain=lb["domain"],
            points=lb["points"],
            streak_days=lb["streak_days"],
            badge=lb["badge"],
            change=lb["change"],
        )
        db.add(rec)

    # 11. Cohort Metric for Leader Dashboard
    cohort = CohortMetric(
        id="cohort-alpha",
        cohort_name="Cohort Alpha Leader Dashboard",
        domain="Deep Learning Fundamentals",
        total_enrolled=24,
        avg_mastery=84,
        peer_review_velocity=2.4,
        engagement_level="High",
        active_sync_session=True,
        scholars_json=json.dumps([
            {"name": "Elena Rostova", "mastery": "94%", "velocity": "3.1 / wk", "status": "Excelling", "alert": "Praise eligible"},
            {"name": "Eleanor Vance", "mastery": "92%", "velocity": "2.8 / wk", "status": "On Track", "alert": "Milestone 2 Active"},
            {"name": "Marcus Aurelius", "mastery": "82%", "velocity": "2.2 / wk", "status": "On Track", "alert": "Review Target: LoRA"},
            {"name": "Julian Thorne", "mastery": "76%", "velocity": "1.9 / wk", "status": "Pacing", "alert": "Stalled on Module 3"},
            {"name": "David Kim", "mastery": "68%", "velocity": "1.2 / wk", "status": "Needs Support", "alert": "Prerequisite support needed"},
        ]),
        facilitator_alerts_json=json.dumps([
            {"severity": "Info", "message": "Elena Rostova & Eleanor Vance are pacing in the 90th percentile. Consider assigning them peer mentors for Module 4.", "recommendedAction": "Send Praise"}
        ]),
    )
    db.add(cohort)

    db.commit()
