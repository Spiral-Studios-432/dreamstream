import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function CreditBadge({ credits, size = 'default', showLabel = true }) {
  const sizeClasses = {
    small: 'text-xs px-2 py-1',
    default: 'text-sm px-3 py-1.5',
    large: 'text-base px-4 py-2'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 rounded-full",
      "bg-gradient-to-r from-amber-100 to-yellow-100",
      "border border-amber-200 text-amber-700 font-semibold",
      sizeClasses[size]
    )}>
      <Sparkles className={cn(iconSizes[size], "text-amber-500")} />
      <span>{credits?.toLocaleString() || 0}</span>
      {showLabel && <span className="font-normal text-amber-600">credits</span>}
    </div>
  );
}