import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Moon, Sparkles, BookOpen, Heart, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) =>
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${
              i % 3 === 0 ? '#818cf8' : i % 3 === 1 ? '#a78bfa' : '#f0abfc'} 0%, transparent 70%)`,

              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }} />

          )}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-white/40 text-indigo-700 text-sm font-medium mb-8 shadow-lg hidden">
              <Sparkles className="w-4 h-4" />
              100% Ad-Free • Always Free to Start
            </div>
          </motion.div>

          <motion.h1 className="bg-clip-text text-transparent mb-6 text-5xl font-normal leading-tight sm:text-6xl lg:text-7xl from-indigo-600 via-purple-600 to-pink-600"

          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}>
            
            Your Dreams,
            <br />
            Beautifully Captured
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}>
            
            A peaceful space to journal your dreams, discover patterns,
            and unlock the wisdom of your subconscious mind.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}>
            
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 hover:scale-105">
              
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>
          
          <div className="w-6 h-10 rounded-full border-2 border-indigo-300 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-indigo-400" />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-slate-600 text-lg">Simple, beautiful, and distraction-free</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              icon: Moon,
              title: "Dream Journal",
              description: "Log your dreams with mood tracking and rich details. Never forget another dream.",
              gradient: "from-indigo-500 to-blue-500"
            },
            {
              icon: Sparkles,
              title: "AI Insights",
              description: "Get meaningful interpretations and discover patterns in your dreams.",
              gradient: "from-purple-500 to-pink-500"
            },
            {
              icon: BookOpen,
              title: "Daily Reflections",
              description: "Guided prompts to explore your thoughts and earn rewards for mindfulness.",
              gradient: "from-amber-500 to-orange-500"
            }].
            map((feature, i) =>
            <motion.div
              key={i}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}>
              
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/40 h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}>
          
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30" />
            <div className="relative z-10">
              <Heart className="w-12 h-12 mx-auto mb-6 text-white" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to explore your dreams?
              </h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl mx-auto">
                Join thousands discovering the hidden meanings in their dreams.
                Start your journey today, completely free.
              </p>
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold">
                
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative py-8 px-4 border-t border-white/40">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DreamStream
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 DreamStream. A peaceful place for your dreams.
          </p>
        </div>
      </div>
    </div>);

}