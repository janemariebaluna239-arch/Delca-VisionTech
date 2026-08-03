import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Plus, 
  MapPin, 
  Globe, 
  ExternalLink, 
  Briefcase, 
  ShieldCheck, 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Paperclip, 
  UserCheck, 
  Printer, 
  Zap, 
  Activity, 
  Edit3, 
  Save, 
  ArrowUpRight, 
  Send, 
  PhoneCall, 
  CalendarPlus, 
  FolderPlus, 
  Share2, 
  Check,
  Cpu,
  Layers,
  BrainCircuit,
  GitFork,
  Network,
  Target,
  Compass,
  HelpCircle,
  Info,
  ArrowRight,
  Lock,
  Database,
  Server,
  Workflow,
  Building
} from 'lucide-react';
import { Executive, Company, DELCAEvent, BusinessOpportunity, ExecutiveDocument, InteractionNote, BusinessOpportunityStage, OPPORTUNITY_STAGES } from '../types';
import { getUpdatedOpportunityForStage, STAGE_DEFAULTS } from '../lib/opportunityUtils';
import IndustryIntelligenceReportModal from './IndustryIntelligenceReportModal';

interface CompanyWorkspaceModalProps {
  companyName: string;
  industry: string;
  companyInfo?: Company;
  executives: Executive[];
  events?: DELCAEvent[];
  onClose: () => void;
  onSelectExecutive: (exec: Executive) => void;
  onComposeEmail: (exec: Executive) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  onAddOpportunity?: (execId: string, oppData: any) => void;
  onUpdateOpportunity?: (execId: string, oppId: string, data: any) => void;
  onAddInteractionNote?: (execId: string, noteType: any, content: string) => void;
  onOpenAddExecForCompany?: (companyName: string, industry: string) => void;
  onUpdateExecutive?: (execId: string, data: Partial<Executive>) => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenAccountIntelligence?: (exec: Executive) => void;
}

