"""
MindCare Comprehensive Automated Backend Integration Tests
Tests all endpoints, safety interventions, session flows, and error handling.
"""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "gemini_configured" in data
    print("✓ Health endpoint verified")

def test_session_lifecycle():
    # 1. Create a session
    res = client.post("/chat/sessions")
    assert res.status_code == 200
    session_data = res.json()
    session_id = session_data["id"]
    assert session_id is not None
    assert len(session_data["messages"]) == 0

    # 2. List sessions
    res = client.get("/chat/sessions")
    assert res.status_code == 200
    sessions = res.json()
    assert any(s["id"] == session_id for s in sessions)

    # 3. Get session details
    res = client.get(f"/chat/sessions/{session_id}")
    assert res.status_code == 200
    assert res.json()["id"] == session_id

    # 4. Clear session
    res = client.post(f"/chat/sessions/{session_id}/clear")
    assert res.status_code == 200

    # 5. Delete session
    res = client.delete(f"/chat/sessions/{session_id}")
    assert res.status_code == 200

    print("✓ Session lifecycle (create, list, get, clear, delete) verified")

def test_safety_crisis_intervention_english():
    # Test crisis detection in English
    payload = {
        "message": "I am having suicidal thoughts and want to end my life"
    }
    res = client.post("/chat/message", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_crisis"] is True
    assert data["status"] == "crisis_intervention"
    content = data["message"]["content"]
    assert "Tele-MANAS" in content
    assert "14416" in content
    assert "KIRAN" in content
    print("✓ English crisis safety layer verified (deterministic response with Tele-MANAS 14416)")

def test_safety_crisis_intervention_hinglish():
    # Test crisis detection in Hinglish
    payload = {
        "message": "bohot pareshan hu mera marne ka man kar raha hai"
    }
    res = client.post("/chat/message", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_crisis"] is True
    assert data["status"] == "crisis_intervention"
    content = data["message"]["content"]
    assert "14416" in content
    print("✓ Hinglish crisis safety layer verified")

def test_normal_stress_not_flagged_as_crisis():
    # Ensure ordinary stress is NOT falsely flagged as crisis
    payload = {
        "message": "I am feeling so stressed today because of my final exams"
    }
    res = client.post("/chat/message", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_crisis"] is False
    assert data["status"] == "success"
    print("✓ Normal stress correctly differentiated from crisis")

def test_empty_message_validation():
    # Empty message should be rejected
    payload = {"message": "   "}
    res = client.post("/chat/message", json=payload)
    assert res.status_code == 400
    print("✓ Empty message validation verified")

if __name__ == "__main__":
    print("\nRunning MindCare Backend Integration Tests...")
    test_health_endpoint()
    test_session_lifecycle()
    test_safety_crisis_intervention_english()
    test_safety_crisis_intervention_hinglish()
    test_normal_stress_not_flagged_as_crisis()
    test_empty_message_validation()
    print("\n🎉 ALL BACKEND INTEGRATION TESTS PASSED PERFECTLY!\n")
