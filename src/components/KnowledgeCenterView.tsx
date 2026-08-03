import React, { useState } from 'react';
import AgentWorkflowVisualizer from './AgentWorkflowVisualizer';
import { 
  BookOpen, 
  Search, 
  FileText, 
  Download, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  X, 
  Eye, 
  Folder, 
  Share2,
  Lock,
  Layers,
  Award,
  Clock,
  Building2,
  UserCheck,
  TrendingUp,
  Bot,
  Filter,
  Calendar,
  Users,
  MessageSquare,
  Paperclip,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  History,
  FileSpreadsheet,
  Edit3,
  User,
  Globe,
  Activity,
  Briefcase,
  Key,
  ThumbsUp,
  FileCheck,
  Lightbulb,
  Mail,
  Send
} from 'lucide-react';
import { Executive, Company, DELCAEvent } from '../types';

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'Proposals' | 'Brochures' | 'Presentations' | 'Contracts' | 'Templates' | 'Playbooks' | 'Meeting Minutes' | 'Research Reports' | 'Implementation Docs';
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'TXT';
  size: string;
  lastUpdated: string;
  author: string;
  department: string;
  version: string;
  approvalStatus: 'Approved for Dispatch' | 'Pending Legal Review' | 'Draft' | 'Confidential';
  summary: string;
  contentSnippet: string;
  tags: string[];
  relatedExecutiveName?: string;
  relatedCompanyName?: string;
  isConfidential?: boolean;
}

export interface TimelineActivity {
  id: string;
  date: string;
  timestamp: string;
  type: 'AI Research' | 'Meeting' | 'Call' | 'Email' | 'Event' | 'Proposal' | 'Milestone' | 'Feedback' | 'Internal Note';
  department: string;
  owner: string;
  relatedExecutiveName: string;
  relatedCompanyName: string;
  summary: string;
  linkedRecords: string[];
  tags: string[];
}

export interface SharedNote {
  id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  tags: string[];
  mentions: string[];
  linkedExecutiveName?: string;
  linkedCompanyName?: string;
  attachments: string[];
  likes: number;
  commentsCount: number;
}

export interface ExplainableRecommendation {
  id: string;
  title: string;
  category: 'Event Follow-Up' | 'Research Refresh' | 'Executive Briefing' | 'Industry Report Share';
  recommendationText: string;
  reason: string;
  actionType: 'Schedule Briefing' | 'Refresh Research' | 'Send Report' | 'Dispatch Email';
  targetExecutiveName: string;
  targetCompanyName: string;
  urgency: 'High' | 'Medium' | 'Routine';
}

interface KnowledgeCenterViewProps {
  executives?: Executive[];
  companies?: Company[];
  events?: DELCAEvent[];
  onOpen360Profile?: (exec: Executive) => void;
  onComposeEmail?: (exec: Executive, customSubject?: string, customBody?: string) => void;
}

