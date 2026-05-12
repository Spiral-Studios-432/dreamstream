import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Sparkles } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from "@/lib/utils";

const moodColors = {
  grateful: 'bg-amber-100 text-amber-700',
  hopeful: 'bg-blue-100 text-blue-700',
  peaceful: 'bg-emerald-100 text-emerald-700',
  motivated: 'bg-orange-100 text-orange-700',
  reflective: 'bg-purple-100 text-purple-700',
  curious: 'bg-pink-100 text-pink-700',
};

export default function Reflections() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: reflections = [] } = useQuery({
    queryKey: ['reflections'],
    queryFn: () => base44.entities.Reflection.list('-reflection_date', 100),
  });

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const hasReflection = (date) => {
    return reflections.some(r => 
      r.reflection_date === format(date, 'yyyy-MM-dd')
    );
  };

  const selectedReflection = reflections.find(r => 
    r.reflection_date === format(selectedDate, 'yyyy-MM-dd')
  );

  const totalCreditsEarned = reflections.reduce((sum, r) => sum + (r.credits_earned || 5), 0);
  const currentStreak = (() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      if (hasReflection(checkDate)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  })();

  return (
    <div className="min-h-screen bg-[#03020a]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-200">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Reflections</h1>
            <p className="text-slate-600 text-sm">{reflections.length} reflections completed</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
                <div className="p-2 sm:p-2.5 rounded-xl bg-purple-100">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Reflections</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{reflections.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
                <div className="p-2 sm:p-2.5 rounded-xl bg-amber-100">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Credits</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{totalCreditsEarned}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
                <div className="p-2 sm:p-2.5 rounded-xl bg-orange-100">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Streak</p>
                  <p className="text-xl sm:text-2xl font-bold text-slate-900">{currentStreak}d</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Calendar */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Reflection Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                    className="p-1.5 rounded-lg hover:bg-slate-100"
                  >
                    ←
                  </button>
                  <span className="text-sm font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
                  <button 
                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                    className="p-1.5 rounded-lg hover:bg-slate-100"
                  >
                    →
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array(startOfMonth(currentMonth).getDay()).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {daysInMonth.map(day => {
                  const hasRef = hasReflection(day);
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "aspect-square rounded-lg text-xs sm:text-sm font-medium transition-all min-h-[36px]",
                        "hover:bg-slate-100 active:scale-95",
                        isSelected && "ring-2 ring-indigo-500",
                        isToday && !isSelected && "ring-2 ring-slate-300",
                        hasRef && "bg-gradient-to-br from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      )}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500" />
                  <span>Reflection completed</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Reflection */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">
                {format(selectedDate, 'MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {selectedReflection ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Prompt</p>
                    <p className="text-slate-800 font-medium text-sm sm:text-base">{selectedReflection.prompt}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">Your Response</p>
                    <p className="text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 sm:p-4 rounded-xl text-sm sm:text-base">
                      {selectedReflection.response}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    {selectedReflection.mood && (
                      <Badge className={moodColors[selectedReflection.mood]}>
                        {selectedReflection.mood}
                      </Badge>
                    )}
                    <span className="text-sm text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      +{selectedReflection.credits_earned || 5} credits
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600">No reflection for this day</p>
                  {isSameDay(selectedDate, new Date()) && (
                    <p className="text-sm text-indigo-600 mt-2">
                      Complete today's reflection on the dashboard!
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}