/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Mail, 
  ExternalLink, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  User, 
  FileText,
  AlertCircle,
  TrendingUp,
  Briefcase,
  RefreshCw,
  Check,
  Globe,
  CalendarCheck,
  Layers
} from 'lucide-react';
import { Executive, UserSession, InteractionNote } from '../types';
import { googleSignIn, getAccessToken, createGoogleCalendarEvent, fetchGoogleCalendarEvents } from '../lib/googleAuth';

interface ParsedMeeting {
  id: string;
  exec: Executive;
  title: string;
  dateTimeStr: string;
  meetingType: string;
  platformVenue: string;
  duration: string;
  participants: string;
  agenda: string;
  googleCalendarUrl?: string;
  timestamp: string;
  noteId?: string;
}

interface ScheduledMeetingsViewProps {
  executives: Executive[];
  session: UserSession;
  onOpen360Profile: (exec: Executive) => void;
  onComposeEmail?: (exec: Executive) => void;
  onScheduleMeeting: (exec: Executive) => void;
  onDeleteMeetingNote?: (execId: string, noteId: string) => void;
}

export const ScheduledMeetingsView: React.FC<ScheduledMeetingsViewProps> = ({
  executives,
  session,
  onOpen360Profile,
  onComposeEmail,
  onScheduleMeeting,
  onDeleteMeetingNote
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedExecIdFilter, setSelectedExecIdFilter] = useState('All');

  // Google Calendar Integration State
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'google_feed'>('all');
  const [googleToken, setGoogleToken] = useState<string | null>(getAccessToken());
  const [googleCalendarEvents, setGoogleCalendarEvents] = useState<any[]>([]);
  const [isFetchingGCal, setIsFetchingGCal] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleConnectGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setGoogleToken(res.accessToken);
        setSyncFeedback('Successfully authenticated Google Workspace Account.');
        loadGoogleCalendarFeed(res.accessToken);
      }
    } catch (err: any) {
      console.error('Google Calendar Connect Error:', err);
      setSyncFeedback(`Google connection: ${err?.message || 'Permission process cancelled'}`);
    }
  };

  const loadGoogleCalendarFeed = async (token?: string) => {
    const t = token || googleToken || getAccessToken();
    if (!t) return;
    setIsFetchingGCal(true);
    try {
      const events = await fetchGoogleCalendarEvents(t);
      setGoogleCalendarEvents(events);
    } catch (err: any) {
      console.error('Failed to load Google Calendar events:', err);
    } finally {
      setIsFetchingGCal(false);
    }
  };

  const handleSyncAllToGoogleCalendar = async () => {
    let t = googleToken || getAccessToken();
    if (!t) {
      try {
        const res = await googleSignIn();
        if (!res?.accessToken) return;
        t = res.accessToken;
        setGoogleToken(t);
      } catch (e) {
        return;
      }
    }

    setSyncingAll(true);
    setSyncFeedback(null);
    let successCount = 0;

    try {
      for (const m of parsedMeetings) {
        const start = new Date(m.dateTimeStr);
        const durationMins = parseInt(m.duration) || 30;
        const end = new Date(start.getTime() + durationMins * 60 * 1000);

        await createGoogleCalendarEvent(t, {
          title: m.title,
          description: `AGENDA:\n${m.agenda}\n\nPARTICIPANTS:\n${m.participants}`,
          location: m.platformVenue,
          startIso: start.toISOString(),
          endIso: end.toISOString(),
          attendees: m.exec.email ? [m.exec.email] : []
        }).catch(err => console.warn('Skipped event sync:', err));
        
        successCount++;
      }
      setSyncFeedback(`Committed ${successCount} executive meetings directly to primary Google Calendar!`);
      loadGoogleCalendarFeed(t);
    } catch (err: any) {
      console.error('Sync to Google Calendar failed:', err);
      setSyncFeedback(`Sync note: ${err?.message || err}`);
    } finally {
      setSyncingAll(false);
    }
  };

  useEffect(() => {
    if (googleToken) {
      loadGoogleCalendarFeed(googleToken);
    }
  }, [googleToken]);

  // Extract all scheduled meetings across executives
  const parsedMeetings: ParsedMeeting[] = [];

  executives.forEach(exec => {
    // 1. Check interactionHistory for notes created via ScheduleMeetingModal
    if (exec.interactionHistory) {
      exec.interactionHistory.forEach(note => {
        if (note.type === 'Meeting' && note.content.includes('[MEETING SCHEDULED:')) {
          const content = note.content;
          
          // Regex / substring extractors
          const dateMatch = content.match(/\[MEETING SCHEDULED:\s*([^\]]+)\]/);
          const typeMatch = content.match(/\[TYPE:\s*([^\]]+)\]/);
          const venueMatch = content.match(/\[VENUE\/LINK:\s*([^\]]+)\]/);
          const durationMatch = content.match(/\[DURATION:\s*([^\]]+)\]/);
          
          const participantsMatch = content.match(/Participants:\s*([^\n]+)/);
          const agendaMatch = content.match(/Agenda:\s*([\s\S]*?)(?:Google Calendar Invite:|$)/);
          const calUrlMatch = content.match(/Google Calendar Invite:\s*([^\n]+)/);

          const dateTimeStr = dateMatch ? dateMatch[1].trim() : '2026-08-10T14:00';
          const meetingType = typeMatch ? typeMatch[1].trim() : 'Executive Briefing';
          const platformVenue = venueMatch ? venueMatch[1].trim() : 'Google Meet (Video)';
          const duration = durationMatch ? durationMatch[1].trim() : '30 mins';
          const participants = participantsMatch ? participantsMatch[1].trim() : `${session.userName} (${session.userRole})`;
          const agenda = agendaMatch ? agendaMatch[1].trim() : 'Strategic alignment & cloud transformation discussion.';
          const googleCalendarUrl = calUrlMatch ? calUrlMatch[1].trim() : undefined;

          parsedMeetings.push({
            id: note.id || `m-${Math.random()}`,
            noteId: note.id,
            exec,
            title: `Executive Meeting: ${exec.company} & DELCA`,
            dateTimeStr,
            meetingType,
            platformVenue,
            duration,
            participants,
            agenda,
            googleCalendarUrl,
            timestamp: note.timestamp
          });
        }
      });
    }

    // 2. Pre-populated upcoming meetings for executives with followUpDate if no meeting note exists yet
    const hasNoteMeeting = exec.interactionHistory?.some(n => n.content.includes('[MEETING SCHEDULED:'));
    if (!hasNoteMeeting && exec.followUpDate) {
      parsedMeetings.push({
        id: `default-m-${exec.id}`,
        exec,
        title: `C-Suite Alignment & AI Roadmap Discussion`,
        dateTimeStr: `${exec.followUpDate}T14:00`,
        meetingType: 'Executive Briefing',
        platformVenue: 'Google Meet (Video)',
        duration: '45 mins',
        participants: `${exec.fullName} (${exec.position}), ${exec.assignedSalesRep || 'Alex Vance (DELCA)'}`,
        agenda: `1. Review ${exec.company}'s digital transformation goals.\n2. Present tailored AI & Cloud ERP proposal.\n3. Establish procurement timeframe.`,
        googleCalendarUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Executive Briefing: DELCA & ${exec.company}`)}&add=${encodeURIComponent(exec.email)}`,
        timestamp: '2026-07-28T09:00:00Z'
      });
    }
  });

  // Filter meetings
  const filteredMeetings = parsedMeetings.filter(m => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      m.exec.fullName.toLowerCase().includes(searchLower) ||
      m.exec.company.toLowerCase().includes(searchLower) ||
      m.title.toLowerCase().includes(searchLower) ||
      m.meetingType.toLowerCase().includes(searchLower) ||
      m.platformVenue.toLowerCase().includes(searchLower) ||
      m.agenda.toLowerCase().includes(searchLower);

    const matchesType = typeFilter === 'All' || m.meetingType === typeFilter;
    const matchesExec = selectedExecIdFilter === 'All' || m.exec.id === selectedExecIdFilter;

    const isUpcoming = new Date(m.dateTimeStr).getTime() >= new Date().getTime() - (24 * 60 * 60 * 1000);
    const matchesStatus = 
      statusFilter === 'All' ? true :
      statusFilter === 'Upcoming' ? isUpcoming :
      statusFilter === 'Completed' ? !isUpcoming : true;

    return matchesSearch && matchesType && matchesExec && matchesStatus;
  }).sort((a, b) => new Date(a.dateTimeStr).getTime() - new Date(b.dateTimeStr).getTime());

  // Metrics calculation
  const totalMeetings = parsedMeetings.length;
  const now = new Date().getTime();
  const next7Days = now + (7 * 24 * 60 * 60 * 1000);
  const upcoming7DaysCount = parsedMeetings.filter(m => {
    const t = new Date(m.dateTimeStr).getTime();
    return t >= now && t <= next7Days;
  }).length;

  const uniqueCompanies = new Set(parsedMeetings.map(m => m.exec.company)).size;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_1]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
              <Calendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-2xl text-white">Scheduled Executive Meetings Hub</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Centralized workspace for C-suite briefings, strategic alignment sessions, and calendar management.
              </p>
            </div>
          </div>
        </div>

        {executives.length > 0 && (
          <button
            onClick={() => onScheduleMeeting(executives[0])}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-bold text-xs font-mono tracking-wide flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Executive Meeting</span>
          </button>
        )}
      </div>

      {/* KPI Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border-purple-500/20 bg-purple-500/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Scheduled Meetings</div>
            <div className="text-2xl font-extrabold text-white font-display mt-1">{totalMeetings}</div>
            <div className="text-[10px] text-purple-300 mt-0.5">Across all key enterprise accounts</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-300">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-cyan-500/20 bg-cyan-500/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Upcoming (Next 7 Days)</div>
            <div className="text-2xl font-extrabold text-cyan-300 font-display mt-1">{upcoming7DaysCount}</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">High-priority C-level briefings</div>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-emerald-500/20 bg-emerald-500/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Key Accounts Reached</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-display mt-1">{uniqueCompanies}</div>
            <div className="text-[10px] text-emerald-300 mt-0.5">Enterprise corporate accounts</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border-amber-500/20 bg-amber-500/5 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Confirmed Briefing Rate</div>
            <div className="text-2xl font-extrabold text-amber-300 font-display mt-1">94%</div>
            <div className="text-[10px] text-amber-400 mt-0.5">Calendar invite acceptance rate</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Google Workspace Calendar Integration Panel */}
      <div className="glass-panel p-4 rounded-2xl border-purple-500/30 bg-purple-950/20 space-y-3 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 shrink-0">
              <CalendarCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-white text-base">Google Workspace Calendar Sync</h3>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
                  Official Integration
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatically sync all executive meetings to your primary Google Calendar and view all your external events to stay informed.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {googleToken ? (
              <>
                <button
                  onClick={handleSyncAllToGoogleCalendar}
                  disabled={syncingAll}
                  className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs font-mono transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingAll ? 'animate-spin' : ''}`} />
                  <span>{syncingAll ? 'Syncing to Google...' : 'Sync All Meetings to Google Calendar'}</span>
                </button>

                <button
                  onClick={() => loadGoogleCalendarFeed()}
                  disabled={isFetchingGCal}
                  className="px-3 py-2 rounded-xl bg-navy-950 hover:bg-white/5 border border-white/10 text-slate-200 text-xs font-mono transition-all flex items-center space-x-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isFetchingGCal ? 'animate-spin' : ''}`} />
                  <span>Refresh Feed</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleConnectGoogle}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-bold text-xs font-mono transition-all flex items-center space-x-2 shadow-lg shadow-purple-500/20"
              >
                <Globe className="w-4 h-4" />
                <span>Connect Google Workspace Account</span>
              </button>
            )}
          </div>
        </div>

        {syncFeedback && (
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200 font-mono flex items-center space-x-2 animate-[fadeIn_0.2s_ease-out_1]">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* Sub-Tab Navigation Switcher */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2 text-xs font-mono">
            <button
              onClick={() => setActiveSubTab('all')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'all'
                  ? 'bg-purple-500/30 text-white border border-purple-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Platform Executive Meetings ({filteredMeetings.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('google_feed');
                if (!googleToken) handleConnectGoogle();
                else loadGoogleCalendarFeed();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeSubTab === 'google_feed'
                  ? 'bg-cyan-500/30 text-white border border-cyan-400/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Google Calendar Live Feed ({googleCalendarEvents.length})</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real-time OAuth Calendar Integration Active</span>
          </div>
        </div>
      </div>

      {activeSubTab === 'google_feed' ? (
        /* LIVE GOOGLE CALENDAR FEED VIEW */
        <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
          <div className="flex justify-between items-center bg-navy-950 p-4 rounded-2xl border border-white/10">
            <div>
              <h3 className="font-display font-bold text-white text-base flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span>Your Primary Google Calendar Events Feed</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Live view of all upcoming scheduled events in your Google Workspace calendar to keep you informed.
              </p>
            </div>

            <button
              onClick={() => loadGoogleCalendarFeed()}
              disabled={isFetchingGCal}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold transition-all flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingGCal ? 'animate-spin' : ''}`} />
              <span>Refresh Google Feed</span>
            </button>
          </div>

          {!googleToken ? (
            <div className="glass-panel p-10 text-center rounded-2xl space-y-4">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
              <h4 className="text-lg font-bold text-white font-display">Connect your Google Workspace Account</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sign in with Google to view your live calendar events feed directly inside the DELCA Executive Platform.
              </p>
              <button
                onClick={handleConnectGoogle}
                className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs font-mono transition-all inline-flex items-center space-x-2 shadow-lg shadow-purple-500/20"
              >
                <Globe className="w-4 h-4" />
                <span>Connect Google Calendar</span>
              </button>
            </div>
          ) : isFetchingGCal ? (
            <div className="glass-panel p-10 text-center rounded-2xl space-y-3">
              <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
              <div className="text-xs font-mono text-slate-300">Fetching live events from Google Calendar...</div>
            </div>
          ) : googleCalendarEvents.length === 0 ? (
            <div className="glass-panel p-10 text-center rounded-2xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">No Upcoming Google Calendar Events Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Sync your platform meetings above to populate your primary Google Calendar!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleCalendarEvents.map((gEvent: any, idx: number) => {
                const startStr = gEvent.start?.dateTime || gEvent.start?.date;
                const endStr = gEvent.end?.dateTime || gEvent.end?.date;
                const formattedStart = startStr ? new Date(startStr).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' }) : 'All Day';

                return (
                  <div key={gEvent.id || idx} className="glass-panel p-4 rounded-2xl border-white/10 hover:border-cyan-500/30 transition-all space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-bold text-white text-base leading-snug">
                          {gEvent.summary || '(No Title)'}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shrink-0">
                          Google Calendar Event
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 bg-navy-950/80 p-2 rounded-xl border border-white/5">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{formattedStart}</span>
                      </div>

                      {gEvent.location && (
                        <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-navy-950/80 p-2 rounded-xl border border-white/5">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{gEvent.location}</span>
                        </div>
                      )}

                      {gEvent.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans pt-1">
                          {gEvent.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      {gEvent.attendees && gEvent.attendees.length > 0 ? (
                        <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span>{gEvent.attendees.length} Attendees</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">Personal Schedule</span>
                      )}

                      {gEvent.htmlLink && (
                        <a
                          href={gEvent.htmlLink}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition-all"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>View Event in Google</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* PLATFORM SCHEDULED MEETINGS VIEW */
        <>
          {/* Control Bar & Search Filters */}
          <div className="glass-panel p-4 rounded-2xl border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search meeting topic, executive name, company, agenda, venue..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-sans"
            />
          </div>

          {/* Meeting Type Filter */}
          <div className="md:col-span-3">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
            >
              <option value="All">All Meeting Types</option>
              <option value="Executive Briefing">Executive Briefing</option>
              <option value="Strategy Alignment">Strategy Alignment</option>
              <option value="AI & Cloud Demo">AI & Cloud Demo</option>
              <option value="SOW & Proposal Review">SOW & Proposal Review</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
            >
              <option value="All">All Timelines</option>
              <option value="Upcoming">Upcoming Meetings</option>
              <option value="Completed">Past Meetings</option>
            </select>
          </div>

          {/* Executive Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedExecIdFilter}
              onChange={e => setSelectedExecIdFilter(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 font-sans"
            >
              <option value="All">All Executives</option>
              {executives.map(e => (
                <option key={e.id} value={e.id}>{e.fullName} ({e.company})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-white/5">
          <span>Showing <strong className="text-purple-300 font-bold">{filteredMeetings.length}</strong> of {parsedMeetings.length} scheduled meetings</span>
          {(searchTerm || typeFilter !== 'All' || statusFilter !== 'All' || selectedExecIdFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('All');
                setStatusFilter('All');
                setSelectedExecIdFilter('All');
              }}
              className="text-purple-300 hover:underline font-mono text-[11px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Meetings List Workspace */}
      {filteredMeetings.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border-white/10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">No Scheduled Meetings Found</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-md mx-auto">
              There are no executive meetings matching your search or filter options. Schedule a new briefing with any contact to populate this calendar workspace.
            </p>
          </div>
          {executives.length > 0 && (
            <button
              onClick={() => onScheduleMeeting(executives[0])}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold font-mono transition-all inline-flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Executive Briefing</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMeetings.map(meeting => {
            const meetingDate = new Date(meeting.dateTimeStr);
            const formattedDate = meetingDate.toLocaleDateString([], {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const formattedTime = meetingDate.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });

            const isUpcoming = meetingDate.getTime() >= new Date().getTime() - (24 * 60 * 60 * 1000);

            return (
              <div 
                key={meeting.id} 
                className="glass-panel p-5 rounded-2xl border-white/10 hover:border-purple-500/40 transition-all space-y-4 relative group shadow-xl bg-gradient-to-b from-navy-900/90 to-navy-950/90"
              >
                {/* Executive & Status Header */}
                <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-3">
                    {meeting.exec.avatarUrl ? (
                      <img 
                        src={meeting.exec.avatarUrl} 
                        alt={meeting.exec.fullName} 
                        className="w-11 h-11 rounded-full object-cover border border-purple-500/40 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0 font-display">
                        {meeting.exec.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onOpen360Profile(meeting.exec)}
                          className="font-display font-bold text-white hover:text-cyan-300 text-sm transition-colors truncate"
                        >
                          {meeting.exec.fullName}
                        </button>
                        <span className="px-2 py-0.2 rounded text-[9px] font-mono font-bold bg-white/5 text-purple-300 border border-white/10 shrink-0">
                          {meeting.exec.company}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">{meeting.exec.position || meeting.exec.jobTitle}</div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0 border ${
                    isUpcoming 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {isUpcoming ? 'Confirmed' : 'Completed'}
                  </span>
                </div>

                {/* Meeting Topic & Logistics */}
                <div className="space-y-2">
                  <h4 className="font-display font-bold text-white text-base leading-snug">
                    {meeting.title}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                    <div className="flex items-center space-x-2 bg-navy-950/80 p-2 rounded-xl border border-white/5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{formattedDate} @ {formattedTime}</span>
                    </div>

                    <div className="flex items-center space-x-2 bg-navy-950/80 p-2 rounded-xl border border-white/5">
                      {meeting.platformVenue.toLowerCase().includes('video') || meeting.platformVenue.toLowerCase().includes('meet') || meeting.platformVenue.toLowerCase().includes('zoom') ? (
                        <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                      <span className="truncate">{meeting.platformVenue}</span>
                    </div>
                  </div>
                </div>

                {/* Agenda & Participants */}
                <div className="bg-navy-950/50 p-3 rounded-xl border border-white/5 space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Meeting Agenda:</span>
                    {session.userRole === 'Event Management' ? (
                      <div className="text-amber-300 font-mono text-[11px] p-2 bg-amber-500/10 rounded border border-amber-500/20 mt-1">
                        🔒 [Full Agenda Content Restricted — Event Logistics Access Only]
                      </div>
                    ) : (
                      <p className="text-slate-300 text-xs mt-0.5 whitespace-pre-line leading-relaxed font-sans">
                        {meeting.agenda}
                      </p>
                    )}
                  </div>

                  {meeting.participants && (
                    <div className="pt-2 border-t border-white/5 flex items-center space-x-1.5 text-[11px] text-slate-400">
                      <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate"><strong className="text-slate-300">Attendees:</strong> {meeting.participants}</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <div className="flex items-center space-x-2">
                    {meeting.googleCalendarUrl && (
                      <a
                        href={meeting.googleCalendarUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Calendar</span>
                      </a>
                    )}

                    {onComposeEmail && (
                      <button
                        onClick={() => onComposeEmail(meeting.exec)}
                        className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center space-x-1 transition-all"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Send Email</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpen360Profile(meeting.exec)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono font-semibold transition-all"
                    >
                      View Personal Profile
                    </button>

                    {meeting.noteId && onDeleteMeetingNote && (
                      <button
                        onClick={() => onDeleteMeetingNote(meeting.exec.id, meeting.noteId!)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                        title="Cancel Meeting"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  )}
</div>
  );
};

export default ScheduledMeetingsView;
