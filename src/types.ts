/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface InteractionNote {
  id: string;
  authorName: string;
  authorRole: string;
  type: 'Note' | 'Email' | 'Meeting' | 'Call' | 'Event Attendance';
  content: string;
  timestamp: string;
}

export type ContactStatus = 'Verified' | 'Unverified' | 'Pending Verification';
export type ContactHealth = 'Healthy' | 'Needs Follow-Up' | 'At Risk';

export type RelationshipStage = 
  | 'New Contact' 
  | 'Qualified Lead'
  | 'Initial Conversation' 
  | 'Invitation Sent'
  | 'Invited'
  | 'Event Attendee' 
  | 'Meeting Held'
  | 'Proposal Sent'
  | 'Potential Client' 
  | 'Partnership'
  | 'Active Client';

export const EXECUTIVE_JOURNEY_STAGES: RelationshipStage[] = [
  'New Contact',
  'Qualified Lead',
  'Invited',
  'Event Attendee',
  'Meeting Held',
  'Proposal Sent',
  'Partnership',
  'Active Client'
];

export type ContactSource = 
  | 'LinkedIn' 
  | 'Company Website' 
  | 'Referral' 
  | 'Conference' 
  | 'Webinar' 
  | 'Networking Event' 
  | 'Direct Outreach';

export type CommunicationPreference = 'Email' | 'Phone' | 'LinkedIn' | 'In-Person';

export type BusinessOpportunityStage = 
  | 'New Lead'
  | 'Qualified'
  | 'Discovery'
  | 'Solution Presentation'
  | 'Proposal Sent' 
  | 'Negotiation' 
  | 'Contract Review'
  | 'Won' 
  | 'Lost'
  | 'Closed';

export const OPPORTUNITY_STAGES: BusinessOpportunityStage[] = [
  'New Lead',
  'Qualified',
  'Discovery',
  'Solution Presentation',
  'Proposal Sent',
  'Negotiation',
  'Contract Review',
  'Won',
  'Lost'
];

export interface BusinessOpportunity {
  id: string; // e.g. "OPP-001"
  executiveId: string;
  title: string; // e.g. "Cloud ERP Supply Chain Integration"
  value: number; // USD amount
  stage: BusinessOpportunityStage;
  opportunityType: 'Partnership' | 'Consulting' | 'Proposal' | 'Software Licensing' | 'Advisory';
  expectedCloseDate: string; // YYYY-MM-DD
  probability: number; // 0 - 100 percentage
  assignedTeamMember?: string; // Team member handling this deal
  notes?: string;
  createdAt: string;
  updatedAt: string;

  // Enterprise AI Sales Intelligence Enhancements
  aiScore?: number; // 0 - 100
  confidenceLevel?: 'High' | 'Medium' | 'Emerging';
  buyingReadiness?: 'Immediate' | 'High' | 'Moderate' | 'Evaluating';
  relationshipHealth?: 'Strong' | 'Good' | 'Needs Attention';
  aiReadiness?: 'Enterprise Ready' | 'In Evaluation' | 'Early Stage';
  businessFitScore?: number; // 0 - 100%
  scoreExplanation?: string;
  nextBestAction?: {
    actionTitle: string;
    actionType: 'Schedule Briefing' | 'Send Case Study' | 'Arrange Demo' | 'Invite Event' | 'Follow Up Proposal';
    reason: string;
  };
  proposalDetails?: {
    version: string;
    status: 'Draft' | 'Sent' | 'Under Review' | 'Approved' | 'Revision Requested';
    proposalDate: string;
    decisionDate: string;
    syncedToKnowledgeHub?: boolean;
  };
}

export interface Company {
  id: string; // e.g. "CMP-001"
  name: string;
  industry: string;
  city?: string;
  country: string;
  website: string;
  logoUrl?: string;
  buildingImageUrl?: string;
  employeeCount?: string;
  annualRevenue?: string;
  description?: string;
  contactCount?: number;
  createdAt?: string;
  accountManager?: {
    name: string;
    title: string;
    email: string;
    avatarUrl?: string;
  };
  tier?: 'Strategic Enterprise' | 'Key Account' | 'Growth Target' | 'Standard';
  documents?: ExecutiveDocument[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    investorRelations?: string;
  };
  stockTicker?: string;
  marketCap?: string;
  headquartersAddress?: string;
  yearFounded?: number;
  techStack?: string[];
  regulatoryBody?: string;
  keySubsidiaries?: string[];
  esgRating?: string;
  rndBudget?: string;
  missionVision?: string;
  productsAndServices?: string[];
  aiInitiatives?: string[];
  digitalTransformationEfforts?: string[];
  majorProjects?: string[];
  pressReleases?: { title: string; date: string; url: string; summary: string }[];
  annualReports?: { year: string; title: string; url: string; highlights: string }[];
  delcaRelationship?: {
    status: string;
    deployedModules: string[];
    activeLicenses: string;
    relationshipHistory: string;
    expansionRoadmap: string;
  };
  competitors?: string[];
  businessStrategy?: string;
  industryTrends?: string[];
  accountIntelligenceProfile?: AccountIntelligenceProfile;
}

