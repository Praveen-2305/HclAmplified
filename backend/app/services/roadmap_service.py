import json
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.app.models.models import Roadmap, Milestone, SyllabusModule, LearnerProfile
from backend.app.schemas.schemas import (
    RoadmapResponseSchema,
    RoadmapMilestoneSchema,
    SyllabusModuleSchema,
    DiggerDeepDiveSchema,
    LearningPersona,
)

class RoadmapService:
    """
    Personalized Learning Path Generator & Curriculum Builder.
    Generates structured milestone DAGs with prerequisites, Digger vs Surface adaptations,
    and handles human-in-the-loop approvals.
    """

    def get_or_create_roadmap(
        self,
        db: Session,
        profile: LearnerProfile,
        role_id: str = "ai-engineer",
        persona: LearningPersona = "digger",
    ) -> RoadmapResponseSchema:
        roadmap = db.query(Roadmap).filter(Roadmap.profile_id == str(profile.id)).first()
        if not roadmap:
            roadmap = self.generate_roadmap_for_role(db, profile, role_id, persona)

        return self.format_roadmap_response(roadmap, persona)

    def generate_roadmap_for_role(
        self,
        db: Session,
        profile: LearnerProfile,
        role_id: str,
        persona: LearningPersona = "digger",
        weekly_hours: float = 12.0,
    ) -> Roadmap:
        # Delete existing roadmaps for this profile if regenerating
        existing = db.query(Roadmap).filter(Roadmap.profile_id == str(profile.id)).all()
        for r in existing:
            db.delete(r)
        db.commit()

        role_title = "AI Engineer"
        if role_id == "ml-engineer":
            role_title = "Machine Learning Systems Engineer"
        elif role_id == "data-architect":
            role_title = "Enterprise Data & AI Architect"
        elif role_id == "nlp-specialist":
            role_title = "NLP & LLM Specialist"

        new_roadmap = Roadmap(
            id=f"roadmap-{profile.id}",
            profile_id=str(profile.id),
            role_id=role_id,
            title=f"Custom Syllabus: {role_title}",
            is_approved=True,
        )
        db.add(new_roadmap)
        db.flush()

        # Generate 4 structured milestones
        milestone_data: List[Dict[str, Any]] = [
            {
                "id": "ms-01",
                "number": 1,
                "title": "Mathematics & Convex Optimization",
                "description": "Foundational linear algebra, vector calculus, Lagrangian multipliers, and matrix decompositions essential for numerical gradient descent.",
                "status": "completed",
                "completed_date": "Completed Oct 14, 2025",
                "estimated_hours": 24,
                "badge_title": "Foundations Master",
                "surface_summary": [
                    "Vector/Matrix dot products, eigenvalues, and SVD decomposition.",
                    "Multivariate gradients, Jacobians, and Hessians.",
                    "Convexity conditions and gradient descent step size bounds.",
                ],
                "digger_reading_list": [
                    "Strang, G. (2019). Linear Algebra and Learning from Data. Wellesley-Cambridge Press.",
                    "Boyd, S., & Vandenberghe, L. (2004). Convex Optimization. Cambridge University Press.",
                ],
                "digger_academic_papers": [
                    "Bottou, L. (2010). Large-Scale Machine Learning with Stochastic Gradient Descent. COMPSTAT.",
                ],
                "digger_foundation": "Derivation of Lipschitz continuous gradients to establish standard step size convergence $\\eta \\le \\frac{1}{L}$ in non-convex manifolds.",
                "modules": [
                    {"id": "m1-01", "title": "Vector Spaces & Matrix Decompositions (SVD)", "type": "concept", "duration": "45 min", "completed": True, "citations": ["Strang (2019)"]},
                    {"id": "m1-02", "title": "Multivariate Jacobians & Hessian Matrices", "type": "concept", "duration": "55 min", "completed": True, "citations": ["Boyd (2004)"]},
                    {"id": "m1-03", "title": "Interactive Proofs: Gradient Descent Convergence", "type": "lab", "duration": "1 hr 30 min", "completed": True, "citations": ["Bottou (2010)"]},
                    {"id": "m1-04", "title": "Checkpoint Exam: Linear Algebra & Optimization", "type": "assessment", "duration": "45 min", "completed": True},
                ]
            },
            {
                "id": "ms-02",
                "number": 2,
                "title": "Deep Learning Fundamentals & Tensors",
                "description": "Computational graphs, reverse-mode autodiff, loss landscapes, normalization techniques, and custom CUDA tensor operations.",
                "status": "in_progress",
                "completed_date": None,
                "estimated_hours": 32,
                "badge_title": "Tensor Architect",
                "surface_summary": [
                    "Backpropagation computational graphs and chain rule flow.",
                    "Activation dynamics: ReLU, GELU, and dying gradient mitigations.",
                    "Batch Normalization vs Layer Normalization trade-offs.",
                    "Adam vs AdamW weight decay decoupling.",
                ],
                "digger_reading_list": [
                    "Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.",
                    "Paszke, A. et al. (2019). PyTorch: An Imperative Style, High-Performance Deep Learning Library. NeurIPS.",
                ],
                "digger_academic_papers": [
                    "Loshchilov, I., & Hutter, F. (2019). Decoupled Weight Decay Regularization. ICLR.",
                    "Ioffe, S., & Szegedy, C. (2015). Batch Normalization: Accelerating Deep Network Training. ICML.",
                ],
                "digger_foundation": "Analytical formulation of reverse-mode automatic differentiation $\\frac{\\partial \\mathcal{L}}{\\partial W_l} = \\delta_l a_{l-1}^T$ with tensorized broadcast mechanics.",
                "modules": [
                    {"id": "m2-01", "title": "Computational Graphs & Reverse-Mode AutoDiff", "type": "concept", "duration": "50 min", "completed": True, "citations": ["Goodfellow et al. (2016)"]},
                    {"id": "m2-02", "title": "Loss Surface Topography & Activation Saturation", "type": "concept", "duration": "1 hr 15 min", "completed": False, "citations": ["Glorot & Bengio (2010)"]},
                    {"id": "m2-03", "title": "Lab: Building Custom Autograd Engine from Scratch", "type": "lab", "duration": "2 hrs", "completed": False, "citations": ["Paszke et al. (2019)"]},
                    {"id": "m2-04", "title": "Adaptive Assessment: Deep Learning Foundations", "type": "assessment", "duration": "1 hr", "completed": False},
                ]
            },
            {
                "id": "ms-03",
                "number": 3,
                "title": "Sequence Models & Transformer Architectures",
                "description": "Multi-head scaled dot-product attention, positional embeddings (RoPE, ALiBi), causal masking, and decoder-only generative models.",
                "status": "locked",
                "completed_date": None,
                "estimated_hours": 40,
                "badge_title": "Transformer Scholar",
                "surface_summary": [
                    "Scaled Dot-Product Attention: $Q, K, V$ projections and softmax scaling.",
                    "Rotary Positional Embeddings (RoPE) and context window extension.",
                    "Decoder-only transformer block assembly and KV-cache caching.",
                ],
                "digger_reading_list": [
                    "Vaswani, A. et al. (2017). Attention Is All You Need. NeurIPS.",
                    "Su, J. et al. (2024). RoFormer: Enhanced Transformer with Rotary Position Embedding. Neurocomputing.",
                ],
                "digger_academic_papers": [
                    "Dao, T. et al. (2022). FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness. NeurIPS.",
                ],
                "digger_foundation": "Derivation of attention complexity $\\mathcal{O}(N^2 d)$ and SRAM tiling proofs for IO-aware FlashAttention forward/backward kernels.",
                "modules": [
                    {"id": "m3-01", "title": "Scaled Dot-Product & Multi-Head Attention Proofs", "type": "concept", "duration": "1 hr 10 min", "completed": False, "citations": ["Vaswani et al. (2017)"]},
                    {"id": "m3-02", "title": "Positional Encodings: Sinusoidal, Learnable & RoPE", "type": "concept", "duration": "55 min", "completed": False, "citations": ["Su et al. (2024)"]},
                    {"id": "m3-03", "title": "Lab: Implementing FlashAttention Tiling in Triton", "type": "lab", "duration": "2 hrs 30 min", "completed": False, "citations": ["Dao et al. (2022)"]},
                    {"id": "m3-04", "title": "Capstone Project: 125M Parameter Decoder-Only LLM", "type": "project", "duration": "4 hrs", "completed": False},
                ]
            },
            {
                "id": "ms-04",
                "number": 4,
                "title": "Production Serving, Quantization & Alignment",
                "description": "Post-training quantization (GPTQ, AWQ), LoRA parameter-efficient fine-tuning, vLLM continuous batching, and RLHF / DPO alignment.",
                "status": "locked",
                "completed_date": None,
                "estimated_hours": 36,
                "badge_title": "Production Master",
                "surface_summary": [
                    "4-bit / 8-bit weight-only quantization vs activation quantization.",
                    "LoRA low-rank adaptation matrix factorization $W_0 + \\frac{\\alpha}{r} BA$.",
                    "Continuous batching, PagedAttention, and high-throughput serving.",
                ],
                "digger_reading_list": [
                    "Hu, E. J. et al. (2021). LoRA: Low-Rank Adaptation of Large Language Models. ICLR.",
                    "Rafailov, R. et al. (2023). Direct Preference Optimization: Your Language Model is Secretly a Reward Model. NeurIPS.",
                ],
                "digger_academic_papers": [
                    "Kwon, W. et al. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. SOSP.",
                ],
                "digger_foundation": "Low-rank singular value decomposition properties proving rank $r \\ll d$ preservation of gradient subspace during task adaptation.",
                "modules": [
                    {"id": "m4-01", "title": "Quantization Dynamics: INT4/INT8 FP Rounding Errors", "type": "concept", "duration": "1 hr", "completed": False, "citations": ["Dettmers et al. (2022)"]},
                    {"id": "m4-02", "title": "LoRA & QLoRA Low-Rank Mathematical Foundations", "type": "concept", "duration": "1 hr 15 min", "completed": False, "citations": ["Hu et al. (2021)"]},
                    {"id": "m4-03", "title": "Lab: High-Throughput vLLM Cluster Deployment", "type": "lab", "duration": "2 hrs", "completed": False, "citations": ["Kwon et al. (2023)"]},
                    {"id": "m4-04", "title": "Final Proctored Certification Examination", "type": "assessment", "duration": "3 hrs", "completed": False},
                ]
            }
        ]

        for m_dict in milestone_data:
            ms = Milestone(
                id=str(m_dict["id"]),
                roadmap_id=str(new_roadmap.id),
                number=int(m_dict["number"]),
                title=str(m_dict["title"]),
                description=str(m_dict["description"]),
                status=str(m_dict["status"]),
                completed_date=m_dict["completed_date"],
                estimated_hours=int(m_dict["estimated_hours"]),
                badge_title=str(m_dict["badge_title"]),
                surface_summary_json=json.dumps(m_dict["surface_summary"]),
                digger_reading_list_json=json.dumps(m_dict["digger_reading_list"]),
                digger_academic_papers_json=json.dumps(m_dict["digger_academic_papers"]),
                digger_theoretical_foundation=str(m_dict["digger_foundation"]),
                prerequisite_ids_json=json.dumps([f"ms-0{m_dict['number']-1}"] if int(m_dict["number"]) > 1 else []),
            )
            db.add(ms)
            db.flush()

            modules_list: List[Dict[str, Any]] = m_dict.get("modules", [])
            for mod_dict in modules_list:
                mod = SyllabusModule(
                    id=str(mod_dict["id"]),
                    milestone_id=str(ms.id),
                    title=str(mod_dict["title"]),
                    type=str(mod_dict["type"]),
                    duration=str(mod_dict["duration"]),
                    completed=bool(mod_dict["completed"]),
                    digger_notes=f"Detailed academic annotations and proofs for {mod_dict['title']}.",
                    citations_json=json.dumps(mod_dict.get("citations", ["Standard Reference"])),
                )
                db.add(mod)

        db.commit()
        db.refresh(new_roadmap)
        return new_roadmap

    def format_roadmap_response(
        self,
        roadmap: Roadmap,
        persona: LearningPersona = "digger",
    ) -> RoadmapResponseSchema:
        milestone_schemas = []
        for ms in roadmap.milestones:
            mod_schemas = []
            for mod in ms.modules:
                try:
                    cites = json.loads(str(mod.citations_json or "[]"))
                except Exception:
                    cites = []
                
                mod_type = mod.type if mod.type in ["concept", "assessment", "lab", "project"] else "concept"
                mod_schemas.append(
                    SyllabusModuleSchema(
                        id=str(mod.id),
                        title=str(mod.title),
                        type=mod_type,
                        duration=str(mod.duration or "45 min"),
                        completed=bool(mod.completed),
                        diggerNotes=str(mod.digger_notes) if persona == "digger" else None,
                        citations=cites if persona == "digger" else None,
                    )
                )

            try:
                surface_summary = json.loads(str(ms.surface_summary_json or "[]"))
            except Exception:
                surface_summary = []

            try:
                reading_list = json.loads(str(ms.digger_reading_list_json or "[]"))
                academic_papers = json.loads(str(ms.digger_academic_papers_json or "[]"))
            except Exception:
                reading_list, academic_papers = [], []

            deep_dive = DiggerDeepDiveSchema(
                readingList=reading_list,
                academicPapers=academic_papers,
                theoreticalFoundation=str(ms.digger_theoretical_foundation or ""),
            )

            # Adapt milestone description based on persona
            desc = ms.description or ""
            if persona == "surface" and surface_summary:
                desc = " ".join(surface_summary[:2])

            ms_status = ms.status if ms.status in ["completed", "in_progress", "locked"] else "in_progress"

            milestone_schemas.append(
                RoadmapMilestoneSchema(
                    id=str(ms.id),
                    number=int(ms.number or 1),
                    title=str(ms.title or ""),
                    description=desc,
                    status=ms_status,
                    completedDate=str(ms.completed_date) if ms.completed_date else None,
                    estimatedHours=int(ms.estimated_hours or 24),
                    badgeTitle=str(ms.badge_title) if ms.badge_title else None,
                    modules=mod_schemas,
                    diggerDeepDive=deep_dive if persona == "digger" else None,
                    surfaceSummary=surface_summary,
                )
            )

        return RoadmapResponseSchema(
            roadmapId=str(roadmap.id),
            roleId=str(roadmap.role_id),
            roleTitle=str(roadmap.title),
            isApproved=bool(roadmap.is_approved),
            milestones=milestone_schemas,
        )

roadmap_service = RoadmapService()
