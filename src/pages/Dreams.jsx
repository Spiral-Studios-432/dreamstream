import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Plus, Search, Filter, X, Lock } from 'lucide-react';
import DreamForm from '../components/dreams/DreamForm';
import DreamCard from '../components/dreams/DreamCard';
import UpgradePrompt from '../components/ui/UpgradePrompt';
import ExportMenu from '../components/dreams/ExportMenu';
import { AnimatePresence, motion } from 'framer-motion';

const FREE_DREAM_LIMIT = 9;

export default function Dreams() {
  const [showForm, setShowForm] = useState(false);
  const [editDream, setEditDream] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [user, setUser] = useState(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: dreams = [], isLoading } = useQuery({
    queryKey: ['dreams', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return base44.entities.Dream.filter({ created_by: user.email }, '-dream_date', 100);
    },
    enabled: !!user?.email,
  });

  const { data: userCredits } = useQuery({
    queryKey: ['userCredits', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const credits = await base44.entities.UserCredits.filter({ user_email: user.email });
      return credits[0] || null;
    },
    enabled: !!user?.email,
  });

  const filteredDreams = dreams.filter(dream => {
    const matchesSearch = dream.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dream.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || dream.dream_type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSave = async (dreamData) => {
    const today = new Date().toISOString().split('T')[0];
    
    if (editDream) {
      await base44.entities.Dream.update(editDream.id, dreamData);
    } else {
      await base44.entities.Dream.create(dreamData);
      
      // Award credits for new dream
      if (userCredits) {
        const isNewDay = userCredits.last_activity_date !== today;
        const newStreak = isNewDay 
          ? (userCredits.last_activity_date === new Date(Date.now() - 86400000).toISOString().split('T')[0] 
              ? userCredits.streak_days + 1 
              : 1)
          : userCredits.streak_days;

        await base44.entities.UserCredits.update(userCredits.id, {
          total_credits: (userCredits.total_credits || 0) + 10,
          total_dreams_logged: (userCredits.total_dreams_logged || 0) + 1,
          streak_days: newStreak,
          last_activity_date: today,
        });
      }
    }
    
    queryClient.invalidateQueries(['dreams']);
    queryClient.invalidateQueries(['userCredits']);
    setShowForm(false);
    setEditDream(null);
  };

  const handleDelete = async (id) => {
    await base44.entities.Dream.delete(id);
    queryClient.invalidateQueries(['dreams']);
  };

  const handleEdit = (dream) => {
    setEditDream(dream);
    setShowForm(true);
  };

  const isFree = !userCredits || userCredits.tier === 'free';
  const atFreeLimit = isFree && dreams.length >= FREE_DREAM_LIMIT;

  const handleNewDream = () => {
    if (atFreeLimit) {
      setShowUpgradePrompt(true);
      return;
    }
    setEditDream(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[#03020a]">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:gap-5 mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-200/50"
            >
              <Moon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Dream Journal</h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">{dreams.length} dreams recorded</p>
            </div>
            <ExportMenu dreams={filteredDreams} />
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={handleNewDream}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 shadow-xl shadow-indigo-200/50 text-sm sm:text-base rounded-xl font-semibold"
            >
              {atFreeLimit ? <><Lock className="w-5 h-5 mr-2" /> Upgrade to Log More</> : <><Plus className="w-5 h-5 mr-2" /> Log Dream</>}
            </Button>
            {isFree && (
              <p className="text-xs text-slate-400 mt-1 text-center sm:text-left">
                {dreams.length}/9 free dreams used
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dreams..."
              className="pl-10 border-slate-200 bg-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px] border-slate-200 bg-white text-sm">
              <Filter className="w-4 h-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="lucid">Lucid</SelectItem>
              <SelectItem value="nightmare">Nightmare</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="vivid">Vivid</SelectItem>
              <SelectItem value="prophetic">Prophetic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upgrade Prompt */}
        {showUpgradePrompt && (
          <UpgradePrompt reason="dreams" onClose={() => setShowUpgradePrompt(false)} />
        )}

        {/* Dream Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl sm:my-8"
              >
                <DreamForm 
                  onClose={() => { setShowForm(false); setEditDream(null); }}
                  onSave={handleSave}
                  editDream={editDream}
                  userCredits={userCredits}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dreams List */}
        {isLoading ? (
          <div className="space-y-3 sm:space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-xl bg-white animate-pulse" />
            ))}
          </div>
        ) : filteredDreams.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {filteredDreams.map(dream => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onEdit={handleEdit}
                onDelete={handleDelete}
                expanded={expandedId === dream.id}
                onToggle={() => setExpandedId(expandedId === dream.id ? null : dream.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
              <Moon className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {searchTerm || filterType !== 'all' ? 'No dreams found' : 'No dreams yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start logging your dreams to discover patterns and meanings'}
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <Plus className="w-4 h-4 mr-2" /> Log Your First Dream
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}