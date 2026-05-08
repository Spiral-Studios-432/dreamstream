import React from 'react';
import { Card } from "@/components/ui/card";
import { Flame, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StreakCard({ streakDays, lastActivity }) {
  const isActive = lastActivity === new Date().toISOString().split('T')[0];
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="relative overflow-hidden p-5 sm:p-6 border border-violet-300/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="absolute top-0 right-0 w-40 h-40 -mr-10 -mt-10">
          <div className="relative w-full h-full">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              >
                <Star
                  className="absolute text-white/30 fill-white/20"
                  style={{
                    width: 10 + Math.random() * 12,
                    height: 10 + Math.random() * 12,
                    top: `${10 + Math.random() * 70}%`,
                    left: `${10 + Math.random() * 70}%`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg"
            >
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-glow" />
            </motion.div>
            <div>
              <p className="text-white/90 text-xs sm:text-sm font-semibold uppercase tracking-wider">Current Streak</p>
              <p className="text-3xl sm:text-4xl font-bold drop-shadow-lg">{streakDays || 0} days</p>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 p-3 rounded-xl bg-white/10 backdrop-blur-sm"
            animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 shadow-lg ${isActive ? 'bg-green-300 animate-pulse' : 'bg-white/50'}`} />
            <p className="text-sm text-white/90 font-medium">
              {isActive ? "🔥 You're crushing it today!" : "💪 Log a dream to keep the fire alive!"}
            </p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}