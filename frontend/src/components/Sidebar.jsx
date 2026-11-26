import React from 'react';
import { 
  Heart, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Sparkles, 
  X, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import Disclaimer from './Disclaimer';

export default function Sidebar({
  sessions = [],
  currentSessionId,
  onSelectSession,
  onNewChat,
  onClearChat,
  isOpen = false,
  onClose,
  hasMessages = false,
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 sm:w-80 bg-white/95 lg:bg-[#F9F7FD]/80 backdrop-blur-md border-r border-purple-100 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header & Branding */}
        <div className="p-4 sm:p-5 border-b border-purple-100/70 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-400 p-0.5 shadow-sm shadow-purple-200 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-600 fill-purple-500/20" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-800 text-lg font-heading tracking-tight">MindCare</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-[10px] font-semibold text-purple-700">AI</span>
                </div>
                <p className="text-[11px] text-slate-400">Your space to talk & reflect</p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-purple-50 lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              if (onClose) onClose();
            }}
            className="w-full mt-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-sm shadow-sm shadow-purple-200 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>
        </div>

        {/* Sessions History List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Recent Conversations</span>
            <span className="text-[10px] bg-purple-100/70 text-purple-700 px-1.5 py-0.5 rounded-md font-medium">
              {sessions.length}
            </span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 px-4 text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto text-purple-200 mb-2 stroke-1" />
              <p className="text-xs font-medium">No previous chats yet</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Start typing or click a prompt</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === currentSessionId;
              return (
                <button
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all cursor-pointer group ${
                    isActive
                      ? 'bg-purple-100/80 text-purple-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-800'
                  }`}
                >
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-purple-600' : 'text-slate-400 group-hover:text-purple-500'}`} />
                  <span className="truncate flex-1">{session.title || 'Untitled Session'}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Bottom Section: Clear Chat & Disclaimer */}
        <div className="p-3 sm:p-4 border-t border-purple-100/80 bg-white/70 space-y-3">
          {/* Clear Current Chat Button */}
          {hasMessages && (
            <button
              onClick={onClearChat}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border border-red-100/80 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Current Chat</span>
            </button>
          )}

          {/* Privacy & Wellness Disclaimer */}
          <Disclaimer variant="sidebar" />
        </div>
      </aside>
    </>
  );
}
