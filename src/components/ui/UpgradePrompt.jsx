import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Crown, Star, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const DREAMER_PRICE_ID = 'price_1TWDrsGPm4SaQNfNwkHVxzWG';
const VISIONARY_PRICE_ID = 'price_1TWESDGPm4SaQNfNoGITn8lJ';

export default function UpgradePrompt({ reason = 'dreams', onClose }) {
  const [loading, setLoading] = useState(null);

  const handleUpgrade = async (priceId, tier) => {
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app, not the preview.');
      return;
    }
    setLoading(tier);
    try {
      const res = await base44.functions.invoke('createCheckoutSession', {
        price_id: priceId,
        success_url: window.location.origin + '/Credits?upgraded=true',
        cancel_url: window.location.href,
      });
      if (res.data?.url) window.location.href = res.data.url;
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-5 sm:p-6 text-white text-center">
          <Moon className="w-8 h-8 mx-auto mb-2 opacity-80" />
          <h2 className="text-xl sm:text-2xl font-bold mb-1">You've reached the free limit</h2>
          <p className="text-indigo-100 text-sm">
            {reason === 'dreams'
              ? 'Free accounts can log up to 9 dreams. Upgrade to continue your journey.'
              : 'This feature requires a premium plan.'}
          </p>
        </div>
        <div className="p-4 sm:p-6 space-y-4">
          {/* Dreamer */}
          <div className="border-2 border-indigo-500 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-slate-800">Dreamer</span>
              <span className="ml-auto font-bold text-indigo-600">$1.99/mo</span>
            </div>
            <ul className="text-sm text-slate-600 space-y-1 mb-3">
              <li>✓ Unlimited dream logging</li>
              <li>✓ Unlimited AI interpretations</li>
              <li>✓ Advanced analytics & 2x credits</li>
            </ul>
            <Button
              onClick={() => handleUpgrade(DREAMER_PRICE_ID, 'dreamer')}
              disabled={!!loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold"
            >
              {loading === 'dreamer'
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</>
                : 'Upgrade to Dreamer'}
            </Button>
          </div>

          {/* Visionary */}
          <div className="border-2 border-amber-400 rounded-xl p-4 bg-amber-50">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-slate-800">Visionary</span>
              <span className="ml-auto font-bold text-amber-600">$5.99/mo</span>
            </div>
            <ul className="text-sm text-slate-600 space-y-1 mb-3">
              <li>✓ Everything in Dreamer</li>
              <li>✓ AI Dream Map & Trend Pictures</li>
              <li>✓ Illustrated picture book stories</li>
              <li>✓ Pattern recognition across dreams</li>
            </ul>
            <Button
              onClick={() => handleUpgrade(VISIONARY_PRICE_ID, 'visionary')}
              disabled={!!loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
            >
              {loading === 'visionary'
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</>
                : 'Upgrade to Visionary'}
            </Button>
          </div>

          <button onClick={onClose} className="w-full text-sm text-slate-400 hover:text-slate-600 transition-colors">
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}