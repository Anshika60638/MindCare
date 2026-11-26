import React, { useRef, useEffect } from 'react';
import { Menu, Sparkles, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import WelcomeScreen from './WelcomeScreen';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import MessageInput from './MessageInput';
import Disclaimer from './Disclaimer';

export default function ChatWindow({
  messages = [],
  isLoading = false,
  onSendMessage,
  onClearChat,
  onOpenSidebar,
  sessionTitle = '',
  apiConfigured = true,
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAF8FF]">
      {/* Top Banner Notice */}
      <Disclaimer variant="banner" />

      {/* Main Chat Navbar / Header */}
      <header className="h-16 px-4 sm:px-6 bg-white/80 backdrop-blur-md border-b border-purple-100 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={onOpenSidebar}
            title="Open Menu"
            className="p-2 -ml-1 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-purple-50 lg:hidden cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Status Indicator */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-slate-800 text-sm sm:text-base font-heading">
                {sessionTitle || 'MindCare Companion'}
              </h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Ready to listen
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Everyday emotional well-being • English & Hinglish
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              title="Clear Conversation"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          )}

          {/* AI Engine Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-medium">
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>Gemini AI</span>
          </div>
        </div>
      </header>

      {/* Missing API Key Alert Notice (if backend indicates unconfigured) */}
      {!apiConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Gemini API Key missing:</strong> Add your key in <code>backend/.env</code> to activate live AI answers. MindCare will guide you when you send a message.
            </span>
          </div>
          <a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-amber-900 shrink-0 hover:text-amber-700"
          >
            Get Free Key →
          </a>
        </div>
      )}

      {/* Chat Messages or Welcome Screen Area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col">
        {messages.length === 0 ? (
          <WelcomeScreen onSelectSuggestion={onSendMessage} disabled={isLoading} />
        ) : (
          <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-start">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isLoading && <TypingIndicator />}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-gradient-to-t from-[#FAF8FF] via-[#FAF8FF] to-transparent pt-2">
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </main>
  );
}
