import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { api } from './services/api';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // 1. Initial health and sessions check
  const fetchHealthAndSessions = useCallback(async () => {
    try {
      const health = await api.checkHealth();
      setApiConfigured(Boolean(health.gemini_configured));
    } catch (err) {
      console.warn('Backend not yet reachable on /health:', err);
    }

    try {
      const sessionList = await api.getSessions();
      setSessions(sessionList);
      if (sessionList.length > 0 && !currentSessionId) {
        // Load the most recent session
        const latest = sessionList[0];
        setCurrentSessionId(latest.id);
        const history = await api.getSessionHistory(latest.id);
        setMessages(history.messages || []);
      }
    } catch (err) {
      console.warn('Failed to load sessions:', err);
    }
  }, [currentSessionId]);

  useEffect(() => {
    fetchHealthAndSessions();
  }, [fetchHealthAndSessions]);

  // 2. Select an existing conversation session
  const handleSelectSession = async (sessionId) => {
    try {
      setIsLoading(true);
      setCurrentSessionId(sessionId);
      const detail = await api.getSessionHistory(sessionId);
      setMessages(detail.messages || []);
    } catch (err) {
      console.error('Failed to load session history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Start a brand new conversation
  const handleNewChat = async () => {
    try {
      const newSession = await api.createSession();
      setSessions((prev) => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setMessages([]);
    } catch (err) {
      console.error('Failed to create new session:', err);
      // Fallback local reset
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  // 4. Clear current chat messages
  const handleConfirmClearChat = async () => {
    if (!currentSessionId) {
      setMessages([]);
      setShowClearConfirm(false);
      return;
    }

    try {
      await api.clearSession(currentSessionId);
      setMessages([]);
      // Update session title in list
      setSessions((prev) =>
        prev.map((s) => (s.id === currentSessionId ? { ...s, title: 'New Conversation', message_count: 0 } : s))
      );
    } catch (err) {
      console.error('Failed to clear session:', err);
      setMessages([]);
    } finally {
      setShowClearConfirm(false);
    }
  };

  // 5. Send message flow
  const handleSendMessage = async (text) => {
    if (!text || !text.trim() || isLoading) return;

    // Optimistic user message in UI
    const tempUserMsg = {
      id: `temp_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      is_crisis: false,
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const response = await api.sendMessage(text, currentSessionId);
      
      // Update session ID if backend assigned/created a new one
      if (response.session_id && response.session_id !== currentSessionId) {
        setCurrentSessionId(response.session_id);
      }

      // Append real assistant response
      setMessages((prev) => [...prev, response.message]);

      if (response.api_configured !== undefined) {
        setApiConfigured(response.api_configured);
      }

      // Refresh sessions list to update titles and order
      const updatedSessions = await api.getSessions();
      setSessions(updatedSessions);
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMsg = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Notice:** Could not reach the MindCare backend server (${err.message}). Please make sure the FastAPI backend is running on port 8000.`,
        timestamp: new Date().toISOString(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentTitle = currentSession?.title || (messages.length > 0 ? 'Conversation' : 'New Chat');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8FF]">
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onClearChat={() => setShowClearConfirm(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        hasMessages={messages.length > 0}
      />

      {/* Main Chat Window */}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onClearChat={() => setShowClearConfirm(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        sessionTitle={currentTitle}
        apiConfigured={apiConfigured}
      />

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-100 animate-fade-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🗑️</span>
            </div>
            <h3 className="text-base font-bold text-slate-800 font-heading">Clear this conversation?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              This will clear the messages in your current reflection session. This cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClearChat}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
              >
                Yes, Clear Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