// INITIAL SEED DATA FOR KNOWLEDGE ASSETS
const INITIAL_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'KNOW-001',
    title: 'DELCA VisionTech 2026 Executive Transformation Proposal',
    category: 'Proposals',
    fileType: 'PDF',
    size: '4.2 MB',
    lastUpdated: '2026-07-20',
    author: 'Enterprise Solutions Architecture Team',
    department: 'Enterprise Solutions',
    version: 'v2.4',
    approvalStatus: 'Approved for Dispatch',
    summary: 'Comprehensive C-level proposal detailing AI modernizations, cloud security architecture, and legacy infrastructure migrations.',
    contentSnippet: `EXECUTIVE SUMMARY & PROPOSAL OVERVIEW
-----------------------------------------------------------------
Client Objective: Accelerated Digital Transformation & Cloud Modernization
Proposed Investment: $500,000 - $1,200,000
Implementation Timeline: 6 Months (Phased Delivery)

KEY DELIVERABLES:
1. Executive Data Architecture Audit & Security Governance Strategy.
2. Custom AI-Driven Relationship Management & Predictive Analytics.
3. 24/7 Enterprise SLA Support with dedicated Executive Engagement Director.`,
    tags: ['C-Suite', 'AI Transformation', 'Proposal', 'SAP ERP'],
    relatedExecutiveName: 'Ramon S. Ang',
    relatedCompanyName: 'San Miguel Corporation',
    isConfidential: true
  },
  {
    id: 'KNOW-002',
    title: 'VIP Executive Roundtable 2026 Brochure & Agenda',
    category: 'Brochures',
    fileType: 'PDF',
    size: '2.8 MB',
    lastUpdated: '2026-07-15',
    author: 'Global Marketing & VIP Relations',
    department: 'Global Marketing',
    version: 'v1.1',
    approvalStatus: 'Approved for Dispatch',
    summary: 'Official high-gloss invitation brochure and speaker lineup for the upcoming DELCA VisionTech VIP Leadership Summit.',
    contentSnippet: `DELCA VISIONTECH VIP EXECUTIVE SUMMIT 2026
-----------------------------------------------------------------
Theme: "Navigating AI Governance & Enterprise Scalability"
Venue: The Grand Financial Tower Convention Center, Manila & Online
Keynote Speakers: C-Suite Visionaries from Finance, Tech, & Energy

HIGHLIGHTS:
- Private Boardroom Dinner & Strategic Networking.
- Exclusive Unveiling of DELCA VisionTech AI Predictive Engines.
- Interactive C-Suite Roundtable Discussion on Cyber Resilience.`,
    tags: ['VIP Event', 'Brochure', 'Summit'],
    relatedExecutiveName: 'Ernest L. Cu',
    relatedCompanyName: 'Globe Telecom',
    isConfidential: false
  },
  {
    id: 'KNOW-003',
    title: 'C-Suite Boardroom Keynote Presentation Deck',
    category: 'Presentations',
    fileType: 'PPTX',
    size: '18.5 MB',
    lastUpdated: '2026-07-18',
    author: 'Strategic Communications Office',
    department: 'C-Suite Consulting',
    version: 'v3.0',
    approvalStatus: 'Approved for Dispatch',
    summary: 'Slide deck designed for high-stakes C-level executive pitches, ROI demonstrations, and partnership kick-offs.',
    contentSnippet: `SLIDE OUTLINE:
Slide 1: Executive Welcome & Vision Statement
Slide 2: Enterprise Market Dynamics & Industry Disruption
Slide 3: DELCA VisionTech Core Capabilities & Client Case Studies
Slide 4: ROI Projections & Financial Impact Analysis
Slide 5: Strategic Next Steps & Partnership Roadmap`,
    tags: ['Presentation', 'Pitch Deck', 'Boardroom'],
    relatedExecutiveName: 'Teresita Sy-Coson',
    relatedCompanyName: 'SM Investments',
    isConfidential: true
  },
  {
    id: 'KNOW-004',
    title: 'Enterprise Master Services Agreement (MSA) Template',
    category: 'Contracts',
    fileType: 'DOCX',
    size: '1.1 MB',
    lastUpdated: '2026-06-30',
    author: 'Legal & Risk Governance Department',
    department: 'Legal & Risk Governance',
    version: 'v4.2',
    approvalStatus: 'Approved for Dispatch',
    summary: 'Standardized legal contract template for enterprise consulting engagements, IP assignment, and confidentiality terms.',
    contentSnippet: `MASTER SERVICES AGREEMENT (MSA)
-----------------------------------------------------------------
Parties: DELCA VisionTech Corp. ("Service Provider") and Client ("Executive Entity")

Key Terms:
- Section 1. Scope of Work (SOW) & Service Delivery Protocol.
- Section 2. Confidentiality & Non-Disclosure Obligations.
- Section 3. Intellectual Property Rights & Data Ownership.
- Section 4. Payment Terms & Milestone Invoicing (Net 30).`,
    tags: ['Legal', 'MSA', 'Contract', 'BSP-Compliance'],
    relatedExecutiveName: 'Nestor V. Tan',
    relatedCompanyName: 'BDO Unibank',
    isConfidential: true
  },
  {
    id: 'KNOW-005',
    title: 'C-Level AI Governance & BSP Circular 1105 Compliance Report',
    category: 'Research Reports',
    fileType: 'PDF',
    size: '3.4 MB',
    lastUpdated: '2026-07-22',
    author: 'AI Research & Regulatory Audit Team',
    department: 'AI Operations Center',
    version: 'v2.0',
    approvalStatus: 'Approved for Dispatch',
    summary: 'Deep research dossier on Bangko Sentral ng Pilipinas (BSP) circular compliance for AI models in banking.',
    contentSnippet: `AI GOVERNANCE & BSP COMPLIANCE BRIEFING
-----------------------------------------------------------------
1. Risk Assessment framework for autonomous financial scoring models.
2. Data Privacy Act (NPC Circular 2026-01) alignment protocols.
3. Real-time audit trail and explainable decision logs requirement.`,
    tags: ['BSP-Compliance', 'Research', 'AI-Governance', 'Banking'],
    relatedExecutiveName: 'Nestor V. Tan',
    relatedCompanyName: 'BDO Unibank',
    isConfidential: true
  },
  {
    id: 'KNOW-006',
    title: 'Executive Relationship Management & VIP Protocol Playbook',
    category: 'Playbooks',
    fileType: 'PDF',
    size: '5.6 MB',
    lastUpdated: '2026-07-10',
    author: 'Client Success & VIP Engagement',
    department: 'Executive Services',
    version: 'v1.5',
    approvalStatus: 'Approved for Dispatch',
    summary: 'Operational guide on managing VIP relationships, seating arrangements, meeting briefs, and pre-meeting preparation.',
    contentSnippet: `VIP ENGAGEMENT PROTOCOL MANUAL
-----------------------------------------------------------------
Guideline 1: Always generate an AI Briefing Portfolio 24 hours prior to meetings.
Guideline 2: Ensure post-event follow-up within 48 hours of VIP attendance.
Guideline 3: Track relationship health scores monthly and flag at-risk C-suite contacts immediately.`,
    tags: ['Playbook', 'VIP Protocol', 'Best Practices'],
    isConfidential: false
  }
];

