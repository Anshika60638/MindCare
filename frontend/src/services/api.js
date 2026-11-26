/**
 * MindCare API Service
 * Interacts with the FastAPI backend endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const api = {
  /**
   * Sends a user chat message to the backend
   */
  async sendMessage(message, sessionId = null) {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Server error: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Fetches health status and backend API key configuration state
   */
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Lists all existing sessions
   */
  async getSessions() {
    const response = await fetch(`${API_BASE_URL}/chat/sessions`);
    if (!response.ok) {
      throw new Error(`Failed to load sessions: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Creates a new session
   */
  async createSession() {
    const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Fetches all messages for a specific session
   */
  async getSessionHistory(sessionId) {
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch history for ${sessionId}: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Clears messages inside a specific session
   */
  async clearSession(sessionId) {
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/clear`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error(`Failed to clear session: ${response.status}`);
    }
    return response.json();
  },

  /**
   * Deletes a session entirely
   */
  async deleteSession(sessionId) {
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete session: ${response.status}`);
    }
    return response.json();
  },
};
