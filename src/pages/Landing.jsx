import React, { useEffect, useState } from 'react';
import { Moon, Sparkles, BookOpen, ArrowRight, Eye, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const STARS = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 5,
}));

const ORBS = [
  { color: '#7c6af7', x: '10%', y: '20%', size: 480, blur: 140, opacity: 0.14 },
  { color: '#a78bfa', x: '72%', y: '12%', size: 380, blur: 120, opacity: 0.12 },
  { color: '#c084fc', x: '50%', y: '60%', size: 560, blur: 160, opacity: 0.10 },
  { color: '#818cf8', x: '85%', y: '72%', size: 320, blur: 110, opacity: 0.11 },
  { color: '#9d6fd4', x: '18%', y: '80%', size: 420, blur: 130, opacity: 0.10 },
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
    <div className="min-h-screen bg-[#06040f] overflow-hidden text-white">

      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: orb.x, top: orb.y,
              width: orb.size, height: orb.size,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [orb.opacity, orb.opacity * 1.3, orb.opacity] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {STARS.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size }}
            animate={{ opacity: [0.15, 0.8, 0.15] }}
            transition={{ duration: star.duration, delay: star.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* ── HERO ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 pt-16 pb-24">
        <div className="w-full max-w-4xl mx-auto text-center">

          {/* Moon */}
          <motion.div
            className="mx-auto mb-7 sm:mb-10 relative w-20 h-20 sm:w-28 sm:h-28"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            {[1, 2].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-violet-300/15"
                style={{ inset: `-${ring * 16}px` }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 4 + ring, repeat: Infinity, ease: 'easeInOut', delay: ring * 0.5 }}
              />
            ))}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-violet-300 via-purple-400 to-indigo-500 shadow-2xl shadow-violet-500/50 flex items-center justify-center">
              <Moon className="w-10 h-10 sm:w-14 sm:h-14 text-white drop-shadow-lg" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold leading-snug tracking-tight mb-4 sm:mb-5 px-2"
          >
            <span className="block text-white/90">Your dreams have something</span>
            <span
              className="block mt-1"
              style={{
                background: 'linear-gradient(135deg, #c4b5fd 0%, #a5b4fc 45%, #93c5fd 75%, #e879f9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              beautiful to tell you.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-sm sm:text-lg text-slate-300/80 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed px-2"
          >
            A gentle place to capture, understand, and grow from the stories your sleeping mind weaves each night.
            No pressure — just quiet, meaningful reflection.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full sm:w-auto"
          >
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative group w-full sm:w-auto px-9 py-4 rounded-2xl text-base font-semibold text-white overflow-hidden shadow-xl shadow-violet-600/30"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1, #a855f7)' }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                Begin Your Journey
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl text-sm font-medium text-slate-300/80 border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300"
              onClick={handleGetStarted}
            >
              See how it works ↓
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500/70 text-xs tracking-widest uppercase"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span>Explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-500/50 to-transparent" />
        </motion.div>
      </div>

      {/* ── FEATURES ── */}
      <div className="relative z-10 py-16 sm:py-32 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-violet-300/70 font-medium text-xs tracking-widest uppercase mb-3">Everything you need</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white/90 mb-3">
              A cosy toolkit for your inner world
            </h2>
            <p className="text-slate-400/80 text-base max-w-lg mx-auto leading-relaxed">
              Thoughtfully designed to feel like a warm bedside journal — not a clinical app.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                icon: Moon,
                title: 'Dream Journal',
                description: 'Jot down every whisper of your dream before it slips away — moods, symbols, feelings and all.',
                border: 'border-indigo-500/20',
                bg: 'bg-indigo-500/[0.06]',
                gradient: 'from-indigo-400 to-violet-500',
              },
              {
                icon: Sparkles,
                title: 'Gentle Interpretations',
                description: 'Soft, Jungian-inspired insights that help you see yourself with more kindness and curiosity.',
                border: 'border-violet-500/25',
                bg: 'bg-violet-500/[0.08]',
                gradient: 'from-violet-400 to-purple-500',
                featured: true,
              },
              {
                icon: BookOpen,
                title: 'Daily Reflections',
                description: 'Short, calming prompts that gently bridge your waking and dreaming life each morning.',
                border: 'border-purple-500/20',
                bg: 'bg-purple-500/[0.06]',
                gradient: 'from-purple-400 to-pink-500',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`relative rounded-2xl p-5 sm:p-7 border ${feature.border} ${feature.bg} backdrop-blur-sm`}
              >
                {feature.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg">
                    Most Loved
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">{feature.title}</h3>
                <p className="text-slate-400/80 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="relative z-10 py-12 sm:py-20 px-5 border-y border-white/[0.05]">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3 sm:gap-8 text-center">
          {[
            { value: '10,000+', label: 'Dreams Captured' },
            { value: '98%', label: 'Feel More Self-Aware' },
            { value: '∞', label: 'Insights Waiting for You' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="text-xl sm:text-4xl font-bold bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent mb-1">{stat.value}</div>
              <div className="text-slate-500/80 text-[10px] sm:text-sm leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="relative z-10 py-16 sm:py-32 px-5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-violet-300/70 font-medium text-xs tracking-widest uppercase mb-3">How it works</p>
            <h2 className="text-2xl sm:text-4xl font-bold text-white/90">As easy as writing in a diary</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              { step: '01', icon: Moon, title: 'Wake up & write it down', desc: 'Capture whatever you remember — even fragments are worth keeping. Details, feelings, colours, anything.' },
              { step: '02', icon: Eye, title: 'Add a little context', desc: "A few words about your day or how you've been feeling helps the interpretation feel personal to you." },
              { step: '03', icon: Zap, title: 'Receive a thoughtful insight', desc: 'A warm, personalised reflection that connects the dots between your dreams and your waking life.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="flex gap-4 items-start p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.04] transition-colors"
              >
                <div className="text-3xl sm:text-4xl font-bold text-white/[0.06] leading-none w-10 sm:w-12 flex-shrink-0 select-none">{item.step}</div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white/90 mb-1">{item.title}</h3>
                  <p className="text-slate-400/80 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div className="relative z-10 py-16 sm:py-32 px-5">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div
            className="relative rounded-3xl overflow-hidden p-8 sm:p-16"
            style={{
              background: 'linear-gradient(135deg, rgba(109,40,217,0.25) 0%, rgba(99,102,241,0.15) 50%, rgba(147,51,234,0.25) 100%)',
              border: '1px solid rgba(167,139,250,0.2)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
            </div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="text-5xl mb-6"
            >
              🌙
            </motion.div>

            <h2 className="text-2xl sm:text-4xl font-bold text-white/90 mb-3">
              Your next dream is already on its way.
            </h2>
            <p className="text-slate-300/70 text-sm sm:text-base mb-8 sm:mb-10 max-w-md mx-auto leading-relaxed">
              Start your journal tonight — it's free, it's gentle, and it just might surprise you.
            </p>

            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl text-base font-semibold text-white shadow-xl shadow-violet-500/30 relative overflow-hidden group"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1, #a855f7)' }}
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <span className="relative flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Start Dreaming Free
                <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* ── FOOTER ── */}
      <div className="relative z-10 py-8 px-5 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto flex flex-col items-center sm:flex-row sm:justify-between gap-2 text-slate-500/60 text-xs sm:text-sm text-center">
          <div className="flex items-center gap-2 font-semibold text-white/50">
            <Moon className="w-4 h-4 text-violet-400/70" />
            <span style={{ background: 'linear-gradient(90deg, #c4b5fd, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DreamStream
            </span>
          </div>
          <p>© 2026 DreamStream · A quiet space for your dreams.</p>
        </div>
      </div>
    </div>
  );
}