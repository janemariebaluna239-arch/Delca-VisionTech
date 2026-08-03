import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Globe, 
  Linkedin, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileText, 
  Sparkles, 
  Plus, 
  HeartPulse, 
  Users, 
  Download, 
  Share2,
  Clock,
  Send,
  CheckCircle2,
  AlertTriangle,
  Briefcase,
  MessageSquare,
  ExternalLink,
  PhoneCall,
  GitFork,
  CalendarPlus,
  History,
  Paperclip,
  UserCheck,
  Compass,
  ShieldCheck,
  Trash2,
  Edit3,
  Save,
  UploadCloud,
  Check,
  Search,
  Filter,
  ArrowRight,
  Award,
  Tag,
  MapPin,
  ChevronRight,
  Zap,
  BrainCircuit
} from 'lucide-react';
import { Executive, DELCAEvent, BusinessOpportunity, InteractionNote, ExecutiveDocument, RelationshipStage, EXECUTIVE_JOURNEY_STAGES, OPPORTUNITY_STAGES } from '../types';
import { calculateRelationshipHealthScore, getNetworkConnections, getReferralChain, calculateProfileCompleteness } from '../lib/contactUtils';

interface Executive360ModalProps {
  executive: Executive;
  events: DELCAEvent[];
  allExecutives: Executive[];
  onClose: () => void;
  onComposeEmail: (exec: Executive) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  onOpenHistory?: (exec: Executive) => void;
  onOpenPersonaBuilder?: (exec: Executive) => void;
  onOpenAccountIntelligence?: (exec: Executive) => void;
  onAddNote: (execId: string, noteText: string, noteType: any) => void;
  onSaveOpportunity: (opp: BusinessOpportunity) => void;
  onUpdateExecutive?: (execId: string, data: Partial<Executive>) => void;
}

export default function Executive360Modal({
  executive,
  events,
  allExecutives,
  onClose,
  onComposeEmail,
  onScheduleMeeting,
  onOpenHistory,
  onOpenPersonaBuilder,
  onOpenAccountIntelligence,
  onAddNote,
  onSaveOpportunity,
  onUpdateExecutive
}: Executive360ModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'graph' | 'timeline' | 'meetings' | 'events' | 'opportunities' | 'documents' | 'notes' | 'referrals'>('overview');
  
  // Timeline Form State
  const [newNoteText, setNewNoteText] = useState('');
  const [noteType, setNoteType] = useState<'Note' | 'Email' | 'Meeting' | 'Call' | 'Event Attendance'>('Note');
  const [timelineFilter, setTimelineFilter] = useState<string>('All');
  const [timelineSearch, setTimelineSearch] = useState<string>('');

  // AI Brief State
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // New Deal Form State
  const [showNewOppForm, setShowNewOppForm] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppValue, setOppValue] = useState<number>(50000);
  const [oppStage, setOppStage] = useState<any>('New Lead');
  const [oppType, setOppType] = useState<any>('Consulting');
  const [oppCloseDate, setOppCloseDate] = useState('2026-12-31');
  const [oppProbability, setOppProbability] = useState<number>(60);

  // Document Upload State
  const [showDocUploadForm, setShowDocUploadForm] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<ExecutiveDocument['category']>('Contract');

  // Internal Notes State
  const [internalNotesText, setInternalNotesText] = useState(executive.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Follow-Up Reminder Date State
  const [followUpDateInput, setFollowUpDateInput] = useState(executive.followUpDate || '');

  // Computed Properties
  const health = calculateRelationshipHealthScore(executive);
  const completeness = calculateProfileCompleteness(executive);
  const connections = getNetworkConnections(executive, allExecutives, events);
  const referralChain = getReferralChain(executive.id, allExecutives);

  // Executives referred by this executive
  const referredExecutives = allExecutives.filter(e => e.referredById === executive.id);
  const referrerExecutive = executive.referredById ? allExecutives.find(e => e.id === executive.referredById) : null;

  // Opportunities summary
  const opportunities = executive.opportunities || [];
  const totalOppValue = opportunities.reduce((sum, o) => sum + (o.value || 0), 0);

  // Documents summary
  const documents = executive.documents || [];

  // Interaction logs
  const interactions = executive.interactionHistory || [];
  const filteredInteractions = interactions.filter(i => {
    const matchesFilter = timelineFilter === 'All' || i.type === timelineFilter;
    const matchesSearch = !timelineSearch || i.content.toLowerCase().includes(timelineSearch.toLowerCase()) || i.authorName?.toLowerCase().includes(timelineSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Follow-up status check
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = executive.followUpDate && executive.followUpDate < today;
  const isDueToday = executive.followUpDate && executive.followUpDate === today;

  // Handlers
  const handleCreateNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddNote(executive.id, newNoteText, noteType);
    setNewNoteText('');
  };

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    if (onUpdateExecutive) {
      onUpdateExecutive(executive.id, { notes: internalNotesText });
    }
    setTimeout(() => {
      setIsSavingNotes(false);
      setNotesSavedSuccess(true);
      setTimeout(() => setNotesSavedSuccess(false), 3000);
    }, 400);
  };

  const handleUpdateFollowUp = (newDate: string | null) => {
    setFollowUpDateInput(newDate || '');
    if (onUpdateExecutive) {
      onUpdateExecutive(executive.id, { followUpDate: newDate });
    }
  };

  const handleStageChange = (newStage: RelationshipStage) => {
    if (onUpdateExecutive) {
      onUpdateExecutive(executive.id, { relationshipStage: newStage });
    }
  };

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim()) return;

    const newOpp: BusinessOpportunity = {
      id: `OPP-${Date.now().toString().slice(-4)}`,
      executiveId: executive.id,
      title: oppTitle.trim(),
      value: Number(oppValue),
      stage: oppStage,
      opportunityType: oppType,
      expectedCloseDate: oppCloseDate,
      probability: Number(oppProbability),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveOpportunity(newOpp);
    setOppTitle('');
    setShowNewOppForm(false);
  };

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) return;

    const newDoc: ExecutiveDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      title: docTitle.trim(),
      category: docCategory,
      uploadedAt: new Date().toISOString().split('T')[0],
      size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`
    };

    const updatedDocs = [...documents, newDoc];
    if (onUpdateExecutive) {
      onUpdateExecutive(executive.id, { documents: updatedDocs });
    }

    setDocTitle('');
    setShowDocUploadForm(false);
  };

  const handleGenerateBrief = () => {
    const briefText = `==================================================
