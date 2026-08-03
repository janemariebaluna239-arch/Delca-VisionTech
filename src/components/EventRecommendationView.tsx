/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Compass, 
  Send, 
  Calendar, 
  CheckCircle2, 
  Zap, 
  RefreshCcw,
  ShieldCheck,
  Building2,
  MapPin,
  Sparkles,
  Target,
  Layers,
  Sliders,
  Mail,
  UserCheck,
  TrendingUp,
  Brain,
  ChevronRight,
  ArrowUpRight,
  CheckCheck,
  Eye,
  Inbox,
  Clock,
  MessageSquare,
  MailWarning,
  AlertCircle,
  Filter,
  Search
} from 'lucide-react';
import { Executive, DELCAEvent, EventRecommendation, UserRole } from '../types';
import { getRolePermissions } from '../lib/rbac';

interface ExecutiveEmailTracking {
  execId: string;
  execName: string;
  execCompany: string;
  execPosition: string;
  email: string;
  lastSentSubject: string;
  sentAt: string;
  receivedToday: boolean;
  receivedAt?: string;
  isRead: boolean;
  readAt?: string;
  hasResponded: boolean;
  responseAt?: string;
  responseSubject?: string;
  responseSnippet?: string;
  intent?: string;
}

interface EventRecommendationViewProps {
  executives: Executive[];
  personas?: Record<string, any>;
  events: DELCAEvent[];
  recommendations: EventRecommendation[];
  onTriggerRecommendations: (execId: string) => Promise<void>;
  onNavigateToInvitation: (execId: string, eventId: string) => void;
  onComposeEmail?: (exec: Executive, customSubject?: string, customBody?: string) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  userRole?: UserRole | string;
}

