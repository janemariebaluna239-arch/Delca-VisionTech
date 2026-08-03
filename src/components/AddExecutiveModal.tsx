import React, { useState, useEffect } from 'react';
import { Users, X, Save, AlertCircle, ShieldCheck, Calendar, Camera, MapPin, Tag as TagIcon } from 'lucide-react';
import { Executive, ContactStatus, RelationshipStage, ContactSource, CommunicationPreference } from '../types';
import { RELATIONSHIP_STAGES, CONTACT_SOURCES } from '../lib/contactUtils';

interface AddExecutiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (execData: Partial<Executive>) => Promise<void>;
  initialData?: Executive | null;
  executives?: Executive[];
}

export const AddExecutiveModal: React.FC<AddExecutiveModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  executives = []
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [industry, setIndustry] = useState('Logistics & Supply Chain');
  const [department, setDepartment] = useState('Operations');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('United States');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [contactStatus, setContactStatus] = useState<ContactStatus>('Verified');
  const [relationshipStage, setRelationshipStage] = useState<RelationshipStage>('Potential Client');
  const [contactSource, setContactSource] = useState<ContactSource>('LinkedIn');
  const [commPrefs, setCommPrefs] = useState<CommunicationPreference[]>(['Email', 'Phone']);
  const [tagsInput, setTagsInput] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [preferredEventCategories, setPreferredEventCategories] = useState('ERP & Cloud Modernization, Supply Chain & Logistics');
  const [previousEventAttendance, setPreviousEventAttendance] = useState('');
  const [referredById, setReferredById] = useState<string>('');
  const [referredByName, setReferredByName] = useState('');
  const [referralNotes, setReferralNotes] = useState('');
  const [notes, setNotes] = useState('');
  const [biography, setBiography] = useState('');
  const [education, setEducation] = useState('');
  const [decisionMakingStyle, setDecisionMakingStyle] = useState('Strategic ROI & High-Efficiency Focused');
  const [aiReadinessScore, setAiReadinessScore] = useState<number>(85);
  const [strategicPriorities, setStrategicPriorities] = useState('');
  const [painPoints, setPainPoints] = useState('');
  const [techStack, setTechStack] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName || '');
      setEmail(initialData.email || '');
      setContactNumber(initialData.contactNumber || initialData.phoneNumber || '');
      setCompany(initialData.company || '');
      setPosition(initialData.position || initialData.jobTitle || '');
      setIndustry(initialData.industry || 'Logistics & Supply Chain');
      setDepartment(initialData.department || 'Operations');
      setCity(initialData.city || '');
      setCountry(initialData.country || 'United States');
      setAvatarUrl(initialData.avatarUrl || '');
      setLinkedinProfile(initialData.linkedinProfile || '');
      setCompanyWebsite(initialData.companyWebsite || '');
      setContactStatus(initialData.contactStatus || 'Verified');
      setRelationshipStage(initialData.relationshipStage || 'Potential Client');
      setContactSource(initialData.contactSource || 'LinkedIn');
      setCommPrefs(initialData.communicationPreferences || ['Email', 'Phone']);
      setTagsInput((initialData.tags || []).join(', '));
      setFollowUpDate(initialData.followUpDate || '');
      setPreferredEventCategories((initialData.preferredEventCategories || []).join(', '));
      setPreviousEventAttendance((initialData.previousEventAttendance || []).join(', '));
      setReferredById(initialData.referredById || '');
      setReferredByName(initialData.referredByName || '');
      setReferralNotes(initialData.referralNotes || '');
      setNotes(initialData.notes || '');
      setBiography(initialData.biography || '');
      setEducation(initialData.education || '');
      setDecisionMakingStyle(initialData.decisionMakingStyle || 'Strategic ROI & High-Efficiency Focused');
      setAiReadinessScore(initialData.aiReadinessScore || 85);
      setStrategicPriorities((initialData.strategicPriorities || []).join(', '));
      setPainPoints((initialData.painPoints || []).join(', '));
      setTechStack((initialData.techStack || []).join(', '));
    } else {
      setFullName('');
      setEmail('');
      setContactNumber('');
      setCompany('');
      setPosition('');
      setIndustry('Logistics & Supply Chain');
      setDepartment('Operations');
      setCity('');
      setCountry('United States');
      setAvatarUrl('');
      setLinkedinProfile('');
      setCompanyWebsite('');
      setContactStatus('Verified');
      setRelationshipStage('New Contact');
      setContactSource('LinkedIn');
      setCommPrefs(['Email', 'Phone']);
      setTagsInput('Key Decision Maker, VIP');
      setFollowUpDate('');
      setPreferredEventCategories('ERP & Cloud Modernization, Supply Chain & Logistics');
      setPreviousEventAttendance('');
      setReferredById('');
      setReferredByName('');
      setReferralNotes('');
      setNotes('');
      setBiography('');
      setEducation('');
      setDecisionMakingStyle('Strategic ROI & High-Efficiency Focused');
      setAiReadinessScore(85);
      setStrategicPriorities('Cloud Core Migration, AI Process Automation');
      setPainPoints('Legacy Mainframe Overhead, Data Silos');
      setTechStack('SAP S/4HANA, Azure AI, Delca Cloud ERP');
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleCommPref = (pref: CommunicationPreference) => {
    if (commPrefs.includes(pref)) {
      setCommPrefs(commPrefs.filter(p => p !== pref));
    } else {
      setCommPrefs([...commPrefs, pref]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !company.trim() || !position.trim()) {
      setError('Full Name, Company, and Position/Job Title are required.');
      return;
    }

    try {
      setIsBusy(true);

      const prefCats = preferredEventCategories
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const pastAtt = previousEventAttendance
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const parsedTags = tagsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const parsedPriorities = strategicPriorities
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const parsedPains = painPoints
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const parsedTech = techStack
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      await onSave({
        fullName,
        position,
        jobTitle: position,
        email: email || `${fullName.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        contactNumber,
        phoneNumber: contactNumber,
        company,
        industry,
        department,
        city,
        country,
        avatarUrl: avatarUrl || `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250`,
        linkedinProfile,
        companyWebsite,
        contactStatus,
        relationshipStage,
        contactSource,
        communicationPreferences: commPrefs,
        tags: parsedTags,
        followUpDate: followUpDate || null,
        preferredEventCategories: prefCats,
        previousEventAttendance: pastAtt,
        referredById: referredById || null,
        referredByName: referredById ? executives.find(e => e.id === referredById)?.fullName || referredByName : referredByName,
        referralNotes,
        notes,
        biography,
        education,
        decisionMakingStyle,
        aiReadinessScore: Number(aiReadinessScore) || 85,
        technologyReadinessScore: Math.min(99, Number(aiReadinessScore) + 2),
        strategicPriorities: parsedPriorities,
        painPoints: parsedPains,
        techStack: parsedTech,
        recommendedNextActions: [
          `Schedule Executive Briefing at DELCA C-Suite Summit`,
          `Share specialized Case Study with ${fullName}`,
          `Deliver tailored ROI & TCO presentation for ${company}`
        ]
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save executive contact.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl max-w-4xl w-full p-6 space-y-5 shadow-2xl my-8 text-slate-100">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-display font-bold text-base">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>{initialData ? 'Edit Executive Profile' : 'Add Executive Contact'}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Victoria Sterling"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Position / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chief Operating Officer"
                value={position}
                onChange={e => setPosition(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Logistics Global"
                value={company}
                onChange={e => setCompany(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Industry</label>
              <select
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
                <option value="Banking & Financial Services">Banking & Financial Services</option>
                <option value="Manufacturing & Industrial">Manufacturing & Industrial</option>
                <option value="Aerospace & Defense">Aerospace & Defense</option>
                <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                <option value="Retail & Consumer Goods">Retail & Consumer Goods</option>
                <option value="Energy & Utilities">Energy & Utilities</option>
                <option value="Technology & Telecom">Technology & Telecom</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Department</label>
              <input
                type="text"
                placeholder="e.g. Operations & Fleet"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. London, Singapore"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Country / Region</label>
              <input
                type="text"
                placeholder="e.g. Singapore, United Kingdom, USA"
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Email Address</label>
              <input
                type="email"
                placeholder="v.sterling@apexlogistics.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+44 20 7946 0192"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Verification Status</label>
              <select
                value={contactStatus}
                onChange={e => setContactStatus(e.target.value as ContactStatus)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Verified">Verified Contact</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Unverified">Unverified</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Relationship Stage</label>
              <select
                value={relationshipStage}
                onChange={e => setRelationshipStage(e.target.value as RelationshipStage)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {RELATIONSHIP_STAGES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Contact Source</label>
              <select
                value={contactSource}
                onChange={e => setContactSource(e.target.value as ContactSource)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                {CONTACT_SOURCES.map(cs => (
                  <option key={cs} value={cs}>{cs}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Profile Photo (URL)</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">LinkedIn Profile</label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/username"
                value={linkedinProfile}
                onChange={e => setLinkedinProfile(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Company Website</label>
              <input
                type="text"
                placeholder="https://company.com"
                value={companyWebsite}
                onChange={e => setCompanyWebsite(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Follow-Up Reminder Date</label>
              <input
                type="date"
                value={followUpDate}
                onChange={e => setFollowUpDate(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="VIP, Key Decision Maker, ERP Migration"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* STRATEGIC AI PERSONA INTELLIGENCE SECTION */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
            <h4 className="text-xs font-mono uppercase text-purple-300 font-bold flex items-center space-x-1.5">
              <TagIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Persona & Strategic Intelligence Data</span>
            </h4>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Executive Biography / Summary</label>
              <textarea
                rows={2}
                placeholder="Brief background on executive leadership role, focus areas, and enterprise impact..."
                value={biography}
                onChange={e => setBiography(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 placeholder-slate-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Education & Credentials</label>
                <input
                  type="text"
                  placeholder="e.g. MBA Asian Institute of Management"
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Decision Making Style</label>
                <input
                  type="text"
                  placeholder="e.g. Strategic ROI & Growth Focused"
                  value={decisionMakingStyle}
                  onChange={e => setDecisionMakingStyle(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">AI Readiness Score (0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  placeholder="85"
                  value={aiReadinessScore}
                  onChange={e => setAiReadinessScore(Number(e.target.value))}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Strategic Priorities (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Cloud Core Migration, AI Process Automation"
                  value={strategicPriorities}
                  onChange={e => setStrategicPriorities(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Key Pain Points (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="Legacy System Overhead, Data Silos"
                  value={painPoints}
                  onChange={e => setPainPoints(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Current Tech Environment</label>
                <input
                  type="text"
                  placeholder="SAP S/4HANA, Azure Cloud, Delca Cloud"
                  value={techStack}
                  onChange={e => setTechStack(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1.5">Communication Preferences</label>
            <div className="flex flex-wrap gap-2">
              {(['Email', 'Phone', 'LinkedIn', 'In-Person'] as CommunicationPreference[]).map(p => {
                const active = commPrefs.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => toggleCommPref(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      active 
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}{p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Preferred Event Categories</label>
              <input
                type="text"
                placeholder="ERP & Cloud Modernization, Supply Chain & Logistics"
                value={preferredEventCategories}
                onChange={e => setPreferredEventCategories(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Previous Event Attendance</label>
              <input
                type="text"
                placeholder="Global Supply Chain Expo 2025, DELCA Fleet Forum"
                value={previousEventAttendance}
                onChange={e => setPreviousEventAttendance(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-3">
            <label className="block text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Executive Referral Chain & Introduction</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">Referred By Existing Contact</label>
                <select
                  value={referredById}
                  onChange={e => {
                    setReferredById(e.target.value);
                    if (e.target.value) {
                      const found = executives.find(ex => ex.id === e.target.value);
                      if (found) setReferredByName(found.fullName);
                    }
                  }}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="">-- Direct Acquisition / No Executive Referrer --</option>
                  {executives.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.fullName} ({ex.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase mb-1">External Referee Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Sir Robert Vance (Board Member)"
                  value={referredByName}
                  onChange={e => setReferredByName(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">Referral / Introduction Context</label>
              <input
                type="text"
                placeholder="Introduced at Munich Industrial Tech Roundtable by Victoria Sterling..."
                value={referralNotes}
                onChange={e => setReferralNotes(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Executive Notes & Business Requirements</label>
            <textarea
              rows={3}
              placeholder="Enter executive notes, business pain points, or outreach preferences..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isBusy}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Save Profile Changes' : 'Add Executive Contact'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

