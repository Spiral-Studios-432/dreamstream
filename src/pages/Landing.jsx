import React, { useEffect, useState, useRef } from 'react';
import { Moon, Sparkles, BookOpen, ArrowRight, Star, Eye, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  duration: Math.random() * 4 + 2,
  delay: Math.random() * 5,
}));

const ORBS = [
  { color: '#6366f1', x: '10%', y: '20%', size: 500, blur: 140, opacity: 0.18 },
  { color: '#a855f7', x: '70%', y: '10%', size: 400, blur: 120, opacity: 0.15 },
  { color: '#ec4899', x: '50%', y: '60%', size: 600, blur: 160, opacity: 0.12 },
  { color: '#3b82f6', x: '85%', y: '70%', size: 350, blur: 110, opacity: 0.14 },
  { color: '#8b5cf6', x: '20%', y: '80%', size: 450, blur: 130, opacity: 0.13 },
];

export default function Landing() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(setIsAuthenticated);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(createPageUrl('Home'));
    } else {
      base44.auth.redirectToLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#03020a] overflow-hidden text-white">

      {/* ── NEBULA BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [orb.opacity, orb.opacity * 1.4, orb.opacity] }}
            transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Star field */}
        {STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        {/* Milky way band */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, rgba(139,92,246,0.04) 50%, transparent 70%)',
          }}
        />
      </div>

      {/* ── HERO ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-5xl mx-auto text-center">

          {/* Floating moon */}
          <motion.div
            className="mx-auto mb-10 relative w-32 h-32"
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-violet-400/20"
                style={{ inset: `-${ring * 14}px` }}
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.04, 1] }}
                transition={{ duration: 3 + ring, repeat: Infinity, ease: 'easeInOut', delay: ring * 0.4 }}
              />
            ))}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-300 via-purple-400 to-indigo-600 shadow-2xl shadow-violet-500/60 flex items-center justify-center">
              <Moon className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight tracking-tight mb-6 px-4"
          >
            <span className="block text-white">Unlock the</span>
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #c084fc 0%, #818cf8 40%, #60a5fa 70%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Language of Dreams
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Capture the whispers of your sleeping mind,
            decode symbols, and discover what your subconscious has been trying to tell you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="relative group px-10 py-4 rounded-2xl text-lg font-bold text-white overflow-hidden shadow-2xl shadow-violet-500/40"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1, #a855f7)' }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Begin Your Journey
                <ArrowRight className="w-5 h-5" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              className="px-8 py-4 rounded-2xl text-base font-medium text-slate-300 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              onClick={handleGetStarted}
            >
              See how it works ↓
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs tracking-widest uppercase"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span>Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-slate-500 to-transparent" />
        </motion.div>
      </div>

      {/* ── FEATURES ── */}
      <div className="relative z-10 py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-violet-400 font-semibold text-sm tracking-widest uppercase mb-4">Your Dream Toolkit</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Everything your mind needs
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Tools to help connect with your Higher Self...
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Moon,
                title: 'Dream Journal',
                description: 'Capture every detail — vivid, lucid, or fleeting — with mood tracking, tags, and rich sensory notes.',
                gradient: 'from-indigo-500 to-violet-600',
                glow: 'shadow-indigo-500/30',
                border: 'border-indigo-500/20',
                bg: 'bg-indigo-500/5',
              },
              {
                icon: Sparkles,
                title: 'Dream Interpretation',
                description: 'Get deep Jungian-inspired analyses personalized to your life, symbols, and emotional landscape.',
                gradient: 'from-violet-500 to-pink-500',
                glow: 'shadow-violet-500/30',
                border: 'border-violet-500/20',
                bg: 'bg-violet-500/5',
                featured: true,
              },
              {
                icon: BookOpen,
                title: 'Daily Reflections',
                description: 'Guided mindfulness prompts that bridge your waking and dreaming worlds every single day.',
                gradient: 'from-pink-500 to-amber-500',
                glow: 'shadow-pink-500/30',
                border: 'border-pink-500/20',
                bg: 'bg-pink-500/5',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className={`relative rounded-3xl p-8 border ${feature.border} ${feature.bg} backdrop-blur-sm ${feature.featured ? `shadow-2xl ${feature.glow}` : ''}`}
              >
                {feature.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS BAND ── */}
      <div className="relative z-10 py-16 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3 sm:gap-8 text-center">
          {[
            { value: '10,000+', label: 'Dreams Logged' },
            { value: '98%', label: 'Feel More Self-Aware' },
            { value: '∞', label: 'Insights Waiting' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="text-2xl sm:text-5xl font-black bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent mb-2">{stat.value}</div>
              <div className="text-slate-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="relative z-10 py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-violet-400 font-semibold text-sm tracking-widest uppercase mb-4">The Process</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white">Simple as dreaming</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              { step: '01', icon: Moon, title: 'Wake up & Record', desc: 'Capture your dream immediately — details, emotions, symbols — before they fade into morning light.' },
              { step: '02', icon: Eye, title: 'Add your context', desc: "Share what's happening in your life. Recent stress, major events, recurring feelings." },
              { step: '03', icon: Zap, title: 'Receive deep insights', desc: 'Get a personalized, Jungian-inspired interpretation that connects your dreams to your waking life.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex gap-6 items-start p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="text-5xl font-black text-white/5 leading-none w-16 flex-shrink-0 select-none">{item.step}</div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="relative z-10 py-24 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="relative rounded-3xl overflow-hidden p-16"
            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(99,102,241,0.2) 50%, rgba(168,85,247,0.3) 100%)', border: '1px solid rgba(139,92,246,0.3)', backdropFilter: 'blur(20px)' }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
            </div>

            <motion.div
              animate={{ rotate: [0, 10, -10, 0], y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl mb-6"
            >
              🌙
            </motion.div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Your dreams are waiting.
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-lg mx-auto">
              Every night is a new chapter. Start capturing yours tonight — it's completely free.
            </p>

            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              className="px-12 py-5 rounded-2xl text-lg font-black text-white shadow-2xl shadow-violet-500/50 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1, #a855f7)' }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <span className="relative flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                Start Dreaming Free
                <ArrowRight className="w-5 h-5" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── FOOTER ── */}
      <div className="relative z-10 py-10 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
          <div className="flex items-center gap-2 font-bold text-white/70">
            <Moon className="w-5 h-5 text-violet-400" />
            <span
              style={{
                background: 'linear-gradient(90deg, #c084fc, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DreamStream
            </span>
          </div>
          <p>© 2026 DreamStream. A space for your dreams.</p>
        </div>
      </div>
    </div>
  );
}