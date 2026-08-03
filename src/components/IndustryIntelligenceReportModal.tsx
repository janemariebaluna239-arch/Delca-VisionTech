import React, { useState } from 'react';
import { 
  Globe, 
  Building2, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Cpu, 
  FileText, 
  Download, 
  X, 
  Search, 
  Briefcase, 
  CheckCircle2, 
  BarChart3, 
  PieChart, 
  AlertTriangle, 
  Target, 
  Compass, 
  Lock, 
  Scale, 
  Users, 
  DollarSign, 
  Zap,
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';
import { Company } from '../types';

interface IndustryIntelligenceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIndustry?: string;
  companyContext?: Company;
}

export interface IndustryReportData {
  industryName: string;
  region: string;
  marketSize: string;
  cagrForecast: string;
  forecastPeriod: string;
  digitalAdoptionRate: string;
  regulatoryRiskLevel: 'High' | 'Medium' | 'Critical';
  summary: string;
  currentTrends: { title: string; impact: string; description: string }[];
  regulations: { body: string; mandate: string; impact: string; riskLevel: string }[];
  keyCompetitors: { name: string; marketShare: string; focusArea: string; competitiveEdge: string }[];
  aiAndErpAdoption: {
    technology: string;
    adoptionRate: string;
    maturityStage: string;
    primaryUseCase: string;
  }[];
  marketGrowthAndForecasts: {
    segment: string;
    growth2026: string;
    projected2030: string;
    driver: string;
  }[];
  industryChallenges: { challenge: string; severity: string; impactArea: string; mitigationStrategy: string }[];
  businessRisks: { risk: string; probability: string; financialImpact: string; mitigationAction: string }[];
  emergingOpportunities: { opportunity: string; marketPotential: string; readinessTimeframe: string; keyRequirements: string }[];
  customerNeeds: { need: string; satisfactionGap: string; priority: string; targetSegment: string }[];
  technologicalDevelopments: { innovation: string; status: string; disrupterScore: string; description: string }[];
  delcaRecommendations: string[];
}

