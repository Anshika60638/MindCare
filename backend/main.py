import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import health_router, chat_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s - %(message)s"
)
logger = logging.getLogger("mindcare")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MindCare AI Wellness Chatbot Backend...")
    logger.info(f"Gemini API Key configured: {settings.has_api_key}")
    logger.info(f"Gemini Model: {settings.GEMINI_MODEL}")
    logger.info(f"Allowed CORS Origins: {settings.CORS_ORIGINS}")
    yield
    logger.info("MindCare Backend shutting down.")

app = FastAPI(
    title="MindCare – AI Wellness Chatbot API",
    description=(
        "Backend API for MindCare AI Wellness Chatbot. Provides empathetic emotional support, "
        "mindfulness guidance, session management, and a dedicated mental health crisis safety layer."
    ),
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS + ["*"],  # Allow configured origins and local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(chat_router)

@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "health": "/health",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