export interface NetworkConnection {
  executiveId: string;
  executiveName: string;
  connectionType: 'Referral' | 'Company Colleague' | 'Industry Peer' | 'Event Co-Attendee';
  notes?: string;
}

export interface ExecutiveDocument {
  id: string;
  title: string;
  category: 'Contract' | 'Proposal' | 'NDR' | 'Meeting Brief' | 'Presentation' | 'Other';
  uploadedAt: string;
  size?: string;
}

export interface Executive {
  id: string; // e.g. "EXE-001"
  fullName: string;
  position: string; // Job title / position
  jobTitle?: string; // Backwards compatibility alias
  company: string;
  companyId?: string;
  industry: string;
  department: string;
  city?: string;
  country: string;
  email: string;
  contactNumber: string;
  phoneNumber?: string;
  linkedinProfile: string;
  companyWebsite: string;
  avatarUrl?: string;
  companyLogoUrl?: string;
  gender?: 'Male' | 'Female';
  contactStatus: ContactStatus;
  verificationDate: string | null;
  relationshipStage: RelationshipStage;
  contactSource: ContactSource;
  communicationPreferences: CommunicationPreference[];
  tags: string[];
  notes: string;
  lastContactDate: string | null;
  followUpDate: string | null; // ISO YYYY-MM-DD
  preferredEventCategories: string[];
  previousEventAttendance: string[];
  status: 'Active' | 'Inactive';
  createdAt: string;
  interactionHistory?: InteractionNote[];
  profileCompleteness?: number; // Calculated percentage 0-100%
  healthScore?: number; // 0 - 100
  healthStatus?: 'Thriving' | 'Moderate' | 'At Risk';
  referredById?: string | null;
  referredByName?: string | null;
  referralNotes?: string;
  opportunities?: BusinessOpportunity[];
  networkConnections?: NetworkConnection[];
  documents?: ExecutiveDocument[];
  biography?: string;
  education?: string;
  decisionMakingStyle?: string;
  aiReadinessScore?: number;
  technologyReadinessScore?: number;
  strategicPriorities?: string[];
  painPoints?: string[];
  buyingSignals?: string[];
  techStack?: string[];
  recommendedNextActions?: string[];
  speakingEngagements?: string[];
  awardsCertifications?: string[];
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    bloomberg?: string;
    corporateBio?: string;
    personalWebsite?: string;
    youtubeOrPodcast?: string;
    mediumOrGithub?: string;
  };
  pastRoles?: string[];
  keyAchievements?: string[];
  preferredContactTime?: string;
  communicationTonePreference?: string;
  personaGenerated?: boolean;
  updatedAt?: string;
  accountIntelligenceProfile?: AccountIntelligenceProfile;
  assignedSalesRep?: string;
  aiAdoptionStage?: string;
  digitalTransformationStatus?: string;
  erpModernizationPotential?: string;
  researchConfidence?: number;
  researchSources?: string[];
  campaignHistory?: { campaignName: string; dateAdded: string; status?: string }[];
  companyDetails?: {
    headquarters?: string;
    companySize?: string;
    productsAndServices?: string[];
    currentProjects?: string[];
    erpEnvironment?: string;
    technologyStack?: string[];
    digitalTransformationProgress?: string;
    aiAdoptionLevel?: string;
    recentNews?: string[];
    growthOpportunities?: string[];
  };
  salesIntelligence?: {
    opportunityScore?: number;
    buyingSignals?: string[];
    budgetIndicators?: string;
    decisionAuthority?: string;
    businessChallenges?: string[];
    aiReadiness?: string;
    recommendedTalkingPoints?: string[];
    recommendedDelcaServices?: string[];
    suggestedSalesStrategy?: string;
    nextRecommendedSalesAction?: string;
  };
  eventIntelligence?: {
    eventMatchScore?: number;
    recommendedEvents?: string[];
    preferredTopics?: string[];
    previousEventParticipation?: string[];
    emailEngagementRate?: string;
    downloadedContent?: string[];
    interests?: string[];
    suggestedInvitationMessage?: string;
  };
  afterSalesIntelligence?: {
    activeProjects?: string[];
    implementationTimeline?: string;
    successMilestones?: string[];
    customerSatisfaction?: string;
    supportHistory?: string[];
    renewalOpportunities?: string;
    upsellOpportunities?: string[];
    roiAchievements?: string;
    customerFeedback?: string;
  };
  knowledgeHubNotes?: {
    id: string;
    author: string;
    role: string;
    content: string;
    category: 'Note' | 'AI Recommendation' | 'Document' | 'Task';
    timestamp: string;
  }[];
}

