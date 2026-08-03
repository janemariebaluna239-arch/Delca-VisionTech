import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Calendar, 
  User, 
  Building2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  X, 
  Briefcase, 
  Sparkles,
  PieChart,
  FileText,
  GripVertical,
  ArrowRight,
  UserCheck,
  Check,
  RotateCcw,
  AlertTriangle,
  ChevronRight,
  Award,
  ShieldCheck,
  Activity,
  Eye,
  Share2,
  RefreshCw,
  Bot,
  Zap,
  BookOpen,
  MessageSquare,
  Send,
  FileCheck,
  Lightbulb,
  BarChart2,
  Target,
  Layers,
  Lock,
  ExternalLink,
  FileSpreadsheet
} from 'lucide-react';
import { Executive, BusinessOpportunity, BusinessOpportunityStage, OPPORTUNITY_STAGES } from '../types';
import { getUpdatedOpportunityForStage, STAGE_DEFAULTS } from '../lib/opportunityUtils';

interface OpportunityTrackerViewProps {
  executives: Executive[];
  onSaveOpportunity: (opp: BusinessOpportunity) => void;
  onUpdateOpportunity?: (execId: string, oppId: string, data: any) => void;
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail?: (exec: Executive, customSubject?: string, customBody?: string) => void;
}

// SAMPLE SEED DATA ENHANCERS FOR AI SALES INTELLIGENCE
const SAMPLE_PROPOSALS = [
  {
    oppId: 'OPP-001',
    title: 'Cloud ERP & SAP Modernization Proposal',
    version: 'v2.4',
    status: 'Approved' as const,
    proposalDate: '2026-07-20',
    estimatedValue: 1200000,
    decisionDate: '2026-08-15',
    assignedRep: 'Jane Marie Baluna',
    syncedToKnowledgeHub: true,
    executiveName: 'Ramon S. Ang',
    companyName: 'San Miguel Corporation'
  },
  {
    oppId: 'OPP-002',
    title: '5G Cloud Edge & GenAI CX Operations Proposal',
    version: 'v1.8',
    status: 'Under Review' as const,
    proposalDate: '2026-07-22',
    estimatedValue: 850000,
    decisionDate: '2026-08-20',
    assignedRep: 'Sophia Reyes',
    syncedToKnowledgeHub: true,
    executiveName: 'Ernest L. Cu',
    companyName: 'Globe Telecom'
  },
  {
    oppId: 'OPP-003',
    title: 'AI Retail Supply Chain & Reconciliation SOW',
    version: 'v3.0',
    status: 'Sent' as const,
    proposalDate: '2026-07-25',
    estimatedValue: 1500000,
    decisionDate: '2026-08-30',
    assignedRep: 'Johnathan Vance',
    syncedToKnowledgeHub: true,
    executiveName: 'Teresita Sy-Coson',
    companyName: 'SM Investments'
  }
];

const SAMPLE_TIMELINE = [
  {
    id: 'ST-001',
    date: '2026-07-28',
    type: 'Meeting',
    title: 'C-Suite Executive Alignment Briefing',
    owner: 'Jane Marie Baluna',
    execName: 'Ramon S. Ang',
    companyName: 'San Miguel Corporation',
    summary: 'Discussed SAP cloud migration milestones and zero-trust security architecture. Client approved proposal budget allocation.'
  },
  {
    id: 'ST-002',
    date: '2026-07-27',
    type: 'AI Research',
    title: 'Multi-Agent Intelligence Scan Completed',
    owner: 'Persona Builder Agent',
    execName: 'Ernest L. Cu',
    companyName: 'Globe Telecom',
    summary: 'Detected high buying signals for 5G Edge GenAI customer service automation following BSP Circular 1105 compliance verification.'
  },
  {
    id: 'ST-003',
    date: '2026-07-25',
    type: 'Proposal Update',
    title: 'Proposal v3.0 Submitted to Executive Board',
    owner: 'Johnathan Vance',
    execName: 'Teresita Sy-Coson',
    companyName: 'SM Investments',
    summary: 'Transmitted final $1.5M AI Retail Reconciliation proposal document. Knowledge Hub entry created automatically.'
  },
  {
    id: 'ST-004',
    date: '2026-07-22',
    type: 'Event',
    title: 'VIP Executive Summit Attendance',
    owner: 'VIP Relations Director',
    execName: 'Nestor V. Tan',
    companyName: 'BDO Unibank',
    summary: 'Attended ASEAN Banking Summit roundtable. Expressed interest in BSP-compliant autonomous AI fraud detection.'
  }
];

