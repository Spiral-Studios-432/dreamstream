import React from 'react';
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function StarRating({ value, onChange, label, max = 5 }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                "w-7 h-7 transition-colors",
                star <= value 
                  ? "fill-amber-400 text-amber-400" 
                  : "fill-transparent text-slate-300 hover:text-amber-300"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}