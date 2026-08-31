# 🌟 Trailmark AI — Adaptive AI Learning & Career Trajectory Platform
### *Empowering scholars and engineers to master deep technology through personalized, theory-grounded learning trajectories.*

**Team: The Uncompiled** · **HCL Amplified Initiative**

---

## 📌 Overview

**Trailmark AI** is a next-generation, full-stack adaptive learning and career acceleration platform. Designed for engineers, data practitioners, and career pivoters, Trailmark transforms ambiguous career goals into rigorous, mathematically grounded, and personalized learning pathways.

Whether a learner prefers deep theoretical foundations with LaTeX mathematical proofs and arXiv literature (**Digger Mode**) or rapid, high-yield executive summaries with practical checkpoints (**Surface Mode**), Trailmark calibrates to their learning persona in real-time.

```
       +-----------------------------------------------------------------------+
       |                         TRAILMARK AI PLATFORM                         |
       +-----------------------------------------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                                                   |
        v                                                                   v
+-------------------------------+                         +-----------------------------------+
|     Next.js 14 Web Client     | <=== REST API / JSON ===> |       Python FastAPI Backend      |
|  - Tailwind CSS / Lucide      |      (Fallback-Ready)     |  - SQLAlchemy 2.0 ORM (SQLite)   |
|  - Dual Mode (Digger/Surface) |                           |  - Multi-Provider AI Fallback     |
|  - Realtime Optimistic State  |                           |  - PDF Resume Extractor (PyPDF)   |
+-------------------------------+                           +-----------------------------------+
```

---

## 🚀 Key Features & 10 Core Modules

### 1. 🎙️ Conversational Intake & Resume Ingestion (`/onboarding`)
- **Multi-Turn Socratic Chat**: Conversational onboarding that assesses math background, coding proficiency, and learning pace.
- **Automated Resume Parsing**: Upload PDF or text resumes to extract verified competencies, calculate years of experience, and generate customized learner bios.
- **Persona Classification**: Real-time evaluation of learner tendencies into **Digger** (theory-heavy), **Surface** (application-focused), or **Motivation** (milestone-driven) archetypes.

### 2. 🎯 Dynamic Trajectory & Role Recommender (`/recommendations`)
- **Role Match Synergy**: Multi-dimensional role alignment algorithm computing match percentages against high-demand roles (AI Engineer, ML Systems Engineer, Enterprise Data & AI Architect, NLP Specialist).
- **Skill Gap Diagnostics**: Visual competency mapping into `Strong`, `Gap`, and `Emerging` categories with salary benchmarks and YoY demand metrics.
- **Custom Trajectory Synthesizer**: Input any custom target title to dynamically construct an on-demand gap analysis and prerequisite syllabus.

### 3. 🗺️ Multi-Persona Adaptive Roadmap Engine (`/roadmap`)
- **Dual-Mode Milestone DAGs**: Structured prerequisite graphs with milestone progress tracking.
  - **Digger Mode**: Deep academic reading lists (MIT Press, Bishop, Boyd & Vandenberghe), arXiv paper citations (*Attention Is All You Need*, *FlashAttention*, *LoRA*), and LaTeX mathematical derivations.
  - **Surface Mode**: High-yield actionable bullet points and practical implementation summaries.
- **Human-in-the-Loop Syllabi Approval**: Learners review and lock in customized roadmaps before commencement.
- **Placement Verification**: Ability to skip mastered milestones via proof verification checkpoints.

### 4. 🧠 Dynamic Adaptive Assessment Engine (`/assessment`, `/assessment/review`)
- **Concept-Calibrated Multi-Level Questions**: Questions spanning mathematical derivations, optimizer dynamics (AdamW vs L2 weight decay), attention time complexity, and loss landscapes.
- **Instant Automated Grading**: Itemized strengths, refinement areas, and automated weak-point logging.
- **Remedial Path Rerouting**: Weak areas are automatically flagged for refresher modules.
- **Hands-On Partner Lab Bookings**: Seamless booking of physical GPU cluster access and lab slots with instant confirmation codes.

