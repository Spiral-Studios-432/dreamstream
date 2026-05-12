import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

const PRICE_ID = 'price_1TWDrsGPm4SaQNfNwkHVxzWG';

export default function UpgradeButton({ className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    // Block if running inside iframe (Base44 preview)
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app, not the preview.');
      return;
    }

    setLoading(true);
    try {
      const res = await base44.functions.invoke('createCheckoutSession', {
        price_id: PRICE_ID,
        success_url: window.location.origin + '/Credits?upgraded=true',
        cancel_url: window.location.origin + '/Credits',
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading}
      className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg ${className}`}
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirecting...</>
      ) : (
        <><Sparkles className="w-4 h-4 mr-2" /> Upgrade — $1.99/mo</>
      )}
    </Button>
  );
}