DELCA VISIONTECH — PERSONAL INFORMATION BRIEFING
==================================================
EXECUTIVE PROFILE:
Name: ${executive.fullName}
Position: ${executive.position || executive.jobTitle}
Company: ${executive.company} (${executive.industry})
Contact: ${executive.email} | ${executive.contactNumber || executive.phoneNumber || 'N/A'}
Location: ${executive.city ? `${executive.city}, ` : ''}${executive.country}
Status: ${executive.contactStatus} (${completeness}% Complete Profile)

RELATIONSHIP INTELLIGENCE:
Health Rating: ${health.score}% (${health.status})
Lifecycle Stage: ${executive.relationshipStage}
Contact Source: ${executive.contactSource}
Last Contact: ${executive.lastContactDate || 'None recorded'}
Scheduled Follow-Up: ${executive.followUpDate || 'None set'}

COMMERCIAL PIPELINE & OPPORTUNITIES:
${opportunities.length > 0 
  ? opportunities.map(o => ` • ${o.title}: $${o.value.toLocaleString()} [Stage: ${o.stage} | Win Prob: ${o.probability}%]`).join('\n') 
  : ' • No active commercial opportunities logged'}
Total Pipeline Value: $${totalOppValue.toLocaleString()}

VIP EVENT ATTENDANCE HISTORY:
${(executive.previousEventAttendance || []).length > 0 
  ? (executive.previousEventAttendance || []).map(evt => ` • ${evt}`).join('\n') 
  : ' • No recorded VIP event attendance'}

STRATEGIC NOTES & PREFERENCES:
Preferred Channels: ${(executive.communicationPreferences || []).join(', ') || 'Email'}
Categories of Interest: ${(executive.preferredEventCategories || []).join(', ') || 'Technology, C-Suite Summit'}
Notes: ${executive.notes || 'No custom notes provided.'}

