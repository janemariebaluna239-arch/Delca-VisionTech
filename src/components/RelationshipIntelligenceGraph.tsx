import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Building, 
  GitFork, 
  Handshake, 
  Cloud, 
  Database, 
  BarChart3, 
  Briefcase, 
  Calendar, 
  BookOpen, 
  BrainCircuit, 
  Star, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  Mail, 
  CalendarPlus, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  Network, 
  TrendingUp, 
  Zap, 
  X,
  Compass,
  HelpCircle,
  Target
} from 'lucide-react';
import { Executive, DELCAEvent, BusinessOpportunity } from '../types';

export type NodeType = 
  | 'company'
  | 'executive'
  | 'parent_company'
  | 'subsidiary'
  | 'partner'
  | 'tech_partner'
  | 'erp_vendor'
  | 'crm_platform'
  | 'opportunity'
  | 'event'
  | 'knowledge'
  | 'ai_recommendation'
  | 'strategic_account';

export type RelationshipStrength = 'strong' | 'medium' | 'weak' | 'new' | 'dormant';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  sublabel?: string;
  category?: string;
  avatar?: string;
  companyName?: string;
  value?: string | number;
  status?: string;
  healthScore?: number;
  riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
  lastActive?: string;
  meta?: Record<string, any>;
  x: number;
  y: number;
  expanded?: boolean;
  clusterId?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: 
    | 'Works At'
    | 'Reports To'
    | 'Decision Maker'
    | 'Project Sponsor'
    | 'Influencer'
    | 'Business Partner'
    | 'Strategic Contact'
    | 'Technology Owner'
    | 'Marketing Contact'
    | 'Customer Success Contact'
    | 'Parent Company'
    | 'Subsidiary'
    | 'Strategic Partner'
    | 'Technology Partner'
    | 'Business Opportunity'
    | 'Attended Event'
    | 'Customer'
    | 'Prospect'
    | 'Existing Client'
    | 'Supplier'
    | 'Competitor'
    | 'Executive Connection'
    | 'Knowledge Source'
    | 'Previous Meeting'
    | 'Sales Owner'
    | 'Campaign Member';
  strength: RelationshipStrength;
  score?: number; // 0 - 100
  lastInteractionDate?: string;
  details?: string;
  value?: string;
}

export interface GraphAIInsight {
  id: string;
  title: string;
  type: 'Highly Connected' | 'High-Value Exec' | 'Relationship Gap' | 'Uncontacted Stakeholder' | 'Cross-Sell Opportunity' | 'Upsell Opportunity' | 'Dormant Account' | 'Referral Pathway';
  targetNodeId: string;
  confidenceScore: number;
  impactValue: string;
  explanationWhy: string;
  evidenceTrigger: string;
  recommendedNextStep: string;
}

const EMPTY_EXECUTIVES: Executive[] = [];
const EMPTY_EVENTS: DELCAEvent[] = [];
const EMPTY_OPPORTUNITIES: BusinessOpportunity[] = [];

export interface RelationshipIntelligenceGraphProps {
  mode?: 'company' | 'executive' | 'global';
  focusCompanyId?: string;
  focusCompanyName?: string;
  focusExecutiveId?: string;
  executives?: Executive[];
  events?: DELCAEvent[];
  opportunities?: BusinessOpportunity[];
  companyInfo?: any;
  onOpenExecutiveProfile?: (execId: string) => void;
  onOpenCompanyProfile?: (companyName: string) => void;
  onComposeEmail?: (exec: Executive) => void;
  onScheduleMeeting?: (exec: Executive) => void;
  height?: string | number;
}

