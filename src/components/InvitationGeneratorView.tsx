/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  FileText, 
  Mail, 
  Save, 
  Building2, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Calendar,
  UserCheck,
  Edit3,
  User,
  ExternalLink,
  Sparkles,
  Inbox,
  MessageSquare
} from 'lucide-react';
import { Executive, DELCAEvent, InvitationCopy, AppStateStore, UserSession } from '../types';

interface InvitationGeneratorViewProps {
  state: AppStateStore;
  session?: UserSession | null;
  onGenerateInvitation: (execId: string, eventId: string, tone: 'Prestigious' | 'Technical' | 'ROI-Focused') => Promise<void>;
  onSaveInvitation: (execId: string, eventId: string, data: Partial<InvitationCopy>) => void;
  onUpdateStatus: (id: string, status: any) => void;
  onDeleteInvitation: (id: string) => void;
  onNavigateToTab: (tabId: string) => void;
  onAddInteractionNote?: (execId: string, noteType: 'Note' | 'Email' | 'Meeting' | 'Call', content: string) => void;
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

export default function InvitationGeneratorView({
  state,
  session,
  onGenerateInvitation,
  onSaveInvitation,
  onUpdateStatus,
  onDeleteInvitation,
  onNavigateToTab,
  onAddInteractionNote,
  onReceiveInboundReply
}: InvitationGeneratorViewProps) {
  const [selectedExecId, setSelectedExecId] = useState<string>(state.executives[0]?.id || '');
  const [selectedEventId, setSelectedEventId] = useState<string>(state.events[0]?.id || '');
  const [activeTone, setActiveTone] = useState<'Prestigious' | 'Technical' | 'ROI-Focused'>('Prestigious');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Email form state
  const [senderEmail, setSenderEmail] = useState<string>(session?.userEmail || 'janemariebaluna239@gmail.com');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

  const selectedExec = state.executives.find(e => e.id === selectedExecId);
  const selectedEvent = state.events.find(e => e.id === selectedEventId);

  // Sync recipient email when selectedExec changes
  useEffect(() => {
    if (selectedExec) {
      setRecipientEmail(selectedExec.email || '');
    }
  }, [selectedExecId, selectedExec]);

  // Sync sender email if session userEmail updates
  useEffect(() => {
    if (session?.userEmail) {
      setSenderEmail(session.userEmail);
    }
  }, [session?.userEmail]);

  // Find active invitation
  const activeInvitation = state.invitations.find(
    i => i.executiveId === selectedExecId && i.eventId === selectedEventId
  );

  // Sync local editor when active invitation or selections change
  useEffect(() => {
    if (activeInvitation) {
      setEditedSubject(activeInvitation.subjectLine || activeInvitation.subject || '');
      setEditedBody(activeInvitation.emailBody || activeInvitation.bodyText || '');
    } else {
      setEditedSubject('');
      setEditedBody('');
    }
    setIsEditing(false);
  }, [activeInvitation, selectedExecId, selectedEventId]);

  // Generate invitation copy
  const handleGenerate = async () => {
    if (!selectedExecId || !selectedEventId) return;
    setIsGenerating(true);
    setStatusMessage(null);
    try {
      await onGenerateInvitation(selectedExecId, selectedEventId, activeTone);
      setStatusMessage({
        type: 'success',
        text: `Invitation generated successfully for ${selectedExec?.fullName}! Recipient Gmail set to ${selectedExec?.email}.`
      });
    } catch (e: any) {
      console.error(e);
      setStatusMessage({ type: 'error', text: 'Failed to draft invitation copy.' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct Gmail Dispatch (opens direct Gmail web composer in new window)
  const handleSendDirectToGmail = () => {
    if (!selectedExec || !activeInvitation) return;

    const targetTo = recipientEmail || selectedExec.email;
    const subject = editedSubject || activeInvitation.subjectLine || activeInvitation.subject;
    const body = editedBody || activeInvitation.emailBody || activeInvitation.bodyText;

    if (!targetTo) {
      setStatusMessage({ type: 'error', text: 'Recipient email address is missing. Please specify a recipient email.' });
      return;
    }

    // Direct Gmail web compose URL pre-filled with recipient, subject, body
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(targetTo)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailComposeUrl, '_blank');

    // Also trigger mailto as fallback protocol
    setTimeout(() => {
      const mailtoUrl = `mailto:${encodeURIComponent(targetTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
    }, 300);

    // Update status to 'Sent'
    onUpdateStatus(activeInvitation.id, 'Sent');

    // Log to interaction history
    if (onAddInteractionNote) {
      onAddInteractionNote(selectedExec.id, 'Email', `Dispatched VIP Invitation directly to ${selectedExec.fullName} <${targetTo}> from sender ${senderEmail}.\nSubject: ${subject}`);
    }

    setStatusMessage({
      type: 'success',
      text: `✓ Direct email launched targeting ${selectedExec.fullName} (${targetTo}). Invitation status updated to 'Sent' and logged to interaction history!`
    });
  };

  // Dispatch via default OS Mail Client (mailto:)
  const handleSendMailto = () => {
    if (!selectedExec || !activeInvitation) return;

    const targetTo = recipientEmail || selectedExec.email;
    const subject = editedSubject || activeInvitation.subjectLine || activeInvitation.subject;
    const body = editedBody || activeInvitation.emailBody || activeInvitation.bodyText;

    if (!targetTo) {
      setStatusMessage({ type: 'error', text: 'Recipient email address is missing. Please specify a recipient email.' });
      return;
    }

    const mailtoUrl = `mailto:${encodeURIComponent(targetTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    onUpdateStatus(activeInvitation.id, 'Sent');

    if (onAddInteractionNote) {
      onAddInteractionNote(selectedExec.id, 'Email', `Dispatched VIP Invitation via Default Mail Client to ${selectedExec.fullName} <${targetTo}> from sender ${senderEmail}.\nSubject: ${subject}`);
    }

    setStatusMessage({
      type: 'success',
      text: `✓ Default Mail Client launched targeting ${selectedExec.fullName} (${targetTo}). Status updated to 'Sent' and logged.`
    });
  };

  // Copy to Clipboard
  const handleCopyToClipboard = () => {
    const textToCopy = `From: ${senderEmail}\nTo: ${recipientEmail || selectedExec?.email}\nSubject: ${editedSubject}\n\n${editedBody}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Save edits
  const handleSave = () => {
    if (!selectedExecId || !selectedEventId) return;
    onSaveInvitation(selectedExecId, selectedEventId, {
      subjectLine: editedSubject,
      emailBody: editedBody
    });
    setIsEditing(false);
    setStatusMessage({ type: 'success', text: 'Invitation draft copy saved.' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-[fadeIn_0.4s_ease-out_1]">
      {/* Left Selector & Generator Controls Sidebar */}
      <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border-white/10 space-y-4 h-[calc(100vh-210px)] flex flex-col justify-between">
        <div className="space-y-4 flex-grow flex flex-col min-h-0 overflow-y-auto pr-1">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-display font-bold text-sm text-white flex items-center space-x-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>VIP Invitation Console</span>
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Draft and dispatch executive invitations via Gmail</p>
          </div>

          {/* Executive selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Target Executive</label>
            <select
              value={selectedExecId}
              onChange={(e) => setSelectedExecId(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-cyan-400 outline-none"
            >
              {state.executives.map(exec => (
                <option key={exec.id} value={exec.id}>{exec.fullName} ({exec.company}) - {exec.email}</option>
              ))}
            </select>
          </div>

          {/* Event selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Corporate Forum / Seminar</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white focus:border-cyan-400 outline-none"
            >
              {state.events.map(evt => (
                <option key={evt.id} value={evt.id}>{evt.name} ({evt.date})</option>
              ))}
            </select>
          </div>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Communication Tone</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Prestigious', 'Technical', 'ROI-Focused'] as const).map(tone => (
                <button
                  key={tone}
                  onClick={() => setActiveTone(tone)}
                  className={`py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                    activeTone === tone
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-navy-950/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          {/* Target Profile Snippet */}
          {selectedExec && selectedEvent && (
            <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10 text-xs space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Target Executive Gmail</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedExec.contactStatus}
                </span>
              </div>
              <div className="font-bold text-white text-sm">{selectedExec.fullName}</div>
              <div className="text-[11px] text-slate-300 flex items-center space-x-1.5 font-mono">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate text-cyan-300 font-semibold">{selectedExec.email}</span>
              </div>
              <div className="text-[11px] text-slate-400">{selectedExec.position} @ {selectedExec.company}</div>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedExecId || !selectedEventId || isGenerating}
          className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 text-navy-950 disabled:text-slate-500 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              <span>Drafting Invitation Copy...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate VIP Invitation</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Invitation Draft Display, Sender/Recipient Config, & Gmail Dispatcher */}
      <div className="lg:col-span-8 space-y-6">
        {/* Gmail Integration & Inbound Response Notice Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center space-x-2">
                <span>Inbound Email Response Synchronization</span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  No Auto-Reply Enforced
                </span>
              </div>
              <p className="text-slate-300 text-[11px] mt-1 leading-relaxed">
                Client email replies populate directly on this website. Automatic replies are strictly suppressed. To view or respond in your Google Inbox, click 'Proceed to Gmail'.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => window.open('https://mail.google.com/mail/u/0/#inbox', '_blank')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Proceed to Gmail</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className={`p-4 rounded-xl border text-xs flex items-center justify-between transition-all ${
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

        {activeInvitation ? (
          <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
            
            {/* EMAIL DISPATCH HEADER CARD */}
            <div className="bg-navy-900/90 border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Inbox className="w-4 h-4 text-cyan-400" />
                  <span>Outbound Email Dispatcher</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Invitation Status:</span>
                  <select
                    value={activeInvitation.status}
                    onChange={(e) => onUpdateStatus(activeInvitation.id, e.target.value)}
                    className="bg-navy-950 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-cyan-300 focus:outline-none"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Sent">Sent</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Declined">Declined</option>
                    <option value="Attended">Attended</option>
                  </select>
                </div>
              </div>

              {/* Sender & Recipient Email Address Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sender Email Address (From) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>From (Sender Email / Gmail):</span>
                    <span className="text-[9px] text-cyan-400 font-normal">Logged In User</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-cyan-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="sender.email@gmail.com"
                      className="w-full bg-navy-950 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                {/* Recipient Email Address (To) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>To (Recipient Email / Gmail):</span>
                    <span className="text-[9px] text-emerald-400 font-normal">Target Executive</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="executive.email@gmail.com"
                      className="w-full bg-navy-950 border border-emerald-500/30 rounded-xl pl-9 pr-3 py-2.5 text-xs text-emerald-300 font-bold focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Dispatch Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  Target Person: <strong className="text-white">{selectedExec?.fullName}</strong> ({recipientEmail || selectedExec?.email})
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleCopyToClipboard}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy Text'}</span>
                  </button>

                  <button
                    onClick={handleSendDirectToGmail}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all"
                    title={`Send email directly to ${selectedExec?.email}`}
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email Directly</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Line Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Email Subject Line</label>
              <input
                type="text"
                value={editedSubject}
                onChange={e => {
                  setEditedSubject(e.target.value);
                  setIsEditing(true);
                }}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-semibold focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Email Body Textarea */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Invitation Email Body Copy</label>
              <textarea
                rows={12}
                value={editedBody}
                onChange={e => {
                  setEditedBody(e.target.value);
                  setIsEditing(true);
                }}
                className="w-full bg-navy-950 border border-white/10 rounded-xl p-4 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Inbound Executive Reply Thread Box */}
            {(() => {
              const matchingReplies = [
                ...(activeInvitation.replies || []),
                ...(state.inboundEmailReplies || []).filter(r => r.executiveId === selectedExecId || r.invitationId === activeInvitation.id)
              ];

              return (
                <div className="p-5 rounded-2xl bg-navy-900/90 border border-emerald-500/30 space-y-3 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-white/10">
                    <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Direct Executive Client Email Thread</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                        {matchingReplies.length} Inbound Message{matchingReplies.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open('https://mail.google.com/mail/u/0/#inbox', '_blank')}
                        className="text-[11px] text-cyan-400 hover:underline flex items-center space-x-1"
                      >
                        <span>Proceed to Gmail</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>

                      {onReceiveInboundReply && selectedExec && (
                        <button
                          onClick={() => {
                            onReceiveInboundReply({
                              executiveId: selectedExec.id,
                              subject: `Re: ${editedSubject || activeInvitation.subjectLine || 'VIP Invitation'}`,
                              body: `Dear DELCA Outreach Team,\n\nI confirm my attendance for the event. Our team is eager to participate.\n\nBest regards,\n${selectedExec.fullName}`,
                              senderEmail: selectedExec.email,
                              senderName: selectedExec.fullName,
                              invitationId: activeInvitation.id,
                              status: 'Accepted'
                            });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-[10px] font-bold flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3 h-3 text-purple-400" />
                          <span>Simulate Client Reply</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {matchingReplies.length > 0 ? (
                    <div className="space-y-3">
                      {matchingReplies.map((reply, idx) => (
                        <div key={reply.id || idx} className="p-3.5 rounded-xl bg-navy-950 border border-emerald-500/20 space-y-2">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span className="text-emerald-300 font-bold">From: {reply.senderName} &lt;{reply.senderEmail}&gt;</span>
                            <span>{new Date(reply.receivedAt).toLocaleString()}</span>
                          </div>
                          <div className="font-bold text-white">{reply.subject}</div>
                          <div className="text-slate-300 whitespace-pre-wrap leading-relaxed p-3 bg-slate-900 rounded border border-white/5">
                            {reply.body}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-slate-400 text-xs italic">
                      No inbound replies received yet for this invitation. Any client responses sent to your email will populate here directly without auto-replying.
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Save Edits button */}
            {isEditing && (
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSave}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft Changes</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-2xl border-white/10 text-center space-y-4">
            <div className="p-3.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 inline-block">
              <Mail className="w-8 h-8" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h4 className="font-display font-bold text-white text-base">No VIP Invitation Draft Generated</h4>
              <p className="text-xs text-slate-400">
                Select an executive contact and corporate event on the left, then click "Generate VIP Invitation" to draft personalized invitation copy targeting their verified email.
              </p>
            </div>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center space-x-2 mx-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Draft Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
