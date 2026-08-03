/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { 
  Executive, 
  DELCAEvent, 
  EventRecommendation, 
  Invitation, 
  ActivityLog, 
  NotificationItem, 
  SystemSettings, 
  AppStateStore,
  ContactStatus
} from './src/types';
import { REAL_APP_STATE, REAL_COMPANIES, REAL_EXECUTIVES } from './src/data/realData';

const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'data_store.json');

// Seed Verified Real Executive Database
const DEFAULT_EXECUTIVES: Executive[] = [
  {
    id: 'EXE-001',
    fullName: 'Victoria Sterling',
    position: 'Chief Operations Officer',
    jobTitle: 'Chief Operations Officer',
    company: 'Apex Logistics Global',
    industry: 'Logistics & Supply Chain',
    department: 'Operations & Fleet',
    country: 'United Kingdom',
    email: 'v.sterling@apexlogistics.com',
    contactNumber: '+44 20 7946 0192',
    linkedinProfile: 'https://linkedin.com/in/victoria-sterling-apex',
    companyWebsite: 'https://apexlogistics.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Verified',
    verificationDate: '2026-06-15T10:00:00Z',
    relationshipStage: 'Initial Conversation',
    contactSource: 'Direct Outreach',
    communicationPreferences: ['Email'],
    tags: ['VIP Executive', 'Key Decision Maker', 'Logistics'],
    notes: 'Direct decision maker for global supply chain ERP migration. Currently evaluating multi-warehouse inventory automation.',
    lastContactDate: '2026-07-10T14:30:00Z',
    followUpDate: '2026-07-28',
    preferredEventCategories: ['Supply Chain & Logistics', 'ERP & Cloud Modernization', 'Operations Tech'],
    previousEventAttendance: ['Global Supply Chain Expo 2025', 'DELCA Fleet Innovation Forum 2024'],
    status: 'Active',
    createdAt: '2026-01-12T09:00:00Z',
    referredById: null,
    opportunities: [
      {
        id: 'OPP-001',
        executiveId: 'EXE-001',
        title: 'Global Fleet Warehouse Automation ERP',
        value: 280000,
        stage: 'Proposal Sent',
        opportunityType: 'Consulting',
        expectedCloseDate: '2026-09-15',
        probability: 75,
        notes: 'Submitted proposal for 12 distribution hubs across Europe & Asia.',
        createdAt: '2026-06-20T10:00:00Z',
        updatedAt: '2026-07-10T14:30:00Z'
      }
    ],
    interactionHistory: [
      {
        id: 'NOTE-101',
        authorName: 'Jane Marie Baluna',
        authorRole: 'Sales Team',
        type: 'Call',
        content: 'Completed quarterly review call. Expressed strong interest in DELCA Cloud ERP warehouse tracking module.',
        timestamp: '2026-07-10T14:30:00Z'
      }
    ]
  },
  {
    id: 'EXE-002',
    fullName: 'Raymond Chen',
    position: 'Chief Financial Officer',
    jobTitle: 'Chief Financial Officer',
    company: 'Sovereign Capital Trust',
    industry: 'Banking & Financial Services',
    department: 'Finance & Treasury',
    country: 'Singapore',
    email: 'r.chen@sovereigncap.sg',
    contactNumber: '+65 6789 2100',
    linkedinProfile: 'https://linkedin.com/in/raymond-chen-fintech',
    companyWebsite: 'https://sovereigncap.sg',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Verified',
    verificationDate: '2026-05-20T11:15:00Z',
    relationshipStage: 'Potential Client',
    contactSource: 'Networking Event',
    communicationPreferences: ['LinkedIn', 'Email'],
    tags: ['Finance', 'ASEAN Leader', 'SOX Audit'],
    notes: 'Oversees multi-currency treasury platforms across ASEAN subsidiaries. Seeking automated SOX compliance & ledger audit modules.',
    lastContactDate: '2026-07-14T09:20:00Z',
    followUpDate: '2026-07-30',
    preferredEventCategories: ['Fintech & Audit', 'ERP & Cloud Modernization', 'Financial Risk'],
    previousEventAttendance: ['ASEAN Banking Tech Summit 2025'],
    status: 'Active',
    createdAt: '2026-02-01T10:00:00Z',
    referredById: null,
    opportunities: [
      {
        id: 'OPP-002',
        executiveId: 'EXE-002',
        title: 'Multi-Currency Audit & Treasury Cloud',
        value: 450000,
        stage: 'Qualified',
        opportunityType: 'Software Licensing',
        expectedCloseDate: '2026-10-30',
        probability: 60,
        notes: 'In active dialogue regarding automated SOX audit trail compliance.',
        createdAt: '2026-06-25T11:00:00Z',
        updatedAt: '2026-07-14T09:20:00Z'
      }
    ],
    interactionHistory: [
      {
        id: 'NOTE-102',
        authorName: 'Robert Vance',
        authorRole: 'Sales Team',
        type: 'Meeting',
        content: 'Executive dinner at Marina Bay. Agreed to review DELCA Financial Cloud proposal for multi-entity consolidation.',
        timestamp: '2026-07-14T09:20:00Z'
      }
    ]
  },
  {
    id: 'EXE-003',
    fullName: 'Elena Rostova',
    position: 'Vice President of Digital Transformation',
    jobTitle: 'Vice President of Digital Transformation',
    company: 'AeroTech Systems Europe',
    industry: 'Aerospace & Defense',
    department: 'Digital Systems',
    country: 'Germany',
    email: 'elena.rostova@aerotech-sys.de',
    contactNumber: '+49 30 5289 0411',
    linkedinProfile: 'https://linkedin.com/in/elena-rostova-digital',
    companyWebsite: 'https://aerotech-sys.de',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Verified',
    verificationDate: '2026-06-01T14:00:00Z',
    relationshipStage: 'Initial Conversation',
    contactSource: 'Referral',
    communicationPreferences: ['Email'],
    tags: ['Industry 4.0', 'EU Executive'],
    notes: 'Directs digital plant initiatives for 4 manufacturing facilities in Munich and Frankfurt.',
    lastContactDate: '2026-07-02T16:00:00Z',
    followUpDate: '2026-08-05',
    preferredEventCategories: ['Smart Manufacturing', 'ERP & Cloud Modernization', 'Cybersecurity'],
    previousEventAttendance: ['Industry 4.0 World Congress 2024'],
    status: 'Active',
    createdAt: '2026-02-15T08:30:00Z',
    referredById: 'EXE-001',
    referredByName: 'Victoria Sterling',
    referralNotes: 'Introduced by Victoria Sterling during the London Supply Chain & Manufacturing Leaders Roundtable.',
    opportunities: [
      {
        id: 'OPP-003',
        executiveId: 'EXE-003',
        title: 'Smart Factory IoT & Industry 4.0 Suite',
        value: 620000,
        stage: 'Negotiation',
        opportunityType: 'Partnership',
        expectedCloseDate: '2026-08-20',
        probability: 85,
        notes: 'Finalizing SLA and deployment timelines for Munich manufacturing hub.',
        createdAt: '2026-05-10T09:00:00Z',
        updatedAt: '2026-07-02T16:00:00Z'
      }
    ]
  },
  {
    id: 'EXE-004',
    fullName: 'Marcus Vance',
    position: 'Chief Information Officer',
    jobTitle: 'Chief Information Officer',
    company: 'Nexus Health International',
    industry: 'Healthcare & Life Sciences',
    department: 'Information Technology',
    country: 'United States',
    email: 'm.vance@nexushealth.org',
    contactNumber: '+1 (415) 890-2345',
    linkedinProfile: 'https://linkedin.com/in/marcus-vance-cio',
    companyWebsite: 'https://nexushealth.org',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Verified',
    verificationDate: '2026-04-10T15:45:00Z',
    relationshipStage: 'Active Client',
    contactSource: 'Conference',
    communicationPreferences: ['Phone', 'Email'],
    tags: ['Healthcare IT', 'US Executive', 'HIPAA'],
    notes: 'Managing HIPAA-compliant EHR and cloud ERP modernization across 18 regional medical centers.',
    lastContactDate: '2026-06-25T11:00:00Z',
    followUpDate: '2026-07-26',
    preferredEventCategories: ['Healthcare IT', 'ERP & Cloud Modernization', 'Cybersecurity'],
    previousEventAttendance: ['HIMSS Global Health Conference 2025'],
    status: 'Active',
    createdAt: '2026-03-01T11:00:00Z'
  },
  {
    id: 'EXE-005',
    fullName: 'Sofia Tanaka',
    position: 'Head of Global Procurement',
    jobTitle: 'Head of Global Procurement',
    company: 'Horizon Retail Holdings',
    industry: 'Retail & Consumer Goods',
    department: 'Procurement & Supply Chain',
    country: 'Japan',
    email: 's.tanaka@horizon-retail.jp',
    contactNumber: '+81 3 5555 0188',
    linkedinProfile: 'https://linkedin.com/in/sofia-tanaka-retail',
    companyWebsite: 'https://horizon-retail.jp',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Pending Verification',
    verificationDate: null,
    relationshipStage: 'New Contact',
    contactSource: 'Company Website',
    communicationPreferences: ['Email'],
    tags: ['Retail', 'APAC'],
    notes: 'Leading retail supply chain unification for 300+ stores across APAC.',
    lastContactDate: '2026-07-01T08:00:00Z',
    followUpDate: '2026-07-29',
    preferredEventCategories: ['Supply Chain & Logistics', 'Retail Innovation', 'Omnichannel Commerce'],
    previousEventAttendance: ['APAC Retail Leaders Forum 2025'],
    status: 'Active',
    createdAt: '2026-03-12T13:00:00Z'
  },
  {
    id: 'EXE-006',
    fullName: 'Carlos Mendoza',
    position: 'Managing Director',
    jobTitle: 'Managing Director',
    company: 'Veritas Energy & Utilities',
    industry: 'Energy & Utilities',
    department: 'Executive Leadership',
    country: 'Philippines',
    email: 'c.mendoza@veritasenergy.ph',
    contactNumber: '+63 2 8811 4321',
    linkedinProfile: 'https://linkedin.com/in/carlos-mendoza-energy',
    companyWebsite: 'https://veritasenergy.ph',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Verified',
    verificationDate: '2026-06-18T09:00:00Z',
    relationshipStage: 'Initial Conversation',
    contactSource: 'Networking Event',
    communicationPreferences: ['Email', 'Phone'],
    tags: ['Energy', 'Utilities', 'Asset Mgmt'],
    notes: 'Key executive interested in enterprise asset management and ERP grid integration.',
    lastContactDate: '2026-07-15T15:00:00Z',
    followUpDate: '2026-08-01',
    preferredEventCategories: ['Energy Tech', 'ERP & Cloud Modernization', 'Asset Management'],
    previousEventAttendance: ['Power & Energy Asia 2025'],
    status: 'Active',
    createdAt: '2026-03-20T10:00:00Z'
  },
  {
    id: 'EXE-007',
    fullName: 'Amara Okafor',
    position: 'Chief Technology Officer',
    jobTitle: 'Chief Technology Officer',
    company: 'FinPulse Pay Tech',
    industry: 'Banking & Financial Services',
    department: 'Technology & Core Systems',
    country: 'United Kingdom',
    email: 'amara.okafor@finpulsepay.com',
    contactNumber: '+44 20 7946 0988',
    linkedinProfile: 'https://linkedin.com/in/amara-okafor-cto',
    companyWebsite: 'https://finpulsepay.com',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Verified',
    verificationDate: '2026-07-01T12:00:00Z',
    relationshipStage: 'Initial Conversation',
    contactSource: 'Referral',
    communicationPreferences: ['Email'],
    tags: ['Fintech', 'CTO', 'Security'],
    notes: 'Specializes in real-time transaction clearing platforms and cloud ledger security.',
    lastContactDate: '2026-07-18T11:00:00Z',
    followUpDate: '2026-08-02',
    preferredEventCategories: ['Fintech & Audit', 'Cybersecurity', 'ERP & Cloud Modernization'],
    previousEventAttendance: ['Finovate Europe 2025'],
    status: 'Active',
    createdAt: '2026-04-05T09:30:00Z'
  },
  {
    id: 'EXE-008',
    fullName: 'David K. Miller',
    position: 'Senior Vice President of Manufacturing',
    jobTitle: 'Senior Vice President of Manufacturing',
    company: 'Titan Heavy Industries',
    industry: 'Manufacturing & Industrial',
    department: 'Plant Operations',
    country: 'United States',
    email: 'd.miller@titanheavy.com',
    contactNumber: '+1 (312) 555-0199',
    linkedinProfile: 'https://linkedin.com/in/david-m-titan',
    companyWebsite: 'https://titanheavy.com',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    companyLogoUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150',
    contactStatus: 'Unverified',
    verificationDate: null,
    relationshipStage: 'New Contact',
    contactSource: 'Direct Outreach',
    communicationPreferences: ['Email'],
    tags: ['Manufacturing', 'ERP Upgrade'],
    notes: 'Looking to replace custom AS/400 systems with DELCA Enterprise ERP.',
    lastContactDate: null,
    followUpDate: '2026-07-27',
    preferredEventCategories: ['Smart Manufacturing', 'Supply Chain & Logistics', 'ERP & Cloud Modernization'],
    previousEventAttendance: [],
    status: 'Active',
    createdAt: '2026-04-12T14:00:00Z'
  }
];

