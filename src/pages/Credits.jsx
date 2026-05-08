import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Moon, BookOpen, Flame, Gift, Star, Crown, Check, Zap } from 'lucide-react';
import CreditBadge from '../components/ui/CreditBadge';
import UpgradeButton from '../components/ui/UpgradeButton';
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: 'Free',
    value: 'free',
    price: '$0',
    color: 'from-slate-500 to-slate-600',
    features: [
      '9 AI interpretations (lifetime)',
      'Basic mood tracking',
      'Daily reflections',
      'Standard support',
    ],
  },
  {
    name: 'Dreamer',
    value: 'dreamer',
    price: '$1.99/mo',
    color: 'from-indigo-500 to-purple-500',
    popular: true,
    features: [
      'Unlimited AI interpretations',
      'Advanced analytics',
      'Pattern recognition',
      'Priority support',
      '2x credit earnings',
    ],
  },
  {
    name: 'Visionary',
    value: 'visionary',
    price: 'Coming soon',
    color: 'from-amber-500 to-orange-500',
    features: [
      'Everything in Dreamer',
      'Exclusive dream themes',
      'Personal dream coach',
      '24/7 priority support',
      '3x credit earnings',
      'Early feature access',
    ],
  },
];

const earnMethods = [
  { icon: Moon, title: 'Log a Dream', credits: 10, description: 'Record your dreams daily' },
  { icon: BookOpen, title: 'Daily Reflection', credits: 5, description: 'Complete your daily prompt' },
  { icon: Flame, title: '7-Day Streak', credits: 25, description: 'Bonus for consistency' },
  { icon: Gift, title: 'Refer a Friend', credits: 50, description: 'When they sign up' },
];

export default function Credits() {
  const [user, setUser] = useState(null);
  const upgraded = new URLSearchParams(window.location.search).get('upgraded') === 'true';

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: userCredits } = useQuery({
    queryKey: ['userCredits', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const credits = await base44.entities.UserCredits.filter({ user_email: user.email });
      return credits[0] || null;
    },
    enabled: !!user?.email,
  });

  const currentTier = tiers.find(t => t.value === (userCredits?.tier || 'free')) || tiers[0];

  return (
    <div className="min-h-screen bg-[#03020a]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Upgrade Success Banner */}
        {upgraded && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-emerald-700 font-semibold">🎉 Welcome to Dreamer! Your account has been upgraded.</p>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-amber-100 text-amber-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" /> No Ads - Ever!
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Credits & Premium</h1>
          <p className="text-sm sm:text-base text-slate-600 px-4">Earn credits for free or upgrade for unlimited features</p>
        </div>

        {/* Current Balance */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-6 sm:mb-8">
          <CardContent className="p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div>
                <p className="text-indigo-100 mb-1 sm:mb-2 text-sm">Your Balance</p>
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold">{userCredits?.total_credits || 0}</span>
                  <span className="text-base sm:text-lg lg:text-xl text-indigo-200">credits</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <p className="text-indigo-200 text-xs sm:text-sm mb-1">Current Tier</p>
                  <p className="font-semibold text-base sm:text-lg">{currentTier.name}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <p className="text-indigo-200 text-xs sm:text-sm mb-1">Streak Bonus</p>
                  <p className="font-semibold text-base sm:text-lg">{userCredits?.streak_days || 0} days 🔥</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Earn Credits */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 px-1">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> Ways to Earn Credits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {earnMethods.map((method, i) => (
              <Card key={i} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
                      <method.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800">{method.title}</h3>
                        <Badge className="bg-amber-100 text-amber-700 text-xs">+{method.credits}</Badge>
                      </div>
                      <p className="text-sm text-slate-500">{method.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tier Plans */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 px-1">
            <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" /> Choose Your Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {tiers.map((tier) => {
              const isCurrent = tier.value === (userCredits?.tier || 'free');
              return (
                <Card 
                  key={tier.value}
                  className={cn(
                    "border-0 shadow-lg relative overflow-hidden transition-transform hover:scale-[1.02]",
                    tier.popular && "ring-2 ring-indigo-500"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-indigo-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className={cn(
                    "bg-gradient-to-r text-white",
                    tier.color
                  )}>
                    <CardTitle className="flex items-center gap-2">
                      {tier.value === 'visionary' && <Crown className="w-5 h-5" />}
                      {tier.value === 'dreamer' && <Star className="w-5 h-5" />}
                      {tier.name}
                    </CardTitle>
                    <div className="text-3xl font-bold mt-2">{tier.price}</div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {isCurrent ? (
                      <Button className="w-full bg-slate-200 text-slate-600 cursor-default" disabled>
                        Current Plan
                      </Button>
                    ) : tier.value === 'dreamer' ? (
                      <UpgradeButton className="w-full" />
                    ) : tier.value === 'free' ? (
                      <Button className="w-full" variant="outline" disabled>Downgrade</Button>
                    ) : (
                      <Button className="w-full" variant="outline" disabled>Coming Soon</Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* No Ads Promise */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardContent className="p-5 sm:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">100% Ad-Free Experience</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              We believe in respecting your time and attention. DreamStream is completely free of advertisements. 
              Support us by earning credits through engagement or upgrading to premium.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}