// INITIAL SEED DATA FOR TIMELINE ACTIVITIES
const INITIAL_TIMELINE: TimelineActivity[] = [
  {
    id: 'TL-101',
    date: '2026-07-28',
    timestamp: '02:15 PM',
    type: 'AI Research',
    department: 'AI Operations Center',
    owner: 'Persona Builder Agent',
    relatedExecutiveName: 'Ramon S. Ang',
    relatedCompanyName: 'San Miguel Corporation',
    summary: 'Synthesized multi-agent C-Suite persona & AI readiness profile. High buying signals detected for SAP S/4HANA core modernization.',
    linkedRecords: ['Dossier KNOW-001', 'Persona Profile v2.4'],
    tags: ['AI-Research', 'C-Suite', 'Buying-Signals']
  },
  {
    id: 'TL-102',
    date: '2026-07-27',
    timestamp: '11:00 AM',
    type: 'Meeting',
    department: 'Enterprise Solutions',
    owner: 'Jane Marie Baluna (VP Solutions)',
    relatedExecutiveName: 'Ernest L. Cu',
    relatedCompanyName: 'Globe Telecom',
    summary: 'Executive alignment call on 5G cloud edge infrastructure and AI customer experience automation. Client requested SOW draft by Friday.',
    linkedRecords: ['Meeting Minutes KNOW-007', 'Action Plan #44'],
    tags: ['C-Suite Meeting', '5G Edge', 'SOW']
  },
  {
    id: 'TL-103',
    date: '2026-07-25',
    timestamp: '04:30 PM',
    type: 'Proposal',
    department: 'C-Suite Consulting',
    owner: 'Mark Anthony Santos',
    relatedExecutiveName: 'Teresita Sy-Coson',
    relatedCompanyName: 'SM Investments',
    summary: 'Submitted $1.2M Digital Transformation & AI Retail Reconciliation Proposal to SM Group Executive Board.',
    linkedRecords: ['Proposal KNOW-003', 'Financial Projections v1.2'],
    tags: ['Proposal', 'Retail AI', 'Closed-Pending']
  },
  {
    id: 'TL-104',
    date: '2026-07-22',
    timestamp: '09:45 AM',
    type: 'Event',
    department: 'Global Marketing',
    owner: 'VIP Engagement Director',
    relatedExecutiveName: 'Nestor V. Tan',
    relatedCompanyName: 'BDO Unibank',
    summary: 'Executive attended ASEAN Enterprise AI & Digital Banking Summit. Rated event satisfaction 98/100.',
    linkedRecords: ['Brochure KNOW-002', 'Event Attendance Log'],
    tags: ['VIP Event', 'Banking Summit', 'High Engagement']
  },
  {
    id: 'TL-105',
    date: '2026-07-20',
    timestamp: '03:20 PM',
    type: 'Feedback',
    department: 'Executive Services',
    owner: 'Client Success Manager',
    relatedExecutiveName: 'Lance Y. Gokongwei',
    relatedCompanyName: 'JG Summit Holdings',
    summary: 'Positive feedback regarding DELCA SmartPerson initial demo. Highlighted rapid ROI and ease of executive dashboard navigation.',
    linkedRecords: ['Feedback Note #109', 'Demo Recording'],
    tags: ['Customer Feedback', 'ROI Focus', 'SmartPerson']
  }
];

// INITIAL SEED DATA FOR SHARED NOTES
const INITIAL_NOTES: SharedNote[] = [
  {
    id: 'NOTE-201',
    title: 'San Miguel Corp C-Suite Meeting Takeaways & SAP ERP Roadmap',
    content: `Key findings from our 1-on-1 executive session with Mr. Ramon Ang:
1. Priority focus on migrating legacy brewing and infrastructure ERP cores to cloud.
2. Data security & zero-trust compliance are non-negotiables for the board.
3. Budget is authorized for Q3 2026 implementation ($850k allocation).
Next Action: Finalize MSA terms with Legal and send customized proposal document.`,
    author: 'Jane Marie Baluna',
    department: 'Enterprise Solutions',
    createdAt: '2026-07-26',
    updatedAt: '2026-07-28',
    version: 'v1.2',
    tags: ['SanMiguel', 'S4HANA', 'BudgetAuthorized'],
    mentions: ['@LegalTeam', '@Architects'],
    linkedExecutiveName: 'Ramon S. Ang',
    linkedCompanyName: 'San Miguel Corporation',
    attachments: ['SanMiguel_Requirements_Outline.pdf'],
    likes: 5,
    commentsCount: 3
  },
  {
    id: 'NOTE-202',
    title: 'Globe Telecom AI Customer Operations & 5G Edge Integration',
    content: `Met with Ernest Cu and technical leadership:
- Interested in deploying DELCA GenAI Assistant across 2,000 corporate customer service channels.
- Requires BSP Circular 1105 compliance auditing and on-premise secret key proxy architecture.
- Follow-up meeting scheduled for next Tuesday with CTO office.`,
    author: 'Mark Anthony Santos',
    department: 'C-Suite Consulting',
    createdAt: '2026-07-24',
    updatedAt: '2026-07-25',
    version: 'v1.0',
    tags: ['GlobeTelecom', 'GenAI', 'Compliance'],
    mentions: ['@SecurityTeam'],
    linkedExecutiveName: 'Ernest L. Cu',
    linkedCompanyName: 'Globe Telecom',
    attachments: ['Globe_Architecture_Diagram.png'],
    likes: 8,
    commentsCount: 2
  }
];

