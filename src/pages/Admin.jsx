import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Users, Ticket, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
// Badge imported but available if needed
import { motion } from 'framer-motion';

const statusColors = {
  open: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-slate-100 text-slate-600',
};

const priorityColors = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [expandedTicket, setExpandedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(u => { setUser(u); setAuthLoading(false); }).catch(() => setAuthLoading(false));
  }, []);

  const { data: tickets = [] } = useQuery({
    queryKey: ['adminTickets'],
    queryFn: () => base44.entities.SupportTicket.list('-created_date', 100),
    enabled: user?.role === 'admin',
  });

  const { data: allCredits = [] } = useQuery({
    queryKey: ['adminCredits'],
    queryFn: () => base44.entities.UserCredits.list('-created_date', 100),
    enabled: user?.role === 'admin',
  });

  const updateTicket = useMutation({
    mutationFn: ({ id, data }) => base44.entities.SupportTicket.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['adminTickets']),
  });

  const handleUpdateTicket = (ticket, status) => {
    updateTicket.mutate({
      id: ticket.id,
      data: {
        status,
        admin_response: responseText || ticket.admin_response,
      }
    });
    setExpandedTicket(null);
    setResponseText('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#03020a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#03020a] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-500">This page is for admins only.</p>
        </div>
      </div>
    );
  }

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const freeUsers = allCredits.filter(u => u.tier === 'free').length;
  const paidUsers = allCredits.filter(u => u.tier !== 'free').length;

  return (
    <div className="min-h-screen bg-[#03020a]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-slate-400 ml-14">Manage users and support tickets</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Users', value: allCredits.length, icon: Users, color: 'from-blue-500 to-indigo-500' },
            { label: 'Free Users', value: freeUsers, icon: Users, color: 'from-slate-400 to-slate-600' },
            { label: 'Open Tickets', value: openTickets, icon: Ticket, color: 'from-orange-500 to-red-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 mb-6 overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Email</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Tier</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Dreams</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">AI Uses</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Streak</th>
                </tr>
              </thead>
              <tbody>
                {allCredits.map(u => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 text-white">{u.user_email}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.tier === 'free' ? 'bg-slate-600 text-slate-200' : 'bg-indigo-600 text-white'}`}>
                        {u.tier || 'free'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-300">{u.total_dreams_logged || 0}</td>
                    <td className="px-5 py-3 text-slate-300">{u.ai_interpretations_used || 0} / {u.tier === 'free' ? '9' : '∞'}</td>
                    <td className="px-5 py-3 text-slate-300">{u.streak_days || 0} days</td>
                  </tr>
                ))}
                {allCredits.length === 0 && (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">No users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-5 border-b border-white/10 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-semibold text-white">Support Tickets</h2>
          </div>
          <div className="divide-y divide-white/5">
            {tickets.length === 0 && (
              <div className="px-5 py-8 text-center text-slate-500">No tickets yet</div>
            )}
            {tickets.map(ticket => (
              <div key={ticket.id} className="p-5">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-white font-medium truncate">{ticket.subject}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status] || ''}`}>
                        {ticket.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[ticket.priority] || ''}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">{ticket.message}</p>
                    <p className="text-slate-500 text-xs mt-1">{ticket.category} · {new Date(ticket.created_date).toLocaleDateString()}</p>
                  </div>
                  {expandedTicket === ticket.id ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                </div>

                {expandedTicket === ticket.id && (
                  <div className="mt-4 space-y-3">
                    <div className="p-3 rounded-xl bg-white/5 text-slate-300 text-sm">{ticket.message}</div>
                    {ticket.admin_response && (
                      <div className="p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-200 text-sm">
                        <p className="text-xs text-indigo-400 mb-1 font-medium">Your previous response:</p>
                        {ticket.admin_response}
                      </div>
                    )}
                    <textarea
                      value={responseText}
                      onChange={e => setResponseText(e.target.value)}
                      placeholder="Write a response to the user..."
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm placeholder:text-slate-500 resize-none focus:outline-none focus:border-indigo-400"
                      rows={3}
                    />
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" onClick={() => handleUpdateTicket(ticket, 'in_progress')} className="bg-blue-600 hover:bg-blue-700 text-xs">
                        <Clock className="w-3 h-3 mr-1" /> Mark In Progress
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateTicket(ticket, 'resolved')} className="bg-green-600 hover:bg-green-700 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" /> Mark Resolved
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateTicket(ticket, 'closed')} className="text-xs border-white/20 text-slate-300">
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}