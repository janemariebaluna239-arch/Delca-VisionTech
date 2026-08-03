import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Camera, 
  Upload, 
  RefreshCw, 
  Eye, 
  Download, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  ArrowRight, 
  UserCheck, 
  UserX, 
  Copy, 
  Check, 
  AlertOctagon, 
  Cpu, 
  Scan, 
  Fingerprint, 
  Award,
  Layers,
  HelpCircle,
  Shield,
  X,
  Plus,
  Zap,
  RotateCcw
} from 'lucide-react';

import { 
  VerificationRequest, 
  VerificationStatus, 
  VerificationRiskLevel, 
  VerificationDocumentType,
  VerificationType,
  PersonalInformation,
  UserRole
} from '../types';
import { INITIAL_VERIFICATION_REQUESTS } from '../data/mockIdentityData';

interface IdentityVerificationViewProps {
  sessionRole?: UserRole;
  userName?: string;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info' | 'purple' | 'amber' | 'emerald') => void;
}

export default function IdentityVerificationView({ sessionRole = 'Administrator', userName = 'Sarah Jenkins', onAddToast }: IdentityVerificationViewProps) {
  // Verification requests state
  const [requests, setRequests] = useState<VerificationRequest[]>(INITIAL_VERIFICATION_REQUESTS);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('All');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [confidenceFilter, setConfidenceFilter] = useState<string>('All');

  // Modals state
  const [selectedRequestForAdmin, setSelectedRequestForAdmin] = useState<VerificationRequest | null>(null);
  const [selectedRequestForReport, setSelectedRequestForReport] = useState<VerificationRequest | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  // Future Enhancements Modal
  const [isEnhancementsOpen, setIsEnhancementsOpen] = useState(false);
  const [isSecurityPanelOpen, setIsSecurityPanelOpen] = useState(false);

  // Action feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Low Quality ID Upload');
  const [isRejecting, setIsRejecting] = useState(false);

  // ====================================================
  // WIZARD STATE (Interactive 13-step Verification Process)
  // ====================================================
  const [formData, setFormData] = useState<PersonalInformation>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    birthday: '1996-05-18',
    age: 30,
    gender: 'Female',
    nationality: 'Filipino',
    civilStatus: 'Single',
    address: 'Unit 1402 Tower B, Two Serendra',
    province: 'Metro Manila',
    municipality: 'Taguig City',
    barangay: 'Fort Bonifacio',
    zipCode: '1634',
    emailAddress: 'janemariebaluna239@gmail.com',
    mobileNumber: '+639178239011'
  });

  const [wizardDocType, setWizardDocType] = useState<VerificationDocumentType>('Passport');
  const [wizardIdNumber, setWizardIdNumber] = useState('P9081242A');
  const [uploadedFrontImg, setUploadedFrontImg] = useState<string>('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400');
  const [uploadedSelfieImg, setUploadedSelfieImg] = useState<string>('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300');
  
  // Wizard Live Simulation Steps State
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [livenessChallengeIndex, setLivenessChallengeIndex] = useState(0);
  const [livenessActionsDone, setLivenessActionsDone] = useState<string[]>([]);
  const [isLivenessPassing, setIsLivenessPassing] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState('');
  const [phoneOtpVerified, setPhoneOtpVerified] = useState(false);
  const [otpResendTimer, setOtpResendTimer] = useState(60);

  // Auto calculate age
  useEffect(() => {
    if (formData.birthday) {
      const birthYear = new Date(formData.birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      const calcAge = currentYear - birthYear;
      setFormData(prev => ({ ...prev, age: isNaN(calcAge) ? 30 : calcAge }));
    }
  }, [formData.birthday]);

  // Phone OTP timer
  useEffect(() => {
    let timer: any;
    if (phoneOtpSent && otpResendTimer > 0) {
      timer = setInterval(() => {
        setOtpResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phoneOtpSent, otpResendTimer]);

  // Handle Liveness Interactive Action
  const handlePerformLivenessAction = (actionName: string) => {
    if (!livenessActionsDone.includes(actionName)) {
      const nextDone = [...livenessActionsDone, actionName];
      setLivenessActionsDone(nextDone);
      if (nextDone.length >= 4) {
        setIsLivenessPassing(true);
      }
    }
  };

  // Helper calculation metrics
  const totalRequests = requests.length;
  const verifiedUsers = requests.filter(r => r.status === 'Verified').length;
  const pendingUsers = requests.filter(r => r.status === 'Pending Verification').length;
  const manualReviews = requests.filter(r => r.status === 'Needs Manual Review').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;
  const duplicatesCount = requests.filter(r => r.duplicateFraudData.duplicateDetected).length;
  const fraudAlerts = requests.filter(r => r.status === 'Flagged Fraud' || r.duplicateFraudData.riskLevel === 'High' || r.duplicateFraudData.riskLevel === 'Critical').length;
  const avgConfidenceScore = Math.round(requests.reduce((acc, r) => acc + r.overallConfidenceScore, 0) / (totalRequests || 1));
  const successRate = Math.round((verifiedUsers / (totalRequests || 1)) * 100);

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.personalInfo.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.personalInfo.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.personalInfo.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.documentInfo.idNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesType = typeFilter === 'All' || req.verificationType === typeFilter;
    const matchesDocType = docTypeFilter === 'All' || req.documentInfo.documentType === docTypeFilter;
    const matchesRisk = riskFilter === 'All' || req.duplicateFraudData.riskLevel === riskFilter;

    let matchesConfidence = true;
    if (confidenceFilter === 'High (>90%)') matchesConfidence = req.overallConfidenceScore >= 90;
    else if (confidenceFilter === 'Moderate (70-90%)') matchesConfidence = req.overallConfidenceScore >= 70 && req.overallConfidenceScore < 90;
    else if (confidenceFilter === 'Low (<70%)') matchesConfidence = req.overallConfidenceScore < 70;

    return matchesSearch && matchesStatus && matchesType && matchesDocType && matchesRisk && matchesConfidence;
  });

  // Admin Actions
  const handleApproveRequest = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        const updatedComments = [
          ...(r.reviewerComments || []),
          {
            id: `comm-${Date.now()}`,
            reviewer: userName,
            role: sessionRole,
            timestamp: new Date().toISOString(),
            comment: adminNoteInput || 'Approved by Administrator after identity review.',
            action: 'Approved' as const
          }
        ];
        const updatedAudit = [
          ...r.auditLog,
          {
            timestamp: new Date().toISOString(),
            action: 'Manual Override Approval',
            actor: `${userName} (${sessionRole})`,
            details: `Approved verification request ${r.referenceNumber}`
          }
        ];
        return {
          ...r,
          status: 'Verified' as VerificationStatus,
          assignedReviewer: userName,
          adminNotes: adminNoteInput || r.adminNotes,
          reviewerComments: updatedComments,
          auditLog: updatedAudit
        };
      }
      return r;
    }));

    if (onAddToast) {
      onAddToast('Identity Verified Successfully', `Verification request ${reqId} has been approved.`, 'emerald');
    }
    setSelectedRequestForAdmin(null);
    setAdminNoteInput('');
  };

  const handleRejectRequest = (reqId: string) => {
    setRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        const updatedComments = [
          ...(r.reviewerComments || []),
          {
            id: `comm-${Date.now()}`,
            reviewer: userName,
            role: sessionRole,
            timestamp: new Date().toISOString(),
            comment: `Rejected: ${rejectionReason}. Note: ${adminNoteInput}`,
            action: 'Rejected' as const
          }
        ];
        const updatedAudit = [
          ...r.auditLog,
          {
            timestamp: new Date().toISOString(),
            action: 'Manual Rejection',
            actor: `${userName} (${sessionRole})`,
            details: `Rejected request ${r.referenceNumber} (Reason: ${rejectionReason})`
          }
        ];
        return {
          ...r,
          status: 'Rejected' as VerificationStatus,
          assignedReviewer: userName,
          adminNotes: `Rejected due to ${rejectionReason}. ${adminNoteInput}`,
          reviewerComments: updatedComments,
          auditLog: updatedAudit
        };
      }
      return r;
    }));

    if (onAddToast) {
      onAddToast('Verification Rejected', `Request ${reqId} was set to Rejected. User notified via email/SMS.`, 'amber');
    }
    setSelectedRequestForAdmin(null);
    setIsRejecting(false);
    setAdminNoteInput('');
  };

  // Submit Completed Wizard Verification
  const handleCompleteWizardSubmission = () => {
    const newId = `VER-REQ-${String(requests.length + 1).padStart(3, '0')}`;
    const newRef = `VER-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newReq: VerificationRequest = {
      id: newId,
      referenceNumber: newRef,
      dateSubmitted: new Date().toISOString(),
      verificationType: 'User',
      personalInfo: { ...formData },
      documentInfo: {
        documentType: wizardDocType,
        idNumber: wizardIdNumber || 'P9081242A',
        frontImageUrl: uploadedFrontImg,
        issueDate: '2022-01-15',
        expirationDate: '2032-01-15',
        imageQualityScore: 97,
        qualityCheckResults: [
          { check: 'Resolution Check', status: 'Passed', details: 'HD Clarity 300 DPI' },
          { check: 'Framing & Bounds', status: 'Passed', details: 'All ID corners detected' },
          { check: 'Glare Detection', status: 'Passed', details: 'Zero glare interference' }
        ]
      },
      ocrData: {
        fullName: `${formData.firstName} ${formData.middleName ? formData.middleName + ' ' : ''}${formData.lastName}`,
        birthday: formData.birthday,
        address: `${formData.barangay}, ${formData.municipality}, ${formData.province}`,
        gender: formData.gender,
        nationality: formData.nationality,
        idNumber: wizardIdNumber,
        expirationDate: '2032-01-15',
        issueDate: '2022-01-15',
        documentType: wizardDocType,
        ocrMatchPercentage: 98.6,
        differences: [
          { field: 'Full Name', enteredValue: `${formData.firstName} ${formData.lastName}`, extractedValue: `${formData.firstName} ${formData.middleName} ${formData.lastName}`, hasDifference: false }
        ]
      },
      selfieData: {
        selfieImageUrl: uploadedSelfieImg,
        faceMatchScore: 99.2,
        faceMatchStatus: 'Verified',
        livenessStatus: 'Passed',
        livenessActionsCompleted: livenessActionsDone,
        spoofingDetections: [
          { test: '3D Mesh Liveness Check', status: 'Passed', details: 'Real-time depth & skin texture verified' },
          { test: 'Deepfake Model Inspection', status: 'Passed', details: 'Zero generative deepfake artifacts' }
        ]
      },
      authenticityData: {
        authenticityScore: 97,
        authenticityStatus: 'Likely Genuine',
        structuralChecks: [
          { checkName: 'Microtext & Font Inspection', passed: true, details: 'Official government font typography matched' },
          { checkName: 'Security Hologram Pattern', passed: true, details: 'Holographic watermark verified' }
        ]
      },
      contactData: {
        emailValid: true,
        emailDomainExists: true,
        disposableEmail: false,
        emailSpamRiskScore: 2,
        emailVerified: true,
        phoneValid: true,
        phoneCarrier: 'Globe Telecom',
        phoneCountryCode: '+63',
        phoneOtpVerified: true,
        addressLogicalConsistency: true,
        addressSuggestions: `${formData.address}, ${formData.municipality}, ${formData.province} ${formData.zipCode}`
      },
      duplicateFraudData: {
        duplicateDetected: false,
        duplicateSimilarityScore: 3,
        duplicateFields: [],
        fraudRiskScore: 2,
        riskLevel: 'Low',
        fraudFlags: []
      },
      overallConfidenceScore: 98,
      status: 'Verified',
      assignedReviewer: 'AI Auto-Approval Engine',
      adminNotes: 'Auto-verified via DELCA AI Identity Verification Engine 13-Step Automated Process.',
      reviewerComments: [
        {
          id: `comm-wiz-${Date.now()}`,
          reviewer: 'AI Verification System',
          role: 'Autonomous System',
          timestamp: new Date().toISOString(),
          comment: 'Submitted via 13-Step AI Engine. All biometric & document security checks passed with 98% confidence.',
          action: 'Approved'
        }
      ],
      auditLog: [
        { timestamp: new Date().toISOString(), action: '13-Step Verification Submitted', actor: `${formData.firstName} ${formData.lastName}`, details: 'Completed all 13 AI Verification Steps' },
        { timestamp: new Date().toISOString(), action: 'AI Auto-Approval', actor: 'AI Verification System', details: 'Assigned status: VERIFIED (98% Confidence)' }
      ]
    };

    setRequests(prev => [newReq, ...prev]);
    setIsWizardOpen(false);
    setWizardStep(1);

    if (onAddToast) {
      onAddToast('Identity Verification Completed!', `New verification request ${newRef} submitted and AUTO-APPROVED with 98% AI Confidence Score.`, 'purple');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-[fadeIn_0.2s_ease-out_1]">
      {/* HEADER BAR & ENGINE METADATA */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>DELCA VisionTech • Autonomous KYC & Biometric Sentinel</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tight flex items-center space-x-3">
              <span>AI Identity Verification Engine</span>
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
                v4.8 Enterprise
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Automated AI biometric matching, OCR extraction, anti-spoofing liveness detection, and document fraud analysis. Generates real-time AI confidence scores to prevent fraud and streamline compliance approvals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSecurityPanelOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-sm"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Security & Audit Log</span>
            </button>

            <button
              onClick={() => setIsEnhancementsOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Future AI Roadmap</span>
            </button>

            <button
              onClick={() => {
                setWizardStep(1);
                setIsWizardOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 text-xs font-mono font-black flex items-center space-x-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Start 13-Step Verification Wizard</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUMMARY METRICS DASHBOARD CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
        <div className="bg-navy-950/80 border border-white/10 rounded-2xl p-4 space-y-2 shadow-md hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] font-semibold">
            <span>Total Requests</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-display text-white">{totalRequests}</div>
          <div className="text-[10px] text-slate-400 font-mono">100% Ingested</div>
        </div>

        <div className="bg-navy-950/80 border border-emerald-500/20 rounded-2xl p-4 space-y-2 shadow-md hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between text-emerald-400 font-mono text-[11px] font-semibold">
            <span>Verified Users</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-display text-emerald-300">{verifiedUsers}</div>
          <div className="text-[10px] text-emerald-400/80 font-mono">{successRate}% Success Rate</div>
        </div>

        <div className="bg-navy-950/80 border border-amber-500/20 rounded-2xl p-4 space-y-2 shadow-md hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between text-amber-400 font-mono text-[11px] font-semibold">
            <span>Manual Reviews</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-display text-amber-300">{manualReviews}</div>
          <div className="text-[10px] text-amber-400/80 font-mono">Pending Admin Approval</div>
        </div>

        <div className="bg-navy-950/80 border border-purple-500/20 rounded-2xl p-4 space-y-2 shadow-md hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between text-purple-400 font-mono text-[11px] font-semibold">
            <span>Duplicates Detected</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-display text-purple-300">{duplicatesCount}</div>
          <div className="text-[10px] text-purple-400/80 font-mono">Cross-Database Match</div>
        </div>

        <div className="bg-navy-950/80 border border-rose-500/20 rounded-2xl p-4 space-y-2 shadow-md hover:border-rose-500/40 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-rose-400 font-mono text-[11px] font-semibold">
            <span>Fraud Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black font-display text-rose-300">{fraudAlerts}</div>
          <div className="text-[10px] text-rose-400/80 font-mono">{rejectedCount} Rejected Records</div>
        </div>
      </div>

      {/* ADDITIONAL KPI BAR: AI CONFIDENCE & HISTORY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-cyan-500/20 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">Average AI Confidence Score</div>
            <div className="text-3xl font-black font-display text-cyan-300 flex items-center space-x-2">
              <span>{avgConfidenceScore}%</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">High Precision</span>
            </div>
          </div>
          <Cpu className="w-10 h-10 text-cyan-400/40 shrink-0" />
        </div>

        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-emerald-500/20 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">Verification Success Rate</div>
            <div className="text-3xl font-black font-display text-emerald-300 flex items-center space-x-2">
              <span>{successRate}%</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Auto Verified</span>
            </div>
          </div>
          <Fingerprint className="w-10 h-10 text-emerald-400/40 shrink-0" />
        </div>

        <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-purple-500/20 rounded-2xl p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">Verification History Log</div>
            <div className="text-3xl font-black font-display text-purple-300 flex items-center space-x-2">
              <span>1,482</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">Audit Sealed</span>
            </div>
          </div>
          <Scan className="w-10 h-10 text-purple-400/40 shrink-0" />
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-navy-950/80 border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, reference number, email, or government ID number..."
              className="w-full bg-navy-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 font-mono focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono shrink-0">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>Showing {filteredRequests.length} of {requests.length} records</span>
          </div>
        </div>

        {/* MULTI-FILTER DROPDOWNS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2 border-t border-white/5">
          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verification Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-navy-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              <option value="Verified">Verified</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Needs Manual Review">Needs Manual Review</option>
              <option value="Rejected">Rejected</option>
              <option value="Flagged Fraud">Flagged Fraud</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verification Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-navy-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Verification Types</option>
              <option value="User">User</option>
              <option value="Customer">Customer</option>
              <option value="Applicant">Applicant</option>
              <option value="Employee">Employee</option>
              <option value="Business Partner">Business Partner</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Document Type</label>
            <select
              value={docTypeFilter}
              onChange={(e) => setDocTypeFilter(e.target.value)}
              className="w-full bg-navy-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Documents</option>
              <option value="National ID">National ID</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver's License</option>
              <option value="UMID">UMID</option>
              <option value="Postal ID">Postal ID</option>
              <option value="PRC ID">PRC ID</option>
              <option value="Voter's ID">Voter's ID</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Risk Level</label>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-navy-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
              <option value="Critical">Critical Risk</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">AI Confidence Score</label>
            <select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
              className="w-full bg-navy-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Confidence Scores</option>
              <option value="High (>90%)">High (&gt;90%)</option>
              <option value="Moderate (70-90%)">Moderate (70-90%)</option>
              <option value="Low (<70%)">Low (&lt;70%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SEARCHABLE TABLE OF VERIFICATION REQUESTS */}
      <div className="bg-navy-950/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-navy-900/50">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Identity Verification Records ({filteredRequests.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Click "Inspect Console" to review side-by-side biometric & document findings
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-navy-900/80 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-bold">Reference / User</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Document Type</th>
                <th className="p-4 font-bold">AI Confidence</th>
                <th className="p-4 font-bold">Risk Level</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Reviewer</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-mono text-xs">
                    No verification records match your selected filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map(req => {
                  return (
                    <tr 
                      key={req.id} 
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setSelectedRequestForAdmin(req)}
                    >
                      <td className="p-4 space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-white font-display">
                            {req.personalInfo.firstName} {req.personalInfo.lastName}
                          </span>
                          {req.duplicateFraudData.duplicateDetected && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[9px] font-bold border border-purple-500/30">
                              DUPLICATE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono">
                          {req.referenceNumber} • {new Date(req.dateSubmitted).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-white/10 text-slate-300 text-[11px] font-semibold">
                          {req.verificationType}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-1.5 text-slate-200">
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{req.documentInfo.documentType}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {req.documentInfo.idNumber}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-navy-900 rounded-full h-2 overflow-hidden border border-white/10">
                            <div 
                              className={`h-full rounded-full ${
                                req.overallConfidenceScore >= 90 ? 'bg-emerald-400' :
                                req.overallConfidenceScore >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                              }`}
                              style={{ width: `${req.overallConfidenceScore}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold text-xs ${
                            req.overallConfidenceScore >= 90 ? 'text-emerald-300' :
                            req.overallConfidenceScore >= 70 ? 'text-amber-300' : 'text-rose-300'
                          }`}>
                            {req.overallConfidenceScore}%
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          req.duplicateFraudData.riskLevel === 'Low' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                          req.duplicateFraudData.riskLevel === 'Medium' ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' :
                          req.duplicateFraudData.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-300 border-orange-500/30' :
                          'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        }`}>
                          {req.duplicateFraudData.riskLevel} Risk
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center space-x-1 w-fit border ${
                          req.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          req.status === 'Needs Manual Review' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          req.status === 'Pending Verification' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                          req.status === 'Rejected' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                          'bg-rose-600/30 text-rose-200 border-rose-500/50'
                        }`}>
                          {req.status === 'Verified' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          {req.status === 'Needs Manual Review' && <Clock className="w-3 h-3 text-amber-400" />}
                          {req.status === 'Flagged Fraud' && <AlertOctagon className="w-3 h-3 text-rose-400" />}
                          <span>{req.status}</span>
                        </span>
                      </td>

                      <td className="p-4 text-slate-300 text-[11px]">
                        {req.assignedReviewer}
                      </td>

                      <td className="p-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRequestForAdmin(req)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
                        >
                          Inspect Console
                        </button>
                        <button
                          onClick={() => setSelectedRequestForReport(req)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold transition-all"
                          title="Generate Downloadable PDF Report"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================
          ADMIN VERIFICATION CONSOLE MODAL
      ==================================================== */}
      {selectedRequestForAdmin && (
        <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-navy-900 to-slate-900 border border-cyan-500/40 rounded-2xl max-w-5xl w-full p-6 shadow-2xl space-y-6 animate-[fadeIn_0.2s_ease-out_1] max-h-[92vh] flex flex-col">
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg text-navy-950 font-black font-mono">
                  <Fingerprint className="w-7 h-7" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold font-display text-white">
                      Admin Verification Console • {selectedRequestForAdmin.referenceNumber}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                      selectedRequestForAdmin.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {selectedRequestForAdmin.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    Candidate: <span className="text-white font-bold">{selectedRequestForAdmin.personalInfo.firstName} {selectedRequestForAdmin.personalInfo.lastName}</span> ({selectedRequestForAdmin.personalInfo.emailAddress})
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedRequestForAdmin(null);
                  setIsRejecting(false);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY (SCROLLABLE SIDE-BY-SIDE ANALYTICS) */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* TOP SCORE GAUGES & AI FINDINGS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-navy-950/80 border border-cyan-500/30 rounded-xl p-4 text-center space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">AI Confidence Score</div>
                  <div className="text-3xl font-black font-display text-cyan-300">{selectedRequestForAdmin.overallConfidenceScore}%</div>
                  <div className="text-[10px] text-cyan-400 font-mono">Combined 13-Step Check</div>
                </div>

                <div className="bg-navy-950/80 border border-emerald-500/30 rounded-xl p-4 text-center space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Face Match Score</div>
                  <div className="text-3xl font-black font-display text-emerald-300">{selectedRequestForAdmin.selfieData.faceMatchScore}%</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Biometric Mesh Matched</div>
                </div>

                <div className="bg-navy-950/80 border border-purple-500/30 rounded-xl p-4 text-center space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Authenticity Score</div>
                  <div className="text-3xl font-black font-display text-purple-300">{selectedRequestForAdmin.authenticityData.authenticityScore}%</div>
                  <div className="text-[10px] text-purple-400 font-mono">{selectedRequestForAdmin.authenticityData.authenticityStatus}</div>
                </div>

                <div className="bg-navy-950/80 border border-amber-500/30 rounded-xl p-4 text-center space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Fraud Risk Level</div>
                  <div className="text-3xl font-black font-display text-amber-300">{selectedRequestForAdmin.duplicateFraudData.riskLevel}</div>
                  <div className="text-[10px] text-amber-400 font-mono">Risk Score: {selectedRequestForAdmin.duplicateFraudData.fraudRiskScore}%</div>
                </div>
              </div>

              {/* SIDE-BY-SIDE: REGISTRATION DATA VS AI OCR EXTRACTED ID DATA */}
              <div className="bg-navy-950/90 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center space-x-2 text-xs font-bold font-display text-white">
                    <Scan className="w-4 h-4 text-cyan-400" />
                    <span>AI OCR Data Extraction Comparison ({selectedRequestForAdmin.ocrData.ocrMatchPercentage}% Match)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Doc: {selectedRequestForAdmin.documentInfo.documentType} ({selectedRequestForAdmin.documentInfo.idNumber})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Registered Details */}
                  <div className="space-y-2 bg-navy-900/60 p-3 rounded-xl border border-white/5">
                    <div className="text-xs font-bold text-cyan-400 font-mono uppercase">User Form Registered Data</div>
                    <div className="space-y-1.5 text-xs text-slate-200 font-mono">
                      <div><span className="text-slate-400">Full Name:</span> <span className="font-bold text-white">{selectedRequestForAdmin.personalInfo.firstName} {selectedRequestForAdmin.personalInfo.middleName} {selectedRequestForAdmin.personalInfo.lastName}</span></div>
                      <div><span className="text-slate-400">Birthday:</span> {selectedRequestForAdmin.personalInfo.birthday} ({selectedRequestForAdmin.personalInfo.age} yrs)</div>
                      <div><span className="text-slate-400">Gender / Nat:</span> {selectedRequestForAdmin.personalInfo.gender} • {selectedRequestForAdmin.personalInfo.nationality}</div>
                      <div><span className="text-slate-400">Address:</span> {selectedRequestForAdmin.personalInfo.address}, {selectedRequestForAdmin.personalInfo.municipality}, {selectedRequestForAdmin.personalInfo.province} {selectedRequestForAdmin.personalInfo.zipCode}</div>
                      <div><span className="text-slate-400">Contact:</span> {selectedRequestForAdmin.personalInfo.emailAddress} • {selectedRequestForAdmin.personalInfo.mobileNumber}</div>
                    </div>
                  </div>

                  {/* AI Extracted Details from ID */}
                  <div className="space-y-2 bg-navy-900/60 p-3 rounded-xl border border-white/5">
                    <div className="text-xs font-bold text-emerald-400 font-mono uppercase">AI OCR Extracted Government ID Data</div>
                    <div className="space-y-1.5 text-xs text-slate-200 font-mono">
                      <div><span className="text-slate-400">Extracted Name:</span> <span className="font-bold text-white">{selectedRequestForAdmin.ocrData.fullName}</span></div>
                      <div><span className="text-slate-400">Extracted DOB:</span> {selectedRequestForAdmin.ocrData.birthday}</div>
                      <div><span className="text-slate-400">Extracted Gender/Nat:</span> {selectedRequestForAdmin.ocrData.gender} • {selectedRequestForAdmin.ocrData.nationality}</div>
                      <div><span className="text-slate-400">Extracted Address:</span> {selectedRequestForAdmin.ocrData.address}</div>
                      <div><span className="text-slate-400">ID Issue / Exp:</span> {selectedRequestForAdmin.ocrData.issueDate || 'N/A'} • Exp: {selectedRequestForAdmin.ocrData.expirationDate}</div>
                    </div>
                  </div>
                </div>

                {/* HIGHLIGHTED DIFFERENCES */}
                {selectedRequestForAdmin.ocrData.differences && selectedRequestForAdmin.ocrData.differences.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="text-[11px] font-mono font-bold text-amber-400 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Detected Data Differences / Tolerance Notes:</span>
                    </div>
                    {selectedRequestForAdmin.ocrData.differences.map((diff, idx) => (
                      <div key={idx} className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-200 flex items-center justify-between">
                        <span>{diff.field}: Registered "{diff.enteredValue}" vs ID "{diff.extractedValue}"</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">{diff.note || 'Minor Abbreviation'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DOCUMENT & SELFIE BIOMETRIC COMPARISON */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-navy-950/90 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold font-display text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Uploaded Identity Document ({selectedRequestForAdmin.documentInfo.documentType})</span>
                  </div>
                  <div className="aspect-video bg-navy-900 rounded-xl overflow-hidden border border-white/10 relative group">
                    <img 
                      src={selectedRequestForAdmin.documentInfo.frontImageUrl} 
                      alt="Government ID"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <span className="text-xs font-mono font-bold text-white bg-navy-900/90 px-3 py-1.5 rounded-xl border border-cyan-500/40">
                        Resolution Quality: {selectedRequestForAdmin.documentInfo.imageQualityScore}% (Passed)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-navy-950/90 border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-bold font-display text-white flex items-center space-x-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Live Biometric Selfie & Anti-Spoofing</span>
                  </div>
                  <div className="aspect-video bg-navy-900 rounded-xl overflow-hidden border border-white/10 relative flex items-center justify-center">
                    <img 
                      src={selectedRequestForAdmin.selfieData.selfieImageUrl} 
                      alt="Selfie"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 p-2 bg-navy-950/80 backdrop-blur-md rounded-lg border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-emerald-300 font-bold">Liveness: {selectedRequestForAdmin.selfieData.livenessStatus}</span>
                      <span className="text-cyan-300 font-bold">Face Match: {selectedRequestForAdmin.selfieData.faceMatchScore}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AUDIT LOG & REVIWER COMMENTS */}
              <div className="bg-navy-950/90 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold font-display text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>Audit Trail & Reviewer Notes ({selectedRequestForAdmin.auditLog.length} events)</span>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedRequestForAdmin.auditLog.map((log, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-navy-900/60 border border-white/5 text-xs font-mono flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-200">{log.action} • <span className="text-purple-300">{log.actor}</span></div>
                        <div className="text-[10px] text-slate-400">{log.details}</div>
                      </div>
                      <span className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MODAL FOOTER ADMIN DECISION CONTROL */}
            <div className="border-t border-white/10 pt-4 space-y-3 shrink-0">
              {isRejecting ? (
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-3 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="text-xs font-mono font-bold text-rose-300 uppercase">Specify Rejection Reason & Admin Explanation</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="bg-navy-900 border border-rose-500/40 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                    >
                      <option value="Low Quality ID Upload">Low Quality / Blurry ID Upload</option>
                      <option value="Biometric Face Mismatch">Biometric Face Mismatch</option>
                      <option value="Failed Liveness Challenge">Failed Liveness / Anti-Spoofing Challenge</option>
                      <option value="Suspected Document Fraud">Suspected Document Tampering / Fake ID</option>
                      <option value="Duplicate Account Detected">Duplicate Account Detected</option>
                      <option value="Unverifiable Address">Unverifiable Address / Contact Details</option>
                    </select>

                    <input
                      type="text"
                      value={adminNoteInput}
                      onChange={(e) => setAdminNoteInput(e.target.value)}
                      placeholder="Add specific comments for candidate email notification..."
                      className="bg-navy-900 border border-rose-500/40 rounded-xl p-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => setIsRejecting(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 text-xs font-mono font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleRejectRequest(selectedRequestForAdmin.id)}
                      className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-mono font-black shadow-lg shadow-rose-500/20"
                    >
                      Confirm Reject Record
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedRequestForReport(selectedRequestForAdmin)}
                      className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono font-bold flex items-center space-x-2 border border-white/10"
                    >
                      <Download className="w-4 h-4 text-cyan-400" />
                      <span>Download PDF Report</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsRejecting(true)}
                      className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center space-x-1.5"
                    >
                      <UserX className="w-4 h-4 text-rose-400" />
                      <span>Reject Application</span>
                    </button>

                    <button
                      onClick={() => handleApproveRequest(selectedRequestForAdmin.id)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 text-xs font-mono font-black flex items-center space-x-2 shadow-lg shadow-emerald-500/25"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve & Seal Identity</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          13-STEP INTERACTIVE VERIFICATION WIZARD MODAL
      ==================================================== */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-navy-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-navy-900 to-slate-900 border border-cyan-500/40 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-5 animate-[fadeIn_0.2s_ease-out_1] max-h-[92vh] flex flex-col">
            {/* WIZARD HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-mono font-bold text-sm">
                  {wizardStep}/13
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    13-Step AI Identity Verification Flow
                  </h3>
                  <div className="text-xs text-slate-300 font-mono">
                    Step {wizardStep}: {
                      wizardStep === 1 ? 'Personal Information Entry' :
                      wizardStep === 2 ? 'Identity Document Upload & Quality Check' :
                      wizardStep === 3 ? 'AI OCR Data Extraction' :
                      wizardStep === 4 ? 'AI Information Matching' :
                      wizardStep === 5 ? 'Live Selfie Biometric Verification' :
                      wizardStep === 6 ? 'Anti-Spoofing Liveness Challenge' :
                      wizardStep === 7 ? 'Document Authenticity Structural Analysis' :
                      wizardStep === 8 ? 'Email Format & Risk Validation' :
                      wizardStep === 9 ? 'Phone Number & OTP Carrier Check' :
                      wizardStep === 10 ? 'Address Logical Consistency Check' :
                      wizardStep === 11 ? 'Cross-Database Duplicate Detection' :
                      wizardStep === 12 ? 'AI Behavioral Fraud Detection' :
                      'Final AI Confidence Score & Approval'
                    }
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsWizardOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WIZARD PROGRESS STEPPER BAR */}
            <div className="flex items-center space-x-1 overflow-x-auto py-2 border-b border-white/5 shrink-0 text-[10px] font-mono">
              {Array.from({ length: 13 }).map((_, i) => {
                const stepNum = i + 1;
                const isCurrent = wizardStep === stepNum;
                const isPassed = wizardStep > stepNum;
                return (
                  <button
                    key={stepNum}
                    onClick={() => setWizardStep(stepNum)}
                    className={`px-2.5 py-1 rounded-lg transition-all shrink-0 font-bold ${
                      isCurrent ? 'bg-cyan-500 text-navy-950' :
                      isPassed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      'bg-navy-950 text-slate-400 border border-white/5'
                    }`}
                  >
                    Step {stepNum}
                  </button>
                );
              })}
            </div>

            {/* WIZARD STEP CONTENT BODY */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {/* STEP 1: PERSONAL INFORMATION */}
              {wizardStep === 1 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-mono">
                    Enter full legal name and personal information exactly as printed on your government-issued ID.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">First Name *</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="e.g. Jane Marie"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Middle Name</label>
                      <input
                        type="text"
                        value={formData.middleName}
                        onChange={(e) => setFormData({ ...formData, middleName: e.target.value })}
                        placeholder="e.g. Torres"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Last Name *</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Baluna"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Suffix</label>
                      <input
                        type="text"
                        value={formData.suffix}
                        onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                        placeholder="Jr., Sr., III"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Birthday *</label>
                      <input
                        type="date"
                        value={formData.birthday}
                        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Age (Auto-calc)</label>
                      <input
                        type="number"
                        disabled
                        value={formData.age}
                        className="w-full bg-navy-900 border border-white/5 rounded-xl p-2.5 text-xs text-cyan-300 font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Address / Street *</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Block / Lot / Unit / Street"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Municipality / City *</label>
                      <input
                        type="text"
                        value={formData.municipality}
                        onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                        placeholder="Taguig City"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Province *</label>
                      <input
                        type="text"
                        value={formData.province}
                        onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                        placeholder="Metro Manila"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Email Address *</label>
                      <input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Mobile Number *</label>
                      <input
                        type="text"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">ZIP Code *</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: DOCUMENT UPLOAD & QUALITY CHECK */}
              {wizardStep === 2 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">Select Government ID Type</label>
                      <select
                        value={wizardDocType}
                        onChange={(e) => setWizardDocType(e.target.value as any)}
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Passport">Passport</option>
                        <option value="National ID">PhilSys National ID</option>
                        <option value="Driver's License">Driver's License (LTO)</option>
                        <option value="UMID">UMID Card (SSS/GSIS)</option>
                        <option value="Postal ID">Postal ID</option>
                        <option value="PRC ID">PRC License</option>
                        <option value="Voter's ID">Voter's ID</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">ID Number</label>
                      <input
                        type="text"
                        value={wizardIdNumber}
                        onChange={(e) => setWizardIdNumber(e.target.value)}
                        placeholder="e.g. P9081242A"
                        className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div className="border-2 border-dashed border-cyan-500/40 rounded-2xl p-6 text-center space-y-3 bg-navy-950/60 hover:border-cyan-400 transition-all">
                    <Upload className="w-10 h-10 text-cyan-400 mx-auto animate-bounce" />
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-white font-display">Drag & Drop Government ID Front Photo</div>
                      <div className="text-xs text-slate-400 font-mono">PNG, JPG, or WEBP up to 10MB</div>
                    </div>
                    <div className="flex items-center justify-center space-x-2 pt-2">
                      <button className="px-4 py-2 rounded-xl bg-cyan-500 text-navy-950 text-xs font-mono font-bold">
                        Browse File
                      </button>
                    </div>
                  </div>

                  {/* Automatic Image Quality Check Report */}
                  <div className="bg-navy-950 border border-emerald-500/30 rounded-xl p-4 space-y-2 text-xs font-mono">
                    <div className="text-xs font-bold text-emerald-300 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Automatic Quality Scan: 98% Score (Passed)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                      <div>• Resolution: 300 DPI (HD)</div>
                      <div>• Crop: All 4 corners visible</div>
                      <div>• Blur: 0% Motion blur</div>
                      <div>• Glare: Zero reflections</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: AI OCR EXTRACTION */}
              {wizardStep === 3 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="flex items-center justify-between p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                    <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
                      <Scan className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                      <span>AI Computer Vision Scanning & Field Extraction</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                      Match: 99.2%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-navy-950 rounded-xl border border-white/10 space-y-2">
                      <div className="font-bold text-cyan-400 uppercase">1. Entered Registration Form</div>
                      <div>Name: {formData.firstName} {formData.middleName} {formData.lastName}</div>
                      <div>DOB: {formData.birthday}</div>
                      <div>Address: {formData.address}, {formData.municipality}</div>
                      <div>ID Num: {wizardIdNumber}</div>
                    </div>

                    <div className="p-3 bg-navy-950 rounded-xl border border-white/10 space-y-2">
                      <div className="font-bold text-emerald-400 uppercase">2. AI OCR Extracted ID Payload</div>
                      <div>Extracted Name: {formData.firstName} {formData.middleName} {formData.lastName}</div>
                      <div>Extracted DOB: {formData.birthday}</div>
                      <div>Extracted Address: {formData.barangay}, {formData.municipality}</div>
                      <div>Extracted ID Num: {wizardIdNumber}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: AI INFORMATION MATCHING */}
              {wizardStep === 4 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="text-xs font-mono text-slate-300">
                    Comparing demographic variables with tolerance algorithms for municipal abbreviations:
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-between">
                      <span>Full Name Matching:</span>
                      <span className="text-emerald-400 font-bold">99.8% Match</span>
                    </div>

                    <div className="p-3 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-between">
                      <span>Date of Birth Matching:</span>
                      <span className="text-emerald-400 font-bold">100% Exact Match</span>
                    </div>

                    <div className="p-3 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-between">
                      <span>Address & Barangay Matching:</span>
                      <span className="text-emerald-400 font-bold">96.5% Normalized Match</span>
                    </div>

                    <div className="p-3 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-between">
                      <span>Gender & Nationality Matching:</span>
                      <span className="text-emerald-400 font-bold">100% Exact Match</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: SELFIE VERIFICATION */}
              {wizardStep === 5 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-center">
                      <div className="text-xs font-mono font-bold text-cyan-400 uppercase">Government ID Photo</div>
                      <div className="aspect-square bg-navy-950 rounded-2xl overflow-hidden border border-white/10">
                        <img src={uploadedFrontImg} alt="ID Photo" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="space-y-2 text-center">
                      <div className="text-xs font-mono font-bold text-emerald-400 uppercase">Live Selfie Capture</div>
                      <div className="aspect-square bg-navy-950 rounded-2xl overflow-hidden border border-emerald-500/40 relative">
                        <img src={uploadedSelfieImg} alt="Selfie Photo" className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 px-2 py-1 rounded bg-emerald-500 text-navy-950 font-mono font-black text-[10px]">
                          Biometric Match: 99.4%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: LIVENESS DETECTION */}
              {wizardStep === 6 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-xs text-purple-300 font-mono">
                    Interactive Anti-Spoofing Challenge. Perform the prompts below to verify live human presence.
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Blink Eyes', 'Smile', 'Turn Head Left', 'Look Up'].map((act, i) => {
                      const isDone = livenessActionsDone.includes(act);
                      return (
                        <button
                          key={i}
                          onClick={() => handlePerformLivenessAction(act)}
                          className={`p-4 rounded-xl border text-center font-mono text-xs transition-all ${
                            isDone 
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                              : 'bg-navy-950 border-white/10 text-slate-300 hover:border-cyan-500'
                          }`}
                        >
                          {isDone ? '✓ ' : ''}{act}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
                    <span>Anti-Spoof Status (Screen Replay / Deepfake Model):</span>
                    <span className="font-bold">{isLivenessPassing ? 'PASSED (Zero Generative Artifacts)' : 'Perform Challenges Above'}</span>
                  </div>
                </div>
              )}

              {/* STEP 7: DOCUMENT AUTHENTICITY ANALYSIS */}
              {wizardStep === 7 && (
                <div className="space-y-3 font-mono text-xs animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 rounded-xl bg-navy-950 border border-emerald-500/30 flex items-center justify-between">
                    <span>Authenticity Score:</span>
                    <span className="text-emerald-300 font-bold text-sm">97% (Likely Genuine)</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-navy-900 border border-white/5 flex items-center justify-between">
                      <span>• Microtext & Font Layout Inspection:</span>
                      <span className="text-emerald-400 font-bold">Passed</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-navy-900 border border-white/5 flex items-center justify-between">
                      <span>• Hologram Interference Pattern:</span>
                      <span className="text-emerald-400 font-bold">Watermark Present</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-navy-900 border border-white/5 flex items-center justify-between">
                      <span>• Digital Manipulation & Pixel Resampling:</span>
                      <span className="text-emerald-400 font-bold">Clean</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: EMAIL VERIFICATION */}
              {wizardStep === 8 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-xs text-cyan-300 font-mono">
                    Validating email format, MX records, and disposable domain risk for {formData.emailAddress}.
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={emailOtpCode}
                      onChange={(e) => setEmailOtpCode(e.target.value)}
                      placeholder="Enter 6-digit Email Verification Code (e.g. 882914)"
                      className="flex-1 bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => {
                        setEmailOtpSent(true);
                        setEmailOtpVerified(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 text-navy-950 font-mono font-bold text-xs"
                    >
                      {emailOtpVerified ? 'Verified ✓' : 'Send & Verify Code'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 9: PHONE VERIFICATION */}
              {wizardStep === 9 && (
                <div className="space-y-4 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-mono">
                    SMS Carrier: Globe Telecom (+63 Philippines) • Carrier Validation PASSED
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={phoneOtpCode}
                      onChange={(e) => setPhoneOtpCode(e.target.value)}
                      placeholder="Enter SMS OTP Code"
                      className="flex-1 bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => setPhoneOtpVerified(true)}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 text-navy-950 font-mono font-bold text-xs"
                    >
                      {phoneOtpVerified ? 'OTP Verified ✓' : 'Verify SMS OTP'}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 10: ADDRESS VALIDATION */}
              {wizardStep === 10 && (
                <div className="space-y-3 font-mono text-xs animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-emerald-300">
                    Logical Consistency Engine: Province ({formData.province}), Municipality ({formData.municipality}), ZIP Code ({formData.zipCode}) match official PSA PSGC database.
                  </div>
                </div>
              )}

              {/* STEP 11: DUPLICATE DETECTION */}
              {wizardStep === 11 && (
                <div className="space-y-3 font-mono text-xs animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                    <span>Duplicate Search across 100,000+ Enterprise Records:</span>
                    <span className="font-bold">0 Duplicates Found (Score: 3%)</span>
                  </div>
                </div>
              )}

              {/* STEP 12: FRAUD DETECTION */}
              {wizardStep === 12 && (
                <div className="space-y-3 font-mono text-xs animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-emerald-300 flex items-center justify-between">
                    <span>Behavioral Fraud Risk Score:</span>
                    <span className="font-bold">LOW RISK (2%)</span>
                  </div>
                </div>
              )}

              {/* STEP 13: FINAL AI CONFIDENCE SCORE & VERDICT */}
              {wizardStep === 13 && (
                <div className="space-y-4 text-center p-6 bg-navy-950/80 rounded-2xl border border-cyan-500/40 animate-[fadeIn_0.2s_ease-out_1]">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center mx-auto text-2xl font-black font-mono">
                    98%
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold font-display text-white">Identity Confidence Score: 98%</h4>
                    <p className="text-xs font-mono text-emerald-300">AUTOMATIC APPROVAL RECOMMENDED</p>
                  </div>
                </div>
              )}
            </div>

            {/* WIZARD FOOTER NAVIGATION */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between shrink-0">
              <button
                onClick={() => setWizardStep(prev => Math.max(1, prev - 1))}
                disabled={wizardStep === 1}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-300 text-xs font-mono font-bold"
              >
                ← Back
              </button>

              {wizardStep < 13 ? (
                <button
                  onClick={() => setWizardStep(prev => Math.min(13, prev + 1))}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-mono font-black text-xs shadow-lg shadow-cyan-500/20"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={handleCompleteWizardSubmission}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-navy-950 font-mono font-black text-xs shadow-lg shadow-emerald-500/25"
                >
                  Submit & Complete Identity Verification
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          DOWNLOADABLE PDF VERIFICATION REPORT MODAL
      ==================================================== */}
      {selectedRequestForReport && (
        <div className="fixed inset-0 bg-navy-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-white/20 rounded-2xl max-w-3xl w-full p-6 text-white shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto font-sans">
            {/* REPORT HEADER */}
            <div className="flex items-start justify-between border-b border-white/15 pb-4">
              <div className="space-y-1">
                <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  DELCA VisionTech • Official Verification Seal
                </div>
                <h2 className="text-xl font-black font-display text-white">
                  AI Identity Verification Audit Certificate
                </h2>
                <div className="text-xs font-mono text-slate-400">
                  Reference: <span className="text-cyan-300 font-bold">{selectedRequestForReport.referenceNumber}</span> • Date: {new Date(selectedRequestForReport.dateSubmitted).toLocaleDateString()}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-mono">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-[10px] font-bold uppercase mt-1">SEALED & VERIFIED</div>
              </div>
            </div>

            {/* CANDIDATE & DOCUMENT SUMMARY */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-navy-900/80 p-4 rounded-xl border border-white/10">
              <div>
                <div className="text-slate-400 uppercase font-bold text-[10px]">Subject Name</div>
                <div className="text-sm font-bold text-white font-display">
                  {selectedRequestForReport.personalInfo.firstName} {selectedRequestForReport.personalInfo.lastName}
                </div>
                <div className="text-slate-300">{selectedRequestForReport.personalInfo.emailAddress}</div>
              </div>

              <div>
                <div className="text-slate-400 uppercase font-bold text-[10px]">ID Credentials</div>
                <div className="text-sm font-bold text-cyan-300">
                  {selectedRequestForReport.documentInfo.documentType} ({selectedRequestForReport.documentInfo.idNumber})
                </div>
                <div className="text-slate-300">Overall AI Score: {selectedRequestForReport.overallConfidenceScore}%</div>
              </div>
            </div>

            {/* AI METRICS SUMMARY TABLE */}
            <div className="space-y-2 text-xs font-mono">
              <div className="font-bold text-slate-300 uppercase text-[10px]">Audit Evaluation Checklist</div>
              <div className="grid grid-cols-2 gap-2 text-slate-200">
                <div className="p-2 rounded bg-navy-900 border border-white/5">• OCR Extraction Match: {selectedRequestForReport.ocrData.ocrMatchPercentage}%</div>
                <div className="p-2 rounded bg-navy-900 border border-white/5">• Biometric Face Match: {selectedRequestForReport.selfieData.faceMatchScore}%</div>
                <div className="p-2 rounded bg-navy-900 border border-white/5">• Liveness Check: {selectedRequestForReport.selfieData.livenessStatus}</div>
                <div className="p-2 rounded bg-navy-900 border border-white/5">• Authenticity Score: {selectedRequestForReport.authenticityData.authenticityScore}%</div>
              </div>
            </div>

            {/* REPORT FOOTER */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs font-mono text-slate-400">
              <div>Authorized System: {selectedRequestForReport.assignedReviewer}</div>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-navy-950 font-bold flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Print PDF Report</span>
              </button>
              <button
                onClick={() => setSelectedRequestForReport(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          SECURITY & AUDIT TRAIL MODAL
      ==================================================== */}
      {isSecurityPanelOpen && (
        <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-emerald-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-sm">
                <Lock className="w-5 h-5" />
                <span>Security Infrastructure & Encryption Safeguards</span>
              </div>
              <button onClick={() => setIsSecurityPanelOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono text-slate-300 leading-relaxed">
              <div className="p-3 bg-navy-950 rounded-xl border border-white/10">
                <span className="text-emerald-300 font-bold">• Data Encryption:</span> AES-256 GCM encryption at rest for all uploaded government IDs and facial biometric meshes. TLS 1.3 in transit.
              </div>
              <div className="p-3 bg-navy-950 rounded-xl border border-white/10">
                <span className="text-cyan-300 font-bold">• Role-Based Access Control (RBAC):</span> Restricted biometric inspection accessible strictly to verified Administrators and Compliance officers.
              </div>
              <div className="p-3 bg-navy-950 rounded-xl border border-white/10">
                <span className="text-purple-300 font-bold">• Immutable Audit Logging:</span> Every manual override, AI scoring calculation, and status update is logged with digital signature hashes.
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setIsSecurityPanelOpen(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-navy-950 font-bold text-xs font-mono"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          FUTURE AI ROADMAP MODAL
      ==================================================== */}
      {isEnhancementsOpen && (
        <div className="fixed inset-0 bg-navy-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-purple-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2 text-purple-300 font-mono font-bold text-sm">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Future AI Enhancements & KYC Ecosystem Integration</span>
              </div>
              <button onClick={() => setIsEnhancementsOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-navy-950 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-purple-300">• Passport NFC Chip Reader</div>
                <div className="text-[11px] text-slate-400">Direct mobile antenna reading of ICAO Doc 9303 RFID chips.</div>
              </div>

              <div className="p-3 bg-navy-950 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-cyan-300">• DTI / SEC Business Reg Verification</div>
                <div className="text-[11px] text-slate-400">Real-time corporate registry cross-checking for commercial onboarding.</div>
              </div>

              <div className="p-3 bg-navy-950 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-emerald-300">• TIN / BIR Tax Identification</div>
                <div className="text-[11px] text-slate-400">Automated tax identification validation for Philippines enterprise clients.</div>
              </div>

              <div className="p-3 bg-navy-950 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-amber-300">• Blockchain Audit Ledger</div>
                <div className="text-[11px] text-slate-400">Cryptographic proof of verification sealed on decentralized ledger.</div>
              </div>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setIsEnhancementsOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-500 text-navy-950 font-bold text-xs font-mono"
              >
                Close Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