const INDUSTRY_DATABASE: Record<string, IndustryReportData> = {
  'Banking & Financial Services': {
    industryName: 'Banking & Financial Services',
    region: 'Southeast Asia & Global Markets',
    marketSize: '$2.8 Trillion (ASEAN Region)',
    cagrForecast: '8.4% YoY',
    forecastPeriod: '2026 - 2030',
    digitalAdoptionRate: '88.5%',
    regulatoryRiskLevel: 'Critical',
    summary: 'The Banking and Financial Services industry is undergoing rapid digital transformation, driven by open banking frameworks, generative AI customer agents, cloud-native core banking migrations, and stringent central bank cybersecurity mandates.',
    currentTrends: [
      { title: 'Open Finance & API Interoperability', impact: 'High', description: 'Central bank mandates (e.g. BSP Open Finance Framework) forcing universal banks to expose secure consent-driven APIs to third-party fintechs.' },
      { title: 'Hyper-Personalized AI Wealth Advisory', impact: 'Very High', description: 'Real-time LLM engines delivering individualized financial planning, automated credit scoring, and portfolio rebalancing.' },
      { title: 'Core Modernization to Cloud ERP & SaaS', impact: 'High', description: 'Offloading legacy mainframe ledgers onto SAP S/4HANA Cloud and microservices to reduce transaction latency and operational cost.' },
      { title: 'ESG & Sustainable Green Financing', impact: 'Medium', description: 'Regulatory requirements to integrate climate risk metrics into commercial credit underwriting and green bond issuance.' }
    ],
    regulations: [
      { body: 'Bangko Sentral ng Pilipinas (BSP)', mandate: 'Circular 1105 / Open Finance Framework', impact: 'Strict mandatory data sharing standards and API security specs.', riskLevel: 'Critical' },
      { body: 'Securities and Exchange Commission (SEC)', mandate: 'Cyber Resilience & Data Protection Guidelines', impact: 'Mandatory 24-hour incident reporting and audit reporting.', riskLevel: 'High' },
      { body: 'National Privacy Commission (NPC)', mandate: 'Data Privacy Act (DPA 2012) Compliance', impact: 'Heavy penalties for unauthorized personal financial data leaks.', riskLevel: 'High' },
      { body: 'Bank for International Settlements (BIS)', mandate: 'Basel III / IV Capital Adequacy Rules', impact: 'Higher liquidity coverage ratios and operational risk buffers.', riskLevel: 'Medium' }
    ],
    keyCompetitors: [
      { name: 'BDO Unibank', marketShare: '22.4%', focusArea: 'Universal Banking & Branch Network', competitiveEdge: 'Massive physical & digital footprint, SAP S/4HANA core.' },
      { name: 'Bank of the Philippine Islands (BPI)', marketShare: '18.1%', focusArea: 'Digital Ecosystem & Wealth', competitiveEdge: 'Early cloud migration and robust open API infrastructure.' },
      { name: 'Metrobank', marketShare: '15.6%', focusArea: 'Corporate & Commercial Lending', competitiveEdge: 'Strong corporate relationship network and investment banking.' },
      { name: 'Security Bank', marketShare: '8.2%', focusArea: 'Retail Digital Experience & SME', competitiveEdge: 'Fintech agility, AWS cloud-native analytics stack.' }
    ],
    aiAndErpAdoption: [
      { technology: 'Generative AI Virtual Assistants', adoptionRate: '74%', maturityStage: 'Production Scale', primaryUseCase: '24/7 Customer service & automated loan query processing.' },
      { technology: 'Predictive ML Fraud Detection', adoptionRate: '92%', maturityStage: 'Mature', primaryUseCase: 'Real-time transaction scoring and AML anomaly flags.' },
      { technology: 'SAP S/4HANA Financial Ledger', adoptionRate: '68%', maturityStage: 'Widespread Migration', primaryUseCase: 'Real-time multi-currency ledger & regulatory reporting.' },
      { technology: 'Agentic Credit Underwriting', adoptionRate: '45%', maturityStage: 'Early Adopter', primaryUseCase: 'Automated SME financial statement parsing & scoring.' }
    ],
    marketGrowthAndForecasts: [
      { segment: 'Digital Banking & Mobile Payments', growth2026: '14.2%', projected2030: '$450B Total Value', driver: 'Smartphone penetration & cashless merchant adoption.' },
      { segment: 'Cloud Security & Cyber Resilience', growth2026: '18.5%', projected2030: '$12B Spending', driver: 'Sophisticated ransomware & central bank compliance audits.' },
      { segment: 'Enterprise AI & Analytics Engines', growth2026: '22.1%', projected2030: '$8.5B Spending', driver: 'Demand for hyper-personalized marketing & risk models.' }
    ],
    industryChallenges: [
      { challenge: 'Legacy Core Technical Debt', severity: 'Critical', impactArea: 'IT Operations & Agility', mitigationStrategy: 'Phased microservices wrapper and gradual cloud ERP ledger migration.' },
      { challenge: 'Sophisticated AI-Driven Cyber Threats', severity: 'High', impactArea: 'InfoSec & Reputation', mitigationStrategy: 'Zero-trust architecture, automated SOC, and DELCA EIRMS deployment.' },
      { challenge: 'Cyber & Data Compliance Overhead', severity: 'Medium', impactArea: 'Legal & Risk Teams', mitigationStrategy: 'Automated compliance tracking and continuous audit logging.' }
    ],
    businessRisks: [
      { risk: 'Ransomware & Core Outage Risk', probability: 'Medium', financialImpact: '$10M+ per incident', mitigationAction: 'Immutable cloud backups & automated failover cluster.' },
      { risk: 'Fintech Disintermediation of Payments', probability: 'High', financialImpact: '5-10% fee margin loss', mitigationAction: 'Super-app digital wallet integration & open APIs.' }
    ],
    emergingOpportunities: [
      { opportunity: 'Embedded Finance for B2B Supply Chains', marketPotential: '$15B TAM', readinessTimeframe: '12 - 18 Months', keyRequirements: 'REST APIs, ERP connectivity, real-time credit engine.' },
      { opportunity: 'Instant Cross-Border Settlement via CBDC', marketPotential: '$8B TAM', readinessTimeframe: '24 Months', keyRequirements: 'Blockchain ledger, regulatory sandbox clearance.' }
    ],
    customerNeeds: [
      { need: 'Zero-Friction Instant Account Opening', satisfactionGap: '32% Dissatisfied', priority: 'High', targetSegment: 'Gen-Z & Digital Native Retail' },
      { need: 'Real-Time Executive Treasury Dashboards', satisfactionGap: '25% Dissatisfied', priority: 'Critical', targetSegment: 'CFOs & Commercial Corporate Clients' }
    ],
    technologicalDevelopments: [
      { innovation: 'Agentic AI Workflows', status: 'Accelerating', disrupterScore: '9.4/10', description: 'Autonomous AI agents handling complex multi-step loan approvals and compliance audits.' },
      { innovation: 'Quantum-Resistant Cryptography', status: 'R&D / Testing', disrupterScore: '8.8/10', description: 'Next-gen encryption standards to safeguard banking transactions against quantum decryption.' }
    ],
    delcaRecommendations: [
      'Deploy DELCA EIRMS for real-time BSP compliance & executive risk telemetry.',
      'Integrate DELCA Executive 360 Portals across C-Suite relationship directors to drive $10M+ corporate deal conversions.',
      'Leverage DELCA AI VIP Event Engines for targeted C-Level roundtable alignment.'
    ]
  },
  'Telecommunications & Media': {
    industryName: 'Telecommunications & Media',
    region: 'Southeast Asia & Global Markets',
    marketSize: '$1.4 Trillion Global TAM',
    cagrForecast: '6.2% YoY',
    forecastPeriod: '2026 - 2030',
    digitalAdoptionRate: '94.0%',
    regulatoryRiskLevel: 'High',
    summary: 'The Telecom and Media sector is transitioning from traditional connectivity providers into integrated Digital TechCos, capitalizing on 5G Standalone networks, enterprise edge computing, and AI network orchestration.',
    currentTrends: [
      { title: '5G Standalone & Enterprise Private Networks', impact: 'High', description: 'Deployment of ultra-low latency private 5G networks for smart factories, ports, and hospitals.' },
      { title: 'Telco-to-TechCo Business Transformation', impact: 'Very High', description: 'Expanding into cloud hosting, cybersecurity, IoT platforms, and fintech digital wallets.' },
      { title: 'AI-Driven Self-Healing Networks', impact: 'High', description: 'Predictive maintenance ML algorithms automatically rerouting bandwidth during peak traffic.' }
    ],
    regulations: [
      { body: 'National Telecommunications Commission (NTC)', mandate: 'Quality of Service (QoS) & SIM Registration Act', impact: 'Mandatory network uptime targets and user biometric verification.', riskLevel: 'High' },
      { body: 'Cybersecurity Bureau & DICT', mandate: 'Critical Infrastructure Security Directive', impact: 'Strict auditing of core network vendor hardware and data sovereignty.', riskLevel: 'High' }
    ],
    keyCompetitors: [
      { name: 'PLDT / Smart', marketShare: '46.2%', focusArea: 'Fixed Broadband & Enterprise Fiber', competitiveEdge: 'Largest submarine cable network & enterprise cloud data centers.' },
      { name: 'Globe Telecom', marketShare: '42.8%', focusArea: 'Mobile, Fintech (GCash) & Cloud', competitiveEdge: 'Dominant digital wallet ecosystem and AWS partnership.' },
      { name: 'DITO Telecommunity', marketShare: '11.0%', focusArea: 'Pure 5G Mobile & Retail Competition', competitiveEdge: 'Modern cloud-native network buildout with no legacy legacy debt.' }
    ],
    aiAndErpAdoption: [
      { technology: 'AI Network Traffic Optimization', adoptionRate: '82%', maturityStage: 'Production Scale', primaryUseCase: 'Dynamic spectrum allocation and outage mitigation.' },
      { technology: 'Oracle Communications / SAP S/4HANA', adoptionRate: '75%', maturityStage: 'Mature', primaryUseCase: 'Subscriber billing, revenue assurance, and asset management.' }
    ],
    marketGrowthAndForecasts: [
      { segment: 'Enterprise B2B Cloud & Edge Computing', growth2026: '19.4%', projected2030: '$120B Revenue', driver: 'Corporate cloud migration and IoT adoption.' }
    ],
    industryChallenges: [
      { challenge: 'High 5G Capex vs. Slow ARPU Monetization', severity: 'High', impactArea: 'Capital Allocation', mitigationStrategy: 'Focus on high-margin B2B enterprise private networks.' }
    ],
    businessRisks: [
      { risk: 'Fiber Cut & Natural Disaster Network Blackouts', probability: 'High', financialImpact: '₱500M+ per outage', mitigationAction: 'Redundant mesh backhauls & satellite backup.' }
    ],
    emergingOpportunities: [
      { opportunity: 'Enterprise Edge AI & IoT Services', marketPotential: '$6B Regional', readinessTimeframe: '12 Months', keyRequirements: 'Edge nodes, enterprise SLA guarantees.' }
    ],
    customerNeeds: [
      { need: 'Guaranteed Low Latency for Enterprise Operations', satisfactionGap: '28% Dissatisfied', priority: 'High', targetSegment: 'Industrial & Financial Clients' }
    ],
    technologicalDevelopments: [
      { innovation: 'Satellite Direct-to-Cellular', status: 'Pilot Tests', disrupterScore: '9.1/10', description: 'Low-Earth orbit satellite connectivity directly to standard smartphones in remote zones.' }
    ],
    delcaRecommendations: [
      'Implement DELCA Executive Intelligence dashboards for B2B enterprise sales teams.',
      'Deploy DELCA EIRMS for infrastructure risk compliance tracking.'
    ]
  },
  'Energy, Utilities & Power': {
    industryName: 'Energy, Utilities & Power Infrastructure',
    region: 'Asia-Pacific & Global',
    marketSize: '$3.5 Trillion Global',
    cagrForecast: '7.1% YoY',
    forecastPeriod: '2026 - 2030',
    digitalAdoptionRate: '72.0%',
    regulatoryRiskLevel: 'Critical',
    summary: 'Energy and Power utilities are facing the dual mandate of accelerating renewable decarbonization while hardening grid infrastructure against extreme climate events and OT/IT cyber attacks.',
    currentTrends: [
      { title: 'Renewable Energy Integration & Virtual Power Plants', impact: 'Very High', description: 'Connecting solar, wind, and battery storage into AI-orchestrated smart grids.' },
      { title: 'Smart Grid & Advanced Metering Infrastructure (AMI)', impact: 'High', description: 'Real-time two-way power telemetry and automated load shedding.' }
    ],
    regulations: [
      { body: 'Energy Regulatory Commission (ERC)', mandate: 'Performance-Based Rate Making (PBR)', impact: 'Strict service reliability metrics (SAIDI/SAIFI) linked to tariffs.', riskLevel: 'Critical' },
      { body: 'Department of Energy (DOE)', mandate: 'Renewable Portfolio Standards (RPS)', impact: 'Mandatory minimum percentage of clean energy generation.', riskLevel: 'High' }
    ],
    keyCompetitors: [
      { name: 'Meralco (Manila Electric Co.)', marketShare: '55.0% (Distribution)', focusArea: 'Power Distribution & Microgrids', competitiveEdge: 'Dominant metro distribution & enterprise solar units.' },
      { name: 'Aboitiz Power', marketShare: '21.0% (Generation)', focusArea: 'Renewables & Thermal Generation', competitiveEdge: 'Balanced generation portfolio and regional expansion.' },
      { name: 'ACEN (Ayala Energy)', marketShare: '14.0% (Renewables)', focusArea: '100% Pure Renewable Energy', competitiveEdge: 'Aggressive international solar and wind buildout.' }
    ],
    aiAndErpAdoption: [
      { technology: 'AI Predictive Asset Maintenance', adoptionRate: '64%', maturityStage: 'Scaling', primaryUseCase: 'Predicting transformer failures and vegetation intrusion.' },
      { technology: 'SAP S/4HANA Asset Performance Management', adoptionRate: '80%', maturityStage: 'Mature', primaryUseCase: 'Substation asset tracking & field workforce scheduling.' }
    ],
    marketGrowthAndForecasts: [
      { segment: 'Smart Microgrids & Battery Energy Storage (BESS)', growth2026: '24.5%', projected2030: '$85B TAM', driver: 'Grid stability demands for variable renewable power.' }
    ],
    industryChallenges: [
      { challenge: 'Grid Intermittency from Solar & Wind', severity: 'Critical', impactArea: 'Grid Stability', mitigationStrategy: 'AI load forecasting and large-scale BESS deployment.' }
    ],
    businessRisks: [
      { risk: 'Severe Typhoon Transmission Tower Collapse', probability: 'High', financialImpact: '₱2B+ per event', mitigationAction: 'Hardened monopoles & rapid response inventory.' }
    ],
    emergingOpportunities: [
      { opportunity: 'Corporate Green Energy Purchase Contracts (PPA)', marketPotential: '$4B Regional', readinessTimeframe: '6 - 12 Months', keyRequirements: 'Direct B2B metering, carbon offset verification.' }
    ],
    customerNeeds: [
      { need: 'Uninterrupted Clean Energy for Data Centers', satisfactionGap: '35% Dissatisfied', priority: 'Critical', targetSegment: 'Hyperscale Cloud Data Centers' }
    ],
    technologicalDevelopments: [
      { innovation: 'AI Smart Grid Digital Twins', status: 'Deployment Phase', disrupterScore: '9.0/10', description: '3D real-time simulation of power grid loads and thermal limits.' }
    ],
    delcaRecommendations: [
      'Deploy DELCA Executive VIP Outreach for energy sector enterprise sales.',
      'Utilize DELCA EIRMS for regulatory compliance telemetry.'
    ]
  }
};