// INITIAL EXPLAINABLE RECOMMENDATIONS
const INITIAL_RECOMMENDATIONS: ExplainableRecommendation[] = [
  {
    id: 'REC-301',
    title: 'Follow Up After VIP Summit Attendance',
    category: 'Event Follow-Up',
    recommendationText: 'Schedule a 15-minute post-summit briefing with Nestor V. Tan.',
    reason: 'Executive attended the ASEAN Enterprise AI & Digital Banking Summit on July 22 with high engagement. Post-event follow-up protocol requires touchpoint within 5 days.',
    actionType: 'Schedule Briefing',
    targetExecutiveName: 'Nestor V. Tan',
    targetCompanyName: 'BDO Unibank',
    urgency: 'High'
  },
  {
    id: 'REC-302',
    title: 'Refresh Outdated AI Research Dossier',
    category: 'Research Refresh',
    recommendationText: 'Trigger AI Research Center re-run for Globe Telecom.',
    reason: 'Last multi-agent research scan was completed 32 days ago. New BSP regulatory circulars and quarterly financial reports were published this week.',
    actionType: 'Refresh Research',
    targetExecutiveName: 'Ernest L. Cu',
    targetCompanyName: 'Globe Telecom',
    urgency: 'Medium'
  },
  {
    id: 'REC-303',
    title: 'Share Retail AI Automation Industry Report',
    category: 'Industry Report Share',
    recommendationText: 'Dispatch ASEAN Retail AI Automation Case Study to Teresita Sy-Coson.',
    reason: 'Executive\'s primary strategic priority is retail AI reconciliation; current proposal in Closed-Pending stage.',
    actionType: 'Send Report',
    targetExecutiveName: 'Teresita Sy-Coson',
    targetCompanyName: 'SM Investments',
    urgency: 'Routine'
  }
];