### 5. 📜 Cryptographic Blockchain-Ready Credentials (`/certification`)
- **Verified Completion Certificates**: Distinction-grade certificates awarded upon roadmap mastery.
- **Cryptographic Hash Authenticator**: Validates unique SHA-256 signatures (`0x7F8B2C...`) against the registry.
- **Verified Competencies**: Explicit listing of validated skills and academic distinctions (e.g., *Magna Cum Laude in Algorithmic Rigor*).

### 6. 👥 Peer Community & Virtual Study Pods (`/community`, `/discussions`, `/study-groups`)
- **Scholarly Q&A Discussions**: Markdown and syntax-highlighted code discussions with upvoting, verified solutions, and peer badge recognition.
- **Live Collaborative Study Pods**: Real-time virtual study rooms with live sync indicators and scheduled weekly deep dives.

### 7. 🏆 Gamification, Streaks & Reward Store (`/rewards`, `/leaderboard`)
- **Learning Points Ledger**: Points earned through assessments, milestone completions, and peer reviews.
- **Streak Protection**: Daily check-in tracking with freeze day safeguards.
- **Reward Marketplace**: Redeem points for 1-on-1 mentorship sessions, exclusive badges, GPU compute vouchers, and physical swag.
- **Global & Domain Leaderboards**: Rankings across AI Engineering, ML Systems, and Data Architecture.

### 8. 📊 Facilitator & Cohort Analytics Dashboard (`/leader-dashboard`)
- **Cohort Alpha Telemetry**: Real-time metrics on cohort mastery percentages, review velocities, and engagement levels.
- **Scholar Pacing Matrix**: Individual learner progress tracking and drop-off risks.
- **AI Priority Alerts**: Actionable recommendations for cohort facilitators to intervene and support lagging scholars.

### 9. 🤖 Persistent AI Trail Guide & Explainability Engine (`/ai-assistant`)
- **Global AI Assistant Drawer**: Context-aware AI companion available on every screen.
- **Step-by-Step Explainability**: Explains *why* each milestone, reading assignment, or assessment was recommended for the learner's target role.
- **Academic Citation Grounding**: Answers grounded in peer-reviewed literature and canonical textbooks.

