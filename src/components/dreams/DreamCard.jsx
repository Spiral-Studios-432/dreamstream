import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Edit2, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { moods } from '../ui/MoodSelector';
import { cn } from "@/lib/utils";

const dreamTypeColors = {
  normal: 'bg-slate-100 text-slate-700 border-slate-200',
  lucid: 'bg-purple-100 text-purple-700 border-purple-200',
  nightmare: 'bg-red-100 text-red-700 border-red-200',
  recurring: 'bg-blue-100 text-blue-700 border-blue-200',
  vivid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  prophetic: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function DreamCard({ dream, onEdit, onDelete, expanded, onToggle }) {
  const getMoodEmoji = (moodValue) => {
    return moods.find(m => m.value === moodValue)?.emoji || '😐';
  };

  const getMoodLabel = (moodValue) => {
    return moods.find(m => m.value === moodValue)?.label || 'Neutral';
  };

  return (
    <Card className={cn(
      "border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden",
      expanded && "ring-2 ring-indigo-200"
    )}>
      <CardContent className="p-0">
        <div 
          className="p-5 cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-slate-900">{dream.title}</h3>
                {dream.dream_type && (
                  <Badge className={cn("text-xs", dreamTypeColors[dream.dream_type])}>
                    {dream.dream_type}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500">
                {dream.dream_date && format(new Date(dream.dream_date), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(dream.clarity_rating || 0)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
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
          <div className="border-t">
            {dream.interpretation && (
              <div className="p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-slate-700">AI Interpretation</span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{dream.interpretation}</p>
              </div>
            )}
            
            <div className="p-4 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>Sleep Quality: {dream.sleep_quality}/5</span>
                <span>Clarity: {dream.clarity_rating}/5</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onEdit(dream); }}
                  className="text-slate-600 hover:text-indigo-600"
                >
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); onDelete(dream.id); }}
                  className="text-slate-600 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}