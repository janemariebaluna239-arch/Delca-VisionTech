import React, { useState } from 'react';
import { 
  GitCommit, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  Mail, 
  Calendar, 
  Briefcase, 
  FileText, 
  Handshake, 
  Award,
  ChevronRight,
  Building2,
  PhoneCall,
  Search,
  Filter,
  Sparkles
} from 'lucide-react';
import { Executive, RelationshipStage, EXECUTIVE_JOURNEY_STAGES } from '../types';

interface ExecutiveJourneyViewProps {
  executives: Executive[];
  onUpdateStage: (execId: string, newStage: RelationshipStage) => void;
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail: (exec: Executive) => void;
}

export default function ExecutiveJourneyView({
  executives,
  onUpdateStage,
  onOpen360Profile,
  onComposeEmail
}: ExecutiveJourneyViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  // Extract Industries
  const industries = ['All', ...Array.from(new Set(executives.map(e => e.industry).filter(Boolean)))];

  // Map Stage Icons
  const getStageIcon = (stage: RelationshipStage) => {
    switch (stage) {
      case 'New Contact': return <UserPlus className="w-4 h-4 text-slate-400" />;
      case 'Qualified Lead': return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'Invited': return <Mail className="w-4 h-4 text-purple-400" />;
      case 'Event Attendee': return <Calendar className="w-4 h-4 text-indigo-400" />;
      case 'Meeting Held': return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'Proposal Sent': return <FileText className="w-4 h-4 text-cyan-400" />;
      case 'Partnership': return <Handshake className="w-4 h-4 text-emerald-400" />;
      case 'Active Client': return <Award className="w-4 h-4 text-emerald-300" />;
      default: return <GitCommit className="w-4 h-4 text-cyan-400" />;
    }
  };

  // Filter Executives
  const filteredExecutives = executives.filter(exec => {
    const matchesSearch = 
      exec.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exec.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exec.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'All' || exec.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  // Calculate Funnel Stats
  const totalExecs = filteredExecutives.length || 1;
  const stageCounts: Record<string, number> = {};
  EXECUTIVE_JOURNEY_STAGES.forEach(s => {
    stageCounts[s] = filteredExecutives.filter(e => e.relationshipStage === s).length;
  });

  return (
    <div className="space-y-6">
      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase tracking-wider mb-2">
              <GitCommit className="w-4 h-4 text-purple-400" />
              <span>Relationship Lifecycle Lifecycle</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Executive Journey Tracker
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Track and advance decision-makers seamlessly from initial contact and event invitations through strategic meetings, proposals, and active client partnerships.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
            <div className="text-center px-3">
              <div className="text-2xl font-bold font-display text-white">{executives.length}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Pipeline</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center px-3">
              <div className="text-2xl font-bold font-display text-emerald-400">
                {stageCounts['Active Client'] + stageCounts['Partnership']}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase">Converted Clients</div>
            </div>
          </div>
        </div>

        {/* FUNNEL STAGE STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-6 pt-6 border-t border-white/10">
          {EXECUTIVE_JOURNEY_STAGES.map((stage, idx) => {
            const count = stageCounts[stage] || 0;
            const percentage = Math.round((count / totalExecs) * 100);

            return (
              <div 
                key={stage}
                className="bg-white/5 rounded-xl p-2.5 border border-white/5 text-center flex flex-col justify-between"
              >
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {getStageIcon(stage)}
                  <span className="text-[10px] font-mono text-slate-300 font-semibold truncate">{stage}</span>
                </div>
                <div>
                  <div className="text-lg font-bold font-display text-white">{count}</div>
                  <div className="text-[9px] text-cyan-400 font-mono">{percentage}% of total</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-navy-900/80 p-4 rounded-xl border border-white/10">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-slate-400 uppercase">Filter Industry:</span>
          <select
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search executives..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* STAGE KANBAN / PIPELINE BOARD */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1400px]">
          {EXECUTIVE_JOURNEY_STAGES.map(stage => {
            const stageExecs = filteredExecutives.filter(e => e.relationshipStage === stage);

            return (
              <div 
                key={stage}
                className="w-72 bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between"
              >
                {/* Column Header */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                      {getStageIcon(stage)}
                      <span className="text-xs font-bold text-white font-display">{stage}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-white/10 text-cyan-300">
                      {stageExecs.length}
                    </span>
                  </div>

                  {/* Executive Cards */}
                  <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                    {stageExecs.map(exec => (
                      <div
                        key={exec.id}
                        className="bg-slate-950/80 rounded-xl p-3.5 border border-white/5 hover:border-cyan-500/40 transition-all duration-200 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <img
                              src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                              alt={exec.fullName}
                              className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10"
                            />
                            <button
                              onClick={() => onOpen360Profile(exec)}
                              className="text-[10px] font-mono text-cyan-400 hover:underline"
                            >
                              Profile
                            </button>
                          </div>

                          <h4 
                            onClick={() => onOpen360Profile(exec)}
                            className="text-xs font-bold text-white group-hover:text-cyan-300 cursor-pointer truncate"
                          >
                            {exec.fullName}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate">{exec.position}</p>
                          <p className="text-[10px] text-cyan-400/90 truncate font-mono mt-0.5">{exec.company}</p>

                          {exec.opportunities && exec.opportunities.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                              <span>Value:</span>
                              <strong className="text-white">
                                ${exec.opportunities.reduce((s, o) => s + (o.value || 0), 0).toLocaleString()}
                              </strong>
                            </div>
                          )}
                        </div>

                        {/* Stage Changer Select */}
                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-1">
                          <select
                            value={exec.relationshipStage}
                            onChange={e => onUpdateStage(exec.id, e.target.value as RelationshipStage)}
                            className="w-full bg-slate-900 text-[10px] text-slate-300 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-400"
                          >
                            {EXECUTIVE_JOURNEY_STAGES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>

                          <button
                            onClick={() => onComposeEmail(exec)}
                            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all flex-shrink-0"
                            title="Direct Email"
                          >
                            <Mail className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {stageExecs.length === 0 && (
                      <div className="py-8 text-center text-slate-500 text-xs italic">
                        No contacts in {stage}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
