from fastapi import APIRouter
from app.config import settings
from app.models.chat import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    Reports operational status and whether a Gemini API key is configured.
    """
    return HealthResponse(
        status="healthy",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        gemini_configured=settings.has_api_key,
        model=settings.GEMINI_MODEL,
    )
