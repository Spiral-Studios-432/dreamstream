import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { 
  Home, Moon, BookOpen, HelpCircle, Sparkles, Menu, X, LogOut, User, ChevronRight
} from 'lucide-react';
import CreditBadge from './components/ui/CreditBadge';
import { cn } from "@/lib/utils";
import { useQuery } from '@tanstack/react-query';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Dreams', icon: Moon, page: 'Dreams' },
  { name: 'Reflections', icon: BookOpen, page: 'Reflections' },
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-slate-100">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DreamStream
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base",
                  isActive 
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-indigo-600" : "text-slate-400"
                )} />
                {item.name}
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 sm:p-4 border-t border-slate-100">
          {user ? (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-slate-50">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                  {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm sm:text-base text-slate-800 truncate">{user.full_name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <CreditBadge credits={userCredits?.total_credits} size="small" showLabel={false} />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 text-xs sm:text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="ml-1">Logout</span>
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-sm sm:text-base"
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
        <header className="h-14 sm:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-3 sm:px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 sm:p-2 -ml-1 rounded-lg hover:bg-slate-100 flex-shrink-0"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>

            <h1 className="text-base sm:text-lg font-semibold text-slate-800 truncate">
              {currentPageName}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <CreditBadge 
              credits={userCredits?.total_credits} 
              size="small"
              showLabel={false}
            />
            {user && (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-semibold text-xs sm:text-sm lg:hidden">
                {user.full_name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}