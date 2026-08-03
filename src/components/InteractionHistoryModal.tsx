/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Video,
  Clock,
  Tag,
  ExternalLink,
  Search,
  Filter,
  Copy,
  Check,
  Plus,
  Sparkles,
  PhoneCall,
  CalendarPlus,
  ShieldCheck
} from 'lucide-react';
import { Executive, UserSession } from '../types';

interface InteractionHistoryModalProps {
  isOpen: boolean;
  executive: Executive | null;
  session: UserSession;
  onClose: () => void;
  onAddNote: (execId: string, noteType: 'Note' | 'Email' | 'Meeting' | 'Call', content: string) => Promise<void>;
}

export const InteractionHistoryModal: React.FC<InteractionHistoryModalProps> = ({
  isOpen,
  executive,
  session,
  onClose,
  onAddNote
}) => {
  const [activeTab, setActiveTab] = useState<'Note' | 'Call' | 'Meeting' | 'Email'>('Note');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [filterType, setFilterType] = useState<'All' | 'Note' | 'Call' | 'Meeting' | 'Email'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // NOTE STATE
  const [notePriority, setNotePriority] = useState<'High Priority' | 'Key Buying Signal' | 'Objection / Risk' | 'General Note'>('General Note');
  const [noteContent, setNoteContent] = useState('');

  // CALL STATE
  const [callOutcome, setCallOutcome] = useState<'Connected - Interested' | 'Connected - Follow-Up Requested' | 'Left Voicemail' | 'Rescheduled Call' | 'No Answer / Busy'>('Connected - Interested');
  const [callDuration, setCallDuration] = useState<string>('15 mins');
  const [callSummary, setCallSummary] = useState('');

  // MEETING STATE
  const [meetingPlatform, setMeetingPlatform] = useState<'Google Meet (Video)' | 'In-Person (On-Site)' | 'Executive Lunch / Breakfast' | 'Phone Conference'>('Google Meet (Video)');
  const [meetingDateTime, setMeetingDateTime] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [meetingDuration, setMeetingDuration] = useState<string>('30 mins');
  const [meetingGoal, setMeetingGoal] = useState<'Demo & Solution Review' | 'Proposal & Pricing Review' | 'Decision Maker Alignment' | 'Post-Event Debrief'>('Demo & Solution Review');
  const [meetingAgenda, setMeetingAgenda] = useState('');

  // EMAIL STATE
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  useEffect(() => {
    if (executive) {
      setEmailSubject(`Executive Consultation: DELCA Enterprise Solutions for ${executive.company}`);
      setEmailBody(`Dear ${executive.fullName},\n\nFollowing up regarding executive digital transformation initiatives at ${executive.company}. We would welcome 15 minutes to discuss strategic alignment for your upcoming priorities.\n\nBest regards,\n${session.userName}\n${session.userRole}`);
    }
  }, [executive, session]);

  if (!isOpen || !executive) return null;

  const history = executive.interactionHistory || [];

  // Filter history
  const filteredHistory = history.filter(item => {
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesQuery = !searchQuery || 
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  // Handle Note Submission
  const handleLogNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const formatted = `[TAG: ${notePriority.toUpperCase()}]\n${noteContent.trim()}`;
      await onAddNote(executive.id, 'Note', formatted);
      setNoteContent('');
      setStatusMessage({ type: 'success', text: `✓ Note logged as ${notePriority}.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to log note.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Call Logging & Direct Phone Action
  const handleLogCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const formatted = `[CALL OUTCOME: ${callOutcome}] • [DURATION: ${callDuration}]\n${callSummary.trim() || 'Executive phone call logged.'}`;
      await onAddNote(executive.id, 'Call', formatted);
      setCallSummary('');
      setStatusMessage({ type: 'success', text: `✓ Phone call record saved for ${executive.fullName} (${callOutcome}).` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to log phone call.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Launch Phone Call
  const handleDialPhone = () => {
    if (executive.contactNumber) {
      window.location.href = `tel:${executive.contactNumber}`;
      setStatusMessage({ type: 'info', text: `Initiated phone call to ${executive.contactNumber}` });
    }
  };

  // Handle Meeting Logging & Google Calendar Invite Link
  const handleLogMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const formattedDate = new Date(meetingDateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
      const calendarTitle = `${meetingGoal}: DELCA ERP & ${executive.company}`;
      const calendarDetails = `Meeting with ${executive.fullName} (${executive.jobTitle} at ${executive.company})\nPlatform: ${meetingPlatform}\nAgenda: ${meetingAgenda}`;
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarTitle)}&details=${encodeURIComponent(calendarDetails)}&add=${encodeURIComponent(executive.email)}`;

      const formatted = `[MEETING SCHEDULED: ${formattedDate}] • [PLATFORM: ${meetingPlatform}]\nGoal: ${meetingGoal} (${meetingDuration})\n${meetingAgenda.trim()}\nGoogle Calendar Invite: ${calendarUrl}`;

      await onAddNote(executive.id, 'Meeting', formatted);
      setMeetingAgenda('');
      setStatusMessage({ type: 'success', text: `✓ Executive meeting scheduled for ${formattedDate}. Google Calendar link generated!` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to log meeting.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Direct Google Calendar Link
  const getGoogleCalendarUrl = () => {
    const formattedDate = new Date(meetingDateTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const calendarTitle = `${meetingGoal}: DELCA ERP & ${executive.company}`;
    const calendarDetails = `Meeting with ${executive.fullName} (${executive.jobTitle} at ${executive.company})\nPlatform: ${meetingPlatform}\nAgenda: ${meetingAgenda}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarTitle)}&details=${encodeURIComponent(calendarDetails)}&add=${encodeURIComponent(executive.email)}`;
  };

  // Handle Email Logging & Gmail Web Dispatch
  const handleLogEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(executive.email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(gmailUrl, '_blank');

      const formatted = `[GMAIL DISPATCHED TO: ${executive.email}]\nSubject: ${emailSubject}\n\n${emailBody}`;
      await onAddNote(executive.id, 'Email', formatted);
      setStatusMessage({ type: 'success', text: `✓ Gmail compose window launched targeting ${executive.email}. Email logged to activity stream.` });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to dispatch email.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl max-w-4xl w-full p-5 sm:p-6 space-y-5 shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-white text-base sm:text-lg">{executive.fullName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {executive.contactStatus}
                </span>
              </div>
              <p className="text-xs text-cyan-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-2">
                <span>{executive.jobTitle} @ {executive.company}</span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-300 font-semibold">{executive.email}</span>
                {executive.contactNumber && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{executive.contactNumber}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Toolbar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-navy-950/80 p-2.5 rounded-xl border border-white/10 text-xs shrink-0">
          <button
            onClick={() => {
              setActiveTab('Call');
              handleDialPhone();
            }}
            className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center justify-center space-x-1.5 transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Dial Call</span>
          </button>

          <button
            onClick={() => setActiveTab('Meeting')}
            className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold flex items-center justify-center space-x-1.5 transition-all"
          >
            <CalendarPlus className="w-4 h-4 text-purple-400" />
            <span>Schedule Meeting</span>
          </button>

          <button
            onClick={() => setActiveTab('Email')}
            className="p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold flex items-center justify-center space-x-1.5 transition-all"
          >
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Send Gmail</span>
          </button>

          <button
            onClick={() => setActiveTab('Note')}
            className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold flex items-center justify-center space-x-1.5 transition-all"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Add Note</span>
          </button>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all shrink-0 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : statusMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
          }`}>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span className="font-medium">{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}

        {/* Main Scrollable Body Area */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1.5 custom-scrollbar">
          
          {/* Section 1: Filter & Stream Logs Header */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-1.5 bg-navy-950 p-1.5 rounded-xl border border-white/10 overflow-x-auto">
                {(['All', 'Note', 'Call', 'Meeting', 'Email'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                      filterType === type
                        ? 'bg-cyan-500 text-navy-950 shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type} {type === 'All' ? `(${history.length})` : `(${history.filter(h => h.type === type).length})`}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search history logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-navy-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full sm:w-56"
                />
              </div>
            </div>

            {/* Interaction Stream Cards */}
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {filteredHistory.length === 0 ? (
                <div className="p-6 text-center text-slate-500 space-y-2 bg-navy-950/40 rounded-xl border border-white/5">
                  <FileText className="w-6 h-6 mx-auto text-slate-600" />
                  <p className="text-xs font-medium">No recorded interaction logs match your filter criteria.</p>
                  <p className="text-[10px] text-slate-500">Use the interactive creator tabs below to record notes, call outcomes, meeting invites, or Gmail dispatches.</p>
                </div>
              ) : (
                filteredHistory.map(item => {
                  const isCall = item.type === 'Call';
                  const isMeeting = item.type === 'Meeting';
                  const isEmail = item.type === 'Email';
                  const isNote = item.type === 'Note';

                  return (
                    <div key={item.id} className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10 space-y-2 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase border flex items-center space-x-1 ${
                            isCall ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                            isMeeting ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                            isEmail ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' :
                            'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {isCall && <Phone className="w-3 h-3" />}
                            {isMeeting && <Calendar className="w-3 h-3" />}
                            {isEmail && <Mail className="w-3 h-3" />}
                            {isNote && <FileText className="w-3 h-3" />}
                            <span>{item.type}</span>
                          </span>

                          <span className="font-semibold text-white">{item.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({item.authorRole})</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-slate-500">
                            {new Date(item.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          <button
                            onClick={() => handleCopyText(item.id, item.content)}
                            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                            title="Copy log text"
                          >
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line bg-navy-900/90 p-3 rounded-lg border border-white/5 font-mono">
                        {item.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Creator Form Panel */}
          <div className="bg-navy-950 border border-white/10 rounded-2xl p-4.5 space-y-4">
            
            {/* Creator Type Tab Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center space-x-2">
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Log Entry Creator</span>
              </span>

              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                {(['Note', 'Call', 'Meeting', 'Email'] as const).map(type => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setActiveTab(type)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                      activeTab === type
                        ? 'bg-cyan-500 text-navy-950 shadow-md font-bold'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {type === 'Note' && <FileText className="w-3.5 h-3.5" />}
                    {type === 'Call' && <Phone className="w-3.5 h-3.5" />}
                    {type === 'Meeting' && <Calendar className="w-3.5 h-3.5" />}
                    {type === 'Email' && <Mail className="w-3.5 h-3.5" />}
                    <span>{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* TAB 1: NOTE LOG FORM */}
            {activeTab === 'Note' && (
              <form onSubmit={handleLogNote} className="space-y-3.5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Importance Tag / Category:</label>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(['High Priority', 'Key Buying Signal', 'Objection / Risk', 'General Note'] as const).map(p => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setNotePriority(p)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                          notePriority === p
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                            : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  required
                  rows={4}
                  placeholder={`Write private observation, strategic lead insight, or objection notes for ${executive.fullName}...`}
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full bg-navy-900 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono resize-none leading-relaxed"
                />

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!noteContent.trim() || isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Log Note</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CALL LOG FORM */}
            {activeTab === 'Call' && (
              <form onSubmit={handleLogCall} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Call Outcome:</label>
                    <select
                      value={callOutcome}
                      onChange={(e: any) => setCallOutcome(e.target.value)}
                      className="w-full bg-navy-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-emerald-300 font-semibold focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="Connected - Interested">Connected - Interested</option>
                      <option value="Connected - Follow-Up Requested">Connected - Follow-Up Requested</option>
                      <option value="Left Voicemail">Left Voicemail</option>
                      <option value="Rescheduled Call">Rescheduled Call</option>
                      <option value="No Answer / Busy">No Answer / Busy</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Call Duration:</label>
                    <div className="flex items-center space-x-1.5">
                      {['5 mins', '15 mins', '30 mins', '45 mins'].map(dur => (
                        <button
                          type="button"
                          key={dur}
                          onClick={() => setCallDuration(dur)}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-mono font-bold border transition-all ${
                            callDuration === dur
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                              : 'bg-white/5 border-white/5 text-slate-400'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Call Summary & Discussion Points:</label>
                  <textarea
                    rows={3}
                    placeholder={`Summarize key points discussed during call with ${executive.fullName} (${executive.contactNumber || 'No phone'})...`}
                    value={callSummary}
                    onChange={e => setCallSummary(e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleDialPhone}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-400 text-xs font-semibold flex items-center space-x-2 transition-all"
                  >
                    <PhoneCall className="w-4 h-4 text-emerald-400" />
                    <span>Dial {executive.contactNumber || 'Number'}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Save Call Record</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: MEETING LOG FORM */}
            {activeTab === 'Meeting' && (
              <form onSubmit={handleLogMeeting} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Meeting Platform:</label>
                    <select
                      value={meetingPlatform}
                      onChange={(e: any) => setMeetingPlatform(e.target.value)}
                      className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-purple-300 font-semibold focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="Google Meet (Video)">Google Meet (Video)</option>
                      <option value="In-Person (On-Site)">In-Person (On-Site)</option>
                      <option value="Executive Lunch / Breakfast">Executive Lunch / Breakfast</option>
                      <option value="Phone Conference">Phone Conference</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Date & Time:</label>
                    <input
                      type="datetime-local"
                      value={meetingDateTime}
                      onChange={e => setMeetingDateTime(e.target.value)}
                      className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Goal / Objective:</label>
                    <select
                      value={meetingGoal}
                      onChange={(e: any) => setMeetingGoal(e.target.value)}
                      className="w-full bg-navy-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    >
                      <option value="Demo & Solution Review">Demo & Solution Review</option>
                      <option value="Proposal & Pricing Review">Proposal & Pricing Review</option>
                      <option value="Decision Maker Alignment">Decision Maker Alignment</option>
                      <option value="Post-Event Debrief">Post-Event Debrief</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Meeting Agenda & Notes:</label>
                  <textarea
                    rows={3}
                    placeholder={`Outline session agenda, proposed solution demo items, or attendees for ${executive.fullName}...`}
                    value={meetingAgenda}
                    onChange={e => setMeetingAgenda(e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center space-x-2 transition-all"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400" />
                    <span>Open Google Calendar Invite</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-500/20 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Log Meeting</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 4: EMAIL LOG FORM */}
            {activeTab === 'Email' && (
              <form onSubmit={handleLogEmail} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Email Subject Line:</label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={e => setEmailSubject(e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Email Body Message:</label>
                  <textarea
                    rows={4}
                    required
                    value={emailBody}
                    onChange={e => setEmailBody(e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] font-mono text-slate-400">
                    Target Recipient: <strong className="text-cyan-300 font-bold">{executive.email}</strong>
                  </span>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Launch Gmail Compose</span>
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
