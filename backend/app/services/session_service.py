import uuid
from datetime import datetime, timezone
from typing import Dict, List, Optional
from app.models.chat import ChatMessage, MessageRole, SessionSummary, SessionDetail

class SessionService:
    def __init__(self):
        # In-memory dictionary: session_id -> dict with session metadata and messages
        self._sessions: Dict[str, dict] = {}

    def get_or_create_session(self, session_id: Optional[str] = None) -> str:
        """Returns existing session_id if valid, otherwise creates and returns a new session."""
        if session_id and session_id in self._sessions:
            return session_id

        new_id = uuid.uuid4().hex[:12]
        now = datetime.now(timezone.utc).isoformat()
        self._sessions[new_id] = {
            "id": new_id,
            "title": "New Conversation",
            "created_at": now,
            "updated_at": now,
            "messages": [],
        }
        return new_id

    def create_session(self) -> SessionDetail:
        """Explicitly creates a new empty conversation session."""
        session_id = uuid.uuid4().hex[:12]
        now = datetime.now(timezone.utc).isoformat()
        session_data = {
            "id": session_id,
            "title": "New Conversation",
            "created_at": now,
            "updated_at": now,
            "messages": [],
        }
        self._sessions[session_id] = session_data
        return SessionDetail(**session_data)

    def add_message(
        self,
        session_id: str,
        role: MessageRole,
        content: str,
        is_crisis: bool = False,
        error: bool = False,
    ) -> ChatMessage:
        """Appends a message to the specified session."""
        if session_id not in self._sessions:
            self.get_or_create_session(session_id)

        msg_id = f"msg_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc).isoformat()
        message = ChatMessage(
            id=msg_id,
            role=role,
            content=content,
            timestamp=now,
            is_crisis=is_crisis,
            error=error,
        )

        session = self._sessions[session_id]
        session["messages"].append(message)
        session["updated_at"] = now

        # Update title from the first user message if title is still default
        if role == MessageRole.USER and (session["title"] == "New Conversation" or not session["title"]):
            clean_title = content.strip().replace("\n", " ")
            if len(clean_title) > 36:
                clean_title = clean_title[:33] + "..."
            session["title"] = clean_title

        return message

    def get_session(self, session_id: str) -> Optional[SessionDetail]:
        """Gets detailed session with all messages."""
        if session_id not in self._sessions:
            return None
        return SessionDetail(**self._sessions[session_id])

    def list_sessions(self) -> List[SessionSummary]:
        """Lists summaries of all active sessions sorted by last updated descending."""
        summaries = []
        for s in self._sessions.values():
            summaries.append(
                SessionSummary(
                    id=s["id"],
                    title=s["title"],
                    created_at=s["created_at"],
                    updated_at=s["updated_at"],
                    message_count=len(s["messages"]),
                )
            )
        summaries.sort(key=lambda x: x.updated_at, reverse=True)
        return summaries

    def clear_session(self, session_id: str) -> bool:
        """Clears messages for a session while preserving the session container."""
        if session_id in self._sessions:
            self._sessions[session_id]["messages"] = []
            self._sessions[session_id]["title"] = "New Conversation"
            self._sessions[session_id]["updated_at"] = datetime.now(timezone.utc).isoformat()
            return True
        return False

    def delete_session(self, session_id: str) -> bool:
        """Removes a session completely."""
        if session_id in self._sessions:
            del self._sessions[session_id]
            return True
        return False

    def get_history_for_llm(self, session_id: str, limit: int = 12) -> List[dict]:
        """
        Formats recent user and assistant messages for LLM context.
        Excludes error messages and system messages.
        """
        if session_id not in self._sessions:
            return []

        recent = self._sessions[session_id]["messages"][-limit:]
        formatted = []
        for msg in recent:
            if not msg.error:
                formatted.append({
                    "role": "user" if msg.role == MessageRole.USER else "assistant",
                    "content": msg.content,
                })
        return formatted

session_service = SessionService()
