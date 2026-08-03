import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Building2, 
  UserCheck, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Database, 
  Mail, 
  Copy, 
  Check, 
  Zap, 
  X, 
  Send, 
  Download, 
  ShieldCheck, 
  Presentation, 
  Award, 
  MessageSquare, 
  Target, 
  ListOrdered, 
  Briefcase, 
  Cpu, 
  Calendar, 
  Users, 
  FileText,
  Clock,
  ChevronRight,
  Printer
} from 'lucide-react';
import { Executive, Company, DELCAEvent, AccountIntelligenceProfile } from '../types';
import { generateAccountIntelligenceProfile, saveAccountIntelligenceToDatabase } from '../lib/accountIntelligenceUtils';

interface AccountIntelligenceModalProps {
  executive: Executive;
  company?: Company;
  events?: DELCAEvent[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateExecutive?: (updated: Executive) => Promise<void>;
  onComposeEmail?: (exec: Executive, customSubject?: string, customBody?: string) => void;
}

export default function AccountIntelligenceModal({
  executive,
  company,
  events = [],
  isOpen,
  onClose,
  onUpdateExecutive,
  onComposeEmail
}: AccountIntelligenceModalProps) {
  const [profile, setProfile] = useState<AccountIntelligenceProfile | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // Copy states
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && executive) {
      setIsGenerating(true);
      setIsSaved(false);

      // Check if profile already exists or generate new
      if (executive.accountIntelligenceProfile) {
        setProfile(executive.accountIntelligenceProfile);
        setIsSaved(executive.accountIntelligenceProfile.savedToDatabase ?? true);
        setIsGenerating(false);
      } else {
        // Simulate real-time multi-source intelligence compilation
        const timer = setTimeout(() => {
          const generated = generateAccountIntelligenceProfile(executive, company, events);
          setProfile(generated);
          setIsGenerating(false);

          // Automatically save findings and recommendations to database
          saveAccountIntelligenceToDatabase(executive, generated, onUpdateExecutive)
            .then(() => setIsSaved(true))
            .catch(err => console.error('Auto-save error:', err));
        }, 1200);

        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, executive, company, events]);

