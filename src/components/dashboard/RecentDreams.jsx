import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { moods } from '../ui/MoodSelector';

const dreamTypeColors = {
  normal: 'bg-slate-100 text-slate-700',
  lucid: 'bg-purple-100 text-purple-700',
  nightmare: 'bg-red-100 text-red-700',
  recurring: 'bg-blue-100 text-blue-700',
  vivid: 'bg-emerald-100 text-emerald-700',
  prophetic: 'bg-amber-100 text-amber-700',
};

export default function RecentDreams({ dreams }) {
  const getMoodEmoji = (moodValue) => {
    return moods.find(m => m.value === moodValue)?.emoji || '😐';
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Moon className="w-5 h-5 text-indigo-600" />
          Recent Dreams
        </CardTitle>
        <Link 
          to={createPageUrl('Dreams')} 
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {dreams?.length > 0 ? (
          <div className="space-y-3">
            {dreams.slice(0, 3).map((dream) => (
              <div 
                key={dream.id} 
                className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-indigo-50/50 hover:from-indigo-50 hover:to-purple-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {dream.title}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {dream.dream_date && format(new Date(dream.dream_date), 'MMM d')}
                  </span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                  {dream.content}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {dream.dream_type && (
                    <Badge className={dreamTypeColors[dream.dream_type]}>
                      {dream.dream_type}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>{getMoodEmoji(dream.mood_before)}</span>
                    <span>→</span>
                    <span>{getMoodEmoji(dream.mood_after)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Moon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No dreams logged yet</p>
            <Link 
              to={createPageUrl('Dreams')} 
              className="text-indigo-600 text-sm font-medium hover:underline"
            >
              Log your first dream
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}