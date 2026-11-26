import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Sparkles, User, Copy, Check, ShieldAlert, PhoneCall } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  const isCrisis = Boolean(message.is_crisis);
  const isError = Boolean(message.error);
  const [copied, setCopied] = useState(false);

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2.5 my-3 animate-fade-in">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-xs shadow-sm shadow-purple-200/50 text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {message.content}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 mr-1">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 mb-4">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex items-start gap-3 my-3 animate-fade-in group">
      {/* MindCare Avatar */}
      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 mt-0.5 ${
        isCrisis 
          ? 'bg-gradient-to-tr from-amber-500 to-red-500 shadow-amber-200' 
          : 'bg-gradient-to-tr from-purple-600 to-pink-400 shadow-purple-200'
      }`}>
        {isCrisis ? <ShieldAlert className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Message Content Bubble */}
      <div className="flex flex-col max-w-[90%] sm:max-w-[80%]">
        <div className={`relative px-4 py-3.5 rounded-2xl rounded-tl-xs shadow-xs text-sm leading-relaxed transition-all ${
          isCrisis
            ? 'bg-gradient-to-br from-purple-50 via-pink-50/60 to-red-50/40 border border-red-200 text-slate-800'
            : isError
            ? 'bg-red-50/80 border border-red-200 text-red-900'
            : 'bg-white border border-purple-100/90 text-slate-800 shadow-purple-50/80'
        }`}>
          {/* Crisis Callout Banner */}
          {isCrisis && (
            <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-red-200/70 text-xs font-semibold text-red-700">
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Immediate Support Helpline Active (24/7)</span>
            </div>
          )}

          {/* Markdown Content */}
          <div className="prose prose-purple prose-sm max-w-none text-slate-700 [&>p]:mb-2.5 [&>p:last-child]:mb-0 [&>ul]:my-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:my-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-purple-900 [&>h3]:mb-2 [&>h4]:text-sm [&>h4]:font-semibold [&>h4]:text-purple-800 [&>h4]:mt-2 [&>h4]:mb-1 [&>strong]:text-slate-900 [&>a]:text-purple-600 [&>a]:underline hover:[&>a]:text-purple-800">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>

          {/* Crisis Quick Dial Buttons */}
          {isCrisis && (
            <div className="mt-3.5 pt-2.5 border-t border-purple-200/70 flex flex-wrap gap-2">
              <a
                href="tel:14416"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-medium shadow-xs hover:bg-purple-700 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Tele-MANAS (14416)
              </a>
              <a
                href="tel:18005990019"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 border border-purple-300 text-purple-800 text-xs font-medium hover:bg-purple-200 transition-colors"
              >
                Call KIRAN (1800-599-0019)
              </a>
            </div>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy message"
            className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-slate-400 mt-1 ml-1">
          MindCare • {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
