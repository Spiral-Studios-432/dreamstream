import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Moon, Plus, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import StatsCard from '../components/dashboard/StatsCard';
import StreakCard from '../components/dashboard/StreakCard';
import RecentDreams from '../components/dashboard/RecentDreams';
import TodayReflection from '../components/dashboard/TodayReflection';
import CreditBadge from '../components/ui/CreditBadge';

export default function Home() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: dreams = [] } = useQuery({
    queryKey: ['dreams'],
    queryFn: () => base44.entities.Dream.list('-dream_date', 10),
  });

  const { data: userCredits } = useQuery({
    queryKey: ['userCredits', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const credits = await base44.entities.UserCredits.filter({ user_email: user.email });
      if (credits.length === 0) {
        const newCredits = await base44.entities.UserCredits.create({
          user_email: user.email,
          total_credits: 50,
          streak_days: 0,
          total_dreams_logged: 0,
          total_reflections: 0,
          tier: 'free',
        });
        return newCredits;
      }
      return credits[0];
    },
    enabled: !!user?.email,
  });

  const { data: todayReflection } = useQuery({
    queryKey: ['todayReflection', today],
    queryFn: async () => {
      const reflections = await base44.entities.Reflection.filter({ reflection_date: today });
      return reflections[0] || null;
    },
  });

  const handleReflectionComplete = () => {
    queryClient.invalidateQueries(['userCredits']);
    queryClient.invalidateQueries(['todayReflection']);
  };

  return (
    <div className="min-h-screen bg-[#03020a]">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:gap-5 mb-8 sm:mb-10"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}! ✨
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">Track your dreams and unlock your subconscious</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <CreditBadge credits={userCredits?.total_credits} size="default" />
            <Link to={createPageUrl('Dreams')} className="flex-1 sm:flex-none">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl shadow-indigo-200/50 text-sm sm:text-base rounded-xl font-semibold">
                  <Plus className="w-4 h-4 mr-2" /> Log Dream
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StreakCard 
            streakDays={userCredits?.streak_days} 
            lastActivity={userCredits?.last_activity_date}
          />
          <StatsCard
            title="Dreams Logged"
            value={userCredits?.total_dreams_logged || 0}
            icon={Moon}
            gradient="bg-gradient-to-br from-indigo-50 to-blue-50"
          />
          <StatsCard
            title="Reflections"
            value={userCredits?.total_reflections || 0}
            icon={BookOpen}
            gradient="bg-gradient-to-br from-purple-50 to-pink-50"
          />
          <StatsCard
            title="Your Tier"
            value={userCredits?.tier?.charAt(0).toUpperCase() + userCredits?.tier?.slice(1) || 'Free'}
            subtitle="Upgrade for more features"
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-amber-50 to-yellow-50"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Recent Dreams */}
          <div className="lg:col-span-2">
            <RecentDreams dreams={dreams} />
          </div>

          {/* Right Column - Daily Reflection */}
          <div>
            <TodayReflection 
              todayReflection={todayReflection} 
              onComplete={handleReflectionComplete}
              userCredits={userCredits}
            />

            {/* Quick Tips Card */}
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                <h3 className="font-semibold text-sm sm:text-base text-slate-800">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 flex-shrink-0">•</span>
                  <span>Log dreams immediately after waking for better recall</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 flex-shrink-0">•</span>
                  <span>Track your mood to find patterns in your dreams</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 flex-shrink-0">•</span>
                  <span>Use tags to organize and search your dreams later</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}