import React from 'react';
import { Card } from "@/components/ui/card";
import { Flame, Star } from 'lucide-react';

export default function StreakCard({ streakDays, lastActivity }) {
  const isActive = lastActivity === new Date().toISOString().split('T')[0];
  
  return (
    <Card className="relative overflow-hidden p-6 border-0 shadow-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
      <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10">
        <div className="relative w-full h-full">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="absolute text-white/20 fill-white/10"
              style={{
                width: 12 + Math.random() * 8,
                height: 12 + Math.random() * 8,
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white/80 text-sm font-medium">Current Streak</p>
            <p className="text-3xl font-bold">{streakDays || 0} days</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-300 animate-pulse' : 'bg-white/40'}`} />
          <p className="text-sm text-white/80">
            {isActive ? "You're on fire today!" : "Log a dream to continue your streak!"}
          </p>
        </div>
      </div>
    </Card>
  );
}