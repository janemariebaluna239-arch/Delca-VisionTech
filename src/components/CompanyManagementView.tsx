import React, { useState } from 'react';
import { exportToExcel, exportToCSV, ExportColumn } from '../lib/exportUtils';
import { 
  Building2, 
  Search, 
  Globe, 
  Users, 
  Plus, 
  ShieldCheck, 
  ExternalLink, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Send, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Filter,
  DollarSign,
  Award,
  FileText,
  Calendar,
  Sparkles,
  Zap,
  UserCheck,
  LayoutDashboard
} from 'lucide-react';
import { Executive, Company, DELCAEvent } from '../types';
import CompanyWorkspaceModal from './CompanyWorkspaceModal';
import IndustryIntelligenceReportModal from './IndustryIntelligenceReportModal';

interface CompanyManagementViewProps {
  executives: Executive[];
  companies?: Company[];
  events?: DELCAEvent[];
  onSelectExecutive: (exec: Executive) => void;
  onOpenAddExecForCompany: (companyName: string, industry: string) => void;
  onComposeEmail: (exec: Executive) => void;
  onSendInvitation: (exec: Executive) => void;
  onEditExecutive: (exec: Executive) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  onAddOpportunity?: (execId: string, oppData: any) => void;
  onUpdateOpportunity?: (execId: string, oppId: string, data: any) => void;
  onAddInteractionNote?: (execId: string, noteType: any, content: string) => void;
  onUpdateExecutive?: (execId: string, data: Partial<Executive>) => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenAccountIntelligence?: (exec: Executive) => void;
}