export interface CommunicationPreferencesDetail {
  channels: ('Email' | 'Phone' | 'LinkedIn' | 'In-Person')[];
  preferredTime?: string;
  communicationTonePreference?: string;
  decisionTiming?: string;
  keyStakeholdersToInvolve?: string[];
}

export interface RecommendedDelcaSolution {
  title: string;
  category: string;
  description: string;
  expectedRoi: string;
  valueProposition: string;
  implementationTimeframe: string;
}

export interface RecommendedSummit {
  eventId?: string;
  title: string;
  venueOrFormat: string;
  dateOrQuarter: string;
  relevanceReasoning: string;
}

export interface RecommendedWorkshop {
  title: string;
  duration: string;
  targetParticipants: string;
  keyDeliverables: string[];
}

export interface RecommendedSpeaker {
  name: string;
  title: string;
  expertiseArea: string;
  matchReason: string;
}

export interface SuggestedEmailCopy {
  subject: string;
  body: string;
}

export interface AccountIntelligenceProfile {
  id: string;
  executiveId: string;
  executiveName: string;
  position: string;
  company: string;
  companyId?: string;
  industry: string;
  generatedAt: string;
  updatedAt: string;
  
  // Core Sections
  executiveSummary: string;
  keyPainPoints: string[];
  businessPriorities: string[];
  buyingSignals: string[];
  communicationPreferences: CommunicationPreferencesDetail;
  decisionMakingStyle: string;
  technologyReadiness: {
    score: number;
    level: 'High' | 'Medium' | 'Emerging';
    summary: string;
  };
  aiReadiness: {
    score: number;
    level: 'High' | 'Medium' | 'Emerging';
    summary: string;
  };
  recommendedDelcaSolution: RecommendedDelcaSolution;
  recommendedSummit: RecommendedSummit;
  recommendedWorkshop: RecommendedWorkshop;
  recommendedSpeaker: RecommendedSpeaker;
  suggestedSalesPitch: string;
  suggestedEmail: SuggestedEmailCopy;
  recommendedNextActions: string[];
  
  savedToDatabase: boolean;
}

export interface DELCAEvent {
  id: string;
  name: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  registrationDeadline: string;
  targetIndustry: string;
  category: string; 
  targetPersona?: string; 
  maxParticipants: number;
  speakerInfo: string;
  status: 'Upcoming' | 'Completed' | 'Archived' | 'Draft';
  
  speaker?: string;
  targetAudience?: string[];
  attendedExecutiveIds?: string[];
  qrCodeToken?: string;

  // Intelligence & ROI Enhancements
  estimatedBudget?: number;
  revenueInfluenced?: number;
  opportunitiesCreatedCount?: number;
  opportunitiesCreatedValue?: number;
  dealsWonValue?: number;
  engagementScore?: number; // 0 - 100
  aiFollowUpActions?: {
    actionTitle: string;
    actionType: 'Schedule Executive Meeting' | 'Send Event Materials' | 'Share Industry Report' | 'Arrange Product Demonstration' | 'Add to Marketing Campaign';
    businessExplanation: string;
    recommendedTargetExecIds?: string[];
  }[];
}

export interface EventRecommendation {
  id: string;
  executiveId: string;
  eventId: string;
  matchScore: number; // 0 - 100
  confidenceScore: number; // Profile data verification score (100% verified)
  recommendationReason: string;
  alignmentReasoning?: string[];
  matchingReasons?: string[];
  breakdown: {
    industryMatch: boolean;
    categoryMatch: boolean;
    positionMatch: boolean;
    locationMatch: boolean;
    pastAttendanceMatch: boolean;
  };
  priorityLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  createdAt: string;
}

export type InvitationStatus = 'Draft' | 'Pending' | 'Sent' | 'Accepted' | 'Declined' | 'Attended';

export interface Invitation {
  id: string;
  executiveId: string;
  eventId: string;
  recommendationId?: string;
  subject: string;
  bodyText: string;
  status: InvitationStatus;
  sentAt: string | null;
  acceptedAt?: string | null;
  createdAt: string;

  subjectLine?: string;
  emailBody?: string;
}

export interface InvitationCopy {
  subjectLine: string;
  emailBody: string;
}

export type UserRole = 
  | 'Administrator' 
  | 'Marketing' 
  | 'Sales' 
  | 'Event Management' 
  | 'Customer Success' 
  | 'Leadership';

export interface UserSession {
  isAuthenticated: boolean;
  userName: string;
  userRole: UserRole;
  userEmail?: string;
  department?: string;
  title?: string;
  avatarUrl?: string;
}