export default function KnowledgeCenterView({
  executives = [],
  companies = [],
  events = [],
  onOpen360Profile,
  onComposeEmail
}: KnowledgeCenterViewProps) {
  // Main State Management
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(INITIAL_DOCUMENTS);
  const [timeline, setTimeline] = useState<TimelineActivity[]>(INITIAL_TIMELINE);
  const [notes, setNotes] = useState<SharedNote[]>(INITIAL_NOTES);
  const [recommendations, setRecommendations] = useState<ExplainableRecommendation[]>(INITIAL_RECOMMENDATIONS);

  // Active Sub-Tab Navigation
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'documents' | 'notes' | 'summaries' | 'recommendations' | 'governance'>('timeline');

  // Search & Global Multi-Filters State (Requirement #1)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('All Time');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExecFilter, setSelectedExecFilter] = useState('All Executives');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('All Companies');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');

  // UI Toast Sync Feedback
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Document Modal States
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);

  // New Document Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeDocument['category']>('Proposals');
  const [newFileType, setNewFileType] = useState<KnowledgeDocument['fileType']>('PDF');
  const [newDepartment, setNewDepartment] = useState('Enterprise Solutions');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Enterprise, C-Suite');
  const [newExecName, setNewExecName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');

  // New Note Modal
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('MeetingNotes, Strategy');
  const [newNoteMentions, setNewNoteMentions] = useState('@LegalTeam, @Architects');
  const [newNoteExec, setNewNoteExec] = useState('');
  const [newNoteCompany, setNewNoteCompany] = useState('');

  // Summary Auto-Refresh State
  const [isRefreshingSummary, setIsRefreshingSummary] = useState(false);
  const [lastSummaryRefreshTime, setLastSummaryRefreshTime] = useState(new Date().toLocaleTimeString());

  // Show Toast Function
  const triggerSyncNotification = (msg: string) => {
    setSyncToast(msg);
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Filter Logic
  const filteredTimeline = timeline.filter(item => {
    const matchesSearch = !searchTerm ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedExecutiveName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relatedCompanyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDepartment === 'All Departments' || item.department === selectedDepartment;
    const matchesExec = selectedExecFilter === 'All Executives' || item.relatedExecutiveName === selectedExecFilter;
    const matchesCompany = selectedCompanyFilter === 'All Companies' || item.relatedCompanyName === selectedCompanyFilter;

    return matchesSearch && matchesDept && matchesExec && matchesCompany;
  });

  const filteredDocs = documents.filter(doc => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.relatedExecutiveName && doc.relatedExecutiveName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.relatedCompanyName && doc.relatedCompanyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDepartment === 'All Departments' || doc.department === selectedDepartment;
    const matchesStatus = selectedStatusFilter === 'All Statuses' || doc.approvalStatus === selectedStatusFilter;

    return matchesCat && matchesSearch && matchesDept && matchesStatus;
  });

  const filteredNotes = notes.filter(n => {
    const matchesSearch = !searchTerm ||
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (n.linkedExecutiveName && n.linkedExecutiveName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (n.linkedCompanyName && n.linkedCompanyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      n.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDepartment === 'All Departments' || n.department === selectedDepartment;
    return matchesSearch && matchesDept;
  });

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Add Document Handler with Auto-Synchronization
  const handleAddDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: KnowledgeDocument = {
      id: `KNOW-${Date.now().toString().slice(-4)}`,
      title: newTitle,
      category: newCategory,
      fileType: newFileType,
      size: '1.8 MB',
      lastUpdated: new Date().toISOString().split('T')[0],
      author: 'Jane Marie Baluna',
      department: newDepartment,
      version: 'v1.0',
      approvalStatus: 'Approved for Dispatch',
      summary: newSummary || 'No executive summary provided.',
      contentSnippet: newContent || 'Document text uploaded successfully.',
      tags: newTags.split(',').map(s => s.trim()).filter(Boolean),
      relatedExecutiveName: newExecName || 'Ramon S. Ang',
      relatedCompanyName: newCompanyName || 'San Miguel Corporation',
      isConfidential: true
    };

    setDocuments([newDoc, ...documents]);

    // Add to Timeline Automatically
    const newTimelineItem: TimelineActivity = {
      id: `TL-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
      type: newCategory === 'Proposals' ? 'Proposal' : 'Internal Note',
      department: newDepartment,
      owner: 'Jane Marie Baluna',
      relatedExecutiveName: newDoc.relatedExecutiveName || 'Executive Entity',
      relatedCompanyName: newDoc.relatedCompanyName || 'Enterprise Account',
      summary: `Uploaded new knowledge asset "${newDoc.title}".`,
      linkedRecords: [`Doc ${newDoc.id}`],
      tags: newDoc.tags
    };

    setTimeline([newTimelineItem, ...timeline]);

    setIsAddDocModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');

    // Trigger Auto-Synchronization Notification (Requirement #9)
    triggerSyncNotification('Synchronized new Knowledge Asset with Executive Workspace, Company Intelligence & Sales Pipeline.');
  };

  // Add Shared Note Handler with Auto-Synchronization
  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;

    const newNote: SharedNote = {
      id: `NOTE-${Date.now().toString().slice(-3)}`,
      title: newNoteTitle,
      content: newNoteContent,
      author: 'Jane Marie Baluna',
      department: 'Enterprise Solutions',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      version: 'v1.0',
      tags: newNoteTags.split(',').map(s => s.trim()).filter(Boolean),
      mentions: newNoteMentions.split(',').map(s => s.trim()).filter(Boolean),
      linkedExecutiveName: newNoteExec || 'Ramon S. Ang',
      linkedCompanyName: newNoteCompany || 'San Miguel Corporation',
      attachments: [],
      likes: 1,
      commentsCount: 0
    };

    setNotes([newNote, ...notes]);

    // Add to Timeline
    const newTimelineItem: TimelineActivity = {
      id: `TL-${Date.now().toString().slice(-3)}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit' }),
      type: 'Internal Note',
      department: 'Enterprise Solutions',
      owner: 'Jane Marie Baluna',
      relatedExecutiveName: newNote.linkedExecutiveName || 'C-Suite Executive',
      relatedCompanyName: newNote.linkedCompanyName || 'Enterprise Entity',
      summary: `Logged collaborative note "${newNote.title}".`,
      linkedRecords: [`Note ${newNote.id}`],
      tags: newNote.tags
    };

    setTimeline([newTimelineItem, ...timeline]);

    setIsAddNoteModalOpen(false);
    setNewNoteTitle('');
    setNewNoteContent('');

    triggerSyncNotification('Collaborative Note saved and synchronized across Executive & Company Workspaces.');
  };

  // Auto-Refresh Summaries Handler
  const handleRefreshSummaries = () => {
    setIsRefreshingSummary(true);
    setTimeout(() => {
      setLastSummaryRefreshTime(new Date().toLocaleTimeString());
      setIsRefreshingSummary(false);
      triggerSyncNotification('Refreshed AI Enterprise Intelligence Summaries using latest knowledge inputs.');
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out_1]">
      {/* SYNC TOAST NOTIFICATION BANNER */}
      {syncToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 text-xs font-mono font-bold shadow-2xl flex items-center space-x-3 animate-[slideUp_0.3s_ease-out_1]">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 p-6 md:p-8 border border-purple-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>DELCA Enterprise Organizational Memory</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Knowledge Hub & Organizational Memory
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1 leading-relaxed">
              Continuously synchronized repository preserving institutional memory, cross-department collaboration, AI research dossiers, and C-Suite customer intelligence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddNoteModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold text-xs border border-purple-500/40 flex items-center space-x-2 transition-all"
            >
              <Edit3 className="w-4 h-4 text-purple-400" />
              <span>New Shared Note</span>
            </button>

            <button
              onClick={() => setIsAddDocModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* KNOWLEDGE ANALYTICS METRICS STRIP (Requirement #7) */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-cyan-400 uppercase block">Knowledge Records</span>
            <span className="text-base font-bold text-white">{timeline.length + documents.length + notes.length} Assets</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-purple-400 uppercase block">AI Research Completed</span>
            <span className="text-base font-bold text-purple-300">36 Dossiers</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-emerald-400 uppercase block">Documents Stored</span>
            <span className="text-base font-bold text-emerald-300">{documents.length} Files</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-amber-400 uppercase block">Meetings Captured</span>
            <span className="text-base font-bold text-amber-300">52 Briefings</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-indigo-400 uppercase block">Profiles Updated</span>
            <span className="text-base font-bold text-indigo-300">28 C-Suite 360s</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase block">Security Level</span>
            <span className="text-base font-bold text-slate-200">Role Encrypted</span>
          </div>
        </div>
      </div>

      {/* AGENT WORKFLOW VISUALIZER */}
      <AgentWorkflowVisualizer />

      {/* CONTINUOUS ENTERPRISE SYNCHRONIZATION ACTIVE BANNER (Requirement #9) */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-950 via-purple-950/40 to-navy-950 border border-purple-500/30 flex items-center justify-between text-xs font-mono text-slate-300">
        <div className="flex items-center space-x-2.5">
          <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
          <span>
            <strong className="text-purple-300">Continuous Enterprise Synchronization Active:</strong> All knowledge records automatically update Executive Workspaces, Company Intelligence, Sales Pipeline, and Leadership Dashboards in real-time.
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 hidden sm:inline">
          Zero Manual Re-Entry
        </span>
      </div>

      {/* GLOBAL MULTI-FILTER SEARCH BAR (Requirement #1) */}
      <div className="bg-navy-900/90 p-4 rounded-xl border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Main Search Input */}
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search across notes, documents, AI research, meetings, events, proposals..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs font-mono">
            <div className="flex items-center space-x-1 text-slate-400">
              <Filter className="w-3.5 h-3.5 text-purple-400" />
              <span>Dept:</span>
            </div>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="All Departments">All Departments</option>
              <option value="Enterprise Solutions">Enterprise Solutions</option>
              <option value="C-Suite Consulting">C-Suite Consulting</option>
              <option value="AI Operations Center">AI Operations Center</option>
              <option value="Global Marketing">Global Marketing</option>
              <option value="Legal & Risk Governance">Legal & Risk Governance</option>
              <option value="Executive Services">Executive Services</option>
            </select>

            <select
              value={selectedExecFilter}
              onChange={e => setSelectedExecFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="All Executives">All Executives</option>
              <option value="Ramon S. Ang">Ramon S. Ang</option>
              <option value="Ernest L. Cu">Ernest L. Cu</option>
              <option value="Teresita Sy-Coson">Teresita Sy-Coson</option>
              <option value="Nestor V. Tan">Nestor V. Tan</option>
              <option value="Lance Y. Gokongwei">Lance Y. Gokongwei</option>
            </select>

            <select
              value={selectedCompanyFilter}
              onChange={e => setSelectedCompanyFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-purple-400"
            >
              <option value="All Companies">All Companies</option>
              <option value="San Miguel Corporation">San Miguel Corporation</option>
              <option value="Globe Telecom">Globe Telecom</option>
              <option value="SM Investments">SM Investments</option>
              <option value="BDO Unibank">BDO Unibank</option>
              <option value="JG Summit Holdings">JG Summit Holdings</option>
            </select>
          </div>
        </div>
      </div>

      {/* SUB-NAVIGATION TABS */}
      <div className="flex items-center overflow-x-auto custom-scrollbar border-b border-white/10 pb-2 gap-2 text-xs font-mono">
        {[
          { id: 'timeline', label: '1. Unified Timeline', icon: Clock, count: filteredTimeline.length },
          { id: 'documents', label: '2. Document Library', icon: Folder, count: filteredDocs.length },
          { id: 'notes', label: '3. Shared Notes', icon: MessageSquare, count: filteredNotes.length },
          { id: 'summaries', label: '4. AI Enterprise Summaries', icon: Sparkles, count: 6 },
          { id: 'recommendations', label: '5. AI Recommendations', icon: Lightbulb, count: recommendations.length },
          { id: 'governance', label: '6. Governance & Permissions', icon: ShieldCheck, count: null }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl border whitespace-nowrap flex items-center space-x-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500/50 text-white font-bold shadow-md'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-slate-400'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${isActive ? 'bg-purple-500/30 text-purple-200' : 'bg-white/10 text-slate-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ====================================================================== */}
      {/* SUB-TAB 1: UNIFIED KNOWLEDGE TIMELINE (Requirement #2) */}
      {/* ====================================================================== */}
      {activeSubTab === 'timeline' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>Chronological timeline connecting AI research, meetings, calls, proposals, and customer feedback:</span>
            <span className="text-purple-300 font-bold">{filteredTimeline.length} Chronological Entries</span>
          </div>

          <div className="space-y-3">
            {filteredTimeline.map(item => (
              <div 
                key={item.id}
                className="p-4 rounded-xl bg-navy-950/90 border border-white/10 hover:border-purple-500/40 transition-all space-y-3 shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      {item.type}
                    </span>
                    <span className="text-slate-400">{item.date} • {item.timestamp}</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-cyan-300">{item.department}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px]">Owner: <strong className="text-white">{item.owner}</strong></span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center space-x-2 text-xs">
                    <span className="text-slate-400 font-mono">Related Account:</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-300 font-mono font-bold border border-cyan-500/20">
                      {item.relatedExecutiveName} ({item.relatedCompanyName})
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{item.summary}</p>
                </div>

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-500">Linked Records:</span>
                    {item.linkedRecords.map((rec, rIdx) => (
                      <span key={rIdx} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px]">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {filteredTimeline.length === 0 && (
              <div className="p-8 text-center bg-navy-950/50 rounded-xl border border-white/10 text-slate-500 font-mono text-xs">
                No timeline records match your search or filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 2: DOCUMENT LIBRARY (Requirement #5) */}
      {/* ====================================================================== */}
      {activeSubTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-navy-900/80 p-3 rounded-xl border border-white/10">
            <div className="flex flex-wrap items-center gap-1.5">
              {['All', 'Proposals', 'Brochures', 'Presentations', 'Contracts', 'Templates', 'Playbooks', 'Research Reports'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-slate-400">{filteredDocs.length} Documents</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map(doc => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-navy-950/90 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {doc.category}
                    </span>
                    <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-200 font-bold">{doc.fileType}</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-sm text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-slate-500">{doc.department} • {doc.version}</span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-xs font-semibold flex items-center space-x-1 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => handleCopySnippet(doc.contentSnippet)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                      title="Copy Document Text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 3: SHARED COLLABORATIVE NOTES (Requirement #4) */}
      {/* ====================================================================== */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-purple-500/20 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>Collaborative departmental notes linked with C-Suite executives and company profiles:</span>
            <button
              onClick={() => setIsAddNoteModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map(n => (
              <div 
                key={n.id}
                className="p-4 rounded-xl bg-navy-950/90 border border-white/10 hover:border-purple-500/40 transition-all space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 text-xs font-mono">
                  <span className="font-bold text-white flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                    <span>{n.title}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-[10px]">
                    {n.version}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                  {n.content}
                </p>

                <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block">Author: {n.author} ({n.department})</span>
                    <div className="flex flex-wrap gap-1">
                      {n.tags.map((t, tidx) => (
                        <span key={tidx} className="text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-cyan-300 block font-bold">Linked: {n.linkedExecutiveName}</span>
                    <span className="text-[10px] text-slate-500">{n.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 4: AI ENTERPRISE SUMMARIES (Requirement #3) */}
      {/* ====================================================================== */}
      {activeSubTab === 'summaries' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-display font-extrabold text-white text-base flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Continuously Updated AI Enterprise Intelligence Summaries</span>
              </h4>
              <p className="text-xs text-slate-300">Auto-refreshed synthesized view across accounts, business opportunities, and strategic risks.</p>
            </div>

            <div className="flex items-center space-x-3 text-xs font-mono">
              <span className="text-slate-400">Last Sync: {lastSummaryRefreshTime}</span>
              <button
                onClick={handleRefreshSummaries}
                disabled={isRefreshingSummary}
                className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 font-bold border border-purple-500/30 flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-purple-300 ${isRefreshingSummary ? 'animate-spin' : ''}`} />
                <span>{isRefreshingSummary ? 'Refreshing...' : 'Refresh AI Summaries'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">1. Executive Overview</span>
              <p className="text-slate-300 leading-relaxed">
                Top C-Suite contacts across Philippine conglomerates demonstrate high AI readiness (avg 88/100). Focus centered on legacy core modernization, automated reconciliation, and BSP governance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">2. Company Intelligence Overview</span>
              <p className="text-slate-300 leading-relaxed">
                Key accounts (San Miguel, Globe, BDO, SM Group) have authorized $45M+ cumulative IT transformation budgets for 2026. Transitioning from legacy mainframes to hybrid cloud.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">3. Recent Key Activities</span>
              <p className="text-slate-300 leading-relaxed">
                Completed 1-on-1 executive sessions with Ramon Ang (San Miguel) and Ernest Cu (Globe). Submitted $1.2M proposal to SM Investments board.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">4. Active Business Opportunities</span>
              <p className="text-slate-300 leading-relaxed">
                $4.8M total enterprise pipeline across 6 target C-suite accounts. 2 proposals in Closed-Pending stage with estimated Q3 contract signature dates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">5. Strategic Risks & Governance</span>
              <p className="text-slate-300 leading-relaxed">
                Regulatory oversight under Bangko Sentral ng Pilipinas (BSP Circular 1105) requires zero-data-leakage architecture and explainable AI decision audit logs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">6. Recommended Next Actions</span>
              <p className="text-slate-300 leading-relaxed">
                1. Schedule follow-up briefing with Nestor V. Tan (BDO).<br />
                2. Re-run AI research scan for Globe Telecom.<br />
                3. Dispatch ASEAN Retail AI Case Study to Teresita Sy-Coson.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 5: EXPLAINABLE AI RECOMMENDATIONS (Requirement #6) */}
      {/* ====================================================================== */}
      {activeSubTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs text-slate-300 font-mono flex items-center justify-between">
            <span>Explainable AI recommendations with transparent reasoning for every suggested action:</span>
            <span className="text-cyan-300 font-bold">{recommendations.length} Active Recommendations</span>
          </div>

          <div className="space-y-3">
            {recommendations.map(rec => (
              <div 
                key={rec.id}
                className="p-4 rounded-xl bg-navy-950/90 border border-cyan-500/30 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      {rec.category}
                    </span>
                    <span className="text-white font-bold">{rec.title}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    rec.urgency === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    Urgency: {rec.urgency}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-white">{rec.recommendationText}</p>
                  <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20 text-slate-300 leading-relaxed font-sans">
                    <strong className="text-cyan-300 font-mono text-[11px]">Reasoning & Justification: </strong>
                    {rec.reason}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Target: <strong className="text-white">{rec.targetExecutiveName} ({rec.targetCompanyName})</strong></span>
                  <button
                    onClick={() => {
                      setRecommendations(prev => prev.filter(r => r.id !== rec.id));
                      triggerSyncNotification(`Executed: "${rec.title}". Automatically refreshed outdated status.`);
                    }}
                    className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/30 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Execute & Auto-Remove</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* SUB-TAB 6: SECURITY & GOVERNANCE (Requirement #10) */}
      {/* ====================================================================== */}
      {activeSubTab === 'governance' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 font-mono text-xs font-bold border-b border-white/10 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Role-Based Permissions & Knowledge Governance Matrix</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white/5 space-y-1">
                <span className="text-emerald-400 font-bold block">Executive Director / Admin</span>
                <span className="text-slate-300 text-[11px] block">Full Read/Write, Approval Sign-Off, Confidential Export</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 space-y-1">
                <span className="text-cyan-400 font-bold block">Solutions Architect / Editor</span>
                <span className="text-slate-300 text-[11px] block">Create/Edit Notes, Upload Assets, Submit for Legal Review</span>
              </div>
              <div className="p-3 rounded-lg bg-white/5 space-y-1">
                <span className="text-slate-400 font-bold block">Guest / Viewer</span>
                <span className="text-slate-300 text-[11px] block">Read-Only Access to Approved Public Knowledge Assets</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW DOCUMENT MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 font-bold">
                    {selectedDoc.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedDoc.fileType} • {selectedDoc.size} • {selectedDoc.version}</span>
                </div>
                <h2 className="text-lg font-bold font-display text-white">{selectedDoc.title}</h2>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-white p-2">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-2 font-mono">
              <div>Author: <strong>{selectedDoc.author}</strong> ({selectedDoc.department}) | Updated: {selectedDoc.lastUpdated}</div>
              <p className="bg-slate-950 p-3 rounded-xl border border-white/5 italic text-slate-200">{selectedDoc.summary}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
                <span>DOCUMENT CONTENT PREVIEW</span>
                <button
                  onClick={() => handleCopySnippet(selectedDoc.contentSnippet)}
                  className="flex items-center space-x-1 text-slate-300 hover:text-white"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>
              <pre className="p-4 bg-navy-950 rounded-xl border border-white/10 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {selectedDoc.contentSnippet}
              </pre>
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([selectedDoc.contentSnippet], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `${selectedDoc.title.replace(/\s+/g, '_')}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-navy-950 font-bold text-xs flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Text File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD NEW DOCUMENT MODAL */}
      {isAddDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <form onSubmit={handleAddDocumentSubmit} className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-white">Upload New Knowledge Asset</h3>
              <button type="button" onClick={() => setIsAddDocModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Strategy Proposal 2026"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Proposals">Proposals</option>
                    <option value="Brochures">Brochures</option>
                    <option value="Presentations">Presentations</option>
                    <option value="Contracts">Contracts</option>
                    <option value="Templates">Templates</option>
                    <option value="Playbooks">Playbooks</option>
                    <option value="Research Reports">Research Reports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1">Department</label>
                  <select
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Enterprise Solutions">Enterprise Solutions</option>
                    <option value="C-Suite Consulting">C-Suite Consulting</option>
                    <option value="AI Operations Center">AI Operations Center</option>
                    <option value="Global Marketing">Global Marketing</option>
                    <option value="Legal & Risk Governance">Legal & Risk Governance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Executive Summary</label>
                <input
                  type="text"
                  placeholder="Brief description of asset..."
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Document Content / Text Snippet</label>
                <textarea
                  rows={4}
                  placeholder="Paste main outline, proposal text, or template copy..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-400 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Linked Executive</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramon S. Ang"
                    value={newExecName}
                    onChange={e => setNewExecName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Linked Company</label>
                  <input
                    type="text"
                    placeholder="e.g. San Miguel Corporation"
                    value={newCompanyName}
                    onChange={e => setNewCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddDocModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-navy-950 font-bold text-xs"
              >
                Save Knowledge Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* NEW SHARED NOTE MODAL */}
      {isAddNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <form onSubmit={handleAddNoteSubmit} className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-white flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span>Create Shared Collaborative Note</span>
              </h3>
              <button type="button" onClick={() => setIsAddNoteModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meeting Takeaways & Tech Stack Priorities"
                  value={newNoteTitle}
                  onChange={e => setNewNoteTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono mb-1">Note Content *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Write detailed notes, action items, and C-Suite observations..."
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-purple-400 text-xs font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Linked Executive</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramon S. Ang"
                    value={newNoteExec}
                    onChange={e => setNewNoteExec(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono mb-1">Linked Company</label>
                  <input
                    type="text"
                    placeholder="e.g. San Miguel Corporation"
                    value={newNoteCompany}
                    onChange={e => setNewNoteCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-navy-950 font-bold text-xs font-mono font-bold"
              >
                Save & Synchronize
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
