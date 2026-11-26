import React from 'react';
import { ShieldAlert, HeartHandshake } from 'lucide-react';

export default function Disclaimer({ variant = 'sidebar' }) {
  if (variant === 'banner') {
    return (
      <div className="bg-purple-50/80 border-b border-purple-100/60 px-4 py-2 text-xs text-purple-700 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>
            <strong>MindCare AI:</strong> For everyday emotional support and reflection. Not a substitute for medical or clinical care.
          </span>
        </div>
        <span className="hidden sm:inline text-purple-600/80 font-medium">
          India Crisis: <strong>14416</strong> (Tele-MANAS)
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/60 border border-purple-100 rounded-2xl p-3.5 text-xs text-slate-600 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5 font-medium text-purple-800">
        <HeartHandshake className="w-4 h-4 text-purple-600" />
        <span>Wellness & Safety Notice</span>
      </div>
      <p className="leading-relaxed text-[11px] text-slate-500">
        MindCare is an AI support prototype for daily reflection and stress relief. It cannot diagnose, treat, or replace professional healthcare. In an emergency, please call <strong>14416</strong> (Tele-MANAS) or local medical services.
      </p>
    </div>
  );
}
