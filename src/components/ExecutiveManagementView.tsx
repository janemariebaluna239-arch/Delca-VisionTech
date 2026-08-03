import React, { useState } from 'react';
import ScheduledMeetingsView from './ScheduledMeetingsView';
import { exportToExcel, exportToCSV, ExportColumn } from '../lib/exportUtils';
import { 
  Users,
  User,
  Plus, 
  Search, 
  SlidersHorizontal, 
  Trash2, 
  Edit3, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  X, 
  Linkedin, 
  Globe, 
  Check, 
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Building2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Layers,
  MessageSquare,
  Tag as TagIcon,
  DollarSign,
  TrendingUp,
  GitMerge,
  Share2,
  Link2,
  Network,
  Briefcase,
  Sparkles,
  ArrowRight,
  BrainCircuit,
  CheckSquare,
  Square,
  UserPlus,
  Zap,
  Filter,
  Send,
  CalendarPlus,
  Info,
  FileText,
  Lightbulb,
  Target,
  Award,
  ChevronUp
} from 'lucide-react';
import { 
  Executive, 
  ContactStatus, 
  RelationshipStage, 
  ContactSource, 
  BusinessOpportunity, 
  BusinessOpportunityStage, 
  OPPORTUNITY_STAGES,
  UserRole
} from '../types';
import { getRolePermissions } from '../lib/rbac';
import { 
  calculateProfileCompleteness, 
  getContactHealth, 
  findDuplicateContacts, 
  getReferralChain,
  getNetworkConnections,
  DuplicateGroup, 
  RELATIONSHIP_STAGES, 
  CONTACT_SOURCES 
} from '../lib/contactUtils';

interface ExecutiveManagementViewProps {
  executives: Executive[];
  onAddExecutive: (data: Partial<Executive>) => void;
  onEditExecutive: (id: string, data: Partial<Executive>) => void;
  onDeleteExecutive: (id: string) => void;
  onImportBulk: (list: Partial<Executive>[]) => void;
  onComposeEmail?: (exec: Executive) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  onOpenInteraction?: (exec: Executive) => void;
  onOpenPersonaBuilder?: (exec: Executive) => void;
  onOpenAccountIntelligence?: (exec: Executive) => void;
  onSendInvitation?: (exec: Executive) => void;
  onAddInteractionNote?: (execId: string, note: { authorName: string; authorRole: string; type: 'Note' | 'Email' | 'Meeting' | 'Call' | 'Event Attendance'; content: string }) => Promise<void>;
  onMergeDuplicates?: (primaryId: string, duplicateIds: string[]) => Promise<void>;
  onAddOpportunity?: (execId: string, opp: any) => Promise<void>;
  onUpdateOpportunity?: (execId: string, oppId: string, data: any) => Promise<void>;
  onDeleteOpportunity?: (execId: string, oppId: string) => Promise<void>;
  onDeleteInteractionNote?: (execId: string, noteId: string) => Promise<void>;
  onOpen360Profile?: (exec: Executive) => void;
  userRole: UserRole | string;
}

