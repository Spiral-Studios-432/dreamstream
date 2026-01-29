import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit2, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { moods } from '../ui/MoodSelector';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const dreamTypeColors = {
  normal: 'bg-slate-50 text-slate-700 border-slate-200',
  lucid: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200',
  nightmare: 'bg-gradient-to-r from-red-50 to-orange-50 text-red-700 border-red-200',
  recurring: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200',
  vivid: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200',
  prophetic: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200',
};

export default function DreamCard({ dream, onEdit, onDelete, expanded, onToggle }) {
  const getMoodEmoji = (moodValue) => {
    return moods.find(m => m.value === moodValue)?.emoji || '😐';
  };

  const getMoodLabel = (moodValue) => {
    return moods.find(m => m.value === moodValue)?.label || 'Neutral';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      layout
    >
      <Card className={cn(
        "border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm",
        expanded && "ring-2 ring-indigo-300 shadow-xl"
      )}>
        <CardContent className="p-0">
          <div 
            className="p-6 cursor-pointer bg-gradient-to-br from-white to-slate-50/30"
            onClick={onToggle}
          >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h3 className="font-bold text-xl text-slate-900">{dream.title}</h3>
                {dream.dream_type && (
                  <Badge className={cn("text-xs font-semibold shadow-sm", dreamTypeColors[dream.dream_type])}>
                    {dream.dream_type}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {dream.dream_date && format(new Date(dream.dream_date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                {[...Array(dream.clarity_rating || 0)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow" />
                  </motion.div>
                ))}
              </div>
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </motion.div>
            </div>
          </div>

          <p className={cn(
            "text-slate-600 mb-4",
            !expanded && "line-clamp-2"
          )}>
            {dream.content}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Mood:</span>
              <span className="flex items-center gap-1">
                <span className="text-lg">{getMoodEmoji(dream.mood_before)}</span>
                <span className="text-slate-400">→</span>
                <span className="text-lg">{getMoodEmoji(dream.mood_after)}</span>
              </span>
            </div>
            {dream.tags?.length > 0 && (
              <div className="flex items-center gap-1 flex-wrap">
                {dream.tags.slice(0, expanded ? undefined : 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                    {tag}
                  </span>
                ))}
                {!expanded && dream.tags.length > 3 && (
                  <span className="text-slate-400 text-xs">+{dream.tags.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>

        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-slate-100"
          >
            {dream.interpretation && (
              <div className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                  </motion.div>
                  <span className="font-bold text-slate-800">AI Interpretation</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{dream.interpretation}</p>
              </div>
            )}
            
            <div className="p-5 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="text-indigo-600">💤</span> Sleep: {dream.sleep_quality}/5
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-amber-600">✨</span> Clarity: {dream.clarity_rating}/5
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onEdit(dream); }}
                  className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium"
                >
                  <Edit2 className="w-4 h-4 mr-1.5" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onDelete(dream.id); }}
                  className="text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
    </motion.div>
  );
}