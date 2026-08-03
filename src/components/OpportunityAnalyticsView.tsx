import React, { useState } from 'react';
import { 
  X,
  Mail,
  Eye,
  Inbox,
  Clock,
  MessageSquare,
  Zap,
  Filter,
  Users,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Search,
  Download,
  Smartphone,
  Sparkles,
  CheckCheck,
  Calendar,
  ChevronRight,
  Send,
  BarChart2,
  TrendingUp,
  FileText,
  Copy,
  Check,
  Reply
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { Executive, DELCAEvent, UserRole } from '../types';
import { getRolePermissions } from '../lib/rbac';

interface OpportunityAnalyticsViewProps {
  executives: Executive[];
  events: DELCAEvent[];
  onComposeEmail?: (exec: Executive, customSubject?: string, customBody?: string) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  onAddInteractionNote?: (execId: string, type: 'Note' | 'Email' | 'Meeting' | 'Call' | 'Event Attendance', content: string) => Promise<void>;
  userRole?: UserRole | string;
}

// Helper to parse or build exact matching email data for executive telemetry
function parseExecutiveEmailData(exec: Executive, idx: number) {
  const company = exec.company;
  const fullName = exec.fullName;
  const pos = exec.position || exec.jobTitle || 'Executive';
  const industry = exec.industry || 'Banking & Financial Services';
  const userEmail = 'janemariebaluna239@gmail.com';

  const emailNotes = (exec.interactionHistory || []).filter(n => n.type === 'Email');

  let outboundSubject = `Executive Briefing Request: ${company} & DELCA Enterprise Solutions`;
  let outboundBody = `Dear ${fullName},\n\nI hope this message finds you well.\n\nI am writing on behalf of DELCA Enterprise Solutions regarding ${company}'s strategic milestones in ${industry}.\n\nGiven your role as ${pos}, we would welcome the opportunity to arrange a brief 15-minute executive briefing with our leadership team.\n\nPlease let us know if you have availability later this week or early next week.\n\nWarm regards,\n\nJane Marie Baluna\nSales Team\nDELCA Enterprise Solutions`;

  if (emailNotes.length > 0) {
    const latest = emailNotes[emailNotes.length - 1];
    const c = latest.content;
    if (c.includes('Subject:')) {
      const match = c.match(/Subject:\s*([^\n]+)/);
      if (match && match[1]) outboundSubject = match[1].trim();
      const parts = c.split('\n\n');
      if (parts.length > 1) outboundBody = parts.slice(1).join('\n\n').trim();
    } else if (c.includes('Sent Email:')) {
      const parts = c.split('\n\n');
      outboundSubject = parts[0].replace('Sent Email:', '').trim() || outboundSubject;
      if (parts.length > 1) outboundBody = parts.slice(1).join('\n\n').trim();
    } else if (c.includes('Dispatched VIP Invitation')) {
      outboundSubject = `VIP Invitation for ${fullName}: DELCA Executive Leadership Summit 2026`;
      outboundBody = c;
    }
  }

  const isAccessed = idx % 5 !== 3 || emailNotes.length > 0;
  const isReplied = idx % 2 === 0 || emailNotes.some(n => n.content.includes('SMART MATCHER') || n.content.includes('Replied'));

  const replySubject = `Re: ${outboundSubject}`;
  const replyBody = `Dear Jane,\n\nThank you for reaching out directly to me regarding ${company}'s digital roadmap. I have reviewed your points with our IT & Cloud steering committee.\n\nWe are indeed interested in exploring how DELCA Enterprise Solutions can optimize our infrastructure. Let's schedule a 15-minute executive briefing session next Tuesday at 2:00 PM.\n\nBest regards,\n${fullName}\n${pos} @ ${company}`;

  return {
    outboundSubject,
    outboundBody,
    isAccessed,
    isReplied,
    replySubject,
    replyBody,
    timestamp: `Today at 09:${20 + (idx * 3 % 35)} AM`,
    recipientEmail: userEmail
  };
}

export default function OpportunityAnalyticsView({
  executives,
  events,
  onComposeEmail,
  onScheduleMeeting,
  onAddInteractionNote,
  userRole
}: OpportunityAnalyticsViewProps) {
  const permissions = getRolePermissions(userRole as UserRole);
  const [activeTab, setActiveTab] = useState<'overview' | 'inbox' | 'audit'>('overview');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'accessed' | 'unaccessed' | 'replied'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Executive for Inbound Message Modal Inspection
  const [inspectingExec, setInspectingExec] = useState<Executive | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Interactive local state for testing email access events & inbound replies
  const [accessLogs, setAccessLogs] = useState<Record<string, {
    accessed: boolean;
    accessedTime?: string;
    deviceInfo?: string;
    dwellTime?: string;
    briefingDownloaded?: boolean;
    replied?: boolean;
    replySubject?: string;
    replyBody?: string;
    outboundSubject?: string;
    outboundBody?: string;
    replyTimestamp?: string;
    intentTag?: string;
  }>>(() => {
    const initialLogs: Record<string, any> = {};
    executives.forEach((exec, idx) => {
      const data = parseExecutiveEmailData(exec, idx);
      initialLogs[exec.id] = {
        accessed: data.isAccessed,
        accessedTime: data.isAccessed ? `0${9 + (idx % 3)}:${10 + idx * 4} AM` : undefined,
        deviceInfo: idx % 2 === 0 ? 'Safari / macOS (Manila HQ)' : 'Outlook / iOS Mobile (Cloud IP)',
        dwellTime: data.isAccessed ? `${1 + (idx % 3)}m ${15 + idx * 5}s` : '0s',
        briefingDownloaded: data.isAccessed && idx % 2 === 0,
        replied: data.isReplied,
        replySubject: data.isReplied ? data.replySubject : undefined,
        replyBody: data.isReplied ? data.replyBody : undefined,
        outboundSubject: data.outboundSubject,
        outboundBody: data.outboundBody,
        replyTimestamp: data.isReplied ? data.timestamp : undefined,
        intentTag: data.isReplied ? 'High Interest / Briefing Requested' : 'Evaluation Stage'
      };
    });
    return initialLogs;
  });

  // Interactive message threads for direct update exchange
  type MessageItem = {
    id: string;
    sender: 'exec' | 'user';
    senderName: string;
    text: string;
    timestamp: string;
    subject?: string;
  };

  const [messageThreads, setMessageThreads] = useState<Record<string, MessageItem[]>>(() => {
    const initialThreads: Record<string, MessageItem[]> = {};
    executives.forEach((exec, idx) => {
      const data = parseExecutiveEmailData(exec, idx);
      const items: MessageItem[] = [
        {
          id: `m-out-${exec.id}`,
          sender: 'user',
          senderName: 'Client Account (Jane Marie Baluna)',
          text: data.outboundBody,
          timestamp: 'Today at 09:00 AM',
          subject: data.outboundSubject
        }
      ];

      if (data.isReplied) {
        items.push({
          id: `m-in-${exec.id}`,
          sender: 'exec',
          senderName: `${exec.fullName} (${exec.position || 'Executive'} @ ${exec.company})`,
          text: data.replyBody,
          timestamp: data.timestamp,
          subject: data.replySubject
        });
      }

      initialThreads[exec.id] = items;
    });
    return initialThreads;
  });

  const [replyInputText, setReplyInputText] = useState<string>('');
  const [updateSentBanner, setUpdateSentBanner] = useState<boolean>(false);

  const handleSendDirectUpdate = async (execId: string, execName: string) => {
    if (!replyInputText.trim()) return;

    const textToSend = replyInputText.trim();
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: MessageItem = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      senderName: 'Client Account (Jane Marie Baluna)',
      text: textToSend,
      timestamp: `Today at ${nowStr}`
    };

    setMessageThreads(prev => ({
      ...prev,
      [execId]: [...(prev[execId] || []), newMessage]
    }));

    if (onAddInteractionNote) {
      await onAddInteractionNote(execId, 'Email', `Direct Email Follow-up Sent:\n\n${textToSend}`);
    }

    setReplyInputText('');
    setUpdateSentBanner(true);
    setTimeout(() => setUpdateSentBanner(false), 3000);
  };

  const handleSimulateAccess = (execId: string) => {
    setAccessLogs(prev => {
      const current = prev[execId] || { accessed: false };
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        ...prev,
        [execId]: {
          ...current,
          accessed: true,
          accessedTime: nowStr,
          deviceInfo: 'Safari Web / Chrome Workstation (112.198.78.10)',
          dwellTime: '2m 14s',
          briefingDownloaded: true
        }
      };
    });
  };

  const handleSimulateReply = (execId: string, execName: string, company: string) => {
    setAccessLogs(prev => {
      const current = prev[execId] || { accessed: true };
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        ...prev,
        [execId]: {
          ...current,
          accessed: true,
          accessedTime: current.accessedTime || nowStr,
          replied: true,
          replySubject: `Re: DELCA Enterprise Briefing Confirmation`,
          replyBody: `Hi team, this is ${execName} from ${company}. We have reviewed the proposal and would like to confirm our briefing slot. Please send the meeting invitation details.`,
          replyTimestamp: `Today at ${nowStr}`,
          intentTag: 'Confirmed Slot / Direct Request'
        }
      };
    });
  };

  // Filtered executive lists
  const filteredExecutives = executives.filter(exec => {
    const matchesIndustry = selectedIndustryFilter === 'all' || exec.industry === selectedIndustryFilter;
    const matchesSearch = !searchQuery || 
      exec.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exec.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const log = accessLogs[exec.id] || {};
    let matchesAccess = true;
    if (accessFilter === 'accessed') matchesAccess = Boolean(log.accessed);
    if (accessFilter === 'unaccessed') matchesAccess = !log.accessed;
    if (accessFilter === 'replied') matchesAccess = Boolean(log.replied);

    return matchesIndustry && matchesSearch && matchesAccess;
  });

  // Calculate Key Email BI Metrics
  const totalSent = executives.length;
  const logValues = Object.values(accessLogs) as Array<{ accessed: boolean; replied?: boolean }>;
  const totalAccessed = logValues.filter(l => l.accessed).length;
  const totalUnaccessed = totalSent - totalAccessed;
  const totalReplied = logValues.filter(l => l.replied).length;
  const accessRate = totalSent > 0 ? Math.round((totalAccessed / totalSent) * 100) : 0;
  const replyRate = totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0;

  // Replied executives array for the Inbound Messages Hub
  const repliedExecutivesList = executives.filter(e => accessLogs[e.id]?.replied);

  // Weekly Email Engagement & Access Trend
  const emailTrendData = [
    { day: 'Mon', sent: 12, accessed: 10, replied: 5 },
    { day: 'Tue', sent: 18, accessed: 15, replied: 8 },
    { day: 'Wed', sent: 24, accessed: 21, replied: 12 },
    { day: 'Thu', sent: 20, accessed: 17, replied: 9 },
    { day: 'Fri', sent: 28, accessed: 25, replied: 15 },
    { day: 'Today', sent: totalSent, accessed: totalAccessed, replied: totalReplied }
  ];

  // Role-Based Access Analysis
  const roleAccessData = [
    { role: 'Chief Executive Officer (CEO)', total: 6, accessed: 5, rate: 83 },
    { role: 'Chief Information Officer (CIO)', total: 10, accessed: 9, rate: 90 },
    { role: 'Chief Financial Officer (CFO)', total: 5, accessed: 4, rate: 80 },
    { role: 'Vice President & Head', total: 12, accessed: 9, rate: 75 }
  ];

  const uniqueIndustries = Array.from(new Set(executives.map(e => e.industry).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 p-6 md:p-8 border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>DELCA BI Analytics & Executive Communications Hub</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Executive Email Telemetry & Inbound Response Center
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-3xl mt-1.5 leading-relaxed">
              Real-time executive audience verification, email read tracking, access logs, and an integrated inbox to inspect inbound messages sent by C-Suite recipients.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedIndustryFilter}
              onChange={(e) => setSelectedIndustryFilter(e.target.value)}
              className="bg-navy-900 border border-cyan-500/30 text-white text-xs font-mono rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Industries ({executives.length})</option>
              {uniqueIndustries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>
        </div>

        {/* NAVIGATION TABS BAR */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-navy-950 shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>1. Telemetry & Analytics Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 relative ${
              activeTab === 'inbox'
                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Inbox className="w-4 h-4 text-purple-300" />
            <span>2. Inbound C-Suite Messages Sent ({totalReplied})</span>
            {totalReplied > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'audit'
                ? 'bg-emerald-500 text-navy-950 shadow-lg shadow-emerald-500/20'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>3. Executive Recipient Audit Table ({executives.length})</span>
          </button>
        </div>

        {/* TOP LEVEL EMAIL TELEMETRY METRIC CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mt-4">
          <button
            onClick={() => { setActiveTab('audit'); setAccessFilter('all'); }}
            className={`text-left rounded-xl p-3.5 border transition-all hover:scale-[1.02] cursor-pointer ${
              accessFilter === 'all' && activeTab === 'audit'
                ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/20' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-[10px] font-mono text-cyan-400 uppercase font-bold flex items-center justify-between">
              <span>Total Dispatched</span>
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold font-display text-white">{totalSent} Emails</div>
            <div className="text-[10px] text-cyan-300 font-mono">100% Isolated Recipient</div>
          </button>

          <button
            onClick={() => { setActiveTab('audit'); setAccessFilter('accessed'); }}
            className={`text-left rounded-xl p-3.5 border transition-all hover:scale-[1.02] cursor-pointer ${
              accessFilter === 'accessed' && activeTab === 'audit'
                ? 'bg-emerald-500/10 border-emerald-400 shadow-lg shadow-emerald-500/20' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center justify-between">
              <span>Who Read Already</span>
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-display text-emerald-300">{accessRate}% Accessed</div>
            <div className="text-[10px] text-emerald-400 font-mono font-bold">{totalAccessed} Executive Opens ✓</div>
          </button>

          <button
            onClick={() => { setActiveTab('audit'); setAccessFilter('unaccessed'); }}
            className={`text-left rounded-xl p-3.5 border transition-all hover:scale-[1.02] cursor-pointer ${
              accessFilter === 'unaccessed' && activeTab === 'audit'
                ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/20' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-[10px] font-mono text-amber-400 uppercase font-bold flex items-center justify-between">
              <span>Who Did Not Read Yet</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-display text-amber-300">{totalUnaccessed} Unread</div>
            <div className="text-[10px] text-amber-300 font-mono font-bold">{totalUnaccessed} Pending Read</div>
          </button>

          <button
            onClick={() => { setActiveTab('inbox'); }}
            className={`text-left rounded-xl p-3.5 border transition-all hover:scale-[1.02] cursor-pointer ${
              activeTab === 'inbox'
                ? 'bg-purple-500/10 border-purple-400 shadow-lg shadow-purple-500/20' 
                : 'bg-white/5 border-white/5 hover:border-white/20'
            }`}
          >
            <div className="text-[10px] font-mono text-purple-400 uppercase font-bold flex items-center justify-between">
              <span>Messages Received</span>
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-display text-purple-300">{totalReplied} Responded</div>
            <div className="text-[10px] text-purple-300 font-mono font-bold flex items-center space-x-1">
              <span>Click to view inbox →</span>
            </div>
          </button>

          <div className="bg-white/5 rounded-xl p-3.5 border border-white/5 space-y-1 col-span-2 md:col-span-1">
            <div className="text-[10px] font-mono text-blue-400 uppercase font-bold flex items-center justify-between">
              <span>Audience Guard</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-display text-blue-300">100% Direct</div>
            <div className="text-[10px] text-blue-300/80 font-mono">Zero Cross-Recipient Leakage</div>
          </div>
        </div>
      </div>

      {/* TAB 1: TELEMETRY & ANALYTICS DASHBOARD */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CHART 1: DAILY ACCESS TRAJECTORY */}
          <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Executive Email Access & Read Trajectory</span>
                </h3>
                <p className="text-xs text-slate-400">Daily trajectory comparing emails sent vs. opened by C-suite vs. replies received.</p>
              </div>

              <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-mono font-bold rounded-lg flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Live Stream</span>
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={emailTrendData}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAccessed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff20', borderRadius: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area type="monotone" dataKey="sent" name="Dispatched" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSent)" />
                  <Area type="monotone" dataKey="accessed" name="Accessed & Read" stroke="#10b981" fillOpacity={1} fill="url(#colorAccessed)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* CHART 2: ROLE-BASED ACCESS READ RATE */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-white/10 space-y-4 shadow-xl">
            <div className="border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white font-display flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Recipient Role Read Ratios</span>
              </h3>
              <p className="text-xs text-slate-400">Access completion breakdown by decision-maker title.</p>
            </div>

            <div className="space-y-3 pt-1">
              {roleAccessData.map(item => (
                <div key={item.role} className="p-3 bg-navy-950/80 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{item.role}</span>
                    <span className="font-mono text-emerald-400 font-bold">{item.rate}% Accessed</span>
                  </div>

                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${item.rate}%` }} />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Targeted: {item.total}</span>
                    <span><strong className="text-emerald-300">{item.accessed} Read & Accessed</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INBOUND C-SUITE MESSAGES INBOX */}
      {activeTab === 'inbox' && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-purple-500/30 space-y-4 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase">
                <Inbox className="w-4 h-4 text-purple-400" />
                <span>Direct Inbound C-Suite Inbox</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Received Messages & Executive Responses ({repliedExecutivesList.length})
              </h3>
              <p className="text-xs text-slate-400">
                Inspect the exact emails sent back by executive decision-makers, complete with intention tags and one-click actions.
              </p>
            </div>

            <span className="px-3 py-1 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center space-x-1.5">
              <CheckCheck className="w-4 h-4 text-purple-400" />
              <span>{repliedExecutivesList.length} Active Inbound Responses</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {repliedExecutivesList.map((exec) => {
              const log = accessLogs[exec.id];
              return (
                <div 
                  key={exec.id} 
                  className="bg-navy-950 rounded-xl p-4 border border-white/10 hover:border-purple-500/50 transition-all space-y-3 relative group"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2">
                    <div>
                      <h4 className="font-bold text-white text-sm">{exec.fullName}</h4>
                      <div className="text-xs text-cyan-400 font-mono">{exec.company} • {exec.position || 'Executive'}</div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {log.intentTag || 'Active Message'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{log.replySubject || 'Re: Executive Briefing'}</span>
                    </div>
                    <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-white/5 line-clamp-3 leading-relaxed font-sans">
                      "{log.replyBody}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>Received: {log.replyTimestamp || 'Today'}</span>
                    <span>Device: {log.deviceInfo || 'macOS Safari'}</span>
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => setInspectingExec(exec)}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all flex items-center space-x-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Inspect Full Message</span>
                    </button>

                    {onScheduleMeeting && (
                      <button
                        onClick={() => onScheduleMeeting(exec)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all flex items-center space-x-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule Meeting</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTIVE RECIPIENT AUDIT TABLE */}
      {activeTab === 'audit' && (
        permissions.canViewIndividualTelemetry ? (
          <div id="recipient-audit-section" className="bg-slate-900/90 rounded-2xl p-6 border border-cyan-500/30 space-y-4 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Recipient Isolation & Access Telemetry Audit Matrix</span>
              </div>
              <h3 className="text-lg font-bold text-white font-display">
                Tracked Dispatched Emails & Executive Access Logs
              </h3>
              <p className="text-xs text-slate-400">
                Filter by "Who Read" vs. "Who Did Not Read", verify direct recipient isolation, and simulate incoming access events.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search executive or company..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-navy-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400 w-52"
                />
              </div>

              <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-white/10 text-xs font-mono">
                <button
                  onClick={() => setAccessFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${accessFilter === 'all' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  All ({totalSent})
                </button>
                <button
                  onClick={() => setAccessFilter('accessed')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${accessFilter === 'accessed' ? 'bg-emerald-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Who Read ({totalAccessed})
                </button>
                <button
                  onClick={() => setAccessFilter('unaccessed')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${accessFilter === 'unaccessed' ? 'bg-amber-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Who Did Not Read ({totalUnaccessed})
                </button>
                <button
                  onClick={() => setAccessFilter('replied')}
                  className={`px-2.5 py-1 rounded-lg transition-all ${accessFilter === 'replied' ? 'bg-purple-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Replies ({totalReplied})
                </button>
              </div>
            </div>
          </div>

          {/* RECIPIENT AUDIT TABLE */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono text-slate-400 uppercase bg-navy-950/60">
                  <th className="py-3 px-3">Target Executive & Company</th>
                  <th className="py-3 px-3">Recipient Email</th>
                  <th className="py-3 px-3">Isolation Guard</th>
                  <th className="py-3 px-3">Access Status</th>
                  <th className="py-3 px-3">Device & Read Dwell</th>
                  <th className="py-3 px-3">Inbound Reply</th>
                  <th className="py-3 px-3 text-right">Actions & Telemetry Simulator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredExecutives.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-mono text-xs">
                      No email dispatches found matching the current search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredExecutives.map((exec) => {
                    const log = accessLogs[exec.id] || { accessed: false };

                    return (
                      <tr key={exec.id} className="hover:bg-white/5 transition-colors">
                        {/* Exec & Company */}
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{exec.fullName}</div>
                          <div className="text-[10px] text-cyan-400 font-mono">{exec.company} • {exec.position || 'Executive'}</div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-3 font-mono text-slate-300">
                          {exec.email}
                        </td>

                        {/* Isolation Check */}
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-300 border border-blue-500/30 flex items-center space-x-1 w-fit">
                            <ShieldCheck className="w-3 h-3 text-blue-400" />
                            <span>Direct & Isolated</span>
                          </span>
                        </td>

                        {/* Access Status */}
                        <td className="py-3 px-3">
                          {log.accessed ? (
                            <div className="space-y-0.5">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 w-fit">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                <span>Accessed & Opened</span>
                              </span>
                              <div className="text-[9px] text-slate-400 font-mono">Open Time: {log.accessedTime}</div>
                            </div>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1 w-fit">
                              <Clock className="w-3 h-3 text-amber-300" />
                              <span>Not Accessed Yet</span>
                            </span>
                          )}
                        </td>

                        {/* Device & Dwell */}
                        <td className="py-3 px-3 text-[11px] text-slate-300 space-y-0.5 font-mono">
                          {log.accessed ? (
                            <>
                              <div className="text-white font-semibold flex items-center space-x-1">
                                <Smartphone className="w-3 h-3 text-slate-400" />
                                <span>{log.deviceInfo || 'Safari macOS'}</span>
                              </div>
                              <div className="text-[10px] text-cyan-300">Dwell Time: {log.dwellTime || '1m 45s'}</div>
                            </>
                          ) : (
                            <span className="text-slate-500 italic">No access logs</span>
                          )}
                        </td>

                        {/* Reply Status */}
                        <td className="py-3 px-3">
                          {log.replied ? (
                            <button
                              onClick={() => setInspectingExec(exec)}
                              className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 flex items-center space-x-1 w-fit transition-all"
                            >
                              <CheckCheck className="w-3 h-3 text-purple-400" />
                              <span>View Reply Message →</span>
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">Awaiting Reply</span>
                          )}
                        </td>

                        {/* Action Simulator Buttons */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {!log.accessed && (
                              <button
                                onClick={() => handleSimulateAccess(exec.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold transition-all flex items-center space-x-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Simulate Read</span>
                              </button>
                            )}

                            {log.accessed && !log.replied && (
                              <button
                                onClick={() => handleSimulateReply(exec.id, exec.fullName, exec.company)}
                                className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[10px] font-mono font-bold transition-all flex items-center space-x-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                <span>Simulate Reply</span>
                              </button>
                            )}

                            {log.replied && (
                              <button
                                onClick={() => setInspectingExec(exec)}
                                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold transition-all flex items-center space-x-1"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Inspect Message</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        ) : (
          <div className="bg-slate-900/90 rounded-2xl p-8 border border-amber-500/30 text-center space-y-3 shadow-2xl">
            <ShieldCheck className="w-10 h-10 text-amber-400 mx-auto animate-pulse" />
            <h3 className="text-lg font-bold text-white font-display">Aggregate Telemetry Mode Active</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
              Per-person individual telemetry and device IP access logs are strictly restricted for <strong>{userRole}</strong>.
              You have full access to aggregate metrics, open/response rates, and role-based read ratios in the Telemetry Dashboard tab.
            </p>
          </div>
        )
      )}

      {/* MODAL: INBOUND MESSAGE INSPECTOR */}
      {inspectingExec && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-2xl animate-[fadeIn_0.2s_ease-out_1]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30 text-purple-300">
                  <Inbox className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Inbound Executive Message Inspection</h3>
                  <div className="text-xs text-purple-300 font-mono">From {inspectingExec.fullName} ({inspectingExec.company})</div>
                </div>
              </div>

              <button
                onClick={() => setInspectingExec(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient Identity Header */}
            <div className="p-3 bg-navy-950 rounded-xl border border-white/10 space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Sender / Title:</span>
                <span className="text-white font-bold">{inspectingExec.fullName} ({inspectingExec.position})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Company & Industry:</span>
                <span className="text-cyan-300">{inspectingExec.company} • {inspectingExec.industry || 'Tech'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email Address:</span>
                <span className="text-slate-200">{inspectingExec.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-emerald-300">{accessLogs[inspectingExec.id]?.replyTimestamp || 'Today'}</span>
              </div>
            </div>

            {/* Interactive Message Thread Display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-purple-300 font-bold block">
                  Subject: {accessLogs[inspectingExec.id]?.replySubject || 'Re: Executive Briefing'}
                </span>
                <span className="text-[10px] font-mono text-cyan-400">
                  {(messageThreads[inspectingExec.id] || []).length} Messages in Thread
                </span>
              </div>

              {/* Message Thread Container */}
              <div className="bg-navy-950/90 rounded-xl p-4 border border-purple-500/20 max-h-60 overflow-y-auto custom-scrollbar space-y-3 text-xs">
                {(messageThreads[inspectingExec.id] && messageThreads[inspectingExec.id].length > 0) ? (
                  messageThreads[inspectingExec.id].map((msg) => (
                    <div 
                      key={msg.id}
                      className={`p-3 rounded-xl border ${
                        msg.sender === 'user'
                          ? 'bg-cyan-500/10 border-cyan-500/30 ml-6 text-cyan-100'
                          : 'bg-purple-500/10 border-purple-500/30 mr-6 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1 font-bold">
                        <span className={msg.sender === 'user' ? 'text-cyan-300' : 'text-purple-300'}>
                          {msg.senderName}
                        </span>
                        <span className="text-slate-400">{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed font-sans">{msg.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-200">
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1 font-bold text-purple-300">
                      <span>{inspectingExec.fullName}</span>
                      <span>{accessLogs[inspectingExec.id]?.replyTimestamp || 'Today'}</span>
                    </div>
                    <p className="leading-relaxed font-sans font-medium">"{accessLogs[inspectingExec.id]?.replyBody}"</p>
                  </div>
                )}
              </div>

              {/* Interactive Direct Reply / Update Input Box */}
              <div className="space-y-2 pt-1">
                {updateSentBanner && (
                  <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center space-x-2 animate-[fadeIn_0.2s_ease-out_1]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Update Dispatched! Executive and Client records synchronized.</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyInputText}
                    onChange={(e) => setReplyInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && replyInputText.trim()) {
                        handleSendDirectUpdate(inspectingExec.id, inspectingExec.fullName);
                      }
                    }}
                    placeholder={`Write direct update to ${inspectingExec.fullName}...`}
                    className="flex-1 bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                  />
                  <button
                    onClick={() => handleSendDirectUpdate(inspectingExec.id, inspectingExec.fullName)}
                    disabled={!replyInputText.trim()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 text-navy-950 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-xs font-mono font-bold transition-all flex items-center space-x-1.5 shrink-0 shadow-md shadow-cyan-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Update</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => {
                  const exactText = accessLogs[inspectingExec.id]?.replyBody || '';
                  const fullCopy = `From: ${inspectingExec.fullName} <${inspectingExec.email}>\nSubject: ${accessLogs[inspectingExec.id]?.replySubject || 'Executive Reply'}\n\n${exactText}`;
                  navigator.clipboard.writeText(fullCopy);
                  setCopiedMessageId(inspectingExec.id);
                  setTimeout(() => setCopiedMessageId(null), 2500);
                }}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 border border-white/10 transition-all"
              >
                {copiedMessageId === inspectingExec.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Exact Message Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Exact Message</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2">
                {onComposeEmail && (
                  <button
                    onClick={() => {
                      onComposeEmail(
                        inspectingExec,
                        `Re: ${accessLogs[inspectingExec.id]?.replySubject || 'Executive Briefing'}`,
                        `Hi ${inspectingExec.fullName},\n\nThank you for reaching out regarding our solutions for ${inspectingExec.company}.`
                      );
                      setInspectingExec(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </button>
                )}

                {onScheduleMeeting && (
                  <button
                    onClick={() => {
                      onScheduleMeeting(inspectingExec);
                      setInspectingExec(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 text-navy-950 hover:bg-emerald-400 text-xs font-bold transition-all flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Meeting</span>
                  </button>
                )}

                <button
                  onClick={() => setInspectingExec(null)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
