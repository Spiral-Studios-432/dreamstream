import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Check, Lightbulb } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const prompts = [
  "What made you smile yesterday?",
  "Describe a dream you'd love to have tonight.",
  "What are you grateful for right now?",
  "If your dreams had a message, what would it be?",
  "What emotion do you want to release today?",
  "Describe your perfect peaceful moment.",
  "What would you tell your past self?",
];

export default function TodayReflection({ todayReflection, onComplete, userCredits }) {
  const [response, setResponse] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(!!todayReflection);
  
  const todayPrompt = prompts[new Date().getDay()];

  const handleSubmit = async () => {
    if (!response.trim()) return;
    setSubmitting(true);
    
    const today = new Date().toISOString().split('T')[0];
    
    await base44.entities.Reflection.create({
      prompt: todayPrompt,
      response: response.trim(),
      reflection_date: today,
      credits_earned: 5,
    });

    if (userCredits) {
      await base44.entities.UserCredits.update(userCredits.id, {
        total_credits: (userCredits.total_credits || 0) + 5,
        total_reflections: (userCredits.total_reflections || 0) + 1,
      });
    }

    setCompleted(true);
    setSubmitting(false);
    if (onComplete) onComplete();
  };

  if (completed || todayReflection) {
    return (
      <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-white/20">
              <Check className="w-5 h-5" />
            </div>
            <p className="font-medium">Daily Reflection Complete!</p>
          </div>
          <p className="text-emerald-100 text-sm">
            You earned +5 credits. Come back tomorrow for another reflection.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Daily Reflection
          <span className="ml-auto text-xs font-normal text-amber-600 bg-amber-100 px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> +5 credits
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-700 font-medium mb-3">{todayPrompt}</p>
        <Textarea
          placeholder="Share your thoughts..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="mb-3 min-h-[100px] resize-none border-slate-200 focus:border-indigo-300"
        />
        <Button 
          onClick={handleSubmit}
          disabled={submitting || !response.trim()}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          {submitting ? 'Saving...' : 'Complete Reflection'}
        </Button>
      </CardContent>
    </Card>
  );
}