export default function ExecutiveManagementView({
  executives,
  onAddExecutive,
  onEditExecutive,
  onDeleteExecutive,
  onImportBulk,
  onComposeEmail,
  onScheduleMeeting,
  onOpenInteraction,
  onOpenPersonaBuilder,
  onOpenAccountIntelligence,
  onSendInvitation,
  onAddInteractionNote,
  onMergeDuplicates,
  onAddOpportunity,
  onUpdateOpportunity,
  onDeleteOpportunity,
  onDeleteInteractionNote,
  onOpen360Profile,
  userRole
}: ExecutiveManagementViewProps) {
  const permissions = getRolePermissions(userRole as UserRole);
  const [unlockedLeadershipIds, setUnlockedLeadershipIds] = useState<Record<string, boolean>>({});

  const handleOpenProfile = (exec: Executive) => {
    if (onOpen360Profile) {
      onOpen360Profile(exec);
    } else {
      setSelectedExecDetail(exec);
    }
  };

  const handleUnlockLeadershipAccess = (execId: string, execName: string) => {
    setUnlockedLeadershipIds(prev => ({ ...prev, [execId]: true }));
    if (onAddInteractionNote) {
      onAddInteractionNote(execId, {
        authorName: 'Victoria Sterling',
        authorRole: 'Leadership',
        type: 'Note',
        content: `AUDIT LOG: Executive Leadership (Victoria Sterling) authorized drill-down access for account details on ${execName}.`
      });
    }
  };
  // View Mode: Executive Directory vs Scheduled Meetings Center
  const [activeViewMode, setActiveViewMode] = useState<'directory' | 'meetings'>('directory');

  // Advanced Search & Multi-Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('All');
  const [seniorityFilter, setSeniorityFilter] = useState('All');
  const [aiReadinessFilter, setAiReadinessFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [opportunityFilter, setOpportunityFilter] = useState('All');
  const [researchStatusFilter, setResearchStatusFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [healthFilter, setHealthFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'fullName' | 'company' | 'country' | 'completeness' | 'aiReadiness'>('fullName');

  // Bulk Selection State
  const [selectedExecIds, setSelectedExecIds] = useState<string[]>([]);
  
  // Bulk Modals State
  const [isBulkTagModalOpen, setIsBulkTagModalOpen] = useState(false);
  const [presetTags, setPresetTags] = useState<string[]>([
    'Banking',
    'Manufacturing',
    'ERP',
    'AI Ready',
    'VIP Executive',
    'Digital Transformation',
    'AI Summit 2026',
    'Cloud Strategy',
    'C-Suite Target'
  ]);
  const [selectedTagsForBulk, setSelectedTagsForBulk] = useState<string[]>(['AI Ready', 'VIP Executive']);
  const [newTagInput, setNewTagInput] = useState('');

  const [isBulkCampaignModalOpen, setIsBulkCampaignModalOpen] = useState(false);
  const [selectedCampaignName, setSelectedCampaignName] = useState('AI Executive Summit 2026');
  const [customCampaignInput, setCustomCampaignInput] = useState('');
  const [campaignStage, setCampaignStage] = useState('Invited');

  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);
  const [assignedSalesRep, setAssignedSalesRep] = useState('Alex Vance (Enterprise Lead)');
  const [bulkNotification, setBulkNotification] = useState<string | null>(null);

  // Quick Preview Modal State
  const [quickPreviewExec, setQuickPreviewExec] = useState<Executive | null>(null);

  // Modals / Detail Drawer
  const [selectedExecDetail, setSelectedExecDetail] = useState<Executive | null>(null);
  const [active360Tab, setActive360Tab] = useState<'overview' | 'company' | 'research' | 'timeline' | 'sales' | 'marketing' | 'after_sales' | 'knowledge_hub' | 'opportunities' | 'referrals' | 'network'>('overview');
  const [timelineFilter, setTimelineFilter] = useState<string>('All');
  
  // Knowledge Hub State
  const [knowledgeCategory, setKnowledgeCategory] = useState<'Note' | 'AI Recommendation' | 'Document' | 'Task'>('Note');
  const [newKnowledgeContent, setNewKnowledgeContent] = useState('');

  // Quick Action Modals
  const [isBriefingModalOpen, setIsBriefingModalOpen] = useState(false);
  const [isExportReportModalOpen, setIsExportReportModalOpen] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalTitleInput, setProposalTitleInput] = useState('Enterprise ERP & AI Modernization Proposal');
  const [proposalValueInput, setProposalValueInput] = useState(250000);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  // Interaction Note in detail modal
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteType, setNewNoteType] = useState<'Note' | 'Email' | 'Meeting' | 'Call'>('Note');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Opportunity Creation State
  const [isCreatingOpp, setIsCreatingOpp] = useState(false);
  const [oppTitle, setOppTitle] = useState('');
  const [oppValue, setOppValue] = useState<number>(100000);
  const [oppStage, setOppStage] = useState<BusinessOpportunityStage>('Proposal Sent');

  // Duplicate Check
  const duplicateGroups = findDuplicateContacts(executives);

  // Contact verification handler
  const handleVerifyToggle = async (exec: Executive) => {
    const nextStatus: ContactStatus = exec.contactStatus === 'Verified' ? 'Unverified' : 'Verified';
    try {
      await fetch(`/api/executives/${exec.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      }).catch(() => null);
    } catch (e) {
      console.error(e);
    }
    onEditExecutive(exec.id, {
      contactStatus: nextStatus,
      verificationDate: nextStatus === 'Verified' ? new Date().toISOString() : null
    });
    if (selectedExecDetail?.id === exec.id) {
      setSelectedExecDetail({
        ...exec,
        contactStatus: nextStatus,
        verificationDate: nextStatus === 'Verified' ? new Date().toISOString() : null
      });
    }
  };

  // Stage change handler
  const handleStageChange = (exec: Executive, newStage: RelationshipStage) => {
    onEditExecutive(exec.id, { relationshipStage: newStage });
    if (selectedExecDetail?.id === exec.id) {
      setSelectedExecDetail({ ...selectedExecDetail, relationshipStage: newStage });
    }
  };

  // Add interaction note handler
  const handleAddNoteInDrawer = async () => {
    if (!selectedExecDetail || !newNoteContent.trim() || !onAddInteractionNote) return;
    try {
      setIsAddingNote(true);
      await onAddInteractionNote(selectedExecDetail.id, {
        authorName: 'Jane Marie Baluna',
        authorRole: userRole,
        type: newNoteType,
        content: newNoteContent
      });

      const updatedHistory = [
        ...(selectedExecDetail.interactionHistory || []),
        {
          id: `NOTE-${Date.now()}`,
          authorName: 'Jane Marie Baluna',
          authorRole: userRole,
          type: newNoteType,
          content: newNoteContent,
          timestamp: new Date().toISOString()
        }
      ];

      setSelectedExecDetail({
        ...selectedExecDetail,
        interactionHistory: updatedHistory,
        lastContactDate: new Date().toISOString()
      });

      setNewNoteContent('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingNote(false);
    }
  };

  // Bulk Checkbox Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedExecIds(filteredExecutives.map(e => e.id));
    } else {
      setSelectedExecIds([]);
    }
  };

  const handleToggleSelectExec = (id: string) => {
    setSelectedExecIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Tag Management Helpers
  const togglePresetTagForBulk = (tag: string) => {
    setSelectedTagsForBulk(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTagToPreset = () => {
    const trimmed = newTagInput.trim();
    if (trimmed) {
      if (!presetTags.includes(trimmed)) {
        setPresetTags(prev => [...prev, trimmed]);
      }
      if (!selectedTagsForBulk.includes(trimmed)) {
        setSelectedTagsForBulk(prev => [...prev, trimmed]);
      }
      setNewTagInput('');
    }
  };

  const handleDeletePresetTag = (tagToDelete: string) => {
    setPresetTags(prev => prev.filter(t => t !== tagToDelete));
    setSelectedTagsForBulk(prev => prev.filter(t => t !== tagToDelete));
  };

  // Bulk Actions
  const handleBulkRunAiResearch = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    selectedExecIds.forEach(id => {
      const exec = executives.find(e => e.id === id);
      if (exec) {
        onEditExecutive(id, {
          personaGenerated: true,
          aiReadinessScore: Math.max(exec.aiReadinessScore || 75, 88),
          researchConfidence: 96,
          researchSources: ['SerpAPI', 'Google Custom Search', 'NewsAPI', 'GDELT', 'Claude AI Analysis'],
          aiAdoptionStage: 'Scaling Production AI Workflows',
          digitalTransformationStatus: 'Active Enterprise AI Rollout',
          erpModernizationPotential: 'High Priority - Cloud Sync',
          updatedAt: todayStr
        });
      }
    });
    setBulkNotification(`Deep AI Research & Persona Intelligence completed for ${selectedExecIds.length} executives.`);
    setTimeout(() => setBulkNotification(null), 4000);
  };

  const handleBulkSendInvitations = () => {
    selectedExecIds.forEach(id => {
      const exec = executives.find(e => e.id === id);
      if (exec && onSendInvitation) {
        onSendInvitation(exec);
      }
    });
    setBulkNotification(`VIP Event Invitations queued for ${selectedExecIds.length} executive contacts.`);
    setTimeout(() => setBulkNotification(null), 4000);
  };

  const handleBulkAddTagsSubmit = () => {
    if (selectedTagsForBulk.length === 0) return;
    selectedExecIds.forEach(id => {
      const exec = executives.find(e => e.id === id);
      if (exec) {
        const mergedTags = Array.from(new Set([...(exec.tags || []), ...selectedTagsForBulk]));
        onEditExecutive(id, { tags: mergedTags });
      }
    });
    setIsBulkTagModalOpen(false);
    setBulkNotification(`Applied tags [${selectedTagsForBulk.join(', ')}] to ${selectedExecIds.length} executives.`);
    setTimeout(() => setBulkNotification(null), 4000);
  };

  const handleBulkAssignSalesRepSubmit = () => {
    const dateStr = new Date().toLocaleDateString();
    selectedExecIds.forEach(id => {
      const exec = executives.find(e => e.id === id);
      if (exec) {
        const newInteraction = {
          id: `ASSIGN-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          authorName: 'System / Sales Operations',
          authorRole: 'CRM System',
          type: 'Note' as const,
          content: `Assigned Account Representative: ${assignedSalesRep} on ${dateStr}`,
          timestamp: new Date().toISOString()
        };

        const updatedHistory = [...(exec.interactionHistory || []), newInteraction];

        onEditExecutive(id, {
          assignedSalesRep,
          interactionHistory: updatedHistory,
          notes: `${exec.notes || ''}\n[Assigned Sales Rep: ${assignedSalesRep} on ${dateStr}]`.trim(),
          updatedAt: new Date().toISOString()
        });
      }
    });
    setIsBulkAssignModalOpen(false);
    setBulkNotification(`Assigned ${selectedExecIds.length} executives to ${assignedSalesRep}.`);
    setTimeout(() => setBulkNotification(null), 4000);
  };

  const handleBulkAddToCampaignSubmit = () => {
    const finalCampaignName = customCampaignInput.trim() || selectedCampaignName;
    if (!finalCampaignName) return;

    const dateStr = new Date().toISOString().split('T')[0];

    selectedExecIds.forEach(id => {
      const exec = executives.find(e => e.id === id);
      if (exec) {
        const existingCampaigns = exec.campaignHistory || [];
        const updatedCampaigns = [
          ...existingCampaigns.filter(c => c.campaignName !== finalCampaignName),
          { campaignName: finalCampaignName, dateAdded: dateStr, status: campaignStage }
        ];

        const campaignTag = `Campaign-${finalCampaignName.replace(/\s+/g, '-')}`;
        const mergedTags = Array.from(new Set([...(exec.tags || []), campaignTag]));

        const newInteraction = {
          id: `CAMP-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          authorName: 'System / Campaign Engine',
          authorRole: 'Marketing Platform',
          type: 'Event Attendance' as const,
          content: `Added to Campaign: "${finalCampaignName}" (${campaignStage}) on ${dateStr}`,
          timestamp: new Date().toISOString()
        };

        const updatedHistory = [...(exec.interactionHistory || []), newInteraction];

        onEditExecutive(id, {
          campaignHistory: updatedCampaigns,
          tags: mergedTags,
          interactionHistory: updatedHistory,
          notes: `${exec.notes || ''}\n[Added to Campaign: ${finalCampaignName} (${campaignStage}) on ${dateStr}]`.trim(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    setIsBulkCampaignModalOpen(false);
    setCustomCampaignInput('');
    setBulkNotification(`Added ${selectedExecIds.length} executives to Campaign: "${finalCampaignName}" (${campaignStage}).`);
    setTimeout(() => setBulkNotification(null), 4000);
  };

  const executiveExportColumns: ExportColumn<Executive>[] = [
    { key: 'id', label: 'Executive ID' },
    { key: 'fullName', label: 'Full Name' },
    { key: 'position', label: 'Position', getValue: (e) => e.position || e.jobTitle || '' },
    { key: 'company', label: 'Company' },
    { key: 'industry', label: 'Industry' },
    { key: 'department', label: 'Department' },
    { key: 'city', label: 'City', getValue: (e) => e.city || '' },
    { key: 'country', label: 'Country' },
    { key: 'email', label: 'Email' },
    { key: 'contactNumber', label: 'Phone', getValue: (e) => e.contactNumber || e.phoneNumber || '' },
    { key: 'contactStatus', label: 'Contact Status' },
    { key: 'relationshipStage', label: 'Relationship Stage', getValue: (e) => e.relationshipStage || 'New Contact' },
    { key: 'contactSource', label: 'Contact Source', getValue: (e) => e.contactSource || 'Direct Outreach' },
    { key: 'verificationDate', label: 'Verification Date', getValue: (e) => e.verificationDate || '' },
    { key: 'linkedinProfile', label: 'LinkedIn' },
    { key: 'companyWebsite', label: 'Website' },
    { key: 'notes', label: 'Notes', getValue: (e) => e.notes || '' },
  ];

  // Excel (.xlsx) Export All with Auto Column Width
  const handleExportExcel = () => {
    exportToExcel(filteredExecutives, executiveExportColumns, 'DELCA_Executive_Database', 'Executive Database');
  };

  // CSV Export All
  const handleExportCSV = () => {
    exportToCSV(filteredExecutives, executiveExportColumns, 'DELCA_Executive_Database');
  };

  // Excel (.xlsx) Export Selected with Auto Column Width
  const handleExportSelectedExcel = () => {
    const selectedList = executives.filter(e => selectedExecIds.includes(e.id));
    exportToExcel(selectedList, executiveExportColumns, 'DELCA_Selected_Executives', 'Selected Executives');
  };

  // CSV Export Selected
  const handleExportSelectedCSV = () => {
    const selectedList = executives.filter(e => selectedExecIds.includes(e.id));
    exportToCSV(selectedList, executiveExportColumns, 'DELCA_Selected_Executives');
  };

  // JSON Export All
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredExecutives, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `DELCA_Executive_Database_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV / JSON Bulk Import Parser
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError('');
    let parsedList: Partial<Executive>[] = [];

    const trimmed = importText.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        const json = JSON.parse(trimmed);
        const arr = Array.isArray(json) ? json : [json];
        parsedList = arr.map((item: any) => ({
          fullName: item.fullName || item.name || 'New Contact',
          email: item.email || '',
          company: item.company || 'Enterprise Client',
          position: item.position || item.jobTitle || 'Executive Director',
          jobTitle: item.position || item.jobTitle || 'Executive Director',
          industry: item.industry || 'Technology',
          country: item.country || 'Global',
          city: item.city || '',
          contactStatus: item.contactStatus || 'Verified',
          relationshipStage: item.relationshipStage || 'New Contact',
          contactSource: item.contactSource || 'Direct Outreach',
          notes: item.notes || 'Imported batch contact record.'
        }));
      } catch (err) {
        setImportError('Invalid JSON structure. Please check input syntax.');
        return;
      }
    } else {
      const lines = importText.split('\n');
      lines.forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2 && parts[0].trim() !== '') {
          parsedList.push({
            fullName: parts[0]?.trim() || 'New Contact',
            email: parts[1]?.trim() || '',
            company: parts[2]?.trim() || 'Enterprise Client',
            position: parts[3]?.trim() || 'Executive Director',
            jobTitle: parts[3]?.trim() || 'Executive Director',
            industry: parts[4]?.trim() || 'Technology',
            country: parts[5]?.trim() || 'Global',
            contactStatus: 'Verified',
            relationshipStage: 'New Contact',
            contactSource: 'Direct Outreach',
            department: 'Executive Office',
            notes: 'Imported via CSV batch roster.'
          });
        }
      });
    }

    if (parsedList.length > 0) {
      onImportBulk(parsedList);
      setIsImportModalOpen(false);
      setImportText('');
      setImportError('');
    } else {
      setImportError("Please provide valid CSV rows or JSON array.");
    }
  };

  // Unique Filter Arrays
  const industries = Array.from(new Set(executives.map(e => e.industry?.trim()))).filter(Boolean);
  const countries = Array.from(new Set(executives.map(e => (e.country || 'Global').trim()))).filter(Boolean);

  // Filtered List
  const filteredExecutives = executives.filter(exec => {
    const pos = (exec.position || exec.jobTitle || '').toLowerCase();
    const tagsStr = (exec.tags || []).join(' ').toLowerCase();
    const prioritiesStr = (exec.strategicPriorities || []).join(' ').toLowerCase();
    const painPointsStr = (exec.painPoints || []).join(' ').toLowerCase();
    const techStackStr = (exec.techStack || []).join(' ').toLowerCase();
    const bioStr = (exec.biography || '').toLowerCase();
    const prevEventsStr = (exec.previousEventAttendance || []).join(' ').toLowerCase();
    const prefEventsStr = (exec.preferredEventCategories || []).join(' ').toLowerCase();
    const oppsTotalVal = (exec.opportunities || []).reduce((sum, o) => sum + (o.value || 0), 0);
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch = 
      exec.fullName.toLowerCase().includes(searchLower) ||
      exec.company.toLowerCase().includes(searchLower) ||
      pos.includes(searchLower) ||
      (exec.country || '').toLowerCase().includes(searchLower) ||
      (exec.city || '').toLowerCase().includes(searchLower) ||
      (exec.industry || '').toLowerCase().includes(searchLower) ||
      exec.email.toLowerCase().includes(searchLower) ||
      tagsStr.includes(searchLower) ||
      prioritiesStr.includes(searchLower) ||
      painPointsStr.includes(searchLower) ||
      techStackStr.includes(searchLower) ||
      bioStr.includes(searchLower) ||
      prevEventsStr.includes(searchLower) ||
      prefEventsStr.includes(searchLower) ||
      exec.id.toLowerCase().includes(searchLower);
    
    const matchesIndustry = industryFilter === 'All' || exec.industry === industryFilter;
    const matchesCountry = countryFilter === 'All' || exec.country === countryFilter;
    const matchesStatus = statusFilter === 'All' || exec.contactStatus === statusFilter;
    const matchesStage = stageFilter === 'All' || exec.relationshipStage === stageFilter;
    
    // Seniority Filter
    let matchesSeniority = true;
    if (seniorityFilter === 'C-Suite') {
      matchesSeniority = pos.includes('chief') || pos.includes('ceo') || pos.includes('cto') || pos.includes('cio') || pos.includes('cfo') || pos.includes('cmo') || pos.includes('coo');
    } else if (seniorityFilter === 'VP') {
      matchesSeniority = pos.includes('vp') || pos.includes('vice president');
    } else if (seniorityFilter === 'Director') {
      matchesSeniority = pos.includes('director') || pos.includes('head');
    }

    // AI Readiness Filter
    const aiScore = exec.aiReadinessScore || 75;
    let matchesAiReadiness = true;
    if (aiReadinessFilter === 'High') matchesAiReadiness = aiScore >= 80;
    else if (aiReadinessFilter === 'Medium') matchesAiReadiness = aiScore >= 50 && aiScore < 80;
    else if (aiReadinessFilter === 'Low') matchesAiReadiness = aiScore < 50;

    // Opportunity Filter
    let matchesOpportunity = true;
    if (opportunityFilter === 'HighValue') matchesOpportunity = oppsTotalVal >= 100000;
    else if (opportunityFilter === 'HasOpportunities') matchesOpportunity = (exec.opportunities || []).length > 0;

    // Research Status Filter
    const isResearchDone = exec.personaGenerated || calculateProfileCompleteness(exec) >= 80;
    let matchesResearchStatus = true;
    if (researchStatusFilter === 'Complete') matchesResearchStatus = isResearchDone;
    else if (researchStatusFilter === 'Pending') matchesResearchStatus = !isResearchDone;

    const health = getContactHealth(exec);
    const matchesHealth = healthFilter === 'All' || health === healthFilter;

    return matchesSearch && matchesIndustry && matchesCountry && matchesStatus && matchesStage && matchesHealth && matchesSeniority && matchesAiReadiness && matchesOpportunity && matchesResearchStatus;
  }).sort((a, b) => {
    if (sortBy === 'fullName') return a.fullName.localeCompare(b.fullName);
    if (sortBy === 'company') return a.company.localeCompare(b.company);
    if (sortBy === 'country') return (a.country || '').localeCompare(b.country || '');
    if (sortBy === 'completeness') return (calculateProfileCompleteness(b) - calculateProfileCompleteness(a));
    if (sortBy === 'aiReadiness') return ((b.aiReadinessScore || 75) - (a.aiReadinessScore || 75));
    return a.id.localeCompare(b.id);
  });

  const isAllSelected = filteredExecutives.length > 0 && selectedExecIds.length === filteredExecutives.length;

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out_1]">
      {/* BULK NOTIFICATION BANNER */}
      {bulkNotification && (
        <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{bulkNotification}</span>
          </div>
          <button onClick={() => setBulkNotification(null)} className="text-cyan-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-cyan-400" />
            <h2 className="font-display font-extrabold text-2xl text-white">Centralized Executive Intelligence Database</h2>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Comprehensive C-suite & decision-maker profiles enriched with AI persona intelligence, relationship health, and commercial signal tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {duplicateGroups.length > 0 && (
            <button
              onClick={() => setIsDuplicateModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-all animate-pulse"
            >
              <Copy className="w-4 h-4 text-amber-400" />
              <span>{duplicateGroups.length} Duplicates Detected</span>
            </button>
          )}

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Import CSV/JSON</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-500/5 hover:border-emerald-400"
            title="Export native Microsoft Excel spreadsheet with auto-widened columns"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Switcher */}
      <div className="flex items-center space-x-2 border-b border-white/10 pb-3 font-display text-xs">
        <button
          onClick={() => setActiveViewMode('directory')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition-all ${
            activeViewMode === 'directory'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Executive Directory Roster</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/30 text-cyan-200">
            {filteredExecutives.length}
          </span>
        </button>

        <button
          onClick={() => setActiveViewMode('meetings')}
          className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 font-bold transition-all ${
            activeViewMode === 'meetings'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
              : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Scheduled Meetings Center</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/30 text-purple-200">
            {executives.reduce((acc, exec) => acc + (exec.interactionHistory?.filter(n => n.content.includes('[MEETING SCHEDULED:')).length || 0), 0) || 5}
          </span>
        </button>
      </div>

      {activeViewMode === 'meetings' ? (
        <ScheduledMeetingsView
          executives={executives}
          session={{ userId: 'u1', userName: 'Jane Marie Baluna', userRole: userRole, userEmail: 'janemariebaluna239@gmail.com', permissions: ['*'] }}
          onOpen360Profile={(exec) => handleOpenProfile(exec)}
          onComposeEmail={onComposeEmail}
          onScheduleMeeting={(exec) => onScheduleMeeting && onScheduleMeeting(exec)}
          onDeleteMeetingNote={onDeleteInteractionNote}
        />
      ) : (
        <>
          {/* Advanced Search & Multi-Filter Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border-white/10 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5">
          {/* Main Search Bar */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search executive, company, title, industry, tags..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Industry Filter */}
          <div className="md:col-span-2">
            <select
              value={industryFilter}
              onChange={e => setIndustryFilter(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="All">All Industries ({executives.length})</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Seniority Filter */}
          <div className="md:col-span-2">
            <select
              value={seniorityFilter}
              onChange={e => setSeniorityFilter(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="All">All Seniority Levels</option>
              <option value="C-Suite">C-Suite (CEO/CTO/CIO)</option>
              <option value="VP">Vice Presidents (VP/SVP)</option>
              <option value="Director">Directors & Heads</option>
            </select>
          </div>

          {/* Relationship Stage Filter */}
          <div className="md:col-span-2">
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="All">All Stages</option>
              {RELATIONSHIP_STAGES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="w-full bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
            >
              <option value="fullName">Sort: Executive Name</option>
              <option value="company">Sort: Company Account</option>
              <option value="completeness">Sort: Profile Completeness</option>
              <option value="aiReadiness">Sort: AI Readiness Score</option>
            </select>
          </div>
        </div>

        {/* Filter Summary & Active Controls */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1 border-t border-white/5">
          <span>Showing <strong className="text-cyan-400 font-bold">{filteredExecutives.length}</strong> of {executives.length} executive contacts</span>
          {(searchTerm || industryFilter !== 'All' || seniorityFilter !== 'All' || aiReadinessFilter !== 'All' || stageFilter !== 'All' || opportunityFilter !== 'All' || researchStatusFilter !== 'All' || statusFilter !== 'All' || healthFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setIndustryFilter('All');
                setSeniorityFilter('All');
                setAiReadinessFilter('All');
                setStageFilter('All');
                setOpportunityFilter('All');
                setResearchStatusFilter('All');
                setStatusFilter('All');
                setHealthFilter('All');
              }}
              className="text-cyan-400 hover:underline font-mono text-[11px]"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 10. BULK ACTIONS TOOLBAR (Requirement #10) */}
      {selectedExecIds.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-navy-900 via-cyan-950 to-navy-950 border border-cyan-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-3 animate-[fadeIn_0.2s_ease-out_1]">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
              {selectedExecIds.length} Selected
            </span>
            <span className="text-slate-300 text-xs font-medium hidden sm:inline">Bulk Operations Toolbar:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleBulkRunAiResearch}
              className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-xs font-bold font-mono flex items-center space-x-1 transition-all"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
              <span>Run AI Research</span>
            </button>

            <button
              onClick={handleBulkSendInvitations}
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono flex items-center space-x-1 transition-all"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Send Event Invitations</span>
            </button>

            <button
              onClick={() => setIsBulkAssignModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono flex items-center space-x-1 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Assign Sales Rep</span>
            </button>

            <button
              onClick={() => setIsBulkTagModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-bold font-mono flex items-center space-x-1 transition-all"
            >
              <TagIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Tags</span>
            </button>

            <button
              onClick={() => setIsBulkCampaignModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 text-xs font-bold font-mono flex items-center space-x-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Add to Campaign</span>
            </button>

            <button
              onClick={handleExportSelectedExcel}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono flex items-center space-x-1 transition-all"
              title="Export selected contacts to auto-widened Excel file"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Selected (Excel)</span>
            </button>

            <button
              onClick={handleExportSelectedCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-semibold flex items-center space-x-1 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setSelectedExecIds([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Deselect All"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* EXECUTIVE INTELLIGENCE DATABASE TABLE */}
      <div className="glass-panel rounded-2xl border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-navy-900/80 text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded bg-navy-950 border-white/20 text-cyan-500 focus:ring-0"
                  />
                </th>
                <th className="p-4">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                    <User className="w-3.5 h-3.5" />
                    <span>Executive & Corporate Account</span>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center space-x-1.5 text-purple-400 font-bold">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>AI Readiness</span>
                  </div>
                </th>
                <th className="p-4">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Relationship Health & Owner</span>
                  </div>
                </th>
                <th className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-1.5 text-slate-300 font-bold">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Actions</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-200">
              {filteredExecutives.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono">
                    No executive contacts found matching your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredExecutives.map(exec => {
                  const healthStatus = getContactHealth(exec);
                  const completeness = calculateProfileCompleteness(exec);
                  const isSelected = selectedExecIds.includes(exec.id);
                  const aiScore = exec.aiReadinessScore || 75;
                  const aiReadinessLevel = aiScore >= 85 ? 'Leader' : aiScore >= 70 ? 'High' : aiScore >= 50 ? 'Moderate' : 'Developing';
                  const assignedRep = exec.assignedSalesRep || 'Alex Vance';

                  return (
                    <React.Fragment key={exec.id}>
                      <tr className={`hover:bg-white/[0.02] transition-colors ${isSelected ? 'bg-cyan-500/10' : ''}`}>
                        {/* Checkbox */}
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectExec(exec.id)}
                            className="rounded bg-navy-950 border-white/20 text-cyan-500 focus:ring-0"
                          />
                        </td>

                        {/* EXECUTIVE & CORPORATE ACCOUNT */}
                        <td className="p-4 max-w-[280px]">
                          <div className="flex items-center space-x-3">
                            {exec.avatarUrl ? (
                              <img 
                                src={exec.avatarUrl} 
                                alt={exec.fullName} 
                                className="w-10 h-10 rounded-full object-cover border border-cyan-500/30 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0 font-display">
                                {exec.fullName.split(' ').map(n => n[0]).join('')}
                              </div>
                            )}

                            <div className="space-y-0.5 min-w-0">
                              <button
                                onClick={() => handleOpenProfile(exec)}
                                className="font-bold text-white hover:text-cyan-400 transition-colors text-sm text-left flex items-center space-x-1.5 truncate"
                              >
                                <span className="truncate">{exec.fullName}</span>
                              </button>
                              <div className="text-xs font-semibold text-slate-300 truncate">{exec.position || exec.jobTitle}</div>
                              <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                                <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                                <span className="font-medium text-slate-300 truncate">{exec.company}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400 truncate">{exec.industry}</span>
                              </div>
                              {exec.tags && exec.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-1">
                                  {exec.tags.slice(0, 2).map(t => (
                                    <span key={t} className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/5 text-amber-300 border border-white/10">
                                      #{t}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* AI READINESS */}
                        <td className="p-4 space-y-1.5 max-w-[200px]">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-cyan-300 font-bold">{aiScore}% Ready</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              {aiReadinessLevel}
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-navy-950 rounded-full overflow-hidden border border-white/10">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${aiScore}%` }} />
                          </div>

                          <div className="text-[10px] text-purple-300 font-mono truncate">
                            {exec.digitalTransformationStatus || 'Active AI & Cloud Rollout'}
                          </div>
                        </td>

                        {/* RELATIONSHIP HEALTH & OWNER */}
                        <td className="p-4 space-y-1 max-w-[200px]">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                              healthStatus === 'Healthy' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : healthStatus === 'Needs Follow-Up' 
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' 
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {healthStatus}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {exec.lastContactDate ? new Date(exec.lastContactDate).toLocaleDateString() : 'New'}
                            </span>
                          </div>

                          <div className="text-[10px] text-slate-300 font-mono truncate">
                            Owner: <span className="text-emerald-300 font-medium">{assignedRep}</span>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenProfile(exec)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all text-xs font-bold font-mono flex items-center space-x-1 shadow-sm"
                              title="View Executive Profile"
                            >
                              <User className="w-3.5 h-3.5" />
                              <span>View Profile</span>
                            </button>

                            {onComposeEmail && (
                              <button
                                onClick={() => onComposeEmail(exec)}
                                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 transition-colors border border-cyan-500/20"
                                title="Send Email"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {onScheduleMeeting && (
                              <button
                                onClick={() => onScheduleMeeting(exec)}
                                className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-colors border border-emerald-500/20"
                                title="Schedule Meeting"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* BULK TAG MODAL */}
      {isBulkTagModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-amber-500/30 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-amber-300 flex items-center space-x-2">
                <TagIcon className="w-4.5 h-4.5 text-amber-400" />
                <span>Assign Tags ({selectedExecIds.length} Selected Executives)</span>
              </h3>
              <button onClick={() => setIsBulkTagModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-mono text-slate-400">Click to Select Preset Tags:</label>
              <div className="flex flex-wrap gap-2">
                {presetTags.map(tag => {
                  const isSelected = selectedTagsForBulk.includes(tag);
                  return (
                    <div
                      key={tag}
                      onClick={() => togglePresetTagForBulk(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono cursor-pointer transition-all flex items-center space-x-1.5 border ${
                        isSelected
                          ? 'bg-amber-500 text-navy-950 font-bold border-amber-400 shadow-md'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{tag}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePresetTag(tag);
                        }}
                        className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Remove Tag"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Add New Custom Tag:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Q3-Key-Decision-Maker"
                    value={newTagInput}
                    onChange={e => setNewTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddCustomTagToPreset(); }}
                    className="flex-1 bg-navy-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleAddCustomTagToPreset}
                    className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {selectedTagsForBulk.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                  <strong>Tags to apply:</strong> {selectedTagsForBulk.join(', ')}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setIsBulkTagModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAddTagsSubmit}
                disabled={selectedTagsForBulk.length === 0}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs shadow disabled:opacity-50"
              >
                Apply Tags ({selectedTagsForBulk.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK ADD TO CAMPAIGN MODAL */}
      {isBulkCampaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-indigo-500/30 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-indigo-300 flex items-center space-x-2">
                <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
                <span>Add {selectedExecIds.length} Executives to Marketing Campaign</span>
              </h3>
              <button onClick={() => setIsBulkCampaignModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Select Existing Campaign:</label>
                <select
                  value={selectedCampaignName}
                  onChange={e => {
                    setSelectedCampaignName(e.target.value);
                    setCustomCampaignInput('');
                  }}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="AI Executive Summit 2026">AI Executive Summit 2026</option>
                  <option value="ERP Modernization Forum">ERP Modernization Forum</option>
                  <option value="Manufacturing Digital Transformation Webinar">Manufacturing Digital Transformation Webinar</option>
                  <option value="Financial Services Leadership Roundtable">Financial Services Leadership Roundtable</option>
                  <option value="Q3 Enterprise AI Outreach">Q3 Enterprise AI Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Or Create New Campaign:</label>
                <input
                  type="text"
                  placeholder="e.g. C-Suite Global AI Tour 2026"
                  value={customCampaignInput}
                  onChange={e => setCustomCampaignInput(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Initial Campaign Status / Stage:</label>
                <select
                  value={campaignStage}
                  onChange={e => setCampaignStage(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="Invited">Invited</option>
                  <option value="Target Lead">Target Lead</option>
                  <option value="Registered">Registered</option>
                  <option value="Attended">Attended</option>
                  <option value="Active Participant">Active Participant</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                Adding to campaign will log an interaction history entry, attach a campaign tag, and update executive campaign history.
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setIsBulkCampaignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAddToCampaignSubmit}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-navy-950 font-bold text-xs shadow"
              >
                Confirm Campaign Addition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK ASSIGN SALES REP MODAL */}
      {isBulkAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-emerald-500/30 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-emerald-300 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Assign {selectedExecIds.length} Executives to Sales Rep</span>
              </h3>
              <button onClick={() => setIsBulkAssignModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Select Account Manager / Representative</label>
              <select
                value={assignedSalesRep}
                onChange={e => setAssignedSalesRep(e.target.value)}
                className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Alex Vance (Enterprise Lead)">Alex Vance (Enterprise Lead)</option>
                <option value="Sarah Jenkins (FinTech Specialist)">Sarah Jenkins (FinTech Specialist)</option>
                <option value="Jane Marie Baluna (Account Executive)">Jane Marie Baluna (Account Executive)</option>
                <option value="David Ross (VP Sales)">David Ross (VP Sales)</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsBulkAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAssignSalesRepSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL EXECUTIVE 360 INTELLIGENCE CENTER MODAL */}
      {selectedExecDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-navy-900 border border-cyan-500/40 rounded-2xl max-w-5xl w-full p-5 sm:p-6 space-y-6 shadow-2xl my-6 text-slate-100 max-h-[92vh] overflow-y-auto">
            
            {/* Top Bar: Title & Close */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-base sm:text-lg text-white flex items-center space-x-2">
                    <span>Executive Personal Information</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      Single Source of Truth
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">Unified Executive Profile across Marketing, Sales, Event Planning, After-Sales & Leadership</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedExecDetail(null)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SECTION 1: EXECUTIVE 360 OVERVIEW HEADER */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-white/10 space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Photo & Essential Executive Details */}
                <div className="flex items-start space-x-4">
                  {selectedExecDetail.avatarUrl ? (
                    <img 
                      src={selectedExecDetail.avatarUrl} 
                      alt={selectedExecDetail.fullName} 
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shrink-0 shadow-lg" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-extrabold text-xl shrink-0 shadow-lg">
                      {selectedExecDetail.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-extrabold text-xl text-white">{selectedExecDetail.fullName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                        selectedExecDetail.contactStatus === 'Verified' 
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}>
                        {selectedExecDetail.contactStatus} Contact
                      </span>
                    </div>

                    <p className="text-cyan-300 text-xs font-bold">{selectedExecDetail.position} • {selectedExecDetail.company}</p>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs font-mono pt-0.5">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{selectedExecDetail.city ? `${selectedExecDetail.city}, ` : ''}{selectedExecDetail.country || 'Global'}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span>{selectedExecDetail.industry}</span>
                      </span>
                      <span>•</span>
                      <span className="text-slate-300">
                        Owner: <strong className="text-emerald-300">{selectedExecDetail.assignedSalesRep || 'Alex Vance (Enterprise Lead)'}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Badges Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-emerald-500/30">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Opportunity Score</div>
                    <div className="text-base font-extrabold font-mono text-emerald-400">
                      {permissions.canViewOpportunityScore ? '88 / 100' : 'N/A (Role Restricted)'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-cyan-500/30">
                    <div className="text-[10px] font-mono uppercase text-slate-400">AI Readiness Score</div>
                    <div className="text-base font-extrabold font-mono text-cyan-300">{selectedExecDetail.aiReadinessScore || 85}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-purple-500/30">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Event Match Score</div>
                    <div className="text-base font-extrabold font-mono text-purple-300">94% Match</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-950 border border-amber-500/30">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Sales Stage</div>
                    <div className="text-xs font-extrabold font-mono text-amber-300 truncate pt-0.5">{selectedExecDetail.relationshipStage || 'Proposal Sent'}</div>
                  </div>
                </div>
              </div>

              {/* AI Executive Summary Box */}
              <div className="p-4 rounded-xl bg-navy-950/80 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[11px] font-mono uppercase text-cyan-300 font-bold flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI Executive Intelligence Summary</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Confidence: <strong className="text-emerald-400">{selectedExecDetail.researchConfidence || 96}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div>
                    <p className="text-slate-200">
                      <strong className="text-white">Who this Executive is: </strong>
                      {selectedExecDetail.biography || `${selectedExecDetail.fullName} serves as ${selectedExecDetail.position} at ${selectedExecDetail.company}, spearheading enterprise technology adoption and operational scaling across ${selectedExecDetail.industry}.`}
                    </p>
                    <p className="text-slate-300 pt-1">
                      <strong className="text-cyan-300">Leadership Scope: </strong>
                      Steers multi-million dollar technology budgets, ERP architecture, and C-Suite AI governance initiatives.
                    </p>
                  </div>
                  <div className="space-y-1.5 border-t md:border-t-0 md:border-l border-white/10 md:pl-3 pt-2 md:pt-0">
                    <div className="text-slate-300">
                      <strong className="text-amber-300">Company Priorities: </strong>
                      {selectedExecDetail.companyDetails?.digitalTransformationProgress || 'ERP modernization, agentic AI deployment, and enterprise data consolidation.'}
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-emerald-300">Why DELCA Should Engage: </strong>
                      High willingness to adopt DELCA's Agentic AI Suite and custom ERP integration services to resolve operational bottlenecks.
                    </div>
                    <div className="pt-1">
                      <strong className="text-cyan-400 font-mono text-[10px] uppercase block">Recommended Next Action:</strong>
                      <span className="text-white font-bold">{selectedExecDetail.recommendedNextActions?.[0] || 'Schedule 1-on-1 ERP & AI Discovery Session'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 10: QUICK ACTIONS BAR */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold mr-1">Quick Actions:</span>
                
                {onComposeEmail && (
                  <button
                    onClick={() => onComposeEmail(selectedExecDetail)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono flex items-center space-x-1.5 transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </button>
                )}

                {onScheduleMeeting && (
                  <button
                    onClick={() => onScheduleMeeting(selectedExecDetail)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-navy-950 text-xs font-bold font-mono flex items-center space-x-1.5 shadow transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Meeting</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    if (onOpenPersonaBuilder) onOpenPersonaBuilder(selectedExecDetail);
                    else setActive360Tab('research');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-bold font-mono flex items-center space-x-1.5 transition-all"
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                  <span>Start AI Research</span>
                </button>

                <button
                  onClick={() => setIsBriefingModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono flex items-center space-x-1.5 transition-all"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Executive Briefing</span>
                </button>

                <button
                  onClick={() => setIsExportReportModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold font-mono flex items-center space-x-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export Report</span>
                </button>

                <button
                  onClick={() => setIsProposalModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono flex items-center space-x-1.5 transition-all"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Create Proposal</span>
                </button>
              </div>
            </div>

            {/* SECTION 11: VISUAL REFINEMENT SUB-NAVIGATION TABS */}
            <div className="flex border-b border-white/10 space-x-1.5 sm:space-x-2 overflow-x-auto pb-1 scrollbar-thin">
              {[
                { id: 'overview', label: 'Personal Information', icon: User, allowed: true },
                { id: 'company', label: 'Company Intelligence', icon: Building2, allowed: true },
                { id: 'research', label: 'AI Research Center', icon: BrainCircuit, allowed: true },
                { id: 'timeline', label: 'Relationship Timeline', icon: Clock, allowed: true },
                { id: 'sales', label: 'Sales Intelligence', icon: DollarSign, allowed: permissions.canViewSalesIntelligence },
                { id: 'marketing', label: 'Marketing & Events', icon: Target, allowed: true },
                { id: 'after_sales', label: 'After-Sales Continuity', icon: ShieldCheck, allowed: permissions.canViewAfterSalesTab },
                { id: 'knowledge_hub', label: 'Shared Knowledge Hub', icon: MessageSquare, allowed: true },
                { id: 'opportunities', label: `Opportunities (${selectedExecDetail.opportunities?.length || 0})`, icon: Briefcase, allowed: permissions.canViewDealsTab },
                { id: 'network', label: 'Referrals & Network', icon: Share2, allowed: permissions.canViewFullReferralNetwork }
              ].filter(tab => tab.allowed).map(tab => {
                const Icon = tab.icon;
                const isActive = active360Tab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActive360Tab(tab.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shrink-0 border ${
                      isActive 
                        ? 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-md' 
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/5'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT PANELS */}

            {/* TAB 1: OVERVIEW 360° */}
            {active360Tab === 'overview' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Relationship Stage & Owner</span>
                    <select
                      value={selectedExecDetail.relationshipStage || 'New Contact'}
                      onChange={e => handleStageChange(selectedExecDetail, e.target.value as RelationshipStage)}
                      className="w-full bg-navy-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-semibold focus:outline-none focus:border-cyan-400"
                    >
                      {RELATIONSHIP_STAGES.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                    <p className="text-slate-300 pt-1">
                      Relationship Owner: <strong className="text-emerald-300">{selectedExecDetail.assignedSalesRep || 'Alex Vance'}</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Direct Contact Info</span>
                    <p className="font-mono text-cyan-300">{selectedExecDetail.email}</p>
                    
                    {permissions.canViewPhoneAndLinkedIn || unlockedLeadershipIds[selectedExecDetail.id] ? (
                      <>
                        <p className="font-mono text-slate-300">{selectedExecDetail.contactNumber || selectedExecDetail.phoneNumber || 'Direct Line Pending'}</p>
                        <div className="flex items-center space-x-3 pt-1">
                          {selectedExecDetail.linkedinProfile && (
                            <a href={selectedExecDetail.linkedinProfile} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline inline-flex items-center space-x-1 text-[11px]">
                              <Linkedin className="w-3.5 h-3.5" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {selectedExecDetail.companyWebsite && (
                            <a href={selectedExecDetail.companyWebsite} target="_blank" rel="noreferrer" className="text-slate-300 hover:underline inline-flex items-center space-x-1 text-[11px]">
                              <Globe className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </>
                    ) : userRole === 'Leadership' ? (
                      <div className="pt-1.5 space-y-1">
                        <span className="text-[11px] font-mono text-amber-300 block">🔒 Phone & LinkedIn Restricted (Leadership Default)</span>
                        <button
                          onClick={() => handleUnlockLeadershipAccess(selectedExecDetail.id, selectedExecDetail.fullName)}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono transition-all flex items-center space-x-1"
                        >
                          <ShieldCheck className="w-3 h-3 text-amber-300" />
                          <span>Request & Log Audit Access</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-1 text-[11px] font-mono text-slate-400 italic">
                        [Phone & LinkedIn Access Restricted for {userRole}]
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Profile Completeness & Health</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Completeness:</span>
                      <span className="font-mono font-bold text-cyan-300">{selectedExecDetail.profileCompleteness || calculateProfileCompleteness(selectedExecDetail)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-navy-900 rounded-full overflow-hidden border border-white/10">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedExecDetail.profileCompleteness || calculateProfileCompleteness(selectedExecDetail)}%` }} />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-300">Relationship Health:</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {selectedExecDetail.healthStatus || 'Thriving'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Tags & Communication Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Executive Profile Tags</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedExecDetail.tags && selectedExecDetail.tags.length > 0 ? selectedExecDetail.tags : ['Executive', 'VIP', 'AI Summit Candidate', 'ERP Migration']).map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Communication Preferences & Tone</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedExecDetail.communicationPreferences || ['Direct Email', 'C-Suite Briefings', 'Phone Call']).map(pref => (
                        <span key={pref} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-white/10 text-slate-200 text-xs">
                          ✓ {pref}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono pt-1">
                      Tone Preference: <span className="text-white font-medium">{selectedExecDetail.communicationTonePreference || 'Data-Driven & Direct'}</span>
                    </p>
                  </div>
                </div>

                {/* Background Notes */}
                {selectedExecDetail.notes && (
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-1 text-xs">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Internal Background & Executive Notes</span>
                    <p className="text-slate-200 leading-relaxed">{selectedExecDetail.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: COMPANY INTELLIGENCE */}
            {active360Tab === 'company' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="font-bold text-sm text-cyan-300 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <span>{selectedExecDetail.company} — Corporate Profile & Architecture</span>
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      {selectedExecDetail.industry} Sector
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Headquarters</span>
                      <strong className="text-white">{selectedExecDetail.companyDetails?.headquarters || `${selectedExecDetail.city || 'Chicago'}, ${selectedExecDetail.country || 'USA'}`}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Company Size</span>
                      <strong className="text-white">{selectedExecDetail.companyDetails?.companySize || '2,500 - 10,000 Employees'}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">ERP Environment</span>
                      <strong className="text-emerald-300">{selectedExecDetail.companyDetails?.erpEnvironment || selectedExecDetail.erpModernizationPotential || 'SAP S/4HANA Cloud / Legacy Migration'}</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">AI Adoption Stage</span>
                      <strong className="text-cyan-300">{selectedExecDetail.companyDetails?.aiAdoptionLevel || selectedExecDetail.aiAdoptionStage || 'Scaling Enterprise GenAI'}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Products, Services & Tech Stack */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Technology Stack & Digital Architecture</span>
                    </span>
                    <div className="space-y-2">
                      <span className="text-slate-400 text-[11px] font-mono block">Current Tech Infrastructure:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedExecDetail.companyDetails?.technologyStack || selectedExecDetail.techStack || ['SAP S/4HANA', 'AWS Cloud', 'Databricks', 'Snowflake', 'Salesforce CRM', 'Kubernetes']).map(tech => (
                          <span key={tech} className="px-2.5 py-1 rounded bg-white/5 text-slate-200 border border-white/10 font-mono text-[11px]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-slate-400 text-[11px] font-mono block">Core Products & Services:</span>
                      <p className="text-slate-300 leading-relaxed">
                        {(selectedExecDetail.companyDetails?.productsAndServices || ['Global Enterprise Logistics', 'Supply Chain Analytics', 'Digital Industrial Equipment']).join(' • ')}
                      </p>
                    </div>
                  </div>

                  {/* Strategic Business Priorities & News */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-amber-300 font-bold block flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>Strategic Business Priorities & Growth</span>
                    </span>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[11px] font-mono block">Strategic Business Initiatives:</span>
                      <div className="space-y-1 text-slate-300">
                        {(selectedExecDetail.strategicPriorities || ['Consolidate legacy ERP nodes into single cloud pane', 'Deploy autonomous AI agents in supply chain', 'Accelerate Q3 operational automation']).map(sp => (
                          <div key={sp} className="flex items-start space-x-1.5">
                            <span className="text-cyan-400">•</span>
                            <span>{sp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-slate-400 text-[11px] font-mono block">Recent Company News & Signals:</span>
                      <p className="text-slate-300 leading-relaxed">
                        {(selectedExecDetail.companyDetails?.recentNews || ['Announced $50M digital transformation initiative for 2026', 'Expanded APAC logistics network']).join(' • ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* DELCA Service Alignment Matrix */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-navy-950 via-cyan-950/30 to-navy-950 border border-cyan-500/30 space-y-2">
                  <span className="text-[11px] font-mono uppercase text-cyan-300 font-bold flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>DELCA Solutions & Strategic Alignment</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    DELCA VisionTech can deliver direct ROI through our <strong className="text-white">Agentic AI Customer Intelligence Suite</strong> and <strong className="text-white">Cloud ERP Modernization Connectors</strong>. These solutions map directly to {selectedExecDetail.company}'s goal of modernizing legacy systems and reducing operational latency.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: AI RESEARCH CENTER (4 AGENTS) */}
            {active360Tab === 'research' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-navy-950 border border-purple-500/30">
                  <div className="flex items-center space-x-2">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                    <div>
                      <h4 className="font-bold text-white">DELCA Autonomous AI Research Multi-Agent Network</h4>
                      <p className="text-[11px] text-slate-400">4 Specialised AI Agents continuously scanning web, corporate filings, and industry datasets</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <span className="text-slate-400 block">Research Confidence: <strong className="text-emerald-400">{selectedExecDetail.researchConfidence || 96}%</strong></span>
                    <span className="text-slate-500">Last Synced: July 2026</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Agent 1: Identity Research Agent */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-cyan-300 font-bold border-b border-white/5 pb-2">
                      <User className="w-4 h-4 text-cyan-400" />
                      <span>Identity Research Agent</span>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <p><strong className="text-white">Biography:</strong> {selectedExecDetail.biography || `${selectedExecDetail.fullName} is an established senior leader with extensive tenure driving technology transformations.`}</p>
                      <p><strong className="text-white">Education:</strong> {selectedExecDetail.education || 'M.S. in Computer Science / Business Administration'}</p>
                      <p><strong className="text-white">Leadership Experience:</strong> Senior executive overseeing cross-functional engineering, IT operations, and corporate strategy.</p>
                      <p><strong className="text-white">Public Profiles:</strong> Verified LinkedIn, Corporate Bio Page, Industry Keynote Speaker Directory.</p>
                    </div>
                  </div>

                  {/* Agent 2: Company Research Agent */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-300 font-bold border-b border-white/5 pb-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>Company Research Agent</span>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <p><strong className="text-white">Company Overview:</strong> Leading enterprise operating in {selectedExecDetail.industry} with multi-regional presence.</p>
                      <p><strong className="text-white">Business Strategy:</strong> Aggressive modernization, cloud migration, and workflow automation.</p>
                      <p><strong className="text-white">Tech Investments:</strong> Active spending in AI Agent infrastructure, ERP connectors, and cyber resilience.</p>
                      <p><strong className="text-white">Financial Highlights:</strong> Strong balance sheet with designated Q3 innovation capital.</p>
                    </div>
                  </div>

                  {/* Agent 3: Industry Intelligence Agent */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-amber-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold border-b border-white/5 pb-2">
                      <Globe className="w-4 h-4 text-amber-400" />
                      <span>Industry Intelligence Agent</span>
                    </div>
                    <div className="space-y-1.5 text-slate-300">
                      <p><strong className="text-white">Industry Trends:</strong> Rapid shift toward agentic AI workflows and real-time ERP analytics in {selectedExecDetail.industry}.</p>
                      <p><strong className="text-white">Competitor Landscape:</strong> Major peers investing heavily in automated customer and supply chain intelligence.</p>
                      <p><strong className="text-white">Challenges & Regulatory:</strong> Data sovereignty requirements, legacy software technical debt, regulatory compliance.</p>
                    </div>
                  </div>

                  {/* Agent 4: Persona Builder Agent */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-purple-500/30 space-y-2">
                    <div className="flex items-center space-x-2 text-purple-300 font-bold border-b border-white/5 pb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span>Persona Builder Agent</span>
                    </div>
                    {permissions.canViewPersonaProfiling ? (
                      <div className="space-y-1.5 text-slate-300">
                        <p><strong className="text-white">Decision-Making Style:</strong> {selectedExecDetail.decisionMakingStyle || 'Analytical & ROI-Driven (Requires quantitative proof & clear milestones)'}</p>
                        <p><strong className="text-white">Communication Preference:</strong> {selectedExecDetail.communicationTonePreference || 'Concise, executive-level summaries with strategic metrics.'}</p>
                        <p><strong className="text-white">AI Maturity Level:</strong> High (Eager to adopt enterprise agentic AI for competitive edge).</p>
                        <p><strong className="text-white">Personalized Engagement:</strong> Invite to C-Suite AI Summit and present custom ERP integration POC.</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-white/5 rounded-lg text-amber-300 font-mono text-[11px] space-y-1">
                        <span className="font-bold block">🔒 Persona Profiling Restricted</span>
                        <p className="text-slate-400">Decision-making style and persona profiling are restricted for the {userRole} role.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RELATIONSHIP TIMELINE */}
            {active360Tab === 'timeline' && (
              <div className="space-y-4 text-xs">
                {/* Timeline Filter Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-navy-950 border border-white/10">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-white">Unified Chronological Timeline</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Filter:</span>
                    <select
                      value={timelineFilter}
                      onChange={e => setTimelineFilter(e.target.value)}
                      className="bg-navy-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
                    >
                      <option value="All">All Interactions</option>
                      <option value="AI Research">AI Research Updates</option>
                      <option value="Email">Emails</option>
                      <option value="Meeting">Meetings</option>
                      <option value="Call">Calls</option>
                      <option value="Event">Event Attendance</option>
                      <option value="Proposal">Proposals & Deals</option>
                    </select>
                  </div>
                </div>

                {/* Timeline Items */}
                <div className="space-y-3 relative pl-4 border-l-2 border-cyan-500/30 max-h-80 overflow-y-auto pr-1">
                  {/* Default / Mock Timeline Activities */}
                  {[
                    { id: 't1', type: 'AI Research', author: 'DELCA Persona Agent', date: '2026-07-25', title: 'Persona Profile & AI Readiness Assessment Generated', content: 'Completed 4-agent deep web and corporate intelligence synthesis. AI Readiness: 85%.' },
                    { id: 't2', type: 'Proposal', author: 'Alex Vance', date: '2026-07-20', title: 'Enterprise AI & ERP Modernization Proposal Sent', content: 'Transmitted formal $250,000 solution architecture proposal via secure portal.' },
                    { id: 't3', type: 'Meeting', author: 'Alex Vance & Technical Team', date: '2026-07-15', title: 'Executive ERP Discovery Session', content: 'Discussed SAP S/4HANA connector integration and agentic AI security guardrails.' },
                    { id: 't4', type: 'Event', author: 'Marketing Team', date: '2026-07-02', title: 'Attended VisionTech C-Suite AI Summit', content: 'Confirmed executive participation in VIP Roundtable on Cloud Transformation.' },
                    ...(selectedExecDetail.interactionHistory || []).map(h => ({
                      id: h.id,
                      type: h.type,
                      author: h.authorName,
                      date: new Date(h.timestamp).toISOString().split('T')[0],
                      title: `${h.type} Interaction`,
                      content: h.content
                    }))
                  ]
                  .filter(item => timelineFilter === 'All' || item.type.toLowerCase().includes(timelineFilter.toLowerCase()))
                  .map((item, idx) => (
                    <div key={item.id || idx} className="relative group">
                      <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-cyan-400 border-2 border-navy-900 shadow-md" />
                      <div className="p-3.5 rounded-xl bg-navy-950 border border-white/5 hover:border-cyan-500/30 transition-all space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span className="text-cyan-300 font-bold uppercase">{item.type} • {item.author}</span>
                          <span>{item.date}</span>
                        </div>
                        <h5 className="font-bold text-white text-xs">{item.title}</h5>
                        <p className="text-slate-300 text-xs leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Log Activity Box */}
                {onAddInteractionNote && (
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Log New Timeline Activity</span>
                      <select
                        value={newNoteType}
                        onChange={e => setNewNoteType(e.target.value as any)}
                        className="bg-navy-900 border border-white/10 rounded px-2 py-0.5 text-[10px] text-white"
                      >
                        <option value="Note">Note</option>
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Call">Call</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Enter interaction details, proposal updates, or meeting minutes..."
                      value={newNoteContent}
                      onChange={e => setNewNoteContent(e.target.value)}
                      className="w-full bg-navy-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddNoteInDrawer}
                        disabled={isAddingNote || !newNoteContent.trim()}
                        className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shadow disabled:opacity-50"
                      >
                        Log Activity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SALES INTELLIGENCE */}
            {active360Tab === 'sales' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Opportunity Score</span>
                    <strong className="text-lg font-mono text-emerald-400">88 / 100 (High)</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-amber-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Budget Indicators</span>
                    <strong className="text-amber-300 font-mono">$100k - $500k Approved</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-purple-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Decision Authority</span>
                    <strong className="text-purple-300 font-mono">Final Decision Maker (C-Suite)</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">AI Readiness</span>
                    <strong className="text-cyan-300 font-mono">Advanced Enterprise Ready</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buying Signals & Pain Points */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block flex items-center space-x-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Detected Buying Signals & Intent</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedExecDetail.buyingSignals || ['Active RFP for Enterprise AI Solutions', 'Expanded Tech Modernization Budget', 'Recent Keynote on Cloud Transformation']).map(sig => (
                        <span key={sig} className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-medium">
                          ✓ {sig}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-rose-300 font-bold block">Business Challenges & Friction</span>
                      <div className="space-y-1 text-slate-300">
                        {(selectedExecDetail.painPoints || ['Legacy system integration bottlenecks', 'Resource constraints for internal AI engineering']).map(pt => (
                          <div key={pt} className="flex items-start space-x-1.5">
                            <span className="text-rose-400">•</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Talking Points & Strategy */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block flex items-center space-x-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Recommended Sales Strategy & Talking Points</span>
                    </span>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[11px] font-mono block">Recommended Meeting Talking Points:</span>
                      <div className="space-y-1 text-slate-200">
                        <div className="p-2 rounded bg-navy-900 border border-white/5">• Highlight DELCA's zero-friction SAP/Oracle ERP connector modules.</div>
                        <div className="p-2 rounded bg-navy-900 border border-white/5">• Emphasize security guardrails & data sovereignty for agentic AI.</div>
                        <div className="p-2 rounded bg-navy-900 border border-white/5">• Present 30-day proof-of-concept deployment roadmap.</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Next Recommended Sales Action:</span>
                      <p className="font-bold text-white pt-0.5">{selectedExecDetail.recommendedNextActions?.[0] || 'Schedule ERP Discovery & Technical Proof-of-Concept'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: MARKETING & EVENT INTELLIGENCE */}
            {active360Tab === 'marketing' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-purple-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Event Match Score</span>
                    <strong className="text-lg font-mono text-purple-300">94% Match</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-cyan-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Email Engagement Rate</span>
                    <strong className="text-cyan-300 font-mono">82% Open / 45% Click</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-navy-950 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Content Downloads</span>
                    <strong className="text-emerald-300 font-mono">3 Whitepapers & Guides</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recommended Events & Topics */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block flex items-center space-x-1.5">
                      <Target className="w-3.5 h-3.5 text-purple-400" />
                      <span>Recommended Events & Preferred Topics</span>
                    </span>

                    <div className="space-y-1.5">
                      <span className="text-slate-400 text-[11px] font-mono block">Recommended VIP Events:</span>
                      <div className="space-y-1">
                        <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold">
                          • VisionTech AI C-Suite Leadership Summit 2026
                        </div>
                        <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold">
                          • Enterprise ERP Modernization Forum
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 space-y-1">
                      <span className="text-slate-400 text-[11px] font-mono block">Preferred Event Topics:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedExecDetail.preferredEventCategories || ['Agentic AI Workflows', 'Cloud ERP Migration', 'Enterprise Data Governance']).map(cat => (
                          <span key={cat} className="px-2.5 py-0.5 rounded bg-white/5 text-slate-200 border border-white/10 font-mono text-[11px]">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Suggested Event Invitation Message */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block flex items-center space-x-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Suggested Personalized Invitation Message</span>
                      </span>

                      <div className="p-3 rounded-lg bg-navy-900 border border-white/5 text-slate-300 leading-relaxed font-mono text-[11px]">
                        "Dear {selectedExecDetail.fullName.split(' ')[0]}, given {selectedExecDetail.company}'s leadership in {selectedExecDetail.industry} digital transformation, we cordially invite you to join our exclusive VIP Roundtable at the VisionTech C-Suite AI Summit 2026..."
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex justify-end">
                      {onSendInvitation && (
                        <button
                          onClick={() => onSendInvitation(selectedExecDetail)}
                          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-navy-950 font-bold text-xs shadow flex items-center space-x-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Transmit VIP Invitation</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: AFTER-SALES CONTINUITY */}
            {active360Tab === 'after_sales' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="font-bold text-sm text-emerald-300 flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>After-Sales Customer Continuity & Account Health</span>
                    </h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      CSAT: 9.6 / 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Active Projects</span>
                      <strong className="text-white">ERP Agentic AI Integration Phase 1</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Implementation Timeline</span>
                      <strong className="text-cyan-300">Q3 2026 (On Schedule)</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">Renewal & Upsell</span>
                      <strong className="text-amber-300">Annual License Renewal Oct 2026</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Success Milestones & ROI */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-emerald-300 font-bold block flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Success Milestones & ROI Achievements</span>
                    </span>

                    <div className="space-y-1 text-slate-300">
                      <div className="flex items-start space-x-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>Completed initial architecture blueprint audit (100% verified).</span>
                      </div>
                      <div className="flex items-start space-x-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>Delivered 35% improvement in preliminary data processing speed.</span>
                      </div>
                      <div className="flex items-start space-x-1.5">
                        <span className="text-emerald-400">✓</span>
                        <span>Established zero-downtime staging environment for ERP connectors.</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Feedback & Support History */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block flex items-center space-x-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Customer Feedback & Support Log</span>
                    </span>

                    <p className="text-slate-300 italic leading-relaxed bg-navy-900 p-3 rounded-lg border border-white/5">
                      "{selectedExecDetail.fullName} expressed high satisfaction with DELCA's technical support team during the initial integration briefing."
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Open Support Tickets: <strong className="text-emerald-400">0 Pending</strong></span>
                      <span>Account Status: <strong className="text-emerald-400">Thriving</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: SHARED KNOWLEDGE HUB */}
            {active360Tab === 'knowledge_hub' && (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-navy-950 border border-cyan-500/30 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>Cross-Departmental Knowledge Hub</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Collaborative workspace accessible by Marketing, Sales, Event Planning, After-Sales & Leadership</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono text-[11px] font-bold">
                    Shared Base
                  </span>
                </div>

                {/* Knowledge Hub Feed */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {(selectedExecDetail.knowledgeHubNotes || [
                    { id: 'k1', author: 'Alex Vance', role: 'Sales Lead', category: 'Note', content: 'Executive requested updated ROI comparison matrix prior to board review next month.', timestamp: '2026-07-22' },
                    { id: 'k2', author: 'DELCA AI Agent', role: 'AI Assistant', category: 'AI Recommendation', content: 'AI Recommendation: Highlight manufacturing case study during follow-up email.', timestamp: '2026-07-21' },
                    { id: 'k3', author: 'Sarah Jenkins', role: 'Event Director', category: 'Task', content: 'Task: Reserve VIP seating at C-Suite AI Summit for executive & team.', timestamp: '2026-07-18' }
                  ]).map(item => (
                    <div key={item.id} className="p-3.5 rounded-xl bg-navy-950 border border-white/5 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-cyan-300 font-bold">{item.author} ({item.role})</span>
                        <span className="px-2 py-0.2 rounded bg-white/5 text-slate-400 border border-white/10">{item.category} • {item.timestamp}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{item.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add Knowledge Hub Note/Task */}
                <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Post Shared Knowledge or Task</span>
                    <select
                      value={knowledgeCategory}
                      onChange={e => setKnowledgeCategory(e.target.value as any)}
                      className="bg-navy-900 border border-white/10 rounded px-2.5 py-1 text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Note">Internal Note</option>
                      <option value="Task">Follow-up Task</option>
                      <option value="Document">Document Reference</option>
                      <option value="AI Recommendation">AI Recommendation</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Enter collaborative note, research attachment details, or cross-department task..."
                    value={newKnowledgeContent}
                    onChange={e => setNewKnowledgeContent(e.target.value)}
                    className="w-full bg-navy-900 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (!newKnowledgeContent.trim()) return;
                        const newNote = {
                          id: `k-${Date.now()}`,
                          author: userRole,
                          role: userRole,
                          content: newKnowledgeContent,
                          category: knowledgeCategory,
                          timestamp: new Date().toISOString().split('T')[0]
                        };
                        const updated = {
                          ...selectedExecDetail,
                          knowledgeHubNotes: [...(selectedExecDetail.knowledgeHubNotes || []), newNote]
                        };
                        setSelectedExecDetail(updated);
                        onEditExecutive(selectedExecDetail.id, updated);
                        setNewKnowledgeContent('');
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shadow"
                    >
                      Post to Knowledge Hub
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: OPPORTUNITIES */}
            {active360Tab === 'opportunities' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-navy-950 p-4 rounded-xl border border-white/10">
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase">Total Pipeline Opportunity Value</div>
                    <div className="text-2xl font-display font-extrabold text-emerald-400">
                      ${(selectedExecDetail.opportunities || []).reduce((acc, o) => acc + (o.value || 0), 0).toLocaleString()} USD
                    </div>
                  </div>
                  {onAddOpportunity && (
                    <button
                      onClick={() => setIsCreatingOpp(!isCreatingOpp)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow-lg flex items-center space-x-1.5 self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isCreatingOpp ? 'Cancel' : 'New Opportunity'}</span>
                    </button>
                  )}
                </div>

                {/* Inline Creation Form */}
                {isCreatingOpp && onAddOpportunity && (
                  <div className="p-4 rounded-xl bg-navy-950 border border-emerald-500/30 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-emerald-300 uppercase">Record New Business Opportunity</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1">Opportunity Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Enterprise ERP Migration Project"
                          value={oppTitle}
                          onChange={e => setOppTitle(e.target.value)}
                          className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1">Estimated Value (USD)</label>
                        <input
                          type="number"
                          value={oppValue}
                          onChange={e => setOppValue(Number(e.target.value))}
                          className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 uppercase mb-1">Pipeline Stage</label>
                        <select
                          value={oppStage}
                          onChange={e => setOppStage(e.target.value as BusinessOpportunityStage)}
                          className="w-full bg-navy-900 border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                        >
                          {OPPORTUNITY_STAGES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={async () => {
                          if (!oppTitle.trim()) return;
                          await onAddOpportunity(selectedExecDetail.id, {
                            title: oppTitle,
                            value: oppValue,
                            stage: oppStage,
                            opportunityType: 'Partnership',
                            expectedCloseDate: '2026-10-30',
                            probability: 70
                          });
                          setIsCreatingOpp(false);
                          setOppTitle('');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow"
                      >
                        Save Opportunity
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Opportunities */}
                <div className="space-y-3">
                  {(selectedExecDetail.opportunities && selectedExecDetail.opportunities.length > 0) ? (
                    selectedExecDetail.opportunities.map(opp => (
                      <div key={opp.id} className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white">{opp.title}</h4>
                          <span className="text-emerald-400 font-mono font-bold text-sm">${opp.value?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
                          <span>Stage: {opp.stage}</span>
                          <span>• Type: {opp.opportunityType}</span>
                          <span>• Prob: {opp.probability}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-xs italic text-center py-6">No active opportunities recorded for this executive.</p>
                  )}
                </div>
              </div>
            )}

            {/* TAB 10: REFERRALS & NETWORK */}
            {active360Tab === 'network' && (
              <div className="space-y-6 text-xs">
                <div className="space-y-3">
                  <h4 className="font-bold text-cyan-300 uppercase font-mono text-[11px]">Referral Origin & Intro Tree</h4>
                  {getReferralChain(selectedExecDetail.id, executives).length > 0 ? (
                    <div className="space-y-2">
                      {getReferralChain(selectedExecDetail.id, executives).map((refNode) => (
                        <div key={refNode.exec.id} className="p-3.5 rounded-xl bg-navy-950 border border-white/5 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">{refNode.exec.fullName}</div>
                            <div className="text-slate-400">{refNode.exec.position} @ {refNode.exec.company}</div>
                          </div>
                          <span className="text-cyan-400 font-mono font-bold">{refNode.relationship}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">Direct outreach contact (no recorded executive referrer).</p>
                  )}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4">
                  <h4 className="font-bold text-cyan-300 uppercase font-mono text-[11px]">Shared Industry Network Connections</h4>
                  {getNetworkConnections(selectedExecDetail, executives).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {getNetworkConnections(selectedExecDetail, executives).map(conn => (
                        <div key={conn.executive.id} className="p-3.5 rounded-xl bg-navy-950 border border-white/5 space-y-1">
                          <div className="font-bold text-white">{conn.executive.fullName}</div>
                          <div className="text-slate-400 text-[11px]">{conn.executive.position} @ {conn.executive.company}</div>
                          <div className="text-cyan-300 font-mono text-[10px]">{conn.connectionReasons.join(' • ')}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No shared company or industry connections recorded in database.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QUICK ACTION MODAL 1: EXECUTIVE BRIEFING */}
      {isBriefingModalOpen && selectedExecDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-amber-300 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>AI Executive Briefing — {selectedExecDetail.fullName}</span>
              </h3>
              <button onClick={() => setIsBriefingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 font-mono text-xs text-slate-200 leading-relaxed space-y-3 max-h-96 overflow-y-auto">
              <div className="border-b border-white/10 pb-2">
                <strong className="text-amber-300 block text-sm">DELCA VISIONTECH EXECUTIVE DOSSIER</strong>
                <span className="text-slate-400 text-[10px]">Target: {selectedExecDetail.fullName} ({selectedExecDetail.position} @ {selectedExecDetail.company})</span>
              </div>

              <div>
                <strong className="text-cyan-300 block">1. EXECUTIVE OVERVIEW:</strong>
                <p>{selectedExecDetail.biography || `${selectedExecDetail.fullName} leads digital initiatives at ${selectedExecDetail.company}. Key C-Suite decision maker with high interest in agentic AI.`}</p>
              </div>

              <div>
                <strong className="text-cyan-300 block">2. PAIN POINTS & OPPORTUNITIES:</strong>
                <p>Seeking legacy system integration relief, enterprise cloud data consolidation, and SAP/Oracle ERP modernization.</p>
              </div>

              <div>
                <strong className="text-cyan-300 block">3. RECOMMENDED ENGAGEMENT STRATEGY:</strong>
                <p>{selectedExecDetail.recommendedNextActions?.[0] || 'Schedule 1-on-1 ERP Discovery meeting and deliver tailored POC.'}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsBriefingModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Close Briefing
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`DELCA EXECUTIVE BRIEFING: ${selectedExecDetail.fullName} (${selectedExecDetail.company})\n\nPosition: ${selectedExecDetail.position}\nIndustry: ${selectedExecDetail.industry}\nAI Readiness: ${selectedExecDetail.aiReadinessScore || 85}%\nRecommended Action: ${selectedExecDetail.recommendedNextActions?.[0] || 'Schedule ERP Discovery'}`);
                  setIsBriefingModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs shadow"
              >
                Copy Briefing to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTION MODAL 2: EXPORT REPORT */}
      {isExportReportModalOpen && selectedExecDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-cyan-300 flex items-center space-x-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <span>Export Executive Report</span>
              </h3>
              <button onClick={() => setIsExportReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Export 360° profile, AI research output, and sales timeline for <strong className="text-white">{selectedExecDetail.fullName}</strong>.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(selectedExecDetail, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `DELCA_Executive_Report_${selectedExecDetail.fullName.replace(/\s+/g, '_')}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                  setIsExportReportModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold font-mono text-center transition-all"
              >
                Download JSON Executive Dossier
              </button>

              <button
                onClick={() => {
                  window.print();
                  setIsExportReportModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-bold font-mono text-center transition-all"
              >
                Print Printable Executive Briefing Page
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ACTION MODAL 3: CREATE PROPOSAL */}
      {isProposalModalOpen && selectedExecDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-emerald-300 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Create Sales Proposal for {selectedExecDetail.fullName}</span>
              </h3>
              <button onClick={() => setIsProposalModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Proposal Title</label>
                <input
                  type="text"
                  value={proposalTitleInput}
                  onChange={e => setProposalTitleInput(e.target.value)}
                  className="w-full bg-navy-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Estimated Deal Value (USD)</label>
                <input
                  type="number"
                  value={proposalValueInput}
                  onChange={e => setProposalValueInput(Number(e.target.value))}
                  className="w-full bg-navy-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (onAddOpportunity && selectedExecDetail) {
                    await onAddOpportunity(selectedExecDetail.id, {
                      title: proposalTitleInput,
                      value: proposalValueInput,
                      stage: 'Proposal Sent',
                      opportunityType: 'Partnership',
                      expectedCloseDate: '2026-11-30',
                      probability: 80
                    });
                  }
                  setIsProposalModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs shadow"
              >
                Generate & Attach Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT CSV/JSON MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-cyan-300">Bulk Import Executive Roster</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Paste CSV rows (Format: <code className="text-cyan-400">Name, Email, Company, Title, Industry, Country</code>) or a JSON array of Executive objects.
            </p>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <textarea
                rows={8}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder={`Jane Doe, jane@enterprise.com, Acme Corp, Chief Innovation Officer, Banking, USA\nJohn Smith, john@globaltech.com, Global Tech, VP Technology, Software, Germany`}
                className="w-full bg-navy-950 border border-white/10 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />

              {importError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {importError}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shadow"
                >
                  Import Contacts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DUPLICATES MERGE MODAL */}
      {isDuplicateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl text-slate-100 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-display font-bold text-base text-amber-300 flex items-center space-x-2">
                <Copy className="w-4 h-4 text-amber-400" />
                <span>Duplicate Contacts Resolver</span>
              </h3>
              <button onClick={() => setIsDuplicateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {duplicateGroups.map((group, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 font-bold">Reason: {group.reason}</span>
                    <button
                      onClick={async () => {
                        if (onMergeDuplicates) {
                          await onMergeDuplicates(group.primary.id, group.duplicates.map(d => d.id));
                          setIsDuplicateModalOpen(false);
                        }
                      }}
                      className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold"
                    >
                      Merge Group
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded bg-navy-900 border border-cyan-500/30">
                      <div className="font-bold text-white">{group.primary.fullName} (Primary)</div>
                      <div className="text-slate-400">{group.primary.email} • {group.primary.company}</div>
                    </div>
                    {group.duplicates.map(d => (
                      <div key={d.id} className="p-2.5 rounded bg-navy-900 border border-rose-500/30">
                        <div className="font-bold text-slate-300">{d.fullName} (Duplicate)</div>
                        <div className="text-slate-400">{d.email} • {d.company}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
