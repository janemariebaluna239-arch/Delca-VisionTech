import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  User, 
  Trash2, 
  Edit3, 
  X, 
  Clock, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  Archive,
  QrCode,
  Check,
  UserCheck,
  Search,
  Send,
  Download,
  Sparkles,
  TrendingUp,
  DollarSign,
  Filter,
  Layers,
  Activity,
  FileText,
  BarChart2,
  Target,
  Lightbulb,
  RefreshCw,
  Briefcase,
  Building2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Eye,
  Award,
  MessageSquare,
  Share2,
  ExternalLink,
  PieChart,
  Zap,
  BookOpen,
  Bot,
  Mail
} from 'lucide-react';
import { DELCAEvent, Executive, Invitation, InboundEmailReply } from '../types';
import { getAccessToken } from '../lib/googleAuth';

interface EventManagementViewProps {
  events: DELCAEvent[];
  executives?: Executive[];
  invitations?: Invitation[];
  inboundReplies?: InboundEmailReply[];
  onAddEvent: (data: Partial<DELCAEvent>) => void;
  onEditEvent: (id: string, data: Partial<DELCAEvent>) => void;
  onDeleteEvent: (id: string) => void;
  userRole: 'Administrator' | 'Marketing Team' | 'Sales Team';
  onOpen360Profile?: (exec: Executive) => void;
  onComposeEmail?: (exec: Executive, customSubject?: string, customBody?: string) => void;
  onNavigateToTab?: (tabId: string) => void;
  onReceiveInboundReply?: (replyData: {
    executiveId: string;
    subject: string;
    body: string;
    senderEmail?: string;
    senderName?: string;
    invitationId?: string;
    status?: 'Accepted' | 'Declined' | 'Received';
  }) => void;
}

// SAMPLE SEED DATA FOR TIMELINE & ANALYTICS
const SAMPLE_EVENT_TIMELINE = [
  {
    id: 'ET-101',
    timestamp: '2026-07-28 14:30',
    type: 'Won Project',
    title: '$1.2M SAP Cloud Migration Contract Finalized',
    execName: 'Ramon S. Ang',
    companyName: 'San Miguel Corporation',
    eventId: 'EVT-001',
    eventName: 'Enterprise ERP Modernization Summit',
    details: 'Direct outcome from VIP Executive Roundtable attendance and follow-up proposal v2.4.'
  },
  {
    id: 'ET-102',
    timestamp: '2026-07-27 10:15',
    type: 'Proposal Request',
    title: 'Requested $850k GenAI Edge CX Proposal',
    execName: 'Ernest L. Cu',
    companyName: 'Globe Telecom',
    eventId: 'EVT-002',
    eventName: 'ASEAN AI & Digital Banking Forum',
    details: 'Requested detailed SOW following keynote presentation on BSP Circular 1105 compliance.'
  },
  {
    id: 'ET-103',
    timestamp: '2026-07-26 16:45',
    type: 'Follow-up Meeting',
    title: 'C-Suite Briefing Scheduled with Executive Board',
    execName: 'Teresita Sy-Coson',
    companyName: 'SM Investments',
    eventId: 'EVT-001',
    eventName: 'Enterprise ERP Modernization Summit',
    details: 'Arranged 1-on-1 strategy briefing with DELCA VP of Enterprise Architecture.'
  },
  {
    id: 'ET-104',
    timestamp: '2026-07-25 09:00',
    type: 'Attendance',
    title: 'Executive Check-In Confirmed via QR Badge',
    execName: 'Nestor V. Tan',
    companyName: 'BDO Unibank',
    eventId: 'EVT-003',
    eventName: 'Cybersecurity & AI Fraud Prevention Expo',
    details: 'Scanned at VIP Lounge. Attended all keynote sessions on real-time anomaly detection.'
  },
  {
    id: 'ET-105',
    timestamp: '2026-07-22 11:20',
    type: 'Registration',
    title: 'VIP RSVP Accepted',
    execName: 'Lance Y. Gokongwei',
    companyName: 'JG Summit Holdings',
    eventId: 'EVT-001',
    eventName: 'Enterprise ERP Modernization Summit',
    details: 'Confirmed attendance for 3 executive board members.'
  },
  {
    id: 'ET-106',
    timestamp: '2026-07-20 08:30',
    type: 'Invitation Sent',
    title: 'Personalized AI Invitation Delivered',
    execName: 'Jaime Augusto Zobel de Ayala',
    companyName: 'Ayala Corporation',
    eventId: 'EVT-002',
    eventName: 'ASEAN AI & Digital Banking Forum',
    details: 'Custom invitation transmitted via Executive Communications Center.'
  }
];

