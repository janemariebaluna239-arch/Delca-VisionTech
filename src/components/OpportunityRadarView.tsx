import React, { useState } from 'react';
import { 
  Radar, 
  AlertTriangle, 
  Clock, 
  Send, 
  UserCheck, 
  Building2, 
  Calendar, 
  DollarSign, 
  Filter, 
  ChevronRight, 
  Mail, 
  PhoneCall, 
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';
import { Executive, DELCAEvent, BusinessOpportunity } from '../types';
import { calculateRelationshipHealthScore, getLostOpportunityAlerts } from '../lib/contactUtils';

interface OpportunityRadarViewProps {
  executives: Executive[];
  events: DELCAEvent[];
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail: (exec: Executive) => void;
  onOpenInteraction: (exec: Executive) => void;
}

export default function OpportunityRadarView({
  executives,
  events,
  onOpen360Profile,
  onComposeEmail,
  onOpenInteraction
}: OpportunityRadarViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'overdue' | 'stale' | 'high_value' | 'recent_event'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const nowMs = new Date().getTime();

  // Process Executives with Radar Metrics
  const radarExecutives = executives.map(exec => {
    const health = calculateRelationshipHealthScore(exec);
    const isOverdue = Boolean(exec.followUpDate && exec.followUpDate < todayStr);
    
    let daysSinceContact = 999;
    if (exec.lastContactDate) {
      daysSinceContact = Math.floor((nowMs - new Date(exec.lastContactDate).getTime()) / (1000 * 3600 * 24));
    }
    const isStale = daysSinceContact > 30;

    const activeOpps = (exec.opportunities || []).filter(o => o.stage !== 'Closed' && o.stage !== 'Won');
    const totalPipelineValue = activeOpps.reduce((sum, o) => sum + (o.value || 0), 0);
    const isHighValue = totalPipelineValue >= 100000;

    const recentEventsAttended = exec.previousEventAttendance || [];
    const hasRecentEvent = recentEventsAttended.length > 0;

    // Calculate Radar Urgency Priority
    let urgencyScore = 0;
    if (isOverdue) urgencyScore += 40;
    if (isStale) urgencyScore += 30;
    if (isHighValue) urgencyScore += 20;
    if (health.status === 'At Risk') urgencyScore += 25;
    if (hasRecentEvent) urgencyScore += 15;

    return {
      exec,
      health,
      isOverdue,
      isStale,
      daysSinceContact,
      activeOpps,
      totalPipelineValue,
      isHighValue,
      hasRecentEvent,
      urgencyScore
    };
  });

  // Filtered radar list
  const filteredList = radarExecutives
    .filter(item => {
      if (filterType === 'overdue') return item.isOverdue;
      if (filterType === 'stale') return item.isStale;
      if (filterType === 'high_value') return item.isHighValue;
      if (filterType === 'recent_event') return item.hasRecentEvent;
      return item.urgencyScore > 20 || item.isOverdue || item.isStale || item.isHighValue;
    })
    .filter(item => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        item.exec.fullName.toLowerCase().includes(term) ||
        item.exec.company.toLowerCase().includes(term) ||
        item.exec.position.toLowerCase().includes(term) ||
        item.exec.industry.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => b.urgencyScore - a.urgencyScore);

  // Summary Metrics
  const totalRadarCount = radarExecutives.filter(i => i.urgencyScore > 20).length;
  const overdueCount = radarExecutives.filter(i => i.isOverdue).length;
  const staleCount = radarExecutives.filter(i => i.isStale).length;
  const totalPipelineAtRisk = radarExecutives
    .filter(i => i.isOverdue || i.isStale || i.health.status === 'At Risk')
    .reduce((sum, i) => sum + i.totalPipelineValue, 0);

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Radar className="w-4 h-4 animate-pulse" />
              <span>Real-Time Business Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Executive Opportunity Radar
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Automated relationship signal monitoring highlighting high-value contacts, overdue follow-up dates, inactive proposals, and recent event engagements requiring immediate team response.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                filterType === 'all' 
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-navy-950 font-bold shadow-lg shadow-cyan-500/20' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Priority Signals</span>
            </button>
          </div>
        </div>

        {/* METRICS SUMMARY GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="text-[11px] font-mono text-cyan-300 uppercase">Radar Attention Needed</div>
            <div className="text-2xl font-bold text-white font-display mt-1">{totalRadarCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Key decision makers</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="text-[11px] font-mono text-rose-400 uppercase">Overdue Follow-Ups</div>
            <div className="text-2xl font-bold text-rose-300 font-display mt-1">{overdueCount}</div>
            <div className="text-[10px] text-rose-400/80 mt-0.5">Missed scheduled dates</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="text-[11px] font-mono text-amber-400 uppercase">Stale Relationships</div>
            <div className="text-2xl font-bold text-amber-300 font-display mt-1">{staleCount}</div>
            <div className="text-[10px] text-amber-400/80 mt-0.5">&gt;30 days without contact</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5">
            <div className="text-[11px] font-mono text-emerald-400 uppercase">Pipeline at Risk</div>
            <div className="text-2xl font-bold text-emerald-300 font-display mt-1">
              ${totalPipelineAtRisk.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400/80 mt-0.5">Active deals requiring action</div>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-navy-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            All Signals ({totalRadarCount})
          </button>
          <button
            onClick={() => setFilterType('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'overdue' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Overdue ({overdueCount})
          </button>
          <button
            onClick={() => setFilterType('stale')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'stale' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Stale ({staleCount})
          </button>
          <button
            onClick={() => setFilterType('high_value')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'high_value' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            High-Value Deals
          </button>
          <button
            onClick={() => setFilterType('recent_event')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterType === 'recent_event' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            Event Participants
          </button>
        </div>

        <div className="w-full md:w-72 relative">
          <input
            type="text"
            placeholder="Search radar contacts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* RADAR CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.map(({ exec, health, isOverdue, isStale, daysSinceContact, activeOpps, totalPipelineValue, urgencyScore }) => (
          <div
            key={exec.id}
            className="group relative bg-slate-900/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col justify-between"
          >
            {/* Top Badge & Urgency Pill */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  urgencyScore >= 50
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : urgencyScore >= 30
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                }`}>
                  Urgency Score: {urgencyScore}
                </span>

                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                  health.status === 'Thriving'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : health.status === 'Moderate'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  Health: {health.score}%
                </span>
              </div>

              {/* Executive Info */}
              <div className="flex items-start space-x-3.5 mb-4">
                <img
                  src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={exec.fullName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-cyan-400/50 transition-all"
                />
                <div className="flex-1 min-w-0">
                  <h3 
                    onClick={() => onOpen360Profile(exec)}
                    className="text-base font-semibold text-white truncate hover:text-cyan-300 cursor-pointer flex items-center space-x-1"
                  >
                    <span>{exec.fullName}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-300" />
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{exec.position}</p>
                  <div className="flex items-center space-x-1.5 text-xs text-cyan-400 font-medium mt-0.5 truncate">
                    <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{exec.company}</span>
                  </div>
                </div>
              </div>

              {/* Attention Signals Box */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2 mb-4">
                {isOverdue && (
                  <div className="flex items-center space-x-2 text-xs text-rose-300 font-mono">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span>Overdue follow-up ({exec.followUpDate})</span>
                  </div>
                )}

                {isStale && (
                  <div className="flex items-center space-x-2 text-xs text-amber-300 font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>Inactive for {daysSinceContact} days</span>
                  </div>
                )}

                {totalPipelineValue > 0 && (
                  <div className="flex items-center space-x-2 text-xs text-emerald-300 font-mono">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>Active Pipeline: ${totalPipelineValue.toLocaleString()} ({activeOpps.length} deal)</span>
                  </div>
                )}

                {!isOverdue && !isStale && totalPipelineValue === 0 && (
                  <div className="text-[11px] text-slate-400 italic">
                    Recent engagement recorded; ready for next partnership milestone.
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                onClick={() => onOpen360Profile(exec)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1"
              >
                <span>360° Profile</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenInteraction(exec)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold"
                  title="Log Call or Note"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onComposeEmail(exec)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
                  title={`Send Direct Email to ${exec.email}`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Outreach</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="col-span-full py-12 text-center bg-slate-900/60 rounded-2xl border border-white/10">
            <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">All Clear on Executive Opportunity Radar</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              No executive contacts currently meet the selected attention criteria. All follow-ups and active deals are up to date!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
