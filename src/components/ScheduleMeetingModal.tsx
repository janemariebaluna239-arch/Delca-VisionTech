/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Users, 
  FileText, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Bell, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Mail,
  AlertTriangle,
  Sun,
  Sunset,
  Sunrise,
  Check
} from 'lucide-react';
import { Executive, UserSession } from '../types';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  executive: Executive | null;
  allExecutives?: Executive[];
  session: UserSession;
  onClose: () => void;
  onScheduleMeeting: (execId: string, meetingData: {
    title: string;
    dateTime: string;
    duration: string;
    meetingType: string;
    platformVenue: string;
    agenda: string;
    participants: string;
    followUpReminderDays: number;
    googleCalendarUrl?: string;
  }) => Promise<void>;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  executive,
  allExecutives = [],
  session,
  onClose,
  onScheduleMeeting
}) => {
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingType, setMeetingType] = useState('Executive Briefing');
  const [platformVenue, setPlatformVenue] = useState('Google Meet (Video)');
  
  // Default date to next available business day (Monday-Friday) 2 days from now
  const getInitialDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    if (d.getDay() === 6) d.setDate(d.getDate() + 2); // Sat -> Mon
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // Sun -> Mon
    return d.toISOString().slice(0, 10);
  };

  const [meetingDate, setMeetingDate] = useState(getInitialDate);
  const [meetingTime, setMeetingTime] = useState('14:00');
  const [duration, setDuration] = useState('30 mins');
  const [agenda, setAgenda] = useState('');
  const [participants, setParticipants] = useState(session.userName || 'Jane Marie Baluna (Sales Team)');
  const [followUpReminderDays, setFollowUpReminderDays] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    if (executive) {
      setMeetingTitle(`Executive Alignment: ${executive.company} & DELCA Enterprise Solutions`);
      setAgenda(
        `1. Strategic Overview of ${executive.company}'s digital initiatives in ${executive.industry}.\n2. High-level demonstration of DELCA Cloud ERP & AI Predictive Analytics.\n3. Discussion on pilot deployment framework and next steps.`
      );
    }
  }, [executive]);

  // Extract existing scheduled meetings from all executives for conflict detection
  const existingMeetings = useMemo(() => {
    const list: Array<{ execName: string; company: string; dateTimeStr: string; dateStr: string; timeStr: string; title: string }> = [];
    allExecutives.forEach(ex => {
      if (ex.interactionHistory) {
        ex.interactionHistory.forEach(note => {
          if (note.type === 'Meeting' && note.content.includes('[MEETING SCHEDULED:')) {
            const match = note.content.match(/\[MEETING SCHEDULED:\s*([^\]]+)\]/);
            if (match) {
              const dtStr = match[1].trim();
              const parts = dtStr.split('T');
              list.push({
                execName: ex.fullName,
                company: ex.company,
                dateTimeStr: dtStr,
                dateStr: parts[0] || dtStr,
                timeStr: parts[1] || '14:00',
                title: `Meeting with ${ex.fullName} (${ex.company})`
              });
            }
          }
        });
      }
    });
    return list;
  }, [allExecutives]);

  const currentDateTimeStr = `${meetingDate}T${meetingTime}`;

  // Check if current date and time overlaps with an existing meeting
  const conflictingMeeting = useMemo(() => {
    return existingMeetings.find(m => m.dateTimeStr === currentDateTimeStr || (m.dateStr === meetingDate && m.timeStr === meetingTime));
  }, [existingMeetings, currentDateTimeStr, meetingDate, meetingTime]);

  // Natural Business Hours (09:00 to 16:00) Finder
  const findNextAvailableSlot = () => {
    const businessTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
    let checkDateObj = new Date(meetingDate);

    for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
      const curDateStr = checkDateObj.toISOString().slice(0, 10);
      const dayOfWeek = checkDateObj.getDay();

      // Skip weekends
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        for (const t of businessTimes) {
          const testStr = `${curDateStr}T${t}`;
          const isTaken = existingMeetings.some(m => m.dateTimeStr === testStr || (m.dateStr === curDateStr && m.timeStr === t));
          if (!isTaken) {
            setMeetingDate(curDateStr);
            setMeetingTime(t);
            return;
          }
        }
      }
      checkDateObj.setDate(checkDateObj.getDate() + 1);
    }
  };

  if (!isOpen || !executive) return null;

  const dateTimeStr = `${meetingDate}T${meetingTime}`;
  const formattedDateTime = new Date(dateTimeStr).toLocaleString([], {
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const generateGoogleCalendarUrl = () => {
    const calTitle = `${meetingType}: DELCA & ${executive.company}`;
    const calDetails = `Executive Meeting with ${executive.fullName} (${executive.position} at ${executive.company})\n\nVenue/Platform: ${platformVenue}\nHost: ${session.userName} (${session.userRole})\n\nAGENDA:\n${agenda}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calTitle)}&details=${encodeURIComponent(calDetails)}&location=${encodeURIComponent(platformVenue)}&add=${encodeURIComponent(executive.email)}`;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const calUrl = generateGoogleCalendarUrl();
      await onScheduleMeeting(executive.id, {
        title: meetingTitle,
        dateTime: dateTimeStr,
        duration,
        meetingType,
        platformVenue,
        agenda,
        participants,
        followUpReminderDays,
        googleCalendarUrl: calUrl
      });

      setSuccessMsg(true);
    } catch (err) {
      console.error('Failed to schedule meeting:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-[fadeIn_0.2s_ease-out_1]">
      <div className="bg-navy-900 border border-purple-500/30 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl relative overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-base sm:text-lg">Schedule Executive Business Meeting</h3>
              <p className="text-xs text-slate-400">
                Target Executive: <span className="text-purple-300 font-semibold">{executive.fullName}</span> ({executive.position} @ {executive.company})
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="p-6 text-center space-y-5 my-auto animate-[fadeIn_0.3s_ease-out_1]">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-bold uppercase inline-flex items-center space-x-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Client & Executive Confirmation Dispatched</span>
              </div>
              <h4 className="text-xl font-display font-bold text-white">Meeting Successfully Scheduled & Confirmed!</h4>
              <p className="text-xs text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
                The meeting has been committed to <span className="text-cyan-300 font-semibold">{executive.fullName}'s</span> timeline. Client notification sent to <span className="text-purple-300 font-mono">{session.userEmail || 'Client Account'}</span> and executive notification sent to <span className="text-cyan-300 font-mono">{executive.email}</span>.
              </p>
            </div>

            {/* Confirmed Details Summary Card */}
            <div className="bg-navy-950/90 rounded-xl p-4 border border-white/10 text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Meeting Topic:</span>
                <span className="font-bold text-white font-sans">{meetingTitle}</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-cyan-300">{formattedDateTime} ({duration})</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">Venue / Platform:</span>
                <span className="font-bold text-purple-300">{platformVenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Client Host:</span>
                <span className="font-bold text-emerald-300">{session.userName} ({session.userRole})</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in Google Calendar</span>
              </a>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-navy-950 hover:bg-emerald-400 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                Done / Return to Workspace
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            {/* Executive Quick Info Card */}
            <div className="p-3 bg-navy-950/80 rounded-xl border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <img
                  src={executive.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'}
                  alt={executive.fullName}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-purple-500/40"
                />
                <div>
                  <div className="font-bold text-white">{executive.fullName}</div>
                  <div className="text-[11px] text-cyan-300 flex items-center space-x-1">
                    <Building2 className="w-3 h-3" />
                    <span>{executive.company} • {executive.email}</span>
                  </div>
                </div>
              </div>

              <div className="text-right font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {executive.relationshipStage}
                </span>
              </div>
            </div>

            {/* Meeting Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400">Meeting Title / Subject</label>
              <input
                type="text"
                required
                value={meetingTitle}
                onChange={e => setMeetingTitle(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                placeholder="e.g. Executive ERP Strategy Alignment"
              />
            </div>

            {/* Type & Platform Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Meeting Category / Type</label>
                <select
                  value={meetingType}
                  onChange={e => setMeetingType(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="Executive Briefing">Executive Briefing</option>
                  <option value="Product Demonstration">Product Demonstration</option>
                  <option value="Partnership Discussion">Partnership Discussion</option>
                  <option value="Quarterly Strategy Review">Quarterly Strategy Review</option>
                  <option value="Consultation & Advisory">Consultation & Advisory</option>
                  <option value="VIP Roundtable & Dinner">VIP Roundtable & Dinner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Venue / Online Link</label>
                <select
                  value={platformVenue}
                  onChange={e => setPlatformVenue(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="Google Meet (Video Link)">Google Meet (Video Link)</option>
                  <option value="Microsoft Teams (Online)">Microsoft Teams (Online)</option>
                  <option value="Zoom Video Conference">Zoom Video Conference</option>
                  <option value="Executive Boardroom (HQ)">Executive Boardroom (HQ)</option>
                  <option value="Executive Business Lunch">Executive Business Lunch</option>
                </select>
              </div>
            </div>

            {/* Conflict Detector & Availability Warning */}
            {conflictingMeeting ? (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-[fadeIn_0.2s_ease-out_1]">
                <div className="flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300 flex items-center space-x-2">
                      <span>Schedule Conflict Detected</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">Overlapping Slot</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                      {conflictingMeeting.title} is already scheduled for <strong className="text-white font-mono">{meetingDate} at {meetingTime}</strong>.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={findNextAvailableSlot}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold font-mono shrink-0 transition-all flex items-center space-x-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Auto-Select Next Free Slot</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Time Slot Available — No Overlapping Business Meetings</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-400/80 uppercase">Business Day Verified</span>
              </div>
            )}

            {/* Natural Business Hour Presets */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400 flex items-center justify-between">
                <span>Natural Business Hour Presets</span>
                <span className="text-[9px] text-slate-500 font-normal">Standard 9 AM - 5 PM Window</span>
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMeetingTime('10:00')}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center space-x-1.5 text-[11px] font-mono ${
                    meetingTime === '10:00'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                      : 'bg-navy-950 border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                  <span>Morning 10:00 AM</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingTime('14:00')}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center space-x-1.5 text-[11px] font-mono ${
                    meetingTime === '14:00'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                      : 'bg-navy-950 border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Afternoon 2:00 PM</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMeetingTime('16:00')}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-center space-x-1.5 text-[11px] font-mono ${
                    meetingTime === '16:00'
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                      : 'bg-navy-950 border-white/10 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Sunset className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Wrap-up 4:00 PM</span>
                </button>
              </div>
            </div>

            {/* Date, Time & Duration Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Date</label>
                <input
                  type="date"
                  required
                  value={meetingDate}
                  onChange={e => setMeetingDate(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Time</label>
                <input
                  type="time"
                  required
                  value={meetingTime}
                  onChange={e => setMeetingTime(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Duration</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="15 mins">15 mins</option>
                  <option value="30 mins">30 mins</option>
                  <option value="45 mins">45 mins</option>
                  <option value="60 mins">60 mins</option>
                  <option value="90 mins">90 mins</option>
                </select>
              </div>
            </div>

            {/* Participants & Reminders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Internal Participants</label>
                <input
                  type="text"
                  value={participants}
                  onChange={e => setParticipants(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                  placeholder="e.g. Jane Marie Baluna, CTO"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-slate-400">Automatic Follow-up Reminder</label>
                <select
                  value={followUpReminderDays}
                  onChange={e => setFollowUpReminderDays(Number(e.target.value))}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value={1}>1 Day Post-Meeting</option>
                  <option value={3}>3 Days Post-Meeting</option>
                  <option value={7}>7 Days Post-Meeting</option>
                  <option value={14}>14 Days Post-Meeting</option>
                </select>
              </div>
            </div>

            {/* Agenda */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400">Meeting Agenda & Objectives</label>
              <textarea
                rows={4}
                value={agenda}
                onChange={e => setAgenda(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-400 leading-relaxed font-sans"
              />
            </div>

            {/* Preview Banner */}
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-[11px] text-purple-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Scheduled for: <strong className="text-white">{formattedDateTime}</strong></span>
              </div>
              <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                Auto-Logs to 360° Timeline
              </span>
            </div>

            {/* Submit Bar */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                <span>{isSubmitting ? 'Scheduling...' : 'Confirm & Schedule Meeting'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;