export default function EventRecommendationView({
  executives,
  events,
  recommendations,
  onTriggerRecommendations,
  onNavigateToInvitation,
  onComposeEmail,
  onScheduleMeeting,
  userRole
}: EventRecommendationViewProps) {
  const permissions = getRolePermissions(userRole as UserRole);
  const [selectedExecId, setSelectedExecId] = useState<string>(executives[0]?.id || '');
  const [isMatching, setIsMatching] = useState(false);
  const [activeVector, setActiveVector] = useState<'events' | 'solutions' | 'outreach'>('events');
  const [minScoreFilter, setMinScoreFilter] = useState<number>(60);

  // Smart Matcher Email Outreach & Tracking State
  const [outreachFilter, setOutreachFilter] = useState<'all' | 'received_today' | 'read' | 'unread' | 'responded' | 'pending'>('all');
  const [searchOutreach, setSearchOutreach] = useState('');

  // Initializing realistic C-Suite email tracking states for executives
  const [emailRecords, setEmailRecords] = useState<ExecutiveEmailTracking[]>(() => {
    return executives.map((exec, idx) => {
      // Create varied, realistic communication states
      const isResponded = idx % 2 === 0;
      const isRead = idx % 5 !== 3; // ~80% read rate
      const receivedToday = idx % 3 === 0 || isResponded;

      return {
        execId: exec.id,
        execName: exec.fullName,
        execCompany: exec.company,
        execPosition: exec.position,
        email: exec.email,
        lastSentSubject: `DELCA Enterprise Solutions & Executive Briefing for ${exec.company}`,
        sentAt: `Today, 08:${10 + (idx * 3 % 45)} AM`,
        receivedToday,
        receivedAt: receivedToday ? `Today, 09:${15 + (idx * 2 % 40)} AM` : undefined,
        isRead,
        readAt: isRead ? `Today, 08:${25 + (idx * 2 % 30)} AM` : undefined,
        hasResponded: isResponded,
        responseAt: isResponded ? `Today, 09:${20 + (idx * 2 % 35)} AM` : undefined,
        responseSubject: isResponded ? `Re: DELCA Enterprise Solutions & Executive Briefing` : undefined,
        responseSnippet: isResponded
          ? `Thank you for reaching out. We have reviewed your BSP & SEC compliance framework with our leadership team. We would like to schedule a 15-minute briefing session next week.`
          : undefined,
        intent: isResponded ? 'High Commercial Interest / Briefing Requested' : 'Evaluation Stage'
      };
    });
  });

  const selectedExec = executives.find(e => e.id === selectedExecId);

  // Filter recommendations for selected executive
  const execRecommendations = recommendations
    .filter(r => r.executiveId === selectedExecId && r.matchScore >= minScoreFilter)
    .sort((a, b) => b.matchScore - a.matchScore);

  const triggerMatch = async () => {
    if (!selectedExecId) return;
    setIsMatching(true);
    try {
      await onTriggerRecommendations(selectedExecId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsMatching(false);
    }
  };

  // Calculate live global Smart Matcher email tracking statistics
  const emailsReceivedTodayCount = emailRecords.filter(r => r.receivedToday).length;
  const totalSent = emailRecords.length;
  const totalReadCount = emailRecords.filter(r => r.isRead).length;
  const totalUnreadCount = totalSent - totalReadCount;
  const readPercentage = totalSent > 0 ? Math.round((totalReadCount / totalSent) * 100) : 0;

  const totalRespondedCount = emailRecords.filter(r => r.hasResponded).length;
  const totalNotRespondedCount = emailRecords.filter(r => !r.hasResponded).length;
  const responsePercentage = totalSent > 0 ? Math.round((totalRespondedCount / totalSent) * 100) : 0;

  // Simulate incoming response / read for a specific executive in real-time
  const handleSimulateReadAndReply = (execId: string) => {
    const nowTimeStr = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setEmailRecords(prev => prev.map(rec => {
      if (rec.execId === execId) {
        return {
          ...rec,
          isRead: true,
          readAt: nowTimeStr,
          receivedToday: true,
          receivedAt: nowTimeStr,
          hasResponded: true,
          responseAt: nowTimeStr,
          responseSubject: `Re: DELCA Enterprise Solutions Briefing`,
          responseSnippet: `Confirmed! We reviewed your proposal and are interested in proceeding with the enterprise trial.`,
          intent: 'Meeting Confirmed / Immediate Trial'
        };
      }
      return rec;
    }));
  };

  // Filter email records for Outreach hub
  const filteredEmailRecords = emailRecords.filter(rec => {
    const matchesSearch = 
      rec.execName.toLowerCase().includes(searchOutreach.toLowerCase()) ||
      rec.execCompany.toLowerCase().includes(searchOutreach.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchOutreach.toLowerCase());

    if (!matchesSearch) return false;

    if (outreachFilter === 'received_today') return rec.receivedToday;
    if (outreachFilter === 'read') return rec.isRead;
    if (outreachFilter === 'unread') return !rec.isRead;
    if (outreachFilter === 'responded') return rec.hasResponded;
    if (outreachFilter === 'pending') return !rec.hasResponded;
    return true;
  });

  // DELCA Enterprise Solutions vector catalog
  const delcaSolutions = [
    {
      id: 'sol-eirms',
      title: 'DELCA EIRMS (Enterprise Risk Management Suite)',
      fitIndustry: selectedExec?.industry || 'Finance',
      score: selectedExec ? (selectedExec.industry === 'Banking' || selectedExec.industry === 'Finance' ? 96 : 88) : 85,
      benefits: ['BSP & SEC Regulatory Compliance', 'Automated Audit Trail Logging', 'Real-Time Fraud Prevention'],
      targetRoles: ['CEO', 'CFO', 'Chief Risk Officer', 'VP Technology']
    },
    {
      id: 'sol-cloud-erp',
      title: 'DELCA NextGen Cloud ERP Infrastructure',
      fitIndustry: selectedExec?.industry || 'Technology',
      score: selectedExec ? (selectedExec.company.includes('Corp') || selectedExec.company.includes('Inc') ? 94 : 89) : 88,
      benefits: ['Zero-Downtime Migration', 'Multi-Entity Ledger Consolidation', 'SAP / Oracle API Connector'],
      targetRoles: ['CIO', 'CTO', 'VP IT', 'VP Infrastructure']
    },
    {
      id: 'sol-ai-intelligence',
      title: 'DELCA Agentic AI Customer Intelligence Suite',
      fitIndustry: 'Cross-Industry',
      score: selectedExec ? (selectedExec.accountIntelligenceProfile ? 98 : 92) : 90,
      benefits: ['Autonomous C-Suite Sentiment Engine', 'Unified Customer Record Deduplication', 'Predictive Sales Radar'],
      targetRoles: ['Chief Revenue Officer', 'CMO', 'Head of Sales', 'Enterprise Director']
    }
  ];

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out_1]">
      {/* Smart Matcher Top Banner & Mode Toggle */}
      <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI Smart Matcher v2.5</span>
            </span>
            <span className="text-xs font-mono text-slate-400">• Multi-Vector Executive Alignment Engine</span>
          </div>
          <h2 className="text-xl font-display font-extrabold text-white">Smart Matcher & Strategic Alignment Center</h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            Synthesizes C-suite biographies, industry verticals, buying signals, and corporate priorities to calculate real-time alignment scores for events, solutions, and outreach campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-navy-950 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button
            onClick={() => setActiveVector('events')}
            className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-all flex items-center space-x-1.5 ${
              activeVector === 'events'
                ? 'bg-cyan-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Alignment</span>
          </button>

          {permissions.canUseSolutionFit ? (
            <button
              onClick={() => setActiveVector('solutions')}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-all flex items-center space-x-1.5 ${
                activeVector === 'solutions'
                  ? 'bg-cyan-500 text-navy-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Solution Fit</span>
            </button>
          ) : (
            <button
              disabled
              className="px-3.5 py-2 rounded-lg font-bold text-xs opacity-50 cursor-not-allowed text-slate-500 flex items-center space-x-1.5 bg-white/5"
              title="Solution Fit vector restricted to Sales & Leadership roles"
            >
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Solution Fit (Restricted)</span>
            </button>
          )}

          <button
            onClick={() => setActiveVector('outreach')}
            className={`px-3.5 py-2 rounded-lg font-bold text-xs transition-all flex items-center space-x-1.5 ${
              activeVector === 'outreach'
                ? 'bg-cyan-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Smart Email Dispatch</span>
          </button>
        </div>
      </div>

      {/* Global Live Email Telemetry & Response Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Emails Received Today */}
        <div className="glass-panel p-4 rounded-2xl border-cyan-500/20 bg-gradient-to-b from-navy-900/80 to-navy-950/80 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Emails Received Today</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-display font-black text-cyan-300">{emailsReceivedTodayCount}</span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Real-Time Feed</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Inbound responses & C-Suite email receipts</p>
        </div>

        {/* Metric 2: Read Status Tracking */}
        <div className="glass-panel p-4 rounded-2xl border-emerald-500/20 bg-gradient-to-b from-navy-900/80 to-navy-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Email Read Status</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-display font-black text-emerald-400">{readPercentage}%</span>
            <span className="text-[10px] font-mono text-slate-300">({totalReadCount} / {totalSent} Read)</span>
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-emerald-300 font-bold">{totalReadCount} Opened</span>
            <span className="text-amber-300 font-bold">{totalUnreadCount} Unread</span>
          </div>
        </div>

        {/* Metric 3: Responded Metrics */}
        <div className="glass-panel p-4 rounded-2xl border-purple-500/20 bg-gradient-to-b from-navy-900/80 to-navy-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Executives Responded</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-display font-black text-purple-300">{totalRespondedCount}</span>
            <span className="text-[10px] font-mono text-purple-400 font-bold">({responsePercentage}% Response Rate)</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate">Meeting requests & positive commercial replies</p>
        </div>

        {/* Metric 4: Not Yet Responded */}
        <div className="glass-panel p-4 rounded-2xl border-amber-500/20 bg-gradient-to-b from-navy-900/80 to-navy-950/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">Not Yet Responded</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-display font-black text-amber-300">{totalNotRespondedCount}</span>
            <span className="text-[10px] font-mono text-slate-400">Awaiting Reply</span>
          </div>
          <p className="text-[10px] text-amber-400/80 font-mono truncate">Automated re-engagement ready</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Executive Selector Sidebar */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border-white/10 space-y-4 h-[calc(100vh-250px)] flex flex-col justify-between">
          <div className="space-y-3 flex-grow flex flex-col min-h-0">
            <div className="border-b border-white/10 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-sm text-white">Target Executive Directory</h3>
                <p className="text-slate-400 text-xs mt-0.5">Select contact to run Smart Matcher</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                {executives.length} Contacts
              </span>
            </div>

            {/* Score Filter */}
            <div className="bg-navy-950/80 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[10px] uppercase">Min Match Score:</span>
              <div className="flex items-center space-x-2">
                {[50, 60, 75, 90].map(s => (
                  <button
                    key={s}
                    onClick={() => setMinScoreFilter(s)}
                    className={`px-2 py-0.5 rounded text-[10px] transition-all font-bold ${
                      minScoreFilter === s ? 'bg-cyan-500 text-navy-950' : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}%+
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto pr-1 flex-grow min-h-0 custom-scrollbar">
              {executives.map((exec) => {
                const matchCount = recommendations.filter(r => r.executiveId === exec.id && r.matchScore >= minScoreFilter).length;
                const isSelected = selectedExecId === exec.id;

                return (
                  <button
                    key={exec.id}
                    onClick={() => setSelectedExecId(exec.id)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-400/20 to-blue-600/20 border-cyan-400 text-white shadow-md shadow-cyan-400/10'
                        : 'border-white/5 bg-navy-950/40 hover:bg-navy-950/80 hover:border-white/15 text-slate-300'
                    }`}
                  >
                    <div className="space-y-0.5 truncate pr-2">
                      <div className="font-display font-bold text-xs text-white truncate">{exec.fullName}</div>
                      <div className="text-[10px] text-cyan-300 font-mono truncate">{exec.position} • {exec.company}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5 flex items-center space-x-1 font-mono">
                        <span>{exec.industry}</span>
                        <span>•</span>
                        <span className="text-emerald-400">{exec.contactStatus}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-1 rounded text-[9px] font-mono shrink-0 font-bold ${
                      matchCount > 0 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {matchCount > 0 ? `${matchCount} Matches` : 'Unmatched'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={triggerMatch}
            disabled={!selectedExecId || isMatching}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-navy-950 disabled:text-slate-500 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 shrink-0"
          >
            {isMatching ? (
              <>
                <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                <span>Running Smart Matcher...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-navy-950 fill-navy-950" />
                <span>Calculate Smart Alignment</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Recommendations & Matching Output Display */}
        <div className="lg:col-span-8 space-y-6">
          {selectedExec ? (
            <>
              {/* Active Executive Summary Card */}
              <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-navy-950/60">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Target Executive Selected</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {selectedExec.contactStatus}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {selectedExec.contactStatus === 'Verified' ? 'Verified C-Suite' : 'Standard Contact'}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-white">{selectedExec.fullName}</h3>
                  <p className="text-xs text-slate-300">
                    {selectedExec.position} at <strong className="text-white">{selectedExec.company}</strong> ({selectedExec.country || 'Philippines'})
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-cyan-300">
                    <span>Industry: <strong className="text-white">{selectedExec.industry}</strong></span>
                    <span>•</span>
                    <span>Dept: <strong className="text-white">{selectedExec.department}</strong></span>
                    <span>•</span>
                    <span>Email: <strong className="text-emerald-300">{selectedExec.email}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {onComposeEmail && (
                    <button
                      onClick={() => onComposeEmail(selectedExec)}
                      className="px-3.5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Compose Email</span>
                    </button>
                  )}

                  <button
                    onClick={triggerMatch}
                    className="px-3 py-2 bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-400/40 text-cyan-300 text-xs font-semibold rounded-xl transition-all flex items-center space-x-1.5"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Re-Run</span>
                  </button>
                </div>
              </div>

              {/* VECTOR 1: EVENT ALIGNMENT */}
              {activeVector === 'events' && (
                <>
                  {execRecommendations.length === 0 ? (
                    <div className="glass-panel p-12 rounded-2xl border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                        <Compass className="w-8 h-8" />
                      </div>
                      <div className="space-y-1 max-w-sm">
                        <h4 className="font-display font-bold text-white text-base">No Event Matches Above Threshold</h4>
                        <p className="text-xs text-slate-400">
                          Click "Calculate Smart Alignment" to evaluate {selectedExec.fullName}'s profile, position, and industry against upcoming corporate events.
                        </p>
                      </div>
                      <button
                        onClick={triggerMatch}
                        className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
                      >
                        Run Smart Matcher Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                        <span>Matched Events for {selectedExec.fullName} ({execRecommendations.length} calculated)</span>
                        <span>Smart Match Confidence</span>
                      </div>

                      {execRecommendations.map((rec) => {
                        const targetEvent = events.find(e => e.id === rec.eventId);
                        if (!targetEvent) return null;

                        return (
                          <div 
                            key={rec.eventId} 
                            className="glass-panel p-6 rounded-2xl border-white/10 hover:border-cyan-400/30 transition-all space-y-4 shadow-lg"
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                    {targetEvent.category}
                                  </span>
                                  <span className="text-xs font-mono text-slate-400">{targetEvent.date}</span>
                                </div>
                                <h4 className="font-display font-bold text-lg text-white">{targetEvent.name}</h4>
                                <p className="text-xs text-slate-300 flex items-center space-x-1">
                                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <span>{targetEvent.venue}</span>
                                </p>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <div className="text-2xl font-display font-black text-cyan-400">{rec.matchScore}%</div>
                                  <div className="text-[9px] font-mono text-slate-400 uppercase">Match Score</div>
                                </div>

                                <button
                                  onClick={() => onNavigateToInvitation(selectedExec.id, targetEvent.id)}
                                  className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-1.5 shrink-0"
                                >
                                  <Send className="w-4 h-4" />
                                  <span>Generate VIP Invite</span>
                                </button>
                              </div>
                            </div>

                            {/* Matching Breakdown Factors */}
                            <div className="space-y-2">
                              <span className="text-[10px] font-mono text-slate-400 uppercase">Smart Matcher Alignment Reasoning:</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {(rec.alignmentReasoning || []).map((reason, idx) => (
                                  <div key={idx} className="p-2.5 rounded-lg bg-navy-950/60 border border-white/5 text-slate-200 flex items-center space-x-2">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span className="text-[11px]">{reason}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* VECTOR 2: SOLUTION FIT */}
              {activeVector === 'solutions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                    <span>DELCA Solutions Matched to {selectedExec.company}</span>
                    <span>AI Compatibility Rating</span>
                  </div>

                  {delcaSolutions.map((sol) => (
                    <div key={sol.id} className="glass-panel p-6 rounded-2xl border-white/10 hover:border-purple-500/30 transition-all space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-3">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                            Target Sector: {sol.fitIndustry}
                          </span>
                          <h4 className="font-display font-bold text-base text-white mt-1">{sol.title}</h4>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-2xl font-display font-black text-purple-400">{sol.score}%</div>
                          <div className="text-[9px] font-mono text-slate-400 uppercase">Solution Fit Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-xl bg-navy-950/80 border border-white/5 space-y-1">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Key Enterprise Value Drivers</span>
                          <ul className="space-y-1 pt-1">
                            {sol.benefits.map((b, i) => (
                              <li key={i} className="flex items-center space-x-1.5 text-slate-200 text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-navy-950/80 border border-white/5 space-y-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">Ideal Buying Personas</span>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {sol.targetRoles.map((r, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-mono">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>

                          {onComposeEmail && (
                            <button
                              onClick={() => onComposeEmail(selectedExec)}
                              className="mt-3 w-full py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 font-bold text-xs transition-all flex items-center justify-center space-x-1"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Pitch Solution via Direct Email</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* VECTOR 3: SMART OUTREACH DISPATCH & LIVE EMAIL ANALYTICS */}
              {activeVector === 'outreach' && (
                <div className="space-y-6">
                  {/* Selected Executive Active Pitch Box */}
                  <div className="glass-panel p-6 rounded-2xl border-cyan-500/30 space-y-4 bg-navy-950/80 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-white text-base">Smart Matcher Outreach Engine</h4>
                          <p className="text-xs text-slate-400">
                            Synthesize personalized email copy and track live opens & responses for <strong className="text-white">{selectedExec.fullName}</strong>.
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-lg flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Tracking Active</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3 text-xs">
                      <div className="flex justify-between items-center text-[11px] font-mono">
                        <span className="text-slate-400">Target Executive: <strong className="text-cyan-300">{selectedExec.fullName}</strong></span>
                        <span className="text-slate-400">Direct Email: <strong className="text-emerald-300">{selectedExec.email}</strong></span>
                      </div>

                      <div className="p-3 bg-navy-950 rounded-lg border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Generated AI Pitch Draft:</span>
                        <p className="text-slate-200 text-xs italic">
                          "Dear {selectedExec.fullName}, based on {selectedExec.company}'s digital transformation goals in {selectedExec.industry}, DELCA Enterprise Solutions delivers guaranteed ERP compliance and C-suite relationship automation..."
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Smart Matcher AI Copy Engine Ready</span>
                        </span>

                        {onComposeEmail && (
                          <button
                            onClick={() => onComposeEmail(selectedExec)}
                            className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2"
                          >
                            <Send className="w-4 h-4" />
                            <span>Open Smart Matcher Email Dispatcher</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Executive Email Status & Read/Response Directory */}
                  <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-5 bg-navy-950/60">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-display font-bold text-base text-white">Live Email Analytics & Response Center</h4>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                            {filteredEmailRecords.length} Records
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Track read receipts, delivery timestamps, inbound email feeds, and pending C-suite responses.
                        </p>
                      </div>

                      {/* Search Bar */}
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search executive, company, email..."
                          value={searchOutreach}
                          onChange={(e) => setSearchOutreach(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-slate-400 text-[10px] uppercase mr-1 flex items-center space-x-1">
                        <Filter className="w-3 h-3 text-cyan-400" />
                        <span>Filter:</span>
                      </span>

                      {[
                        { id: 'all', label: `All Outreach (${emailRecords.length})` },
                        { id: 'received_today', label: `Received Today (${emailsReceivedTodayCount})`, highlight: 'text-cyan-300' },
                        { id: 'responded', label: `Responded (${totalRespondedCount})`, highlight: 'text-emerald-300' },
                        { id: 'pending', label: `Not Yet Responded (${totalNotRespondedCount})`, highlight: 'text-amber-300' },
                        { id: 'read', label: `Read (${totalReadCount})` },
                        { id: 'unread', label: `Unread (${totalUnreadCount})` }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setOutreachFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-xl font-bold transition-all text-[11px] ${
                            outreachFilter === tab.id
                              ? 'bg-cyan-500 text-navy-950 shadow-md'
                              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Executive Email Records Grid */}
                    <div className="space-y-3">
                      {filteredEmailRecords.length === 0 ? (
                        <div className="p-8 rounded-xl bg-navy-950/80 border border-white/5 text-center text-slate-400 text-xs font-mono">
                          No email records found matching the selected filter or search query.
                        </div>
                      ) : (
                        filteredEmailRecords.map((rec) => {
                          const execObj = executives.find(e => e.id === rec.execId);

                          return (
                            <div
                              key={rec.execId}
                              className="p-4 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/30 transition-all space-y-3 shadow-md"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h5 className="font-display font-bold text-sm text-white">{rec.execName}</h5>
                                    <span className="text-xs font-mono text-cyan-300">• {rec.execPosition}</span>
                                  </div>
                                  <p className="text-xs text-slate-400 font-mono">
                                    {rec.execCompany} • <span className="text-emerald-400">{rec.email}</span>
                                  </p>
                                </div>

                                <div className="flex items-center space-x-2 shrink-0">
                                  {/* Read Status Badge */}
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 ${
                                    rec.isRead
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                  }`}>
                                    {rec.isRead ? (
                                      <>
                                        <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                        <span>Read ({rec.readAt})</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                                        <span>Unread (Delivered)</span>
                                      </>
                                    )}
                                  </span>

                                  {/* Responded Status Badge */}
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center space-x-1 ${
                                    rec.hasResponded
                                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                                      : 'bg-slate-800 text-slate-400 border border-white/10'
                                  }`}>
                                    {rec.hasResponded ? (
                                      <>
                                        <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                                        <span>Responded ({rec.responseAt})</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Not Yet Responded</span>
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Sent Email Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="p-3 bg-navy-950/80 rounded-lg border border-white/5 space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                                    <span className="uppercase font-bold text-cyan-400">Outgoing Email Sent:</span>
                                    <span>{rec.sentAt}</span>
                                  </div>
                                  <p className="text-slate-200 font-medium">{rec.lastSentSubject}</p>
                                </div>

                                {/* Response Details or Pending Alert */}
                                <div className="p-3 bg-navy-950/80 rounded-lg border border-white/5 space-y-1">
                                  {rec.hasResponded ? (
                                    <>
                                      <div className="flex justify-between items-center text-[10px] font-mono">
                                        <span className="uppercase font-bold text-emerald-400 flex items-center space-x-1">
                                          <Inbox className="w-3 h-3" />
                                          <span>Received Today ({rec.receivedAt}):</span>
                                        </span>
                                        <span className="text-purple-300 font-bold">{rec.intent}</span>
                                      </div>
                                      <p className="text-slate-300 text-[11px] italic line-clamp-2">"{rec.responseSnippet}"</p>
                                    </>
                                  ) : (
                                    <div className="flex flex-col justify-between h-full py-0.5">
                                      <div className="flex items-center space-x-1.5 text-amber-300 text-[11px] font-mono">
                                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                        <span>Recipient has not yet responded to this outreach.</span>
                                      </div>
                                      <p className="text-[10px] text-slate-400">Smart Matcher suggests sending a follow-up briefing note.</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action Bar */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                                <div className="flex items-center space-x-2">
                                  {!rec.hasResponded && (
                                    <button
                                      onClick={() => handleSimulateReadAndReply(rec.execId)}
                                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold rounded-lg transition-all flex items-center space-x-1"
                                    >
                                      <Zap className="w-3 h-3 text-emerald-400" />
                                      <span>Simulate Live Read & Reply</span>
                                    </button>
                                  )}
                                </div>

                                <div className="flex items-center space-x-2">
                                  {execObj && onScheduleMeeting && rec.hasResponded && (
                                    <button
                                      onClick={() => onScheduleMeeting(execObj)}
                                      className="px-3.5 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5"
                                    >
                                      <Calendar className="w-3.5 h-3.5" />
                                      <span>Schedule Meeting</span>
                                    </button>
                                  )}

                                  {execObj && onComposeEmail && (
                                    <button
                                      onClick={() => {
                                        if (!rec.hasResponded) {
                                          onComposeEmail(
                                            execObj,
                                            `Follow-Up: ${rec.lastSentSubject}`,
                                            `Dear ${execObj.fullName},\n\nI am following up regarding our recent briefing proposal for ${execObj.company}. We would love to share a brief 10-minute executive overview on how DELCA solution suites streamline SEC & BSP compliance.\n\nPlease let us know if you have availability this week.\n\nBest regards,\nDELCA Executive Relations`
                                          );
                                        } else {
                                          onComposeEmail(execObj);
                                        }
                                      }}
                                      className="px-3.5 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                      <span>{rec.hasResponded ? 'Compose Follow-Up' : 'Send AI Follow-Up Email'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="glass-panel p-12 rounded-2xl border-white/10 text-center text-slate-400 text-xs font-mono">
              Select an executive contact from the directory sidebar on the left.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