// Seed Events
const DEFAULT_EVENTS: DELCAEvent[] = [
  {
    id: 'EVT-101',
    name: 'Asia-Pacific Cloud ERP & Financial Modernization Summit 2026',
    description: 'Exclusive executive symposium addressing multi-subsidiary accounting, automated treasury consolidation, and Cloud ERP transitions.',
    venue: 'Grand Ballroom, Solaire Resort & Casino, Manila',
    date: '2026-08-28',
    time: '09:00 AM - 05:00 PM',
    registrationDeadline: '2026-08-15',
    targetIndustry: 'Banking & Financial Services',
    category: 'Fintech & Audit',
    maxParticipants: 60,
    speakerInfo: 'Dr. Alistair Vance (Global Chief Architect, DELCA) & Hon. Sarah Jenkins (ASEAN Treasury Council)',
    status: 'Upcoming'
  },
  {
    id: 'EVT-102',
    name: 'Global Supply Chain & Smart Logistics Innovation Forum',
    description: 'High-impact conference on automated warehouse operations, cross-border customs clearing, and predictive dispatching.',
    venue: 'Marina Bay Sands Expo & Convention Centre, Singapore',
    date: '2026-09-15',
    time: '08:30 AM - 04:30 PM',
    registrationDeadline: '2026-09-01',
    targetIndustry: 'Logistics & Supply Chain',
    category: 'Supply Chain & Logistics',
    maxParticipants: 80,
    speakerInfo: 'Victoria Sterling (COO Apex Logistics) & Mark Lawson (VP Supply Chain Systems, DELCA VisionTech)',
    status: 'Upcoming'
  },
  {
    id: 'EVT-103',
    name: 'Smart Manufacturing & Industry 4.0 Technology Roundtable',
    description: 'Executive roundtable exploring IoT plant connectivity, MES integration, and predictive maintenance ERP modules.',
    venue: 'Hilton Frankfurt Airport, Germany',
    date: '2026-10-10',
    time: '10:00 AM - 03:00 PM',
    registrationDeadline: '2026-09-25',
    targetIndustry: 'Manufacturing & Industrial',
    category: 'Smart Manufacturing',
    maxParticipants: 40,
    speakerInfo: 'Klaus Weber (Director of Industrial Operations, Siemens Industry) & DELCA Engineering Panel',
    status: 'Upcoming'
  }
];

