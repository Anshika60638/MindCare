import asyncio
from app.config import settings
from app.routers.health import health_check
from app.routers.chat import (
    send_chat_message,
    create_new_chat_session,
    list_chat_sessions,
    get_session_history,
    clear_session_messages,
    delete_session,
)
from app.models.chat import ChatRequest

async def main():
    print("1. Testing health_check()...", flush=True)
    h = await health_check()
    assert h.status == "healthy"
    print(f"   -> Health OK: Model={h.model}, Gemini Key Configured={h.gemini_configured}", flush=True)

    print("2. Testing create_new_chat_session()...", flush=True)
    s = await create_new_chat_session()
    sid = s.id
    print(f"   -> Created Session ID: {sid}", flush=True)

    print("3. Testing English Crisis Safety Intervention...", flush=True)
    req_crisis_en = ChatRequest(message="I feel suicidal and want to kill myself", session_id=sid)
    res_crisis_en = await send_chat_message(req_crisis_en)
    assert res_crisis_en.is_crisis is True
    assert "14416" in res_crisis_en.message.content
    print("   -> English crisis intercepted deterministically! Tele-MANAS (14416) present.", flush=True)

    print("4. Testing Hinglish Crisis Safety Intervention...", flush=True)
    req_crisis_hi = ChatRequest(message="mera ab marne ka man kar raha hai", session_id=sid)
    res_crisis_hi = await send_chat_message(req_crisis_hi)
    assert res_crisis_hi.is_crisis is True
    assert "14416" in res_crisis_hi.message.content
    print("   -> Hinglish crisis intercepted! Tele-MANAS (14416) present.", flush=True)

    print("5. Testing Normal Message with Gemini...", flush=True)
    req_normal = ChatRequest(message="I am having stress about college exams", session_id=sid)
    res_normal = await send_chat_message(req_normal)
    assert res_normal.is_crisis is False
    if settings.has_api_key:
        assert len(res_normal.message.content) > 10
        print("   -> Normal message successfully generated live Gemini response!", flush=True)
    else:
        assert "Gemini API Key" in res_normal.message.content
        print("   -> Normal message with unconfigured key returns clear setup guide!", flush=True)

    print("6. Testing get_session_history()...", flush=True)
    history = await get_session_history(sid)
    assert len(history.messages) >= 3
    print(f"   -> History message count: {len(history.messages)}", flush=True)

    print("7. Testing clear_session_messages()...", flush=True)
    await clear_session_messages(sid)
    history_after = await get_session_history(sid)
    assert len(history_after.messages) == 0
    print("   -> Session cleared successfully (0 messages)", flush=True)

    print("8. Testing delete_session()...", flush=True)
    await delete_session(sid)
    sessions = await list_chat_sessions()
    assert not any(x.id == sid for x in sessions)
    print("   -> Session deleted successfully!", flush=True)

    print("\n🎉 ALL BACKEND ROUTE & SAFETY TESTS PASSED WITH 100% SUCCESS!", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