export default function CompanyWorkspaceModal({
  companyName,
  industry,
  companyInfo,
  executives,
  events = [],
  onClose,
  onSelectExecutive,
  onComposeEmail,
  onScheduleMeeting,
  onAddOpportunity,
  onUpdateOpportunity,
  onAddInteractionNote,
  onOpenAddExecForCompany,
  onUpdateExecutive,
  onNavigateToTab,
  onOpenAccountIntelligence
}: CompanyWorkspaceModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'roster' | 'pipeline' | 'communications' | 'timeline' | 'events' | 'documents'>('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);

  // Strategic Account Intelligence Sub-Tab State
  const [intelSubTab, setIntelSubTab] = useState<'all' | 'structure' | 'tech' | 'coverage' | 'ai' | 'timeline'>('all');
  const [expandedNetworkCat, setExpandedNetworkCat] = useState<string | null>('strategic');
  const [expandedAiInsight, setExpandedAiInsight] = useState<string | null>('AI-INS-1');

  // Quick Action Forms
  const [showAddOppForm, setShowAddOppForm] = useState(false);
  const [selectedExecForOpp, setSelectedExecForOpp] = useState<string>(executives[0]?.id || '');
  const [oppTitle, setOppTitle] = useState('');
  const [oppValue, setOppValue] = useState<number>(75000);
  const [oppStage, setOppStage] = useState<any>('New Lead');
  const [oppCloseDate, setOppCloseDate] = useState('2026-12-31');
  const [oppProbability, setOppProbability] = useState<number>(20);

  // Drag and Drop state for Pipeline
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<BusinessOpportunityStage | null>(null);

  // Interaction Note State
  const [selectedExecForNote, setSelectedExecForNote] = useState<string>(executives[0]?.id || '');
  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<'Note' | 'Email' | 'Meeting' | 'Call' | 'Event Attendance'>('Meeting');

  // Account Manager Editing
  const [isEditingAM, setIsEditingAM] = useState(false);
  const [amName, setAmName] = useState(
    companyInfo?.accountManager?.name || 
    (industry.includes('Bank') ? 'Sophia Reyes' : industry.includes('Tech') ? 'David Tan' : 'Johnathan Vance')
  );
  const [amTitle, setAmTitle] = useState(
    companyInfo?.accountManager?.title || 'Senior Enterprise Account Director'
  );
  const [amEmail, setAmEmail] = useState(
    companyInfo?.accountManager?.email || 'accounts@delca.com'
  );

  // Document Upload State
  const [showDocForm, setShowDocForm] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<ExecutiveDocument['category']>('Contract');

  // Local document state
  const [localDocs, setLocalDocs] = useState<ExecutiveDocument[]>(() => {
    // Collect docs across company execs or companyInfo
    const execDocs = executives.flatMap(e => e.documents || []);
    if (companyInfo?.documents) {
      return [...companyInfo.documents, ...execDocs];
    }
    if (execDocs.length > 0) return execDocs;
    return [
      {
        id: 'DOC-C1',
        title: `${companyName} Master Services Agreement (MSA)`,
        category: 'Contract',
        uploadedAt: '2026-02-14',
        size: '2.4 MB'
      },
      {
        id: 'DOC-C2',
        title: `Enterprise Executive Transformation Proposal - ${companyName}`,
        category: 'Proposal',
        uploadedAt: '2026-03-01',
        size: '4.8 MB'
      }
    ];
  });

  // Calculate Aggregated Metrics across all Executives at Company
  const verifiedCount = executives.filter(e => e.contactStatus === 'Verified').length;
  const cLevelCount = executives.filter(e => {
    const pos = (e.position || e.jobTitle || '').toLowerCase();
    return pos.includes('chief') || pos.includes('ceo') || pos.includes('cfo') || pos.includes('cto') || pos.includes('cio') || pos.includes('president') || pos.includes('head');
  }).length;

  const normalizeStage = (st: string): BusinessOpportunityStage => {
    if (st === 'New Opportunity') return 'New Lead';
    if (st === 'In Discussion') return 'Qualified';
    if (OPPORTUNITY_STAGES.includes(st as any)) return st as BusinessOpportunityStage;
    return 'New Lead';
  };

  const handleStageTransition = (opp: BusinessOpportunity & { execName: string }, targetStage: BusinessOpportunityStage) => {
    if (normalizeStage(opp.stage) === targetStage) return;

    const { updatedOpp, logNote } = getUpdatedOpportunityForStage(
      opp,
      targetStage,
      companyInfo?.accountManager?.name
    );

    if (onUpdateOpportunity) {
      onUpdateOpportunity(opp.executiveId, opp.id, { ...updatedOpp, logNote });
    } else if (onAddOpportunity) {
      onAddOpportunity(opp.executiveId, updatedOpp);
    }
  };

  // Aggregate Opportunities
  const allOpportunities: (BusinessOpportunity & { execName: string })[] = executives.flatMap(e => 
    (e.opportunities || []).map(o => ({ ...o, execName: e.fullName }))
  );
  const totalPipelineValue = allOpportunities.reduce((sum, o) => sum + (o.value || 0), 0);
  const weightedPipelineValue = allOpportunities.reduce((sum, o) => sum + ((o.value || 0) * (o.probability || 50) / 100), 0);
  const wonValue = allOpportunities.filter(o => o.stage === 'Won').reduce((sum, o) => sum + (o.value || 0), 0);
  const avgDealSize = allOpportunities.length > 0 ? Math.round(totalPipelineValue / allOpportunities.length) : 0;

  // Aggregate Interactions & Timeline
  const allInteractions = executives.flatMap(e => 
    (e.interactionHistory || []).map(i => ({ ...i, execName: e.fullName, execId: e.id }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalEmailsCount = allInteractions.filter(i => i.type === 'Email').length;
  const totalCallsCount = allInteractions.filter(i => i.type === 'Call').length;
  const totalMeetingsCount = allInteractions.filter(i => i.type === 'Meeting').length;
  const totalNotesCount = allInteractions.filter(i => i.type === 'Note').length;

  // Aggregate Event Attendance
  const allAttendedEvents = Array.from(new Set(
    executives.flatMap(e => e.previousEventAttendance || [])
  ));

  // Compute Company Influence Score (0-100)
  const calculateCompanyInfluenceScore = () => {
    let score = 20; // baseline
    if (executives.length >= 5) score += 20;
    else if (executives.length >= 3) score += 12;
    else score += 5;

    if (cLevelCount >= 2) score += 20;
    else if (cLevelCount >= 1) score += 10;

    if (verifiedCount / (executives.length || 1) >= 0.75) score += 15;
    
    if (totalPipelineValue > 500000) score += 25;
    else if (totalPipelineValue > 200000) score += 18;
    else if (totalPipelineValue > 50000) score += 10;

    if (allAttendedEvents.length >= 3) score += 10;
    else if (allAttendedEvents.length >= 1) score += 5;

    return Math.min(100, Math.max(10, score));
  };

  const influenceScore = calculateCompanyInfluenceScore();
  const influenceTier = influenceScore >= 85 ? 'Industry Titan (Tier 1)' : influenceScore >= 70 ? 'Key Strategic Account (Tier 2)' : influenceScore >= 50 ? 'High Growth Account (Tier 3)' : 'Developing Enterprise';

  // Handlers
  const handleCreateOpportunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim() || !selectedExecForOpp) return;

    const newOpp: BusinessOpportunity = {
      id: `OPP-${Date.now().toString().slice(-4)}`,
      executiveId: selectedExecForOpp,
      title: oppTitle.trim(),
      value: Number(oppValue),
      stage: oppStage,
      opportunityType: 'Consulting',
      expectedCloseDate: oppCloseDate,
      probability: Number(oppProbability),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (onAddOpportunity) {
      onAddOpportunity(selectedExecForOpp, newOpp);
    }
    setOppTitle('');
    setShowAddOppForm(false);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !selectedExecForNote) return;

    if (onAddInteractionNote) {
      onAddInteractionNote(selectedExecForNote, noteType, noteText.trim());
    }
    setNoteText('');
  };

  const handleDocUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: ExecutiveDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      title: docTitle.trim(),
      category: docCategory,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 2 + 1).toFixed(1)} MB`
    };

    setLocalDocs([newDoc, ...localDocs]);
    setDocTitle('');
    setShowDocForm(false);
  };

  const handleDownloadDoc = (title: string, category: string) => {
    const content = `DELCA VisionTech Enterprise Document Repository\nDocument: ${title}\nCategory: ${category}\nCompany: ${companyName}\nGenerated: ${new Date().toLocaleDateString()}\n\nConfidential Enterprise Record - DELCA Agentic AI Customer Intelligence Platform`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy-950/90 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out_1]">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* WORKSPACE BANNER HEADER */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border-b border-white/10 relative shrink-0">
          <div className="flex flex-wrap items-start justify-between gap-4">
            
            {/* Title & Badge */}
            <div className="flex items-center space-x-4 min-w-0">
              <div className="relative group shrink-0">
                <img 
                  src={companyInfo?.buildingImageUrl || companyInfo?.logoUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'} 
                  alt={`${companyName} Building Headquarters`} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-2xl bg-navy-950 border border-cyan-400/30" 
                  referrerPolicy="no-referrer"
                />
                {companyInfo?.logoUrl && (
                  <div className="absolute -bottom-1 -right-1 bg-slate-900/90 p-1 rounded-lg border border-cyan-500/40 shadow-lg">
                    <img src={companyInfo.logoUrl} alt="Company Logo" className="w-5 h-5 sm:w-6 sm:h-6 rounded object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black font-display text-white truncate">{companyName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {industry}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Influence Score: {influenceScore}/100
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center space-x-1 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{companyInfo?.city ? `${companyInfo.city}, ` : ''}{companyInfo?.country || 'Philippines'}</span>
                  </span>
                  {companyInfo?.website && (
                    <>
                      <span>•</span>
                      <a 
                        href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`}
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                  {companyInfo?.employeeCount && (
                    <>
                      <span>•</span>
                      <span>Employees: {companyInfo.employeeCount}</span>
                    </>
                  )}
                  {companyInfo?.annualRevenue && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">Revenue: {companyInfo.annualRevenue}</span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-1 max-w-3xl pt-0.5">
                  {companyInfo?.description || `${companyName} is a leading enterprise organization in the ${industry} sector.`}
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setShowReportModal(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
              >
                <FileText className="w-4 h-4" />
                <span>View Company Report</span>
              </button>

              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all"
                title="Close Company Workspace"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* KPI BAR */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-5 pt-4 border-t border-white/10 text-xs font-mono">
            <div className="bg-navy-950/80 p-3 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Executive Roster</span>
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span>{executives.length} Execs</span>
                <span className="text-[10px] text-emerald-400">{verifiedCount} Verified</span>
              </div>
            </div>

            <div className="bg-navy-950/80 p-3 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Decision Makers</span>
              <div className="text-sm font-bold text-emerald-400">{verifiedCount} Verified Contacts</div>
            </div>

            <div className="bg-navy-950/80 p-3 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Influence Rating</span>
              <div className="text-sm font-bold text-purple-300">{influenceTier.split(' ')[0]} {influenceTier.split(' ')[1]}</div>
            </div>

            <div className="bg-navy-950/80 p-3 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Assigned Account Manager</span>
              <div className="text-sm font-bold text-cyan-300 truncate">{amName}</div>
            </div>

            <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-navy-950/80 p-3 rounded-xl border border-white/5 space-y-0.5">
              <span className="text-[10px] text-slate-400 uppercase">Events Attended</span>
              <div className="text-sm font-bold text-amber-300">{allAttendedEvents.length} VIP Summits</div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS ACTION BAR */}
        <div className="bg-navy-950 px-5 sm:px-6 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 z-10">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Company Quick Actions:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Contact Executive */}
            {executives.length > 0 && (
              <button
                onClick={() => onComposeEmail(executives[0])}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center space-x-1.5 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Contact Executive ({executives[0].fullName.split(' ')[0]})</span>
              </button>
            )}

            {/* 2. Schedule Meeting */}
            {executives.length > 0 && onScheduleMeeting && (
              <button
                onClick={() => onScheduleMeeting(executives[0])}
                className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold flex items-center space-x-1.5 transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>Schedule Meeting</span>
              </button>
            )}

            {/* 3. Create Opportunity */}
            <button
              onClick={() => {
                setActiveTab('pipeline');
                setShowAddOppForm(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Create Opportunity</span>
            </button>

            {/* 4. Add Executive */}
            {onOpenAddExecForCompany && (
              <button
                onClick={() => onOpenAddExecForCompany(companyName, industry)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center space-x-1.5 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Executive</span>
              </button>
            )}

            {/* 5. View Company Report */}
            <button
              onClick={() => setShowReportModal(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold flex items-center space-x-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Company Report</span>
            </button>
          </div>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div className="flex items-center space-x-1.5 bg-navy-950/95 px-5 sm:px-6 py-2.5 border-b border-white/10 overflow-x-auto text-xs font-mono shrink-0 z-10 custom-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'overview' ? 'bg-cyan-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Workspace Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'intelligence' ? 'bg-cyan-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-300" />
            <span>Intelligence Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'roster' ? 'bg-cyan-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Executive Roster ({executives.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('communications')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'communications' ? 'bg-cyan-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Communication Summary</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'timeline' ? 'bg-cyan-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline ({allInteractions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'events' ? 'bg-cyan-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>VIP Events ({allAttendedEvents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 shrink-0 ${
              activeTab === 'documents' ? 'bg-cyan-500 text-navy-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Documents ({localDocs.length})</span>
          </button>
        </div>

        {/* WORKSPACE CONTENT BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300 custom-scrollbar bg-slate-900/60">
          
          {/* TAB 1: WORKSPACE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 1. AI COMPANY SUMMARY & DELCA SERVICE ALIGNMENT BANNER */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-cyan-500/40 shadow-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-base text-white flex items-center space-x-2">
                        <span>AI Company Summary & Strategic Alignment</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          REAL-TIME INTELLIGENCE
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">Consolidated Executive Analysis & DELCA Solution Alignment</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] font-mono">
                    <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                      AI Maturity: 88/100 (Advanced)
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                      ERP: {companyInfo?.techStack?.[0] || 'SAP S/4HANA Cloud'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  {/* Who the Company Is */}
                  <div className="p-3.5 rounded-xl bg-navy-900/90 border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Who The Company Is</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      <strong className="text-white">{companyName}</strong> is a market-leading enterprise operating in the <strong className="text-cyan-300">{industry}</strong> sector, driving aggressive C-Suite digital transformation, multi-cloud modernization, and customer experience innovation across the Philippines & ASEAN region.
                    </p>
                  </div>

                  {/* Strategic Priorities & AI Maturity */}
                  <div className="p-3.5 rounded-xl bg-navy-900/90 border border-white/5 space-y-1.5">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Strategic Priorities & Digital Roadmap</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      Prioritizing core ERP cloud migration, real-time ledger automation, BSP regulatory compliance, zero-trust cybersecurity, and GenAI customer care assistants.
                    </p>
                  </div>

                  {/* How DELCA Services Align */}
                  <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/60 to-emerald-950/60 border border-cyan-500/30 space-y-1.5 md:col-span-2 lg:col-span-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>How DELCA Services Align</span>
                    </span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      <strong className="text-emerald-300">DELCA EIRMS & Executive 360</strong> directly resolve {companyName}'s ERP migration risks, provide pre-certified BSP & SEC compliance modules, and automate C-Suite relationship management with zero operational downtime.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. AI RECOMMENDED NEXT ACTIONS (EXPLAINABLE RECOMMENDATIONS) */}
              <div className="p-5 rounded-2xl bg-navy-950 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider">
                      AI Recommended Next Actions (Explainable Intelligence)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    5 Strategic Recommendations
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                  {/* Action 1 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/20 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          PRIORITY 1 • SALES
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Target: 3 Days</span>
                      </div>
                      <h5 className="font-bold text-white text-xs">Schedule Executive ERP Briefing</h5>
                      <div className="p-2 rounded-lg bg-navy-950 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-amber-400 font-bold uppercase block">Reason:</span>
                        <p className="text-[10.5px] text-slate-300 leading-tight">
                          Executive team is actively accelerating SAP S/4HANA cloud migration; offering a zero-downtime ERP assessment directly addresses their #1 technical bottleneck.
                        </p>
                      </div>
                    </div>
                    {executives.length > 0 && onScheduleMeeting && (
                      <button
                        onClick={() => onScheduleMeeting(executives[0])}
                        className="w-full mt-2 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] font-mono border border-amber-500/30 transition-all flex items-center justify-center space-x-1"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Schedule Briefing Now</span>
                      </button>
                    )}
                  </div>

                  {/* Action 2 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/20 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          PRIORITY 2 • EVENTS
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Target: 5 Days</span>
                      </div>
                      <h5 className="font-bold text-white text-xs">Invite CEO & CTO to Enterprise AI Summit</h5>
                      <div className="p-2 rounded-lg bg-navy-950 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-purple-400 font-bold uppercase block">Reason:</span>
                        <p className="text-[10.5px] text-slate-300 leading-tight">
                          Company leadership regularly participates in C-Suite forums; inviting them to the upcoming VIP AI Summit solidifies C-Level executive sponsorship.
                        </p>
                      </div>
                    </div>
                    {executives.length > 0 && (
                      <button
                        onClick={() => onComposeEmail(executives[0])}
                        className="w-full mt-2 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-[11px] font-mono border border-purple-500/30 transition-all flex items-center justify-center space-x-1"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Send Summit Invitation</span>
                      </button>
                    )}
                  </div>

                  {/* Action 3 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/20 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          PRIORITY 3 • COMPLIANCE
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Target: 7 Days</span>
                      </div>
                      <h5 className="font-bold text-white text-xs">Deliver BSP Regulatory Compliance Briefing</h5>
                      <div className="p-2 rounded-lg bg-navy-950 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase block">Reason:</span>
                        <p className="text-[10.5px] text-slate-300 leading-tight">
                          Recent BSP & SEC audit mandates require updated cloud data governance; DELCA EIRMS features pre-built compliance modules for instant deployment.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] font-mono border border-cyan-500/30 transition-all flex items-center justify-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Transmit Compliance Dossier</span>
                    </button>
                  </div>

                  {/* Action 4 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          PRIORITY 4 • MARKETING
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Target: 10 Days</span>
                      </div>
                      <h5 className="font-bold text-white text-xs">Share Industry Intelligence Benchmark</h5>
                      <div className="p-2 rounded-lg bg-navy-950 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block">Reason:</span>
                        <p className="text-[10.5px] text-slate-300 leading-tight">
                          Industry analysis shows 40% peer growth in AI underwriting; providing our sector report positions DELCA as a strategic, trusted advisor.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowIndustryModal(true)}
                      className="w-full mt-2 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-[11px] font-mono border border-emerald-500/30 transition-all flex items-center justify-center space-x-1"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Open Industry Report</span>
                    </button>
                  </div>

                  {/* Action 5 */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/20 space-y-2 flex flex-col justify-between lg:col-span-2">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          PRIORITY 5 • AFTER-SALES & TECH ARCHITECTURE
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">Target: Immediate</span>
                      </div>
                      <h5 className="font-bold text-white text-xs">Assign Enterprise Solutions Lead & Solution Validation</h5>
                      <div className="p-2 rounded-lg bg-navy-950 border border-white/5 space-y-0.5">
                        <span className="text-[9px] font-mono text-indigo-400 font-bold uppercase block">Reason:</span>
                        <p className="text-[10.5px] text-slate-300 leading-tight">
                          Account health and decision-maker engagement score meets key threshold; assigning DELCA's Solutions Architecture lead ensures dedicated C-Suite relationship management.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono pt-1">
                      <span className="text-slate-400">Assigned Solutions Director: <strong className="text-white">{amName}</strong></span>
                      <button
                        onClick={() => setActiveTab('roster')}
                        className="px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold border border-indigo-500/30 transition-all"
                      >
                        View Leadership Roster
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. COMPANY OVERVIEW & CORPORATE FUNDAMENTALS */}
              <div className="p-5 rounded-2xl bg-navy-950 border border-cyan-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span>Company Overview & Corporate Fundamentals</span>
                  </h4>

                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
                    Tier 1 Strategic Account
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase block">Headquarters</span>
                    <span className="font-bold text-white text-xs truncate block">
                      {companyInfo?.headquartersAddress || companyInfo?.city || 'Makati'}, {companyInfo?.country || 'PH'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase block">Year Founded</span>
                    <span className="font-bold text-slate-200 text-xs block">{companyInfo?.yearFounded || 1998}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase block">Company Size</span>
                    <span className="font-bold text-white text-xs block">{companyInfo?.employeeCount || '10,000+ employees'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase block">Annual Revenue</span>
                    <span className="font-bold text-emerald-400 text-xs block">{companyInfo?.annualRevenue || '₱150B+ ($2.5B+ USD)'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase block">Market Cap / Ticker</span>
                    <span className="font-bold text-purple-300 text-xs block truncate">
                      {companyInfo?.stockTicker || 'PUBLIC.PH'} ({companyInfo?.marketCap || '₱250B+'})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 space-y-0.5">
                    <span className="text-[9px] text-slate-400 uppercase block">Website</span>
                    {companyInfo?.website ? (
                      <a
                        href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-cyan-400 hover:underline text-xs truncate block flex items-center space-x-1"
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">Visit Site</span>
                      </a>
                    ) : (
                      <span className="font-bold text-slate-400 text-xs block">https://{companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</span>
                    )}
                  </div>
                </div>

                {/* Primary Business Activities */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Primary Business Activities & Revenue Divisions</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(companyInfo?.productsAndServices || [
                      'Institutional & Commercial Banking Solutions',
                      'Retail Consumer Services & Omni-Channel Digital Portals',
                      'Treasury, Capital Markets & Asset Management',
                      'Enterprise Logistics & Supply Chain Infrastructure'
                    ]).map((act, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs font-mono font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                        <span>{act}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* TOP METRICS & ACCOUNT MANAGER PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Account Manager Card */}
                <div className="lg:col-span-1 p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                      <UserCheck className="w-4 h-4" />
                      <span>Assigned Account Lead</span>
                    </h4>

                    <button 
                      onClick={() => setIsEditingAM(!isEditingAM)}
                      className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingAM ? 'Done' : 'Edit Lead'}</span>
                    </button>
                  </div>

                  {isEditingAM ? (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400">Account Manager Name</label>
                        <input
                          type="text"
                          value={amName}
                          onChange={e => setAmName(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400">Title / Designation</label>
                        <input
                          type="text"
                          value={amTitle}
                          onChange={e => setAmTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400">Email Address</label>
                        <input
                          type="email"
                          value={amEmail}
                          onChange={e => setAmEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                        />
                      </div>
                      <button
                        onClick={() => setIsEditingAM(false)}
                        className="w-full py-1.5 bg-cyan-500 text-navy-950 font-bold rounded-lg text-xs"
                      >
                        Save Assigned Account Lead
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3.5 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0 font-display">
                        {amName.split(' ').map(n => n[0]).join('')}
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-bold text-white text-sm">{amName}</div>
                        <div className="text-[11px] text-slate-400">{amTitle}</div>
                        <a href={`mailto:${amEmail}`} className="text-[10px] font-mono text-cyan-400 hover:underline flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{amEmail}</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-cyan-300 font-mono text-[10px] uppercase block">Relationship Strategy</span>
                    <p className="text-[11px] text-slate-300">
                      Primary focus is cultivating C-Suite sponsorship for upcoming enterprise digital transformation and summit initiatives.
                    </p>
                  </div>
                </div>

                {/* Company Influence Score Breakdown */}
                <div className="lg:col-span-2 p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Company Influence Rating & Score Analytics</span>
                    </h4>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {influenceTier}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">C-Suite Roster Depth</span>
                      <div className="text-lg font-bold text-white">{cLevelCount} Key Decision Makers</div>
                      <p className="text-[10px] text-slate-400">Chiefs, Presidents & VPs</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Verified Contact Ratio</span>
                      <div className="text-lg font-bold text-emerald-400">
                        {Math.round((verifiedCount / (executives.length || 1)) * 100)}% Verified
                      </div>
                      <p className="text-[10px] text-slate-400">{verifiedCount} of {executives.length} contacts</p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">VIP Summit Engagement</span>
                      <div className="text-lg font-bold text-amber-300">{allAttendedEvents.length} Summits</div>
                      <p className="text-[10px] text-slate-400">Corporate participation</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Influence Score Benchmark</span>
                      <span className="text-purple-300 font-bold">{influenceScore} / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${influenceScore}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* EXECUTIVE ROSTER PREVIEW & PIPELINE METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Executive Roster Summary */}
                <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                      <Users className="w-4 h-4" />
                      <span>Executive Leadership Roster</span>
                    </h4>

                    {onOpenAddExecForCompany && (
                      <button
                        onClick={() => onOpenAddExecForCompany(companyName, industry)}
                        className="text-xs text-cyan-300 hover:underline font-mono flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Exec</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {executives.length === 0 ? (
                      <p className="text-slate-500 text-xs italic py-4 text-center font-mono">No executives logged under this company yet.</p>
                    ) : (
                      executives.map(exec => (
                        <div key={exec.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-3 hover:border-cyan-500/30 transition-all">
                          <div className="flex items-center space-x-3 min-w-0">
                            <img
                              src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                              alt={exec.fullName}
                              className="w-9 h-9 rounded-full object-cover border border-cyan-400/30 shrink-0"
                            />
                            <div className="min-w-0">
                              <button
                                onClick={() => onSelectExecutive(exec)}
                                className="font-bold text-white hover:text-cyan-300 text-xs truncate text-left block"
                              >
                                {exec.fullName}
                              </button>
                              <div className="text-[11px] text-slate-400 truncate">{exec.position}</div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => onComposeEmail(exec)}
                              className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                              title="Email Executive"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>

                            {onScheduleMeeting && (
                              <button
                                onClick={() => onScheduleMeeting(exec)}
                                className="p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors"
                                title="Schedule Meeting"
                              >
                                <CalendarPlus className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onOpenAccountIntelligence && (
                              <button
                                onClick={() => onOpenAccountIntelligence(exec)}
                                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors border border-cyan-500/20"
                                title="Account Intelligence Profile"
                              >
                                <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
                              </button>
                            )}

                            <button
                              onClick={() => onSelectExecutive(exec)}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-mono font-bold"
                            >
                              Profile
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Account Engagement Overview Panel */}
                <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                      <Building2 className="w-4 h-4" />
                      <span>Account Engagement Overview</span>
                    </h4>

                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      {verifiedCount} / {executives.length} Verified Contacts
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Contacts</span>
                      <span className="text-lg font-bold text-cyan-300 font-display">{executives.length} Executives</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Logged Communications</span>
                      <span className="text-lg font-bold text-purple-300 font-display">{allInteractions.length} Exchanges</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Assigned Account Manager</span>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{amName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">DELCA Enterprise Lead</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono text-[10px]">
                        Active Account
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB: COMPREHENSIVE STRATEGIC ACCOUNT INTELLIGENCE CENTER */}
          {activeTab === 'intelligence' && (() => {
            // Compute dynamic Strategic Account Intelligence Data
            const parentCompany = (companyInfo?.keySubsidiaries?.[0]) ? `${companyName} Parent Holdings` : (industry.includes('Bank') ? 'Bangko Sentral Enterprise Consortium' : `${companyName} Global Holdings`);
            const subsidiariesList = (companyInfo?.keySubsidiaries?.length ? companyInfo.keySubsidiaries : [
              `${companyName} Digital Solutions & Fintech Inc.`,
              `${companyName} Logistics & Supply Chain Corp.`,
              `${companyName} International Advisory Pte Ltd`,
              `${companyName} Capital & Wealth Management`
            ]);
            const sisterCompanies = [
              `${companyName} Real Estate & Infrastructure`,
              `${companyName} Health & Life Services`,
              `${companyName} Utilities & Energy Corp`
            ];
            const regionalOffices = [
              { location: 'Makati Headquarters', region: 'Metro Manila, PH', type: 'Global HQ / Executive Suite', employees: '4,500+' },
              { location: 'Singapore Regional Hub', region: 'ASEAN Headquarters', type: 'Regional Financial Center', employees: '1,200+' },
              { location: 'Kuala Lumpur Tech Office', region: 'Malaysia', type: 'R&D & Engineering Center', employees: '850+' },
              { location: 'Jakarta Branch', region: 'Indonesia', type: 'Commercial Operations', employees: '600+' }
            ];
            const branchesList = [
              { name: 'BGC Innovation Center', city: 'Taguig', focus: 'GenAI & FinTech Sandbox' },
              { name: 'Cebu Financial Hub', city: 'Cebu City', focus: 'Visayas Operations' },
              { name: 'Davao Tech Center', city: 'Davao City', focus: 'Mindanao Logistics' }
            ];

            const networkCategories = [
              {
                id: 'strategic',
                title: 'Strategic Partners',
                icon: Briefcase,
                color: 'text-cyan-400',
                items: [
                  { name: 'McKinsey & Company', role: 'Lead Digital Strategy Partner', duration: '3 Years', scope: 'Enterprise Operating Model & AI Transformation' },
                  { name: 'Deloitte Southeast Asia', role: 'Audit & Governance Advisor', duration: '5 Years', scope: 'ESG Compliance & Risk Management Framework' }
                ]
              },
              {
                id: 'tech',
                title: 'Technology & Cloud Alliances',
                icon: Cpu,
                color: 'text-purple-400',
                items: [
                  { name: 'Microsoft Azure', role: 'Primary Cloud Infrastructure', duration: '4 Years', scope: 'Enterprise Cloud Landing Zones & OpenAI Services' },
                  { name: 'Amazon Web Services (AWS)', role: 'Multi-Region High Availability', duration: '5 Years', scope: 'Core Transactional Cluster & Disaster Recovery' },
                  { name: 'Palo Alto Networks', role: 'Zero-Trust Cybersecurity', duration: '2 Years', scope: 'Automated SOC & Threat Prevention Suite' }
                ]
              },
              {
                id: 'erp_crm',
                title: 'ERP & CRM Vendors',
                icon: Database,
                color: 'text-emerald-400',
                items: [
                  { name: 'SAP S/4HANA Cloud', role: 'Core Ledger & ERP System', duration: 'Active Migration', scope: 'General Ledger, Treasury & Supply Chain Automation' },
                  { name: 'Salesforce Financial Services Cloud', role: 'Customer Engagement CRM', duration: 'Operational', scope: 'Retail & Commercial Client Care' },
                  { name: 'DELCA EIRMS Platform', role: 'C-Suite Executive Relationship System', duration: 'Strategic Core', scope: 'Real-Time C-Level Intelligence & VIP Event Management' }
                ]
              },
              {
                id: 'consulting_associations',
                title: 'Consulting Advisors & Industry Associations',
                icon: Globe,
                color: 'text-amber-400',
                items: [
                  { name: 'Bankers Association of the Philippines (BAP)', role: 'Executive Steering Member', duration: 'Founding Member', scope: 'Interbank Settlement & Policy Standards' },
                  { name: 'Fintech Alliance PH', role: 'Regulatory Advisory Member', duration: '3 Years', scope: 'Open Banking & Regulatory Sandbox Framework' },
                  { name: 'PwC Philippines', role: 'Tax & Compliance Advisor', duration: 'Retained', scope: 'BSP Security & Audit Standard Advisory' }
                ]
              }
            ];

            const cSuiteMapping = [
              { title: 'Chief Executive Officer (CEO)', roleKey: 'CEO', defaultName: 'Nestor Tan' },
              { title: 'Chief Operating Officer (COO)', roleKey: 'COO', defaultName: 'Maria Santos' },
              { title: 'Chief Information Officer (CIO)', roleKey: 'CIO', defaultName: 'David Lee' },
              { title: 'Chief Technology Officer (CTO)', roleKey: 'CTO', defaultName: 'Alexander Wright' },
              { title: 'Chief Financial Officer (CFO)', roleKey: 'CFO', defaultName: 'Elena Rostova' },
              { title: 'Chief Digital Officer (CDO)', roleKey: 'CDO', defaultName: 'Roberto Garcia' },
              { title: 'IT Infrastructure Director', roleKey: 'IT Dir', defaultName: 'Michael Chen' },
              { title: 'Head of Enterprise Procurement', roleKey: 'Procurement', defaultName: 'Patricia Morales' }
            ];

            const relCoverage = [
              { dept: 'Marketing', status: 'Campaign Member', score: 88, details: 'Enrolled in Tier-1 C-Suite Thought Leadership & VIP Industry Briefings', color: 'border-purple-500/40 text-purple-300' },
              { dept: 'Sales', status: 'Active Opportunity', score: 94, details: 'Active $450,000 ERP Cloud Modernization Deal in Final Contract Review', color: 'border-emerald-500/40 text-emerald-300' },
              { dept: 'Event Management', status: 'Invited to VIP Summit', score: 82, details: 'CEO, CTO, and CDO Confirmed for Upcoming ASEAN C-Suite Leadership Summit', color: 'border-amber-500/40 text-amber-300' },
              { dept: 'Customer Success', status: 'Existing Client', score: 90, details: 'DELCA EIRMS Platform Operational across 4 Core Business Units with 99.9% Uptime', color: 'border-cyan-500/40 text-cyan-300' },
              { dept: 'Leadership Alignment', status: 'Strategic Account', score: 96, details: 'Quarterly Executive Steering Board Established with DELCA Account Leadership', color: 'border-blue-500/40 text-blue-300' }
            ];

            const oppMap = [
              { area: 'ERP Modernization', priority: 'Critical', val: '$450,000', read: 92, action: 'Deliver SAP S/4HANA Zero-Downtime Migration Architecture', color: 'border-red-500/30 bg-red-500/10 text-red-300' },
              { area: 'CRM Optimization', priority: 'High', val: '$220,000', read: 85, action: 'Integrate DELCA Real-Time Executive Feeds into Salesforce FSC', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
              { area: 'Cloud Migration', priority: 'High', val: '$380,000', read: 78, action: 'Schedule AWS Multi-Region Failover Architecture Workshop with CTO', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' },
              { area: 'Artificial Intelligence', priority: 'Critical', val: '$310,000', read: 90, action: 'Deploy GenAI C-Suite Executive Assistant & Automated Sentiment Engine', color: 'border-red-500/30 bg-red-500/10 text-red-300' },
              { area: 'Business Automation', priority: 'High', val: '$190,000', read: 84, action: 'Implement Automated C-Suite Workflow Orchestration & Digital Contracts', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' },
              { area: 'Cybersecurity Audit', priority: 'Medium', val: '$180,000', read: 82, action: 'Perform Zero-Trust Governance & BSP Compliance Security Audit', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' },
              { area: 'Data Analytics', priority: 'High', val: '$250,000', read: 88, action: 'Connect Snowflake Data Warehouse to DELCA Real-Time Activity Streams', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' },
              { area: 'System Integration', priority: 'Medium', val: '$195,000', read: 75, action: 'Provision OpenAPI Gateway for Regional Subsidiary Data Exchange', color: 'border-blue-500/30 bg-blue-500/10 text-blue-300' }
            ];

            const accountExpansions = [
              { category: 'Unengaged Subsidiaries', title: `${companyName} Logistics & Health Division`, desc: 'Operating on legacy platforms without active DELCA license.', action: 'Request introduction via Group CTO.', value: '$180,000 ARR' },
              { category: 'Uncontacted Executives', title: 'Chief Digital Officer & Procurement Head', desc: 'Key budget stakeholders not yet enroled in briefing cadence.', action: 'Issue VIP invitation to ASEAN Summit.', value: 'High Strategic' },
              { category: 'Cross-Selling Target', title: 'DELCA AI Sentiment & Speech Intelligence', desc: 'Extend existing EIRMS core deployment with real-time speech transcription.', action: 'Arrange live demo with CIO.', value: '+$120,000 ARR' },
              { category: 'Upselling Opportunity', title: 'Unlimited VIP Seats & Dedicated Engineer', desc: 'Upgrade tier to include unlimited C-Suite seats for regional summits.', action: 'Include in annual account review.', value: '+$95,000 ARR' }
            ];

            const aiInsights = [
              {
                id: 'AI-INS-1',
                title: 'Accelerate SAP S/4HANA Cloud Migration Alignment',
                confidence: 95,
                impact: '+$450,000 Deal Value / 40% Faster Cycle',
                why: 'Triggered by real-time detection of $100M+ cloud migration RFP signals and recent C-Suite hiring of Cloud Migration Directors.',
                evidence: 'Annual SEC filings highlight ₱3.5B R&D budget allocated to core cloud modernization; CTO explicitly stated cloud-first priority.',
                recommendation: 'Schedule a specialized technical briefing showcasing DELCA EIRMS zero-downtime ledger migration capabilities with CTO Alexander Wright.',
                nextStep: 'Schedule Executive Briefing'
              },
              {
                id: 'AI-INS-2',
                title: 'Proactively Transmit BSP & SEC Regulatory Compliance Dossier',
                confidence: 92,
                impact: 'High Executive Trust / Instant Validation',
                why: 'BSP issued new circular mandates requiring financial institutions to complete cloud data sovereignty audits by Q4 2026.',
                evidence: 'Legal department recently published regulatory compliance guidelines; DELCA EIRMS features pre-built automated BSP compliance reporting.',
                recommendation: 'Deliver the pre-certified DELCA BSP Data Privacy & Open Banking Compliance Dossier directly to Chief Legal Officer and CIO.',
                nextStep: 'Transmit Compliance Dossier'
              },
              {
                id: 'AI-INS-3',
                title: 'Invite CEO & CDO to VIP ASEAN Leadership Summit',
                confidence: 89,
                impact: 'Secures C-Suite Sponsorship',
                why: 'Executive interaction logs indicate high engagement with event invites and preference for face-to-face peer discussions.',
                evidence: 'CEO attended 2 previous DELCA VIP events in 2025 and provided positive feedback on peer networking opportunities.',
                recommendation: 'Issue personalized VIP invitation cards to CEO Nestor Tan and CDO Roberto Garcia for the upcoming Manila C-Suite Summit.',
                nextStep: 'Send VIP Summit Invitation'
              }
            ];

            const unifiedTimelineLogs = [
              { date: '2026-03-12', type: 'AI Recommendation', category: 'Strategic Insight', title: 'AI Insight Generated: SAP Migration Alignment', desc: 'System identified $450,000 opportunity for zero-downtime ERP migration.', author: 'DELCA Agentic AI', color: 'border-purple-500/40 text-purple-300 bg-purple-500/10' },
              { date: '2026-03-01', type: 'Sales Activity', category: 'Pipeline Stage Update', title: 'Proposal Transmitted for Contract Review', desc: 'Enterprise EIRMS & Cloud Integration proposal ($450K) submitted to Legal.', author: amName, color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' },
              { date: '2026-02-18', type: 'Meeting', category: 'Executive Briefing', title: 'C-Suite Steering Committee Quarterly Alignment', desc: 'Met with CEO and CTO to review 2026 digital roadmap and regional expansion.', author: amName, color: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' },
              { date: '2026-02-10', type: 'Event', category: 'VIP Summit', title: 'Attended ASEAN Digital Leadership Summit', desc: 'CEO and CTO attended keynote session and VIP roundtable discussion.', author: 'Event Intelligence', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10' },
              { date: '2026-01-25', type: 'Knowledge Update', category: 'Knowledge Hub', title: 'Synchronized Annual Report & Tech Architecture Audit', desc: 'Updated company profile with 2025 SEC findings, tech stack badges, and subsidiary breakdown.', author: 'Research Analyst', color: 'border-blue-500/40 text-blue-300 bg-blue-500/10' },
              { date: '2026-01-10', type: 'Implementation', category: 'Customer Success', title: 'EIRMS Core Module v4.2 Deployment Complete', desc: 'Successfully deployed core executive relationship intelligence engine across 250 seats.', author: 'Customer Success', color: 'border-teal-500/40 text-teal-300 bg-teal-500/10' }
            ];

            return (
              <div className="space-y-6">
                {/* 1. PROFILE HEADER BANNER */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-cyan-500/40 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-cyan-400 shrink-0" />
                        <h3 className="font-display font-black text-lg text-white">Strategic Account Intelligence Center</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                          VERIFIED 2026
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Comprehensive 360° corporate view covering structure, network alliances, tech stack, opportunity mapping, DELCA coverage, explainable AI recommendations & unified activity timeline.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
                      <button
                        onClick={() => setShowIndustryModal(true)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                      >
                        <Globe className="w-4 h-4 text-navy-950" />
                        <span>Macro Industry Report</span>
                      </button>

                      <button
                        onClick={() => setShowReportModal(true)}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Export Strategic Dossier</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2 border-t border-white/10 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase block">Annual Revenue</span>
                      <span className="font-bold text-emerald-400 text-sm">{companyInfo?.annualRevenue || '₱150B+'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase block">Total Workforce</span>
                      <span className="font-bold text-white text-sm">{companyInfo?.employeeCount || '10,000+'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase block">Stock Ticker</span>
                      <span className="font-bold text-cyan-300 text-sm">{companyInfo?.stockTicker || 'PUBLIC.PH'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase block">Market Cap</span>
                      <span className="font-bold text-purple-300 text-sm">{companyInfo?.marketCap || '₱250B+'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase block">Headquarters</span>
                      <span className="font-bold text-slate-200 truncate block text-xs">{companyInfo?.city || 'Makati'}, {companyInfo?.country || 'PH'}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                      <span className="text-[9px] text-slate-400 uppercase block">DELCA Status</span>
                      <span className="font-bold text-amber-300 text-xs">{companyInfo?.delcaRelationship?.status || 'Active Client'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. SUB-NAVIGATION PILLS FOR QUICK JUMPING */}
                <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono custom-scrollbar shrink-0">
                  <span className="text-slate-400 text-[10px] uppercase font-bold mr-1 shrink-0">Jump To Section:</span>
                  {[
                    { id: 'all', label: 'All Sections' },
                    { id: 'structure', label: '1. Structure & Network' },
                    { id: 'tech', label: '2. Tech & Opportunities' },
                    { id: 'coverage', label: '3. DELCA Coverage & Expansion' },
                    { id: 'ai', label: '4. Explainable AI Insights' },
                    { id: 'timeline', label: '5. Unified Timeline' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setIntelSubTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                        intelSubTab === tab.id
                          ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md'
                          : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* SECTION 1: CORPORATE STRUCTURE (Parent, Subsidiaries, Sister Companies, Regional Offices, Branches) */}
                {(intelSubTab === 'all' || intelSubTab === 'structure') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-2">
                        <GitFork className="w-4 h-4 text-cyan-400" />
                        <span>1. Corporate Structure & Entity Hierarchy</span>
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
                        Multi-Tier Organizational Architecture
                      </span>
                    </div>

                    {/* Hierarchy Visual Diagram */}
                    <div className="space-y-3 pt-1">
                      {/* Parent Entity */}
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                            <Building className="w-4 h-4 text-cyan-300" />
                          </div>
                          <div>
                            <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold block">Parent Entity</span>
                            <span className="font-bold text-white text-sm">{parentCompany}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px] font-mono">
                          <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">100% Equity Parent</span>
                          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">Corporate Governance</span>
                        </div>
                      </div>

                      {/* Line connector */}
                      <div className="flex justify-center -my-1">
                        <div className="w-0.5 h-4 bg-cyan-500/40"></div>
                      </div>

                      {/* Current Target Entity */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-cyan-950/80 border-2 border-cyan-400 shadow-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Building2 className="w-5 h-5 text-cyan-300 shrink-0" />
                            <div>
                              <span className="text-[9px] font-mono text-cyan-300 uppercase font-bold block">Target Enterprise Account</span>
                              <h4 className="font-display font-black text-base text-white">{companyName}</h4>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                            Active Strategic Account
                          </span>
                        </div>
                      </div>

                      {/* Line connector branch */}
                      <div className="flex justify-center -my-1">
                        <div className="w-0.5 h-4 bg-cyan-500/40"></div>
                      </div>

                      {/* Subsidiaries & Sister Companies Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* Subsidiaries */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                          <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block flex items-center space-x-1.5">
                            <Network className="w-3.5 h-3.5 text-purple-400" />
                            <span>Key Operating Subsidiaries ({subsidiariesList.length})</span>
                          </span>
                          <div className="space-y-1.5">
                            {subsidiariesList.map((sub, idx) => (
                              <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-200">{sub}</span>
                                <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                                  {idx === 0 ? 'DELCA Licensed' : 'Target Unit'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sister Companies */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                          <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block flex items-center space-x-1.5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Affiliated Sister Companies ({sisterCompanies.length})</span>
                          </span>
                          <div className="space-y-1.5">
                            {sisterCompanies.map((sister, idx) => (
                              <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                                <span className="font-bold text-slate-200">{sister}</span>
                                <span className="text-[9px] font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                                  Group Affiliate
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Regional Offices & Key Branches */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        {/* Regional Offices */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block flex items-center space-x-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-400" />
                            <span>Regional Offices & Hubs</span>
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {regionalOffices.map((office, idx) => (
                              <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 space-y-0.5">
                                <div className="font-bold text-white text-xs">{office.location}</div>
                                <div className="text-[10px] text-amber-300 font-mono">{office.region}</div>
                                <div className="text-[9px] text-slate-400">{office.type} ({office.employees})</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Operating Branches */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block flex items-center space-x-1.5">
                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Key Operating Centers & Branches</span>
                          </span>
                          <div className="space-y-1.5">
                            {branchesList.map((branch, idx) => (
                              <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-slate-200 block">{branch.name}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{branch.focus}</span>
                                </div>
                                <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-bold shrink-0 ml-2">
                                  {branch.city}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 2: BUSINESS NETWORK & EXPANDABLE RELATIONSHIP CARDS */}
                {(intelSubTab === 'all' || intelSubTab === 'structure') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center space-x-2">
                        <Network className="w-4 h-4 text-purple-400" />
                        <span>2. Business Network & Strategic Alliances</span>
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">Expandable Ecosystem Cards</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {networkCategories.map(cat => {
                        const isExpanded = expandedNetworkCat === cat.id;
                        const IconComp = cat.icon;
                        return (
                          <div key={cat.id} className="rounded-xl bg-slate-900 border border-white/5 overflow-hidden transition-all">
                            <button
                              onClick={() => setExpandedNetworkCat(isExpanded ? null : cat.id)}
                              className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-all"
                            >
                              <div className="flex items-center space-x-2.5">
                                <IconComp className={`w-4 h-4 ${cat.color}`} />
                                <span className="font-bold text-xs text-white">{cat.title}</span>
                                <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                                  {cat.items.length} Connected
                                </span>
                              </div>
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>

                            {isExpanded && (
                              <div className="p-4 pt-0 border-t border-white/5 space-y-2 bg-slate-950/40 text-xs">
                                {cat.items.map((item, idx) => (
                                  <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-cyan-300">{item.name}</span>
                                      <span className="text-[9px] font-mono text-slate-400">{item.duration}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-200 font-medium">{item.role}</div>
                                    <div className="text-[9px] text-slate-400 font-mono leading-tight">{item.scope}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 3: RELATED EXECUTIVES MATRIX */}
                {(intelSubTab === 'all' || intelSubTab === 'structure') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center space-x-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>3. Key C-Suite Decision Makers & Executive Links</span>
                      </h4>
                      <button
                        onClick={() => setActiveTab('roster')}
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <span>View Full Roster ({executives.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {cSuiteMapping.map((role, idx) => {
                        const matchedExec = executives.find(e => {
                          const pos = (e.position || e.jobTitle || '').toLowerCase();
                          return pos.includes(role.roleKey.toLowerCase()) || pos.includes(role.title.split(' ')[0].toLowerCase());
                        }) || executives[idx % (executives.length || 1)];

                        const execName = matchedExec?.fullName || role.defaultName;
                        const execTitle = matchedExec?.position || matchedExec?.jobTitle || role.title;

                        return (
                          <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2.5 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase block">{role.title}</span>
                              <h5 className="font-bold text-white text-xs mt-0.5">{execName}</h5>
                              <span className="text-[10px] text-slate-400 truncate block">{execTitle}</span>
                            </div>

                            <div className="pt-2 border-t border-white/5 flex items-center gap-1.5">
                              {matchedExec ? (
                                <button
                                  onClick={() => onSelectExecutive(matchedExec)}
                                  className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold flex items-center space-x-1 w-full justify-center transition-all"
                                >
                                  <UserCheck className="w-3 h-3 text-cyan-400" />
                                  <span>View Personal Information</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-mono italic">Outreach Pending</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 4: DELCA RELATIONSHIP COVERAGE MATRIX */}
                {(intelSubTab === 'all' || intelSubTab === 'coverage') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center space-x-2">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>4. DELCA Departmental Relationship Coverage Matrix</span>
                      </h4>
                      <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                        Account Coverage Score: 92/100
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {relCoverage.map((item, idx) => (
                        <div key={idx} className={`p-3.5 rounded-xl bg-slate-900 border ${item.color.split(' ')[0]} space-y-2`}>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{item.dept}</span>
                            <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white/5 ${item.color.split(' ')[1]}`}>
                              {item.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-slate-400">
                              <span>Engagement Strength</span>
                              <span className="font-bold text-white">{item.score}%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-1.5 rounded-full" style={{ width: `${item.score}%` }}></div>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-300 leading-tight pt-1">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 5: TECHNOLOGY LANDSCAPE AUDIT */}
                {(intelSubTab === 'all' || intelSubTab === 'tech') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <h4 className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center space-x-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span>5. Technology Landscape & Core Enterprise Architecture</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                        <span className="text-[10px] font-mono text-purple-300 font-bold uppercase block">Core ERP Engine</span>
                        <p className="text-xs font-bold text-white">{companyInfo?.techStack?.[0] || 'SAP S/4HANA Enterprise Cloud (Version 2025)'}</p>
                        <span className="text-[10px] text-slate-400 font-mono block">Real-time ledger, supply chain & human capital ledger integration.</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                        <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase block">Cloud Infrastructure & DB</span>
                        <p className="text-xs font-bold text-white">AWS Multi-Region (ap-southeast-1) & Azure Hybrid Cloud</p>
                        <span className="text-[10px] text-slate-400 font-mono block">High-availability microservices and transactional database cluster.</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase block">Cybersecurity & Compliance</span>
                        <p className="text-xs font-bold text-white">Tier 4 - Zero-Trust Perimeter, Automated SOC & BSP Certified</p>
                        <span className="text-[10px] text-slate-400 font-mono block">Zero-trust architecture, automated security orchestration, and BSP compliance.</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/20 space-y-2">
                      <span className="text-[10px] font-mono text-purple-300 uppercase font-bold block">Technology Modernization Goals (2026 - 2027)</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {[
                          'Legacy Core Banking Decoupling & Microservices Migration',
                          'Real-Time Automated Financial Ledger Synchronization',
                          'BSP & SEC Regulatory Sandbox Compliance API Automation',
                          'Zero-Downtime Multi-Cloud Disaster Recovery Failover'
                        ].map((goal, idx) => (
                          <div key={idx} className="flex items-start space-x-2 text-slate-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SECTION 6: BUSINESS OPPORTUNITY MAP */}
                {(intelSubTab === 'all' || intelSubTab === 'tech') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center space-x-2">
                        <Target className="w-4 h-4 text-amber-400" />
                        <span>6. Business Opportunity Map & Strategic Next Actions</span>
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                        Total Value Map: $2,175,000
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {oppMap.map((opp, idx) => (
                        <div key={idx} className={`p-4 rounded-xl border ${opp.color} space-y-2.5 flex flex-col justify-between`}>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white text-xs">{opp.area}</span>
                              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 uppercase">
                                {opp.priority} Priority
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs font-mono pt-1">
                              <span className="text-emerald-400 font-bold text-sm">{opp.val}</span>
                              <span className="text-cyan-300 font-bold">{opp.read}% Estimated Readiness</span>
                            </div>

                            <p className="text-[11px] text-slate-300 pt-1 leading-snug">{opp.action}</p>
                          </div>

                          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <button
                              onClick={() => {
                                setActiveTab('pipeline');
                                setShowAddOppForm(true);
                                setOppTitle(`${companyName} - ${opp.area}`);
                              }}
                              className="px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-[10px] font-mono flex items-center space-x-1 transition-all"
                            >
                              <span>Convert to Opportunity</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 7: CONNECTED COMPANIES */}
                {(intelSubTab === 'all' || intelSubTab === 'coverage') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <h4 className="text-xs font-mono uppercase text-blue-300 font-bold flex items-center space-x-2">
                      <Network className="w-4 h-4 text-blue-400" />
                      <span>7. Connected Companies & Enterprise Relationships</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {[
                        { name: parentCompany, relation: 'Parent Company', status: 'Parent Holdings', badge: '100% Equity' },
                        ...subsidiariesList.slice(0, 3).map((sub, i) => ({ name: sub, relation: 'Subsidiary', status: i === 0 ? 'DELCA Active' : 'Expansion Target', badge: 'Wholly-Owned' })),
                        { name: 'McKinsey & Company PH', relation: 'Partner Organization', status: 'Consulting Advisory', badge: 'Strategic Partner' },
                        { name: 'Microsoft Philippines', relation: 'Technology Vendor', status: 'Cloud Infrastructure', badge: 'Tier-1 Alliance' }
                      ].map((comp, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">{comp.name}</span>
                            <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded font-bold">{comp.badge}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">{comp.relation} • {comp.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 8: ACCOUNT EXPANSION OPPORTUNITIES */}
                {(intelSubTab === 'all' || intelSubTab === 'coverage') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <h4 className="text-xs font-mono uppercase text-emerald-300 font-bold flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>8. Account Expansion Opportunities & Land-and-Expand Targets</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {accountExpansions.map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold">{exp.category}</span>
                            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-bold">{exp.value}</span>
                          </div>
                          <h5 className="font-bold text-white text-xs">{exp.title}</h5>
                          <p className="text-[10px] text-slate-300 leading-tight">{exp.desc}</p>
                          <div className="pt-2 border-t border-white/5 text-[10px] font-mono text-cyan-300 font-bold flex items-center space-x-1">
                            <ArrowRight className="w-3 h-3 text-cyan-400" />
                            <span>Action: {exp.action}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 9: EXPLAINABLE AI STRATEGIC INSIGHTS */}
                {(intelSubTab === 'all' || intelSubTab === 'ai') && (
                  <div className="p-5 rounded-xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border-2 border-purple-500/40 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BrainCircuit className="w-5 h-5 text-purple-400 shrink-0" />
                        <div>
                          <h4 className="font-display font-black text-base text-white">9. Explainable AI Strategic Recommendations</h4>
                          <span className="text-[10px] text-purple-300 font-mono">100% Transparent Reasoning & Evidence Traceability</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                        AI Confidence: High (92% Average)
                      </span>
                    </div>

                    <div className="space-y-3">
                      {aiInsights.map((insight) => {
                        const isExpanded = expandedAiInsight === insight.id;
                        return (
                          <div key={insight.id} className="p-4 rounded-xl bg-slate-900 border border-purple-500/20 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                                  <h5 className="font-bold text-white text-sm">{insight.title}</h5>
                                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-mono font-bold">
                                    {insight.confidence}% Confidence
                                  </span>
                                </div>
                                <p className="text-xs text-emerald-400 font-mono font-bold">Impact: {insight.impact}</p>
                              </div>

                              <button
                                onClick={() => setExpandedAiInsight(isExpanded ? null : insight.id)}
                                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 text-xs font-mono font-bold flex items-center space-x-1.5 shrink-0 self-start sm:self-auto"
                              >
                                <Info className="w-3.5 h-3.5 text-purple-300" />
                                <span>{isExpanded ? 'Hide AI Explanation' : 'View Explainable AI Evidence'}</span>
                              </button>
                            </div>

                            {/* EXPLAINABILITY BREAKDOWN */}
                            <div className="p-3.5 rounded-xl bg-slate-950 border border-white/5 space-y-2 text-xs">
                              <div>
                                <span className="text-[9px] font-mono text-purple-300 font-bold uppercase block">Core Recommendation</span>
                                <p className="text-slate-200 font-medium">{insight.recommendation}</p>
                              </div>

                              {isExpanded && (
                                <div className="pt-2 border-t border-white/10 space-y-2 text-[11px] leading-relaxed">
                                  <div>
                                    <span className="text-[9px] font-mono text-amber-300 font-bold uppercase block">Why Generated (AI Signal Analysis)</span>
                                    <p className="text-slate-300">{insight.why}</p>
                                  </div>

                                  <div>
                                    <span className="text-[9px] font-mono text-cyan-300 font-bold uppercase block">Supporting Business Evidence</span>
                                    <p className="text-slate-300">{insight.evidence}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* SECTION 10: UNIFIED COMPANY TIMELINE */}
                {(intelSubTab === 'all' || intelSubTab === 'timeline') && (
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>10. Unified Account Activity Timeline & Audit Trail</span>
                      </h4>
                      <button
                        onClick={() => setActiveTab('timeline')}
                        className="text-xs font-mono text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <span>View Interactive Timeline ({allInteractions.length + unifiedTimelineLogs.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10 pl-8">
                      {unifiedTimelineLogs.map((log, idx) => (
                        <div key={idx} className="relative space-y-1">
                          <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-navy-950"></div>
                          <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-white">{log.title}</span>
                              <span className="text-[10px] font-mono text-slate-400">{log.date}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] font-mono">
                              <span className={`px-2 py-0.5 rounded font-bold ${log.color}`}>{log.category}</span>
                              <span className="text-slate-400">• Logged by {log.author}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 pt-0.5">{log.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 2: EXECUTIVE ROSTER */}
          {activeTab === 'roster' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-navy-950 p-4 rounded-xl border border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">Company Executive Roster ({executives.length})</h4>
                  <p className="text-xs text-slate-400 font-mono">Direct leadership decision-makers at {companyName}</p>
                </div>

                {onOpenAddExecForCompany && (
                  <button
                    onClick={() => onOpenAddExecForCompany(companyName, industry)}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Executive</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {executives.map(exec => (
                  <div key={exec.id} className="p-5 rounded-2xl bg-navy-950 border border-white/10 hover:border-cyan-500/40 transition-all space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt={exec.fullName}
                          className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/30"
                        />
                        <div>
                          <h5 className="font-bold text-white text-sm hover:text-cyan-300 cursor-pointer" onClick={() => onSelectExecutive(exec)}>
                            {exec.fullName}
                          </h5>
                          <p className="text-xs text-slate-300">{exec.position}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                              exec.contactStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {exec.contactStatus}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400">{exec.relationshipStage}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectExecutive(exec)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-mono"
                      >
                        View Personal Information
                      </button>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email:</span>
                        <a href={`mailto:${exec.email}`} className="text-cyan-300 font-mono font-bold hover:underline">{exec.email}</a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phone:</span>
                        <span className="text-white font-mono">{exec.contactNumber || exec.phoneNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Last Contact:</span>
                        <span className="text-slate-300 font-mono">{exec.lastContactDate || 'None logged'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => onComposeEmail(exec)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center space-x-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </button>

                      {onScheduleMeeting && (
                        <button
                          onClick={() => onScheduleMeeting(exec)}
                          className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center space-x-1"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                          <span>Meeting</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMMUNICATION SUMMARY */}
          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Emails Exchanged</span>
                  <div className="text-xl font-bold text-cyan-300">{totalEmailsCount} Messages</div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Phone Calls Logged</span>
                  <div className="text-xl font-bold text-emerald-300">{totalCallsCount} Calls</div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Executive Meetings</span>
                  <div className="text-xl font-bold text-purple-300">{totalMeetingsCount} Meetings</div>
                </div>

                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Notes & Touchpoints</span>
                  <div className="text-xl font-bold text-amber-300">{totalNotesCount} Notes</div>
                </div>
              </div>

              {/* LOG INTERACTION FORM */}
              <form onSubmit={handleAddNoteSubmit} className="p-4 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-3">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">Log Company Activity or Executive Interaction</h4>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedExecForNote}
                    onChange={e => setSelectedExecForNote(e.target.value)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    {executives.map(e => (
                      <option key={e.id} value={e.id}>{e.fullName}</option>
                    ))}
                  </select>

                  <select
                    value={noteType}
                    onChange={e => setNoteType(e.target.value as any)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono font-bold focus:outline-none"
                  >
                    <option value="Note">Note</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Call</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Record key conversation notes or outcomes..."
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl shadow-md shrink-0"
                  >
                    Log Interaction
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 5: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">Chronological Company Relationship Timeline</h4>

              <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-white/10">
                {allInteractions.length === 0 ? (
                  <p className="text-slate-500 text-xs italic py-8 text-center font-mono">No interaction logs found for this company.</p>
                ) : (
                  allInteractions.map(item => (
                    <div key={item.id} className="relative pl-9 space-y-1">
                      <div className="absolute left-2.5 top-3 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900" />
                      <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {item.type}
                            </span>
                            <span className="text-white font-bold">{item.execName}</span>
                          </div>
                          <span className="text-slate-400">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase text-purple-400 font-bold">VIP Events & Summits Attended</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allAttendedEvents.length === 0 ? (
                    <p className="text-slate-500 text-xs italic py-4 col-span-2 font-mono text-center">No recorded VIP event attendance logged for {companyName}.</p>
                  ) : (
                    allAttendedEvents.map((evt, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{evt}</div>
                          <div className="text-[10px] font-mono text-slate-400">VIP Corporate Representation</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">Upcoming Target VIP Summits</h4>
                <div className="space-y-2.5">
                  {events.filter(e => e.status === 'Upcoming').map(evt => (
                    <div key={evt.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{evt.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{evt.date} • {evt.venue}</div>
                      </div>
                      <button
                        onClick={() => executives[0] && onComposeEmail(executives[0])}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold hover:bg-cyan-500/30 transition-all border border-cyan-500/30"
                      >
                        Invite Exec →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-navy-950 p-4 rounded-xl border border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">Company Document Repository ({localDocs.length})</h4>
                  <p className="text-xs text-slate-400 font-mono">Contracts, Proposals, NDAs, and Meeting Briefs</p>
                </div>

                <button
                  onClick={() => setShowDocForm(!showDocForm)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showDocForm ? 'Cancel' : 'Upload Document'}</span>
                </button>
              </div>

              {/* Upload Document Form */}
              {showDocForm && (
                <form onSubmit={handleDocUploadSubmit} className="p-4 rounded-xl bg-navy-950 border border-cyan-500/40 space-y-3">
                  <h5 className="font-bold text-cyan-400 text-xs font-mono uppercase">Upload Document to {companyName} Repository</h5>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400">Document Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Exec Transformation NDA 2026"
                        value={docTitle}
                        onChange={e => setDocTitle(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400">Category</label>
                      <select
                        value={docCategory}
                        onChange={e => setDocCategory(e.target.value as any)}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      >
                        <option value="Contract">Contract</option>
                        <option value="Proposal">Proposal</option>
                        <option value="NDR">NDR / NDA</option>
                        <option value="Meeting Brief">Meeting Brief</option>
                        <option value="Presentation">Presentation</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-cyan-500 text-navy-950 font-bold text-xs rounded-xl"
                    >
                      Save Document
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2.5">
                {localDocs.map(doc => (
                  <div key={doc.id} className="p-3.5 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-between text-xs hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Paperclip className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Uploaded: {doc.uploadedAt} • Size: {doc.size || '1.8 MB'}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/10 text-slate-300">
                        {doc.category}
                      </span>
                      <button 
                        onClick={() => handleDownloadDoc(doc.title, doc.category)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300" 
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* DEDICATED COMPANY REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/95 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl w-full max-w-4xl shadow-2xl p-6 space-y-6 my-auto text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white">Company Intelligence Report</h3>
                  <p className="text-xs text-slate-400 font-mono">{companyName} Executive Workspace Summary</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center space-x-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs font-mono leading-relaxed bg-navy-950 p-5 rounded-xl border border-white/10 max-h-[60vh] overflow-y-auto">
              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">1. Executive Overview & Corporate Scale</span>
                <p className="text-slate-300 mt-1">
                  Company Name: {companyName} | Industry Sector: {industry}<br />
                  Annual Revenue: {companyInfo?.annualRevenue || '₱150B+'} | Workforce: {companyInfo?.employeeCount || '10,000+ Employees'}<br />
                  Ticker / Market Cap: {companyInfo?.stockTicker || 'PUBLIC.PH'} ({companyInfo?.marketCap || '₱250B+'})<br />
                  Headquarters: {companyInfo?.headquartersAddress || `${companyInfo?.city || 'Makati'}, Philippines`}<br />
                  Assigned Account Lead: {amName} ({amTitle}) | Influence Rating: {influenceScore}/100 ({influenceTier})
                </p>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">2. Products & Service Portfolio</span>
                <p className="text-slate-300 mt-1">
                  {(companyInfo?.productsAndServices || [
                    'Enterprise Commercial Solutions', 'Retail Customer Care Portals', 'Trade Finance & Treasury', 'Supply Chain Logistics', 'Wealth Management'
                  ]).join(' • ')}
                </p>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">3. ERP Systems & Enterprise Technology Stack</span>
                <p className="text-slate-300 mt-1">
                  Core ERP: {companyInfo?.techStack?.[0] || 'SAP S/4HANA Cloud'}<br />
                  Cloud Infrastructure: {companyInfo?.techStack?.slice(1, 3).join(', ') || 'AWS Multi-Region, Oracle Exadata Cloud'}<br />
                  Security & Middleware: {companyInfo?.techStack?.slice(3).join(', ') || 'DELCA EIRMS, Palo Alto Networks, ServiceNow'}
                </p>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">4. AI Initiatives & Digital Transformation Roadmap</span>
                <p className="text-slate-300 mt-1">
                  Annual R&D Allocation: {companyInfo?.rndBudget || '₱3.5B / Year'}<br />
                  Active AI Initiatives: {(companyInfo?.aiInitiatives || ['GenAI Assistants', 'ML Fraud Detection', 'LLM Executive Support']).join('; ')}<br />
                  Digital Milestones: {(companyInfo?.digitalTransformationEfforts || ['Core Multi-Cloud Migration', 'Paperless C-Suite Workflows', 'Zero-Trust Architecture']).join('; ')}
                </p>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">5. Major Strategic Projects & Annual Reports</span>
                <p className="text-slate-300 mt-1">
                  Major Projects: {(companyInfo?.majorProjects || ['$100M+ Core Cloud Modernization', 'Nationwide Logistics Center']).join('; ')}<br />
                  Annual Filings: 2025 Integrated Annual Report & Financial SEC Filings Verified
                </p>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">6. Existing DELCA Account Relationship & History</span>
                <p className="text-slate-300 mt-1">
                  Account Status: {companyInfo?.delcaRelationship?.status || 'Active Strategic Enterprise Account'}<br />
                  Deployed Modules: {(companyInfo?.delcaRelationship?.deployedModules || ['DELCA EIRMS', 'Executive 360', 'VIP Summit Engine']).join(', ')}<br />
                  Active Seat Licenses: {companyInfo?.delcaRelationship?.activeLicenses || '250 Enterprise Seats'}<br />
                  Expansion Roadmap: {companyInfo?.delcaRelationship?.expansionRoadmap || 'Q3 2026 AI Predictive Scoring & Executive Automation'}
                </p>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">7. Executive Roster & C-Suite Contacts ({executives.length})</span>
                <div className="mt-2 space-y-1">
                  {executives.map((e, idx) => (
                    <div key={e.id} className="text-slate-300">
                      {idx + 1}. {e.fullName} — {e.position} [{e.contactStatus}] ({e.email})
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-b border-white/10 pb-3">
                <span className="text-cyan-400 font-bold uppercase block text-sm">8. Commercial Pipeline & Financial Impact</span>
                <p className="text-slate-300 mt-1">
                  Total Active Deals: {allOpportunities.length} | Gross Pipeline Value: ${totalPipelineValue.toLocaleString()}<br />
                  Weighted Risk-Adjusted Pipeline: ${Math.round(weightedPipelineValue).toLocaleString()} | Avg Deal Size: ${avgDealSize.toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-cyan-400 font-bold uppercase block text-sm">9. Market Position, Competitors & Industry Trends</span>
                <p className="text-slate-300 mt-1">
                  Strategy: {companyInfo?.businessStrategy || `${companyName} maintains leading market share with aggressive digital transformation.`}<br />
                  Key Competitors: {(companyInfo?.competitors || ['Industry Peer A', 'Regional Competitor B']).join(', ')}<br />
                  Industry Trends: {(companyInfo?.industryTrends || ['Open API Frameworks', 'BSP Data Privacy Mandates', 'Generative AI Workflows']).join('; ')}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2 bg-cyan-500 text-navy-950 font-bold text-xs rounded-xl"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Industry Intelligence Report Modal */}
      <IndustryIntelligenceReportModal
        isOpen={showIndustryModal}
        onClose={() => setShowIndustryModal(false)}
        defaultIndustry={industry}
        companyContext={companyInfo}
      />

    </div>
  );
}