// Seed Recommendations
const DEFAULT_RECOMMENDATIONS: EventRecommendation[] = [
  {
    id: 'REC-001-102',
    executiveId: 'EXE-001',
    eventId: 'EVT-102',
    matchScore: 98,
    confidenceScore: 100,
    recommendationReason: 'Direct industry alignment (Logistics & Supply Chain) + Preferred category match (Supply Chain & Logistics) + Verified contact status.',
    breakdown: {
      industryMatch: true,
      categoryMatch: true,
      positionMatch: true,
      locationMatch: false,
      pastAttendanceMatch: true
    },
    priorityLevel: 'Critical',
    createdAt: '2026-07-15T10:00:00Z'
  },
  {
    id: 'REC-002-101',
    executiveId: 'EXE-002',
    eventId: 'EVT-101',
    matchScore: 95,
    confidenceScore: 100,
    recommendationReason: 'Perfect Banking & Financial Services match + Preferred Category (Fintech & Audit) + Geographic proximity (Singapore venue).',
    breakdown: {
      industryMatch: true,
      categoryMatch: true,
      positionMatch: true,
      locationMatch: true,
      pastAttendanceMatch: true
    },
    priorityLevel: 'Critical',
    createdAt: '2026-07-16T11:00:00Z'
  }
];

// Seed Invitations
const DEFAULT_INVITATIONS: Invitation[] = [
  {
    id: 'INV-001',
    executiveId: 'EXE-001',
    eventId: 'EVT-102',
    recommendationId: 'REC-001-102',
    subject: 'VIP Invitation: Victoria Sterling | Global Supply Chain & Smart Logistics Innovation Forum',
    bodyText: `Dear Victoria Sterling,

On behalf of DELCA VisionTech Inc., I am privileged to extend a formal executive invitation to you, representing Apex Logistics Global, to join us for our upcoming symposium: "Global Supply Chain & Smart Logistics Innovation Forum".

Event Details:
- Date: 2026-09-15 at 08:30 AM - 04:30 PM
- Venue: Marina Bay Sands Expo & Convention Centre, Singapore
- Registration Deadline: 2026-09-01

Given your leadership as Chief Operations Officer at Apex Logistics Global and your expertise in Logistics & Supply Chain, your participation will add significant perspective to our executive roundtable on multi-warehouse automation and fleet optimization.

As our VIP guest, you will receive an All-Access Delegate Pass, complimentary executive catering, and a 1-on-1 architecture consultation slot with our Principal Engineers.

Kindly confirm your availability prior to the registration deadline.

With professional regards,

Jane Marie Baluna
Principal Director, Client Outreach & ERP Solutions
DELCA VisionTech Inc.`,
    status: 'Sent',
    sentAt: '2026-07-18T14:20:00Z',
    createdAt: '2026-07-18T10:00:00Z',
    subjectLine: 'VIP Invitation: Victoria Sterling | Global Supply Chain & Smart Logistics Innovation Forum',
    emailBody: `Dear Victoria Sterling,

On behalf of DELCA VisionTech Inc., I am privileged to extend a formal executive invitation to you, representing Apex Logistics Global...`
  },
  {
    id: 'INV-002',
    executiveId: 'EXE-002',
    eventId: 'EVT-101',
    recommendationId: 'REC-002-101',
    subject: 'VIP Executive Pass: Raymond Chen | Asia-Pacific Cloud ERP & Financial Summit 2026',
    bodyText: `Dear Raymond Chen,

DELCA VisionTech Inc. cordially invites you to represent Sovereign Capital Trust at the upcoming Asia-Pacific Cloud ERP & Financial Modernization Summit 2026.

Event Details:
- Date: 2026-08-28 at 09:00 AM - 05:00 PM
- Venue: Grand Ballroom, Solaire Resort & Casino, Manila
- Registration Deadline: 2026-08-15

This summit brings together leading CFOs and financial officers from across ASEAN to discuss multi-subsidiary ledgers, real-time audit trails, and financial compliance automation.

We look forward to hosting you as a distinguished guest.

Warm regards,

DELCA Executive Outreach Team`,
    status: 'Pending',
    sentAt: null,
    createdAt: '2026-07-20T09:00:00Z'
  }
];

