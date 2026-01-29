import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Moon, Plus, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-slate-600 mt-1">Track your dreams and unlock your subconscious</p>
          </div>
          <div className="flex items-center gap-3">
            <CreditBadge credits={userCredits?.total_credits} size="large" />
            <Link to={createPageUrl('Dreams')}>
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200">
                <Plus className="w-4 h-4 mr-2" /> Log Dream
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-800">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Log dreams immediately after waking for better recall
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Track your mood to find patterns in your dreams
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  Use tags to organize and search your dreams later
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}