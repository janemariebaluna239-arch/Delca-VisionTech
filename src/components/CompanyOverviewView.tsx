import React, { useState } from 'react';
import DelcaLogo from './DelcaLogo';
import { 
  Building2, 
  Target, 
  Eye, 
  Award, 
  Cpu, 
  Layers, 
  Server, 
  ShieldCheck, 
  BarChart3, 
  Code, 
  Globe, 
  Users, 
  TrendingUp, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Twitter, 
  Sparkles, 
  HeartHandshake, 
  Lightbulb, 
  Zap, 
  Network, 
  Calendar, 
  Compass, 
  Check, 
  Search,
  HelpCircle,
  FileText
} from 'lucide-react';

interface CompanyOverviewViewProps {
  onNavigateTab?: (tab: string) => void;
}

export default function CompanyOverviewView({ onNavigateTab }: CompanyOverviewViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'services' | 'purpose' | 'lifecycle' | 'contact'>('overview');
  const [serviceSearch, setServiceSearch] = useState('');

  const services = [
    {
      id: 'erp',
      title: 'Enterprise Resource Planning (ERP)',
      icon: Layers,
      color: 'from-blue-500 to-indigo-600',
      description: 'Modernizing core financial operations, supply chain management, human capital, and resource planning with high-availability cloud architecture.'
    },
    {
      id: 'crm',
      title: 'Customer Relationship Management (CRM)',
      icon: Users,
      color: 'from-cyan-400 to-blue-600',
      description: 'Intelligent C-suite relationship tracking, account health scoring, and executive engagement workflows.'
    },
    {
      id: 'ai',
      title: 'Artificial Intelligence Solutions',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-600',
      description: 'Custom generative AI agents, dossier auto-synthesis, executive matching algorithms, and predictive business analytics engines.'
    },
    {
      id: 'automation',
      title: 'Business Process Automation',
      icon: Zap,
      color: 'from-emerald-400 to-teal-600',
      description: 'Streamlining cross-departmental operations, repetitive data workflows, event invitations, and automated task execution.'
    },
    {
      id: 'consulting',
      title: 'Digital Transformation Consulting',
      icon: Compass,
      color: 'from-amber-400 to-orange-500',
      description: 'End-to-end strategic technology roadmaps, legacy modernization planning, and enterprise architecture optimization.'
    },
    {
      id: 'cloud',
      title: 'Cloud Solutions',
      icon: Server,
      color: 'from-sky-400 to-blue-500',
      description: 'Multi-cloud strategy, seamless migration, automated container orchestration, and resilient disaster recovery frameworks.'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity',
      icon: ShieldCheck,
      color: 'from-red-400 to-rose-600',
      description: 'Zero-trust network architecture, RBAC access enforcement, compliance governance, threat detection, and data security.'
    },
    {
      id: 'analytics',
      title: 'Data Analytics & Business Intelligence',
      icon: BarChart3,
      color: 'from-indigo-400 to-purple-600',
      description: 'Real-time executive dashboards, commercial revenue forecasts, attrition risk scoring, and interactive data visualization.'
    },
    {
      id: 'software',
      title: 'Software Development',
      icon: Code,
      color: 'from-cyan-500 to-teal-500',
      description: 'Bespoke enterprise web and mobile applications engineered with scalable microservices and robust API integrations.'
    },
    {
      id: 'integration',
      title: 'System Integration',
      icon: Network,
      color: 'from-blue-600 to-cyan-500',
      description: 'Unifying disparate legacy systems, cloud databases, third-party APIs, and real-time enterprise event streams.'
    }
  ];

  const industries = [
    { title: 'Financial Services', icon: BarChart3, desc: 'Banking, asset management, and fintech compliance systems.' },
    { title: 'Healthcare', icon: HeartHandshake, desc: 'Healthtech platforms, HIPAA compliance, and patient data safety.' },
    { title: 'Manufacturing', icon: Building2, desc: 'Industry 4.0 automation, IoT, and supply chain optimization.' },
    { title: 'Retail & E-Commerce', icon: Globe, desc: 'Omnichannel commerce, customer retention, and inventory analytics.' },
    { title: 'Government & Public Sector', icon: ShieldCheck, desc: 'Secure public software, compliance governance, and digital services.' },
    { title: 'Education', icon: Award, desc: 'Campus management systems, student data analytics, and e-learning.' },
    { title: 'Technology & SaaS', icon: Cpu, desc: 'Cloud infrastructure scaling, microservices, and AI product design.' },
    { title: 'Professional Services', icon: Briefcase, desc: 'Legal, accounting, and advisory practice management platforms.' },
    { title: 'Construction & Real Estate', icon: Layers, desc: 'Project management, contractor logistics, and asset tracking.' },
    { title: 'Logistics & Supply Chain', icon: Network, desc: 'Fleet tracking, route optimization, and freight intelligence.' }
  ];

  const challengesSolved = [
    { title: 'Scattered Customer Information', text: 'Centralizes executive personal information, profiles, and interactions into one single source of truth.' },
    { title: 'Manual Executive Research', text: 'AI Research Agents auto-synthesize C-suite dossiers, news mentions, and career histories in seconds.' },
    { title: 'Duplicate Customer Records', text: 'Real-time database hub deduplication and unified company relationship mapping.' },
    { title: 'Weak Cross-Department Collaboration', text: 'Role-Based Workspaces allow Sales, Marketing, Events, Success, and Leadership to work in unison.' },
    { title: 'Difficulty Identifying Opportunities', text: 'AI Opportunity Radar scans market signals to detect high-intent buying indicators.' },
    { title: 'Inefficient Event Targeting', text: 'AI Event Matching automatically pairs C-level attendees with relevant summits and VIP forums.' },
    { title: 'Limited Executive Insights', text: 'C-Suite BI analytics provide real-time revenue forecasts, risk scores, and account health.' },
    { title: 'Lack of Centralized Knowledge', text: 'Enterprise Knowledge Hub captures SOWs, meeting briefs, research notes, and SOPs.' }
  ];

  const businessImpacts = [
    { metric: '10x', label: 'Faster Executive Research', desc: 'AI dossiers generated instantly instead of hours of manual search.' },
    { metric: '85%', label: 'Higher Match Precision', desc: 'AI algorithms pair the right executive with the right summit.' },
    { metric: '100%', label: 'Data Centralization', desc: 'Unifies multi-departmental touchpoints across the client lifecycle.' },
    { metric: '42%', label: 'Sales Velocity Increase', desc: 'Accelerates high-ticket C-level deal closing with real-time buying signals.' }
  ];

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(serviceSearch.toLowerCase()) || 
    s.description.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      
      {/* BRAND HERO HEADER PANEL */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-3">
              <DelcaLogo badge={true} className="h-10" />
              <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider">
                Official Enterprise Profile
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              DELCA VisionTech Inc.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              DELCA VisionTech Inc. is a technology consulting and digital transformation company that helps organizations modernize business operations through intelligent software solutions, enterprise systems, automation, cloud technologies, AI-powered applications, ERP implementation, CRM solutions, cybersecurity, and data-driven decision making.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button 
              onClick={() => setActiveSubTab('purpose')}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-display font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Why This Platform Exists</span>
            </button>
            <button 
              onClick={() => setActiveSubTab('contact')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-mono font-bold text-xs rounded-xl border border-white/15 flex items-center justify-center space-x-2 transition-all"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Corporate Contact</span>
            </button>
          </div>
        </div>

        {/* SUB NAVIGATION TAB STRIP */}
        <div className="flex items-center space-x-2 pt-6 mt-6 border-t border-white/10 overflow-x-auto">
          {[
            { id: 'overview', label: 'Company Overview & Values', icon: Building2 },
            { id: 'services', label: 'Enterprise Services (10)', icon: Layers },
            { id: 'purpose', label: 'Platform Purpose & Impact', icon: Sparkles },
            { id: 'lifecycle', label: 'Engagement Lifecycle', icon: TrendingUp },
            { id: 'contact', label: 'Corporate Contact & About', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-md' 
                    : 'bg-navy-950/40 text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-TAB 1: COMPANY OVERVIEW, MISSION, VISION, VALUES */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
          
          {/* MISSION & VISION DUAL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border-white/10 relative overflow-hidden space-y-3 group hover:border-cyan-400/40 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">Corporate Mission</span>
                  <h3 className="font-display font-extrabold text-xl text-white">To Empower & Accelerate</h3>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed pt-2">
                "To empower organizations through innovative technology solutions that improve efficiency, strengthen customer relationships, and accelerate digital transformation."
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-white/10 relative overflow-hidden space-y-3 group hover:border-blue-400/40 transition-all">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-bold block">Corporate Vision</span>
                  <h3 className="font-display font-extrabold text-xl text-white">Trusted Technology Partner</h3>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed pt-2">
                "To become a trusted technology partner recognized for delivering intelligent enterprise solutions that create measurable business value."
              </p>
            </div>
          </div>

          {/* CORE VALUES */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">Organizational Philosophy</span>
                <h3 className="font-display font-extrabold text-2xl text-white">DELCA Core Values</h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                6 Guiding Pillars
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Innovation', icon: Lightbulb, desc: 'Pioneering agentic AI solutions, enterprise automation, and forward-thinking architectures.' },
                { title: 'Integrity', icon: ShieldCheck, desc: 'Uncompromised ethical standards, zero-trust security, transparent corporate governance.' },
                { title: 'Customer Success', icon: HeartHandshake, desc: 'Relentless focus on measurable business outcomes, ROI, and long-term client value.' },
                { title: 'Collaboration', icon: Users, desc: 'Cross-functional alignment across IT, Sales, Marketing, Events, and Executive Leadership.' },
                { title: 'Excellence', icon: Award, desc: 'Highest standard of engineering craft, enterprise reliability, and operational rigor.' },
                { title: 'Continuous Improvement', icon: TrendingUp, desc: 'Iterative optimization of AI models, business workflows, and technical skillsets.' }
              ].map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-navy-950/60 border border-white/10 space-y-2 hover:border-cyan-400/40 transition-all">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-sm text-white">{val.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-1">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* INDUSTRIES SERVED */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">Industry Expertise</span>
              <h3 className="font-display font-extrabold text-2xl text-white">Sectors We Transform</h3>
              <p className="text-xs text-slate-300 mt-1">DELCA VisionTech provides specialized software architectures tailored to diverse commercial and enterprise domains</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {industries.map((ind, idx) => {
                const Icon = ind.icon;
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-navy-950/70 border border-white/10 hover:border-cyan-400/50 transition-all space-y-2">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white leading-snug">{ind.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{ind.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 2: COMPANY SERVICES */}
      {activeSubTab === 'services' && (
        <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 rounded-2xl border-white/10">
            <div>
              <h3 className="font-display font-extrabold text-xl text-white">DELCA Enterprise Services</h3>
              <p className="text-xs text-slate-300">10 core capabilities delivering end-to-end digital transformation</p>
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Search services..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full bg-navy-950 border border-white/15 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredServices.map((srv) => {
              const Icon = srv.icon;
              return (
                <div 
                  key={srv.id}
                  className="glass-panel p-5 rounded-2xl border-white/10 hover:border-cyan-400/50 transition-all duration-300 space-y-3 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${srv.color} text-navy-950 shadow-md shrink-0`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">{srv.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{srv.description}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-cyan-400">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Supported in Platform</span>
                    </span>
                    <span className="text-slate-400">Enterprise Ready</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PLATFORM PURPOSE & BUSINESS IMPACT */}
      {activeSubTab === 'purpose' && (
        <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
          
          {/* ABOUT THE PLATFORM HIGHLIGHT CARD */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-cyan-500/30 bg-gradient-to-r from-navy-950/90 via-navy-900/80 to-blue-950/90 relative overflow-hidden shadow-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <DelcaLogo badge={true} className="h-9" />
              <span className="px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 font-mono text-xs font-bold">
                Platform Architecture Purpose
              </span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              DELCA VisionTech Agentic AI Customer Intelligence Platform
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              This enterprise platform enables DELCA VisionTech to discover, understand, and engage executive decision-makers through AI-assisted research, customer intelligence, knowledge management, sales enablement, event intelligence, and leadership insights.
            </p>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              The platform centralizes organizational knowledge and supports collaboration across multiple business departments while helping transform executive data into actionable business intelligence.
            </p>
          </div>

          {/* WHY THIS PLATFORM EXISTS (CHALLENGES vs SOLUTIONS) */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">Solving Business Challenges</span>
              <h3 className="font-display font-extrabold text-2xl text-white">Why This Platform Exists</h3>
              <p className="text-xs text-slate-300 mt-1">Bridging the gap between fragmented executive data and decisive commercial action</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {challengesSolved.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-navy-950/70 border border-white/10 hover:border-cyan-400/40 transition-all space-y-1.5">
                  <div className="flex items-center space-x-2 text-cyan-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MEASURABLE BUSINESS IMPACT */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">Quantifiable Outcomes</span>
              <h3 className="font-display font-extrabold text-2xl text-white">Measurable Business Impact</h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {businessImpacts.map((imp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-navy-950/80 border border-white/10 text-center space-y-2 hover:border-cyan-400/50 transition-all">
                  <span className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 block">
                    {imp.metric}
                  </span>
                  <h4 className="font-bold text-xs sm:text-sm text-white">{imp.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{imp.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 4: COMPANY ENGAGEMENT LIFECYCLE TIMELINE */}
      {activeSubTab === 'lifecycle' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-8 animate-[fadeIn_0.2s_ease-out]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">
              Customer Lifecycle Architecture
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              End-to-End Customer Engagement Timeline
            </h3>
            <p className="text-xs text-slate-300">
              How DELCA VisionTech guides enterprise client accounts from initial discovery to long-term digital partnership
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto py-4">
            {/* Center connector line for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 -translate-x-1/2" />

            <div className="space-y-8">
              {[
                { stage: 'Stage 1', title: 'Lead Discovery', desc: 'Identify prospective C-Suite decision makers and buying signals across enterprise sectors.', icon: Search },
                { stage: 'Stage 2', title: 'Executive Research', desc: 'AI Research Engine generates comprehensive 360 dossiers, company news, and executive bios.', icon: Sparkles },
                { stage: 'Stage 3', title: 'Customer Intelligence', desc: 'Synthesize influence maps, relationship health scores, and organizational hierarchies.', icon: BarChart3 },
                { stage: 'Stage 4', title: 'Sales Engagement', desc: 'Craft personalized C-Suite value propositions, meeting briefs, and tailored SOW proposals.', icon: Briefcase },
                { stage: 'Stage 5', title: 'Event Participation', desc: 'AI Event Matching invites executives to exclusive VIP summits and digital banking forums.', icon: Calendar },
                { stage: 'Stage 6', title: 'Project Implementation', desc: 'Execute ERP, CRM, Cloud, AI, and software engineering solutions with dedicated teams.', icon: Code },
                { stage: 'Stage 7', title: 'Customer Success', desc: 'Continuous health monitoring, SLA tracking, attrition prevention, and expansion leads.', icon: HeartHandshake },
                { stage: 'Stage 8', title: 'Long-Term Relationship', desc: 'Strategic advisory partnership, annual renewals, and ongoing digital transformation.', icon: Award }
              ].map((item, idx) => {
                const Icon = item.icon;
                const isEven = idx % 2 === 0;

                return (
                  <div key={idx} className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Content Box */}
                    <div className="w-full md:w-1/2 p-2">
                      <div className="p-5 rounded-2xl bg-navy-950/80 border border-white/10 hover:border-cyan-400/50 transition-all space-y-2 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                            {item.stage}
                          </span>
                          <span className="text-slate-500 text-[10px] font-mono">Step {idx + 1} of 8</span>
                        </div>
                        <h4 className="font-display font-bold text-base text-white">{item.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Central Icon Node */}
                    <div className="my-2 md:my-0 z-10 w-10 h-10 rounded-full bg-navy-900 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-400/20 shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="hidden md:block w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CORPORATE CONTACT & ABOUT PLATFORM */}
      {activeSubTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-[fadeIn_0.2s_ease-out]">
          
          {/* CORPORATE CONTACT CARD */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
            <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
              <DelcaLogo badge={true} className="h-8" />
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">DELCA VisionTech Headquarters</h3>
                <span className="text-xs text-cyan-300 font-mono">Corporate Communications</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3.5 text-xs text-slate-200">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Business Address</span>
                  <span className="font-semibold text-white">DELCA VisionTech Headquarters</span>
                  <p className="text-slate-300 text-xs">Enterprise Technology Plaza, Suite 800</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-xs text-slate-200">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Official Mail</span>
                  <a href="mailto:contact@delca.vision" className="font-semibold text-cyan-300 hover:underline">
                    contact@delca.vision
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-xs text-slate-200">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Official Website</span>
                  <a href="https://www.delca.vision" target="_blank" rel="noreferrer" className="font-semibold text-cyan-300 hover:underline">
                    www.delca.vision
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 text-xs text-slate-200">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Enterprise Desk</span>
                  <span className="font-semibold text-white">+1 (800) 555-DELCA</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center space-x-3">
              <span className="text-xs font-mono text-slate-400">Social Channels:</span>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/10 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ABOUT PLATFORM SPECIFICATIONS */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border-white/10 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 block">System Profile</span>
              <h3 className="font-display font-extrabold text-xl text-white">About The Platform</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong className="text-white">DELCA VisionTech Agentic AI Customer Intelligence Platform</strong> is a next-generation enterprise software solution designed to bridge high-ticket C-Suite relationships with AI research automation.
              </p>

              <div className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Platform Version:</span>
                  <span className="text-cyan-300 font-bold">2.4.0 (Enterprise Build)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Architecture:</span>
                  <span className="text-slate-200">Express + Vite + React + Firebase Firestore</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">AI Intelligence:</span>
                  <span className="text-purple-300">Google Gemini GenAI Engine</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Model:</span>
                  <span className="text-emerald-300">RBAC (6 Department Roles)</span>
                </div>
              </div>

              <p className="text-slate-400 italic text-[11px] pt-2">
                "Connecting enterprise leaders with intelligent software solutions." — DELCA VisionTech
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