export default function IndustryIntelligenceReportModal({
  isOpen,
  onClose,
  defaultIndustry = 'Banking & Financial Services',
  companyContext
}: IndustryIntelligenceReportModalProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    companyContext?.industry || defaultIndustry
  );
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Get report data for selected industry or fallback
  const report: IndustryReportData = INDUSTRY_DATABASE[selectedIndustry] || INDUSTRY_DATABASE['Banking & Financial Services'];

  // Handle Export Full Industry Intelligence Report
  const handleExportFullReport = () => {
    const content = `
================================================================================
COMPREHENSIVE INDUSTRY & MARKET INTELLIGENCE REPORT - 2026
Industry: ${report.industryName}
Geographic Scope: ${report.region}
Market Sizing: ${report.marketSize} | CAGR Forecast: ${report.cagrForecast} (${report.forecastPeriod})
Digital Adoption: ${report.digitalAdoptionRate} | Regulatory Risk Level: ${report.regulatoryRiskLevel}
================================================================================

1. EXECUTIVE SUMMARY & MARKET SCOPE
--------------------------------------------------------------------------------
${report.summary}

2. CURRENT INDUSTRY TRENDS
--------------------------------------------------------------------------------
${report.currentTrends.map(t => `• [${t.title}] (Impact: ${t.impact})\n  ${t.description}`).join('\n\n')}

3. REGULATORY LANDSCAPE & COMPLIANCE MANDATES
--------------------------------------------------------------------------------
${report.regulations.map(r => `• Authority: ${r.body}\n  Mandate: ${r.mandate}\n  Impact: ${r.impact} (Risk Level: ${r.riskLevel})`).join('\n\n')}

4. COMPETITIVE LANDSCAPE & KEY PLAYERS
--------------------------------------------------------------------------------
${report.keyCompetitors.map(c => `• ${c.name} (Market Share: ${c.marketShare})\n  Focus Area: ${c.focusArea}\n  Differentiator: ${c.competitiveEdge}`).join('\n\n')}

5. AI & ERP ADOPTION MATRICES
--------------------------------------------------------------------------------
${report.aiAndErpAdoption.map(a => `• Technology: ${a.technology}\n  Adoption Rate: ${a.adoptionRate} | Stage: ${a.maturityStage}\n  Primary Use Case: ${a.primaryUseCase}`).join('\n\n')}

6. MARKET GROWTH & SEGMENT FORECASTS
--------------------------------------------------------------------------------
${report.marketGrowthAndForecasts.map(m => `• Segment: ${m.segment}\n  2026 Growth: ${m.growth2026} | Projected 2030: ${m.projected2030}\n  Core Driver: ${m.driver}`).join('\n\n')}

7. INDUSTRY CHALLENGES & BUSINESS RISKS
--------------------------------------------------------------------------------
CHALLENGES:
${report.industryChallenges.map(ic => `• ${ic.challenge} (Severity: ${ic.severity})\n  Impact Area: ${ic.impactArea}\n  Mitigation: ${ic.mitigationStrategy}`).join('\n\n')}

RISKS:
${report.businessRisks.map(br => `• Risk: ${br.risk}\n  Probability: ${br.probability} | Financial Impact: ${br.financialImpact}\n  Action: ${br.mitigationAction}`).join('\n\n')}

8. EMERGING OPPORTUNITIES & CUSTOMER NEEDS
--------------------------------------------------------------------------------
OPPORTUNITIES:
${report.emergingOpportunities.map(eo => `• ${eo.opportunity} (TAM: ${eo.marketPotential})\n  Timeframe: ${eo.readinessTimeframe} | Requirements: ${eo.keyRequirements}`).join('\n\n')}

UNMET CUSTOMER NEEDS:
${report.customerNeeds.map(cn => `• Need: ${cn.need}\n  Gap: ${cn.satisfactionGap} | Priority: ${cn.priority}\n  Target: ${cn.targetSegment}`).join('\n\n')}

9. TECHNOLOGICAL DEVELOPMENTS & BREAKTHROUGHS
--------------------------------------------------------------------------------
${report.technologicalDevelopments.map(td => `• ${td.innovation} (Disrupter Score: ${td.disrupterScore})\n  Status: ${td.status}\n  Description: ${td.description}`).join('\n\n')}

10. DELCA VISIONTECH STRATEGIC RECOMMENDATIONS
--------------------------------------------------------------------------------
${report.delcaRecommendations.map(dr => `• ${dr}`).join('\n')}

================================================================================
Generated by DELCA VisionTech Enterprise C-Suite Intelligence Platform (2026)
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${report.industryName.replace(/\s+/g, '_')}_Industry_Intelligence_Report_2026.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-navy-900 border border-cyan-500/30 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Modal Bar */}
        <div className="p-5 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-widest">
                  Enterprise Market Intelligence Brief
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono font-bold">
                  VERIFIED 2026 DATA
                </span>
              </div>
              <h2 className="text-lg font-display font-black text-white flex items-center space-x-2">
                <span>{report.industryName} Industry Intelligence Report</span>
                {companyContext && (
                  <span className="text-xs text-slate-400 font-normal">
                    (Target Account Context: {companyContext.name})
                  </span>
                )}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportFullReport}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Dossier</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Industry Switcher & Search Header */}
        <div className="p-4 bg-navy-950/80 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {Object.keys(INDUSTRY_DATABASE).map(ind => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  selectedIndustry === ind
                    ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{ind}</span>
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center space-x-2 shrink-0">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Regional Scope: <strong className="text-white">{report.region}</strong></span>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">

          {/* METRIC HIGHLIGHT CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Total Market Sizing</span>
              <div className="text-base font-black text-cyan-300 font-display">{report.marketSize}</div>
              <span className="text-[10px] text-slate-400 font-mono">ASEAN & Regional TAM</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">CAGR Growth Forecast</span>
              <div className="text-base font-black text-emerald-400 font-display">{report.cagrForecast}</div>
              <span className="text-[10px] text-emerald-300 font-mono">{report.forecastPeriod}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Digital & AI Penetration</span>
              <div className="text-base font-black text-purple-300 font-display">{report.digitalAdoptionRate}</div>
              <span className="text-[10px] text-slate-400 font-mono">Enterprise Workflows</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-red-500/30 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Regulatory Burden</span>
              <div className="text-base font-black text-red-400 font-display">{report.regulatoryRiskLevel}</div>
              <span className="text-[10px] text-red-300 font-mono">Central Mandates</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">DELCA Synergy</span>
              <div className="text-base font-black text-amber-300 font-display">95.0% Fit</div>
              <span className="text-[10px] text-amber-200 font-mono">EIRMS & Executive Portals</span>
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE SUMMARY */}
          <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-2">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>1. Executive Summary & Market Scope</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {report.summary}
            </p>
          </div>

          {/* SECTION 2: CURRENT INDUSTRY TRENDS */}
          <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>2. Current Macro Industry Trends</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {report.currentTrends.map((t, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{t.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                      t.impact === 'Very High' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      Impact: {t.impact}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: REGULATIONS & COMPLIANCE MANDATES */}
          <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-red-400 font-bold flex items-center space-x-2">
              <Scale className="w-4 h-4 text-red-400" />
              <span>3. Regulatory Landscape & Compliance Directives</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {report.regulations.map((r, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-red-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-300 font-mono text-xs">{r.body}</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-200 border border-red-500/30 text-[9px] font-mono font-bold">
                      Risk: {r.riskLevel}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-white block">{r.mandate}</span>
                  <p className="text-slate-300 text-[11px]">{r.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: KEY COMPETITORS & COMPETITIVE LANDSCAPE */}
          <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-purple-400 font-bold flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>4. Competitive Landscape & Key Industry Players</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {report.keyCompetitors.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/20 space-y-1.5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-bold text-white text-sm">{c.name}</span>
                    <span className="text-purple-300 font-mono font-bold text-xs">{c.marketShare} Share</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">Primary Focus</span>
                  <p className="text-slate-300 text-[11px] font-medium">{c.focusArea}</p>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase block pt-1">Differentiator</span>
                  <p className="text-slate-300 text-[10px]">{c.competitiveEdge}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: AI & ERP ADOPTION MATRICES */}
          <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>5. AI & Modern ERP Adoption Matrices</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {report.aiAndErpAdoption.map((a, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/20 space-y-2">
                  <span className="font-bold text-cyan-300 block text-xs">{a.technology}</span>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Adoption:</span>
                    <span className="text-emerald-400 font-bold">{a.adoptionRate}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Maturity:</span>
                    <span className="text-purple-300 font-bold">{a.maturityStage}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 pt-1 border-t border-white/5">{a.primaryUseCase}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 6: MARKET GROWTH & SEGMENT FORECASTS */}
          <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>6. Market Growth Forecasts & Segment Dynamics</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {report.marketGrowthAndForecasts.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/20 space-y-1.5">
                  <span className="font-bold text-white block text-xs">{m.segment}</span>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">2026 Growth:</span>
                    <span className="text-amber-300 font-bold">{m.growth2026}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-400">2030 Outlook:</span>
                    <span className="text-emerald-400 font-bold">{m.projected2030}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 pt-1 border-t border-white/5">Driver: {m.driver}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: INDUSTRY CHALLENGES & BUSINESS RISKS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-red-500/20 space-y-3">
              <h3 className="text-xs font-mono uppercase text-red-400 font-bold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Common Industry Challenges</span>
              </h3>

              <div className="space-y-2 text-xs">
                {report.industryChallenges.map((ic, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{ic.challenge}</span>
                      <span className="text-[9px] font-mono text-red-300 bg-red-500/20 px-2 py-0.5 rounded">{ic.severity}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Mitigation: {ic.mitigationStrategy}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-amber-500/20 space-y-3">
              <h3 className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Critical Business Risks</span>
              </h3>

              <div className="space-y-2 text-xs">
                {report.businessRisks.map((br, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{br.risk}</span>
                      <span className="text-[9px] font-mono text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded">Impact: {br.financialImpact}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Action: {br.mitigationAction}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 8: EMERGING OPPORTUNITIES & UNMET CUSTOMER NEEDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/20 space-y-3">
              <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center space-x-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Emerging High-Growth Opportunities</span>
              </h3>

              <div className="space-y-2 text-xs">
                {report.emergingOpportunities.map((eo, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between font-bold text-emerald-300">
                      <span>{eo.opportunity}</span>
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">{eo.marketPotential}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Timeframe: {eo.readinessTimeframe} • Requirements: {eo.keyRequirements}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-cyan-500/20 space-y-3">
              <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold flex items-center space-x-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Unmet Customer Needs & Satisfaction Gaps</span>
              </h3>

              <div className="space-y-2 text-xs">
                {report.customerNeeds.map((cn, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{cn.need}</span>
                      <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">Gap: {cn.satisfactionGap}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Target Segment: {cn.targetSegment} • Priority: {cn.priority}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 9: TECHNOLOGICAL DEVELOPMENTS */}
          <div className="p-5 rounded-xl bg-slate-950 border border-white/10 space-y-4">
            <h3 className="text-xs font-mono uppercase text-indigo-300 font-bold flex items-center space-x-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span>9. Technological Breakthroughs & Disrupters</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {report.technologicalDevelopments.map((td, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{td.innovation}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] font-bold">
                      Disrupter Score: {td.disrupterScore}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{td.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 10: DELCA STRATEGIC RECOMMENDATIONS */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-cyan-500/40 space-y-3">
            <h3 className="text-xs font-mono uppercase text-cyan-300 font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>10. DELCA VisionTech Strategic Market Recommendations</span>
            </h3>

            <div className="space-y-2 text-xs">
              {report.delcaRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-cyan-500/20 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200 font-medium">{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-navy-950 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400 shrink-0">
          <span>DELCA VisionTech C-Suite Market Intelligence • Confidential</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
}
