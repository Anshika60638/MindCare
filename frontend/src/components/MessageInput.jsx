import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';

export default function MessageInput({ onSendMessage, isLoading = false, disabled = false }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading || disabled) return;

    onSendMessage(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isSendDisabled = !text.trim() || isLoading || disabled;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 pt-1">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white/95 backdrop-blur-md rounded-3xl border border-purple-200/90 shadow-lg shadow-purple-100/40 p-2 sm:p-2.5 transition-all focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100/60"
      >
        <div className="flex items-end gap-2">
          {/* Text Area */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled || isLoading}
            placeholder="Share what's on your mind... (English or Hinglish)"
            className="flex-1 max-h-40 min-h-[44px] bg-transparent resize-none border-0 px-3 py-2.5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 focus:outline-hidden leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isSendDisabled}
            title="Send Message (Enter)"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 shrink-0 ${
              isSendDisabled
                ? 'bg-purple-100 text-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-md shadow-purple-300/50 hover:shadow-lg hover:shadow-purple-300/60 hover:scale-[1.03] active:scale-[0.97] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <Sparkles className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5 ml-0.5" />
            )}
          </button>
        </div>

        {/* Input Micro-bar */}
        <div className="flex items-center justify-between px-3 pt-1 text-[11px] text-slate-400">
          <span className="hidden sm:inline flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-mono">Shift + Enter</kbd> for new line
          </span>
          <span className="sm:hidden text-[10px]">Tap send to share</span>
          <span className="text-[10px] font-medium text-purple-600/70">
            Confidential & Safe
          </span>
        </div>
      </form>
    </div>
  );
}