  const handleManualSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    try {
      await saveAccountIntelligenceToDatabase(executive, profile, onUpdateExecutive);
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save account intelligence profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyPitch = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.suggestedSalesPitch);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleCopyEmail = () => {
    if (!profile) return;
    const text = `Subject: ${profile.suggestedEmail.subject}\n\n${profile.suggestedEmail.body}`;
    navigator.clipboard.writeText(text);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleLaunchEmail = () => {
    if (!profile) return;
    if (onComposeEmail) {
      onComposeEmail(executive, profile.suggestedEmail.subject, profile.suggestedEmail.body);
    }
    onClose();
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-[fadeIn_0.2s_ease-out_1]">
      <div className="bg-navy-900 border border-cyan-500/40 rounded-2xl max-w-5xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col text-slate-100">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 text-cyan-300 shadow-lg shadow-cyan-500/10">
              <BrainCircuit className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase border border-cyan-500/30">
                  Comprehensive Account Intelligence Profile
                </span>
                {isSaved ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center space-x-1 border border-emerald-500/30">
                    <Database className="w-3 h-3" />
                    <span>Saved to Database</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold flex items-center space-x-1 border border-amber-500/30">
                    <Clock className="w-3 h-3" />
                    <span>Auto-Syncing...</span>
                  </span>
                )}
              </div>
              <h2 className="font-display font-black text-xl text-white mt-1">
                {executive.fullName} — {executive.company}
              </h2>
              <p className="text-xs text-slate-400">
                {executive.position || executive.jobTitle} • {executive.industry || company?.industry}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-all"
              title="Print / Export Dossier"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Dossier</span>
            </button>

            <button
              onClick={handleManualSave}
              disabled={isSaving || isSaved}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-all ${
                isSaved 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-navy-950 shadow-lg shadow-cyan-500/20'
              }`}
            >
              {isSaving ? (
                <>
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Saved in Database</span>
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading Spinner during Generation */}
        {isGenerating || !profile ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <BrainCircuit className="w-8 h-8 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-display font-bold text-white text-base">Synthesizing Account Intelligence...</h4>
              <p className="text-xs text-slate-400">
                Aggregating executive bio, corporate financials, tech stack, and industry research into a unified profile.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            
            {/* Top Stat Ribbon & Technology / AI Readiness */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Technology Readiness */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center space-x-1.5">
                    <Cpu className="w-4 h-4" />
                    <span>Technology Readiness</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold border border-blue-500/30">
                    {profile.technologyReadiness.level} Readiness
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-display font-black text-2xl text-white">
                    {profile.technologyReadiness.score}%
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${profile.technologyReadiness.score}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {profile.technologyReadiness.summary}
                </p>
              </div>

              {/* AI Readiness */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Readiness</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold border border-purple-500/30">
                    {profile.aiReadiness.level} Readiness
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="font-display font-black text-2xl text-white">
                    {profile.aiReadiness.score}%
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
                      style={{ width: `${profile.aiReadiness.score}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {profile.aiReadiness.summary}
                </p>
              </div>

              {/* Decision-Making Style */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center space-x-1.5">
                    <Target className="w-4 h-4" />
                    <span>Decision-Making Style</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/30">
                    C-Suite Persona
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-medium pt-1 leading-relaxed">
                  {profile.decisionMakingStyle}
                </p>
              </div>

            </div>

            {/* 1. EXECUTIVE SUMMARY */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h3 className="font-display font-bold text-sm text-cyan-300 uppercase font-mono flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>1. Executive Summary & Leadership Dossier</span>
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                {profile.executiveSummary}
              </p>
            </div>

            {/* 2, 3, 4: Pain Points, Business Priorities, Buying Signals */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Pain Points */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-red-500/20 space-y-2.5">
                <h4 className="font-display font-bold text-xs text-red-400 uppercase font-mono flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>2. Key Pain Points</span>
                </h4>
                <ul className="space-y-2">
                  {profile.keyPainPoints.map((pt, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-red-400 font-mono font-bold shrink-0">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Priorities */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/20 space-y-2.5">
                <h4 className="font-display font-bold text-xs text-emerald-400 uppercase font-mono flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>3. Business Priorities</span>
                </h4>
                <ul className="space-y-2">
                  {profile.businessPriorities.map((bp, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Buying Signals */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/20 space-y-2.5">
                <h4 className="font-display font-bold text-xs text-cyan-400 uppercase font-mono flex items-center space-x-1.5">
                  <Zap className="w-4 h-4" />
                  <span>4. Verified Buying Signals</span>
                </h4>
                <ul className="space-y-2">
                  {profile.buyingSignals.map((bs, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{bs}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* 5. COMMUNICATION PREFERENCES & STAKEHOLDERS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="font-display font-bold text-sm text-cyan-300 uppercase font-mono flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>5. Communication Preferences & Stakeholder Matrix</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Preferred Channels</span>
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {profile.communicationPreferences.channels.map((ch, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Optimal Contact Window</span>
                  <span className="font-semibold text-slate-200 block">{profile.communicationPreferences.preferredTime}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Tone Preference</span>
                  <span className="font-semibold text-slate-200 block">{profile.communicationPreferences.communicationTonePreference}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Decision Cycle</span>
                  <span className="font-semibold text-slate-200 block">{profile.communicationPreferences.decisionTiming}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">Key Stakeholders To Engage</span>
                <div className="flex flex-wrap gap-2">
                  {profile.communicationPreferences.keyStakeholdersToInvolve?.map((sh, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs flex items-center space-x-1.5 border border-white/10">
                      <Users className="w-3 h-3 text-purple-400" />
                      <span>{sh}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 9. RECOMMENDED DELCA SOLUTION */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-950 border border-cyan-500/40 space-y-3 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                      9. Recommended DELCA Enterprise Solution
                    </span>
                    <h3 className="font-display font-black text-lg text-white">
                      {profile.recommendedDelcaSolution.title}
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30 self-start sm:self-auto">
                  {profile.recommendedDelcaSolution.category}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {profile.recommendedDelcaSolution.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Projected Financial ROI</span>
                  <span className="text-slate-200 leading-tight block">{profile.recommendedDelcaSolution.expectedRoi}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Core Value Proposition</span>
                  <span className="text-slate-200 leading-tight block">{profile.recommendedDelcaSolution.valueProposition}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">Implementation Horizon</span>
                  <span className="text-slate-200 leading-tight block">{profile.recommendedDelcaSolution.implementationTimeframe}</span>
                </div>
              </div>
            </div>

            {/* 10, 11, 12: Recommended Summit, Workshop, Speaker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* 10. Summit */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-purple-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-purple-400">
                  <Calendar className="w-4 h-4" />
                  <span className="font-display font-bold text-xs font-mono uppercase">10. Recommended Summit</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{profile.recommendedSummit.title}</h4>
                <p className="text-[11px] text-slate-400">{profile.recommendedSummit.venueOrFormat} • {profile.recommendedSummit.dateOrQuarter}</p>
                <p className="text-xs text-slate-300 pt-1 border-t border-white/5">{profile.recommendedSummit.relevanceReasoning}</p>
              </div>

              {/* 11. Workshop */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Presentation className="w-4 h-4" />
                  <span className="font-display font-bold text-xs font-mono uppercase">11. Recommended Workshop</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{profile.recommendedWorkshop.title}</h4>
                <p className="text-[11px] text-slate-400">{profile.recommendedWorkshop.duration} • {profile.recommendedWorkshop.targetParticipants}</p>
                <div className="space-y-1 pt-1 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Deliverables:</span>
                  {profile.recommendedWorkshop.keyDeliverables.slice(0, 2).map((del, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-center space-x-1">
                      <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12. Speaker */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Award className="w-4 h-4" />
                  <span className="font-display font-bold text-xs font-mono uppercase">12. Recommended Speaker</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{profile.recommendedSpeaker.name}</h4>
                <p className="text-[11px] text-cyan-300">{profile.recommendedSpeaker.title}</p>
                <p className="text-xs text-slate-300 pt-1 border-t border-white/5">{profile.recommendedSpeaker.matchReason}</p>
              </div>

            </div>

            {/* 13. SUGGESTED SALES PITCH */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-xs text-amber-400 uppercase font-mono flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>13. Executive Sales Pitch Script</span>
                </h3>

                <button
                  onClick={handleCopyPitch}
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all"
                >
                  {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPitch ? 'Copied Pitch' : 'Copy Pitch Script'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-navy-950 border border-white/10 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap italic">
                {profile.suggestedSalesPitch}
              </div>
            </div>

            {/* 14. SUGGESTED OUTREACH EMAIL */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-display font-bold text-xs text-cyan-300 uppercase font-mono flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>14. Customized C-Suite Email Copy</span>
                </h3>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all border border-white/10"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied Email' : 'Copy Email'}</span>
                  </button>

                  <button
                    onClick={handleLaunchEmail}
                    className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch 1-Click Outreach Email</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 bg-navy-950 p-4 rounded-xl border border-white/10 text-xs">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Subject Line:</span>
                  <span className="font-bold text-white block pt-0.5">{profile.suggestedEmail.subject}</span>
                </div>
                <div className="pt-2 border-t border-white/10 whitespace-pre-wrap font-sans text-slate-200 leading-relaxed">
                  {profile.suggestedEmail.body}
                </div>
              </div>
            </div>

            {/* 15. RECOMMENDED NEXT ACTIONS */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <h3 className="font-display font-bold text-xs text-emerald-400 uppercase font-mono flex items-center space-x-2">
                <ListOrdered className="w-4 h-4 text-emerald-400" />
                <span>15. Recommended Sales Engagement Next Actions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {profile.recommendedNextActions.map((act, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-white/5 flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                      {i + 1}
                    </span>
                    <span className="text-xs text-slate-200 font-medium">{act}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Profile findings & recommendations automatically stored in Firestore Database.</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleLaunchEmail}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <Send className="w-4 h-4 text-navy-950" />
              <span>Initiate Executive Outreach</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
