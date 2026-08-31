from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True)

    PROJECT_NAME: str = "Trailmark AI API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://localhost:8000",
    ]
    
    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./trailmark.db",
        description="SQLAlchemy database connection URL"
    )
    
    # AI / LLM Configuration
    OPENAI_API_KEY: str = Field(default="", description="OpenAI API key")
    ANTHROPIC_API_KEY: str = Field(default="", description="Anthropic API key")
    GEMINI_API_KEY: str = Field(default="", description="Gemini API key")
    AI_PROVIDER: str = Field(default="scholarly_fallback", description="AI Provider: openai | anthropic | gemini | scholarly_fallback")
    
    # App Settings
    SECRET_KEY: str = "trailmark-dev-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

settings = Settings()
