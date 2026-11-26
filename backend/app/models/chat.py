from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    id: str = Field(..., description="Unique message ID")
    role: MessageRole = Field(..., description="Role of the sender")
    content: str = Field(..., description="Content of the message")
    timestamp: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat(),
        description="ISO timestamp"
    )
    is_crisis: bool = Field(default=False, description="Whether safety intervention was triggered")
    error: bool = Field(default=False, description="Whether an error occurred")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="User's input text")
    session_id: Optional[str] = Field(default=None, description="Optional existing session ID")


class ChatResponse(BaseModel):
    session_id: str
    message: ChatMessage
    is_crisis: bool = False
    status: str = "success"
    api_configured: bool = True
    error_message: Optional[str] = None


class SessionSummary(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    message_count: int


class SessionDetail(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str
    messages: List[ChatMessage]


class HealthResponse(BaseModel):
    status: str
    project: str
    version: str
    gemini_configured: bool
    model: str