EXECUTIVE MEETING ACTION PLAN:
1. Review current business transformation initiatives at ${executive.company}.
2. Present tailored ROI proposal aligned with ongoing opportunities.
3. Secure attendance for upcoming DELCA C-Suite Summit.
==================================================
Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
`;

    setGeneratedBrief(briefText);
    setActiveTab('meetings');
  };

  const handleCopyBrief = () => {
    if (!generatedBrief) return;
    navigator.clipboard.writeText(generatedBrief);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-navy-950/85 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out_1]">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto">
        
        {/* WORKSPACE HEADER */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 relative">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={executive.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={executive.fullName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-lg"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                executive.contactStatus === 'Verified' ? 'bg-emerald-400' : 'bg-amber-400'
              }`} title={`Contact Status: ${executive.contactStatus}`} />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">{executive.fullName}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {executive.contactStatus}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  health.status === 'Thriving' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Health: {health.score}% ({health.status})
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">{executive.position}</p>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="flex items-center space-x-1 text-cyan-400">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{executive.company}</span>
                </span>
                <span>•</span>
                <span>{executive.industry}</span>
                {executive.country && (
                  <>
                    <span>•</span>
                    <span className="flex items-center space-x-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{executive.city ? `${executive.city}, ` : ''}{executive.country}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* HEADER CONTROLS */}
          <div className="flex items-center space-x-2">
            {/* Stage Selector */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[9px] font-mono uppercase text-slate-400">Relationship Stage</span>
              <select
                value={executive.relationshipStage}
                onChange={e => handleStageChange(e.target.value as RelationshipStage)}
                className="bg-navy-950 border border-cyan-500/30 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {EXECUTIVE_JOURNEY_STAGES.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {onOpenAccountIntelligence && (
              <button
                onClick={() => onOpenAccountIntelligence(executive)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/25 transition-all"
              >
                <BrainCircuit className="w-4 h-4 text-navy-950 animate-pulse" />
                <span>Account Intelligence Profile</span>
              </button>
            )}

            {onOpenPersonaBuilder && (
              <button
                onClick={() => onOpenPersonaBuilder(executive)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-purple-500/25 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-200" />
                <span>Persona Builder Agent</span>
              </button>
            )}

            <button
              onClick={handleGenerateBrief}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Brief</span>
            </button>

            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* QUICK COMMUNICATION ACTIONS BAR */}
        <div className="bg-navy-950 px-4 sm:px-6 py-2.5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Quick Actions:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Compose Email */}
            <button
              onClick={() => onComposeEmail(executive)}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold flex items-center space-x-1.5 transition-all"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Compose Email</span>
            </button>

            {/* 2. Phone Call */}
            {executive.contactNumber || executive.phoneNumber ? (
              <a
                href={`tel:${executive.contactNumber || executive.phoneNumber}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center space-x-1.5 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Phone</span>
              </a>
            ) : (
              <button
                onClick={() => {
                  setActiveTab('timeline');
                  setNoteType('Call');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold flex items-center space-x-1.5 transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Log Call</span>
              </button>
            )}

            {/* 3. Schedule Meeting */}
            <button
              onClick={() => onScheduleMeeting ? onScheduleMeeting(executive) : setActiveTab('meetings')}
              className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold flex items-center space-x-1.5 transition-all"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-purple-400" />
              <span>Schedule Meeting</span>
            </button>

            {/* 4. Add Note */}
            <button
              onClick={() => setActiveTab('timeline')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold flex items-center space-x-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Note</span>
            </button>

            {/* 5. Set Follow-Up Reminder */}
            <div className="flex items-center space-x-1 bg-navy-900 border border-white/10 rounded-xl px-2 py-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <input
                type="date"
                value={followUpDateInput}
                onChange={e => handleUpdateFollowUp(e.target.value)}
                className="bg-transparent text-[11px] font-mono text-cyan-300 focus:outline-none cursor-pointer"
                title="Set Follow-Up Reminder Date"
              />
              {followUpDateInput && (
                <button 
                  onClick={() => handleUpdateFollowUp(null)}
                  className="text-slate-500 hover:text-rose-400 text-[10px] px-1 font-mono"
                  title="Clear Reminder"
                >
                  ✕
                </button>
              )}
            </div>

            {/* External Links */}
            {executive.linkedinProfile && (
              <a
                href={executive.linkedinProfile}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 transition-all"
                title="Open LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}

            {executive.companyWebsite && (
              <a
                href={executive.companyWebsite}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all"
                title="Open Company Website"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
              </a>
            )}
          </div>
        </div>

        {/* WORKSPACE TAB NAVIGATION */}
        <div className="flex items-center space-x-2 bg-navy-950 px-4 sm:px-6 py-2 border-b border-white/10 overflow-x-auto text-xs font-mono custom-scrollbar shrink-0">
          <span className="text-slate-400 text-[10px] uppercase font-bold mr-1 shrink-0 hidden md:inline">Jump To Section:</span>
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Personal Information</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'timeline'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Timeline ({interactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'meetings'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Meetings & Briefs</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'events'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>VIP Events ({(executive.previousEventAttendance || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'opportunities'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Deals (${(totalOppValue / 1000).toFixed(0)}k)</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'documents'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Documents ({documents.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'notes'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Strategic Notes</span>
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border shrink-0 flex items-center space-x-1.5 ${
              activeTab === 'referrals'
                ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-navy-950 text-slate-300 border-white/10 hover:border-cyan-500/40 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Referrals & Network</span>
          </button>
        </div>

        {/* WORKSPACE TAB BODY */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300 custom-scrollbar bg-slate-900/60">

          {/* TAB 1: 360° OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* EXECUTIVE BRIEFING BANNER */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-amber-500/40 shadow-xl space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-extrabold text-sm text-white flex items-center space-x-2">
                        <span>AI Executive Briefing</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          REAL-TIME INTELLIGENCE
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">Consolidated Executive Summary & Strategic Engagement Playbook</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-mono">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                      Profile Completeness: {completeness}%
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                      Health: {health.score}% ({health.status})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  {/* 1. Who the Executive is & Leadership Role */}
                  <div className="p-3 rounded-xl bg-navy-900/80 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">1. Executive & Leadership Role</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      <strong className="text-white">{executive.fullName}</strong> serves as <strong className="text-cyan-300">{executive.position || executive.jobTitle}</strong> at <strong className="text-slate-100">{executive.company}</strong> ({executive.industry || 'Enterprise'}). Driving C-Suite operational roadmap and technology procurement.
                    </p>
                  </div>

                  {/* 2. Company Priorities */}
                  <div className="p-3 rounded-xl bg-navy-900/80 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">2. Strategic Company Priorities</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {(executive.strategicPriorities && executive.strategicPriorities.length > 0)
                        ? executive.strategicPriorities.slice(0, 2).join(' • ')
                        : 'Core ERP cloud migration, automated financial reconciliation, and AI governance protocol.'}
                    </p>
                  </div>

                  {/* 3. Current Business Opportunities */}
                  <div className="p-3 rounded-xl bg-navy-900/80 border border-white/5 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">3. Business Opportunities</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {opportunities.length > 0
                        ? `${opportunities.length} active deal(s) totaling $${totalOppValue.toLocaleString()} in commercial pipeline.`
                        : 'Identified $250k+ ERP Modernization & AI Intelligence integration opportunity.'}
                    </p>
                  </div>

                  {/* 4. Recommended Engagement Strategy */}
                  <div className="p-3 rounded-xl bg-navy-900/80 border border-white/5 space-y-1 md:col-span-2">
                    <span className="text-[10px] font-mono text-amber-300 font-bold uppercase block">4. Recommended DELCA Engagement Strategy</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      Present a 15-minute executive ROI brief emphasizing zero-downtime ERP connectors and BSP/SEC compliance frameworks, paired with a personal VIP Summit invitation.
                    </p>
                  </div>

                  {/* 5. Recommended Next Action */}
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">5. Recommended Next Action</span>
                    <p className="text-emerald-200 font-bold text-[11px] leading-relaxed">
                      {executive.recommendedNextActions?.[0] || 'Schedule ERP Discovery session & transmit personalized briefing.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* TOP STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Health Rating */}
                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>Relationship Health</span>
                    <HeartPulse className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold font-display text-white flex items-center justify-between">
                    <span>{health.score}%</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                      health.status === 'Thriving' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>{health.status}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Based on touchpoints & recency</p>
                </div>

                {/* Profile Completeness */}
                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>Profile Quality</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold font-display text-cyan-300">{completeness}% Complete</div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${completeness}%` }} />
                  </div>
                </div>

                {/* Follow-Up Status */}
                <div className={`p-4 rounded-xl border space-y-1 ${
                  isOverdue ? 'bg-rose-500/10 border-rose-500/30' : isDueToday ? 'bg-amber-500/10 border-amber-500/30' : 'bg-navy-950 border-white/10'
                }`}>
                  <div className="flex justify-between text-[10px] font-mono uppercase text-slate-400">
                    <span>Next Follow-Up</span>
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-sm font-bold text-white">
                    {executive.followUpDate || 'No date scheduled'}
                  </div>
                  <div className="text-[10px] font-mono">
                    {isOverdue ? <span className="text-rose-400 font-bold">OVERDUE</span> : isDueToday ? <span className="text-amber-300 font-bold">DUE TODAY</span> : <span className="text-slate-400">Scheduled Date</span>}
                  </div>
                </div>

                {/* Pipeline Value */}
                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 uppercase">
                    <span>Commercial Value</span>
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold font-display text-emerald-400">${totalOppValue.toLocaleString()}</div>
                  <p className="text-[10px] text-slate-400">{opportunities.length} Active Opportunities</p>
                </div>
              </div>

              {/* AI STRATEGIC INTELLIGENCE & PERSONA PROFILE */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 border border-purple-500/30 space-y-5 shadow-xl relative overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-display text-white">AI Persona & Strategic Customer Intelligence</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Agentic AI Synthesized Executive & Industry Profile</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono">
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AI Readiness: <strong>{executive.aiReadinessScore || 88}%</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                      <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Tech Maturity: <strong>{executive.technologyReadinessScore || 90}%</strong></span>
                    </div>
                  </div>
                </div>

                {/* BIOGRAPHY & BACKGROUND */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold tracking-wider block">Executive Background & Biography</span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {executive.biography || `${executive.fullName} serves as ${executive.position} at ${executive.company}. A seasoned C-suite decision maker overseeing digital transformation, cloud architecture, and organizational modernization.`}
                    </p>
                  </div>

                  <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block mb-1">Education & Credentials</span>
                      <p className="text-xs text-slate-300 font-mono">
                        {executive.education || 'MBA / Senior Executive Leadership Degree'}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block mb-1">Decision-Making Profile</span>
                      <p className="text-xs text-amber-300 font-medium">
                        {executive.decisionMakingStyle || 'Strategic ROI & High-Efficiency Focused'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* GRID OF STRATEGIC FACTORS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Strategic Priorities */}
                  <div className="p-3.5 rounded-xl bg-navy-950/80 border border-cyan-500/20 space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center space-x-1">
                      <Tag className="w-3 h-3" />
                      <span>Strategic Priorities</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(executive.strategicPriorities || ['Cloud Core ERP', 'AI Process Automation', 'Data Modernization']).map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-200 text-[10px] font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pain Points */}
                  <div className="p-3.5 rounded-xl bg-navy-950/80 border border-amber-500/20 space-y-2">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Key Pain Points</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(executive.painPoints || ['Legacy System Costs', 'Data Silos Across Branches']).map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[10px]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Buying Signals */}
                  <div className="p-3.5 rounded-xl bg-navy-950/80 border border-emerald-500/20 space-y-2">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Buying Signals</span>
                    </span>
                    <div className="space-y-1">
                      {(executive.buyingSignals || ['Active RFP Issued', 'Approved Modernization Budget']).map((b, idx) => (
                        <p key={idx} className="text-[10px] text-emerald-300 flex items-start space-x-1">
                          <span className="text-emerald-400 font-bold shrink-0">•</span>
                          <span>{b}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="p-3.5 rounded-xl bg-navy-950/80 border border-purple-500/20 space-y-2">
                    <span className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center space-x-1">
                      <Briefcase className="w-3 h-3" />
                      <span>Current Tech Environment</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(executive.techStack || ['SAP S/4HANA', 'Azure Cloud', 'Delca EIRMS']).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-200 text-[10px] font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RECOMMENDED NEXT BEST ACTIONS & RECOGNITION */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Next Best Actions */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-2">
                    <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>AI Recommended Next Best Actions</span>
                    </span>
                    <div className="space-y-1.5">
                      {(executive.recommendedNextActions || [
                        'Invite to DELCA C-Suite Summit at Solaire Resort',
                        'Send customized ROI Case Study for Multi-Ledger Automation',
                        'Schedule 1-on-1 Architecture Deep Dive Meeting'
                      ]).map((act, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-cyan-500/10 text-xs transition-all">
                          <span className="text-slate-200 font-medium">{act}</span>
                          <button 
                            onClick={() => onComposeEmail(executive)}
                            className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-navy-950 text-[10px] font-mono font-bold transition-all shrink-0 ml-2"
                          >
                            Execute
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Public Engagements & Awards */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono text-indigo-300 uppercase font-bold flex items-center space-x-1">
                      <Award className="w-3 h-3 text-indigo-400" />
                      <span>Speaking Engagements & Industry Leadership</span>
                    </span>
                    <div className="space-y-1.5 text-xs text-slate-300">
                      {(executive.speakingEngagements || ['Keynote Speaker at PH Tech Banking Forum 2025']).map((spk, idx) => (
                        <p key={idx} className="flex items-start space-x-1.5">
                          <span className="text-indigo-400">🎤</span>
                          <span>{spk}</span>
                        </p>
                      ))}
                      {(executive.awardsCertifications || ['Certified C-Suite Digital Leader']).map((awd, idx) => (
                        <p key={idx} className="flex items-start space-x-1.5 text-amber-300">
                          <span>🏆</span>
                          <span>{awd}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

                {/* PUBLIC PROFILES, CAREER HISTORY & COMMUNICATION STYLE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Public Social & Media Profiles */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-3">
                    <span className="text-[10px] font-mono text-blue-300 uppercase font-bold flex items-center space-x-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-400" />
                      <span>LinkedIn & Verified Public Social Profiles</span>
                    </span>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {executive.linkedinProfile && (
                        <a
                          href={executive.linkedinProfile.startsWith('http') ? executive.linkedinProfile : `https://${executive.linkedinProfile}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold flex items-center space-x-1.5 transition-all"
                        >
                          <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                          <span>LinkedIn</span>
                          <ExternalLink className="w-3 h-3 text-blue-400" />
                        </a>
                      )}

                      {executive.socialMedia?.twitter && (
                        <a
                          href={executive.socialMedia.twitter.startsWith('http') ? executive.socialMedia.twitter : `https://${executive.socialMedia.twitter}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold flex items-center space-x-1.5 transition-all"
                        >
                          <Globe className="w-3.5 h-3.5 text-sky-400" />
                          <span>Twitter / X</span>
                          <ExternalLink className="w-3 h-3 text-sky-400" />
                        </a>
                      )}

                      {executive.socialMedia?.bloomberg && (
                        <a
                          href={executive.socialMedia.bloomberg.startsWith('http') ? executive.socialMedia.bloomberg : `https://${executive.socialMedia.bloomberg}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold flex items-center space-x-1.5 transition-all"
                        >
                          <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                          <span>Bloomberg Profile</span>
                          <ExternalLink className="w-3 h-3 text-amber-400" />
                        </a>
                      )}

                      {executive.socialMedia?.corporateBio && (
                        <a
                          href={executive.socialMedia.corporateBio.startsWith('http') ? executive.socialMedia.corporateBio : `https://${executive.socialMedia.corporateBio}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center space-x-1.5 transition-all"
                        >
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Corporate Bio</span>
                          <ExternalLink className="w-3 h-3 text-emerald-400" />
                        </a>
                      )}

                      {executive.socialMedia?.youtubeOrPodcast && (
                        <a
                          href={executive.socialMedia.youtubeOrPodcast.startsWith('http') ? executive.socialMedia.youtubeOrPodcast : `https://${executive.socialMedia.youtubeOrPodcast}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold flex items-center space-x-1.5 transition-all"
                        >
                          <Award className="w-3.5 h-3.5 text-red-400" />
                          <span>Podcasts & Interviews</span>
                          <ExternalLink className="w-3 h-3 text-red-400" />
                        </a>
                      )}

                      {executive.companyWebsite && (
                        <a
                          href={executive.companyWebsite.startsWith('http') ? executive.companyWebsite : `https://${executive.companyWebsite}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold flex items-center space-x-1.5 transition-all"
                        >
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Company Web</span>
                          <ExternalLink className="w-3 h-3 text-cyan-400" />
                        </a>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Communication & Style Preferences</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded bg-navy-900 border border-white/5">
                          <span className="text-[10px] text-slate-400 font-mono block">Preferred Tone:</span>
                          <span className="text-cyan-300 font-bold">{executive.communicationTonePreference || 'Concise, Data-Driven & Professional'}</span>
                        </div>
                        <div className="p-2 rounded bg-navy-900 border border-white/5">
                          <span className="text-[10px] text-slate-400 font-mono block">Best Contact Time:</span>
                          <span className="text-emerald-300 font-bold">{executive.preferredContactTime || 'Tuesday - Thursday Morning (9 AM - 11 AM)'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Career History & Key Achievements */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-3">
                    <span className="text-[10px] font-mono text-purple-300 uppercase font-bold flex items-center space-x-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                      <span>Career History & Key Milestones</span>
                    </span>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Previous Roles & Experience</span>
                        <div className="space-y-1">
                          {(executive.pastRoles || [
                            `Former VP of Technology Solutions @ ${executive.company}`,
                            'Senior Enterprise Systems Architect @ Global Tech Consultants'
                          ]).map((role, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-slate-200">
                              <span className="text-purple-400 font-bold">•</span>
                              <span>{role}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Career Achievements</span>
                        <div className="space-y-1">
                          {(executive.keyAchievements || [
                            'Spearheaded $50M+ Cloud Core ERP modernization',
                            'Decreased system downtime by 99.9% across enterprise branches'
                          ]).map((ach, idx) => (
                            <div key={idx} className="flex items-center space-x-2 text-amber-300">
                              <span className="text-amber-400">🏆</span>
                              <span>{ach}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              {/* TWO COLUMN OVERVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact & Company Information */}
                <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Executive Contact & Profile Data</span>
                  </h4>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-slate-400">Email Address</span>
                      <button onClick={() => onComposeEmail(executive)} className="text-cyan-300 hover:underline font-mono font-bold flex items-center space-x-1">
                        <span>{executive.email}</span>
                        <Mail className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-slate-400">Phone Contact</span>
                      <span className="text-white font-mono">{executive.contactNumber || executive.phoneNumber || 'Unspecified'}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-slate-400">Company & Department</span>
                      <span className="text-white">{executive.company} ({executive.department || 'Executive Office'})</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-slate-400">Contact Source</span>
                      <span className="text-cyan-300 font-mono">{executive.contactSource}</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <span className="text-slate-400">Verification Status</span>
                      <span className="text-emerald-400 font-mono">{executive.contactStatus} ({executive.verificationDate || 'N/A'})</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">Preferred Channels</span>
                      <div className="flex flex-wrap gap-1">
                        {(executive.communicationPreferences || ['Email']).map((pref, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] font-mono">{pref}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health Factor Analysis & Preferences */}
                <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                  <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center space-x-1.5">
                    <HeartPulse className="w-4 h-4" />
                    <span>Relationship Health Factor Breakdown</span>
                  </h4>

                  <div className="space-y-2">
                    {health.factors.map((factor, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-xs">
                        <span className="text-slate-300">{factor.label}</span>
                        <span className={`font-mono font-bold ${factor.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {factor.positive ? `+${factor.points}` : factor.points} pts
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Preferred Event Categories</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(executive.preferredEventCategories || ['C-Suite Summit', 'Technology Innovation']).map((cat, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[10px] font-mono">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMUNICATION TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              {/* LOG NEW INTERACTION FORM */}
              <form onSubmit={handleCreateNoteSubmit} className="p-4 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Record Interaction or Meeting Note</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Logs automatically update relationship timeline</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={noteType}
                    onChange={e => setNoteType(e.target.value as any)}
                    className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono font-bold focus:outline-none"
                  >
                    <option value="Note">Note</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Call</option>
                    <option value="Event Attendance">Event Attendance</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Type key discussion takeaways, action items, or call decisions..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all shrink-0"
                  >
                    Log Activity
                  </button>
                </div>
              </form>

              {/* SEARCH & FILTER CONTROLS */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-navy-950 p-3 rounded-xl border border-white/10">
                <div className="flex items-center space-x-2 flex-1 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={timelineSearch}
                    onChange={e => setTimelineSearch(e.target.value)}
                    className="bg-transparent text-xs text-white focus:outline-none w-full"
                  />
                </div>

                <div className="flex items-center space-x-1 text-xs font-mono overflow-x-auto">
                  {['All', 'Note', 'Email', 'Meeting', 'Call', 'Event Attendance'].map(t => (
                    <button
                      key={t}
                      onClick={() => setTimelineFilter(t)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        timelineFilter === t ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHRONOLOGICAL TIMELINE FEED */}
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-white/10">
                {filteredInteractions.length === 0 ? (
                  <p className="text-slate-500 text-xs italic py-8 text-center font-mono">No interaction logs match your search criteria.</p>
                ) : (
                  filteredInteractions.map(item => (
                    <div key={item.id} className="relative pl-9 space-y-1">
                      {/* Timeline Node Dot */}
                      <div className="absolute left-2.5 top-3 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900 ring-2 ring-cyan-500/30" />

                      <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2 hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {item.type}
                            </span>
                            <span className="text-slate-300 font-bold">{item.authorName || 'Team Member'}</span>
                            <span className="text-slate-500">({item.authorRole || 'Executive Manager'})</span>
                          </div>
                          <span className="text-slate-400">{new Date(item.timestamp).toLocaleString()}</span>
                        </div>

                        <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{item.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MEETINGS & BRIEFS */}
          {activeTab === 'meetings' && (
            <div className="space-y-6">
              {/* AI BRIEF GENERATOR BANNER */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-navy-950 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-purple-300 font-bold text-sm">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span>AI Executive Portfolio & Meeting Brief Generator</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {generatedBrief && (
                      <button
                        onClick={handleCopyBrief}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs flex items-center space-x-1"
                      >
                        {copiedBrief ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
                        <span>{copiedBrief ? 'Copied!' : 'Copy Brief'}</span>
                      </button>
                    )}

                    <button
                      onClick={handleGenerateBrief}
                      className="px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition-all shadow-md"
                    >
                      Compile Portfolio Brief
                    </button>
                  </div>
                </div>

                {generatedBrief ? (
                  <pre className="p-4 bg-navy-950 rounded-xl border border-white/10 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[350px]">
                    {generatedBrief}
                  </pre>
                ) : (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Click "Compile Portfolio Brief" to dynamically assemble a structured executive document containing executive background, active deals, past attendance, relationship health factors, and customized meeting discussion points.
                  </p>
                )}
              </div>

              {/* MEETING HISTORY LIST */}
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Logged Meetings & Briefing Sessions</span>
                </h4>

                <div className="space-y-2.5">
                  {interactions.filter(i => i.type === 'Meeting').length === 0 ? (
                    <p className="text-slate-500 text-xs italic py-4 font-mono text-center">No previous meeting sessions logged for this executive.</p>
                  ) : (
                    interactions.filter(i => i.type === 'Meeting').map(m => (
                      <div key={m.id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-purple-300">
                          <span className="font-bold">{m.authorName}</span>
                          <span>{new Date(m.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-white">{m.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIP EVENT ATTENDANCE */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              {/* ATTENDED EVENTS LIST */}
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center space-x-1.5">
                  <Award className="w-4 h-4" />
                  <span>Recorded VIP Events Attended</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(executive.previousEventAttendance || []).length === 0 ? (
                    <p className="text-slate-500 text-xs italic py-4 col-span-2 font-mono text-center">No past VIP event attendance logged.</p>
                  ) : (
                    executive.previousEventAttendance.map((evtName, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">{evtName}</div>
                          <div className="text-[10px] font-mono text-slate-400">VIP Delegate</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RECOMMENDED UPCOMING EVENTS */}
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Upcoming Target VIP Summits for Invitation</span>
                </h4>

                <div className="space-y-3">
                  {events.filter(e => e.status === 'Upcoming').map(evt => (
                    <div key={evt.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-white text-sm">{evt.name}</h5>
                        <p className="text-xs text-slate-400">{evt.date} • {evt.venue} ({evt.targetIndustry})</p>
                      </div>

                      <button
                        onClick={() => onComposeEmail(executive)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all border border-cyan-500/30"
                      >
                        Invite Executive →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DEALS & OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              {/* HEADER + CREATE OPPORTUNITY TRIGGER */}
              <div className="flex items-center justify-between bg-navy-950 p-4 rounded-xl border border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">Commercial Deal Pipeline</h4>
                  <p className="text-xs text-slate-400 font-mono">Total Value: ${totalOppValue.toLocaleString()}</p>
                </div>

                <button
                  onClick={() => setShowNewOppForm(!showNewOppForm)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showNewOppForm ? 'Cancel' : 'Create New Deal'}</span>
                </button>
              </div>

              {/* NEW OPPORTUNITY FORM */}
              {showNewOppForm && (
                <form onSubmit={handleCreateOpportunity} className="p-5 rounded-2xl bg-navy-950 border border-emerald-500/40 space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <h5 className="font-bold text-emerald-400 text-xs font-mono uppercase">Create Linked Commercial Opportunity</h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Opportunity Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Enterprise Advisory Partnership"
                        value={oppTitle}
                        onChange={e => setOppTitle(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Estimated Value (USD)</label>
                      <input
                        type="number"
                        required
                        min="1000"
                        step="1000"
                        value={oppValue}
                        onChange={e => setOppValue(Number(e.target.value))}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Opportunity Stage</label>
                      <select
                        value={oppStage}
                        onChange={e => setOppStage(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        {OPPORTUNITY_STAGES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Close Target Date</label>
                      <input
                        type="date"
                        required
                        value={oppCloseDate}
                        onChange={e => setOppCloseDate(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                    >
                      Save Opportunity
                    </button>
                  </div>
                </form>
              )}

              {/* OPPORTUNITY CARDS LIST */}
              <div className="space-y-3">
                {opportunities.length === 0 ? (
                  <p className="text-slate-500 text-xs italic py-8 text-center font-mono bg-navy-950 rounded-xl border border-white/5">
                    No commercial deals currently linked to this executive. Click "Create New Deal" above to register an opportunity.
                  </p>
                ) : (
                  opportunities.map(opp => (
                    <div key={opp.id} className="p-4 rounded-xl bg-navy-950 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500/30 transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white text-sm">{opp.title}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                            {opp.stage}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Type: {opp.opportunityType} • Target Close: {opp.expectedCloseDate}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-bold font-mono text-emerald-400">${opp.value.toLocaleString()}</div>
                        <div className="text-[10px] font-mono text-cyan-300">{opp.probability}% Win Probability</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: UPLOADED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {/* UPLOAD TRIGGER */}
              <div className="flex items-center justify-between bg-navy-950 p-4 rounded-xl border border-white/10">
                <div>
                  <h4 className="font-bold text-white text-sm">Executive Document Vault</h4>
                  <p className="text-xs text-slate-400 font-mono">Contracts, Proposals, Briefing Materials & NDRs</p>
                </div>

                <button
                  onClick={() => setShowDocUploadForm(!showDocUploadForm)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{showDocUploadForm ? 'Cancel' : 'Upload Document'}</span>
                </button>
              </div>

              {/* UPLOAD FORM */}
              {showDocUploadForm && (
                <form onSubmit={handleUploadDocument} className="p-5 rounded-2xl bg-navy-950 border border-cyan-500/40 space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <h5 className="font-bold text-cyan-400 text-xs font-mono uppercase">Attach Document to Profile</h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Document Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Enterprise NDA Agreement 2026"
                        value={docTitle}
                        onChange={e => setDocTitle(e.target.value)}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-400 uppercase">Document Category</label>
                      <select
                        value={docCategory}
                        onChange={e => setDocCategory(e.target.value as any)}
                        className="w-full mt-1 bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Contract">Contract</option>
                        <option value="Proposal">Proposal</option>
                        <option value="NDR">NDR</option>
                        <option value="Meeting Brief">Meeting Brief</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl transition-all"
                    >
                      Attach Document
                    </button>
                  </div>
                </form>
              )}

              {/* DOCUMENTS LIST */}
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <p className="text-slate-500 text-xs italic py-8 text-center font-mono bg-navy-950 rounded-xl border border-white/5">
                    No uploaded documents attached to this executive. Click "Upload Document" above to attach files.
                  </p>
                ) : (
                  documents.map(doc => (
                    <div key={doc.id} className="p-4 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-between hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-xs">{doc.title}</h5>
                          <p className="text-[10px] font-mono text-slate-400">
                            Category: {doc.category} • Uploaded: {doc.uploadedAt} • Size: {doc.size || '1.2 MB'}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const content = `DELCA VisionTech Executive Document Repository\nDocument: ${doc.title}\nCategory: ${doc.category}\nExecutive: ${executive.fullName}\nCompany: ${executive.company}\nGenerated: ${new Date().toLocaleDateString()}\n\nConfidential Enterprise Record - DELCA Customer Intelligence Platform`;
                          const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 font-mono text-xs flex items-center space-x-1 border border-white/5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: INTERNAL STRATEGIC NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Internal Strategic Background & Personality Notes</span>
                  </h4>

                  {notesSavedSuccess && (
                    <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Notes Saved Successfully</span>
                    </span>
                  )}
                </div>

                <textarea
                  rows={8}
                  value={internalNotesText}
                  onChange={e => setInternalNotesText(e.target.value)}
                  placeholder="Record executive preferences, key decision drivers, background information, persona traits..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: REFERRALS & NETWORK */}
          {activeTab === 'referrals' && (
            <div className="space-y-6">
              {/* REFERRAL ORIGIN */}
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                  <Users className="w-4 h-4" />
                  <span>Referral Chain & Provenance</span>
                </h4>

                {referrerExecutive ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-cyan-500/30 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Referred By:</div>
                      <div className="font-bold text-white text-sm">{referrerExecutive.fullName}</div>
                      <div className="text-xs text-slate-400">{referrerExecutive.position} @ {referrerExecutive.company}</div>
                    </div>

                    <button
                      onClick={() => onComposeEmail(referrerExecutive)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold"
                    >
                      Email Referrer
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">This executive was onboarded directly via {executive.contactSource}.</p>
                )}
              </div>

              {/* EXECUTIVES REFERRED BY THIS CONTACT */}
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center space-x-1.5">
                  <Users className="w-4 h-4" />
                  <span>Executives Onboarded Via Referral ({referredExecutives.length})</span>
                </h4>

                <div className="space-y-2">
                  {referredExecutives.length === 0 ? (
                    <p className="text-slate-500 text-xs italic py-4 font-mono text-center">No secondary referrals linked to this executive yet.</p>
                  ) : (
                    referredExecutives.map(refExec => (
                      <div key={refExec.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-xs">{refExec.fullName}</div>
                          <div className="text-[11px] text-slate-400">{refExec.position} @ {refExec.company}</div>
                        </div>

                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Referred Contact
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* NETWORK CONNECTIONS */}
              <div className="p-5 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                <h4 className="text-xs font-mono uppercase text-indigo-400 font-bold flex items-center space-x-1.5">
                  <Compass className="w-4 h-4" />
                  <span>Network Connections & Co-Attendees ({connections.length})</span>
                </h4>

                <div className="space-y-2.5">
                  {connections.slice(0, 5).map(({ executive: conn, connectionReasons }, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{conn.fullName}</div>
                        <div className="text-[11px] text-slate-400">{conn.position} @ {conn.company}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {connectionReasons.map((r, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[9px] font-mono">{r}</span>
                          ))}
                        </div>
                      </div>

                      <button onClick={() => onComposeEmail(conn)} className="p-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30">
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