export default function RelationshipIntelligenceGraph({
  mode = 'company',
  focusCompanyId,
  focusCompanyName = 'BDO Unibank',
  focusExecutiveId,
  executives = EMPTY_EXECUTIVES,
  events = EMPTY_EVENTS,
  opportunities = EMPTY_OPPORTUNITIES,
  companyInfo,
  onOpenExecutiveProfile,
  onOpenCompanyProfile,
  onComposeEmail,
  onScheduleMeeting,
  height = '620px'
}: RelationshipIntelligenceGraphProps) {
  // State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [hoveredEdgeId, setHoveredEdgeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeTypeFilter, setSelectedNodeTypeFilter] = useState<string>('all');
  const [selectedRelFilter, setSelectedRelFilter] = useState<string>('all');
  const [showBusinessPanel, setShowBusinessPanel] = useState<boolean>(true);
  const [connectionDepth, setConnectionDepth] = useState<'1st' | '2nd' | 'all'>('2nd');
  const [layoutStyle, setLayoutStyle] = useState<'sectors' | 'orbit' | 'flow'>('sectors');
  const [currentExecId, setCurrentExecId] = useState<string | null>(focusExecutiveId || null);
  const [actionToast, setActionToast] = useState<{ title: string; message: string } | null>(null);

  const showActionToast = (title: string, message: string) => {
    setActionToast({ title, message });
    setTimeout(() => {
      setActionToast(null);
    }, 4500);
  };

  // Synchronize center executive when focusExecutiveId prop updates
  useEffect(() => {
    if (focusExecutiveId) {
      setCurrentExecId(focusExecutiveId);
    }
  }, [focusExecutiveId]);

  const [expandedClusters, setExpandedClusters] = useState<Record<string, boolean>>({
    executives: true,
    tech: true,
    structure: true,
    opportunities: true,
    events: true,
    ai: true
  });

  // Canvas Transform State (Zoom & Pan)
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging individual node
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Helper for Node styling & Icons
  const getNodeTypeConfig = (type: NodeType) => {
    switch (type) {
      case 'strategic_account':
        return { icon: Star, color: 'from-amber-500 to-yellow-400', stroke: '#f59e0b', bg: 'bg-amber-500/20', text: 'text-amber-300', label: 'Strategic Account' };
      case 'company':
        return { icon: Building2, color: 'from-cyan-500 to-blue-600', stroke: '#06b6d4', bg: 'bg-cyan-500/20', text: 'text-cyan-300', label: 'Company' };
      case 'parent_company':
        return { icon: Building, color: 'from-blue-600 to-indigo-700', stroke: '#3b82f6', bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Parent Company' };
      case 'subsidiary':
        return { icon: GitFork, color: 'from-teal-500 to-emerald-600', stroke: '#14b8a6', bg: 'bg-teal-500/20', text: 'text-teal-300', label: 'Subsidiary' };
      case 'executive':
        return { icon: User, color: 'from-purple-500 to-indigo-600', stroke: '#a855f7', bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'Executive' };
      case 'partner':
        return { icon: Handshake, color: 'from-emerald-500 to-teal-600', stroke: '#10b981', bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Strategic Partner' };
      case 'tech_partner':
        return { icon: Cloud, color: 'from-sky-400 to-blue-500', stroke: '#38bdf8', bg: 'bg-sky-500/20', text: 'text-sky-300', label: 'Tech Partner' };
      case 'erp_vendor':
        return { icon: Database, color: 'from-fuchsia-500 to-pink-600', stroke: '#d946ef', bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-300', label: 'ERP Vendor' };
      case 'crm_platform':
        return { icon: BarChart3, color: 'from-violet-500 to-purple-600', stroke: '#8b5cf6', bg: 'bg-violet-500/20', text: 'text-violet-300', label: 'CRM Platform' };
      case 'opportunity':
        return { icon: Briefcase, color: 'from-emerald-400 to-green-500', stroke: '#34d399', bg: 'bg-emerald-500/20', text: 'text-emerald-300', label: 'Sales Opportunity' };
      case 'event':
        return { icon: Calendar, color: 'from-amber-400 to-orange-500', stroke: '#fbbf24', bg: 'bg-amber-500/20', text: 'text-amber-300', label: 'VIP Event' };
      case 'knowledge':
        return { icon: BookOpen, color: 'from-blue-400 to-cyan-500', stroke: '#60a5fa', bg: 'bg-blue-500/20', text: 'text-blue-300', label: 'Knowledge Source' };
      case 'ai_recommendation':
        return { icon: BrainCircuit, color: 'from-purple-400 to-pink-500', stroke: '#c084fc', bg: 'bg-purple-500/20', text: 'text-purple-300', label: 'AI Recommendation' };
      default:
        return { icon: Info, color: 'from-slate-500 to-slate-600', stroke: '#94a3b8', bg: 'bg-slate-500/20', text: 'text-slate-300', label: 'Entity' };
    }
  };

  const getStrengthConfig = (strength: RelationshipStrength) => {
    switch (strength) {
      case 'strong':
        return { stroke: '#10b981', dash: '', width: 2.8, glow: 'rgba(16, 185, 129, 0.4)', label: 'Strong Connection', colorText: 'text-emerald-400' };
      case 'medium':
        return { stroke: '#06b6d4', dash: '', width: 2.0, glow: 'rgba(6, 182, 212, 0.3)', label: 'Medium Connection', colorText: 'text-cyan-400' };
      case 'weak':
        return { stroke: '#f59e0b', dash: '5,5', width: 1.5, glow: 'rgba(245, 158, 11, 0.2)', label: 'Weak / Emerging', colorText: 'text-amber-400' };
      case 'new':
        return { stroke: '#a855f7', dash: '3,3', width: 2.2, glow: 'rgba(168, 85, 247, 0.4)', label: 'New Connection', colorText: 'text-purple-400' };
      case 'dormant':
        return { stroke: '#64748b', dash: '2,4', width: 1.2, glow: 'none', label: 'Dormant (>60 Days)', colorText: 'text-slate-400' };
    }
  };

  // Construct Data dynamically based on mode & props
  const { initialNodes, edges, aiInsights } = useMemo(() => {
    const rawNodes: GraphNode[] = [];
    const rawEdges: GraphEdge[] = [];
    const rawAiInsights: GraphAIInsight[] = [];

    const centerCompany = focusCompanyName || 'BDO Unibank';
    const targetExecId = currentExecId || focusExecutiveId || executives[0]?.id;

    if ((mode === 'executive' || currentExecId) && targetExecId) {
      const exec = executives.find(e => e.id === targetExecId) || executives[0];
      const execName = exec ? exec.fullName : 'Executive';
      const execCompany = exec ? exec.company : centerCompany;

      // Executive Center Node
      rawNodes.push({
        id: 'center-exec',
        label: execName,
        type: 'executive',
        sublabel: exec?.position || 'Chief Executive Officer',
        companyName: execCompany,
        value: 'Center Decision Maker',
        healthScore: exec?.healthScore || 92,
        x: 400,
        y: 280,
        clusterId: 'center',
        meta: { execId: exec?.id, isCenter: true }
      });

      // Executive's Company (Top Center)
      rawNodes.push({
        id: 'exec-company',
        label: execCompany,
        type: 'strategic_account',
        sublabel: 'Primary Organization',
        healthScore: 94,
        x: 400,
        y: 85,
        clusterId: 'structure',
        meta: { companyName: execCompany }
      });
      rawEdges.push({
        id: 'e-exec-company',
        source: 'center-exec',
        target: 'exec-company',
        relationship: 'Works At',
        strength: 'strong',
        score: 95,
        details: `${execName} is a key C-Suite decision maker at ${execCompany}.`,
        lastInteractionDate: '2026-03-05'
      });

      // Related C-Suite Peers & Connected Decision Makers (Left Column)
      const peerExecs = executives.filter(e => e.id !== exec?.id).slice(0, 4);
      peerExecs.forEach((peer, idx) => {
        const nodeId = `peer-${peer.id}`;
        rawNodes.push({
          id: nodeId,
          label: peer.fullName,
          type: 'executive',
          sublabel: peer.position,
          companyName: peer.company,
          healthScore: peer.healthScore || 85,
          x: 130,
          y: 190 + (idx * 85),
          clusterId: 'executives',
          meta: { execId: peer.id }
        });
        rawEdges.push({
          id: `e-exec-peer-${idx}`,
          source: 'center-exec',
          target: nodeId,
          relationship: idx === 0 ? 'Reports To' : idx === 1 ? 'Decision Maker' : idx === 2 ? 'Project Sponsor' : 'Influencer',
          strength: idx === 0 ? 'strong' : idx === 1 ? 'strong' : 'medium',
          score: 90 - idx * 8,
          details: `Connected C-Suite stakeholder in ${execCompany} executive committee.`,
          lastInteractionDate: '2026-02-20'
        });
      });

      // 2nd-Level Expansion Nodes (Subsidiary, Tech Stack & Events)
      if (connectionDepth === '2nd' || connectionDepth === 'all') {
        // Subsidiary (Top Left)
        rawNodes.push({
          id: 'exec-sub-1',
          label: `${execCompany} Digital Arm`,
          type: 'subsidiary',
          sublabel: 'Fintech & Tech Subsidiary',
          x: 210,
          y: 85,
          clusterId: 'structure',
          meta: { companyName: `${execCompany} Digital` }
        });
        rawEdges.push({
          id: 'e-exec-sub-1',
          source: 'exec-company',
          target: 'exec-sub-1',
          relationship: 'Subsidiary',
          strength: 'strong',
          score: 90,
          details: `Technology subsidiary reporting to ${execCompany}.`
        });

        // ERP Technology Vendor (Bottom Center)
        rawNodes.push({
          id: 'exec-erp-1',
          label: 'SAP S/4HANA Cloud Engine',
          type: 'erp_vendor',
          sublabel: 'Core Enterprise ERP',
          x: 400,
          y: 475,
          clusterId: 'tech'
        });
        rawEdges.push({
          id: 'e-exec-erp-1',
          source: 'center-exec',
          target: 'exec-erp-1',
          relationship: 'Technology Partner',
          strength: 'strong',
          score: 92,
          details: `${execName} is executive sponsor for enterprise ERP migration.`
        });
      }

      // Opportunities (Right Column)
      rawNodes.push({
        id: 'exec-opp-1',
        label: '$450,000 ERP Cloud Modernization',
        type: 'opportunity',
        sublabel: 'Proposal Transmitted',
        value: '$450,000',
        x: 670,
        y: 210,
        clusterId: 'opportunities'
      });
      rawEdges.push({
        id: 'e-exec-opp-1',
        source: 'center-exec',
        target: 'exec-opp-1',
        relationship: 'Sales Owner',
        strength: 'strong',
        score: 92,
        details: `${execName} serves as the Executive Sponsor for this deal.`,
        lastInteractionDate: '2026-03-01'
      });

      rawNodes.push({
        id: 'exec-opp-2',
        label: '$320,000 AI Agent Deployment',
        type: 'opportunity',
        sublabel: 'Technical Review Stage',
        value: '$320,000',
        x: 670,
        y: 330,
        clusterId: 'opportunities'
      });
      rawEdges.push({
        id: 'e-exec-opp-2',
        source: 'center-exec',
        target: 'exec-opp-2',
        relationship: 'Sales Owner',
        strength: 'medium',
        score: 86,
        details: 'Executive sponsor for C-Suite GenAI assistant project.'
      });

      // Events (Top Left Peripheral)
      rawNodes.push({
        id: 'exec-event-1',
        label: 'ASEAN C-Suite Summit 2026',
        type: 'event',
        sublabel: 'VIP Keynote',
        x: 75,
        y: 85,
        clusterId: 'events'
      });
      rawEdges.push({
        id: 'e-exec-event-1',
        source: 'center-exec',
        target: 'exec-event-1',
        relationship: 'Attended Event',
        strength: 'strong',
        score: 96,
        details: `Confirmed attendee and panelist for upcoming Manila Summit.`,
        lastInteractionDate: '2026-02-15'
      });

      // AI Recommendation (Top Right Peripheral)
      rawNodes.push({
        id: 'exec-ai-1',
        label: 'Schedule One-on-One ERP Briefing',
        type: 'ai_recommendation',
        sublabel: 'High Conversion Probability (95%)',
        x: 620,
        y: 85,
        clusterId: 'ai'
      });
      rawEdges.push({
        id: 'e-exec-ai-1',
        source: 'center-exec',
        target: 'exec-ai-1',
        relationship: 'Knowledge Source',
        strength: 'new',
        score: 95,
        details: 'Generated based on positive reaction to annual report cloud strategy.',
        lastInteractionDate: '2026-03-12'
      });

      rawAiInsights.push({
        id: 'INS-EXEC-1',
        title: 'Executive Champion Engagement Path',
        type: 'High-Value Exec',
        targetNodeId: 'center-exec',
        confidenceScore: 95,
        impactValue: '+$450,000 Opportunity Value',
        explanationWhy: `Interaction history shows high responsiveness to C-Suite technical briefings and strong alignment with ${execCompany}'s 2026 cloud migration roadmap.`,
        evidenceTrigger: '3 interactions in past 30 days, 94% profile completeness, decision maker status.',
        recommendedNextStep: 'Schedule 1-on-1 Executive Briefing on Zero-Downtime ERP Migration.'
      });

    } else {
      // COMPANY MODE or GLOBAL MODE
      // Center Company Node
      rawNodes.push({
        id: 'center-company',
        label: centerCompany,
        type: 'strategic_account',
        sublabel: 'Enterprise Strategic Account',
        companyName: centerCompany,
        value: companyInfo?.annualRevenue || '₱150B+ Revenue',
        healthScore: 94,
        x: 400,
        y: 280,
        clusterId: 'center'
      });

      // 1. CORPORATE STRUCTURE CLUSTER (Top Row)
      const sub1Name = companyInfo?.keySubsidiaries?.[0] || `${centerCompany} Digital Arm`;
      const sub2Name = companyInfo?.keySubsidiaries?.[1] || `${centerCompany} Capital & Wealth`;

      rawNodes.push({
        id: 'node-parent',
        label: `${centerCompany} Group`,
        type: 'parent_company',
        sublabel: 'Parent Holding Consortium',
        x: 400,
        y: 85,
        clusterId: 'structure'
      });
      rawEdges.push({
        id: 'e-parent',
        source: 'center-company',
        target: 'node-parent',
        relationship: 'Parent Company',
        strength: 'strong',
        score: 100,
        details: 'Controlling Parent Corporation.',
        lastInteractionDate: '2026-01-15'
      });

      rawNodes.push({
        id: 'node-sub-1',
        label: sub1Name,
        type: 'subsidiary',
        sublabel: 'Operating Division / Subsidiary',
        x: 210,
        y: 85,
        clusterId: 'structure'
      });
      rawEdges.push({
        id: 'e-sub-1',
        source: 'center-company',
        target: 'node-sub-1',
        relationship: 'Subsidiary',
        strength: 'strong',
        score: 90,
        details: 'Key operating subsidiary.',
        lastInteractionDate: '2026-02-10'
      });

      rawNodes.push({
        id: 'node-sub-2',
        label: sub2Name,
        type: 'subsidiary',
        sublabel: 'Strategic Division',
        x: 590,
        y: 85,
        clusterId: 'structure'
      });
      rawEdges.push({
        id: 'e-sub-2',
        source: 'center-company',
        target: 'node-sub-2',
        relationship: 'Subsidiary',
        strength: 'medium',
        score: 75,
        details: 'Strategic business unit arm.',
        lastInteractionDate: '2026-01-28'
      });

      // 2. EXECUTIVES CLUSTER (Left Column - Real Roster for focused company)
      const companyExecs = executives.filter(e =>
        (focusCompanyId && e.companyId === focusCompanyId) ||
        (e.company && e.company.toLowerCase() === centerCompany.toLowerCase())
      );
      const displayExecs = companyExecs.length > 0 ? companyExecs.slice(0, 4) : executives.slice(0, 4);

      displayExecs.forEach((exec, idx) => {
        const nodeId = `exec-node-${idx}`;
        const execPositionsY = [190, 285, 380, 475];
        const execStrengths: RelationshipStrength[] = ['strong', 'strong', 'medium', 'weak'];

        rawNodes.push({
          id: nodeId,
          label: exec.fullName,
          type: 'executive',
          sublabel: exec.position,
          companyName: exec.company,
          healthScore: exec.healthScore || (95 - idx * 7),
          x: 130,
          y: execPositionsY[idx] || (190 + idx * 85),
          clusterId: 'executives',
          meta: { execId: exec.id }
        });

        rawEdges.push({
          id: `e-exec-${idx}`,
          source: 'center-company',
          target: nodeId,
          relationship: 'Works At',
          strength: execStrengths[idx] || 'medium',
          score: exec.healthScore || (90 - idx * 5),
          details: `${exec.position} at ${exec.company}.`,
          lastInteractionDate: '2026-03-02'
        });

        if (idx === 1 && displayExecs.length > 1) {
          rawEdges.push({
            id: `e-reports-1`,
            source: nodeId,
            target: `exec-node-0`,
            relationship: 'Reports To',
            strength: 'strong',
            score: 95,
            details: `${exec.fullName} reports to ${displayExecs[0].fullName} (${displayExecs[0].position}).`
          });
        }
      });

      // 3. TECH STACK & ALLIANCES CLUSTER (Bottom Row - Real tech stack if present)
      const tech1Name = companyInfo?.techStack?.[0] || 'SAP S/4HANA Enterprise';
      const tech2Name = companyInfo?.techStack?.[1] || 'AWS Cloud Infrastructure';

      rawNodes.push({
        id: 'node-sap',
        label: tech1Name,
        type: 'erp_vendor',
        sublabel: 'Core Technology Stack',
        x: 400,
        y: 475,
        clusterId: 'tech'
      });
      rawEdges.push({
        id: 'e-sap',
        source: 'center-company',
        target: 'node-sap',
        relationship: 'Technology Partner',
        strength: 'strong',
        score: 94,
        details: 'Active core enterprise technology deployment.',
        lastInteractionDate: '2026-02-18'
      });

      rawNodes.push({
        id: 'node-aws',
        label: tech2Name,
        type: 'tech_partner',
        sublabel: 'Cloud Infrastructure Landing Zone',
        x: 250,
        y: 520,
        clusterId: 'tech'
      });
      rawEdges.push({
        id: 'e-aws',
        source: 'center-company',
        target: 'node-aws',
        relationship: 'Technology Partner',
        strength: 'strong',
        score: 90,
        details: 'Primary cloud hosting environment.',
        lastInteractionDate: '2026-02-01'
      });

      rawNodes.push({
        id: 'node-delca',
        label: 'DELCA EIRMS Platform',
        type: 'crm_platform',
        sublabel: 'C-Suite Relationship Intelligence',
        x: 550,
        y: 520,
        clusterId: 'tech'
      });
      rawEdges.push({
        id: 'e-delca',
        source: 'center-company',
        target: 'node-delca',
        relationship: 'Existing Client',
        strength: 'strong',
        score: 98,
        details: 'Deployed across C-Suite leadership team with 99.9% uptime.',
        lastInteractionDate: '2026-03-10'
      });

      // 4. SALES OPPORTUNITIES CLUSTER (Right Column - Real opportunities for company execs)
      const companyOpps = displayExecs.flatMap(e => e.opportunities || []);
      const opp1 = companyOpps[0] || { title: 'Enterprise ERP & Cloud Modernization', amount: 450000, formattedValue: '₱25,000,000', stage: 'Contract Review' };
      const opp2 = companyOpps[1] || { title: 'GenAI Executive Assistant & Intelligence', amount: 310000, formattedValue: '₱18,000,000', stage: 'Proposal Sent' };

      const formatVal = (opp: any) => {
        if (!opp) return '₱15,000,000';
        if (opp.formattedValue) return opp.formattedValue;
        if (opp.amount) return `₱${opp.amount.toLocaleString()}`;
        if (opp.value) return `₱${opp.value.toLocaleString()}`;
        return '₱15,000,000';
      };

      rawNodes.push({
        id: 'node-opp-1',
        label: opp1.title,
        type: 'opportunity',
        sublabel: `${opp1.stage} Stage`,
        value: formatVal(opp1),
        x: 670,
        y: 190,
        clusterId: 'opportunities'
      });
      rawEdges.push({
        id: 'e-opp-1',
        source: 'center-company',
        target: 'node-opp-1',
        relationship: 'Business Opportunity',
        strength: 'strong',
        score: 92,
        details: `Active high-priority deal for ${centerCompany}.`,
        lastInteractionDate: '2026-03-01'
      });

      rawNodes.push({
        id: 'node-opp-2',
        label: opp2.title,
        type: 'opportunity',
        sublabel: `${opp2.stage} Stage`,
        value: formatVal(opp2),
        x: 670,
        y: 300,
        clusterId: 'opportunities'
      });
      rawEdges.push({
        id: 'e-opp-2',
        source: 'center-company',
        target: 'node-opp-2',
        relationship: 'Business Opportunity',
        strength: 'medium',
        score: 85,
        details: `C-Suite technology expansion opportunity.`,
        lastInteractionDate: '2026-02-22'
      });

      // 5. VIP EVENTS CLUSTER (Top Left Peripheral)
      const matchedEvent = events[0] || { name: 'Asia-Pacific Cloud ERP & Financial Summit 2026', location: 'Manila' };
      rawNodes.push({
        id: 'node-event-1',
        label: matchedEvent.name,
        type: 'event',
        sublabel: 'VIP Keynote Conference',
        x: 75,
        y: 85,
        clusterId: 'events'
      });
      rawEdges.push({
        id: 'e-event-1',
        source: 'center-company',
        target: 'node-event-1',
        relationship: 'Attended Event',
        strength: 'strong',
        score: 96,
        details: `${displayExecs[0]?.fullName || 'Executive Leadership'} confirmed for upcoming summit.`,
        lastInteractionDate: '2026-02-15'
      });

      // 6. AI RECOMMENDATION NODE (Top Right & Bottom Right Peripherals)
      rawNodes.push({
        id: 'node-ai-rec-1',
        label: 'Deliver BSP Data Compliance Dossier',
        type: 'ai_recommendation',
        sublabel: 'High Impact Opportunity Trigger',
        x: 670,
        y: 410,
        clusterId: 'ai'
      });
      rawEdges.push({
        id: 'e-ai-rec-1',
        source: 'center-company',
        target: 'node-ai-rec-1',
        relationship: 'Knowledge Source',
        strength: 'new',
        score: 95,
        details: 'Recommended based on upcoming digital banking regulatory compliance mandates.',
        lastInteractionDate: '2026-03-12'
      });

      // AI Insights
      const topLeadExec = displayExecs[0];
      const secondLeadExec = displayExecs[1] || displayExecs[0];

      rawAiInsights.push(
        {
          id: 'INS-COMP-1',
          title: `Accelerate Cloud Migration Deal (${formatVal(opp1)})`,
          type: 'High-Value Exec',
          targetNodeId: 'node-opp-1',
          confidenceScore: 95,
          impactValue: `+${formatVal(opp1)} Potential`,
          explanationWhy: `Detection of SEC filing cloud budget allocation and recent C-Suite appointment at ${centerCompany}.`,
          evidenceTrigger: `${tech1Name} node linked to active deal sponsored by ${topLeadExec?.fullName || 'Executive Leadership'}.`,
          recommendedNextStep: `Schedule technical architecture review with ${topLeadExec?.fullName} (${topLeadExec?.position}).`
        },
        {
          id: 'INS-COMP-2',
          title: `Executive Stakeholder Engagement: ${secondLeadExec?.position}`,
          type: 'Relationship Gap',
          targetNodeId: 'exec-node-1',
          confidenceScore: 88,
          impactValue: 'Mitigates Procurement Bottleneck',
          explanationWhy: `${secondLeadExec?.fullName} (${secondLeadExec?.position}) influences technology sign-off at ${centerCompany}.`,
          evidenceTrigger: `Relationship edge active with ${secondLeadExec?.fullName}.`,
          recommendedNextStep: `Issue VIP invitation to ${matchedEvent.name}.`
        },
        {
          id: 'INS-COMP-3',
          title: `Cross-Sell: ${sub1Name} Subsidiary Expansion`,
          type: 'Cross-Sell Opportunity',
          targetNodeId: 'node-sub-1',
          confidenceScore: 92,
          impactValue: 'Expansion Potential',
          explanationWhy: `${sub1Name} operates under ${centerCompany} group with dedicated infrastructure.`,
          evidenceTrigger: 'Subsidiary node has strong parent link.',
          recommendedNextStep: `Request warm introduction via ${topLeadExec?.fullName}.`
        }
      );
    }

    return { initialNodes: rawNodes, edges: rawEdges, aiInsights: rawAiInsights };
  }, [mode, focusCompanyId, focusCompanyName, focusExecutiveId, currentExecId, executives, events, opportunities, companyInfo]);

  const nodeIdsKey = useMemo(() => initialNodes.map(n => n.id).join(','), [initialNodes]);

  // Sync node positions based on selected layoutStyle
  useEffect(() => {
    const posMap: Record<string, { x: number; y: number }> = {};
    const centerNode = initialNodes.find(n => n.clusterId === 'center' || n.meta?.isCenter) || initialNodes[0];
    const nonCenterNodes = initialNodes.filter(n => n.id !== centerNode?.id);

    if (layoutStyle === 'orbit') {
      if (centerNode) posMap[centerNode.id] = { x: 400, y: 280 };
      const total = nonCenterNodes.length || 1;
      nonCenterNodes.forEach((node, i) => {
        const radius = ['executives', 'structure'].includes(node.clusterId || '') ? 180 : 270;
        const angle = (2 * Math.PI * i) / total - Math.PI / 2;
        posMap[node.id] = {
          x: Math.round(400 + Math.cos(angle) * radius),
          y: Math.round(280 + Math.sin(angle) * radius)
        };
      });
    } else if (layoutStyle === 'flow') {
      if (centerNode) posMap[centerNode.id] = { x: 400, y: 280 };
      const groupCounts: Record<string, number> = {};
      nonCenterNodes.forEach(node => {
        const cid = node.clusterId || 'other';
        groupCounts[cid] = (groupCounts[cid] || 0) + 1;
        const idx = groupCounts[cid] - 1;

        if (cid === 'structure') {
          posMap[node.id] = { x: 100, y: 100 + idx * 110 };
        } else if (cid === 'executives') {
          posMap[node.id] = { x: 250, y: 100 + idx * 100 };
        } else if (cid === 'tech') {
          posMap[node.id] = { x: 550, y: 100 + idx * 110 };
        } else if (cid === 'opportunities') {
          posMap[node.id] = { x: 690, y: 120 + idx * 120 };
        } else {
          posMap[node.id] = { x: idx % 2 === 0 ? 100 : 690, y: 480 };
        }
      });
    } else {
      // Default: 'sectors' layout
      initialNodes.forEach(node => {
        posMap[node.id] = { x: node.x, y: node.y };
      });
    }

    setNodePositions(prev => {
      const keys = Object.keys(posMap);
      let changed = keys.length !== Object.keys(prev).length;
      if (!changed) {
        for (const k of keys) {
          if (!prev[k] || prev[k].x !== posMap[k].x || prev[k].y !== posMap[k].y) {
            changed = true;
            break;
          }
        }
      }
      return changed ? posMap : prev;
    });
  }, [nodeIdsKey, layoutStyle]);

  // Combined Nodes with dynamic positions
  const nodes = useMemo(() => {
    return initialNodes.map(node => ({
      ...node,
      x: nodePositions[node.id]?.x ?? node.x,
      y: nodePositions[node.id]?.y ?? node.y
    }));
  }, [initialNodes, nodePositions]);

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchLabel = node.label.toLowerCase().includes(term);
        const matchSub = (node.sublabel || '').toLowerCase().includes(term);
        const matchComp = (node.companyName || '').toLowerCase().includes(term);
        if (!matchLabel && !matchSub && !matchComp) return false;
      }

      // Type filter
      if (selectedNodeTypeFilter !== 'all') {
        if (selectedNodeTypeFilter === 'executives' && node.type !== 'executive') return false;
        if (selectedNodeTypeFilter === 'companies' && !['company', 'strategic_account', 'parent_company', 'subsidiary'].includes(node.type)) return false;
        if (selectedNodeTypeFilter === 'tech' && !['tech_partner', 'erp_vendor', 'crm_platform'].includes(node.type)) return false;
        if (selectedNodeTypeFilter === 'opportunities' && node.type !== 'opportunity') return false;
        if (selectedNodeTypeFilter === 'events' && node.type !== 'event') return false;
        if (selectedNodeTypeFilter === 'ai' && node.type !== 'ai_recommendation') return false;
      }

      // Cluster expansion check
      if (node.clusterId && node.clusterId !== 'center' && expandedClusters[node.clusterId] === false) {
        return false;
      }

      return true;
    });
  }, [nodes, searchTerm, selectedNodeTypeFilter, expandedClusters]);

  // Filtered Edges
  const filteredEdges = useMemo(() => {
    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    return edges.filter(edge => {
      if (!visibleNodeIds.has(edge.source) || !visibleNodeIds.has(edge.target)) return false;

      if (selectedRelFilter !== 'all') {
        if (selectedRelFilter === 'works' && edge.relationship !== 'Works At' && edge.relationship !== 'Reports To') return false;
        if (selectedRelFilter === 'tech' && edge.relationship !== 'Technology Partner' && edge.relationship !== 'Existing Client') return false;
        if (selectedRelFilter === 'sales' && edge.relationship !== 'Business Opportunity' && edge.relationship !== 'Sales Owner') return false;
        if (selectedRelFilter === 'partners' && edge.relationship !== 'Strategic Partner' && edge.relationship !== 'Parent Company' && edge.relationship !== 'Subsidiary') return false;
      }

      return true;
    });
  }, [edges, filteredNodes, selectedRelFilter]);

  // Highlighted connected set when a node is hovered or selected
  const activeFocusId = selectedNodeId || hoveredNodeId;

  const connectedNodeIds = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const set = new Set<string>([activeFocusId]);
    filteredEdges.forEach(e => {
      if (e.source === activeFocusId) set.add(e.target);
      if (e.target === activeFocusId) set.add(e.source);
    });
    return set;
  }, [activeFocusId, filteredEdges]);

  const connectedEdgeIds = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const set = new Set<string>();
    filteredEdges.forEach(e => {
      if (e.source === activeFocusId || e.target === activeFocusId) set.add(e.id);
    });
    return set;
  }, [activeFocusId, filteredEdges]);

  // Node Click
  const handleNodeClick = (node: GraphNode) => {
    setSelectedNodeId(node.id === selectedNodeId ? null : node.id);
    if (!showBusinessPanel) {
      setShowBusinessPanel(true);
      showActionToast('Node Selected', `Opened details panel for ${node.label}.`);
    }
  };

  // Primary Focal Center Node
  const focalCenterNode = useMemo(() => {
    return nodes.find(n => n.clusterId === 'center' || n.meta?.isCenter) || nodes[0];
  }, [nodes]);

  const handleCenterOnFocalNode = () => {
    setZoom(1.0);
    if (containerRef.current && focalCenterNode) {
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 500;
      const targetPanX = Math.round((width / 2) - focalCenterNode.x);
      const targetPanY = Math.round((height / 2) - focalCenterNode.y);
      setPan({ x: targetPanX, y: targetPanY });
    } else {
      setPan({ x: 0, y: 0 });
    }
    if (focalCenterNode) {
      setSelectedNodeId(focalCenterNode.id);
    }
    showActionToast('Focal Center Locked', `Centered zoom view on primary decision entity: ${focalCenterNode?.label || 'Center Entity'}.`);
  };

  // Zoom & Pan Handlers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (draggingNodeId) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId) {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      setNodePositions(prev => ({
        ...prev,
        [draggingNodeId]: { x: Math.max(40, Math.min(860, mouseX)), y: Math.max(40, Math.min(580, mouseY)) }
      }));
      return;
    }

    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDraggingNodeId(null);
  };

  // Currently Selected Node Object for Side Panel
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Handle Execute AI Action
  const handleExecuteAIAction = (insight: GraphAIInsight) => {
    const targetNode = nodes.find(n => n.id === insight.targetNodeId);
    const targetExec = executives.find(e => e.id === targetNode?.meta?.execId || e.fullName.toLowerCase().includes(insight.title.toLowerCase().split(' ')[0]));

    if (targetExec && onScheduleMeeting && (insight.recommendedNextStep?.toLowerCase().includes('meeting') || insight.title.toLowerCase().includes('briefing') || insight.title.toLowerCase().includes('introduction'))) {
      onScheduleMeeting(targetExec);
      showActionToast('Meeting Scheduler Initialized', `Opened priority C-Suite meeting scheduler for ${targetExec.fullName} (${targetExec.position}).`);
    } else if (targetExec && onComposeEmail && (insight.recommendedNextStep?.toLowerCase().includes('email') || insight.recommendedNextStep?.toLowerCase().includes('outreach'))) {
      onComposeEmail(targetExec);
      showActionToast('Email Composer Initialized', `Drafted strategic executive outreach to ${targetExec.fullName}.`);
    } else if (targetExec && onOpenExecutiveProfile) {
      onOpenExecutiveProfile(targetExec.id);
      showActionToast('Executive Profile Opened', `Navigated to 360° workspace for ${targetExec.fullName}.`);
    } else if (onOpenCompanyProfile && focusCompanyName) {
      onOpenCompanyProfile(focusCompanyName);
      showActionToast('Company Workspace Opened', `Navigated to intelligence workspace for ${focusCompanyName}.`);
    } else {
      showActionToast('AI Action Executed', `Executed: "${insight.title}". Updated DELCA Relationship Intelligence Center.`);
    }
  };

  // Edges related to Selected Node
  const selectedNodeEdges = useMemo(() => {
    if (!selectedNodeId) return [];
    return edges.filter(e => e.source === selectedNodeId || e.target === selectedNodeId);
  }, [edges, selectedNodeId]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-slate-950 rounded-2xl border border-white/10 p-4 shadow-2xl relative overflow-hidden" style={{ minHeight: height }}>
      {/* GRAPH CANVAS AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-gradient-to-b from-slate-950 via-navy-950 to-slate-950 rounded-xl border border-white/5 overflow-hidden">
        
        {/* GRAPH TOOLBAR / SEARCH & FILTERS */}
        <div className="p-3 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 z-20 shrink-0">
          <div className="flex items-center space-x-2.5 flex-1 min-w-[220px]">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search node, executive, company, tech stack..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Node Category */}
            <select
              value={selectedNodeTypeFilter}
              onChange={e => setSelectedNodeTypeFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              <option value="all">Filter Nodes: All</option>
              <option value="executives">👤 Executives</option>
              <option value="companies">🏢 Corporate Entities</option>
              <option value="tech">☁ Tech Stack & ERP</option>
              <option value="opportunities">💼 Sales Deals</option>
              <option value="events">📅 VIP Events</option>
              <option value="ai">🧠 AI Recs</option>
            </select>

            {/* Filter by Relationship Type */}
            <select
              value={selectedRelFilter}
              onChange={e => setSelectedRelFilter(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono hidden sm:block"
            >
              <option value="all">Relationships: All</option>
              <option value="works">Works At / Reports To</option>
              <option value="tech">Tech & Cloud Partners</option>
              <option value="sales">Opportunities & Sales</option>
              <option value="partners">Corporate Alliances</option>
            </select>
          </div>

          {/* Canvas Controls */}
          <div className="flex items-center space-x-1.5">
            {/* Layout Style Picker */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setLayoutStyle('sectors')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  layoutStyle === 'sectors' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Structured 4-Quadrant Sectors Layout"
              >
                🏛 Sectors
              </button>
              <button
                onClick={() => setLayoutStyle('orbit')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  layoutStyle === 'orbit' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Radial Concentric Orbit Ring"
              >
                ⭕ Orbit
              </button>
              <button
                onClick={() => setLayoutStyle('flow')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  layoutStyle === 'flow' ? 'bg-cyan-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Value Stream Pipeline Flow"
              >
                📊 Flow
              </button>
            </div>

            {/* Focal Center HUD Badge */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-slate-950 border border-amber-500/40 px-2.5 py-1 rounded-xl text-xs font-mono shrink-0">
              <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider flex items-center space-x-1">
                <Target className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Zoom Center:</span>
              </span>
              <span className="font-bold text-white truncate max-w-[130px] sm:max-w-[180px]">
                {focalCenterNode?.label || 'Center Entity'}
              </span>
              <button
                onClick={handleCenterOnFocalNode}
                className="px-2 py-0.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-navy-950 font-black text-[10px] transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
                title="Recenter Zoom on Focal Entity"
              >
                🎯 RECENTER
              </button>
            </div>

            {/* Depth Selector */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-[10px] font-mono">
              <button
                onClick={() => setConnectionDepth('1st')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  connectionDepth === '1st' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="1st Level Direct Connections"
              >
                1st Level
              </button>
              <button
                onClick={() => setConnectionDepth('2nd')}
                className={`px-2 py-0.5 rounded-lg transition-all ${
                  connectionDepth === '2nd' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="2nd Level Extended Network"
              >
                2nd Level
              </button>
            </div>

            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 text-xs transition-colors"
              title="Reset Zoom & Pan"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setShowBusinessPanel(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer ${
                showBusinessPanel
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 hover:bg-slate-700'
                  : 'bg-cyan-500 text-navy-950 border-cyan-400 shadow-lg shadow-cyan-500/30 hover:bg-cyan-400'
              }`}
              title={showBusinessPanel ? 'Expand Graph Canvas (Hide Side Panel)' : 'Show Enterprise Insights Side Panel'}
            >
              {showBusinessPanel ? <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> : <BarChart3 className="w-3.5 h-3.5 text-navy-950" />}
              <span>{showBusinessPanel ? 'Expand Graph ↗' : 'Show Panel'}</span>
            </button>
          </div>
        </div>

        {/* CLUSTER TOGGLE BAR */}
        <div className="px-3 py-2 bg-slate-950/80 border-b border-white/5 flex items-center space-x-2 overflow-x-auto text-[10px] font-mono custom-scrollbar z-20 shrink-0">
          <span className="text-slate-400 uppercase font-bold mr-1 shrink-0">Clusters:</span>
          {[
            { id: 'structure', label: '🏛 Structure' },
            { id: 'executives', label: '👤 Executives' },
            { id: 'tech', label: '☁ Tech Stack' },
            { id: 'opportunities', label: '💼 Opportunities' },
            { id: 'events', label: '📅 VIP Events' },
            { id: 'ai', label: '🧠 AI Recs' }
          ].map(c => {
            const isExp = expandedClusters[c.id] !== false;
            return (
              <button
                key={c.id}
                onClick={() => setExpandedClusters(prev => ({ ...prev, [c.id]: !isExp }))}
                className={`px-2 py-0.5 rounded-md font-bold transition-all border shrink-0 ${
                  isExp ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-slate-900 text-slate-500 border-white/5'
                }`}
              >
                {c.label} {isExp ? '✓' : '✗'}
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE GRAPH CANVAS */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex-1 w-full relative cursor-grab active:cursor-grabbing select-none overflow-hidden"
          style={{ minHeight: '480px' }}
        >
          {/* Floating Show Side Panel Overlay (When Canvas is Expanded) */}
          {!showBusinessPanel && (
            <div className="absolute top-3 right-3 z-40 pointer-events-auto">
              <button
                onClick={() => setShowBusinessPanel(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/95 hover:bg-slate-800 text-cyan-300 border border-cyan-500/50 text-xs font-mono font-bold flex items-center space-x-2 shadow-2xl shadow-cyan-500/30 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                title="Open Enterprise Insights Side Panel"
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Show Insights Panel</span>
              </button>
            </div>
          )}
          {/* Action Execution Toast Alert Banner */}
          {actionToast && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-cyan-500/50 shadow-2xl shadow-cyan-500/20 px-4 py-2.5 rounded-2xl flex items-center space-x-3 pointer-events-auto backdrop-blur-md">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-cyan-300 font-mono">
                  {actionToast.title}
                </h5>
                <p className="text-[11px] text-slate-200">{actionToast.message}</p>
              </div>
              <button onClick={() => setActionToast(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Background Grid Pattern */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG RENDERING LAYER */}
          <svg
            className="w-full h-full absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            <defs>
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* EDGE CONNECTIONS */}
            {filteredEdges.map(edge => {
              const sourceNode = filteredNodes.find(n => n.id === edge.source);
              const targetNode = filteredNodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isConnectedToActive = activeFocusId && (edge.source === activeFocusId || edge.target === activeFocusId);
              const isFaded = activeFocusId && !isConnectedToActive;

              const cfg = getStrengthConfig(edge.strength);
              const isHoveredEdge = hoveredEdgeId === edge.id;

              // Calculate midpoint for relationship label
              const midX = (sourceNode.x + targetNode.x) / 2;
              const midY = (sourceNode.y + targetNode.y) / 2;

              return (
                <g key={edge.id} className="transition-all duration-300">
                  {/* Line stroke */}
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHoveredEdge ? '#38bdf8' : cfg.stroke}
                    strokeWidth={isHoveredEdge ? cfg.width + 1.5 : cfg.width}
                    strokeDasharray={cfg.dash}
                    opacity={isFaded ? 0.15 : isConnectedToActive ? 1 : 0.65}
                  />

                  {/* Relationship Label Pill on Edge */}
                  <g
                    className="pointer-events-auto cursor-pointer"
                    onMouseEnter={() => setHoveredEdgeId(edge.id)}
                    onMouseLeave={() => setHoveredEdgeId(null)}
                  >
                    <rect
                      x={midX - 45}
                      y={midY - 9}
                      width={90}
                      height={18}
                      rx={9}
                      fill="#0f172a"
                      stroke={isHoveredEdge ? '#38bdf8' : cfg.stroke}
                      strokeWidth={1}
                      opacity={isFaded ? 0.2 : 0.9}
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fill={isHoveredEdge ? '#38bdf8' : '#e2e8f0'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      opacity={isFaded ? 0.2 : 1}
                    >
                      {edge.relationship}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* HTML NODES LAYER */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {filteredNodes.map(node => {
              const cfg = getNodeTypeConfig(node.type);
              const Icon = cfg.icon;
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isConnected = connectedNodeIds.has(node.id);
              const isFaded = activeFocusId && !isConnected;
              const isCenterNode = node.clusterId === 'center' || node.meta?.isCenter;

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setDraggingNodeId(node.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  className={`absolute pointer-events-auto cursor-pointer transition-all duration-200 select-none ${
                    isFaded ? 'opacity-20 scale-90' : 'opacity-100 scale-100'
                  }`}
                >
                  {/* Pulsing Target Ring for Focal Center Node */}
                  {isCenterNode && (
                    <div className="absolute -inset-2.5 rounded-3xl bg-gradient-to-r from-amber-500/25 via-cyan-500/35 to-amber-500/25 border-2 border-amber-400/80 animate-pulse pointer-events-none shadow-2xl shadow-amber-500/30" />
                  )}

                  <div
                    className={`relative group p-2.5 rounded-2xl flex items-center space-x-2.5 border transition-all duration-300 shadow-xl ${
                      isCenterNode
                        ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-amber-400 ring-4 ring-amber-500/30 shadow-2xl shadow-amber-500/30'
                        : isSelected
                        ? 'bg-slate-900 border-cyan-400 ring-4 ring-cyan-500/30 shadow-cyan-500/30'
                        : isHovered
                        ? 'bg-slate-900 border-white/40 ring-2 ring-white/20'
                        : isConnected
                        ? 'bg-slate-900/95 border-cyan-500/40'
                        : 'bg-slate-950/90 border-white/10'
                    }`}
                  >
                    {/* Focal Center Node Badge Pill */}
                    {isCenterNode && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-cyan-500 text-navy-950 text-[8px] font-mono font-black uppercase tracking-wider shadow-lg border border-amber-200 flex items-center space-x-1 whitespace-nowrap z-30">
                        <Target className="w-2.5 h-2.5 text-navy-950 shrink-0" />
                        <span>🎯 FOCAL CENTER</span>
                      </div>
                    )}

                    {/* Node Icon Circle */}
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center shadow-md shrink-0`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    {/* Node Label & Sublabel */}
                    <div className="min-w-0 pr-1">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider block text-slate-400">
                        {cfg.label}
                      </span>
                      <h5 className="font-bold text-xs text-white truncate max-w-[150px]">
                        {node.label}
                      </h5>
                      {node.sublabel && (
                        <span className="text-[10px] text-slate-300 font-mono truncate block max-w-[150px]">
                          {node.sublabel}
                        </span>
                      )}
                    </div>

                    {/* Value or Health Pill */}
                    {node.value && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold border border-emerald-500/30 shrink-0">
                        {node.value}
                      </span>
                    )}

                    {/* Tooltip on Hover */}
                    {isHovered && (
                      <div className="absolute left-1/2 -bottom-12 -translate-x-1/2 z-50 bg-slate-900 border border-cyan-400/50 text-white p-2 rounded-xl shadow-2xl text-[10px] font-mono whitespace-nowrap pointer-events-none">
                        <div className="font-bold text-cyan-300">{node.label}</div>
                        <div className="text-slate-300">{cfg.label} • {node.sublabel || 'Entity Node'}</div>
                        {node.healthScore && <div>Health Score: {node.healthScore}/100</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GRAPH FOOTER STATS */}
        <div className="p-3 bg-slate-900/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono z-20 shrink-0">
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Visible Nodes: <strong className="text-white">{filteredNodes.length}</strong></span>
            <span className="text-slate-400">Relationships: <strong className="text-cyan-400">{filteredEdges.length}</strong></span>
            <span className="text-slate-400 hidden sm:inline">AI Insights: <strong className="text-purple-400">{aiInsights.length}</strong></span>
          </div>

          <div className="flex items-center space-x-3 text-[10px]">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-slate-300">Strong</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-cyan-500"></span><span className="text-slate-300">Medium</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span className="text-slate-300">Weak</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span className="text-slate-300">New</span></span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE PANEL: NODE DETAILS & BUSINESS VALUE PANEL */}
      {showBusinessPanel && (
        <div className="w-full lg:w-80 bg-slate-900/95 rounded-xl border border-white/10 p-4 flex flex-col space-y-4 overflow-y-auto max-h-[620px] custom-scrollbar shrink-0">
          
          {/* PERSISTENT SIDE PANEL HEADER */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
            <span className="font-bold text-cyan-300 flex items-center space-x-1.5 uppercase text-[11px]">
              <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Insights & Details</span>
            </span>
            <button
              onClick={() => setShowBusinessPanel(false)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 text-[10px] font-mono flex items-center space-x-1 transition-all cursor-pointer active:scale-95"
              title="Expand Graph Canvas (Hide Side Panel)"
            >
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              <span>Expand Canvas ↗</span>
            </button>
          </div>
          
          {/* SECTION 1: SELECTED NODE PROFILE (IF NODE IS CLICKED) */}
          {selectedNode ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 relative">
              <button
                onClick={() => setSelectedNodeId(null)}
                className="absolute right-2 top-2 p-1 text-slate-400 hover:text-white rounded-lg bg-slate-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getNodeTypeConfig(selectedNode.type).color} flex items-center justify-center shrink-0`}>
                  {React.createElement(getNodeTypeConfig(selectedNode.type).icon, { className: "w-5 h-5 text-white" })}
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold block">
                    {getNodeTypeConfig(selectedNode.type).label} Profile
                  </span>
                  <h4 className="font-bold text-sm text-white leading-snug">{selectedNode.label}</h4>
                  {selectedNode.sublabel && <span className="text-xs text-slate-400 block">{selectedNode.sublabel}</span>}
                </div>
              </div>

              {/* Node Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase block">Connected Nodes</span>
                  <span className="font-bold text-cyan-300">{selectedNodeEdges.length} Connections</span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-white/5">
                  <span className="text-[9px] text-slate-400 uppercase block">Health / Trust Score</span>
                  <span className="font-bold text-emerald-400">{selectedNode.healthScore || 92}/100</span>
                </div>
              </div>

              {/* Relationship List for Selected Node */}
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Relationship Pathways</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                  {selectedNodeEdges.map(edge => {
                    const otherNodeId = edge.source === selectedNode.id ? edge.target : edge.source;
                    const otherNode = nodes.find(n => n.id === otherNodeId);
                    if (!otherNode) return null;

                    return (
                      <div key={edge.id} className="p-2 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-slate-200 block">{otherNode.label}</span>
                          <span className="text-[9px] text-cyan-400 font-mono">{edge.relationship} • {edge.strength.toUpperCase()}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">{edge.score || 85}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                {selectedNode.type === 'executive' && (
                  <>
                    {!selectedNode.meta?.isCenter && selectedNode.meta?.execId && (
                      <button
                        onClick={() => {
                          if (selectedNode.meta?.execId) {
                            setCurrentExecId(selectedNode.meta.execId);
                            showActionToast('Graph Recentered', `Centered interactive network around ${selectedNode.label}.`);
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 active:scale-95 text-purple-200 border border-purple-500/40 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Compass className="w-3.5 h-3.5 text-purple-300" />
                        <span>Set as Graph Center</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const execId = selectedNode.meta?.execId || focusExecutiveId || executives[0]?.id;
                        const execObj = executives.find(e => e.id === execId);
                        showActionToast('Executive 360° Profile Opened', `Opening 360° workspace for ${execObj?.fullName || selectedNode.label}.`);
                        if (execId && onOpenExecutiveProfile) {
                          onOpenExecutiveProfile(execId);
                        }
                      }}
                      className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-navy-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open 360° Executive Profile</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const execObj = executives.find(e => e.id === selectedNode.meta?.execId) || executives[0];
                          showActionToast('Email Composer Initialized', `Drafting executive email to ${execObj?.fullName || selectedNode.label}.`);
                          if (execObj && onComposeEmail) onComposeEmail(execObj);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 border border-white/10 font-medium text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all"
                      >
                        <Mail className="w-3 h-3 text-cyan-400" />
                        <span>Email</span>
                      </button>

                      <button
                        onClick={() => {
                          const execObj = executives.find(e => e.id === selectedNode.meta?.execId) || executives[0];
                          showActionToast('Meeting Scheduler Initialized', `Opening meeting scheduler for ${execObj?.fullName || selectedNode.label}.`);
                          if (execObj && onScheduleMeeting) onScheduleMeeting(execObj);
                        }}
                        className="py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 border border-white/10 font-medium text-xs flex items-center justify-center space-x-1 cursor-pointer transition-all"
                      >
                        <CalendarPlus className="w-3 h-3 text-amber-400" />
                        <span>Meeting</span>
                      </button>
                    </div>
                  </>
                )}

                {(selectedNode.type === 'company' || selectedNode.type === 'strategic_account' || selectedNode.type === 'parent_company' || selectedNode.type === 'subsidiary') && (
                  <button
                    onClick={() => {
                      showActionToast('Company Intelligence Workspace', `Opened corporate intelligence profile for ${selectedNode.label}.`);
                      if (onOpenCompanyProfile) {
                        onOpenCompanyProfile(selectedNode.label);
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-navy-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-500/20 cursor-pointer transition-all"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>View Company Intelligence</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* DEFAULT: BUSINESS VALUE PANEL & ACCOUNT HEALTH */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-1.5">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  <span>Enterprise Insights Panel</span>
                </h4>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold">
                  LIVE METRICS
                </span>
              </div>

              {/* Account Health & Relationship Coverage */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <span className="text-[9px] text-slate-400 uppercase block">Account Health</span>
                  <span className="text-base font-bold text-emerald-400">94 / 100</span>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[94%]" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 space-y-1">
                  <span className="text-[9px] text-slate-400 uppercase block">C-Suite Coverage</span>
                  <span className="text-base font-bold text-cyan-300">88% (7/8)</span>
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[88%]" />
                  </div>
                </div>
              </div>

              {/* TOP OPPORTUNITIES IN GRAPH */}
              {(() => {
                const activeCompanyExecs = executives.filter(e =>
                  (focusCompanyId && e.companyId === focusCompanyId) ||
                  (e.company && e.company.toLowerCase() === (focusCompanyName || 'BDO Unibank').toLowerCase())
                );
                const activeDisplayExecs = activeCompanyExecs.length > 0 ? activeCompanyExecs : executives;
                const activeCompanyOpps = activeDisplayExecs.flatMap(e => e.opportunities || []);

                const opp1Item: any = activeCompanyOpps[0] || { title: 'Enterprise Cloud ERP Migration', formattedValue: '₱25,000,000', amount: 450000 };
                const opp2Item: any = activeCompanyOpps[1] || { title: 'GenAI C-Suite Executive Assistant', formattedValue: '₱18,000,000', amount: 310000 };
                const gapExec = activeDisplayExecs[activeDisplayExecs.length > 1 ? 1 : 0];

                const val1 = opp1Item.formattedValue || (opp1Item.amount ? `₱${opp1Item.amount.toLocaleString()}` : opp1Item.value ? `₱${opp1Item.value.toLocaleString()}` : '₱25,000,000');
                const val2 = opp2Item.formattedValue || (opp2Item.amount ? `₱${opp2Item.amount.toLocaleString()}` : opp2Item.value ? `₱${opp2Item.value.toLocaleString()}` : '₱18,000,000');

                return (
                  <>
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block flex items-center space-x-1">
                        <Briefcase className="w-3.5 h-3.5 text-purple-400" />
                        <span>Top Connected Opportunities</span>
                      </span>

                      <div className="space-y-2">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white truncate max-w-[160px]">{opp1Item.title}</span>
                            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">{val1}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Sponsor: {activeDisplayExecs[0]?.fullName || 'Executive Sponsor'} ({activeDisplayExecs[0]?.position || 'C-Suite'})
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white truncate max-w-[160px]">{opp2Item.title}</span>
                            <span className="text-[9px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded font-bold">{val2}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            Sponsor: {activeDisplayExecs[1]?.fullName || activeDisplayExecs[0]?.fullName || 'Executive Sponsor'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* MISSING EXECUTIVE CONTACTS */}
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                      <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold font-mono">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Relationship Gap Alert</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-normal">
                        <strong>{gapExec?.fullName} ({gapExec?.position})</strong> has key decision-making influence but lower recorded engagements in past 30 days.
                      </p>
                      <button
                        onClick={() => {
                          if (gapExec && onScheduleMeeting) {
                            onScheduleMeeting(gapExec);
                            showActionToast('Meeting Scheduler Initialized', `Opened priority outreach scheduler for ${gapExec.fullName} (${gapExec.position}).`);
                          } else {
                            showActionToast('Executive Outreach Triggered', `Generated briefing dossier and notified account team.`);
                          }
                        }}
                        className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-navy-950 font-bold text-[11px] flex items-center justify-center space-x-1 mt-1 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Schedule Priority Briefing</span>
                      </button>
                    </div>
                  </>
                );
              })()}

              {/* EXPLAINABLE AI RECOMMENDATIONS */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Explainable AI Next Best Actions</span>
                </span>

                <div className="space-y-2">
                  {aiInsights.map(insight => (
                    <div key={insight.id} className="p-3 rounded-xl bg-slate-950 border border-purple-500/30 space-y-2 text-xs hover:border-purple-500/60 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-300 text-[11px]">{insight.title}</span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold shrink-0">
                          {insight.confidenceScore}% AI Confidence
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-300 space-y-1">
                        <div className="p-2 rounded bg-slate-900 border border-white/5 space-y-0.5">
                          <span className="text-[9px] font-mono text-cyan-400 uppercase font-bold block">Why Generated:</span>
                          <p className="text-slate-200 leading-normal">{insight.explanationWhy}</p>
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          Trigger: {insight.evidenceTrigger}
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[10px] border-t border-white/5">
                        <span className="text-emerald-400 font-bold font-mono">{insight.impactValue}</span>
                        <button
                          onClick={() => handleExecuteAIAction(insight)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-[10px] flex items-center space-x-1 transition-all shadow-sm shadow-cyan-500/20 active:scale-95 cursor-pointer"
                        >
                          <Zap className="w-3 h-3 text-cyan-400" />
                          <span>Execute Action →</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
