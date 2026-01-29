import React from 'react';
import { cn } from "@/lib/utils";

const moods = [
  { value: 'calm', emoji: '😌', label: 'Calm', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { value: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-orange-100 border-orange-300 text-orange-700' },
  { value: 'happy', emoji: '😊', label: 'Happy', color: 'bg-yellow-100 border-yellow-300 text-yellow-700' },
  { value: 'sad', emoji: '😢', label: 'Sad', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { value: 'excited', emoji: '🤩', label: 'Excited', color: 'bg-pink-100 border-pink-300 text-pink-700' },
  { value: 'tired', emoji: '😴', label: 'Tired', color: 'bg-purple-100 border-purple-300 text-purple-700' },
  { value: 'neutral', emoji: '😐', label: 'Neutral', color: 'bg-slate-100 border-slate-300 text-slate-700' },
];

export default function MoodSelector({ value, onChange, label }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs sm:text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {moods.map((mood) => (
          <button
            key={mood.value}
            type="button"
            onClick={() => onChange(mood.value)}
            className={cn(
              "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border-2 transition-all duration-200",
              "hover:scale-105 hover:shadow-md active:scale-95",
              value === mood.value 
                ? `${mood.color} ring-2 ring-offset-1 sm:ring-offset-2 ring-indigo-400` 
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            <span className="text-base sm:text-lg">{mood.emoji}</span>
            <span className="text-xs sm:text-sm font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { moods };