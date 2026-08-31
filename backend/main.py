from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, SessionLocal, Base
from backend.app.services.seed_service import seed_database_if_empty

# Routers
from backend.app.routers.auth_profile import router as profile_router
from backend.app.routers.roles import router as roles_router
from backend.app.routers.roadmaps import router as roadmaps_router
from backend.app.routers.assessments import router as assessments_router
from backend.app.routers.ai_guide import router as ai_guide_router
from backend.app.routers.community import router as community_router
from backend.app.routers.gamification import router as gamification_router
from backend.app.routers.certificates import router as certificates_router
from backend.app.routers.analytics import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB schema
    Base.metadata.create_all(bind=engine)
    # Seed initial demo data
    db = SessionLocal()
    try:
        seed_database_if_empty(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for Trailmark AI-Powered Personalized Learning Path Recommender (HCL Amplified)",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local Next.js frontend requests
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers under /api/v1
v1_prefix = settings.API_V1_STR
app.include_router(profile_router, prefix=v1_prefix)
app.include_router(roles_router, prefix=v1_prefix)
app.include_router(roadmaps_router, prefix=v1_prefix)
app.include_router(assessments_router, prefix=v1_prefix)
app.include_router(ai_guide_router, prefix=v1_prefix)
app.include_router(community_router, prefix=v1_prefix)
app.include_router(gamification_router, prefix=v1_prefix)
app.include_router(certificates_router, prefix=v1_prefix)
app.include_router(analytics_router, prefix=v1_prefix)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "database": "connected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
