/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { exportToExcel, exportToCSV, ExportColumn } from '../lib/exportUtils';
import { 
  FileText, 
  Download, 
  Search, 
  Users, 
  Compass, 
  Send, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Building2,
  MapPin,
  Globe,
  TrendingUp,
  Scale,
  Cpu,
  BarChart3,
  AlertTriangle,
  Target,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  Database
} from 'lucide-react';
import { AppStateStore, Executive } from '../types';
import IndustryIntelligenceReportModal from './IndustryIntelligenceReportModal';

interface ReportsViewProps {
  state: AppStateStore;
  onOpenAccountIntelligence?: (exec: Executive) => void;
}

export default function ReportsView({ state, onOpenAccountIntelligence }: ReportsViewProps) {
  const [activeReportType, setActiveReportType] = useState<'contacts' | 'alignments' | 'invitations' | 'industry' | 'accountIntelligence'>('contacts');
  const [searchTerm, setSearchTerm] = useState('');
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('Banking & Financial Services');

  // Stats computed on active report dataset
  const totalProfiles = state.executives.length;
  const verifiedProfiles = state.executives.filter(e => e.contactStatus === 'Verified').length;
  const computedMatches = state.recommendations.length;
  const dispatchCount = state.invitations.filter(i => i.status === 'Sent').length;

  // Report exports with auto column width
  const handleExportReportExcel = () => {
    if (activeReportType === 'contacts') {
      const cols: ExportColumn<any>[] = [
        { key: 'id', label: 'Executive ID' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'position', label: 'Position' },
        { key: 'company', label: 'Company' },
        { key: 'industry', label: 'Industry' },
        { key: 'country', label: 'Country' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone', getValue: (e) => e.contactNumber || e.phoneNumber || '' },
        { key: 'contactStatus', label: 'Contact Status' },
      ];
      exportToExcel(state.executives, cols, `DELCA_${activeReportType}_Report`, 'Contacts Report');
    } else if (activeReportType === 'alignments') {
      const cols: ExportColumn<any>[] = [
        { key: 'id', label: 'Match ID' },
        { key: 'execName', label: 'Executive Name', getValue: (r) => state.executives.find(e => e.id === r.executiveId)?.fullName || 'N/A' },
        { key: 'execCompany', label: 'Company', getValue: (r) => state.executives.find(e => e.id === r.executiveId)?.company || 'N/A' },
        { key: 'eventName', label: 'Event Target', getValue: (r) => state.events.find(ev => ev.id === r.eventId)?.name || 'N/A' },
        { key: 'matchScore', label: 'Match Score (%)', getValue: (r) => `${r.matchScore}%` },
        { key: 'priorityLevel', label: 'Priority' },
      ];
      exportToExcel(state.recommendations, cols, `DELCA_${activeReportType}_Report`, 'Alignments Report');
    } else {
      const cols: ExportColumn<any>[] = [
        { key: 'id', label: 'Invite ID' },
        { key: 'recipient', label: 'Recipient', getValue: (i) => state.executives.find(e => e.id === i.executiveId)?.fullName || 'N/A' },
        { key: 'company', label: 'Company', getValue: (i) => state.executives.find(e => e.id === i.executiveId)?.company || 'N/A' },
        { key: 'event', label: 'Event', getValue: (i) => state.events.find(ev => ev.id === i.eventId)?.name || 'N/A' },
        { key: 'subject', label: 'Subject', getValue: (i) => i.subjectLine || i.subject || '' },
        { key: 'status', label: 'Status' },
      ];
      exportToExcel(state.invitations, cols, `DELCA_${activeReportType}_Report`, 'Invitations Report');
    }
  };

  const handleSimulateDownload = () => {
    if (activeReportType === 'contacts') {
      const cols: ExportColumn<any>[] = [
        { key: 'id', label: 'Executive ID' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'position', label: 'Position' },
        { key: 'company', label: 'Company' },
        { key: 'industry', label: 'Industry' },
        { key: 'country', label: 'Country' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone', getValue: (e) => e.contactNumber || e.phoneNumber || '' },
        { key: 'contactStatus', label: 'Contact Status' },
      ];
      exportToCSV(state.executives, cols, `DELCA_${activeReportType}_Report`);
    } else if (activeReportType === 'alignments') {
      const cols: ExportColumn<any>[] = [
        { key: 'id', label: 'Match ID' },
        { key: 'execName', label: 'Executive Name', getValue: (r) => state.executives.find(e => e.id === r.executiveId)?.fullName || 'N/A' },
        { key: 'execCompany', label: 'Company', getValue: (r) => state.executives.find(e => e.id === r.executiveId)?.company || 'N/A' },
        { key: 'eventName', label: 'Event Target', getValue: (r) => state.events.find(ev => ev.id === r.eventId)?.name || 'N/A' },
        { key: 'matchScore', label: 'Match Score (%)', getValue: (r) => `${r.matchScore}%` },
        { key: 'priorityLevel', label: 'Priority' },
      ];
      exportToCSV(state.recommendations, cols, `DELCA_${activeReportType}_Report`);
    } else {
      const cols: ExportColumn<any>[] = [
        { key: 'id', label: 'Invite ID' },
        { key: 'recipient', label: 'Recipient', getValue: (i) => state.executives.find(e => e.id === i.executiveId)?.fullName || 'N/A' },
        { key: 'company', label: 'Company', getValue: (i) => state.executives.find(e => e.id === i.executiveId)?.company || 'N/A' },
        { key: 'event', label: 'Event', getValue: (i) => state.events.find(ev => ev.id === i.eventId)?.name || 'N/A' },
        { key: 'subject', label: 'Subject', getValue: (i) => i.subjectLine || i.subject || '' },
        { key: 'status', label: 'Status' },
      ];
      exportToCSV(state.invitations, cols, `DELCA_${activeReportType}_Report`);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out_1]">
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
            <FileText className="w-4 h-4" />
            <span>Executive Contact Management System</span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
            System Intelligence Reports
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Generate and export verified executive contact logs, rule-based event alignments, and invitation records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportReportExcel}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-400/20 transition-all flex items-center justify-center space-x-2"
            title="Export report to Microsoft Excel with auto-widened columns"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleSimulateDownload}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/20 transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Executive Directory</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display font-black text-2xl text-white">{totalProfiles}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Verified: {verifiedProfiles}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Verification Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display font-black text-2xl text-white">
            {totalProfiles > 0 ? `${Math.round((verifiedProfiles / totalProfiles) * 100)}%` : '0%'}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-1">Real & verified profiles</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Event Match Matrices</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display font-black text-2xl text-white">{computedMatches}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Rule-based recommendations</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Dispatched Outreach</span>
            <Send className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display font-black text-2xl text-white">{dispatchCount}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Sent invitations</div>
        </div>
      </div>

      {/* Navigation Tabs and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-2xl p-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 w-full">
            <button
              onClick={() => setActiveReportType('contacts')}
              className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeReportType === 'contacts'
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Contact Directory</span>
            </button>

            <button
              onClick={() => setActiveReportType('alignments')}
              className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeReportType === 'alignments'
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Event Alignments</span>
            </button>

            <button
              onClick={() => setActiveReportType('invitations')}
              className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeReportType === 'invitations'
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Outreach Logs</span>
            </button>

            <button
              onClick={() => setActiveReportType('industry')}
              className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeReportType === 'industry'
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Industry Market Intel</span>
            </button>

            <button
              onClick={() => setActiveReportType('accountIntelligence')}
              className={`px-3.5 py-2 rounded-xl text-xs font-display font-bold transition-all flex items-center justify-center space-x-1.5 ${
                activeReportType === 'accountIntelligence'
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-cyan-300" />
              <span>Account Intelligence Profiles</span>
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dataset..."
              className="w-full bg-navy-950/80 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        {/* Table display */}
        <div className="glass-panel rounded-2xl border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            {activeReportType === 'contacts' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-950/80 border-b border-white/10 text-slate-400 text-[10px] font-mono uppercase">
                    <th className="py-3.5 px-5">Executive Contact</th>
                    <th className="py-3.5 px-5">Company & Position</th>
                    <th className="py-3.5 px-5">Industry</th>
                    <th className="py-3.5 px-5">Country</th>
                    <th className="py-3.5 px-5 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 text-xs">
                  {state.executives
                    .filter(e => e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || e.company.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(exec => {
                      return (
                        <tr key={exec.id} className="hover:bg-white/[0.01]">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-white">{exec.fullName}</div>
                            <div className="text-[10px] text-cyan-400 font-mono">{exec.email}</div>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-slate-200">{exec.company}</div>
                            <div className="text-[10px] text-slate-400">{exec.position}</div>
                          </td>
                          <td className="py-3.5 px-5 font-mono text-[11px] text-cyan-300">{exec.industry}</td>
                          <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">{exec.country}</td>
                          <td className="py-3.5 px-5 text-right">
                            <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                              exec.contactStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                              <ShieldCheck className="w-3 h-3" />
                              <span>{exec.contactStatus || 'Unverified'}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}

            {activeReportType === 'alignments' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-950/80 border-b border-white/10 text-slate-400 text-[10px] font-mono uppercase">
                    <th className="py-3.5 px-5">Executive Target</th>
                    <th className="py-3.5 px-5">Event Target</th>
                    <th className="py-3.5 px-5">Priority Metrics</th>
                    <th className="py-3.5 px-5 text-right">Match Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 text-xs">
                  {state.recommendations
                    .filter(r => {
                      const exec = state.executives.find(e => e.id === r.executiveId);
                      return exec?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || exec?.company.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map(rec => {
                      const exec = state.executives.find(e => e.id === rec.executiveId);
                      const ev = state.events.find(e => e.id === rec.eventId);

                      return (
                        <tr key={rec.id} className="hover:bg-white/[0.01]">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-white">{exec?.fullName || 'N/A'}</div>
                            <div className="text-[10px] font-mono text-slate-400">{exec?.company}</div>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-cyan-300">{ev?.name || 'N/A'}</div>
                            <div className="text-[10px] text-slate-400">{ev?.category} • {ev?.date}</div>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              rec.priorityLevel === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'
                            }`}>
                              {rec.priorityLevel} Priority
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono font-bold text-cyan-400 text-sm">
                            {rec.matchScore}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}

            {activeReportType === 'invitations' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-950/80 border-b border-white/10 text-slate-400 text-[10px] font-mono uppercase">
                    <th className="py-3.5 px-5">Executive Recipient</th>
                    <th className="py-3.5 px-5">Event Subject</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Dispatched At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300 text-xs">
                  {state.invitations
                    .filter(i => {
                      const exec = state.executives.find(e => e.id === i.executiveId);
                      return exec?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || i.subjectLine.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map(inv => {
                      const exec = state.executives.find(e => e.id === inv.executiveId);
                      const ev = state.events.find(e => e.id === inv.eventId);

                      return (
                        <tr key={inv.id} className="hover:bg-white/[0.01]">
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-white">{exec?.fullName || 'N/A'}</div>
                            <div className="text-[10px] text-cyan-400 font-mono">{exec?.email}</div>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-medium text-slate-200 truncate max-w-xs">{inv.subjectLine}</div>
                            <div className="text-[10px] text-slate-500">{ev?.name}</div>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              inv.status === 'Sent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right font-mono text-[10px] text-slate-400">
                            {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
            {activeReportType === 'industry' && (
              <div className="p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-cyan-500/30">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      <h3 className="font-display font-black text-lg text-white">Comprehensive Industry & Market Intelligence Center</h3>
                    </div>
                    <p className="text-xs text-slate-300">
                      Explore detailed market research covering industry trends, regulations, key competitors, AI/ERP adoption, risks, and forecasts.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsIndustryModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 shrink-0"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Launch Full Interactive Industry Dossier</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Banking & Finance</span>
                    </span>
                    <p className="text-xs text-slate-300">
                      Open finance APIs, hyper-personalized wealth advisory, and central bank cloud mandates (BSP Circular 1105).
                    </p>
                    <button
                      onClick={() => { setSelectedIndustry('Banking & Financial Services'); setIsIndustryModalOpen(true); }}
                      className="text-xs text-cyan-400 hover:underline font-bold font-mono block pt-1"
                    >
                      View Report →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                    <span className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center space-x-1.5">
                      <Cpu className="w-4 h-4" />
                      <span>Telecommunications & Media</span>
                    </span>
                    <p className="text-xs text-slate-300">
                      Private 5G enterprise networks, edge computing nodes, satellite direct-to-cell, and GCash fintech integration.
                    </p>
                    <button
                      onClick={() => { setSelectedIndustry('Telecommunications & Media'); setIsIndustryModalOpen(true); }}
                      className="text-xs text-purple-300 hover:underline font-bold font-mono block pt-1"
                    >
                      View Report →
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center space-x-1.5">
                      <BarChart3 className="w-4 h-4" />
                      <span>Energy, Utilities & Power</span>
                    </span>
                    <p className="text-xs text-slate-300">
                      Smart grid digital twins, battery storage (BESS), clean corporate PPAs, and ERC reliability compliance.
                    </p>
                    <button
                      onClick={() => { setSelectedIndustry('Energy, Utilities & Power'); setIsIndustryModalOpen(true); }}
                      className="text-xs text-emerald-400 hover:underline font-bold font-mono block pt-1"
                    >
                      View Report →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Intelligence Profiles Tab */}
            {activeReportType === 'accountIntelligence' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-cyan-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      <BrainCircuit className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-white">Synthesized Account Intelligence Profiles</h3>
                      <p className="text-xs text-slate-400">
                        Executive, company, and market intelligence compiled into structured 15-point decision dossiers stored in database.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span>{state.executives.filter(e => e.accountIntelligenceProfile || e.personaGenerated).length} Profiles Saved to Firestore</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {state.executives
                    .filter(e => e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || e.company.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((exec) => {
                      const hasIntel = !!exec.accountIntelligenceProfile;
                      return (
                        <div key={exec.id} className="p-4 rounded-xl bg-slate-900/90 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                                {exec.industry || 'Enterprise Account'}
                              </span>
                              {hasIntel ? (
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center space-x-1 border border-emerald-500/30">
                                  <Database className="w-3 h-3" />
                                  <span>Database Stored</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold flex items-center space-x-1 border border-amber-500/30">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Ready to Synthesize</span>
                                </span>
                              )}
                            </div>

                            <div>
                              <h4 className="font-bold text-sm text-white">{exec.fullName}</h4>
                              <p className="text-xs text-slate-400">{exec.position || exec.jobTitle} • <span className="text-cyan-300 font-medium">{exec.company}</span></p>
                            </div>

                            <p className="text-xs text-slate-300 line-clamp-2 italic pt-1">
                              "{exec.biography || `${exec.fullName} leads strategic modernizations and digital operations for ${exec.company}.`}"
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                            <div className="text-[11px] text-slate-400">
                              Tech Maturity: <span className="text-cyan-400 font-bold font-mono">{exec.technologyReadinessScore || 85}%</span>
                            </div>

                            {onOpenAccountIntelligence && (
                              <button
                                onClick={() => onOpenAccountIntelligence(exec)}
                                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 text-xs font-bold font-mono flex items-center space-x-1 transition-all shadow-md shadow-cyan-500/20"
                              >
                                <BrainCircuit className="w-3.5 h-3.5" />
                                <span>{hasIntel ? 'View Dossier' : 'Generate Intel'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Industry Intelligence Report Modal */}
      <IndustryIntelligenceReportModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        defaultIndustry={selectedIndustry}
      />
    </div>
  );
}
