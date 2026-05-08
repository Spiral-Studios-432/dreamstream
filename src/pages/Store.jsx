import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Palette, BarChart3, Star, ShoppingBag, Coins, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const STORE_ITEMS = [
  {
    id: 'advanced_interpretation',
    name: 'Advanced AI Interpretation',
    description: 'Get a deep, premium-grade AI analysis of your dream using Claude — includes archetypal symbolism, shadow work insights, and a personalised action plan.',
    icon: Brain,
    cost: 50,
    color: 'from-indigo-500 to-purple-600',
    bg: 'from-indigo-50 to-purple-50',
    border: 'border-indigo-200',
    badge: 'Most Popular',
    badgeColor: 'bg-indigo-600',
  },
  {
    id: 'dream_theme_pack',
    name: 'Dream Theme Pack',
    description: 'Unlock a beautiful custom journal theme for your dream entries — choose from Cosmic, Ocean Deep, or Enchanted Forest visual styles.',
    icon: Palette,
    cost: 30,
    color: 'from-pink-500 to-rose-500',
    bg: 'from-pink-50 to-rose-50',
    border: 'border-pink-200',
    badge: 'New',
    badgeColor: 'bg-rose-500',
  },
  {
    id: 'pattern_report',
    name: 'Dream Pattern Report',
    description: 'Receive a detailed AI-generated report analysing your last 30 dreams — recurring themes, emotional trends, and subconscious patterns revealed.',
    icon: BarChart3,
    cost: 75,
    color: 'from-amber-500 to-orange-500',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-200',
    badge: 'Premium',
    badgeColor: 'bg-amber-500',
  },
  {
    id: 'lucky_dream_charm',
    name: 'Lucky Dream Charm',
    description: 'Plant a virtual lucky charm in your journal — receive a personalised affirmation and a positive dream intention ritual crafted just for you.',
    icon: Star,
    cost: 20,
    color: 'from-emerald-500 to-teal-500',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    badge: null,
    badgeColor: '',
  },
];

