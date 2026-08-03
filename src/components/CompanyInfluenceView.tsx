import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  Calendar, 
  HeartPulse, 
  Globe, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  TrendingUp, 
  Award,
  Mail,
  ArrowUpRight
} from 'lucide-react';
import { Company, Executive, DELCAEvent } from '../types';
import { calculateRelationshipHealthScore } from '../lib/contactUtils';

interface CompanyInfluenceViewProps {
  companies: Company[];
  executives: Executive[];
  events: DELCAEvent[];
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail: (exec: Executive) => void;
}

export default function CompanyInfluenceView({
  companies,
  executives,
  events,
  onOpen360Profile,
  onComposeEmail
}: CompanyInfluenceViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCompanyId, setExpandedCompanyId] = useState<string | null>(null);

  // Derive Company Influence Intelligence
  const companyDataList = companies.map(comp => {
    const companyExecs = executives.filter(
      e => e.company?.trim().toLowerCase() === comp.name?.trim().toLowerCase()
    );

    // Active opportunities
    const companyOpps = companyExecs.flatMap(e => e.opportunities || []);
    const activeOpps = companyOpps.filter(o => o.stage !== 'Closed' && o.stage !== 'Won');
    const totalPipelineValue = companyOpps.reduce((sum, o) => sum + (o.value || 0), 0);

    // Event Attendance
    const allAttendedEvents = Array.from(
      new Set(companyExecs.flatMap(e => e.previousEventAttendance || []))
    );

    // Avg Health Score
    const healthScores = companyExecs.map(e => calculateRelationshipHealthScore(e).score);
    const avgHealth = Math.round(
      healthScores.reduce((sum, s) => sum + s, 0) / (healthScores.length || 1)
    );

    // Influence Score Formula (0-100)
    let influenceScore = Math.min(
      100,
      companyExecs.length * 15 + Math.floor(totalPipelineValue / 20000) + allAttendedEvents.length * 10
    );

    return {
      comp,
      companyExecs,
      companyOpps,
      activeOpps,
      totalPipelineValue,
      allAttendedEvents,
      avgHealth,
      influenceScore
    };
  });

  const filteredList = companyDataList.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.comp.name.toLowerCase().includes(term) ||
      item.comp.industry.toLowerCase().includes(term) ||
      item.comp.country.toLowerCase().includes(term)
    );
  }).sort((a, b) => b.influenceScore - a.influenceScore);

  const totalCompaniesCount = companies.length;
  const totalCorporatePipeline = companyDataList.reduce((sum, c) => sum + c.totalPipelineValue, 0);

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-navy-900 to-slate-950 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Corporate Account Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Company Influence Dashboard
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl mt-1 leading-relaxed">
              Consolidated enterprise account mapping summarizing key executive decision makers, combined VIP event attendance, relationship health metrics, and ongoing business deal pipelines.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="text-center">
              <div className="text-3xl font-display font-bold text-cyan-400">${(totalCorporatePipeline / 1000000).toFixed(2)}M</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Enterprise Pipeline</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-white">{totalCompaniesCount}</div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Tracked Accounts</div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="flex items-center justify-between bg-navy-900/80 p-4 rounded-xl border border-white/10">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search corporate accounts..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <strong className="text-white">{filteredList.length}</strong> corporate accounts
        </div>
      </div>

      {/* COMPANY INFLUENCE CARDS LIST */}
      <div className="space-y-4">
        {filteredList.map(({ comp, companyExecs, activeOpps, totalPipelineValue, allAttendedEvents, avgHealth, influenceScore }) => {
          const isExpanded = expandedCompanyId === comp.id;

          return (
            <div
              key={comp.id}
              className="bg-slate-900/90 rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/40 transition-all duration-200"
            >
              {/* Account Summary Row */}
              <div 
                onClick={() => setExpandedCompanyId(isExpanded ? null : comp.id)}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative group shrink-0">
                    <img
                      src={comp.buildingImageUrl || comp.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=300'}
                      alt={comp.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/40 border border-cyan-400/30 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    {comp.logoUrl && (
                      <div className="absolute -bottom-1 -right-1 bg-slate-900/90 p-0.5 rounded-md border border-cyan-500/40">
                        <img src={comp.logoUrl} alt="Logo" className="w-4 h-4 rounded object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                      <span>{comp.name}</span>
                      <a
                        href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="text-slate-500 hover:text-cyan-400"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    </h3>
                    <p className="text-xs text-slate-400">{comp.industry} • {comp.country}</p>
                  </div>
                </div>

                {/* Key Account Indicators */}
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Execs On File</div>
                    <div className="font-bold text-white flex items-center space-x-1 mt-0.5">
                      <Users className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{companyExecs.length} Contacts</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Pipeline Value</div>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      ${totalPipelineValue.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Event History</div>
                    <div className="font-bold text-purple-300 mt-0.5">
                      {allAttendedEvents.length} VIP Events
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Influence Rating</div>
                    <div className="font-bold text-amber-300 mt-0.5 font-mono">
                      {influenceScore} / 100
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-cyan-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* EXPANDED ACCOUNT DETAILS */}
              {isExpanded && (
                <div className="p-5 bg-navy-950/80 border-t border-white/10 space-y-6">
                  {/* EXECUTIVES ROSTER */}
                  <div>
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-semibold mb-3 flex items-center space-x-1.5">
                      <Users className="w-4 h-4" />
                      <span>Key Decision Makers ({companyExecs.length})</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {companyExecs.map(exec => (
                        <div
                          key={exec.id}
                          className="bg-slate-900 p-3.5 rounded-xl border border-white/5 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <img
                              src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                              alt={exec.fullName}
                              className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10"
                            />
                            <div className="min-w-0">
                              <div 
                                onClick={() => onOpen360Profile(exec)}
                                className="text-xs font-bold text-white hover:text-cyan-300 cursor-pointer truncate"
                              >
                                {exec.fullName}
                              </div>
                              <p className="text-[11px] text-slate-400 truncate">{exec.position}</p>
                              <p className="text-[10px] text-cyan-400 font-mono truncate">{exec.email}</p>
                            </div>
                          </div>

                          <button
                            onClick={() => onComposeEmail(exec)}
                            className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all flex-shrink-0"
                            title="Direct Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {companyExecs.length === 0 && (
                        <div className="col-span-full py-4 text-center text-slate-500 text-xs italic">
                          No executives linked to this company record yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE DEALS */}
                  {activeOpps.length > 0 && (
                    <div>
                      <h4 className="text-xs font-mono uppercase text-emerald-400 font-semibold mb-3 flex items-center space-x-1.5">
                        <DollarSign className="w-4 h-4" />
                        <span>Active Deals & Opportunities</span>
                      </h4>

                      <div className="space-y-2">
                        {activeOpps.map(opp => (
                          <div key={opp.id} className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-semibold text-white">{opp.title}</div>
                              <div className="text-[10px] text-slate-400">Type: {opp.opportunityType} • Target Close: {opp.expectedCloseDate}</div>
                            </div>

                            <div className="text-right">
                              <div className="font-bold text-emerald-400 font-mono">${opp.value.toLocaleString()}</div>
                              <div className="text-[10px] text-cyan-300 font-mono">{opp.stage} ({opp.probability}%)</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