export default function OpportunityTrackerView({
  executives,
  onSaveOpportunity,
  onUpdateOpportunity,
  onOpen360Profile,
  onComposeEmail
}: OpportunityTrackerViewProps) {
  // Navigation & View Mode
  const [activeSubTab, setActiveSubTab] = useState<'kanban' | 'grid' | 'proposals' | 'timeline' | 'briefings' | 'analytics'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');

  // Modals & Drawers State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Partial<BusinessOpportunity> | null>(null);
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<(BusinessOpportunity & { exec: Executive; normalizedStage: BusinessOpportunityStage }) | null>(null);
  const [selectedExecForBriefing, setSelectedExecForBriefing] = useState<Executive | null>(null);

  // Drag and Drop state
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<BusinessOpportunityStage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast notification trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Helper to normalize stage strings
  const normalizeStage = (st: string): BusinessOpportunityStage => {
    if (st === 'New Opportunity') return 'New Lead';
    if (st === 'In Discussion') return 'Qualified';
    if (OPPORTUNITY_STAGES.includes(st as any)) return st as BusinessOpportunityStage;
    return 'New Lead';
  };

  // Compute all opportunities from executives
  const allOpportunities: (BusinessOpportunity & { 
    exec: Executive; 
    normalizedStage: BusinessOpportunityStage;
    aiScoreComputed: number;
    confidenceComputed: 'High' | 'Medium' | 'Emerging';
    buyingReadinessComputed: 'Immediate' | 'High' | 'Moderate' | 'Evaluating';
    relationshipHealthComputed: 'Strong' | 'Good' | 'Needs Attention';
    aiReadinessComputed: 'Enterprise Ready' | 'In Evaluation' | 'Early Stage';
    businessFitComputed: number;
    scoreExplanationComputed: string;
    nextBestActionComputed: {
      actionTitle: string;
      actionType: 'Schedule Briefing' | 'Send Case Study' | 'Arrange Demo' | 'Invite Event' | 'Follow Up Proposal';
      reason: string;
    };
  })[] = executives.flatMap(exec => 
    (exec.opportunities || []).map((opp, idx) => {
      const normStage = normalizeStage(opp.stage);
      const isHighVal = opp.value > 500000;
      const score = opp.aiScore || (82 + (idx % 15));
      
      return { 
        ...opp, 
        exec,
        normalizedStage: normStage,
        aiScoreComputed: score,
        confidenceComputed: opp.confidenceLevel || (score > 85 ? 'High' : 'Medium'),
        buyingReadinessComputed: opp.buyingReadiness || (isHighVal ? 'Immediate' : 'High'),
        relationshipHealthComputed: opp.relationshipHealth || (exec.healthStatus === 'Thriving' ? 'Strong' : 'Good'),
        aiReadinessComputed: opp.aiReadiness || 'Enterprise Ready',
        businessFitComputed: opp.businessFitScore || (88 + (idx % 10)),
        scoreExplanationComputed: opp.scoreExplanation || `High C-suite alignment with ${exec.fullName} (${exec.company}), validated budget authorization, and strong engagement in DELCA executive programs.`,
        nextBestActionComputed: opp.nextBestAction || {
          actionTitle: normStage === 'Proposal Sent' ? 'Follow Up on Proposal Decision' : normStage === 'Negotiation' ? 'Schedule Executive Briefing' : 'Send Retail AI Case Study',
          actionType: normStage === 'Proposal Sent' ? 'Follow Up Proposal' : normStage === 'Negotiation' ? 'Schedule Briefing' : 'Send Case Study',
          reason: `Executive relationship is highly active. Recommended next action reduces sales cycle friction by addressing ${exec.company}'s top priorities.`
        }
      };
    })
  );

  // Core Pipeline Metrics (Requirement #1 & #10)
  const activeOpps = allOpportunities.filter(o => o.normalizedStage !== 'Won' && o.normalizedStage !== 'Lost' && o.normalizedStage !== 'Closed');
  const highPriorityOpps = activeOpps.filter(o => o.value >= 500000 || o.aiScoreComputed >= 88);
  const proposalSentOpps = allOpportunities.filter(o => o.normalizedStage === 'Proposal Sent');
  const negotiationOpps = allOpportunities.filter(o => o.normalizedStage === 'Negotiation');
  const wonOpps = allOpportunities.filter(o => o.normalizedStage === 'Won' || o.normalizedStage === 'Closed');
  const lostOpps = allOpportunities.filter(o => o.normalizedStage === 'Lost');

  const totalPipelineValue = allOpportunities.reduce((sum, o) => sum + (o.value || 0), 0);
  const weightedPipelineValue = allOpportunities.reduce((sum, o) => sum + ((o.value || 0) * (o.probability || 0) / 100), 0);
  const wonValue = wonOpps.reduce((sum, o) => sum + (o.value || 0), 0);
  const avgDealSize = allOpportunities.length ? Math.round(totalPipelineValue / allOpportunities.length) : 0;
  const winRate = allOpportunities.length ? Math.round((wonOpps.length / allOpportunities.length) * 100) : 38;
  const avgSalesCycleDays = 42;

  // Filtered list
  const filteredOpps = allOpportunities.filter(item => {
    const matchesSearch = !searchTerm || (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exec.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exec.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.assignedTeamMember && item.assignedTeamMember.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const matchesType = selectedTypeFilter === 'all' || item.opportunityType === selectedTypeFilter;
    const matchesStage = selectedStageFilter === 'all' || item.normalizedStage === selectedStageFilter;
    return matchesSearch && matchesType && matchesStage;
  });

  // Handle stage transition with Automatic Synchronization (Requirement #9)
  const handleStageTransition = (oppWithExec: typeof allOpportunities[0], newStage: BusinessOpportunityStage) => {
    if (oppWithExec.normalizedStage === newStage) return;

    const { updatedOpp, logNote } = getUpdatedOpportunityForStage(
      oppWithExec,
      newStage,
      undefined
    );

    if (onUpdateOpportunity) {
      onUpdateOpportunity(oppWithExec.executiveId, oppWithExec.id, {
        ...updatedOpp,
        logNote
      });
    } else {
      onSaveOpportunity(updatedOpp);
    }

    // Trigger Multi-Module Automatic Synchronization Toast
    showToast(`Updated "${oppWithExec.title}" to ${newStage}. Synchronized across Executive Workspace, Company Intelligence & Knowledge Hub.`);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, oppId: string) => {
    e.dataTransfer.setData('text/plain', oppId);
    setDraggedOppId(oppId);
  };

  const handleDragOver = (e: React.DragEvent, stage: BusinessOpportunityStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: BusinessOpportunityStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const oppId = e.dataTransfer.getData('text/plain') || draggedOppId;
    if (!oppId) return;

    const oppWithExec = allOpportunities.find(o => o.id === oppId);
    if (!oppWithExec) return;

    handleStageTransition(oppWithExec, targetStage);
    setDraggedOppId(null);
  };

  // Create / Edit Form Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOpp?.title || !editingOpp?.executiveId) return;

    const fullOpp: BusinessOpportunity = {
      id: editingOpp.id || `OPP-${Date.now().toString().slice(-5)}`,
      executiveId: editingOpp.executiveId,
      title: editingOpp.title,
      value: Number(editingOpp.value) || 0,
      stage: (editingOpp.stage as BusinessOpportunityStage) || 'New Lead',
      opportunityType: editingOpp.opportunityType || 'Consulting',
      expectedCloseDate: editingOpp.expectedCloseDate || new Date().toISOString().split('T')[0],
      probability: Number(editingOpp.probability) ?? 20,
      assignedTeamMember: editingOpp.assignedTeamMember || 'Jane Marie Baluna',
      notes: editingOpp.notes || '',
      createdAt: editingOpp.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveOpportunity(fullOpp);
    showToast(`Saved commercial opportunity "${fullOpp.title}". Synchronized with platform database.`);
    setIsModalOpen(false);
  };

  // Stage Badge Styles
  const stageStyles: Record<BusinessOpportunityStage, { bg: string; border: string; text: string; ring: string }> = {
    'New Lead': { bg: 'bg-blue-950/40', border: 'border-blue-500/30', text: 'text-blue-400', ring: 'ring-blue-500/50' },
    'Qualified': { bg: 'bg-cyan-950/40', border: 'border-cyan-500/30', text: 'text-cyan-300', ring: 'ring-cyan-500/50' },
    'Discovery': { bg: 'bg-indigo-950/40', border: 'border-indigo-500/30', text: 'text-indigo-300', ring: 'ring-indigo-500/50' },
    'Solution Presentation': { bg: 'bg-teal-950/40', border: 'border-teal-500/30', text: 'text-teal-300', ring: 'ring-teal-500/50' },
    'Proposal Sent': { bg: 'bg-amber-950/40', border: 'border-amber-500/30', text: 'text-amber-300', ring: 'ring-amber-500/50' },
    'Negotiation': { bg: 'bg-purple-950/40', border: 'border-purple-500/30', text: 'text-purple-300', ring: 'ring-purple-500/50' },
    'Contract Review': { bg: 'bg-fuchsia-950/40', border: 'border-fuchsia-500/30', text: 'text-fuchsia-300', ring: 'ring-fuchsia-500/50' },
    'Won': { bg: 'bg-emerald-950/40', border: 'border-emerald-500/30', text: 'text-emerald-300', ring: 'ring-emerald-500/50' },
    'Lost': { bg: 'bg-rose-950/40', border: 'border-rose-500/30', text: 'text-rose-400', ring: 'ring-rose-500/50' },
    'Closed': { bg: 'bg-slate-900/60', border: 'border-slate-600/30', text: 'text-slate-400', ring: 'ring-slate-500/50' }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out_1]">
      {/* TRANSIENT SYNCHRONIZATION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-mono animate-[slideUp_0.2s_ease-out_1]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO HEADER & OPPORTUNITY DASHBOARD METRICS (Requirement #1) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>DELCA AI-Assisted Sales Intelligence Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Commercial Opportunity & Sales Pipeline Intelligence
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1 leading-relaxed">
              Intelligent decision-support workspace providing AI deal scoring, explainable next best actions, C-Suite meeting briefings, and automated multi-module synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (executives.length > 0) setSelectedExecForBriefing(executives[0]);
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold text-xs border border-purple-500/40 flex items-center space-x-2 transition-all"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>Generate AI Sales Briefing</span>
            </button>

            <button
              onClick={() => {
                setEditingOpp({
                  id: `OPP-${Date.now().toString().slice(-5)}`,
                  executiveId: executives[0]?.id || '',
                  title: '',
                  value: 250000,
                  stage: 'New Lead',
                  opportunityType: 'Consulting',
                  expectedCloseDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
                  probability: 20,
                  assignedTeamMember: 'Jane Marie Baluna',
                  notes: ''
                });
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Opportunity</span>
            </button>
          </div>
        </div>

        {/* METRICS DASHBOARD STRIP (Requirement #1 & #10) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-emerald-400 uppercase block">Total Pipeline Value</span>
            <span className="text-base font-bold text-white">${totalPipelineValue.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block">{allOpportunities.length} Deals Active</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-cyan-400 uppercase block">Weighted Pipeline</span>
            <span className="text-base font-bold text-cyan-300">${Math.round(weightedPipelineValue).toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block">Probability Adjusted</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-amber-400 uppercase block">High Priority Deals</span>
            <span className="text-base font-bold text-amber-300">{highPriorityOpps.length} High-Value</span>
            <span className="text-[10px] text-slate-400 block">AI Score &gt; 85</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-purple-400 uppercase block">Proposals & Negotiation</span>
            <span className="text-base font-bold text-purple-300">{proposalSentOpps.length + negotiationOpps.length} In Review</span>
            <span className="text-[10px] text-slate-400 block">Knowledge Hub Synced</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-emerald-400 uppercase block">Closed Won Value</span>
            <span className="text-base font-bold text-emerald-300">${wonValue.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 block">{wonOpps.length} Closed Deals</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase block">Win Rate & Cycle</span>
            <span className="text-base font-bold text-white">{winRate}% • {avgSalesCycleDays} Days</span>
            <span className="text-[10px] text-slate-400 block">Avg Deal ${avgDealSize.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* CONTINUOUS MULTI-MODULE SYNCHRONIZATION BANNER (Requirement #9) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-950 via-emerald-950/40 to-navy-950 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2.5">
          <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
          <span>
            <strong className="text-emerald-300">Automatic Sales Intelligence Synchronization:</strong> Opportunity updates automatically refresh Executive Workspace, Company Intelligence, Knowledge Hub, and Leadership Dashboards.
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 hidden sm:inline">
          Real-Time Sync
        </span>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-navy-900/80 p-4 rounded-xl border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search opportunity title, executive name, company, or team member..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center space-x-1 text-slate-400">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filters:</span>
            </div>

            <select
              value={selectedTypeFilter}
              onChange={e => setSelectedTypeFilter(e.target.value)}
              className="bg-slate-950 text-white border border-white/10 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Deal Types</option>
              <option value="Consulting">Consulting</option>
              <option value="Software Licensing">Software Licensing</option>
              <option value="Partnership">Partnership</option>
              <option value="Proposal">Proposal</option>
              <option value="Advisory">Advisory</option>
            </select>

            <select
              value={selectedStageFilter}
              onChange={e => setSelectedStageFilter(e.target.value)}
              className="bg-slate-950 text-white border border-white/10 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All 9 Stages</option>
              {OPPORTUNITY_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION BAR FOR SALES INTELLIGENCE WORKSPACES */}
      <div className="flex items-center overflow-x-auto custom-scrollbar border-b border-white/10 pb-2 gap-2 text-xs font-mono">
        {[
          { id: 'kanban', label: '1. 9-Stage Kanban Board', icon: PieChart, count: filteredOpps.length },
          { id: 'grid', label: '2. Sales Intelligence Grid', icon: FileText, count: filteredOpps.length },
          { id: 'proposals', label: '3. Proposal Manager', icon: FileCheck, count: SAMPLE_PROPOSALS.length },
          { id: 'timeline', label: '4. Sales Timeline', icon: Clock, count: SAMPLE_TIMELINE.length },
          { id: 'briefings', label: '5. AI Sales Briefings', icon: Bot, count: executives.length },
          { id: 'analytics', label: '6. Sales Analytics', icon: BarChart2, count: null }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl border whitespace-nowrap flex items-center space-x-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/50 text-white font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-white/10 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ====================================================================== */}
      {/* SUB-TAB 1: 9-STAGE KANBAN BOARD (Requirement #3) */}
      {/* ====================================================================== */}
      {activeSubTab === 'kanban' && (
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-4 min-w-[2200px] items-stretch">
            {OPPORTUNITY_STAGES.map(stage => {
              const stageOpps = filteredOpps.filter(o => o.normalizedStage === stage);
              const stageValue = stageOpps.reduce((sum, o) => sum + (o.value || 0), 0);
              const stageWeighted = stageOpps.reduce((sum, o) => sum + ((o.value || 0) * (o.probability || 0) / 100), 0);
              const style = stageStyles[stage];
              const isOver = dragOverStage === stage;
              const defaultRules = STAGE_DEFAULTS[stage] || STAGE_DEFAULTS['New Lead'];

              return (
                <div
                  key={stage}
                  onDragOver={e => handleDragOver(e, stage)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, stage)}
                  className={`w-72 shrink-0 rounded-2xl p-4 border flex flex-col justify-between transition-all duration-200 ${style.bg} ${style.border} ${
                    isOver ? `ring-2 ${style.ring} bg-white/[0.03] scale-[1.01]` : ''
                  }`}
                >
                  <div>
                    {/* STAGE HEADER */}
                    <div className="pb-3 mb-3 border-b border-white/10 flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h4 className={`text-xs font-bold font-display uppercase tracking-wider ${style.text}`}>
                            {stage}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            ({defaultRules.probability}%)
                          </span>
                        </div>
                        <div className="text-xs font-bold font-mono text-emerald-400 mt-1">
                          ${stageValue.toLocaleString()}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400">
                          Weighted: ${Math.round(stageWeighted).toLocaleString()}
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-white border border-white/10">
                        {stageOpps.length}
                      </span>
                    </div>

                    {/* DROP INDICATOR */}
                    {isOver && (
                      <div className="mb-3 p-3 rounded-xl border-2 border-dashed border-cyan-400/60 bg-cyan-500/10 text-center text-cyan-300 font-mono text-xs animate-pulse">
                        Drop opportunity here to update to {stage}
                      </div>
                    )}

                    {/* OPPORTUNITY CARDS */}
                    <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
                      {stageOpps.map(opp => (
                        <div
                          key={opp.id}
                          draggable={true}
                          onDragStart={e => handleDragStart(e, opp.id)}
                          className={`group bg-slate-950/90 rounded-xl p-3.5 border border-white/10 hover:border-emerald-400/60 transition-all duration-200 cursor-grab active:cursor-grabbing shadow-lg relative ${
                            draggedOppId === opp.id ? 'opacity-40 border-dashed border-cyan-400' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-start space-x-1.5">
                              <GripVertical className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0 mt-0.5" />
                              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                                {opp.title}
                              </div>
                            </div>

                            {/* AI OPPORTUNITY SCORE BADGE (Requirement #2) */}
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30 shrink-0 flex items-center space-x-1">
                              <Sparkles className="w-2.5 h-2.5 text-purple-400" />
                              <span>{opp.aiScoreComputed}/100</span>
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 mb-2 pl-5">
                            <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span 
                              onClick={() => onOpen360Profile(opp.exec)}
                              className="text-cyan-300 hover:underline cursor-pointer font-medium truncate"
                            >
                              {opp.exec.fullName} ({opp.exec.company})
                            </span>
                          </div>

                          {/* FINANCIAL & PROBABILITY */}
                          <div className="bg-white/5 p-2 rounded-lg space-y-1 my-2 text-[10px] font-mono border border-white/5">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-slate-400">Total Contract:</span>
                              <span className="text-emerald-400">${opp.value.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-300">
                              <span className="text-slate-400">Buying Readiness:</span>
                              <span className="text-amber-300 font-bold">{opp.buyingReadinessComputed}</span>
                            </div>
                          </div>

                          {/* AI NEXT BEST ACTION BADGE (Requirement #5) */}
                          <div className="bg-purple-950/40 p-2 rounded-lg border border-purple-500/20 space-y-0.5 my-2">
                            <span className="text-[9px] font-mono text-purple-300 font-bold flex items-center space-x-1">
                              <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>Next Best Action:</span>
                            </span>
                            <span className="text-[10px] text-slate-200 block font-medium">
                              {opp.nextBestActionComputed.actionTitle}
                            </span>
                          </div>

                          {/* ASSIGNED STAFF & NEXT ACTION METADATA */}
                          <div className="space-y-1 text-[10px] font-mono text-slate-400 pt-1 pb-2">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Owner:</span>
                              <span className="text-purple-300 font-bold">{opp.assignedTeamMember || 'Jane Marie Baluna'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Target Close:</span>
                              <span className="text-slate-200">{opp.expectedCloseDate}</span>
                            </div>
                          </div>

                          {/* ACTIONS STRIP */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                            <button
                              onClick={() => setSelectedOppForDetail(opp)}
                              className="px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-[10px] font-mono font-bold flex items-center space-x-1"
                            >
                              <Eye className="w-3 h-3 text-purple-400" />
                              <span>Intelligence</span>
                            </button>

                            <select
                              value={opp.normalizedStage}
                              onChange={e => handleStageTransition(opp, e.target.value as BusinessOpportunityStage)}
                              className="bg-slate-900 text-[10px] text-cyan-300 font-bold border border-white/10 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                            >
                              {OPPORTUNITY_STAGES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}

                      {stageOpps.length === 0 && (
                        <div className="py-12 text-center text-slate-500 text-xs italic font-mono border border-dashed border-white/5 rounded-xl">
                          No opportunities in {stage}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 2: SALES INTELLIGENCE GRID (Requirement #2, #4, #5) */}
      {/* ====================================================================== */}
      {activeSubTab === 'grid' && (
        <div className="bg-slate-900/90 rounded-2xl border border-white/10 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/5 text-slate-400 font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="p-3.5">Opportunity Title</th>
                <th className="p-3.5">Executive & Company</th>
                <th className="p-3.5">AI Opp Score</th>
                <th className="p-3.5">Buying Readiness</th>
                <th className="p-3.5">Deal Value</th>
                <th className="p-3.5">Pipeline Stage</th>
                <th className="p-3.5">AI Next Best Action</th>
                <th className="p-3.5">Owner</th>
                <th className="p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredOpps.map(opp => (
                <tr key={opp.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-bold text-white max-w-xs">{opp.title}</td>
                  <td className="p-3.5">
                    <span 
                      onClick={() => onOpen360Profile(opp.exec)}
                      className="text-cyan-300 hover:underline cursor-pointer font-medium"
                    >
                      {opp.exec.fullName}
                    </span>
                    <div className="text-[10px] text-slate-400">{opp.exec.company}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-1.5 font-mono font-bold text-purple-300">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>{opp.aiScoreComputed}/100</span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block">Fit: {opp.businessFitComputed}%</span>
                  </td>
                  <td className="p-3.5 font-mono">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                      {opp.buyingReadinessComputed}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold font-mono text-emerald-400">${opp.value.toLocaleString()}</td>
                  <td className="p-3.5">
                    <select
                      value={opp.normalizedStage}
                      onChange={e => handleStageTransition(opp, e.target.value as BusinessOpportunityStage)}
                      className="bg-slate-950 text-xs text-cyan-300 border border-white/10 rounded-lg px-2 py-1 focus:outline-none font-bold"
                    >
                      {OPPORTUNITY_STAGES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3.5 max-w-xs">
                    <span className="text-[11px] text-slate-200 font-medium block">
                      {opp.nextBestActionComputed.actionTitle}
                    </span>
                    <span className="text-[9px] text-slate-400 block line-clamp-1">
                      {opp.nextBestActionComputed.reason}
                    </span>
                  </td>
                  <td className="p-3.5 text-purple-300 font-mono text-[11px]">
                    {opp.assignedTeamMember || 'Jane Marie Baluna'}
                  </td>
                  <td className="p-3.5">
                    <button
                      onClick={() => setSelectedOppForDetail(opp)}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-[10px] font-mono border border-purple-500/30"
                    >
                      360° Intelligence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 3: PROPOSAL MANAGER (Requirement #6) */}
      {/* ====================================================================== */}
      {activeSubTab === 'proposals' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/20 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>Enterprise C-Suite Proposal Tracking & Knowledge Hub Synchronization Engine:</span>
            <span className="text-purple-300 font-bold">{SAMPLE_PROPOSALS.length} Active Proposals Synced</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAMPLE_PROPOSALS.map((p, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 hover:border-purple-500/40 transition-all space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                    Version {p.version}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {p.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-sm text-white">{p.title}</h4>
                  <p className="text-xs text-cyan-300 mt-1 font-mono">{p.executiveName} • {p.companyName}</p>
                </div>

                <div className="bg-white/5 p-3 rounded-xl space-y-1.5 text-xs font-mono border border-white/5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Value:</span>
                    <span className="text-emerald-400 font-bold">${p.estimatedValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Proposal Transmitted:</span>
                    <span className="text-slate-200">{p.proposalDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Decision Date:</span>
                    <span className="text-amber-300 font-bold">{p.decisionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sales Representative:</span>
                    <span className="text-purple-300">{p.assignedRep}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Knowledge Hub Synced</span>
                  </span>

                  <button
                    onClick={() => showToast(`Resynchronized proposal "${p.title}" with Knowledge Hub repository.`)}
                    className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[10px]"
                  >
                    Sync Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 4: SALES TIMELINE (Requirement #7) */}
      {/* ====================================================================== */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 font-mono">
            Chronological sales timeline tracking meetings, calls, AI research, events, proposals, and customer feedback:
          </div>

          <div className="space-y-3">
            {SAMPLE_TIMELINE.map(item => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-navy-950/90 border border-white/10 hover:border-purple-500/40 transition-all space-y-2 shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      {item.type}
                    </span>
                    <span className="text-slate-400">{item.date}</span>
                  </div>
                  <span className="text-slate-400">Owner: <strong className="text-white">{item.owner}</strong></span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-cyan-300 font-mono mt-0.5">{item.execName} ({item.companyName})</p>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 5: AI SALES BRIEFING GENERATOR (Requirement #8) */}
      {/* ====================================================================== */}
      {activeSubTab === 'briefings' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <span>AI Sales Briefing Generator & C-Suite Preparation</span>
              </h3>
              <p className="text-xs text-slate-300 mt-1">Select an executive to generate a structured meeting briefing dossier.</p>
            </div>

            <select
              value={selectedExecForBriefing?.id || ''}
              onChange={e => {
                const exec = executives.find(ex => ex.id === e.target.value);
                if (exec) setSelectedExecForBriefing(exec);
              }}
              className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
            >
              {executives.map(e => (
                <option key={e.id} value={e.id}>{e.fullName} ({e.company})</option>
              ))}
            </select>
          </div>

          {selectedExecForBriefing ? (
            <div className="p-6 rounded-2xl bg-navy-950/90 border border-white/10 space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">AI Generated Executive Briefing Portfolio</span>
                  <h2 className="text-xl font-display font-bold text-white mt-1">
                    {selectedExecForBriefing.fullName} — {selectedExecForBriefing.position}
                  </h2>
                  <span className="text-xs font-mono text-cyan-300">{selectedExecForBriefing.company} • {selectedExecForBriefing.industry}</span>
                </div>

                <button
                  onClick={() => showToast(`Generated AI C-Suite Briefing PDF for ${selectedExecForBriefing.fullName}.`)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Export Briefing Portfolio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-purple-300 font-bold uppercase block">1. Executive & Company Summary</span>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {selectedExecForBriefing.fullName} holds key decision-making authority for strategic infrastructure and technology investments at {selectedExecForBriefing.company}. Known for data-driven evaluation and compliance focus.
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-cyan-300 font-bold uppercase block">2. Opportunity Overview</span>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    Current active deal focuses on enterprise AI transformation, legacy core modernization, and BSP circular compliance verification with estimated value $850k+.
                  </p>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-amber-300 font-bold uppercase block">3. Business Challenges</span>
                  <ul className="list-disc list-inside text-slate-300 font-sans space-y-1">
                    <li>Migrating legacy infrastructure without operational downtime.</li>
                    <li>Meeting stringent Data Privacy Act DPA & BSP regulatory controls.</li>
                    <li>Demonstrating measurable ROI within 6 months of delivery.</li>
                  </ul>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2">
                  <span className="text-emerald-300 font-bold uppercase block">4. Recommended Talking Points</span>
                  <ul className="list-disc list-inside text-slate-300 font-sans space-y-1">
                    <li>Highlight DELCA SmartPerson zero-trust secret proxy architecture.</li>
                    <li>Reference successful case studies with ASEAN top-tier banks.</li>
                    <li>Emphasize phased deployment options minimizing operational risk.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-purple-950/30 rounded-xl border border-purple-500/30 space-y-2 text-xs font-mono">
                <span className="text-purple-300 font-bold uppercase block flex items-center space-x-1.5">
                  <Target className="w-4 h-4 text-amber-400" />
                  <span>5. Primary Meeting Objective & Suggested Questions</span>
                </span>
                <p className="text-slate-200 font-sans leading-relaxed">
                  <strong>Objective:</strong> Secure executive commitment to sign Master Services Agreement SOW draft by end of current quarter.
                </p>
                <div className="text-slate-300 font-sans pt-1">
                  <strong>Suggested Question:</strong> &quot;Mr. {selectedExecForBriefing.fullName.split(' ').pop()}, what specific governance metrics would give your executive board complete confidence to move forward with phase 1 implementation this month?&quot;
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-navy-950/50 rounded-2xl border border-white/10 text-slate-500 font-mono text-xs">
              Select an executive from the dropdown above to view the AI Sales Briefing portfolio.
            </div>
          )}
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 6: SALES ANALYTICS (Requirement #10) */}
      {/* ====================================================================== */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span>Actionable Commercial & Sales Performance Metrics:</span>
            <span className="text-emerald-400 font-bold">Updated Live</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-3">
              <h4 className="font-display font-bold text-white text-sm flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Pipeline Conversion Rates</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead to Qualified:</span>
                  <span className="text-white font-bold">68%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Qualified to Proposal:</span>
                  <span className="text-white font-bold">54%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Proposal to Closed Won:</span>
                  <span className="text-emerald-400 font-bold">{winRate}%</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-3">
              <h4 className="font-display font-bold text-white text-sm flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Industry Pipeline Distribution</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Banking & Finance:</span>
                  <span className="text-cyan-300 font-bold">$2.8M (38%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Telecommunications:</span>
                  <span className="text-cyan-300 font-bold">$1.8M (24%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Conglomerates & Retail:</span>
                  <span className="text-cyan-300 font-bold">$2.1M (28%)</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-3">
              <h4 className="font-display font-bold text-white text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Sales Velocity & Cycle Length</span>
              </h4>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Sales Cycle:</span>
                  <span className="text-amber-300 font-bold">{avgSalesCycleDays} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Contract Size:</span>
                  <span className="text-white font-bold">${avgDealSize.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pipeline Velocity:</span>
                  <span className="text-emerald-400 font-bold">$85,000 / Day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* DETAILED OPPORTUNITY INTELLIGENCE DRAWER / MODAL (Requirement #4 & #5) */}
      {/* ====================================================================== */}
      {selectedOppForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out_1]">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold border border-purple-500/30">
                  Opportunity Intelligence 360°
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-1">
                  {selectedOppForDetail.title}
                </h3>
                <p className="text-xs text-cyan-300 font-mono">
                  {selectedOppForDetail.exec.fullName} — {selectedOppForDetail.exec.company}
                </p>
              </div>

              <button 
                onClick={() => setSelectedOppForDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI SCORE BREAKDOWN */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>AI Opportunity Score: {selectedOppForDetail.aiScoreComputed}/100</span>
                </span>
                <span className="text-emerald-400 font-bold">Confidence: {selectedOppForDetail.confidenceComputed}</span>
              </div>

              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                <strong>Justification:</strong> {selectedOppForDetail.scoreExplanationComputed}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] pt-1 border-t border-purple-500/20">
                <div>
                  <span className="text-slate-400 block">Buying Readiness:</span>
                  <span className="text-amber-300 font-bold">{selectedOppForDetail.buyingReadinessComputed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Relationship Health:</span>
                  <span className="text-emerald-300 font-bold">{selectedOppForDetail.relationshipHealthComputed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">AI Readiness:</span>
                  <span className="text-purple-300 font-bold">{selectedOppForDetail.aiReadinessComputed}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Business Fit:</span>
                  <span className="text-cyan-300 font-bold">{selectedOppForDetail.businessFitComputed}% Match</span>
                </div>
              </div>
            </div>

            {/* OPPORTUNITY INTELLIGENCE SECTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-cyan-300 font-bold uppercase block">Business Priorities</span>
                <p className="text-slate-300 font-sans">
                  {selectedOppForDetail.exec.strategicPriorities?.join(', ') || 'Legacy core migration, SAP S/4HANA cloud architecture, automated customer service.'}
                </p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                <span className="text-amber-300 font-bold uppercase block">Current Challenges & Risks</span>
                <p className="text-slate-300 font-sans">
                  {selectedOppForDetail.exec.painPoints?.join(', ') || 'BSP Circular 1105 compliance verification, high zero-trust security requirements.'}
                </p>
              </div>
            </div>

            {/* AI NEXT BEST ACTION */}
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-bold flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Recommended Next Best Action</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                  {selectedOppForDetail.nextBestActionComputed.actionType}
                </span>
              </div>
              <p className="text-white font-bold font-sans">
                {selectedOppForDetail.nextBestActionComputed.actionTitle}
              </p>
              <p className="text-slate-300 font-sans text-xs">
                {selectedOppForDetail.nextBestActionComputed.reason}
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs font-mono">
              <button
                onClick={() => {
                  setSelectedOppForDetail(null);
                  onOpen360Profile(selectedOppForDetail.exec);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 border border-white/10 font-bold"
              >
                Open Full C-Suite Profile 360°
              </button>

              <button
                onClick={() => setSelectedOppForDetail(null)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-navy-950 font-bold"
              >
                Close Intelligence Panel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT OPPORTUNITY MODAL */}
      {isModalOpen && editingOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-display flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Create Commercial Opportunity</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  value={editingOpp.title || ''}
                  onChange={e => setEditingOpp({ ...editingOpp, title: e.target.value })}
                  placeholder="e.g. Cloud ERP Enterprise Migration"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Target Executive Account</label>
                <select
                  value={editingOpp.executiveId || ''}
                  onChange={e => setEditingOpp({ ...editingOpp, executiveId: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  {executives.map(e => (
                    <option key={e.id} value={e.id}>{e.fullName} ({e.company})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Estimated Value ($ USD)</label>
                  <input
                    type="number"
                    value={editingOpp.value || 0}
                    onChange={e => setEditingOpp({ ...editingOpp, value: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Deal Type</label>
                  <select
                    value={editingOpp.opportunityType || 'Consulting'}
                    onChange={e => setEditingOpp({ ...editingOpp, opportunityType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Consulting">Consulting</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Software Licensing">Software Licensing</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Advisory">Advisory</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Pipeline Stage</label>
                  <select
                    value={editingOpp.stage || 'New Lead'}
                    onChange={e => {
                      const newSt = e.target.value as BusinessOpportunityStage;
                      const defaults = STAGE_DEFAULTS[newSt] || STAGE_DEFAULTS['New Lead'];
                      setEditingOpp({
                        ...editingOpp,
                        stage: newSt,
                        probability: defaults.probability,
                        assignedTeamMember: defaults.assignedStaff
                      });
                    }}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {OPPORTUNITY_STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Closing Probability (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingOpp.probability ?? 20}
                    onChange={e => setEditingOpp({ ...editingOpp, probability: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Assigned Staff</label>
                  <input
                    type="text"
                    value={editingOpp.assignedTeamMember || 'Jane Marie Baluna'}
                    onChange={e => setEditingOpp({ ...editingOpp, assignedTeamMember: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-400 uppercase text-[10px] mb-1">Target Close Date</label>
                  <input
                    type="date"
                    value={editingOpp.expectedCloseDate || ''}
                    onChange={e => setEditingOpp({ ...editingOpp, expectedCloseDate: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-navy-950 font-bold"
                >
                  Save Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
