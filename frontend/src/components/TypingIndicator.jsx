import React from 'react';
import { Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 my-3 animate-fade-in">
      {/* MindCare Avatar */}
      <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center text-white shadow-sm shadow-purple-200 shrink-0">
        <Sparkles className="w-4 h-4 animate-spin-slow" />
      </div>

      {/* Typing Bubble */}
      <div className="bg-white border border-purple-100/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm shadow-purple-100/40 flex items-center gap-2">
        <span className="text-xs font-medium text-purple-700">MindCare is reflecting</span>
        <div className="flex items-center gap-1.5 ml-1">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 dot-pulse-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-purple-400 dot-pulse-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-pink-400 dot-pulse-3" />
        </div>
      </div>
    </div>
  );
}
