import React from 'react';
import { Heart, Sparkles, ShieldCheck, Languages } from 'lucide-react';
import SuggestionCards from './SuggestionCards';

export default function WelcomeScreen({ onSelectSuggestion, disabled = false }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-3xl mx-auto animate-fade-in">
      {/* Attractive Emblem */}
      <div className="relative mb-5">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-purple-200/50 via-pink-200/40 to-indigo-200/50 blur-xl opacity-75 animate-pulse" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-400 p-0.5 shadow-lg shadow-purple-200 flex items-center justify-center">
          <div className="w-full h-full bg-white/95 backdrop-blur-xs rounded-[22px] flex items-center justify-center">
            <Heart className="w-10 h-10 text-purple-600 fill-purple-500/20" />
          </div>
        </div>
      </div>

      {/* Headings */}
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight font-heading">
        Hello! Welcome to <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">MindCare</span>
      </h1>
      <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-md mx-auto">
        A little space to talk, reflect and feel better. Whatever is on your mind, you are safe here.
      </p>

      {/* Trust & Capability Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px] font-medium text-purple-700/80">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 border border-purple-200/60">
          <Languages className="w-3.5 h-3.5 text-purple-600" /> English & Hinglish
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100/70 border border-pink-200/60 text-pink-700">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Empathetic Support
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100/70 border border-purple-200/60">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Private Session
        </span>
      </div>

      {/* Prompt Suggestions */}
      <div className="w-full mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Suggestions to get started
        </p>
        <SuggestionCards onSelectSuggestion={onSelectSuggestion} disabled={disabled} />
      </div>
    </div>
  );
}
