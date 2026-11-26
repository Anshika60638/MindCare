from fastapi import APIRouter, HTTPException, Path
from typing import List
from app.config import settings
from app.models.chat import (
    ChatRequest,
    ChatResponse,
    MessageRole,
    SessionSummary,
    SessionDetail,
)
from app.services.safety_service import safety_service
from app.services.gemini_service import gemini_service
from app.services.session_service import session_service

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/message", response_model=ChatResponse)
async def send_chat_message(request: ChatRequest):
    """
    Main chat messaging endpoint:
    1. Validates input and gets/creates session.
    2. Saves user message into session history.
    3. Runs Safety Layer to detect immediate crisis/self-harm.
       - If crisis detected, immediately returns verified helpline info.
    4. Otherwise, forwards multi-turn context to Gemini AI.
    5. Stores AI response in session history and returns it.
    """
    user_text = request.message.strip()
    if not user_text:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # 1. Establish session
    session_id = session_service.get_or_create_session(request.session_id)

    # 2. Append user message
    user_msg = session_service.add_message(
        session_id=session_id,
        role=MessageRole.USER,
        content=user_text,
    )

    # 3. Dedicated Safety Layer Pre-Check
    is_crisis, crisis_reply = safety_service.check_message(user_text)
    if is_crisis:
        assistant_msg = session_service.add_message(
            session_id=session_id,
            role=MessageRole.ASSISTANT,
            content=crisis_reply,
            is_crisis=True,
        )
        return ChatResponse(
            session_id=session_id,
            message=assistant_msg,
            is_crisis=True,
            status="crisis_intervention",
            api_configured=settings.has_api_key,
        )

    # 4. Multi-turn context for Gemini LLM
    # Get previous messages excluding the one just added for history
    conversation_history = session_service.get_history_for_llm(session_id)
    # The last message in history is the current user_text, remove it from history
    if conversation_history and conversation_history[-1]["content"] == user_text:
        conversation_history = conversation_history[:-1]

    ai_reply_text = await gemini_service.generate_response(
        conversation_history=conversation_history,
        user_message=user_text,
    )

    # 5. Append AI response to session
    assistant_msg = session_service.add_message(
        session_id=session_id,
        role=MessageRole.ASSISTANT,
        content=ai_reply_text,
        is_crisis=False,
    )

    return ChatResponse(
        session_id=session_id,
        message=assistant_msg,
        is_crisis=False,
        status="success",
        api_configured=settings.has_api_key,
    )

@router.get("/sessions", response_model=List[SessionSummary])
async def list_chat_sessions():
    """Returns a list of all active chat sessions."""
    return session_service.list_sessions()

@router.post("/sessions", response_model=SessionDetail)
async def create_new_chat_session():
    """Explicitly initializes a new chat session."""
    return session_service.create_session()

@router.get("/sessions/{session_id}", response_model=SessionDetail)
async def get_session_history(session_id: str = Path(..., description="The session ID")):
    """Retrieves full conversation history for a given session."""
    session = session_service.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return session

@router.post("/sessions/{session_id}/clear")
async def clear_session_messages(session_id: str = Path(..., description="The session ID")):
    """Clears all messages within a session."""
    success = session_service.clear_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {"status": "success", "message": "Session messages cleared."}

@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str = Path(..., description="The session ID")):
    """Deletes an entire session."""
    success = session_service.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {"status": "success", "message": "Session deleted."}