export default function Store() {
  const [user, setUser] = useState(null);
  const [purchasing, setPurchasing] = useState(null);
  const [purchased, setPurchased] = useState(null);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
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

  const { data: dreams = [] } = useQuery({
    queryKey: ['dreams'],
    queryFn: () => base44.entities.Dream.list('-dream_date', 30),
    enabled: !!user?.email,
  });

  const handlePurchase = async (item) => {
    const balance = userCredits?.total_credits || 0;
    if (balance < item.cost) {
      toast.error(`Not enough credits. You need ${item.cost} but have ${balance}.`);
      return;
    }

    setPurchasing(item.id);
    setPurchaseResult(null);

    try {
      // Deduct credits
      await base44.entities.UserCredits.update(userCredits.id, {
        total_credits: balance - item.cost,
      });

      let result = null;

      if (item.id === 'advanced_interpretation') {
        const latestDream = dreams[0];
        if (!latestDream) {
          toast.error('Log a dream first to use this feature!');
          setPurchasing(null);
          // Refund
          await base44.entities.UserCredits.update(userCredits.id, { total_credits: balance });
          return;
        }
        result = await base44.integrations.Core.InvokeLLM({
          model: 'claude_sonnet_4_6',
          prompt: `You are a world-class dream analyst and Jungian psychotherapist. Perform an extraordinary deep-dive analysis on this dream.

DREAM: "${latestDream.title}"
CONTENT: ${latestDream.content}
MOOD BEFORE: ${latestDream.mood_before} | MOOD AFTER: ${latestDream.mood_after}
TYPE: ${latestDream.dream_type}
TAGS: ${latestDream.tags?.join(', ') || 'none'}

Provide a premium, comprehensive analysis with these sections:

🔮 **Archetypal Symbolism** — Identify Jungian archetypes (Shadow, Anima/Animus, Self, Persona) present in the dream. Explain their significance in profound detail.

🌊 **Shadow Work Insights** — What aspects of the dreamer's unconscious shadow might this dream be illuminating? What is being asked to be integrated or acknowledged?

🧬 **Emotional Alchemy** — Trace the emotional journey from ${latestDream.mood_before} to ${latestDream.mood_after}. What transformation is occurring? What needs to shift in waking life?

💡 **Hidden Messages** — What is the dream's deeper wisdom trying to communicate? Identify the core message with clarity.

🌱 **Personalised Action Plan** — Provide 3 specific, actionable steps the dreamer can take in the next 7 days to honour and integrate this dream's message.

✨ **Affirmation** — Close with a powerful, personalised affirmation based on the dream's themes.

Be deeply insightful, warm, and specific. This is a premium experience — make it extraordinary.`,
        });
      } else if (item.id === 'dream_theme_pack') {
        result = `🎨 **Your Dream Theme Pack is Unlocked!**\n\nYou now have access to three exclusive journal themes:\n\n🌌 **Cosmic** — Deep navy skies, stars, and cosmic gradients for the mystic dreamer.\n\n🌊 **Ocean Deep** — Calming blues and teals, evoking the depths of the subconscious.\n\n🌿 **Enchanted Forest** — Rich greens and earthy tones for dreams rooted in nature and growth.\n\nTheme customisation will be applied to your dream journal entries. Look for the theme selector when logging your next dream!`;
      } else if (item.id === 'pattern_report') {
        const dreamSummaries = dreams.slice(0, 30).map(d =>
          `- "${d.title}" (${d.dream_type}, mood: ${d.mood_before}→${d.mood_after}, tags: ${d.tags?.join(',') || 'none'})`
        ).join('\n');

        result = await base44.integrations.Core.InvokeLLM({
          model: 'claude_sonnet_4_6',
          prompt: `You are an expert dream pattern analyst. Based on the following ${dreams.slice(0, 30).length} dreams, generate a comprehensive pattern report.

DREAM HISTORY:
${dreamSummaries}

Provide a detailed Pattern Report with these sections:

📊 **Overview Summary** — Key statistics and high-level findings from this dream collection.

🔁 **Recurring Themes** — Identify the top 3-5 recurring themes, symbols, or scenarios appearing across multiple dreams.

💭 **Emotional Landscape** — Analyse the emotional patterns. What moods dominate? What transitions are most common? What does this reveal?

🌙 **Dream Type Distribution** — What types of dreams are most common and what might this indicate about the dreamer's subconscious?

🧭 **Subconscious Trajectory** — Based on the pattern of dreams over time, what direction is the subconscious mind moving toward? What is being processed?

⚡ **Key Insight** — The single most important insight from this dream collection.

🗺️ **Recommended Focus Areas** — 3 specific areas of personal growth or reflection suggested by these dream patterns.

Be analytical, insightful, and specific. Reference actual dreams from the list.`,
        });
      } else if (item.id === 'lucky_dream_charm') {
        result = await base44.integrations.Core.InvokeLLM({
          prompt: `You are a dream spirit and wellbeing guide. Create a personalised lucky dream charm ritual for someone who has been keeping a dream journal.

Based on the practice of dream journaling, provide:

🍀 **Your Lucky Dream Charm Name** — Give this person a unique, meaningful charm name based on positive dream energy.

🌟 **Personal Affirmation** — Write a powerful, beautiful affirmation (2-3 sentences) that will support positive, meaningful dreaming. Make it feel magical and personal.

🕯️ **Bedtime Ritual** — Describe a simple, beautiful 3-step ritual they can perform each night before sleep to invite positive dreams. Keep it practical yet mystical.

💫 **Dream Intention** — Craft a specific dream intention for them to set tonight — a beautiful, open invitation to their subconscious mind.

🌙 **Lucky Dream Hours** — Share which hours of sleep are most likely to bring meaningful, memorable dreams and why.

Make this feel like a special, magical gift. Warm, enchanting, and genuinely helpful.`,
        });
      }

      queryClient.invalidateQueries(['userCredits']);
      setPurchased(item.id);
      setPurchaseResult(result);
      toast.success(`${item.name} purchased!`);
    } catch (err) {
      toast.error('Something went wrong. Your credits have been refunded.');
      // Attempt refund
      if (userCredits?.id) {
        await base44.entities.UserCredits.update(userCredits.id, {
          total_credits: userCredits.total_credits,
        });
        queryClient.invalidateQueries(['userCredits']);
      }
    }

    setPurchasing(null);
  };

  const balance = userCredits?.total_credits || 0;

  return (
    <div className="min-h-screen bg-[#03020a]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 shadow-xl shadow-amber-200/50">
              <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Dream Store</h1>
              <p className="text-sm sm:text-base text-slate-600">Spend your credits on magical upgrades</p>
            </div>
          </div>

          {/* Balance bar */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200">
            <Coins className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-amber-800">{balance}</span>
            <span className="text-amber-700 text-sm">credits available</span>
          </div>
        </motion.div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {STORE_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const isLoading = purchasing === item.id;
            const canAfford = balance >= item.cost;
            const wasPurchased = purchased === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className={cn('border overflow-hidden', item.border, !canAfford && 'opacity-70')}>
                  <CardContent className="p-0">
                    {/* Card Header */}
                    <div className={cn('bg-gradient-to-r p-5 text-white relative', item.color)}>
                      {item.badge && (
                        <span className={cn('absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full text-white', item.badgeColor)}>
                          {item.badge}
                        </span>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Coins className="w-3.5 h-3.5" />
                            <span className="font-semibold text-sm">{item.cost} credits</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className={cn('p-5 bg-gradient-to-br', item.bg)}>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{item.description}</p>

                      <Button
                        onClick={() => handlePurchase(item)}
                        disabled={isLoading || !canAfford}
                        className={cn(
                          'w-full font-semibold',
                          canAfford
                            ? `bg-gradient-to-r ${item.color} hover:opacity-90 text-white`
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        )}
                      >
                        {isLoading ? (
                          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                        ) : !canAfford ? (
                          `Need ${item.cost - balance} more credits`
                        ) : (
                          <><Sparkles className="w-4 h-4 mr-2" /> Spend {item.cost} Credits</>
                        )}
                      </Button>
                    </div>

                    {/* Result Panel */}
                    <AnimatePresence>
                      {wasPurchased && purchaseResult && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-slate-200"
                        >
                          <div className="p-5 bg-white">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm font-semibold text-emerald-700">Unlocked!</span>
                            </div>
                            <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                              {purchaseResult}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Earn more CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white text-center"
        >
          <Coins className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <h3 className="font-bold text-lg mb-1">Need more credits?</h3>
          <p className="text-slate-400 text-sm">Log dreams (+10), complete reflections (+5), or maintain your streak for bonus credits.</p>
        </motion.div>

      </div>
    </div>
  );
}