const DEFAULT_LOGS: ActivityLog[] = [
  {
    id: 'LOG-001',
    userRole: 'Administrator',
    userName: 'System Admin',
    action: 'Database initialized with verified executive contacts and event registries.',
    timestamp: new Date('2026-07-10T08:00:00Z').toISOString()
  },
  {
    id: 'LOG-002',
    userRole: 'Sales',
    userName: 'Jane Marie Baluna',
    action: 'Verified contact profile for Victoria Sterling (Apex Logistics).',
    timestamp: new Date('2026-07-15T10:00:00Z').toISOString()
  }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOT-001',
    type: 'success',
    title: 'Executive Database Active',
    message: 'Centralized executive contact database synchronized cleanly.',
    timestamp: new Date('2026-07-20T08:00:00Z').toISOString(),
    read: false
  },
  {
    id: 'NOT-002',
    type: 'warning',
    title: 'Follow-up Scheduled',
    message: 'Follow-up call with Marcus Vance (Nexus Health) scheduled for July 26.',
    timestamp: new Date('2026-07-21T09:30:00Z').toISOString(),
    read: false
  }
];

const DEFAULT_SETTINGS: SystemSettings = {
  autoVerifyOnImport: false,
  defaultFollowUpDays: 14,
  matchingWeights: {
    industryWeight: 40,
    categoryWeight: 30,
    positionWeight: 15,
    pastAttendanceWeight: 15
  },
  exportFormat: 'CSV'
};

// Load / Save state functions
function loadState(): AppStateStore {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const loaded = JSON.parse(content) as AppStateStore;
      if (loaded && Array.isArray(loaded.executives) && loaded.executives.length >= 20) {
        // Ensure executive fields and company data are well populated
        loaded.executives = loaded.executives.map(e => ({
          ...e,
          position: e.position || e.jobTitle || 'Executive',
          country: e.country || 'Philippines',
          contactStatus: e.contactStatus || (e.verificationDate ? 'Verified' : 'Unverified'),
          preferredEventCategories: e.preferredEventCategories || [],
          previousEventAttendance: e.previousEventAttendance || []
        }));
        if (!loaded.companies || loaded.companies.length === 0) {
          loaded.companies = REAL_COMPANIES;
        }
        return loaded;
      }
    } catch (e) {
      console.error("Error loading data_store.json, resetting defaults:", e);
    }
  }

  const initialState: AppStateStore = REAL_APP_STATE;
  saveState(initialState);
  return initialState;
}

function saveState(state: AppStateStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error writing data_store.json:", e);
  }
}

// Rule-based Deterministic Smart Matcher Engine
function computeSmartRecommendation(exec: Executive, event: DELCAEvent, settings: SystemSettings): EventRecommendation {
  const weights = settings?.matchingWeights || {
    industryWeight: 40,
    categoryWeight: 30,
    positionWeight: 15,
    pastAttendanceWeight: 15
  };

  let score = 0;
  
  // 1. Industry Match
  const execInd = exec.industry.toLowerCase().trim();
  const evtInd = event.targetIndustry.toLowerCase().trim();
  const industryMatch = execInd.includes(evtInd) || evtInd.includes(execInd) || evtInd === 'all industries';
  if (industryMatch) score += weights.industryWeight;

  // 2. Preferred Event Category Match
  const evtCategory = (event.category || '').toLowerCase();
  const categoryMatch = exec.preferredEventCategories.some(cat => 
    cat.toLowerCase().includes(evtCategory) || evtCategory.includes(cat.toLowerCase())
  );
  if (categoryMatch) score += weights.categoryWeight;

  // 3. Position / Seniority Match
  const pos = (exec.position || exec.jobTitle || '').toLowerCase();
  const positionMatch = pos.includes('chief') || pos.includes('vp') || pos.includes('vice president') || pos.includes('director') || pos.includes('head');
  if (positionMatch) score += weights.positionWeight;

  // 4. Country / Location Match
  const country = (exec.country || '').toLowerCase();
  const venue = (event.venue || '').toLowerCase();
  const locationMatch = venue.includes(country) || (country === 'singapore' && venue.includes('singapore')) || (country === 'philippines' && venue.includes('manila'));

  // 5. Past Attendance Match
  const pastAttendanceMatch = exec.previousEventAttendance && exec.previousEventAttendance.length > 0;
  if (pastAttendanceMatch) score += weights.pastAttendanceWeight;

  // Final Score Cap
  const finalScore = Math.min(100, Math.max(25, score));

  // Determine priority
  let priorityLevel: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
  if (finalScore >= 85) priorityLevel = 'Critical';
  else if (finalScore >= 70) priorityLevel = 'High';
  else if (finalScore >= 50) priorityLevel = 'Medium';
  else priorityLevel = 'Low';

  // Construct clear reason
  const reasons: string[] = [];
  if (industryMatch) reasons.push(`Industry match (${exec.industry})`);
  if (categoryMatch) reasons.push(`Category preference (${event.category})`);
  if (positionMatch) reasons.push(`Executive position level (${exec.position})`);
  if (locationMatch) reasons.push(`Venue proximity`);
  if (pastAttendanceMatch) reasons.push(`Proven event attendee`);

  const reasonText = reasons.length > 0 
    ? `Matches profile criteria: ${reasons.join(' | ')}.`
    : `General profile match based on target criteria.`;

  return {
    id: `REC-${exec.id.replace('EXE-', '')}-${event.id.replace('EVT-', '')}`,
    executiveId: exec.id,
    eventId: event.id,
    matchScore: finalScore,
    confidenceScore: exec.contactStatus === 'Verified' ? 100 : 80,
    recommendationReason: reasonText,
    breakdown: {
      industryMatch,
      categoryMatch,
      positionMatch,
      locationMatch,
      pastAttendanceMatch
    },
    priorityLevel,
    createdAt: new Date().toISOString()
  };
}

