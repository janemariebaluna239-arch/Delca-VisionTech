import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Calendar, 
  DollarSign, 
  MessageSquare, 
  TrendingUp, 
  UserX, 
  Mail, 
  PhoneCall, 
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Executive, DELCAEvent } from '../types';
import { calculateRelationshipHealthScore, HealthScoreResult } from '../lib/contactUtils';

interface RelationshipHealthViewProps {
  executives: Executive[];
  events: DELCAEvent[];
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail: (exec: Executive) => void;
  onOpenInteraction: (exec: Executive) => void;
}

export default function RelationshipHealthView({
  executives,
  events,
  onOpen360Profile,
  onComposeEmail,
  onOpenInteraction
}: RelationshipHealthViewProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'Thriving' | 'Moderate' | 'At Risk'>('all');
  const [selectedExecId, setSelectedExecId] = useState<string | null>(executives[0]?.id || null);

  // Compute Health Data for all executives
  const healthDataList = executives.map(exec => ({
    exec,
    health: calculateRelationshipHealthScore(exec)
  }));

  const thrivingCount = healthDataList.filter(i => i.health.status === 'Thriving').length;
  const moderateCount = healthDataList.filter(i => i.health.status === 'Moderate').length;
  const atRiskCount = healthDataList.filter(i => i.health.status === 'At Risk').length;

  const avgHealthScore = Math.round(
    healthDataList.reduce((sum, i) => sum + i.health.score, 0) / (healthDataList.length || 1)
  );

  const filteredList = healthDataList.filter(i => {
    if (activeTab === 'all') return true;
    return i.health.status === activeTab;
  }).sort((a, b) => b.health.score - a.health.score);

  const selectedItem = healthDataList.find(i => i.exec.id === selectedExecId) || healthDataList[0];

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-950 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-2">
              <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Relationship Health Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Relationship Health Dashboard
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Algorithmic scoring evaluating communication recency, VIP event participation, follow-up compliance, and active deal velocity across all enterprise executive accounts.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-emerald-400">{avgHealthScore}%</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Avg System Health</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-white">{executives.length}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Executives</div>
            </div>
          </div>
        </div>

        {/* HEALTH CATEGORY STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('Thriving')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'Thriving'
                ? 'bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Thriving</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-display text-white mt-1">{thrivingCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">High engagement (&gt;75%)</div>
          </button>

          <button
            onClick={() => setActiveTab('Moderate')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'Moderate'
                ? 'bg-amber-500/20 border-amber-500/50 shadow-lg shadow-amber-500/10'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Moderate</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-display text-white mt-1">{moderateCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Steady relationship (45-74%)</div>
          </button>

          <button
            onClick={() => setActiveTab('At Risk')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'At Risk'
                ? 'bg-rose-500/20 border-rose-500/50 shadow-lg shadow-rose-500/10'
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider">At Risk</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-display text-white mt-1">{atRiskCount}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Re-engagement needed (&lt;45%)</div>
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: LIST + DETAIL BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: EXECUTIVE HEALTH LIST */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between bg-navy-900/80 p-3 rounded-xl border border-white/10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  activeTab === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({executives.length})
              </button>
              <button
                onClick={() => setActiveTab('Thriving')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  activeTab === 'Thriving' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Thriving ({thrivingCount})
              </button>
              <button
                onClick={() => setActiveTab('Moderate')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  activeTab === 'Moderate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                Moderate ({moderateCount})
              </button>
              <button
                onClick={() => setActiveTab('At Risk')}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  activeTab === 'At Risk' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                At Risk ({atRiskCount})
              </button>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredList.map(({ exec, health }) => {
              const isSelected = exec.id === selectedItem?.exec.id;

              return (
                <div
                  key={exec.id}
                  onClick={() => setSelectedExecId(exec.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-md'
                      : 'bg-slate-900/80 border-white/5 hover:border-white/20 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={exec.fullName}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate flex items-center space-x-1.5">
                          <span>{exec.fullName}</span>
                        </h4>
                        <p className="text-xs text-slate-400 truncate">{exec.position} • {exec.company}</p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0 ml-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                        health.status === 'Thriving'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : health.status === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {health.score}%
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">{health.status}</div>
                    </div>
                  </div>

                  {/* Health Bar Indicator */}
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full transition-all duration-500 ${
                        health.status === 'Thriving'
                          ? 'bg-emerald-400'
                          : health.status === 'Moderate'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                      style={{ width: `${health.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAILED HEALTH FACTORS & RE-ENGAGEMENT PLAN */}
        {selectedItem && (
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
            <div>
              {/* Executive Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedItem.exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                    alt={selectedItem.exec.fullName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/30"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{selectedItem.exec.fullName}</h3>
                    <p className="text-xs text-slate-400">{selectedItem.exec.position}</p>
                    <p className="text-xs text-cyan-400 font-medium">{selectedItem.exec.company}</p>
                  </div>
                </div>

                <button
                  onClick={() => onOpen360Profile(selectedItem.exec)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1"
                >
                  <span>360° Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Health Score Dial */}
              <div className="my-5 bg-navy-950 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Calculated Health Index</div>
                  <div className="text-3xl font-display font-bold text-white mt-0.5">
                    {selectedItem.health.score}
                    <span className="text-xs text-slate-500 font-normal"> / 100</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Stage: <strong className="text-cyan-300">{selectedItem.exec.relationshipStage}</strong>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl text-center border ${
                  selectedItem.health.status === 'Thriving'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : selectedItem.health.status === 'Moderate'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <div className="text-xs font-bold font-mono">{selectedItem.health.status}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Relationship State</div>
                </div>
              </div>

              {/* Score Factors Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Algorithmic Health Drivers</span>
                </h4>

                <div className="space-y-2">
                  {selectedItem.health.factors.map((factor, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center space-x-2">
                        {factor.positive ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        )}
                        <span className="text-slate-200">{factor.label}</span>
                      </div>
                      <span className={`font-mono font-bold ${factor.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {factor.positive ? `+${factor.points}` : factor.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Re-Engagement Action Panel */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl">
                <div className="text-[11px] font-mono text-cyan-300 font-semibold uppercase flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommended Action</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {selectedItem.health.status === 'At Risk'
                    ? `Dispatch a tailored VIP meeting brief or invitation to re-ignite dialogue with ${selectedItem.exec.fullName}.`
                    : selectedItem.health.status === 'Moderate'
                    ? `Schedule a 15-minute sync or check-in call regarding active business initiatives.`
                    : `Relationship is strong! Consider introducing new enterprise partnership opportunities.`}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpenInteraction(selectedItem.exec)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Log Interaction</span>
                </button>

                <button
                  onClick={() => onComposeEmail(selectedItem.exec)}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-navy-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Direct Email</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
