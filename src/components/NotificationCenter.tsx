import React, { useState } from 'react';
import { Bell, Check, Trash2, Calendar, AlertTriangle, ShieldCheck, Mail, ChevronRight, X, Sparkles, DollarSign, Send } from 'lucide-react';
import { NotificationItem, Executive, Invitation } from '../types';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  executives: Executive[];
  invitations: Invitation[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSelectExecutive: (execId: string) => void;
}

export default function NotificationCenter({
  notifications,
  executives,
  invitations,
  onMarkAsRead,
  onClearAll,
  onSelectExecutive
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Urgent' | 'Meetings' | 'Events' | 'Opportunities' | 'Invitations' | 'System'>('All');

  const todayISO = new Date().toISOString().slice(0, 10);
  
  // Follow ups pending
  const upcomingFollowUps = executives.filter(e => e.followUpDate && e.followUpDate <= '2026-08-15');
  const unverifiedContacts = executives.filter(e => e.contactStatus === 'Unverified' || e.contactStatus === 'Pending Verification');
  const pendingInvitations = invitations.filter(i => i.status === 'Pending' || i.status === 'Draft');
  
  // Active Opportunities
  const highValueOpps = executives.flatMap(e => (e.opportunities || []).map(o => ({ ...o, execName: e.fullName })));

  const unreadCount = notifications.filter(n => !n.read).length + upcomingFollowUps.length + unverifiedContacts.length;

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all focus:outline-none"
        title="Notification Center"
      >
        <Bell className="w-4 h-4 text-cyan-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-500 text-navy-950 font-extrabold text-[10px] flex items-center justify-center animate-pulse border-2 border-navy-950">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Drawer Popover */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed top-16 right-4 md:right-8 w-[calc(100vw-2rem)] sm:w-[420px] bg-navy-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl z-[100] p-4 space-y-4 max-h-[85vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out_1]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-display font-bold text-sm">
                <Bell className="w-4 h-4" />
                <span>Executive Notifications & Alerts</span>
              </div>

              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-[10px] text-slate-400 hover:text-cyan-300 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[10px] font-mono">
              {(['All', 'Urgent', 'Meetings', 'Events', 'Opportunities', 'Invitations', 'System'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                    activeFilter === tab
                      ? 'bg-cyan-500 text-navy-950 font-extrabold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Lists */}
            <div className="space-y-3">
              {/* URGENT / FOLLOW-UPS */}
              {(activeFilter === 'All' || activeFilter === 'Urgent' || activeFilter === 'Meetings') && upcomingFollowUps.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center space-x-1 font-bold">
                    <Calendar className="w-3 h-3" />
                    <span>Executive Follow-Ups ({upcomingFollowUps.length})</span>
                  </div>

                  {upcomingFollowUps.map(exec => (
                    <div 
                      key={exec.id} 
                      onClick={() => {
                        onSelectExecutive(exec.id);
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-400/50 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white group-hover:text-amber-300">{exec.fullName}</span>
                        <span className="text-[10px] font-mono text-amber-300">{exec.followUpDate}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-1">{exec.position} at {exec.company}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* UNVERIFIED CONTACTS */}
              {(activeFilter === 'All' || activeFilter === 'Urgent' || activeFilter === 'System') && unverifiedContacts.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center space-x-1 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Profile Verification Needed ({unverifiedContacts.length})</span>
                  </div>

                  {unverifiedContacts.slice(0, 3).map(exec => (
                    <div 
                      key={exec.id}
                      onClick={() => {
                        onSelectExecutive(exec.id);
                        setIsOpen(false);
                      }}
                      className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/50 cursor-pointer transition-all space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white group-hover:text-cyan-300">{exec.fullName}</span>
                        <span className="text-[10px] font-mono text-cyan-300">{exec.contactStatus}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{exec.company} • {exec.country}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* INVITATIONS */}
              {(activeFilter === 'All' || activeFilter === 'Invitations' || activeFilter === 'Events') && pendingInvitations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center space-x-1 font-bold">
                    <Send className="w-3 h-3" />
                    <span>Pending Invitations ({pendingInvitations.length})</span>
                  </div>

                  {pendingInvitations.slice(0, 3).map(inv => (
                    <div 
                      key={inv.id}
                      className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-purple-300">
                        <span>VIP Invitation Draft</span>
                        <span className="text-[9px] font-mono text-slate-400">{inv.status}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 truncate">{inv.subjectLine || 'Invitation Subject'}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* OPPORTUNITIES */}
              {(activeFilter === 'All' || activeFilter === 'Opportunities') && highValueOpps.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center space-x-1 font-bold">
                    <DollarSign className="w-3 h-3" />
                    <span>Active Opportunities ({highValueOpps.length})</span>
                  </div>

                  {highValueOpps.slice(0, 3).map(opp => (
                    <div 
                      key={opp.id}
                      className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-emerald-300">
                        <span>{opp.title}</span>
                        <span className="text-[10px] font-mono text-emerald-400">${opp.value.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{opp.execName} • {opp.stage}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Notifications Feed */}
              {(activeFilter === 'All' || activeFilter === 'System') && notifications.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    System Log
                  </div>

                  {notifications.map(notif => (
                    <div 
                      key={notif.id}
                      onClick={() => onMarkAsRead(notif.id)}
                      className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                        notif.read ? 'bg-navy-950/40 border-white/5 text-slate-400' : 'bg-white/5 border-cyan-500/30 text-white font-semibold'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">{notif.title}</span>
                        <span className="text-[9px] font-mono text-slate-500">{notif.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