// VIP Invitation Template Generator
function generateVipInvitationText(exec: Executive, event: DELCAEvent): { subject: string; bodyText: string } {
  const subject = `VIP Executive Invitation: ${exec.fullName} | ${event.name}`;
  const bodyText = `Dear ${exec.fullName},

On behalf of DELCA VisionTech Inc., I am pleased to extend a formal invitation to you, representing ${exec.company}, to join us as an honored guest at our upcoming executive conference: "${event.name}".

Event Overview:
- Date & Time: ${event.date} at ${event.time}
- Venue: ${event.venue}
- Keynote Speakers: ${event.speakerInfo}
- RSVP Deadline: ${event.registrationDeadline}

Recognizing your leadership position as ${exec.position} at ${exec.company} within the ${exec.industry} sector, we believe this gathering will provide invaluable insights tailored to your strategic priorities in ${exec.preferredEventCategories.slice(0, 2).join(' & ') || 'enterprise modernization'}.

As our VIP guest, you will be provided with:
- Complimentary All-Access Delegate Pass
- Executive Networking Banquet
- Dedicated 1-on-1 Consultation Session with DELCA Solution Architects

Kindly confirm your attendance by replying to this invitation or RSVPing prior to ${event.registrationDeadline}.

With highest professional regards,

Jane Marie Baluna
Director of Client Relations & Executive Outreach
DELCA VisionTech Inc.
Website: ${exec.companyWebsite || 'https://delcavisiontech.com'}`;

  return { subject, bodyText };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Initialize state on boot
  loadState();

  // REST API Routes

  // 1. Get Application State
  app.get('/api/state', (req, res) => {
    const state = loadState();
    res.json(state);
  });

  // 2. Add Executive Contact
  app.post('/api/executives', (req, res) => {
    const state = loadState();
    const data = req.body;

    const nextNum = state.executives.length > 0 
      ? Math.max(...state.executives.map(e => parseInt(e.id.replace('EXE-', '')) || 0)) + 1 
      : 1;
    const newId = `EXE-${String(nextNum).padStart(3, '0')}`;

    const newExec: Executive = {
      id: newId,
      fullName: data.fullName || 'New Executive',
      position: data.position || data.jobTitle || 'Executive Contact',
      jobTitle: data.position || data.jobTitle || 'Executive Contact',
      company: data.company || 'Unspecified Company',
      industry: data.industry || 'General Industry',
      department: data.department || 'Executive Office',
      country: data.country || 'Global',
      email: data.email || `contact@${(data.company || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
      contactNumber: data.contactNumber || '+1 (555) 000-0000',
      linkedinProfile: data.linkedinProfile || '',
      companyWebsite: data.companyWebsite || '',
      contactStatus: data.contactStatus || 'Pending Verification',
      verificationDate: data.contactStatus === 'Verified' ? new Date().toISOString() : null,
      relationshipStage: data.relationshipStage || 'New Contact',
      contactSource: data.contactSource || 'Direct Outreach',
      communicationPreferences: Array.isArray(data.communicationPreferences) ? data.communicationPreferences : ['Email'],
      tags: Array.isArray(data.tags) ? data.tags : [],
      notes: data.notes || '',
      lastContactDate: new Date().toISOString(),
      followUpDate: data.followUpDate || null,
      preferredEventCategories: Array.isArray(data.preferredEventCategories) ? data.preferredEventCategories : ['ERP & Cloud Modernization'],
      previousEventAttendance: Array.isArray(data.previousEventAttendance) ? data.previousEventAttendance : [],
      status: 'Active',
      createdAt: new Date().toISOString(),
      interactionHistory: [],
      referredById: data.referredById || null,
      referredByName: data.referredByName || null,
      referralNotes: data.referralNotes || '',
      opportunities: Array.isArray(data.opportunities) ? data.opportunities : []
    };

    state.executives.unshift(newExec);

    // Activity Log
    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: data.triggerRole || 'Administrator',
      userName: data.triggerBy || 'User',
      action: `Created new verified contact record for ${newExec.fullName} (${newExec.company}).`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, executive: newExec, executives: state.executives });
  });

  // 3. Update Executive Contact
  app.put('/api/executives/:id', (req, res) => {
    const state = loadState();
    const { id } = req.params;
    const data = req.body;

    const idx = state.executives.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    const prev = state.executives[idx];
    const updated: Executive = {
      ...prev,
      fullName: data.fullName ?? prev.fullName,
      position: data.position ?? data.jobTitle ?? prev.position,
      jobTitle: data.position ?? data.jobTitle ?? prev.jobTitle,
      company: data.company ?? prev.company,
      industry: data.industry ?? prev.industry,
      department: data.department ?? prev.department,
      country: data.country ?? prev.country,
      email: data.email ?? prev.email,
      contactNumber: data.contactNumber ?? prev.contactNumber,
      linkedinProfile: data.linkedinProfile ?? prev.linkedinProfile,
      companyWebsite: data.companyWebsite ?? prev.companyWebsite,
      contactStatus: data.contactStatus ?? prev.contactStatus,
      relationshipStage: data.relationshipStage ?? prev.relationshipStage,
      contactSource: data.contactSource ?? prev.contactSource,
      notes: data.notes ?? prev.notes,
      followUpDate: data.followUpDate ?? prev.followUpDate,
      referredById: data.referredById !== undefined ? data.referredById : prev.referredById,
      referredByName: data.referredByName !== undefined ? data.referredByName : prev.referredByName,
      referralNotes: data.referralNotes !== undefined ? data.referralNotes : prev.referralNotes,
      preferredEventCategories: Array.isArray(data.preferredEventCategories) ? data.preferredEventCategories : prev.preferredEventCategories,
      previousEventAttendance: Array.isArray(data.previousEventAttendance) ? data.previousEventAttendance : prev.previousEventAttendance
    };

    state.executives[idx] = updated;

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: data.triggerRole || 'Administrator',
      userName: data.triggerBy || 'User',
      action: `Updated executive profile for ${updated.fullName} (${updated.company}).`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, executive: updated, executives: state.executives });
  });

  // 3b. Merge Duplicate Executives
  app.post('/api/executives/merge', (req, res) => {
    const state = loadState();
    const { primaryId, duplicateIds, triggerBy, triggerRole } = req.body;

    if (!primaryId || !Array.isArray(duplicateIds) || duplicateIds.length === 0) {
      return res.status(400).json({ error: 'Primary record ID and list of duplicate IDs required.' });
    }

    const primaryIdx = state.executives.findIndex(e => e.id === primaryId);
    if (primaryIdx === -1) return res.status(404).json({ error: 'Primary executive record not found' });

    const primary = state.executives[primaryIdx];
    const duplicates = state.executives.filter(e => duplicateIds.includes(e.id));

    // Combine interaction notes
    let mergedNotes = primary.interactionHistory || [];
    duplicates.forEach(dup => {
      if (dup.interactionHistory) {
        mergedNotes = [...mergedNotes, ...dup.interactionHistory];
      }
    });
    mergedNotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Combine event attendance
    let mergedEvents = primary.previousEventAttendance || [];
    duplicates.forEach(dup => {
      if (dup.previousEventAttendance) {
        dup.previousEventAttendance.forEach(evt => {
          if (!mergedEvents.includes(evt)) mergedEvents.push(evt);
        });
      }
    });

    // Combine tags
    let mergedTags = primary.tags || [];
    duplicates.forEach(dup => {
      if (dup.tags) {
        dup.tags.forEach(t => {
          if (!mergedTags.includes(t)) mergedTags.push(t);
        });
      }
    });

    // Combine business opportunities
    let mergedOpps = primary.opportunities || [];
    duplicates.forEach(dup => {
      if (dup.opportunities) {
        dup.opportunities.forEach(opp => {
          mergedOpps.push({ ...opp, executiveId: primaryId });
        });
      }
    });

    // Merge notes summary
    const extraNotes = duplicates.map(d => `[Merged Note from ${d.fullName}]: ${d.notes || 'N/A'}`).join('\n');
    const combinedNotesStr = primary.notes ? `${primary.notes}\n\n${extraNotes}` : extraNotes;

    state.executives[primaryIdx] = {
      ...primary,
      interactionHistory: mergedNotes,
      previousEventAttendance: mergedEvents,
      tags: mergedTags,
      opportunities: mergedOpps,
      notes: combinedNotesStr
    };

    // Remove duplicate records
    state.executives = state.executives.filter(e => !duplicateIds.includes(e.id));

    // Reassign recommendations and invitations
    state.recommendations.forEach(r => {
      if (duplicateIds.includes(r.executiveId)) {
        r.executiveId = primaryId;
      }
    });
    state.invitations.forEach(i => {
      if (duplicateIds.includes(i.executiveId)) {
        i.executiveId = primaryId;
      }
    });

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Administrator',
      userName: triggerBy || 'User',
      action: `Merged ${duplicates.length} duplicate executive record(s) into primary record ${primary.fullName} [${primaryId}].`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, primary: state.executives[primaryIdx], executives: state.executives });
  });

  // 3c. Business Opportunity Operations
  app.post('/api/executives/:id/opportunities', (req, res) => {
    const state = loadState();
    const { id } = req.params;
    const { title, value, stage, opportunityType, expectedCloseDate, probability, notes, assignedTeamMember, triggerBy, triggerRole } = req.body;

    const idx = state.executives.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    const oppId = `OPP-${Date.now().toString().slice(-5)}`;
    const newOpp = {
      id: oppId,
      executiveId: id,
      title: title || 'New Business Opportunity',
      value: Number(value) || 0,
      stage: stage || 'New Lead',
      opportunityType: opportunityType || 'Partnership',
      expectedCloseDate: expectedCloseDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
      probability: Number(probability) ?? 20,
      assignedTeamMember: assignedTeamMember || 'Jane Marie Baluna',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (!state.executives[idx].opportunities) {
      state.executives[idx].opportunities = [];
    }
    state.executives[idx].opportunities!.unshift(newOpp);

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Sales Team',
      userName: triggerBy || 'User',
      action: `Created opportunity "${newOpp.title}" ($${newOpp.value.toLocaleString()}) for ${state.executives[idx].fullName}.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, opportunity: newOpp, executive: state.executives[idx], executives: state.executives });
  });

  app.put('/api/executives/:id/opportunities/:oppId', (req, res) => {
    const state = loadState();
    const { id, oppId } = req.params;
    const { title, value, stage, opportunityType, expectedCloseDate, probability, notes, assignedTeamMember, logNote, triggerBy, triggerRole } = req.body;

    const execIdx = state.executives.findIndex(e => e.id === id);
    if (execIdx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    const exec = state.executives[execIdx];
    if (!exec.opportunities) exec.opportunities = [];

    const oppIdx = exec.opportunities.findIndex(o => o.id === oppId);
    if (oppIdx === -1) return res.status(404).json({ error: 'Opportunity record not found' });

    const prevOpp = exec.opportunities[oppIdx];
    const updatedOpp = {
      ...prevOpp,
      title: title ?? prevOpp.title,
      value: value !== undefined ? Number(value) : prevOpp.value,
      stage: stage ?? prevOpp.stage,
      opportunityType: opportunityType ?? prevOpp.opportunityType,
      expectedCloseDate: expectedCloseDate ?? prevOpp.expectedCloseDate,
      probability: probability !== undefined ? Number(probability) : prevOpp.probability,
      assignedTeamMember: assignedTeamMember ?? prevOpp.assignedTeamMember,
      notes: notes ?? prevOpp.notes,
      updatedAt: new Date().toISOString()
    };

    exec.opportunities[oppIdx] = updatedOpp;

    if (logNote || stage !== prevOpp.stage) {
      if (!exec.interactionHistory) exec.interactionHistory = [];
      exec.interactionHistory.unshift({
        id: `NOTE-${Date.now()}`,
        authorName: triggerBy || 'Sales Operations',
        authorRole: triggerRole || 'Account Manager',
        type: 'Note',
        content: logNote || `Opportunity "${updatedOpp.title}" moved from ${prevOpp.stage} to ${updatedOpp.stage}. Assigned staff: ${updatedOpp.assignedTeamMember}. Expected close: ${updatedOpp.expectedCloseDate}.`,
        timestamp: new Date().toISOString()
      });
    }

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Sales Team',
      userName: triggerBy || 'User',
      action: `Updated opportunity "${updatedOpp.title}" stage to "${updatedOpp.stage}" for ${exec.fullName}.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, opportunity: updatedOpp, executive: exec, executives: state.executives });
  });

  app.delete('/api/executives/:id/opportunities/:oppId', (req, res) => {
    const state = loadState();
    const { id, oppId } = req.params;

    const execIdx = state.executives.findIndex(e => e.id === id);
    if (execIdx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    const exec = state.executives[execIdx];
    if (exec.opportunities) {
      exec.opportunities = exec.opportunities.filter(o => o.id !== oppId);
    }

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: req.body?.triggerRole || 'Sales Team',
      userName: req.body?.triggerBy || 'User',
      action: `Deleted opportunity ID ${oppId} for ${exec.fullName}.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, executive: exec, executives: state.executives });
  });

  // 4. Toggle Contact Verification
  app.post('/api/executives/:id/verify', (req, res) => {
    const state = loadState();
    const { id } = req.params;
    const { status, triggerBy, triggerRole } = req.body;

    const idx = state.executives.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    const newStatus: ContactStatus = status || (state.executives[idx].contactStatus === 'Verified' ? 'Unverified' : 'Verified');
    state.executives[idx].contactStatus = newStatus;
    state.executives[idx].verificationDate = newStatus === 'Verified' ? new Date().toISOString() : null;

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Administrator',
      userName: triggerBy || 'User',
      action: `Marked contact ${state.executives[idx].fullName} as ${newStatus}.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, executive: state.executives[idx], executives: state.executives });
  });

  // 5. Delete Executive Contact
  app.delete('/api/executives/:id', (req, res) => {
    const state = loadState();
    const { id } = req.params;

    const idx = state.executives.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    const removedName = state.executives[idx].fullName;
    state.executives.splice(idx, 1);

    // Clean tied recs and invitations
    state.recommendations = state.recommendations.filter(r => r.executiveId !== id);
    state.invitations = state.invitations.filter(i => i.executiveId !== id);

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: req.body?.triggerRole || 'Administrator',
      userName: req.body?.triggerBy || 'User',
      action: `Removed executive contact ${removedName} [${id}] from database.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, executives: state.executives });
  });

  // 6. Bulk Import Executive Contacts
  app.post('/api/executives/import', (req, res) => {
    const state = loadState();
    const { list, triggerBy, triggerRole } = req.body;

    if (!Array.isArray(list) || list.length === 0) {
      return res.status(400).json({ error: 'Invalid contact list array provided.' });
    }

    let addedCount = 0;

    list.forEach(item => {
      const nextNum = state.executives.length + 1;
      const id = `EXE-${String(nextNum).padStart(3, '0')}`;
      const newExec: Executive = {
        id,
        fullName: item.fullName || item.name || 'Imported Contact',
        position: item.position || item.jobTitle || 'Executive',
        jobTitle: item.position || item.jobTitle || 'Executive',
        company: item.company || 'Unknown Corporation',
        industry: item.industry || 'General',
        department: item.department || 'Management',
        country: item.country || 'Global',
        email: item.email || `contact${nextNum}@company.com`,
        contactNumber: item.contactNumber || item.phone || '+1 (555) 000-0000',
        linkedinProfile: item.linkedinProfile || '',
        companyWebsite: item.companyWebsite || '',
        contactStatus: item.contactStatus || 'Verified',
        verificationDate: new Date().toISOString(),
        relationshipStage: item.relationshipStage || 'New Contact',
        contactSource: item.contactSource || 'Direct Outreach',
        communicationPreferences: Array.isArray(item.communicationPreferences) ? item.communicationPreferences : ['Email'],
        tags: Array.isArray(item.tags) ? item.tags : ['Imported'],
        notes: item.notes || 'Imported via CSV/JSON.',
        lastContactDate: new Date().toISOString(),
        followUpDate: item.followUpDate || null,
        preferredEventCategories: Array.isArray(item.preferredEventCategories) ? item.preferredEventCategories : ['ERP & Cloud Modernization'],
        previousEventAttendance: Array.isArray(item.previousEventAttendance) ? item.previousEventAttendance : [],
        status: 'Active',
        createdAt: new Date().toISOString(),
        interactionHistory: []
      };
      state.executives.unshift(newExec);
      addedCount++;
    });

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Administrator',
      userName: triggerBy || 'User',
      action: `Imported ${addedCount} executive contact records into centralized database.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, addedCount, executives: state.executives });
  });

  // 7. Add Interaction Note
  app.post('/api/executives/:id/notes', (req, res) => {
    const state = loadState();
    const { id } = req.params;
    const { authorName, authorRole, type, content } = req.body;

    const idx = state.executives.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    const note = {
      id: `NOTE-${Date.now()}`,
      authorName: authorName || 'User',
      authorRole: authorRole || 'Sales Team',
      type: type || 'Note',
      content: content || '',
      timestamp: new Date().toISOString()
    };

    if (!state.executives[idx].interactionHistory) {
      state.executives[idx].interactionHistory = [];
    }
    state.executives[idx].interactionHistory?.unshift(note);
    state.executives[idx].lastContactDate = new Date().toISOString();

    saveState(state);
    res.json({ success: true, executive: state.executives[idx], executives: state.executives });
  });

  // 7b. Delete Interaction Note
  app.delete('/api/executives/:id/notes/:noteId', (req, res) => {
    const state = loadState();
    const { id, noteId } = req.params;

    const idx = state.executives.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Executive contact not found' });

    if (state.executives[idx].interactionHistory) {
      state.executives[idx].interactionHistory = state.executives[idx].interactionHistory?.filter(n => n.id !== noteId);
    }

    saveState(state);
    res.json({ success: true, executive: state.executives[idx], executives: state.executives });
  });

  // 8. Generate Smart Match Recommendations
  app.post('/api/generate-recommendations/:execId', (req, res) => {
    const state = loadState();
    const { execId } = req.params;

    const exec = state.executives.find(e => e.id === execId);
    if (!exec) return res.status(404).json({ error: 'Executive contact not found' });

    const upcomingEvents = state.events.filter(e => e.status !== 'Archived');
    const recs: EventRecommendation[] = upcomingEvents.map(event => 
      computeSmartRecommendation(exec, event, state.settings)
    );

    // Upsert recommendations into state
    recs.forEach(newRec => {
      const existingIdx = state.recommendations.findIndex(r => r.executiveId === execId && r.eventId === newRec.eventId);
      if (existingIdx >= 0) {
        state.recommendations[existingIdx] = newRec;
      } else {
        state.recommendations.unshift(newRec);
      }
    });

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: req.body?.triggerRole || 'Marketing Team',
      userName: req.body?.triggerBy || 'User',
      action: `Executed profile Smart Matcher for ${exec.fullName}. Generated ${recs.length} event recommendations.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, recommendations: state.recommendations });
  });

  // 9. Generate VIP Invitation Text
  app.post('/api/generate-invitation', (req, res) => {
    const state = loadState();
    const { executiveId, eventId, triggerBy, triggerRole } = req.body;

    const exec = state.executives.find(e => e.id === executiveId);
    const event = state.events.find(e => e.id === eventId);

    if (!exec || !event) {
      return res.status(404).json({ error: 'Executive or Event record not found.' });
    }

    const copy = generateVipInvitationText(exec, event);

    const nextNum = state.invitations.length + 1;
    const invId = `INV-${String(nextNum).padStart(3, '0')}`;

    const newInvitation: Invitation = {
      id: invId,
      executiveId,
      eventId,
      subject: copy.subject,
      bodyText: copy.bodyText,
      status: 'Pending',
      sentAt: null,
      createdAt: new Date().toISOString(),
      subjectLine: copy.subject,
      emailBody: copy.bodyText
    };

    state.invitations.unshift(newInvitation);

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Marketing Team',
      userName: triggerBy || 'User',
      action: `Prepared personalized VIP invitation [ID: ${invId}] for ${exec.fullName}.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, invitation: newInvitation, invitations: state.invitations });
  });

  // Save / Update Custom Invitation Draft Copy
  app.post('/api/invitations/:execId/:eventId', (req, res) => {
    const state = loadState();
    const { execId, eventId } = req.params;
    const { subjectLine, emailBody, triggerBy, triggerRole } = req.body;

    let idx = state.invitations.findIndex(i => i.executiveId === execId && i.eventId === eventId);
    if (idx >= 0) {
      state.invitations[idx].subject = subjectLine || state.invitations[idx].subject;
      state.invitations[idx].subjectLine = subjectLine || state.invitations[idx].subjectLine;
      state.invitations[idx].bodyText = emailBody || state.invitations[idx].bodyText;
      state.invitations[idx].emailBody = emailBody || state.invitations[idx].emailBody;
    } else {
      const invId = `INV-${String(state.invitations.length + 1).padStart(3, '0')}`;
      const newInv: Invitation = {
        id: invId,
        executiveId: execId,
        eventId,
        subject: subjectLine || 'VIP Executive Invitation',
        bodyText: emailBody || '',
        subjectLine: subjectLine || 'VIP Executive Invitation',
        emailBody: emailBody || '',
        status: 'Draft',
        sentAt: null,
        createdAt: new Date().toISOString()
      };
      state.invitations.unshift(newInv);
    }

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Marketing Team',
      userName: triggerBy || 'User',
      action: `Saved updated invitation copy draft for executive ID ${execId}.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, invitations: state.invitations });
  });

  // 10. Update Invitation Status
  app.put('/api/invitations/:id/status', (req, res) => {
    const state = loadState();
    const { id } = req.params;
    const { status, triggerBy, triggerRole } = req.body;

    const idx = state.invitations.findIndex(i => i.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Invitation record not found' });

    state.invitations[idx].status = status;
    if (status === 'Sent' && !state.invitations[idx].sentAt) {
      state.invitations[idx].sentAt = new Date().toISOString();
    } else if (status === 'Accepted' && !state.invitations[idx].acceptedAt) {
      state.invitations[idx].acceptedAt = new Date().toISOString();
    }

    const exec = state.executives.find(e => e.id === state.invitations[idx].executiveId);

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: triggerRole || 'Marketing Team',
      userName: triggerBy || 'User',
      action: `Updated invitation ${id} status to ${status}${exec ? ` for ${exec.fullName}` : ''}.`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, invitation: state.invitations[idx], invitations: state.invitations });
  });

  // 11. Delete Invitation
  app.delete('/api/invitations/:id', (req, res) => {
    const state = loadState();
    const { id } = req.params;

    state.invitations = state.invitations.filter(i => i.id !== id);
    saveState(state);
    res.json({ success: true, invitations: state.invitations });
  });

  // 12. Add Corporate Event
  app.post('/api/events', (req, res) => {
    const state = loadState();
    const eventData = req.body;

    const nextNum = state.events.length > 0 
      ? Math.max(...state.events.map(e => parseInt(e.id.replace('EVT-', '')) || 0)) + 1 
      : 101;
    const newId = `EVT-${nextNum}`;

    const newEvent: DELCAEvent = {
      id: newId,
      name: eventData.name || 'New Corporate Symposium',
      description: eventData.description || '',
      venue: eventData.venue || 'Executive Conference Center',
      date: eventData.date || new Date().toISOString().split('T')[0],
      time: eventData.time || '09:00 AM - 05:00 PM',
      registrationDeadline: eventData.registrationDeadline || '',
      targetIndustry: eventData.targetIndustry || 'Banking & Financial Services',
      category: eventData.category || 'ERP & Cloud Modernization',
      maxParticipants: Number(eventData.maxParticipants) || 50,
      speakerInfo: eventData.speakerInfo || 'DELCA Leadership Panel',
      status: eventData.status || 'Upcoming'
    };

    state.events.push(newEvent);

    state.activityLogs.unshift({
      id: `LOG-${Date.now()}`,
      userRole: eventData.triggerRole || 'Administrator',
      userName: eventData.triggerBy || 'User',
      action: `Created new corporate event: "${newEvent.name}".`,
      timestamp: new Date().toISOString()
    });

    saveState(state);
    res.json({ success: true, events: state.events, added: newEvent });
  });

  // 13. Update Event
  app.put('/api/events/:id', (req, res) => {
    const state = loadState();
    const { id } = req.params;
    const data = req.body;

    const idx = state.events.findIndex(e => e.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Event record not found' });

    const prev = state.events[idx];
    state.events[idx] = {
      ...prev,
      name: data.name ?? prev.name,
      description: data.description ?? prev.description,
      venue: data.venue ?? prev.venue,
      date: data.date ?? prev.date,
      time: data.time ?? prev.time,
      registrationDeadline: data.registrationDeadline ?? prev.registrationDeadline,
      targetIndustry: data.targetIndustry ?? prev.targetIndustry,
      category: data.category ?? prev.category,
      maxParticipants: data.maxParticipants !== undefined ? Number(data.maxParticipants) : prev.maxParticipants,
      speakerInfo: data.speakerInfo ?? prev.speakerInfo,
      status: data.status ?? prev.status
    };

    saveState(state);
    res.json({ success: true, events: state.events });
  });

  // 14. Delete Event
  app.delete('/api/events/:id', (req, res) => {
    const state = loadState();
    const { id } = req.params;

    state.events = state.events.filter(e => e.id !== id);
    state.recommendations = state.recommendations.filter(r => r.eventId !== id);
    state.invitations = state.invitations.filter(i => i.eventId !== id);

    saveState(state);
    res.json({ success: true, events: state.events });
  });

  // 15. Update Settings
  app.put('/api/settings', (req, res) => {
    const state = loadState();
    const updatedSettings = req.body;

    state.settings = {
      ...state.settings,
      ...updatedSettings
    };

    saveState(state);
    res.json({ success: true, settings: state.settings });
  });

  // 16. Reset Database to Default
  app.post('/api/reset-data', (req, res) => {
    const initialState: AppStateStore = {
      executives: DEFAULT_EXECUTIVES,
      events: DEFAULT_EVENTS,
      recommendations: DEFAULT_RECOMMENDATIONS,
      invitations: DEFAULT_INVITATIONS,
      activityLogs: DEFAULT_LOGS,
      notifications: DEFAULT_NOTIFICATIONS,
      settings: DEFAULT_SETTINGS
    };
    saveState(initialState);
    res.json({ success: true, state: initialState });
  });

  // Clear Notifications
  app.put('/api/notifications/clear', (req, res) => {
    const state = loadState();
    state.notifications = [];
    saveState(state);
    res.json({ success: true });
  });

  // Vite Middleware / Static Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DELCA Executive CRM Server running on port ${PORT}`);
  });
}

startServer();
