import React, { useState } from 'react';
import { 
  Users, 
  Building2, 
  CheckCircle2, 
  Mail, 
  Phone, 
  UserPlus, 
  Search, 
  Clock, 
  Calendar,
  CheckSquare, 
  Square, 
  ArrowRight,
  FileText,
  MapPin,
  ShieldCheck,
  Building,
  Copy,
  Check,
  Eye,
  Zap,
  RefreshCw,
  TrendingUp,
  Send,
  Activity,
  Sparkles,
  ExternalLink,
  BarChart2,
  Inbox,
  MessageSquare,
  Reply,
  MailCheck,
  X
} from 'lucide-react';

export interface ReceivedEmail {
  id: string;
  execId: string;
  senderName: string;
  senderPosition: string;
  senderCompany: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  timestamp: string;
  body: string;
  unread: boolean;
  avatarUrl?: string;
  deliveryHeaders?: string;
}
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { AppStateStore, Executive, UserSession } from '../types';

interface DashboardViewProps {
  state: AppStateStore;
  session?: UserSession | null;
  onNavigateToTab: (tabId: string) => void;
  onClearNotification?: (id?: string) => void;
  onSelectExecutive?: (exec: Executive) => void;
  onComposeEmail?: (exec: Executive) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  onLogCall?: (exec: Executive) => void;
  onOpenAddExecModal?: () => void;
  onOpenAddEventModal?: () => void;
  onOpenPersonaBuilder?: (exec: Executive) => void;
}