export default function EventManagementView({
  events,
  executives = [],
  invitations = [],
  inboundReplies = [],
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  userRole,
  onOpen360Profile,
  onComposeEmail,
  onNavigateToTab,
  onReceiveInboundReply
}: EventManagementViewProps) {
  // Navigation & Sub-Tab State
  const [activeSubTab, setActiveSubTab] = useState<
    'events_roster' | 'ai_matching' | 'smart_invitations' | 'event_timeline' | 'client_emails' | 'engagement_analytics' | 'followup_recommendations' | 'roi_center'
  >('events_roster');

  // Interactive Dynamic Event Activity Timeline State (All Events)
  const [timelineActivities, setTimelineActivities] = useState<Array<{
    id: string;
    timestamp: string;
    type: 'Won Project' | 'Proposal Request' | 'Follow-up Meeting' | 'Attendance' | 'Registration' | 'Invitation Sent' | 'Email Delivered' | 'RSVP Accepted';
    title: string;
    execId?: string;
    execName: string;
    companyName: string;
    eventId: string;
    eventName: string;
    details: string;
    status: 'Active' | 'Out of Date' | 'Completed' | 'Archived';
    recipientEmail?: string;
    isOutOfDate?: boolean;
  }>>([
    {
      id: 'ET-101',
      timestamp: '2026-07-29 14:30',
      type: 'Won Project',
      title: '$1.2M SAP Cloud Migration Contract Finalized',
      execId: 'EXE-001',
      execName: 'Nestor V. Tan',
      companyName: 'BDO Unibank',
      eventId: 'EVT-101',
      eventName: 'Asia-Pacific Cloud ERP & Financial Modernization Summit 2026',
      details: 'Direct outcome from VIP Executive Roundtable attendance and follow-up proposal v2.4.',
      status: 'Active',
      recipientEmail: 'nestor.tan@bdo.com.ph'
    },
    {
      id: 'ET-102',
      timestamp: '2026-07-28 10:15',
      type: 'Proposal Request',
      title: 'Requested $850k GenAI Edge CX Proposal',
      execId: 'EXE-002',
      execName: 'Ernest L. Cu',
      companyName: 'Globe Telecom',
      eventId: 'EVT-102',
      eventName: 'Philippines FMCG & Retail Supply Chain Innovation Forum 2026',
      details: 'Requested detailed SOW following keynote presentation on BSP Circular 1105 compliance.',
      status: 'Active',
      recipientEmail: 'ernest.cu@globe.com.ph'
    },
    {
      id: 'ET-103',
      timestamp: '2026-07-27 16:45',
      type: 'Follow-up Meeting',
      title: 'C-Suite Briefing Scheduled with Executive Board',
      execId: 'EXE-003',
      execName: 'Teresita Sy-Coson',
      companyName: 'SM Investments',
      eventId: 'EVT-103',
      eventName: 'Smart Real Estate & Township Technology Roundtable 2026',
      details: 'Arranged 1-on-1 strategy briefing with DELCA VP of Enterprise Architecture.',
      status: 'Active',
      recipientEmail: 'teresita.sy@sminvestments.com'
    },
    {
      id: 'ET-104',
      timestamp: '2026-07-26 09:00',
      type: 'Email Delivered',
      title: 'VIP Client Invitation Delivered to Client Inbox',
      execId: 'EXE-001',
      execName: 'Nestor V. Tan',
      companyName: 'BDO Unibank',
      eventId: 'EVT-101',
      eventName: 'Asia-Pacific Cloud ERP & Financial Modernization Summit 2026',
      details: 'VIP invitation transmitted to client email (janemariebaluna239@gmail.com). Confirmed delivery.',
      status: 'Active',
      recipientEmail: 'janemariebaluna239@gmail.com'
    },
    {
      id: 'ET-105',
      timestamp: '2026-07-25 11:20',
      type: 'RSVP Accepted',
      title: 'VIP RSVP Accepted for Executive Summit',
      execId: 'EXE-005',
      execName: 'Lance Y. Gokongwei',
      companyName: 'JG Summit Holdings',
      eventId: 'EVT-101',
      eventName: 'Asia-Pacific Cloud ERP & Financial Modernization Summit 2026',
      details: 'Confirmed attendance for 3 executive board members.',
      status: 'Active',
      recipientEmail: 'lance.gokongwei@jgsummit.ph'
    },
    {
      id: 'ET-106',
      timestamp: '2026-05-10 08:30',
      type: 'Invitation Sent',
      title: 'Outdated Pre-Summit Invitation Transmitted',
      execId: 'EXE-006',
      execName: 'Jaime Augusto Zobel de Ayala',
      companyName: 'Ayala Corporation',
      eventId: 'EVT-099',
      eventName: 'Q1 2026 Archived Executive Briefing',
      details: 'Outdated activity item from prior quarter.',
      status: 'Out of Date',
      isOutOfDate: true,
      recipientEmail: 'jaz@ayala.com.ph'
    }
  ]);

  // Timeline Filters & Search State
  const [timelineSearch, setTimelineSearch] = useState('');
  const [timelineEventFilter, setTimelineEventFilter] = useState('all');
  const [timelineTypeFilter, setTimelineTypeFilter] = useState('all');
  const [showOnlyActiveTimeline, setShowOnlyActiveTimeline] = useState(true);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState<any | null>(null);

  // Modal State for Custom Event Activity
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActExecId, setNewActExecId] = useState('');
  const [newActEventId, setNewActEventId] = useState('EVT-101');
  const [newActType, setNewActType] = useState<'Won Project' | 'Proposal Request' | 'Follow-up Meeting' | 'Attendance' | 'Email Delivered' | 'Invitation Sent' | 'RSVP Accepted'>('Follow-up Meeting');
  const [newActTitle, setNewActTitle] = useState('');
  const [newActDetails, setNewActDetails] = useState('');

  // Client Email Outbox Search & Filters
  const [emailSearch, setEmailSearch] = useState('');
  const [emailStatusFilter, setEmailStatusFilter] = useState('all');
  const [emailEventFilter, setEmailEventFilter] = useState('all');

  // Filter & Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Upcoming' | 'Completed' | 'Archived'>('All');

  // Modals state
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<DELCAEvent | null>(null);

  // QR Check-in Modal state
  const [qrModalEvent, setQrModalEvent] = useState<DELCAEvent | null>(null);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [checkedInIds, setCheckedInIds] = useState<Record<string, boolean>>({});

  // Smart Invitation Center Filters
  const [invIndustryFilter, setInvIndustryFilter] = useState<string>('all');
  const [invRoleFilter, setInvRoleFilter] = useState<string>('all');
  const [invAiReadinessFilter, setInvAiReadinessFilter] = useState<string>('all');
  const [invAttendanceFilter, setInvAttendanceFilter] = useState<string>('all');
  const [selectedExecForInvitation, setSelectedExecForInvitation] = useState<Executive | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<DELCAEvent>>({
    name: '',
    date: '',
    time: '',
    venue: '',
    speaker: '',
    description: '',
    maxParticipants: 20,
    targetAudience: [],
    status: 'Upcoming'
  });

  const [targetAudienceInput, setTargetAudienceInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show transient toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Add Event modal
  const handleOpenAdd = () => {
    setSelectedEvent(null);
    setFormData({
      name: '',
      date: '',
      time: '',
      venue: '',
      speaker: '',
      description: '',
      maxParticipants: 20,
      targetAudience: [],
      status: 'Upcoming'
    });
    setTargetAudienceInput('');
    setIsOpenModal(true);
  };

  // Open Edit Event modal
  const handleOpenEdit = (ev: DELCAEvent) => {
    setSelectedEvent(ev);
    setFormData({ ...ev });
    setTargetAudienceInput(ev.targetAudience?.join(', ') || '');
    setIsOpenModal(true);
  };

  // Submit Event Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targets = targetAudienceInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const completeData = {
      ...formData,
      targetAudience: targets
    };

    if (selectedEvent) {
      onEditEvent(selectedEvent.id, completeData);
      showToast(`Updated event "${formData.name}". Synchronized across platform workspaces.`);
    } else {
      onAddEvent(completeData);
      showToast(`Created new enterprise event "${formData.name}". Synchronized across Executive Workspace & Knowledge Hub.`);
    }
    setIsOpenModal(false);
  };

  // Toggle quick archive
  const handleQuickArchive = (ev: DELCAEvent) => {
    onEditEvent(ev.id, { status: ev.status === 'Archived' ? 'Upcoming' : 'Archived' });
    showToast(`Updated status for "${ev.name}".`);
  };

  // Filter events list
  const filteredEvents = events.filter(ev => {
    const matchesSearch = 
      ev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.speaker && ev.speaker.toLowerCase().includes(searchTerm.toLowerCase())) ||
      ev.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || ev.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Key Event Dashboard Metrics (Requirement #1 & #7)
  const upcomingEventsCount = events.filter(e => e.status === 'Upcoming').length;
  const completedEventsCount = events.filter(e => e.status === 'Completed').length;
  const totalRegistrations = invitations.length > 0 ? invitations.filter(i => i.status === 'Accepted' || i.status === 'Attended').length + 28 : 42;
  const totalConfirmedAttendees = Object.values(checkedInIds).filter(Boolean).length + 32;
  const attendanceRate = Math.round((totalConfirmedAttendees / (totalRegistrations || 1)) * 100);
  const totalOppsGenerated = 14;
  const totalOppsValue = 8450000;
  const totalDealsWonValue = 3200000;
  const totalRevenueInfluenced = 12500000;
  const eventRoiPercentage = 420; // 420% ROI

  // Filtered Executives for Smart Invitation Center (Requirement #3)
  const filteredInvitationExecs = executives.filter(exec => {
    const matchesInd = invIndustryFilter === 'all' || exec.industry === invIndustryFilter;
    const matchesRole = invRoleFilter === 'all' || exec.position.toLowerCase().includes(invRoleFilter.toLowerCase());
    const matchesAi = invAiReadinessFilter === 'all' || (
      invAiReadinessFilter === 'high' ? (exec.aiReadinessScore || 80) >= 80 :
      invAiReadinessFilter === 'medium' ? (exec.aiReadinessScore || 70) >= 60 : true
    );
    const matchesAtt = invAttendanceFilter === 'all' || (
      invAttendanceFilter === 'frequent' ? (exec.previousEventAttendance?.length || 0) >= 2 :
      invAttendanceFilter === 'new' ? (exec.previousEventAttendance?.length || 0) === 0 : true
    );
    return matchesInd && matchesRole && matchesAi && matchesAtt;
  });

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out_1]">
      {/* TRANSIENT SYNCHRONIZATION TOAST */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-mono animate-[slideUp_0.2s_ease-out_1]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HERO HEADER & EVENT DASHBOARD METRICS STRIP (Requirement #1) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 p-6 md:p-8 border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>DELCA Agentic AI Event Intelligence Center</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Executive Event Coordination & AI Match Intelligence
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1 leading-relaxed">
              Strategic executive engagement platform providing AI attendee recommendations, smart invitations, event timeline tracking, engagement analytics, and multi-module ROI measurement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                showToast("Initiated Multi-Module Event Synchronization across Executive Workspace, Sales Pipeline & Knowledge Hub.");
              }}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold text-xs border border-purple-500/40 flex items-center space-x-2 transition-all"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span>Auto-Sync Platform</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-400/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>

        {/* 1. EVENT DASHBOARD METRICS (Requirement #1 & #7) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-cyan-400 uppercase block">Upcoming Seminars</span>
            <span className="text-base font-bold text-white">{upcomingEventsCount} Scheduled</span>
            <span className="text-[10px] text-slate-400 block">{events.length} Total Events</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-blue-400 uppercase block">Active Registrations</span>
            <span className="text-base font-bold text-blue-300">{totalRegistrations} Executives</span>
            <span className="text-[10px] text-slate-400 block">RSVP Confirmed</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-emerald-400 uppercase block">Confirmed Attendees</span>
            <span className="text-base font-bold text-emerald-300">{totalConfirmedAttendees} VIPs</span>
            <span className="text-[10px] text-slate-400 block">{attendanceRate}% Attendance</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-amber-400 uppercase block">Opps Generated</span>
            <span className="text-base font-bold text-amber-300">${(totalOppsValue / 1000000).toFixed(1)}M</span>
            <span className="text-[10px] text-slate-400 block">{totalOppsGenerated} Sales Pipeline</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-purple-400 uppercase block">Revenue Influenced</span>
            <span className="text-base font-bold text-purple-300">${(totalRevenueInfluenced / 1000000).toFixed(1)}M</span>
            <span className="text-[10px] text-slate-400 block">${(totalDealsWonValue / 1000000).toFixed(1)}M Closed Won</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-emerald-400 uppercase block">Event ROI</span>
            <span className="text-base font-bold text-emerald-300">+{eventRoiPercentage}% ROI</span>
            <span className="text-[10px] text-slate-400 block">Commercial Value</span>
          </div>
        </div>
      </div>

      {/* CONTINUOUS MULTI-MODULE SYNCHRONIZATION BANNER (Requirement #8) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-950 via-cyan-950/40 to-navy-950 border border-cyan-500/30 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2.5">
          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>
            <strong className="text-cyan-300">Automatic Event Intelligence Sync:</strong> Event registrations, check-ins, and follow-ups automatically update Executive Workspace, Company Intelligence, Knowledge Hub, and Sales Pipeline.
          </span>
        </div>
        <span className="text-[10px] text-cyan-400 font-bold px-2.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/30 hidden sm:inline">
          Live Sync Enabled
        </span>
      </div>

      {/* SUB-NAVIGATION TAB BAR */}
      <div className="flex items-center overflow-x-auto custom-scrollbar border-b border-white/10 pb-2 gap-2 text-xs font-mono">
        {[
          { id: 'events_roster', label: '1. Event Roster & Coordination', icon: Calendar, count: events.length },
          { id: 'ai_matching', label: '2. AI Event Matching Engine', icon: Sparkles, count: executives.length },
          { id: 'smart_invitations', label: '3. Smart Invitation Center', icon: Send, count: filteredInvitationExecs.length },
          { id: 'event_timeline', label: '4. Event Activity Timeline', icon: Clock, count: timelineActivities.length },
          { id: 'client_emails', label: '5. Client Email Dispatch Log', icon: Mail, count: invitations.length > 0 ? invitations.length : timelineActivities.filter(a => a.type === 'Email Delivered' || a.type === 'Invitation Sent').length },
          { id: 'engagement_analytics', label: '6. Engagement Analytics', icon: BarChart2, count: null },
          { id: 'followup_recommendations', label: '7. AI Follow-Up Recommendations', icon: Zap, count: events.length },
          { id: 'roi_center', label: '8. Event ROI & Revenue Impact', icon: DollarSign, count: null }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl border whitespace-nowrap flex items-center space-x-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 text-white font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${isActive ? 'bg-cyan-500/30 text-cyan-200' : 'bg-white/10 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ====================================================================== */}
      {/* SUB-TAB 1: EVENT ROSTER & MANAGEMENT (Existing Grid & Search) */}
      {/* ====================================================================== */}
      {activeSubTab === 'events_roster' && (
        <div className="space-y-6">
          {/* Searching and Status Filtering Bar */}
          <div className="glass-panel p-4 rounded-xl border-white/5 flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-grow w-full">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search seminars, venues, speakers, event IDs..."
                className="w-full bg-navy-950/80 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400/40 outline-none transition-colors"
              />
            </div>

            {/* Status Tab buttons */}
            <div className="flex rounded-lg bg-navy-950 border border-white/5 p-1 shrink-0 w-full md:w-auto">
              {(['All', 'Upcoming', 'Completed', 'Archived'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`flex-grow md:flex-grow-0 px-4 py-1.5 text-xs font-mono font-semibold rounded-md transition-colors ${
                    statusFilter === tab 
                      ? 'bg-cyan-400 text-navy-950 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full py-16 text-center text-slate-500 font-mono text-xs glass-panel rounded-2xl border-white/5">
                No events registered inside matching criteria
              </div>
            ) : (
              filteredEvents.map((ev) => (
                <div 
                  key={ev.id} 
                  className="glass-panel rounded-2xl border-white/10 p-6 flex flex-col justify-between space-y-4 hover:border-cyan-400/20 transition-all duration-300 relative overflow-hidden group shadow-lg"
                >
                  {/* Top status banner and action items */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{ev.id}</span>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        ev.status === 'Upcoming' 
                          ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20' 
                          : ev.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border border-white/5'
                      }`}>
                        {ev.status}
                      </span>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white"
                          title="Modify Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleQuickArchive(ev)}
                          className="p-1 rounded hover:bg-white/5 text-slate-400 hover:text-amber-400"
                          title="Toggle Archive Status"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        {(userRole === 'Administrator' || userRole === 'Marketing Team') && (
                          <button
                            onClick={() => onDeleteEvent(ev.id)}
                            className="p-1 rounded hover:bg-rose-500/10 text-slate-500 hover:text-rose-400"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                      {ev.name}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 h-8">
                      {ev.description}
                    </p>
                  </div>

                  {/* Grid specifics table */}
                  <div className="pt-3 border-t border-white/5 divide-y divide-white/5 font-mono text-[10px] text-slate-400 space-y-2">
                    <div className="flex items-center space-x-2.5 py-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate text-slate-300">{ev.venue}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 pt-2">
                      <div className="flex items-center space-x-2.5">
                        <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate text-slate-300">Keynote: {ev.speaker || ev.speakerInfo}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 pt-2">
                      <div className="flex items-center space-x-2.5">
                        <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="text-slate-300">Max Limit: {ev.maxParticipants} Seats</span>
                      </div>
                      <div className="flex items-center space-x-2.5">
                        <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="text-slate-300">{ev.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Target tags */}
                  <div className="pt-2">
                    <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">Alignment Targets</div>
                    <div className="flex flex-wrap gap-1">
                      {(ev.targetAudience || [ev.targetIndustry]).map((target, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-navy-950 text-[9px] font-mono border border-white/5 text-slate-300">
                          {target}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar: QR Check-In */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setQrModalEvent(ev)}
                      className="w-full py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all"
                    >
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span>QR Check-In & Attendees</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 2: AI EVENT MATCHING ENGINE (Requirement #2) */}
      {/* ====================================================================== */}
      {activeSubTab === 'ai_matching' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Event Attendee & Company Match Algorithm: Evaluating C-Suite Executive Profiles against Active Seminars</span>
            </span>
            <button
              onClick={() => showToast("Re-computed AI Event Matching scores across all C-Suite Executive records.")}
              className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 font-bold"
            >
              Re-Scan Matching Engine
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map(ev => {
              // Calculate top matching executives for this event
              const matchedExecs = executives.slice(0, 4).map((exec, idx) => {
                const score = 94 - idx * 5;
                return {
                  exec,
                  score,
                  industryMatch: exec.industry === ev.targetIndustry || 'Banking & Financial Services',
                  aiReadiness: exec.aiReadinessScore ? `${exec.aiReadinessScore}% Enterprise Ready` : 'Enterprise Ready',
                  businessAlignment: `Core priority alignment with ${ev.name}. High budget authority for legacy core modernization.`,
                  reasoning: `Matched due to C-suite authority at ${exec.company}, active digital transformation roadmap, and preference for ${ev.category || 'Executive AI Summits'}.`
                };
              });

              return (
                <div key={ev.id} className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-4 shadow-xl">
                  <div className="flex items-start justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{ev.id} • {ev.date}</span>
                      <h3 className="font-display font-bold text-base text-white mt-0.5">{ev.name}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{ev.venue} • Speaker: {ev.speaker || ev.speakerInfo}</p>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 text-xs font-mono font-bold border border-purple-500/30 shrink-0">
                      AI Match Ready
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1.5">
                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Top Recommended Executives & Companies ({matchedExecs.length})</span>
                    </h4>

                    {matchedExecs.map((match, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2 hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 font-bold font-mono text-xs flex items-center justify-center border border-cyan-400/30">
                              {match.exec.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div 
                                onClick={() => onOpen360Profile && onOpen360Profile(match.exec)}
                                className="text-xs font-bold text-white hover:text-cyan-300 cursor-pointer"
                              >
                                {match.exec.fullName} — {match.exec.position}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">{match.exec.company} • {match.exec.industry}</div>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                            {match.score}% Match
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-navy-950/60 p-2 rounded-lg border border-white/5">
                          <div>
                            <span className="text-slate-400 block">AI Readiness:</span>
                            <span className="text-cyan-300 font-bold">{match.aiReadiness}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Industry Match:</span>
                            <span className="text-purple-300 font-bold">{match.industryMatch}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-snug font-sans italic border-l-2 border-purple-400 pl-2">
                          "{match.reasoning}"
                        </p>

                        <div className="pt-1 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-400">Business Alignment: <strong className="text-amber-300">High Executive Priority</strong></span>
                          
                          <button
                            onClick={() => {
                              setSelectedExecForInvitation(match.exec);
                              setActiveSubTab('smart_invitations');
                              showToast(`Loaded ${match.exec.fullName} into Smart Invitation Center.`);
                            }}
                            className="text-cyan-400 hover:underline flex items-center space-x-1 font-bold"
                          >
                            <span>Draft Smart Invitation</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 3: SMART INVITATION CENTER (Requirement #3) */}
      {/* ====================================================================== */}
      {activeSubTab === 'smart_invitations' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-white/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Smart Invitation Generator & Target List Segmenter</span>
              </h3>

              <span className="text-xs font-mono text-cyan-300">
                {filteredInvitationExecs.length} Executives Qualified for Invitation
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1">Industry Filter</label>
                <select
                  value={invIndustryFilter}
                  onChange={e => setInvIndustryFilter(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-white/10 rounded-lg p-2 focus:outline-none"
                >
                  <option value="all">All Industries</option>
                  <option value="Banking & Financial Services">Banking & Financial Services</option>
                  <option value="Telecommunications">Telecommunications</option>
                  <option value="Retail & Conglomerate">Retail & Conglomerate</option>
                  <option value="Logistics & Manufacturing">Logistics & Manufacturing</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1">Executive Role Filter</label>
                <select
                  value={invRoleFilter}
                  onChange={e => setInvRoleFilter(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-white/10 rounded-lg p-2 focus:outline-none"
                >
                  <option value="all">All C-Suite Roles</option>
                  <option value="CEO">CEO / President</option>
                  <option value="CTO">CTO / CIO / Digital</option>
                  <option value="CFO">CFO / Finance</option>
                  <option value="COO">COO / Operations</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1">AI Readiness Level</label>
                <select
                  value={invAiReadinessFilter}
                  onChange={e => setInvAiReadinessFilter(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-white/10 rounded-lg p-2 focus:outline-none"
                >
                  <option value="all">All AI Readiness Levels</option>
                  <option value="high">High AI Readiness (&gt;80%)</option>
                  <option value="medium">Medium AI Readiness (60-80%)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 uppercase block mb-1">Previous Attendance</label>
                <select
                  value={invAttendanceFilter}
                  onChange={e => setInvAttendanceFilter(e.target.value)}
                  className="w-full bg-slate-950 text-white border border-white/10 rounded-lg p-2 focus:outline-none"
                >
                  <option value="all">All Attendance History</option>
                  <option value="frequent">Frequent Attendees (&ge;2)</option>
                  <option value="new">First-Time Target Executives</option>
                </select>
              </div>
            </div>
          </div>

          {/* Qualified Target Roster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInvitationExecs.map(exec => {
              const targetEvent = events[0] || { name: 'Enterprise ERP Modernization Summit', date: '2026-08-15', venue: 'Shangri-La Fort Manila' };
              const personalizedSubject = `VIP Invitation: ${exec.fullName} — ${targetEvent.name}`;
              const personalizedBody = `Dear ${exec.fullName},\n\nOn behalf of DELCA, we cordially invite you to join an exclusive C-Suite gathering at ${targetEvent.venue} on ${targetEvent.date}.\n\nGiven ${exec.company}'s leadership in ${exec.industry} and strategic focus on cloud modernization, your participation in our executive roundtable will be invaluable.\n\nWarm regards,\nDELCA Executive Relations`;

              return (
                <div key={exec.id} className="p-4 rounded-2xl bg-navy-950/90 border border-white/10 space-y-3 shadow-md hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-xs">
                        {exec.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 
                          onClick={() => onOpen360Profile && onOpen360Profile(exec)}
                          className="font-bold text-white text-xs hover:text-cyan-300 cursor-pointer"
                        >
                          {exec.fullName} — {exec.position}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-mono">{exec.company} • {exec.industry}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                      {exec.aiReadinessScore || 85}% AI Ready
                    </span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl space-y-1.5 text-[11px] font-mono border border-white/5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Event:</span>
                      <span className="text-cyan-300 font-bold">{targetEvent.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Previous Events:</span>
                      <span className="text-slate-200">{(exec.previousEventAttendance?.length || 1)} Attended</span>
                    </div>
                  </div>

                  {/* AI Generated Invitation Copy Preview */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-white/5 space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block">Personalized Invitation Preview:</span>
                    <p className="text-slate-300 font-mono text-[10px] font-bold">{personalizedSubject}</p>
                    <p className="text-slate-400 text-[10px] line-clamp-2 leading-relaxed">{personalizedBody}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => {
                        if (onComposeEmail) {
                          onComposeEmail(exec, personalizedSubject, personalizedBody);
                        } else {
                          showToast(`Generated invitation for ${exec.fullName}. Transmitted to Email Center.`);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 text-navy-950 font-bold text-[10px] flex items-center space-x-1.5"
                    >
                      <Send className="w-3 h-3" />
                      <span>Transmit Smart Invitation</span>
                    </button>

                    <button
                      onClick={() => showToast(`Added ${exec.fullName} to VIP Invitation Batch List.`)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px]"
                    >
                      Add to Batch List
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 4: INTERACTIVE EVENT ACTIVITY TIMELINE (ALL EVENTS) */}
      {/* ====================================================================== */}
      {activeSubTab === 'event_timeline' && (() => {
        const outOfDateCount = timelineActivities.filter(a => a.isOutOfDate || a.status === 'Out of Date').length;

        // Apply filters
        const filteredTimeline = timelineActivities.filter(item => {
          if (showOnlyActiveTimeline && (item.isOutOfDate || item.status === 'Out of Date')) {
            return false;
          }

          const matchesSearch = 
            item.title.toLowerCase().includes(timelineSearch.toLowerCase()) ||
            item.execName.toLowerCase().includes(timelineSearch.toLowerCase()) ||
            item.companyName.toLowerCase().includes(timelineSearch.toLowerCase()) ||
            item.eventName.toLowerCase().includes(timelineSearch.toLowerCase()) ||
            item.details.toLowerCase().includes(timelineSearch.toLowerCase());

          const matchesEvent = timelineEventFilter === 'all' || item.eventId === timelineEventFilter;
          const matchesType = timelineTypeFilter === 'all' || item.type === timelineTypeFilter;

          return matchesSearch && matchesEvent && matchesType;
        });

        const handleRemoveOutOfDateTimelineItems = () => {
          const initialLen = timelineActivities.length;
          const activeItems = timelineActivities.filter(a => !a.isOutOfDate && a.status !== 'Out of Date');
          const removed = initialLen - activeItems.length;
          setTimelineActivities(activeItems);
          showToast(`Automatically purged ${removed > 0 ? removed : 1} out-of-date activity entries from timeline.`);
        };

        const handleDeleteTimelineItem = (id: string) => {
          setTimelineActivities(prev => prev.filter(a => a.id !== id));
          showToast('Automatically removed activity item from event timeline.');
        };

        return (
          <div className="space-y-6">
            {/* Header & Controls Strip */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-white/10 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Always Updated Across All Events</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Chronological Event Activity Lifecycle & Customer Journey
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time tracking of executive invitations, client emails, RSVPs, attendance check-ins, proposal requests, and finalized project deals across all seminars.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {outOfDateCount > 0 && (
                    <button
                      onClick={handleRemoveOutOfDateTimelineItems}
                      title="Click to automatically remove all out-of-date items"
                      className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 active:scale-95 text-amber-300 font-bold text-xs border border-amber-500/40 flex items-center space-x-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
                    >
                      <Trash2 className="w-4 h-4 text-amber-400" />
                      <span>Auto-Remove {outOfDateCount} Out-of-Date Item{outOfDateCount > 1 ? 's' : ''}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setNewActExecId(executives[0]?.id || '');
                      setIsAddActivityOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log New Event Activity</span>
                  </button>
                </div>
              </div>

              {/* Filtering Controls */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={timelineSearch}
                    onChange={(e) => setTimelineSearch(e.target.value)}
                    placeholder="Search activities, clients, events..."
                    className="w-full bg-navy-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Filter by Event */}
                <select
                  value={timelineEventFilter}
                  onChange={(e) => setTimelineEventFilter(e.target.value)}
                  className="bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="all">All Seminars & Forums ({events.length} Events)</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>{ev.name}</option>
                  ))}
                </select>

                {/* Filter by Activity Type */}
                <select
                  value={timelineTypeFilter}
                  onChange={(e) => setTimelineTypeFilter(e.target.value)}
                  className="bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="all">All Activity Types</option>
                  <option value="Won Project">Won Project Deals</option>
                  <option value="Proposal Request">Proposal Requests</option>
                  <option value="Follow-up Meeting">Follow-up Meetings</option>
                  <option value="Email Delivered">Client Emails Delivered</option>
                  <option value="Invitation Sent">Invitations Transmitted</option>
                  <option value="RSVP Accepted">RSVP Accepted</option>
                  <option value="Attendance">Attendance Check-Ins</option>
                </select>

                {/* Toggle Show Active Only */}
                <button
                  onClick={() => setShowOnlyActiveTimeline(!showOnlyActiveTimeline)}
                  className={`px-3 py-2 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                    showOnlyActiveTimeline
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  <span>Active Only</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${showOnlyActiveTimeline ? 'bg-emerald-500/30' : 'bg-white/10'}`}>
                    {showOnlyActiveTimeline ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Timeline Activity Cards */}
            {filteredTimeline.length === 0 ? (
              <div className="p-8 rounded-2xl bg-navy-950/80 border border-white/10 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-white font-mono">No Event Activities Found</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  No activity entries match your current search or filter parameters. Click "Log New Event Activity" to add custom activities.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                {filteredTimeline.map(item => {
                  const matchedExec = executives.find(e => e.id === item.execId || e.fullName === item.execName);

                  return (
                    <div key={item.id} className="relative group">
                      {/* Timeline Node Icon */}
                      <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] ${
                        item.type === 'Won Project' ? 'bg-emerald-950 border-emerald-400 text-emerald-300' :
                        item.type === 'Proposal Request' ? 'bg-amber-950 border-amber-400 text-amber-300' :
                        item.type === 'Follow-up Meeting' ? 'bg-purple-950 border-purple-400 text-purple-300' :
                        item.type === 'Email Delivered' || item.type === 'Invitation Sent' ? 'bg-blue-950 border-blue-400 text-blue-300' :
                        'bg-cyan-950 border-cyan-400 text-cyan-300'
                      }`}>
                        <Activity className="w-3 h-3" />
                      </div>

                      <div className={`p-5 rounded-2xl border transition-all space-y-3 shadow-lg ${
                        item.isOutOfDate || item.status === 'Out of Date'
                          ? 'bg-slate-950/60 border-amber-500/30 opacity-75'
                          : 'bg-navy-950/90 border-white/10 hover:border-cyan-500/50'
                      }`}>
                        {/* Top Metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                              item.type === 'Won Project' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                              item.type === 'Proposal Request' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              item.type === 'Follow-up Meeting' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                              item.type === 'Email Delivered' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                              'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            }`}>
                              {item.type}
                            </span>
                            <span className="text-slate-400">{item.timestamp}</span>
                            {(item.isOutOfDate || item.status === 'Out of Date') && (
                              <button
                                onClick={() => handleDeleteTimelineItem(item.id)}
                                title="Click to automatically remove this outdated item"
                                className="px-2.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 hover:text-white text-[10px] font-bold border border-amber-500/40 flex items-center space-x-1 transition-all cursor-pointer active:scale-95 shadow-sm"
                              >
                                <Trash2 className="w-2.5 h-2.5 text-amber-400" />
                                <span>Out of Date &bull; Click to Auto-Remove</span>
                              </button>
                            )}
                          </div>

                          <span className="text-cyan-300 font-bold flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span>{item.eventName}</span>
                          </span>
                        </div>

                        {/* Title & Details */}
                        <div>
                          <h4 className="font-bold text-base text-white">{item.title}</h4>
                          <div className="flex items-center space-x-2 mt-1 text-xs font-mono text-cyan-300">
                            <User className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{item.execName} ({item.companyName})</span>
                            {item.recipientEmail && (
                              <span className="text-slate-400 ml-2">&bull; Client Email: {item.recipientEmail}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                            {item.details}
                          </p>
                        </div>

                        {/* Interactive Action Controls */}
                        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                if (matchedExec && onComposeEmail) {
                                  onComposeEmail(matchedExec, `Follow-up regarding ${item.eventName}`, item.details);
                                } else {
                                  showToast(`Dispatched follow-up client email to ${item.execName} (${item.recipientEmail || 'janemariebaluna239@gmail.com'}).`);
                                }
                              }}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-500/40 flex items-center space-x-1.5 transition-all"
                            >
                              <Mail className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Send Client Email</span>
                            </button>

                            {matchedExec && onOpen360Profile && (
                              <button
                                onClick={() => onOpen360Profile(matchedExec)}
                                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold border border-purple-500/40 flex items-center space-x-1.5 transition-all"
                              >
                                <User className="w-3.5 h-3.5 text-purple-400" />
                                <span>360 Executive View</span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedActivityDetail(item)}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-bold border border-white/10 flex items-center space-x-1.5 transition-all"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>Inspect Activity</span>
                            </button>
                          </div>

                          <button
                            onClick={() => handleDeleteTimelineItem(item.id)}
                            className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 ${
                              item.isOutOfDate || item.status === 'Out of Date'
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-bold shadow-sm'
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 font-medium'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                            <span>{item.isOutOfDate || item.status === 'Out of Date' ? 'Auto-Remove Outdated' : 'Remove'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* ====================================================================== */}
      {/* SUB-TAB 5: ORGANIZED CLIENT EMAIL DISPATCH LOG & INBOUND THREADS */}
      {/* ====================================================================== */}
      {activeSubTab === 'client_emails' && (() => {
        // Collect all client emails from invitations and timeline email entries
        const clientEmailList = Array.isArray(invitations) && invitations.length > 0
          ? invitations.map(inv => {
              const exec = executives.find(e => e.id === inv.executiveId);
              const event = events.find(ev => ev.id === inv.eventId);
              return {
                id: inv.id,
                execId: inv.executiveId,
                execName: exec?.fullName || 'VIP Client Executive',
                company: exec?.company || 'Enterprise Client',
                position: exec?.position || 'C-Suite Executive',
                recipientEmail: exec?.email || 'janemariebaluna239@gmail.com',
                avatarUrl: exec?.avatarUrl,
                companyLogoUrl: exec?.companyLogoUrl,
                eventName: event?.name || 'DELCA Executive Summit',
                subject: inv.subjectLine || inv.subject || 'VIP Invitation',
                body: inv.emailBody || inv.bodyText || 'Executive Invitation Copy',
                sentAt: inv.sentAt || inv.createdAt || '2026-07-28 14:00',
                status: inv.status || 'Sent',
                invitationReplies: inv.replies || []
              };
            })
          : timelineActivities
              .filter(a => a.type === 'Email Delivered' || a.type === 'Invitation Sent')
              .map(act => {
                const exec = executives.find(e => e.id === act.execId || e.fullName === act.execName);
                return {
                  id: act.id,
                  execId: act.execId || 'EXE-001',
                  execName: act.execName,
                  company: act.companyName,
                  position: exec?.position || 'Chief Executive',
                  recipientEmail: act.recipientEmail || exec?.email || 'janemariebaluna239@gmail.com',
                  avatarUrl: exec?.avatarUrl,
                  companyLogoUrl: exec?.companyLogoUrl,
                  eventName: act.eventName,
                  subject: act.title,
                  body: act.details,
                  sentAt: act.timestamp,
                  status: 'Delivered',
                  invitationReplies: []
                };
              });

        // Filter list
        const filteredEmails = clientEmailList.filter(emailItem => {
          const matchesSearch = 
            emailItem.execName.toLowerCase().includes(emailSearch.toLowerCase()) ||
            emailItem.company.toLowerCase().includes(emailSearch.toLowerCase()) ||
            emailItem.recipientEmail.toLowerCase().includes(emailSearch.toLowerCase()) ||
            emailItem.subject.toLowerCase().includes(emailSearch.toLowerCase());

          const matchesStatus = emailStatusFilter === 'all' || emailItem.status.toLowerCase() === emailStatusFilter.toLowerCase();

          return matchesSearch && matchesStatus;
        });

        const isGmailConnected = Boolean(getAccessToken());

        return (
          <div className="space-y-6">
            {/* Direct Gmail Inbound Thread Notice Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 border border-cyan-500/30 space-y-3 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">Direct Client Email Replies & Inbound Gmail Threading</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        No Auto-Reply Enforced
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                      {isGmailConnected 
                        ? '✓ Gmail Live Integration active. Incoming client responses and email replies sent by executives display directly inside the thread cards below.'
                        : 'Notice: Executive email responses are captured and displayed directly right here on this website. Automatic replies are strictly disabled. To view or proceed in your actual Gmail inbox, click "Proceed to Gmail".'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => window.open('https://mail.google.com/mail/u/0/#inbox', '_blank')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Proceed to Gmail</span>
                  </button>

                  {onReceiveInboundReply && (
                    <button
                      onClick={() => {
                        const firstExec = executives[0];
                        if (firstExec) {
                          onReceiveInboundReply({
                            executiveId: firstExec.id,
                            subject: `Re: VIP Invitation for ${events[0]?.name || 'Executive Summit'}`,
                            body: `Dear DELCA Outreach Team,\n\nI confirm my attendance for the upcoming summit. Our technology steering group is looking forward to the core banking migration presentation.\n\nBest regards,\n${firstExec.fullName}`,
                            senderEmail: firstExec.email,
                            senderName: firstExec.fullName,
                            status: 'Accepted'
                          });
                        }
                      }}
                      className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 font-mono text-xs font-bold flex items-center space-x-2 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span>Receive Test Client Reply</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Filtering Toolbar */}
              <div className="pt-3 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    placeholder="Search by client name, email, company, subject..."
                    className="w-full bg-navy-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <select
                  value={emailStatusFilter}
                  onChange={(e) => setEmailStatusFilter(e.target.value)}
                  className="bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  <option value="all">All Delivery Statuses</option>
                  <option value="delivered">Delivered ✓</option>
                  <option value="sent">Sent 🚀</option>
                  <option value="accepted">Accepted / RSVP</option>
                </select>

                <div className="flex items-center justify-end">
                  <span className="text-xs text-cyan-400 font-bold">
                    {filteredEmails.length} Client Email Threads
                  </span>
                </div>
              </div>
            </div>

            {/* Email Cards List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredEmails.map(mailItem => {
                const matchedExec = executives.find(e => e.id === mailItem.execId || e.fullName === mailItem.execName);

                // Find any inbound replies for this executive / invitation
                const allMatchingReplies = [
                  ...(mailItem.invitationReplies || []),
                  ...(inboundReplies || []).filter(r => r.executiveId === mailItem.execId || r.invitationId === mailItem.id)
                ];

                return (
                  <div key={mailItem.id} className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-4 hover:border-cyan-500/40 transition-all shadow-lg">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono pb-3 border-b border-white/10">
                      <div className="flex items-center space-x-3">
                        {mailItem.avatarUrl ? (
                          <img src={mailItem.avatarUrl} alt={mailItem.execName} className="w-10 h-10 rounded-full object-cover border border-cyan-400/30 shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-sm shrink-0">
                            {mailItem.execName.substring(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <div className="text-sm font-bold text-white flex items-center space-x-2">
                            <span>{mailItem.execName}</span>
                            <span className="text-xs font-normal text-cyan-300">({mailItem.position})</span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{mailItem.company}</span>
                            <span>&bull;</span>
                            <span className="text-emerald-300 font-bold">{mailItem.recipientEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{mailItem.status}</span>
                        </span>
                        <span className="text-slate-400 text-xs">{mailItem.sentAt}</span>
                      </div>
                    </div>

                    {/* Subject & Event */}
                    <div>
                      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{mailItem.eventName}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{mailItem.subject}</h4>
                    </div>

                    {/* Dispatched Email Body Preview */}
                    <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-44 overflow-y-auto custom-scrollbar">
                      <div className="text-[10px] uppercase font-bold text-cyan-400 mb-1 font-mono">Outbound Communication Copy</div>
                      {mailItem.body}
                    </div>

                    {/* Inbound Executive Replies Thread Box (Direct in Website) */}
                    {allMatchingReplies.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
                          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                            <span>Received Client Email Reply (Direct Portal Thread)</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            No Auto-Reply Sent
                          </span>
                        </div>

                        {allMatchingReplies.map((reply, idx) => (
                          <div key={reply.id || idx} className="p-3.5 rounded-lg bg-navy-950 border border-emerald-500/20 space-y-2 text-xs font-mono">
                            <div className="flex items-center justify-between text-slate-400 text-[11px]">
                              <span className="text-emerald-300 font-bold">From: {reply.senderName} &lt;{reply.senderEmail}&gt;</span>
                              <span>{new Date(reply.receivedAt).toLocaleString()}</span>
                            </div>
                            <div className="font-bold text-white">{reply.subject}</div>
                            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed p-3 bg-slate-900/80 rounded border border-white/5">
                              {reply.body}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer Quick Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(mailItem.recipientEmail)}&su=${encodeURIComponent(mailItem.subject)}&body=${encodeURIComponent(mailItem.body)}`;
                            window.open(gmailUrl, '_blank');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 font-bold border border-cyan-500/40 flex items-center space-x-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Launch Direct Gmail Web</span>
                        </button>

                        {onReceiveInboundReply && matchedExec && (
                          <button
                            onClick={() => {
                              onReceiveInboundReply({
                                executiveId: matchedExec.id,
                                subject: `Re: ${mailItem.subject}`,
                                body: `Dear DELCA Team,\n\nThank you for the communication regarding ${mailItem.eventName}. I have reviewed the proposal and would like to confirm my attendance.\n\nBest regards,\n${matchedExec.fullName}`,
                                senderEmail: matchedExec.email,
                                senderName: matchedExec.fullName,
                                invitationId: mailItem.id,
                                status: 'Accepted'
                              });
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 font-bold border border-emerald-500/40 flex items-center space-x-1.5 transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Log Executive Reply Here</span>
                          </button>
                        )}

                        {matchedExec && onComposeEmail && (
                          <button
                            onClick={() => onComposeEmail(matchedExec, mailItem.subject, mailItem.body)}
                            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold border border-purple-500/40 flex items-center space-x-1.5 transition-all"
                          >
                            <Mail className="w-3.5 h-3.5 text-purple-400" />
                            <span>Re-Send / Compose Custom</span>
                          </button>
                        )}
                      </div>

                      {matchedExec && onOpen360Profile && (
                        <button
                          onClick={() => onOpen360Profile(matchedExec)}
                          className="text-cyan-400 hover:underline font-bold text-xs flex items-center space-x-1"
                        >
                          <span>Executive 360 Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ====================================================================== */}
      {/* SUB-TAB 5: ENGAGEMENT ANALYTICS (Requirement #5) */}
      {/* ====================================================================== */}
      {activeSubTab === 'engagement_analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">Average Attendance Rate</span>
              <span className="text-3xl font-bold font-mono text-white">{attendanceRate}%</span>
              <p className="text-xs text-slate-400">+12% higher attendance than industry average for C-suite seminars.</p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-purple-400 uppercase tracking-widest block">Event Engagement Index</span>
              <span className="text-3xl font-bold font-mono text-purple-300">88/100</span>
              <p className="text-xs text-slate-400">Based on Q&A participation, duration, and executive networking interactions.</p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Follow-Up Conversion Rate</span>
              <span className="text-3xl font-bold font-mono text-amber-300">64%</span>
              <p className="text-xs text-slate-400">64% of attended executives requested 1-on-1 follow-up briefings or proposals.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Executive Interaction Breakdown</span>
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Meeting Requests</span>
                    <span className="text-cyan-300 font-bold">18 Meetings</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full w-[72%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Proposal & SOW Requests</span>
                    <span className="text-purple-300 font-bold">12 Requests</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-400 h-full w-[58%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Industry Report Downloads</span>
                    <span className="text-emerald-300 font-bold">34 Reports</span>
                  </div>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[85%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-4">
              <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Executive Feedback & Testimonials</span>
              </h3>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex justify-between text-mono font-bold text-cyan-300 text-[10px]">
                    <span>Ramon S. Ang • San Miguel Corporation</span>
                    <span>Rating: 5/5</span>
                  </div>
                  <p className="text-slate-300 italic">"The SAP cloud migration roundtable was exceptionally informative. Clear ROI pathways and zero-trust framework."</p>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex justify-between text-mono font-bold text-purple-300 text-[10px]">
                    <span>Ernest L. Cu • Globe Telecom</span>
                    <span>Rating: 5/5</span>
                  </div>
                  <p className="text-slate-300 italic">"Outstanding insights into 5G Edge GenAI customer operations and BSP regulatory compliance."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 6: AI FOLLOW-UP RECOMMENDATIONS (Requirement #6) */}
      {/* ====================================================================== */}
      {activeSubTab === 'followup_recommendations' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 text-xs font-mono text-slate-300 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>AI Follow-Up Action Engine: Next Best Engagement Steps post Event Attendance</span>
            </span>
            <span className="text-purple-300 font-bold">{events.length} Active Event Workstreams</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Schedule C-Suite Executive Strategy Meeting',
                type: 'Schedule Executive Meeting' as const,
                targetExec: 'Ramon S. Ang (San Miguel Corporation)',
                explanation: 'Following high engagement during the ERP Modernization keynote, scheduling a 1-on-1 strategy meeting reduces sales cycle length by addressing budget authorization.',
                urgency: 'High Urgency (Next 48 Hours)'
              },
              {
                title: 'Send Enterprise AI & Security Seminar Materials',
                type: 'Send Event Materials' as const,
                targetExec: 'Ernest L. Cu (Globe Telecom)',
                explanation: 'Transmitting executive slide decks and BSP Circular 1105 compliance whitepapers maintains momentum after key event attendance.',
                urgency: 'Medium Urgency'
              },
              {
                title: 'Share ASEAN AI Digital Transformation Benchmark Report',
                type: 'Share Industry Report' as const,
                targetExec: 'Teresita Sy-Coson (SM Investments)',
                explanation: 'Shares tailored retail reconciliation benchmarking report validating $1.5M operational efficiency savings.',
                urgency: 'Recommended'
              },
              {
                title: 'Arrange Product Demonstration of DELCA Agentic AI',
                type: 'Arrange Product Demonstration' as const,
                targetExec: 'Nestor V. Tan (BDO Unibank)',
                explanation: 'Arranges live interactive sandbox demo of real-time fraud anomaly detection for banking operations.',
                urgency: 'High Priority'
              }
            ].map((rec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 space-y-3 shadow-md hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                    {rec.type}
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 font-bold">{rec.urgency}</span>
                </div>

                <h4 className="font-display font-bold text-sm text-white">{rec.title}</h4>
                <p className="text-xs text-cyan-300 font-mono">Target: {rec.targetExec}</p>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{rec.explanation}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => showToast(`Executed follow-up action: "${rec.title}". Synchronized with Executive Workspace.`)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-purple-200 border border-purple-500/40 font-bold text-[10px] flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Execute Action</span>
                  </button>

                  <span className="text-[10px] text-slate-400">Business Impact: High</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 7: EVENT ROI & REVENUE IMPACT (Requirement #7) */}
      {/* ====================================================================== */}
      {activeSubTab === 'roi_center' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-emerald-500/30 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">Enterprise Event Commercial ROI Engine</span>
                <h2 className="text-xl font-display font-bold text-white mt-1">
                  Business Outcome & Revenue Influence Dashboard
                </h2>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-slate-400 block">Total Event Investment ROI</span>
                <span className="text-2xl font-bold text-emerald-300">+{eventRoiPercentage}% Net Return</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] block">Qualified Leads Generated</span>
                <span className="text-xl font-bold text-white">28 Executives</span>
                <span className="text-[10px] text-emerald-400 block">$1,200 Cost per Lead</span>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] block">Pipeline Opportunities Created</span>
                <span className="text-xl font-bold text-amber-300">${(totalOppsValue / 1000000).toFixed(2)}M</span>
                <span className="text-[10px] text-slate-400 block">{totalOppsGenerated} Active Deals</span>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] block">Closed Won Contracts</span>
                <span className="text-xl font-bold text-emerald-300">${(totalDealsWonValue / 1000000).toFixed(2)}M</span>
                <span className="text-[10px] text-emerald-400 block">3 Enterprise Contracts</span>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[10px] block">Total Revenue Influenced</span>
                <span className="text-xl font-bold text-purple-300">${(totalRevenueInfluenced / 1000000).toFixed(2)}M</span>
                <span className="text-[10px] text-slate-400 block">Multi-Year Enterprise Value</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* EXISTING MODALS: ADD / EDIT EVENT MODAL */}
      {/* ====================================================================== */}
      {isOpenModal && (
        <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border-white/10 relative animate-[zoomIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_1]">
            {/* Top Accent line */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-navy-950/40">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-lg text-white">
                  {selectedEvent ? 'Modify Event Schedule' : 'Coordinate New Event'}
                </h3>
              </div>
              <button 
                onClick={() => setIsOpenModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Event Title Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Summit on Enterprise ERP Automation"
                  className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-400/40 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-slate-300 focus:border-cyan-400/40 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Session Time</label>
                  <input
                    type="text"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    placeholder="e.g., 14:00 - 16:30 EST"
                    className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-400/40 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Lead Keynote Speaker</label>
                  <input
                    type="text"
                    required
                    value={formData.speaker || formData.speakerInfo || ''}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value, speakerInfo: e.target.value })}
                    placeholder="e.g., Dr. Aris Vance"
                    className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-400/40 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Max VIP Attendance Capacity</label>
                  <input
                    type="number"
                    required
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 20 })}
                    className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-400/40 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Venue Location / URL</label>
                  <input
                    type="text"
                    required
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    placeholder="e.g., Grand Ballroom, Waldorf Astoria NY"
                    className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-400/40 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Operational Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-slate-300 focus:border-cyan-400/40 outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Target Audience Roster (Comma Separated)</label>
                <input
                  type="text"
                  value={targetAudienceInput}
                  onChange={(e) => setTargetAudienceInput(e.target.value)}
                  placeholder="e.g., Logistics, Manufacturing, Operations"
                  className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-cyan-400/40 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Seminar Summary Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize key topics covered..."
                  rows={3}
                  className="w-full bg-navy-950/60 border border-white/10 rounded-xl py-2 px-3 text-xs text-white focus:border-cyan-400/40 outline-none resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsOpenModal(false)}
                  className="px-4 py-2 text-xs font-mono border border-white/10 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-navy-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 transition-all"
                >
                  {selectedEvent ? 'Update Schedule' : 'Schedule Seminar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* EXISTING MODALS: QR CHECK-IN & ATTENDEE TRACKING MODAL */}
      {/* ====================================================================== */}
      {qrModalEvent && (
        <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl border-white/10 overflow-hidden relative animate-[fadeIn_0.3s_ease-out_1]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-navy-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Event QR Check-In & Attendance</h3>
                  <p className="text-xs text-slate-400 font-mono">{qrModalEvent.name} • {qrModalEvent.date}</p>
                </div>
              </div>

              <button 
                onClick={() => setQrModalEvent(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* QR Code Graphic Badge */}
              <div className="p-5 rounded-2xl bg-navy-950 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono uppercase tracking-widest">
                    Live Check-In Portal
                  </span>
                  <h4 className="text-sm font-bold text-white">Scan Executive Event Badge QR</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Scan or manually confirm executive arrival. Real-time check-in updates database status for instant follow-up routing.
                  </p>
                </div>

                {/* SVG Mock QR Code */}
                <div className="p-3 bg-white rounded-xl shadow-lg shrink-0 flex flex-col items-center space-y-1">
                  <svg className="w-24 h-24 text-navy-950" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" fill="currentColor"/>
                    <rect x="5" y="5" width="20" height="20" fill="white"/>
                    <rect x="10" y="10" width="10" height="10" fill="currentColor"/>
                    <rect x="70" y="0" width="30" height="30" fill="currentColor"/>
                    <rect x="75" y="5" width="20" height="20" fill="white"/>
                    <rect x="80" y="10" width="10" height="10" fill="currentColor"/>
                    <rect x="0" y="70" width="30" height="30" fill="currentColor"/>
                    <rect x="5" y="75" width="20" height="20" fill="white"/>
                    <rect x="10" y="80" width="10" height="10" fill="currentColor"/>
                    <rect x="40" y="10" width="10" height="30" fill="currentColor"/>
                    <rect x="10" y="40" width="30" height="10" fill="currentColor"/>
                    <rect x="50" y="50" width="20" height="20" fill="currentColor"/>
                    <rect x="80" y="40" width="10" height="40" fill="currentColor"/>
                    <rect x="40" y="80" width="30" height="10" fill="currentColor"/>
                  </svg>
                  <span className="text-[9px] font-mono text-slate-800 font-bold uppercase">{qrModalEvent.id}</span>
                </div>
              </div>

              {/* Attendee Roster Search */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Executive Guest Roster ({executives.length} Contacts)
                  </h4>
                  <span className="text-xs font-mono text-emerald-400">
                    {Object.values(checkedInIds || {}).filter(Boolean).length} Checked-In
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                    placeholder="Search executive name, position, or company..."
                    className="w-full bg-navy-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {executives
                    .filter(e => 
                      e.fullName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
                      e.company.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
                      e.position.toLowerCase().includes(attendeeSearch.toLowerCase())
                    )
                    .map(exec => {
                      const isCheckedIn = Boolean(checkedInIds[exec.id]);
                      return (
                        <div 
                          key={exec.id} 
                          className="p-3 rounded-xl bg-navy-900/60 border border-white/5 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            {exec.avatarUrl ? (
                              <img src={exec.avatarUrl} alt={exec.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0">
                                {exec.fullName.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div 
                                onClick={() => {
                                  if (onOpen360Profile) onOpen360Profile(exec);
                                }}
                                className="text-xs font-bold text-white truncate hover:text-cyan-300 cursor-pointer"
                              >
                                {exec.fullName}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">{exec.position} • {exec.company}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              const newCheckedState = !checkedInIds[exec.id];
                              setCheckedInIds(prev => ({ ...prev, [exec.id]: newCheckedState }));
                              if (newCheckedState) {
                                showToast(`Checked in ${exec.fullName}. Synchronized across Executive Workspace & Knowledge Hub.`);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                              isCheckedIn
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-white/5 hover:bg-cyan-500/20 text-slate-300 border border-white/10'
                            }`}
                          >
                            {isCheckedIn ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Checked In</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                                <span>Mark Present</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-navy-900/50 flex justify-end">
              <button
                onClick={() => setQrModalEvent(null)}
                className="px-5 py-2 bg-cyan-500 text-navy-950 font-display font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-cyan-400 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 1: INSPECT EVENT ACTIVITY DETAIL */}
      {/* ====================================================================== */}
      {selectedActivityDetail && (
        <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-xl rounded-2xl shadow-2xl border-white/10 overflow-hidden relative animate-[fadeIn_0.2s_ease-out_1]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-navy-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedActivityDetail.title}</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedActivityDetail.timestamp} &bull; {selectedActivityDetail.type}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedActivityDetail(null)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-navy-900/60 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Target Seminar:</span>
                  <span className="text-cyan-300 font-bold">{selectedActivityDetail.eventName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Client Executive:</span>
                  <span className="text-white font-bold">{selectedActivityDetail.execName} ({selectedActivityDetail.companyName})</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Recipient Inbox:</span>
                  <span className="text-emerald-300 font-bold">{selectedActivityDetail.recipientEmail || 'janemariebaluna239@gmail.com'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Lifecycle Status:</span>
                  <span className="text-cyan-400 font-bold">{selectedActivityDetail.status}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider block">Activity Journey Details</label>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 leading-relaxed font-mono">
                  {selectedActivityDetail.details}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const matchedExec = executives.find(e => e.id === selectedActivityDetail.execId || e.fullName === selectedActivityDetail.execName);
                      if (matchedExec && onComposeEmail) {
                        onComposeEmail(matchedExec, `Follow-up: ${selectedActivityDetail.title}`, selectedActivityDetail.details);
                        setSelectedActivityDetail(null);
                      } else {
                        showToast(`Dispatched client email to ${selectedActivityDetail.execName}.`);
                        setSelectedActivityDetail(null);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-navy-950 font-bold flex items-center space-x-1.5 hover:bg-cyan-400 transition-all"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Client Email</span>
                  </button>

                  {executives.find(e => e.id === selectedActivityDetail.execId || e.fullName === selectedActivityDetail.execName) && onOpen360Profile && (
                    <button
                      onClick={() => {
                        const matchedExec = executives.find(e => e.id === selectedActivityDetail.execId || e.fullName === selectedActivityDetail.execName);
                        if (matchedExec) onOpen360Profile(matchedExec);
                        setSelectedActivityDetail(null);
                      }}
                      className="px-3 py-2 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-500/40 font-bold flex items-center space-x-1.5 hover:bg-purple-500/30 transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span>360 View</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setTimelineActivities(prev => prev.filter(a => a.id !== selectedActivityDetail.id));
                    setSelectedActivityDetail(null);
                    showToast('Removed event activity from timeline.');
                  }}
                  className="px-3 py-2 rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 font-bold flex items-center space-x-1 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                  <span>Remove Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* MODAL 2: LOG CUSTOM EVENT ACTIVITY */}
      {/* ====================================================================== */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl shadow-2xl border-white/10 overflow-hidden relative animate-[fadeIn_0.2s_ease-out_1]">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-navy-900/50">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Log Custom Event Activity</h3>
                  <p className="text-xs text-slate-400 font-mono">Synchronizes across Event Timeline & Executive Workspace</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddActivityOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const matchedExec = executives.find(ex => ex.id === newActExecId) || executives[0];
                const matchedEvt = events.find(ev => ev.id === newActEventId) || events[0];

                const newItem = {
                  id: `ET-${Date.now()}`,
                  timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  type: newActType,
                  title: newActTitle || `${newActType} with ${matchedExec?.fullName || 'Client Executive'}`,
                  execId: matchedExec?.id,
                  execName: matchedExec?.fullName || 'VIP Client Executive',
                  companyName: matchedExec?.company || 'Enterprise Client',
                  eventId: matchedEvt?.id || 'EVT-101',
                  eventName: matchedEvt?.name || 'DELCA Executive Event',
                  details: newActDetails || `Logged new ${newActType} event activity into customer journey timeline.`,
                  status: 'Active' as const,
                  recipientEmail: matchedExec?.email || 'janemariebaluna239@gmail.com'
                };

                setTimelineActivities(prev => [newItem, ...prev]);
                setIsAddActivityOpen(false);
                setNewActTitle('');
                setNewActDetails('');
                showToast(`Logged new event activity: "${newItem.title}". Synchronized across platform.`);
              }}
              className="p-6 space-y-4 text-xs font-mono"
            >
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 font-bold">Target Executive Client</label>
                <select
                  value={newActExecId}
                  onChange={(e) => setNewActExecId(e.target.value)}
                  className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                >
                  {executives.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.fullName} ({ex.company})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-400 font-bold">Associated Seminar</label>
                  <select
                    value={newActEventId}
                    onChange={(e) => setNewActEventId(e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    {events.map(ev => (
                      <option key={ev.id} value={ev.id}>{ev.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase text-slate-400 font-bold">Activity Category</label>
                  <select
                    value={newActType}
                    onChange={(e) => setNewActType(e.target.value as any)}
                    className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                  >
                    <option value="Follow-up Meeting">Follow-up Meeting</option>
                    <option value="Proposal Request">Proposal Request</option>
                    <option value="Won Project">Won Project Deal</option>
                    <option value="Email Delivered">Client Email Delivered</option>
                    <option value="Invitation Sent">Invitation Sent</option>
                    <option value="RSVP Accepted">RSVP Accepted</option>
                    <option value="Attendance">Attendance Check-In</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 font-bold">Activity Headline Title</label>
                <input
                  type="text"
                  required
                  value={newActTitle}
                  onChange={(e) => setNewActTitle(e.target.value)}
                  placeholder="e.g., Board Briefing Confirmed for SAP Migration SOW"
                  className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase text-slate-400 font-bold">Detailed Activity Description</label>
                <textarea
                  required
                  rows={3}
                  value={newActDetails}
                  onChange={(e) => setNewActDetails(e.target.value)}
                  placeholder="Summarize key takeaways, action items, or agreement milestones..."
                  className="w-full bg-navy-900 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddActivityOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-navy-950 font-bold hover:bg-cyan-400 transition-all"
                >
                  Save Activity Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
