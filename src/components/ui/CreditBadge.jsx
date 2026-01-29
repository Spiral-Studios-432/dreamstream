import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

export default function CreditBadge({ credits, size = 'default', showLabel = true }) {
  const sizeClasses = {
    small: 'text-xs px-3 py-1.5',
    default: 'text-sm px-4 py-2',
    large: 'text-base px-5 py-2.5'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5'
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full relative overflow-hidden",
        "bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 bg-size-200 animate-gradient",
        "shadow-lg shadow-amber-200/50 text-white font-bold",
        sizeClasses[size]
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
      <Sparkles className={cn(iconSizes[size], "relative z-10 drop-shadow")} />
      <span className="relative z-10">{credits?.toLocaleString() || 0}</span>
      {showLabel && <span className="font-medium relative z-10 text-white/90">credits</span>}
    </motion.div>
  );
}