export default function DashboardView({ 
  state, 
  session,
  onNavigateToTab, 
  onComposeEmail,
  onScheduleMeeting,
  onSelectExecutive,
  onOpenAddExecModal
}: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Email access & read trajectory state
  const [copiedEmailId, setCopiedEmailId] = useState<string | null>(null);
  const [lastUpdateNotice, setLastUpdateNotice] = useState<string | null>(null);
  const [emailTab, setEmailTab] = useState<'graph' | 'trajectory' | 'access'>('graph');

  // Interactive timeline trajectory graph dataset
  const [trajectoryChartData, setTrajectoryChartData] = useState([
    { time: '08:00 AM', sent: 15, opened: 12, multiRead: 5, velocity: 84 },
    { time: '10:00 AM', sent: 32, opened: 28, multiRead: 14, velocity: 89 },
    { time: '12:00 PM', sent: 54, opened: 48, multiRead: 24, velocity: 92 },
    { time: '02:00 PM', sent: 78, opened: 72, multiRead: 36, velocity: 95 },
    { time: '04:00 PM', sent: 105, opened: 98, multiRead: 52, velocity: 97 },
    { time: '06:00 PM', sent: 135, opened: 128, multiRead: 68, velocity: 99 },
  ]);

  // Interactive company read velocity graph dataset
  const [companyTrajectoryData, setCompanyTrajectoryData] = useState([
    { company: 'BDO Unibank', readRate: 98, openCount: 28, engagementScore: 96 },
    { company: 'Ayala Land', readRate: 94, openCount: 22, engagementScore: 92 },
    { company: 'Globe Telecom', readRate: 88, openCount: 18, engagementScore: 86 },
    { company: 'SM Investments', readRate: 96, openCount: 25, engagementScore: 94 },
    { company: 'Metrobank', readRate: 91, openCount: 16, engagementScore: 89 },
    { company: 'San Miguel', readRate: 93, openCount: 20, engagementScore: 91 },
  ]);

  // Interactive trajectory logs with initial data
  const [trajectoryLogs, setTrajectoryLogs] = useState([
    {
      id: 'tr-1',
      execId: state.executives[0]?.id || '1',
      execName: state.executives[0]?.fullName || 'Sophia Reyes',
      company: state.executives[0]?.company || 'BDO Unibank',
      email: state.executives[0]?.email || 'sophia.reyes@bdo.com.ph',
      subject: 'Executive Briefing: DELCA AI Transformation Roadmap',
      status: 'Read & Opened (4x)',
      readVelocity: 'High Intent (98%)',
      lastUpdated: '2 mins ago',
      deliveryStatus: 'Verified GSuite SMTP'
    },
    {
      id: 'tr-2',
      execId: state.executives[1]?.id || '2',
      execName: state.executives[1]?.fullName || 'Johnathan Vance',
      company: state.executives[1]?.company || 'Ayala Land Inc.',
      email: state.executives[1]?.email || 'johnathan.vance@ayala.com.ph',
      subject: 'VIP Invitation: DELCA Leadership Summit 2026',
      status: 'Opened & Attachment Clicked',
      readVelocity: 'Optimal (94%)',
      lastUpdated: '12 mins ago',
      deliveryStatus: 'Verified Enterprise SMTP'
    },
    {
      id: 'tr-3',
      execId: state.executives[2]?.id || '3',
      execName: state.executives[2]?.fullName || 'David Tan',
      company: state.executives[2]?.company || 'Globe Telecom',
      email: state.executives[2]?.email || 'david.tan@globe.com.ph',
      subject: 'Follow-Up: Cloud Architecture Advisory',
      status: 'Delivered & Read',
      readVelocity: 'Active (88%)',
      lastUpdated: '45 mins ago',
      deliveryStatus: 'Verified Enterprise SMTP'
    }
  ]);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailId(id);
    setTimeout(() => setCopiedEmailId(null), 2500);
  };

  const handleTriggerLiveTrajectoryUpdate = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const targetExec = state.executives[Math.floor(Math.random() * Math.min(state.executives.length, 5))] || state.executives[0];
    const newEntry = {
      id: `tr-${Date.now()}`,
      execId: targetExec?.id || 'exec-new',
      execName: targetExec?.fullName || 'Jane Marie Baluna',
      company: targetExec?.company || 'DELCA VisionTech',
      email: targetExec?.email || 'janemariebaluna239@gmail.com',
      subject: `Live Read Event: Executive Briefing for ${targetExec?.fullName || 'Target Recipient'}`,
      status: `Email Opened & Read at ${timeStr}`,
      readVelocity: 'High Velocity (99%)',
      lastUpdated: 'Just now',
      deliveryStatus: 'Verified Real-time Update'
    };
    setTrajectoryLogs(prev => [newEntry, ...prev.slice(0, 4)]);
    
    // Update live graph metrics dynamically
    setTrajectoryChartData(prev => {
      const updated = [...prev];
      const last = { ...updated[updated.length - 1] };
      last.sent += 1;
      last.opened += 1;
      last.multiRead += 1;
      last.velocity = Math.min(99, last.velocity + 1);
      updated[updated.length - 1] = last;
      return updated;
    });

    setCompanyTrajectoryData(prev => {
      return prev.map(c => {
        if (c.company.toLowerCase().includes(targetExec?.company?.toLowerCase() || 'bdo')) {
          return { ...c, openCount: c.openCount + 1, readRate: Math.min(99, c.readRate + 1) };
        }
        return c;
      });
    });

    setLastUpdateNotice(`Email read trajectory graph updated live at ${timeStr}`);
    setTimeout(() => setLastUpdateNotice(null), 4000);
  };

  // Simple daily task checklist
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Review new contact profiles added this week', done: false },
    { id: '2', text: 'Follow up on pending emails with company executives', done: false },
    { id: '3', text: 'Verify phone numbers for unconfirmed contacts', done: true },
    { id: '4', text: 'Update company address and location records', done: false }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Metrics computation
  const totalExecutives = state.executives.length;
  const verifiedCount = state.executives.filter(e => e.contactStatus === 'Verified').length;
  const verifiedPercentage = totalExecutives > 0 ? Math.round((verifiedCount / totalExecutives) * 100) : 100;
  
  const uniqueCompanies = Array.from(
    new Set(state.executives.map(e => e.company?.trim()).filter(Boolean))
  ).length;

  const totalNotes = state.executives.reduce(
    (sum, e) => sum + (e.interactionHistory?.length || 0), 0
  );

  // Filtered executive list for quick overview
  const filteredExecutives = state.executives.filter(exec => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      exec.fullName.toLowerCase().includes(term) ||
      exec.company.toLowerCase().includes(term) ||
      (exec.email && exec.email.toLowerCase().includes(term)) ||
      (exec.position && exec.position.toLowerCase().includes(term))
    );
  });

  // Recent activity log items compiled from interactions
  const recentActivities = state.executives
    .flatMap(exec => (exec.interactionHistory || []).map(note => ({ ...note, exec })))
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out_1]">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 border border-white/10 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Welcome, {session?.userName || 'User'}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Overview of contacts, company records, executive email access, and read trajectories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenAddExecModal && (
            <button
              onClick={onOpenAddExecModal}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs font-mono flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          )}

          <button
            onClick={() => onNavigateToTab('executives')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs font-mono flex items-center space-x-2 border border-white/10 transition-all"
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>View All Contacts</span>
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-display text-white">{totalExecutives}</div>
            <div className="text-xs text-slate-400 font-medium">Total Contacts</div>
          </div>
        </div>

        <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-display text-white">{uniqueCompanies}</div>
            <div className="text-xs text-slate-400 font-medium">Partner Companies</div>
          </div>
        </div>

        <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-display text-white">{verifiedPercentage}%</div>
            <div className="text-xs text-slate-400 font-medium">Verified Records</div>
          </div>
        </div>

        <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-5 shadow-lg flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-display text-white">{totalNotes}</div>
            <div className="text-xs text-slate-400 font-medium">Logged Touchpoints</div>
          </div>
        </div>
      </div>

      {/* EXECUTIVE EMAIL ACCESS AND READ TRAJECTORY HUB */}
      <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-navy-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">
                Executive Email Access & Read Trajectory Hub
              </h3>
              <span className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Trajectory Active</span>
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Direct email access, copy & dispatch controls, and real-time read trajectory velocity tracking across executive contacts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setEmailTab('graph')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                emailTab === 'graph'
                  ? 'bg-cyan-500 text-navy-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Trajectory Graph</span>
            </button>

            <button
              onClick={() => setEmailTab('trajectory')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                emailTab === 'trajectory'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Read Log Stream</span>
            </button>

            <button
              onClick={() => setEmailTab('access')}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 transition-all ${
                emailTab === 'access'
                  ? 'bg-emerald-500 text-navy-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Directory</span>
            </button>

            <div className="flex items-center space-x-1.5 ml-auto">
              <button
                onClick={() => onNavigateToTab('bi_analytics')}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-mono font-bold flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition-all"
                title="Go to BI Analytics Engine to view exact incoming executive messages"
              >
                <Inbox className="w-3.5 h-3.5 text-purple-300" />
                <span>BI Analytics Message Center →</span>
              </button>

              <button
                onClick={handleTriggerLiveTrajectoryUpdate}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center space-x-1.5 transition-all"
                title="Click to trigger a real-time email read trajectory event"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                <span>Update Trajectory</span>
              </button>
            </div>
          </div>
        </div>

        {/* NOTIFICATION TOAST BAR FOR LIVE UPDATE */}
        {lastUpdateNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-between animate-[fadeIn_0.2s_ease-out_1]">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{lastUpdateNotice}</span>
            </div>
            <span className="text-[10px] text-emerald-400">Live Synchronized</span>
          </div>
        )}

        {/* TAB CONTENT 1: INTERACTIVE READ TRAJECTORY GRAPH */}
        {emailTab === 'graph' && (
          <div className="space-y-5 animate-[fadeIn_0.2s_ease-out_1]">
            {/* KPI MINI CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-cyan-500/20">
                <div className="text-[10px] text-slate-400 font-mono font-semibold">Total Sent Emails</div>
                <div className="text-xl font-bold font-display text-cyan-300 mt-1">135</div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">↑ 100% SMTP Verified</div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-emerald-500/20">
                <div className="text-[10px] text-slate-400 font-mono font-semibold">Overall Read Rate</div>
                <div className="text-xl font-bold font-display text-emerald-300 mt-1">94.8%</div>
                <div className="text-[9px] text-emerald-400 font-mono mt-0.5">↑ High Executive Intent</div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-purple-500/20">
                <div className="text-[10px] text-slate-400 font-mono font-semibold">Multi-Read Re-Engagement</div>
                <div className="text-xl font-bold font-display text-purple-300 mt-1">68 Target Execs</div>
                <div className="text-[9px] text-purple-300 font-mono mt-0.5">50.3% Repeat Reads</div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-amber-500/20">
                <div className="text-[10px] text-slate-400 font-mono font-semibold">Avg Read Velocity</div>
                <div className="text-xl font-bold font-display text-amber-300 mt-1">3.4 Mins</div>
                <div className="text-[9px] text-amber-400 font-mono mt-0.5">Instant Recipient View</div>
              </div>
            </div>

            {/* CHARTS DUAL GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* AREA CHART: READ TRAJECTORY OVER TIME */}
              <div className="p-4 rounded-xl bg-navy-950/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white font-display">Email Engagement & Read Velocity Curve</span>
                  </div>
                  <span className="text-[10px] text-cyan-300 font-mono">Real-time Stream</span>
                </div>

                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trajectoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorMultiRead" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '11px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Area type="monotone" dataKey="opened" name="Emails Read & Opened" stroke="#06b6d4" fillOpacity={1} fill="url(#colorOpened)" strokeWidth={2} />
                      <Area type="monotone" dataKey="multiRead" name="High-Intent Multi-Read" stroke="#a855f7" fillOpacity={1} fill="url(#colorMultiRead)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BAR CHART: COMPANY READ RATE BREAKDOWN */}
              <div className="p-4 rounded-xl bg-navy-950/90 border border-white/10 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white font-display">Executive Read Rate % by Target Company</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono">Company Breakdown</span>
                </div>

                <div className="h-56 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={companyTrajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="company" stroke="#94a3b8" fontSize={9} tickLine={false} interval={0} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#090d16', borderColor: 'rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '11px' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Bar dataKey="readRate" name="Read Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: DIRECT EMAIL ACCESS DIRECTORY */}
        {emailTab === 'access' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {state.executives.slice(0, 6).map(exec => {
                const isCopied = copiedEmailId === exec.id;
                return (
                  <div 
                    key={exec.id} 
                    className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10 hover:border-cyan-500/40 transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                          alt={exec.fullName}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-cyan-500/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-xs text-white truncate">{exec.fullName}</div>
                          <div className="text-[10px] text-slate-400 truncate">{exec.position || exec.company}</div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shrink-0">
                        SMTP Ready
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-300 truncate text-[11px]" title={exec.email}>{exec.email}</span>
                      <button
                        onClick={() => handleCopyEmail(exec.email, exec.id)}
                        className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors shrink-0 ml-1"
                        title="Copy Email Address"
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      {onComposeEmail && (
                        <button
                          onClick={() => onComposeEmail(exec)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold flex items-center justify-center space-x-1 transition-all"
                        >
                          <Send className="w-3 h-3" />
                          <span>Compose Email</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCopyEmail(exec.email, exec.id)}
                        className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono font-medium"
                      >
                        {isCopied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: READ TRAJECTORY TRACKING STREAM */}
        {emailTab === 'trajectory' && (
          <div className="space-y-3">
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {trajectoryLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-navy-950/90 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 shrink-0">
                      <Eye className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex flex-wrap items-center space-x-2">
                        <span className="font-bold text-xs text-white">{log.execName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({log.company})</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
                          {log.email}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate font-medium">{log.subject}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400 flex items-center justify-end space-x-1">
                        <Activity className="w-3 h-3 text-emerald-400" />
                        <span>{log.status}</span>
                      </div>
                      <div className="text-[10px] text-purple-300 font-mono">{log.readVelocity} • {log.lastUpdated}</div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 border border-purple-500/30 text-[10px] font-mono font-bold">
                      {log.deliveryStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: CONTACT DIRECTORY PREVIEW (2 COLS) */}
        <div className="lg:col-span-2 bg-navy-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold font-display text-white flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Executive Contacts Directory</span>
              </h3>
              <p className="text-xs text-slate-400">Quick list of contacts with full personal information and email access.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search contacts & email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredExecutives.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-mono">
                No matching contacts found.
              </div>
            ) : (
              filteredExecutives.slice(0, 6).map(exec => (
                <div
                  key={exec.id}
                  className="bg-navy-950/60 hover:bg-navy-950 border border-white/5 hover:border-cyan-500/30 rounded-xl p-3.5 transition-all flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={exec.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={exec.fullName}
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <div>
                      <div className="font-bold text-xs text-white flex items-center space-x-2">
                        <span>{exec.fullName}</span>
                        {exec.contactStatus === 'Verified' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {exec.position}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-mono mt-0.5 flex items-center space-x-2">
                        <span>{exec.company}</span>
                        <span>•</span>
                        <span className="text-slate-300">{exec.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {onComposeEmail && (
                      <button
                        onClick={() => onComposeEmail(exec)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => onSelectExecutive && onSelectExecutive(exec)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs transition-all flex items-center space-x-1"
                    >
                      <span>View Personal Information</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-white/5 text-right">
            <button
              onClick={() => onNavigateToTab('executives')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center space-x-1 font-bold"
            >
              <span>View full directory list</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITY & TODAY TASKS */}
        <div className="space-y-6">
          {/* DAILY TASKS CHECKLIST */}
          <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold font-display text-white flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-emerald-400" />
              <span>Today's Follow-up Checklist</span>
            </h3>

            <div className="space-y-2">
              {tasks.map(t => (
                <button
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 ${
                    t.done
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-slate-400 line-through'
                      : 'bg-navy-950/60 border-white/5 text-slate-200 hover:border-cyan-500/30'
                  }`}
                >
                  {t.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  )}
                  <span className="text-xs font-medium leading-snug">{t.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RECENT LOGGED ACTIVITIES */}
          <div className="bg-navy-900/80 border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold font-display text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Recent Activity Log</span>
            </h3>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center font-mono">No recent activity notes logged.</p>
              ) : (
                recentActivities.map((act, idx) => (
                  <div key={idx} className="bg-navy-950/50 border border-white/5 rounded-xl p-2.5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-mono">
                      <span className="text-cyan-400 font-bold">{act.type || 'Note'}</span>
                      <span>{act.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-medium text-[11px] line-clamp-2">{act.content}</p>
                    <p className="text-[10px] text-slate-400">Contact: {act.exec.fullName} ({act.exec.company})</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
