import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  Mail, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight,
  Filter,
  Sparkles,
  Building2
} from 'lucide-react';
import { Executive } from '../types';
import { getLostOpportunityAlerts, LostOpportunityAlert } from '../lib/contactUtils';

interface LostOpportunityAlertsViewProps {
  executives: Executive[];
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail: (exec: Executive) => void;
  onOpenInteraction: (exec: Executive) => void;
}

export default function LostOpportunityAlertsView({
  executives,
  onOpen360Profile,
  onComposeEmail,
  onOpenInteraction
}: LostOpportunityAlertsViewProps) {
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Critical' | 'High' | 'Medium'>('All');

  const allAlerts = getLostOpportunityAlerts(executives);

  const filteredAlerts = allAlerts.filter(a => {
    if (severityFilter === 'All') return true;
    return a.severity === severityFilter;
  });

  const criticalCount = allAlerts.filter(a => a.severity === 'Critical').length;
  const highCount = allAlerts.filter(a => a.severity === 'High').length;

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-navy-950 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Relationship Attrition Safeguards</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Lost Opportunity & Attrition Alerts
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Automated danger alerts warning when high-value executive contacts go uncontacted for extended periods, proposals stall, or scheduled follow-ups pass.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-rose-400">{criticalCount}</div>
              <div className="text-[10px] font-mono text-rose-300 uppercase">Critical Warnings</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-amber-300">{highCount}</div>
              <div className="text-[10px] font-mono text-amber-400 uppercase">High Priority</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex items-center justify-between bg-navy-900/80 p-4 rounded-xl border border-white/10">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSeverityFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              severityFilter === 'All' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/5 text-slate-400'
            }`}
          >
            All Alerts ({allAlerts.length})
          </button>
          <button
            onClick={() => setSeverityFilter('Critical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              severityFilter === 'Critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-white/5 text-slate-400'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setSeverityFilter('High')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              severityFilter === 'High' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-slate-400'
            }`}
          >
            High ({highCount})
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <strong className="text-white">{filteredAlerts.length}</strong> active warnings
        </div>
      </div>

      {/* ALERTS CARDS */}
      <div className="space-y-3">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              alert.severity === 'Critical'
                ? 'bg-rose-950/40 border-rose-500/40 hover:border-rose-500 shadow-lg shadow-rose-500/5'
                : 'bg-amber-950/30 border-amber-500/30 hover:border-amber-500'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${
                alert.severity === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    alert.severity === 'Critical' ? 'bg-rose-500/30 text-rose-200' : 'bg-amber-500/30 text-amber-200'
                  }`}>
                    {alert.severity} • {alert.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Account: <strong className="text-white">{alert.executive.company}</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">{alert.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">{alert.description}</p>
                
                <div className="mt-2 text-[11px] font-mono text-cyan-300 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recommended: {alert.recommendedAction}</span>
                </div>
              </div>
            </div>

            {/* Direct Resolution Actions */}
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
              <button
                onClick={() => onOpen360Profile(alert.executive)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                360° Profile
              </button>

              <button
                onClick={() => onOpenInteraction(alert.executive)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Log Activity</span>
              </button>

              <button
                onClick={() => onComposeEmail(alert.executive)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Re-Engage Now</span>
              </button>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="py-12 text-center bg-slate-900/60 rounded-2xl border border-white/10">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white">No Active Attrition Alerts</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              All executive accounts have active recent communication, up-to-date follow-ups, and moving business opportunities!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
