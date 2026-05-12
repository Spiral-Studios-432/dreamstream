import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Moon, Star, Sparkles, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const dreamTypeColors = {
  normal: 'bg-slate-100 text-slate-700',
  lucid: 'bg-purple-100 text-purple-700',
  nightmare: 'bg-red-100 text-red-700',
  recurring: 'bg-blue-100 text-blue-700',
  vivid: 'bg-emerald-100 text-emerald-700',
  prophetic: 'bg-amber-100 text-amber-700',
};

export default function SharedDream() {
  const [dream, setDream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) { setNotFound(true); setLoading(false); return; }

    base44.asServiceRole?.entities
      ? base44.entities.Dream.filter({ id })
          .then(results => {
            const d = results[0];
            if (!d) { setNotFound(true); } else { setDream(d); }
          })
          .catch(() => setNotFound(true))
          .finally(() => setLoading(false))
      : base44.entities.Dream.filter({ id })
          .then(results => {
            const d = results[0];
            if (!d) { setNotFound(true); } else { setDream(d); }
          })
          .catch(() => setNotFound(true))
          .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03020a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !dream) {
    return (
      <div className="min-h-screen bg-[#03020a] flex items-center justify-center text-center px-4">
        <div>
          <Moon className="w-16 h-16 text-indigo-400 mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">Dream not found</h2>
          <p className="text-slate-400">This dream may have been deleted or is no longer shared.</p>
          <a href="/" className="mt-6 inline-block px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors">
            Explore DreamStream
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03020a] flex flex-col">
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl"
        >
          {/* Brand header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              DreamStream
            </span>
          </div>

          {/* Dream Card */}
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/40 border border-white/10">
            {/* Header */}
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{dream.title}</h1>
                {dream.dream_type && (
                  <span className={`flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full ${dreamTypeColors[dream.dream_type] || 'bg-white/20 text-white'}`}>
                    {dream.dream_type}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                {dream.dream_date && (
                  <div className="flex items-center gap-1.5 text-white/80 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {format(new Date(dream.dream_date), 'MMMM d, yyyy')}
                  </div>
                )}
                {dream.clarity_rating > 0 && (
                  <div className="flex items-center gap-1">
                    {[...Array(dream.clarity_rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="bg-[#0d0b1e] p-6 sm:p-8">
              <p className="text-slate-300 text-base leading-relaxed whitespace-pre-wrap">{dream.content}</p>

              {dream.tags?.length > 0 && (
                <div className="flex items-center gap-2 mt-5 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
                  {dream.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {dream.interpretation && (
                <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm font-semibold text-indigo-300">AI Interpretation</span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{dream.interpretation}</p>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div className="bg-gradient-to-r from-slate-900 to-[#0d0b1e] px-6 sm:px-8 py-5 border-t border-white/5 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-slate-500 text-sm">Shared from <span className="text-indigo-400 font-semibold">DreamStream</span></p>
              <a
                href="/"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Start your own journal →
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}