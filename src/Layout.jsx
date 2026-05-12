import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { 
  Home, Moon, BookOpen, HelpCircle, Sparkles, Menu, X, LogOut, User, ChevronRight, ShoppingBag
} from 'lucide-react';
import CreditBadge from './components/ui/CreditBadge';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Dreams', icon: Moon, page: 'Dreams' },
  { name: 'Reflections', icon: BookOpen, page: 'Reflections' },
  { name: 'Store', icon: ShoppingBag, page: 'Store' },
  { name: 'Credits', icon: Sparkles, page: 'Credits' },
  { name: 'Support', icon: HelpCircle, page: 'Support' },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

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

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-[#03020a] flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/50 flex flex-col transition-transform duration-300 shadow-xl lg:shadow-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-100/50">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 sm:gap-3 group">
            <motion.div 
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-200/50 group-hover:shadow-indigo-300/70 transition-shadow"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              DreamStream
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100/80 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <motion.div
                key={item.page}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={createPageUrl(item.page)}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-2xl font-medium transition-all duration-200 text-sm sm:text-base relative overflow-hidden group",
                    isActive 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200/50" 
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/30 hover:text-slate-900"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      layoutId="activeNav"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={cn(
                    "w-5 h-5 flex-shrink-0 relative z-10",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500 transition-colors"
                  )} />
                  <span className="relative z-10">{item.name}</span>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <ChevronRight className="w-4 h-4 ml-auto text-white/80 relative z-10" />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 sm:p-4 border-t border-slate-100/50">
          {user ? (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-100/50">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm shadow-lg">
                  {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-slate-800 truncate">{user.full_name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <CreditBadge credits={userCredits?.total_credits} size="small" showLabel={false} />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-500 hover:bg-red-50 text-xs sm:text-sm rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-1">Logout</span>
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-sm sm:text-base shadow-lg shadow-indigo-200/50 rounded-xl"
              onClick={() => base44.auth.redirectToLogin()}
            >
              Sign In
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 sm:h-16 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-3 sm:px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 -ml-1 rounded-xl hover:bg-slate-100/80 flex-shrink-0 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </motion.button>

            <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
              {currentPageName}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }}>
              <CreditBadge 
                credits={userCredits?.total_credits} 
                size="small"
                showLabel={false}
              />
            </motion.div>
            {user && (
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-xs sm:text-sm lg:hidden shadow-lg"
              >
                {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
              </motion.div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto pb-safe">
          <div className="pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}