export default function CompanyManagementView({
  executives,
  companies = [],
  events = [],
  onSelectExecutive,
  onOpenAddExecForCompany,
  onComposeEmail,
  onSendInvitation,
  onEditExecutive,
  onScheduleMeeting,
  onAddOpportunity,
  onUpdateOpportunity,
  onAddInteractionNote,
  onUpdateExecutive,
  onNavigateToTab,
  onOpenAccountIntelligence
}: CompanyManagementViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // State for active Company Workspace Modal
  const [activeWorkspaceCompany, setActiveWorkspaceCompany] = useState<string | null>(null);

  // State for Industry Intelligence Report Modal
  const [isIndustryReportOpen, setIsIndustryReportOpen] = useState(false);
  const [selectedReportIndustry, setSelectedReportIndustry] = useState<string>('Banking & Financial Services');

  // Group executives by company and merge with company objects
  const companyMap = new Map<string, {
    name: string;
    industry: string;
    country: string;
    website: string;
    logoUrl?: string;
    info?: Company;
    executives: Executive[];
  }>();

  executives.forEach(exec => {
    const name = exec.company || 'Independent Enterprise';
    if (!companyMap.has(name)) {
      const existingInfo = companies.find(c => c.name.toLowerCase() === name.toLowerCase());
      companyMap.set(name, {
        name,
        industry: exec.industry || existingInfo?.industry || 'Enterprise',
        country: exec.country || existingInfo?.country || 'Philippines',
        website: exec.companyWebsite || existingInfo?.website || '',
        logoUrl: exec.companyLogoUrl || existingInfo?.logoUrl,
        info: existingInfo,
        executives: []
      });
    }
    companyMap.get(name)!.executives.push(exec);
  });

  const companyList = Array.from(companyMap.values());

  // Filter options
  const industries = Array.from(new Set(companyList.map(c => c.industry))).filter(Boolean);
  const countries = Array.from(new Set(companyList.map(c => c.country))).filter(Boolean);

  // Filtered Company List
  const filteredCompanies = companyList.filter(comp => {
    const matchesSearch = 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.executives.some(e => e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || e.position.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIndustry = industryFilter === 'All' || comp.industry === industryFilter;
    const matchesCountry = countryFilter === 'All' || comp.country === countryFilter;

    return matchesSearch && matchesIndustry && matchesCountry;
  });

  // Calculate stats
  const totalCompanies = companyList.length;
  const totalExecs = executives.length;
  const totalPipelineValue = executives.flatMap(e => e.opportunities || []).reduce((acc, o) => acc + (o.value || 0), 0);

  const companyExportCols: ExportColumn<any>[] = [
    { key: 'name', label: 'Company Name' },
    { key: 'industry', label: 'Industry' },
    { key: 'country', label: 'Headquarters' },
    { key: 'website', label: 'Website' },
    { key: 'execCount', label: 'Executive Count', getValue: (c) => c.executives.length },
    { key: 'verifiedCount', label: 'Verified Contacts', getValue: (c) => c.executives.filter((e: any) => e.contactStatus === 'Verified').length },
    { key: 'pipelineVal', label: 'Pipeline Value ($)', getValue: (c) => `$${c.executives.flatMap((e: any) => e.opportunities || []).reduce((s: number, o: any) => s + (o.value || 0), 0).toLocaleString()}` },
  ];

  // Export Companies Excel (.xlsx)
  const handleExportCompaniesExcel = () => {
    exportToExcel(filteredCompanies, companyExportCols, 'DELCA_Company_Directory', 'Company Directory');
  };

  // Export Companies CSV
  const handleExportCompaniesCSV = () => {
    exportToCSV(filteredCompanies, companyExportCols, 'DELCA_Company_Directory');
  };

  // Helper for company workspace lookup
  const activeCompanyData = activeWorkspaceCompany ? companyMap.get(activeWorkspaceCompany) : null;

  return (
    <div className="space-y-8 animate-[fadeIn_0.4s_ease-out_1]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-cyan-400" />
            <h2 className="font-display font-extrabold text-2xl text-white">Company Workspace Hub</h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Access complete enterprise company workspaces, leadership rosters, and intelligence reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsIndustryReportOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Globe className="w-4 h-4 text-navy-950" />
            <span>Industry Intelligence Report</span>
          </button>

          <button
            onClick={handleExportCompaniesExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            title="Export company directory to Excel with auto-widened columns"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCompaniesCSV}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Enterprise Workspaces</div>
            <div className="text-2xl font-display font-black text-white mt-1">{totalCompanies}</div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Across {industries.length} Industries</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Total Linked Roster</div>
            <div className="text-2xl font-display font-black text-white mt-1">{totalExecs} Executives</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">
              {executives.filter(e => e.contactStatus === 'Verified').length} Verified Decision Makers
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase">Active Accounts Health</div>
            <div className="text-2xl font-display font-black text-emerald-400 mt-1">100% Verified</div>
            <div className="text-[10px] text-purple-300 font-mono mt-0.5">Across All Enterprise Workspaces</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, industry, country, executive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-navy-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filters:</span>
          </div>

          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-navy-950/80 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400/50"
          >
            <option value="All">All Industries ({industries.length})</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-navy-950/80 border border-white/10 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400/50"
          >
            <option value="All">All Countries ({countries.length})</option>
            {countries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Company Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCompanies.length === 0 ? (
          <div className="lg:col-span-2 p-12 text-center glass-panel rounded-2xl border-white/10 text-slate-500 font-mono">
            No enterprise companies found matching your search criteria.
          </div>
        ) : (
          filteredCompanies.map(comp => {
            const isExpanded = selectedCompany === comp.name;
            const verifiedCount = comp.executives.filter(e => e.contactStatus === 'Verified').length;
            const companyOpps = comp.executives.flatMap(e => e.opportunities || []);
            const compPipelineVal = companyOpps.reduce((sum, o) => sum + (o.value || 0), 0);

            // Compute Influence score rating
            const cLevelCount = comp.executives.filter(e => {
              const pos = (e.position || e.jobTitle || '').toLowerCase();
              return pos.includes('chief') || pos.includes('ceo') || pos.includes('cfo') || pos.includes('president') || pos.includes('head');
            }).length;

            const calculatedScore = Math.min(100, Math.max(15, 20 + comp.executives.length * 6 + cLevelCount * 12 + (compPipelineVal > 200000 ? 20 : 10)));
            const influenceTag = calculatedScore >= 80 ? 'Industry Titan' : calculatedScore >= 60 ? 'Strategic Leader' : 'Key Account';

            const accountManagerName = comp.info?.accountManager?.name || 
              (comp.industry.includes('Bank') ? 'Sophia Reyes' : comp.industry.includes('Tech') ? 'David Tan' : 'Johnathan Vance');

            return (
              <div 
                key={comp.name} 
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5 bg-gradient-to-b from-navy-900/90 to-navy-950/90 shadow-xl"
              >
                {/* Header Section */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="relative group shrink-0">
                        <img 
                          src={comp.info?.buildingImageUrl || comp.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=400'} 
                          alt={`${comp.name} Building`} 
                          className="w-14 h-14 rounded-2xl object-cover border border-cyan-500/40 shrink-0 bg-navy-950 shadow-md ring-2 ring-cyan-500/30" 
                          referrerPolicy="no-referrer"
                        />
                        {comp.logoUrl && (
                          <div className="absolute -bottom-1 -right-1 bg-slate-900/90 p-0.5 rounded-md border border-cyan-500/40">
                            <img src={comp.logoUrl} alt="Logo" className="w-4 h-4 rounded object-cover" referrerPolicy="no-referrer" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-display font-black text-lg text-white leading-snug truncate">{comp.name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold shrink-0">
                            Score: {calculatedScore}/100
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-semibold">
                            {comp.industry}
                          </span>
                          <div className="flex items-center space-x-1 text-slate-400 text-[11px] font-mono">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            <span>{comp.country}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* OPEN WORKSPACE PRIMARY BUTTON */}
                    <button
                      onClick={() => setActiveWorkspaceCompany(comp.name)}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all shrink-0"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Company Specs & Pipeline Bar */}
                  <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase block">Roster</span>
                      <span className="font-bold text-white">{comp.executives.length} Execs</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase block">Pipeline</span>
                      <span className="font-bold text-emerald-400">${compPipelineVal.toLocaleString()}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase block">Influence</span>
                      <span className="font-bold text-purple-300">{influenceTag}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white/5 space-y-0.5">
                      <span className="text-[9px] text-slate-400 uppercase block">Account Lead</span>
                      <span className="font-bold text-cyan-300 truncate block">{accountManagerName}</span>
                    </div>
                  </div>

                  {/* Executive Roster Preview */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                        Leadership Contacts ({comp.executives.length})
                      </span>
                      <button
                        onClick={() => setSelectedCompany(isExpanded ? null : comp.name)}
                        className="text-[11px] text-cyan-400 hover:underline font-mono"
                      >
                        {isExpanded ? 'Show Fewer' : 'View Roster List'}
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {(isExpanded ? comp.executives : comp.executives.slice(0, 2)).map(exec => {
                        return (
                          <div 
                            key={exec.id} 
                            className="p-2.5 rounded-xl bg-navy-950/80 border border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center space-x-2.5 min-w-0">
                              <img 
                                src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                                alt={exec.fullName} 
                                className="w-8 h-8 rounded-full object-cover border border-cyan-400/30 shrink-0" 
                              />
                              <div className="min-w-0">
                                <button
                                  onClick={() => onSelectExecutive(exec)}
                                  className="font-bold text-xs text-white hover:text-cyan-300 text-left truncate block"
                                >
                                  {exec.fullName}
                                </button>
                                <div className="text-[10px] text-slate-400 truncate">{exec.position}</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                onClick={() => onComposeEmail(exec)}
                                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300"
                                title="Send Direct Email"
                              >
                                <Mail className="w-3 h-3" />
                              </button>

                              {onScheduleMeeting && (
                                <button
                                  onClick={() => onScheduleMeeting(exec)}
                                  className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
                                  title="Schedule Meeting"
                                >
                                  <Calendar className="w-3 h-3" />
                                </button>
                              )}

                              <button
                                onClick={() => onSelectExecutive(exec)}
                                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-mono font-bold"
                              >
                                View Personal Information
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* QUICK ACTIONS BAR AT BOTTOM OF CARD */}
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => setActiveWorkspaceCompany(comp.name)}
                      className="px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-bold text-[11px] flex items-center space-x-1"
                    >
                      <LayoutDashboard className="w-3 h-3" />
                      <span>Workspace</span>
                    </button>

                    {comp.executives[0] && (
                      <button
                        onClick={() => onComposeEmail(comp.executives[0])}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-[11px] flex items-center space-x-1"
                      >
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>Email Exec</span>
                      </button>
                    )}

                    {comp.executives[0] && onScheduleMeeting && (
                      <button
                        onClick={() => onScheduleMeeting(comp.executives[0])}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-[11px] flex items-center space-x-1"
                      >
                        <Calendar className="w-3 h-3 text-purple-400" />
                        <span>Meeting</span>
                      </button>
                    )}

                    <button
                      onClick={() => onOpenAddExecForCompany(comp.name, comp.industry)}
                      className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-[11px] flex items-center space-x-1"
                    >
                      <Plus className="w-3 h-3 text-amber-400" />
                      <span>Add Exec</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* RENDER COMPANY WORKSPACE MODAL IF ACTIVE */}
      {activeCompanyData && (
        <CompanyWorkspaceModal
          companyName={activeCompanyData.name}
          industry={activeCompanyData.industry}
          companyInfo={activeCompanyData.info}
          executives={activeCompanyData.executives}
          events={events}
          onClose={() => setActiveWorkspaceCompany(null)}
          onSelectExecutive={onSelectExecutive}
          onComposeEmail={onComposeEmail}
          onScheduleMeeting={onScheduleMeeting}
          onAddOpportunity={onAddOpportunity}
          onUpdateOpportunity={onUpdateOpportunity}
          onAddInteractionNote={onAddInteractionNote}
          onOpenAddExecForCompany={onOpenAddExecForCompany}
          onUpdateExecutive={onUpdateExecutive}
          onNavigateToTab={onNavigateToTab}
          onOpenAccountIntelligence={onOpenAccountIntelligence}
        />
      )}

      {/* RENDER INDUSTRY INTELLIGENCE REPORT MODAL */}
      <IndustryIntelligenceReportModal
        isOpen={isIndustryReportOpen}
        onClose={() => setIsIndustryReportOpen(false)}
        defaultIndustry={selectedReportIndustry}
      />

    </div>
  );
}
