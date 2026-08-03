import React, { useState } from 'react';
import RelationshipIntelligenceGraph from './RelationshipIntelligenceGraph';
import { 
  Share2, 
  Users, 
  Building2, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Mail, 
  UserPlus, 
  Link2,
  ChevronRight,
  ShieldCheck,
  GitFork
} from 'lucide-react';
import { Executive, DELCAEvent } from '../types';
import { getNetworkConnections, getReferralChain } from '../lib/contactUtils';

interface NetworkConnectionsViewProps {
  executives: Executive[];
  events: DELCAEvent[];
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail: (exec: Executive) => void;
}

export default function NetworkConnectionsView({
  executives,
  events,
  onOpen360Profile,
  onComposeEmail
}: NetworkConnectionsViewProps) {
  const [selectedExecId, setSelectedExecId] = useState<string>(executives[0]?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const selectedExec = executives.find(e => e.id === selectedExecId) || executives[0];

  const networkConnections = selectedExec ? getNetworkConnections(selectedExec, executives, events) : [];
  const referralChain = selectedExec ? getReferralChain(selectedExec.id, executives) : [];

  const filteredExecs = executives.filter(e => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.fullName.toLowerCase().includes(term) ||
      e.company.toLowerCase().includes(term) ||
      e.position.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-950 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Relationship Graph Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Executive Network & Referral Chain
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Uncover warm introduction paths, corporate connections, shared VIP event co-attendance, and peer networks across your executive database.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold font-display text-cyan-400">{networkConnections.length}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Direct Network Connections</div>
            </div>
          </div>
        </div>
      </div>

      {/* SELECT EXECUTIVE ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: EXECUTIVE SELECTOR */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search executive focus..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {filteredExecs.map(exec => {
              const isSelected = exec.id === selectedExec.id;

              return (
                <div
                  key={exec.id}
                  onClick={() => setSelectedExecId(exec.id)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-md'
                      : 'bg-slate-950/60 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={exec.fullName}
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{exec.fullName}</div>
                      <p className="text-[10px] text-slate-400 truncate">{exec.company}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: GRAPH & REFERRAL CHAIN */}
        {selectedExec && (
          <div className="lg:col-span-8 space-y-6">
            {/* FOCUS EXECUTIVE CARD */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={selectedExec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                  alt={selectedExec.fullName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/40"
                />
                <div>
                  <h3 className="text-lg font-bold text-white font-display">{selectedExec.fullName}</h3>
                  <p className="text-xs text-slate-400">{selectedExec.position}</p>
                  <div className="flex items-center space-x-2 text-xs text-cyan-300 font-medium mt-0.5">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{selectedExec.company} • {selectedExec.industry}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onOpen360Profile(selectedExec)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
                >
                  360° Profile
                </button>
                <button
                  onClick={() => onComposeEmail(selectedExec)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-500/20"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* INTERACTIVE RELATIONSHIP GRAPH */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-2">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  <span>Interactive Executive Relationship Intelligence Center</span>
                </h4>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30 font-bold">
                  ECOSYSTEM GRAPH
                </span>
              </div>
              <RelationshipIntelligenceGraph
                mode="executive"
                focusExecutiveId={selectedExec.id}
                focusCompanyName={selectedExec.company}
                executives={executives}
                events={events}
                onComposeEmail={onComposeEmail}
                onScheduleMeeting={(exec) => onOpen360Profile(exec)}
                onOpenExecutiveProfile={(execId) => {
                  const target = executives.find(e => e.id === execId);
                  if (target) onOpen360Profile(target);
                }}
                onOpenCompanyProfile={(companyName) => {
                  if (selectedExec) onOpen360Profile(selectedExec);
                }}
              />
            </div>

            {/* REFERRAL CHAIN VISUALIZER */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase text-cyan-400 font-semibold flex items-center space-x-1.5">
                <Link2 className="w-4 h-4 text-cyan-400" />
                <span>Executive Referral & Introduction Chain</span>
              </h4>

              <div className="flex flex-wrap items-center gap-3 bg-navy-950 p-4 rounded-xl border border-white/5">
                {referralChain.map((node, idx) => (
                  <React.Fragment key={node.exec.id}>
                    <div 
                      onClick={() => onOpen360Profile(node.exec)}
                      className={`p-3 rounded-xl border cursor-pointer hover:scale-105 transition-all ${
                        node.relationship === 'Self'
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-cyan-300 uppercase mb-0.5">{node.relationship}</div>
                      <div className="text-xs font-bold text-white">{node.exec.fullName}</div>
                      <div className="text-[10px] text-slate-400">{node.exec.company}</div>
                    </div>

                    {idx < referralChain.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}

                {referralChain.length === 1 && (
                  <span className="text-xs text-slate-500 italic">
                    Direct outreach contact. No introducer or referee records logged yet.
                  </span>
                )}
              </div>
            </div>

            {/* NETWORK CONNECTIONS LIST */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-white/10 space-y-4">
              <h4 className="text-xs font-mono uppercase text-purple-400 font-semibold flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Interconnected Peer Network ({networkConnections.length})</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {networkConnections.map(({ executive: connExec, connectionReasons }) => (
                  <div
                    key={connExec.id}
                    className="p-3.5 bg-slate-950 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all flex items-start justify-between"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={connExec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={connExec.fullName}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10 mt-0.5"
                      />
                      <div>
                        <div 
                          onClick={() => onOpen360Profile(connExec)}
                          className="text-xs font-bold text-white hover:text-cyan-300 cursor-pointer"
                        >
                          {connExec.fullName}
                        </div>
                        <p className="text-[11px] text-slate-400">{connExec.position} • {connExec.company}</p>

                        <div className="mt-2 space-y-1">
                          {connectionReasons.map((reason, rIdx) => (
                            <span 
                              key={rIdx}
                              className="inline-block mr-1 mb-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onComposeEmail(connExec)}
                      className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all flex-shrink-0"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {networkConnections.length === 0 && (
                  <div className="col-span-full py-8 text-center text-slate-500 text-xs italic">
                    No matching network connections found for this contact.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
