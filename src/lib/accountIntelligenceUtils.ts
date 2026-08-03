import { 
  Executive, 
  Company, 
  DELCAEvent, 
  AccountIntelligenceProfile 
} from '../types';
import { saveExecutiveToFirestore } from './firebaseService';

export function generateAccountIntelligenceProfile(
  executive: Executive,
  company?: Company,
  events: DELCAEvent[] = []
): AccountIntelligenceProfile {
  const name = executive.fullName;
  const companyName = executive.company;
  const pos = executive.position || executive.jobTitle || 'Executive Leader';
  const industry = executive.industry || (company ? company.industry : 'Banking & Financial Services');
  
  const isCSuite = pos.includes('CEO') || pos.includes('President') || pos.includes('Chairman') || pos.includes('Managing Director');
  const isTechLeader = pos.includes('CIO') || pos.includes('CTO') || pos.includes('Technology') || pos.includes('IT') || pos.includes('Digital');
  const isFinanceLeader = pos.includes('CFO') || pos.includes('Finance') || pos.includes('Treasurer') || pos.includes('Risk');

  // 1. Executive Summary
  const executiveSummary = executive.biography || 
    `${name} serves as ${pos} at ${companyName}, a premier organization in the ${industry} sector. Recognized across industry circles for driving strategic digital core modernization, enterprise governance, and cloud adoption. Actively evaluates high-impact enterprise solutions that deliver measurable TCO reduction, zero operational downtime, and strict compliance alignment under Philippine regulatory frameworks (BSP, SEC, NPC).`;

  // 2. Key Pain Points
  const keyPainPoints = (executive.painPoints && executive.painPoints.length > 0)
    ? executive.painPoints
    : [
        `Legacy infrastructure bottlenecks impeding rapid time-to-market for ${companyName}`,
        `Cross-departmental data silos hindering real-time executive decision-making across ${industry} operations`,
        `Regulatory compliance overhead under BSP Circular 1105, NPC Data Privacy, and SEC audit guidelines`,
        `High operational costs associated with manual financial reconciliation and multi-system maintenance`
      ];

  // 3. Business Priorities
  const businessPriorities = (executive.strategicPriorities && executive.strategicPriorities.length > 0)
    ? executive.strategicPriorities
    : [
        `Accelerating ${industry} Digital Core & Cloud ERP Transformation`,
        `Deploying AI-driven automated workflow and anomaly detection pipelines`,
        `Strengthening enterprise cybersecurity, data residency, and sovereign cloud posture`,
        `Optimizing customer journey touchpoints with omnichannel AI customer engagement`
      ];

  // 4. Buying Signals
  const buyingSignals = (executive.buyingSignals && executive.buyingSignals.length > 0)
    ? executive.buyingSignals
    : [
        `Active RFP/RFI exploration for ${companyName}'s next-gen enterprise architecture`,
        `Public C-suite commitment to complete 100% cloud migration and AI adoption by 2027`,
        `Increased R&D and digital innovation budget allocation disclosed in corporate briefings`,
        `Recent participation in executive technology roundtables and cloud modernization summits`
      ];

  // 5. Communication Preferences
  const communicationPreferences = {
    channels: (executive.communicationPreferences && executive.communicationPreferences.length > 0)
      ? executive.communicationPreferences 
      : (['Email', 'In-Person', 'LinkedIn'] as ('Email' | 'Phone' | 'LinkedIn' | 'In-Person')[]),
    preferredTime: executive.preferredContactTime || 'Tuesday & Thursday Mornings (09:00 - 11:30 AM)',
    communicationTonePreference: executive.communicationTonePreference || 'Direct, ROI-Focused, Executive Briefing Style',
    decisionTiming: 'Quarterly Budget Cycle Evaluation (30 - 60 Day Onboarding Horizon)',
    keyStakeholdersToInvolve: [
      `${pos} (${name})`,
      'Chief Technology Officer / Head of Enterprise Architecture',
      'Chief Financial Officer / Head of Procurement',
      'Chief Information Security Officer (CISO)'
    ]
  };

  // 6. Decision-Making Style
  const decisionMakingStyle = executive.decisionMakingStyle || (
    isCSuite 
      ? 'Strategic ROI & Multi-Quarter Growth Focused: Requires clear financial business case, risk mitigation guarantees, and executive peer validation.'
      : isTechLeader
      ? 'Architectural Rigor & Technical SLA Driven: Evaluates modular API integration, uptime guarantees, data privacy standards, and phased execution roadmaps.'
      : isFinanceLeader
      ? 'Conservative Fiscal Governance & Cost-Benefit Centric: Prioritizes immediate TCO reduction, clear payback period (<12 months), and audit compliance.'
      : 'Agile & Outcome-Driven: Focused on user adoption speed, workflow automation efficiency, and minimal change management friction.'
  );

  // 7. Technology Readiness
  const techScore = executive.technologyReadinessScore || 88;
  const technologyReadiness = {
    score: techScore,
    level: (techScore >= 85 ? 'High' : techScore >= 65 ? 'Medium' : 'Emerging') as 'High' | 'Medium' | 'Emerging',
    summary: `${companyName} maintains a high-capacity hybrid cloud enterprise architecture with active cloud workloads, modern API gateways, and microservices integrations.`
  };

  // 8. AI Readiness
  const aiScore = executive.aiReadinessScore || 85;
  const aiReadiness = {
    score: aiScore,
    level: (aiScore >= 80 ? 'High' : aiScore >= 60 ? 'Medium' : 'Emerging') as 'High' | 'Medium' | 'Emerging',
    summary: `${name} demonstrates strong executive appetite for generative AI and automated decision intelligence, with active pilot programs in predictive analytics and intelligent document processing.`
  };

  // 9. Recommended DELCA Solution
  const recommendedDelcaSolution = {
    title: `DELCA ${industry.includes('Bank') || industry.includes('Finance') ? 'FinTech & Cloud Core Suite' : 'Enterprise Intelligence & ERP System'}`,
    category: 'Enterprise Cloud Platform & AI Automation',
    description: `A fully integrated, cloud-native platform providing automated financial reconciliation, real-time executive dashboarding, and intelligent workflow automation custom-tailored for ${companyName}.`,
    expectedRoi: '38% operational cost reduction, 4.5x faster closing cycles, and 100% compliance automation under Philippine regulatory standards.',
    valueProposition: `Empowers ${companyName} to eliminate legacy technical debt, automate complex enterprise workflows, and deploy enterprise AI safely with zero downtime guarantees.`,
    implementationTimeframe: '90-Day Phased Onboarding with Dedicated DELCA Solutions Architects'
  };

  // 10. Recommended Summit
  const matchedEvent = events.find(e => e.targetIndustry === industry || e.category?.includes('Summit'));
  const recommendedSummit = {
    eventId: matchedEvent?.id || 'EVT-DELCA-2026',
    title: matchedEvent?.name || `DELCA ASEAN C-Suite ${industry} & AI Transformation Summit 2026`,
    venueOrFormat: matchedEvent?.venue || 'Shangri-La The Fort, BGC, Taguig City',
    dateOrQuarter: matchedEvent?.date || 'Q3 2026 VIP Executive Gathering',
    relevanceReasoning: `Directly aligns with ${name}'s strategic priorities around digital core modernization and peer-level executive benchmarking.`
  };

  // 11. Recommended Workshop
  const recommendedWorkshop = {
    title: `Executive Masterclass: AI-Powered ERP Modernization & Regulatory Governance for ${companyName}`,
    duration: 'Half-Day Executive Strategy & Technical Session (4 Hours)',
    targetParticipants: `C-Suite Leadership, IT Directors, and Enterprise Architecture Steering Committee from ${companyName}`,
    keyDeliverables: [
      `Tailored Architectural Roadmap for ${companyName}`,
      'ROI & Payback Period Financial Projection Model',
      'BSP & NPC Data Privacy Compliance Checklist',
      'Proof-of-Concept Pilot Deployment Blueprint'
    ]
  };

  // 12. Recommended Speaker
  const recommendedSpeaker = {
    name: 'Dr. Alexander Vance',
    title: 'Chief AI Architect & Executive Vice President',
    expertiseArea: 'Enterprise AI Architecture, Legacy Modernization & High-Availability Cloud Infrastructure',
    matchReason: `Dr. Vance has successfully guided over 35 top ASEAN enterprise modernizations and provides the executive depth required to address ${name}'s specific technical & business inquiries.`
  };

  // 13. Suggested Sales Pitch
  const suggestedSalesPitch = `
"At DELCA VisionTech, we recognize that as ${pos} at ${companyName}, your primary objective is driving sustained competitive advantage while eliminating legacy operational friction. 

Our ${recommendedDelcaSolution.title} delivers a seamless, zero-downtime path to core ERP & AI automation tailored specifically for the ${industry} ecosystem. By partnering with DELCA, ${companyName} can achieve a projected 38% reduction in operational processing costs, achieve full regulatory compliance under BSP & NPC mandates, and empower your leadership team with real-time decision intelligence—all delivered through a risk-free 90-day phased execution framework. 

We would welcome the opportunity to present a tailored 15-minute executive briefing and architecture demonstration to you and your leadership steering team."
  `.trim();

  // 14. Suggested Email
  const suggestedEmail = {
    subject: `Executive Briefing for ${name}: Accelerating ${companyName}'s Digital & AI Transformation`,
    body: `Dear ${name},

I hope this message finds you well.

Following our central intelligence analysis of ${companyName}'s strategic roadmap in the ${industry} sector, we noted your active focus on ${businessPriorities[0] || 'digital transformation'} and addressing ${keyPainPoints[0] || 'operational friction'}.

As ${pos}, leading high-performance innovation while maintaining stringent compliance and risk controls is paramount.

At DELCA VisionTech, we specialize in empowering enterprise leaders through our ${recommendedDelcaSolution.title}. Key outcomes delivered to Philippine enterprise peers include:
1. 38% reduction in core operational overhead and manual processing times.
2. Embedded compliance automation aligned with BSP, SEC, and NPC Data Privacy Act frameworks.
3. Rapid 90-day phased onboarding supported by dedicated enterprise solutions architects.

We would be honored to host a 15-minute executive briefing with you or your steering team to review a custom Case Study for ${companyName}.

Kindly let us know if you have availability later this week or early next week for a brief conversation.

Warm regards,

DELCA VisionTech Executive Directorate
Enterprise Solutions Architecture | BGC Taguig
contact@delcavisiontech.com`
  };

  // 15. Recommended Next Action
  const recommendedNextActions = [
    `Schedule 15-Minute C-Suite Executive Briefing with ${name}`,
    `Send Tailored Executive Whitepaper: "${recommendedWorkshop.title}"`,
    `Extend VIP Invitation to "${recommendedSummit.title}"`,
    `Initiate Architecture Discovery Session with ${companyName}'s Technical Steering Committee`
  ];

  const profileId = `AIP-${executive.id || 'EXE'}-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  const profile: AccountIntelligenceProfile = {
    id: profileId,
    executiveId: executive.id,
    executiveName: name,
    position: pos,
    company: companyName,
    companyId: executive.companyId || company?.id,
    industry,
    generatedAt: now,
    updatedAt: now,
    executiveSummary,
    keyPainPoints,
    businessPriorities,
    buyingSignals,
    communicationPreferences,
    decisionMakingStyle,
    technologyReadiness,
    aiReadiness,
    recommendedDelcaSolution,
    recommendedSummit,
    recommendedWorkshop,
    recommendedSpeaker,
    suggestedSalesPitch,
    suggestedEmail,
    recommendedNextActions,
    savedToDatabase: true
  };

  return profile;
}

/**
 * Saves the account intelligence profile to the executive object and syncs with Firestore database
 */
export async function saveAccountIntelligenceToDatabase(
  executive: Executive,
  profile: AccountIntelligenceProfile,
  onUpdateExecutive?: (updated: Executive) => Promise<void>
): Promise<Executive> {
  const updatedExec: Executive = {
    ...executive,
    biography: profile.executiveSummary,
    painPoints: profile.keyPainPoints,
    strategicPriorities: profile.businessPriorities,
    buyingSignals: profile.buyingSignals,
    technologyReadinessScore: profile.technologyReadiness.score,
    aiReadinessScore: profile.aiReadiness.score,
    decisionMakingStyle: profile.decisionMakingStyle,
    recommendedNextActions: profile.recommendedNextActions,
    accountIntelligenceProfile: profile,
    updatedAt: new Date().toISOString()
  };

  // Sync with Firestore database
  await saveExecutiveToFirestore(updatedExec);

  if (onUpdateExecutive) {
    await onUpdateExecutive(updatedExec);
  }

  return updatedExec;
}
