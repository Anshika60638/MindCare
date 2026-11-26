import os
from pathlib import Path
from dotenv import load_dotenv

# Locate .env file relative to this file
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

class Settings:
    PROJECT_NAME: str = "MindCare – AI Wellness Chatbot Backend"
    VERSION: str = "1.0.0"
    
    # API Keys: check GEMINI_API_KEY, fallback to GOOGLE_API_KEY
    GEMINI_API_KEY: str = (
        os.getenv("GEMINI_API_KEY") 
        or os.getenv("GOOGLE_API_KEY") 
        or ""
    ).strip()
    
    # Model configuration
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()
    
    # Server settings
    HOST: str = os.getenv("BACKEND_HOST", "127.0.0.1")
    PORT: int = int(os.getenv("BACKEND_PORT", "8000"))
    
    # CORS settings
    CORS_ORIGINS: list[str] = [
        origin.strip() 
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000").split(",")
        if origin.strip()
    ]
    
    @property
    def has_api_key(self) -> bool:
        return bool(self.GEMINI_API_KEY)

settings = Settings()
