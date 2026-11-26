import React from 'react';
import { CloudRain, Wind, HeartHandshake, Sparkles, ArrowUpRight } from 'lucide-react';

const SUGGESTIONS = [
  {
    id: 1,
    title: "I'm feeling stressed today.",
    subtitle: "Share what's overwhelming you right now",
    icon: CloudRain,
    gradient: "from-purple-500/10 to-indigo-500/10 text-purple-600",
    border: "hover:border-purple-300",
  },
  {
    id: 2,
    title: "Help me relax.",
    subtitle: "Try a quick 2-minute breathing exercise",
    icon: Wind,
    gradient: "from-pink-500/10 to-purple-500/10 text-pink-600",
    border: "hover:border-pink-300",
  },
  {
    id: 3,
    title: "I had a difficult day.",
    subtitle: "Unburden your thoughts in a safe space",
    icon: HeartHandshake,
    gradient: "from-violet-500/10 to-pink-500/10 text-violet-600",
    border: "hover:border-violet-300",
  },
  {
    id: 4,
    title: "Give me some positive motivation.",
    subtitle: "Gentle encouragement and realistic hope",
    icon: Sparkles,
    gradient: "from-amber-500/10 to-purple-500/10 text-amber-600",
    border: "hover:border-amber-300",
  },
];

export default function SuggestionCards({ onSelectSuggestion, disabled = false }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mx-auto my-4">
      {SUGGESTIONS.map((item) => {
        const IconComponent = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectSuggestion(item.title)}
            className={`group relative text-left bg-white/80 hover:bg-white backdrop-blur-xs border border-purple-100/80 ${item.border} rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-purple-100/50 hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:pointer-events-none`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${item.gradient} transition-transform group-hover:scale-105`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 group-hover:text-purple-900 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-purple-300 group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