export interface ActivityLog {
  id: string;
  userRole: UserRole;
  userName: string;
  action: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedExecutiveId?: string;
}

export interface MatchingWeights {
  industryWeight: number;
  categoryWeight: number;
  positionWeight: number;
  pastAttendanceWeight: number;
}

export interface SystemSettings {
  autoVerifyOnImport: boolean;
  defaultFollowUpDays: number;
  matchingWeights: MatchingWeights;
  exportFormat: 'CSV' | 'JSON';
}

// ====================================================
// AI IDENTITY VERIFICATION ENGINE TYPES
// ====================================================

export type VerificationDocumentType = 
  | 'National ID'
  | 'Passport'
  | "Driver's License"
  | 'UMID'
  | 'Postal ID'
  | 'PRC ID'
  | "Voter's ID"
  | 'Company ID'
  | 'Student ID';

export type VerificationStatus = 
  | 'Verified' 
  | 'Pending Verification' 
  | 'Needs Manual Review' 
  | 'Rejected' 
  | 'Flagged Fraud';

export type VerificationRiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type VerificationType = 'User' | 'Customer' | 'Applicant' | 'Employee' | 'Business Partner';

export interface PersonalInformation {
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  birthday: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  nationality: string;
  civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated';
  address: string;
  province: string;
  municipality: string;
  barangay: string;
  zipCode: string;
  emailAddress: string;
  mobileNumber: string;
}

export interface IdDocumentData {
  documentType: VerificationDocumentType;
  idNumber: string;
  frontImageUrl: string;
  backImageUrl?: string;
  issueDate?: string;
  expirationDate?: string;
  imageQualityScore: number;
  qualityCheckResults: Array<{ check: string; status: 'Passed' | 'Warning' | 'Failed'; details: string }>;
}

export interface OcrDifferenceItem {
  field: string;
  enteredValue: string;
  extractedValue: string;
  hasDifference: boolean;
  note?: string;
}

export interface OcrExtractionData {
  fullName: string;
  birthday: string;
  address: string;
  gender: string;
  nationality: string;
  idNumber: string;
  expirationDate: string;
  issueDate: string;
  documentType: string;
  ocrMatchPercentage: number;
  differences: OcrDifferenceItem[];
}

export interface SelfieVerificationData {
  selfieImageUrl: string;
  faceMatchScore: number;
  faceMatchStatus: 'Verified' | 'Manual Review Required' | 'Mismatch';
  livenessStatus: 'Passed' | 'Failed';
  livenessActionsCompleted: string[];
  spoofingDetections: Array<{ test: string; status: 'Passed' | 'Flagged'; details: string }>;
}

export interface AuthenticityAnalysisData {
  authenticityScore: number;
  authenticityStatus: 'Likely Genuine' | 'Suspected Edit' | 'High Risk Fake';
  structuralChecks: Array<{ checkName: string; passed: boolean; details: string }>;
}

export interface ContactValidationData {
  emailValid: boolean;
  emailDomainExists: boolean;
  disposableEmail: boolean;
  emailSpamRiskScore: number;
  emailVerified: boolean;
  phoneValid: boolean;
  phoneCarrier: string;
  phoneCountryCode: string;
  phoneOtpVerified: boolean;
  addressLogicalConsistency: boolean;
  addressSuggestions?: string;
}

export interface DuplicateFraudData {
  duplicateDetected: boolean;
  duplicateSimilarityScore: number;
  duplicateFields: string[];
  matchedDuplicateRecordId?: string;
  matchedDuplicateName?: string;
  fraudRiskScore: number;
  riskLevel: VerificationRiskLevel;
  fraudFlags: string[];
}

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  ipAddress?: string;
}

export interface ReviewerComment {
  id: string;
  reviewer: string;
  role: string;
  timestamp: string;
  comment: string;
  action: 'Approved' | 'Rejected' | 'Requested Docs' | 'Note';
}

export interface VerificationRequest {
  id: string;
  referenceNumber: string;
  dateSubmitted: string;
  verificationType: VerificationType;
  personalInfo: PersonalInformation;
  documentInfo: IdDocumentData;
  ocrData: OcrExtractionData;
  selfieData: SelfieVerificationData;
  authenticityData: AuthenticityAnalysisData;
  contactData: ContactValidationData;
  duplicateFraudData: DuplicateFraudData;
  overallConfidenceScore: number;
  status: VerificationStatus;
  assignedReviewer: string;
  adminNotes?: string;
  reviewerComments?: ReviewerComment[];
  auditLog: AuditLogEntry[];
}

export interface AppStateStore {
  executives: Executive[];
  events: DELCAEvent[];
  recommendations: EventRecommendation[];
  invitations: Invitation[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  settings: SystemSettings;
  companies?: Company[];
  opportunities?: BusinessOpportunity[];
  verificationRequests?: VerificationRequest[];
}