### 10. ⚡ Instant Offline-First Architecture & Dual Engine
- **Universal API Client (`services/apiClient.ts`)**: Automatically routes requests to the Python FastAPI backend when active (`http://localhost:8000`), with an instant, graceful fallback to rich simulated mock data when offline.
- **Zero Latency**: Instantaneous feedback across all interactive actions even in isolated demo environments.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling**: Vanilla CSS Modules & [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API (`TrailmarkContext`) with persistent local state & backend synchronization

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Server**: [Uvicorn](https://www.uvicorn.org/) (ASGI)
- **Database / ORM**: [SQLAlchemy 2.0](https://www.sqlalchemy.org/) with SQLite (`trailmark.db`)
- **Validation**: [Pydantic V2](https://docs.pydantic.dev/) (`BaseModel`, `ConfigDict`, `SettingsConfigDict`)
- **PDF Extraction**: [PyPDF](https://pypdf.readthedocs.io/)
- **Testing**: [Pytest](https://docs.pytest.org/) & FastAPI TestClient

---

## 📂 Project Structure

```bash
hclAmplified/
├── app/                              # Next.js 14 App Router Pages
│   ├── ai-assistant/page.tsx         # Pedagogical AI Assistant
│   ├── assessment/                   # Adaptive Assessments
│   │   ├── page.tsx                  # Interactive Assessment Quiz
│   │   └── review/page.tsx           # Graded Assessment Breakdown
│   ├── certification/page.tsx        # Cryptographic Certificate & Verifier
│   ├── community/page.tsx            # Peer Learning & Forum
│   ├── dashboard/page.tsx            # Main Scholar Dashboard
│   ├── discussions/page.tsx          # Q&A Discussion Threads
│   ├── leader-dashboard/page.tsx     # Facilitator & Cohort Analytics
│   ├── leaderboard/page.tsx          # Scholar Leaderboards
│   ├── onboarding/page.tsx           # Multi-Turn Intake & Resume Upload
│   ├── profile/page.tsx              # Scholar Profile & Persona Settings
│   ├── recommendations/page.tsx      # Role Matching & Skill Gap Analysis
│   ├── rewards/page.tsx              # Points Ledger & Redemption Store
│   ├── roadmap/page.tsx              # Dual-Mode Curriculum & Milestones
│   ├── study-groups/page.tsx         # Live Study Pods
│   ├── layout.tsx                    # Root Layout & Global Navigation
│   └── page.tsx                      # Landing / Portal Entry
├── backend/                          # Python FastAPI Backend
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py             # Environment & CORS Settings
│   │   │   └── database.py           # SQLite Engine & SessionLocal
│   │   ├── models/
│   │   │   └── models.py             # SQLAlchemy 2.0 ORM Entities
│   │   ├── routers/                  # 9 Modular API Routers
│   │   │   ├── ai_guide.py           # AI Assistant & Step Explainability
│   │   │   ├── analytics.py          # Facilitator & Cohort Telemetry
│   │   │   ├── assessments.py        # Question Grading & Lab Bookings
│   │   │   ├── auth_profile.py       # Profile Management & Resume Parsing
│   │   │   ├── certificates.py       # Certificate Retrieval & Verification
│   │   │   ├── community.py          # Posts, Answers & Study Groups
│   │   │   ├── gamification.py       # Rewards, Points & Leaderboards
│   │   │   ├── roadmaps.py           # Milestones & Module Toggling
│   │   │   └── roles.py              # Role Synergies & Recommendations
│   │   ├── schemas/
│   │   │   └── schemas.py            # Pydantic V2 Schemas
│   │   └── services/                 # Business Logic & Algorithms
│   │       ├── ai_service.py         # Multi-Provider / Scholarly AI Engine
│   │       ├── assessment_service.py # Adaptive Grading & Weak Point Logger
│   │       ├── gamification_service.py# Points, Streaks & Store Logic
│   │       ├── recommender_service.py# Role Matching & Gap Diagnostic
│   │       ├── resume_parser.py      # PDF / Text Competency Extractor
│   │       ├── roadmap_service.py    # DAG Roadmap Generator
│   │       └── seed_service.py       # Automatic SQLite Seed Data Loader
│   ├── tests/
│   │   └── test_api.py               # Automated Pytest Suite (10/10 Passing)
│   ├── main.py                       # FastAPI Application Entrypoint
│   └── requirements.txt              # Python Dependencies
├── context/
│   └── TrailmarkContext.tsx          # Universal Global State & API Sync
├── services/
│   ├── apiClient.ts                  # Type-Safe API Client with Offline Fallback
│   ├── aiService.ts                  # Frontend AI Dispatcher
│   └── mockData.ts                   # Comprehensive Dataset for Offline Mode
├── types/
│   └── trailmark.ts                  # Shared TypeScript Interfaces
├── pyproject.toml                    # Python Tools & Pytest Configuration
├── package.json                      # Node Scripts & Dependencies
└── README.md                         # Project Documentation
```

---

## 🚦 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0+ / npm v9.0+
- **Python**: v3.10+ (Anaconda or standard Python virtual environment)

---

### 1. Frontend Setup

```bash
# Clone repository
git clone https://github.com/Praveen-2305/HclAmplified.git
cd HclAmplified

# Install Node dependencies
npm install

# Run frontend development server
npm run dev
```

Visit **`http://localhost:3000`** in your browser. The frontend will immediately render all features with instant mock responses.

---

### 2. Backend Setup (Optional but Recommended)

```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start the FastAPI server
npm run backend
# OR directly with python:
python backend/main.py
```

The backend server will start on **`http://localhost:8000`** and automatically seed `trailmark.db` with demo data on its first run.

- **Interactive Swagger API Docs**: [`http://localhost:8000/docs`](http://localhost:8000/docs)
- **ReDoc Documentation**: [`http://localhost:8000/redoc`](http://localhost:8000/redoc)

---

### 3. Running Automated Tests

#### Backend Automated Integration Tests (Pytest)
```bash
npm run backend:test
# OR:
python -m pytest backend/tests/ -v
```
*Result: **10/10 test suites pass** covering profile updates, role recommendations, roadmap generation, assessment grading, community Q&A, and blockchain certificate validation.*

#### Frontend Production Build
```bash
npm run build
```
*Result: Compiles and validates static generation for all 19 application routes with zero type errors.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/profile/me` | Fetch active scholar profile & persona |
| `PATCH` | `/api/v1/profile/me` | Update target role, weekly hours, or persona mode |
| `POST` | `/api/v1/profile/onboarding/chat` | Multi-turn conversational intake response |
| `POST` | `/api/v1/profile/upload-resume` | Upload & extract PDF resume competencies |
| `GET` | `/api/v1/roles/recommendations` | Get calibrated career trajectories & skill gaps |
| `POST` | `/api/v1/roles/custom-match` | Generate gap analysis for a custom job title |
| `GET` | `/api/v1/roadmaps/current` | Retrieve active roadmap (Digger vs Surface adapted) |
| `POST` | `/api/v1/roadmaps/generate` | Generate custom 4-milestone learning path |
| `PATCH` | `/api/v1/roadmaps/modules/{id}/toggle` | Mark module complete & award points |
| `GET` | `/api/v1/assessments/questions` | Fetch adaptive assessment quiz questions |
| `POST` | `/api/v1/assessments/submit` | Grade assessment, log weak points, & award points |
| `GET` | `/api/v1/assessments/partner-labs` | List physical partner labs and booking slots |
| `POST` | `/api/v1/assessments/book-lab` | Reserve physical partner lab slot |
| `GET` | `/api/v1/certificates/me` | Get verified certificate for active learner |
| `GET` | `/api/v1/certificates/verify/{hash}` | Authenticate certificate cryptographic hash |
| `GET` | `/api/v1/community/posts` | List peer discussion threads & answers |
| `POST` | `/api/v1/community/posts` | Create new discussion topic (+20 pts) |
| `GET` | `/api/v1/gamification/rewards` | Retrieve reward store items & redemption status |
| `POST` | `/api/v1/gamification/redeem` | Spend points to redeem rewards |
| `GET` | `/api/v1/gamification/leaderboard` | View global and domain scholar rankings |
| `GET` | `/api/v1/analytics/cohort` | Facilitator analytics, pacing matrix & alerts |
| `POST` | `/api/v1/ai/guide` | Ask AI Trail Guide for contextual explanations |

---

## 🔒 Environment Variables (`.env`)

```env
# Server
PROJECT_NAME="Trailmark AI API"
DATABASE_URL="sqlite:///./trailmark.db"

# Optional LLM API Keys (Scholarly fallback engine used if omitted)
AI_PROVIDER="scholarly_fallback" # openai | anthropic | gemini | scholarly_fallback
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GEMINI_API_KEY=""
```

---

## 👥 Contributors & Acknowledgements

Developed by **Team: The Uncompiled** for the **HCL Amplified** initiative.

- **Frontend & UX Engineering**: Next.js 14 App Router, dynamic animations, and dual-mode persona interfaces.
- **Backend & ML Systems**: FastAPI, SQLAlchemy 2.0, adaptive grading algorithms, and PDF resume processing.
- **Curriculum Architecture**: Grounded in MIT Press, NeurIPS, ICLR, and Cambridge University Press literature.

---

### 📄 License
This project is developed under the MIT License for the HCL Amplified program.
