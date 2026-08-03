import { UserRole } from '../types';

export interface EnterpriseUserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  title: string;
  avatarUrl: string;
  bio: string;
  permissionsSummary: string[];
}

export const PRECONFIGURED_ENTERPRISE_USERS: EnterpriseUserAccount[] = [
  {
    id: 'usr-admin-01',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@delca.vision',
    role: 'Administrator',
    department: 'IT & Enterprise Operations',
    title: 'Chief Information & Platform Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Oversees DELCA platform architecture, security rules, RBAC user provisioning, and AI research engine synchronization.',
    permissionsSummary: [
      'Full System Administration & User Provisioning',
      'Manage Platform Health & Database Backups',
      'Configure AI Model & Matching Engine Parameters',
      'Full Access to All 6 Department Workspaces'
    ]
  },
  {
    id: 'usr-mktg-02',
    name: 'Marcus Vance',
    email: 'marcus.vance@delca.vision',
    role: 'Marketing',
    department: 'Marketing & Enterprise Growth',
    title: 'Head of Growth & Audience Segmentation',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Drives C-Suite audience segmentation, AI campaign recommendations, executive invitations, and marketing attribution.',
    permissionsSummary: [
      'Manage Campaign & Audience Dashboards',
      'Generate AI-Targeted Invitation Copies',
      'Access Executive Segments & Industry Signals',
      'View Event Marketing Analytics & ROI'
    ]
  },
  {
    id: 'usr-sales-03',
    name: 'David Chen',
    email: 'david.chen@delca.vision',
    role: 'Sales',
    department: 'Enterprise Sales & Business Development',
    title: 'VP of Enterprise Commercial Sales',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Leads high-ticket enterprise deal closing, account pipeline velocity, AI opportunity scoring, and C-Suite outreach.',
    permissionsSummary: [
      'Manage Commercial Sales Pipeline & Deals',
      'Log Executive Interaction & Meeting Briefs',
      'Create & Transmit SOW Proposals',
      'Monitor Buying Signals & At-Risk Account Alerts'
    ]
  },
  {
    id: 'usr-events-04',
    name: 'Elena Rostova',
    email: 'elena.rostova@delca.vision',
    role: 'Event Management',
    department: 'Global Events & VIP Relations',
    title: 'Director of C-Suite Event Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Curates C-level executive summits, digital banking forums, VIP seminar logistics, and AI event matching.',
    permissionsSummary: [
      'Create & Manage Executive Events & Venues',
      'Track VIP Registrations & Attendance Rates',
      'Execute AI Event-to-Executive Matching',
      'Analyze Event ROI & Pipeline Attribution'
    ]
  },
  {
    id: 'usr-cs-05',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@delca.vision',
    role: 'Customer Success',
    department: 'Client Operations & Account Health',
    title: 'VP of Enterprise Customer Success',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Ensures post-sale implementation excellence, account health scoring, contract renewals, and relationship risk mitigation.',
    permissionsSummary: [
      'Monitor Active Client Health & Risk Scores',
      'Track Implementation & Deployment Milestones',
      'Manage Renewal Pipelines & Expansion Leads',
      'Log Post-Sale Touchpoints & SOW Progress'
    ]
  },
  {
    id: 'usr-lead-06',
    name: 'Victoria Sterling',
    email: 'victoria.sterling@delca.vision',
    role: 'Leadership',
    department: 'Executive Office',
    title: 'Chief Executive Officer & Managing Director',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    bio: 'Coordinates overall enterprise direction, strategic revenue forecasts, high-level C-suite relationships, and BI reports.',
    permissionsSummary: [
      'Full Executive Leadership Dashboard & Analytics',
      'View Real-Time Revenue & Pipeline Forecasts',
      'Review AI Strategic Insights & Growth Drivers',
      'Approve Major High-Ticket SOW Proposals'
    ]
  }
];

export interface NavigationItemDef {
  id: string;
  label: string;
  category: 'Core' | 'Intelligence' | 'Commercial' | 'Events' | 'System';
  allowedRoles: UserRole[];
}

export const PLATFORM_NAVIGATION_ITEMS: NavigationItemDef[] = [
  {
    id: 'dashboard',
    label: 'Executive Dashboard',
    category: 'Core',
    allowedRoles: ['Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership']
  },
  {
    id: 'executives',
    label: 'Executive Directory',
    category: 'Core',
    allowedRoles: ['Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership']
  },
  {
    id: 'meetings',
    label: 'Scheduled Meetings',
    category: 'Core',
    allowedRoles: ['Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership']
  },
  {
    id: 'companies',
    label: 'Company Hub',
    category: 'Core',
    allowedRoles: ['Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership']
  },
  {
    id: 'database',
    label: 'Database Hub',
    category: 'System',
    allowedRoles: ['Administrator']
  },
  {
    id: 'matching',
    label: 'Smart Matcher Engine',
    category: 'Intelligence',
    allowedRoles: ['Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership']
  },
  {
    id: 'bi_analytics',
    label: 'BI Analytics',
    category: 'Intelligence',
    allowedRoles: ['Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership']
  },
  {
    id: 'user_management',
    label: 'User Access Control',
    category: 'System',
    allowedRoles: ['Administrator']
  }
];

export const getDefaultTabForRole = (role: UserRole): string => {
  switch (role) {
    case 'Administrator':
      return 'dashboard';
    case 'Marketing':
      return 'dashboard';
    case 'Sales':
      return 'dashboard';
    case 'Event Management':
      return 'dashboard';
    case 'Customer Success':
      return 'dashboard';
    case 'Leadership':
      return 'dashboard';
    default:
      return 'dashboard';
  }
};

export const isTabAllowedForRole = (tabId: string, role?: UserRole | null): boolean => {
  if (!role) return false;
  if (role === 'Administrator') return true;
  const item = PLATFORM_NAVIGATION_ITEMS.find(i => i.id === tabId);
  if (!item) return true; // Default allow if unmapped
  return item.allowedRoles.includes(role);
};

export interface RolePermissionMatrix {
  canAddExecutive: boolean;
  canEditExecutive: boolean;
  canDeleteExecutive: boolean;
  canManageOpportunities: boolean;
  canManageEvents: boolean;
  canSendInvitations: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canExportDatabase: boolean;
  canImportDatabase: boolean;
  canEditHealthScores: boolean;

  // Granular RBAC Permissions
  canViewDatabaseHub: boolean;
  canViewRawStoreInspector: boolean;
  canViewOpportunityScore: boolean;
  canViewDealsTab: boolean;
  canViewSalesIntelligence: boolean;
  canViewAfterSalesTab: boolean;
  canViewFullReferralNetwork: boolean;
  canViewPhoneAndLinkedIn: boolean;
  canViewIndividualTelemetry: boolean;
  canViewPersonaProfiling: boolean;
  canUseSolutionFit: boolean;
  canUseEventAlignment: boolean;
  requiresLeadershipDrilldownAudit: boolean;
}

export const getRolePermissions = (role?: UserRole | null): RolePermissionMatrix => {
  if (role === 'Administrator') {
    return {
      canAddExecutive: true,
      canEditExecutive: true,
      canDeleteExecutive: true,
      canManageOpportunities: true,
      canManageEvents: true,
      canSendInvitations: true,
      canManageUsers: true,
      canManageSettings: true,
      canExportDatabase: true,
      canImportDatabase: true,
      canEditHealthScores: true,
      canViewDatabaseHub: true,
      canViewRawStoreInspector: true,
      canViewOpportunityScore: true,
      canViewDealsTab: true,
      canViewSalesIntelligence: true,
      canViewAfterSalesTab: true,
      canViewFullReferralNetwork: true,
      canViewPhoneAndLinkedIn: true,
      canViewIndividualTelemetry: true,
      canViewPersonaProfiling: true,
      canUseSolutionFit: true,
      canUseEventAlignment: true,
      requiresLeadershipDrilldownAudit: false
    };
  }

  if (role === 'Marketing') {
    return {
      canAddExecutive: true,
      canEditExecutive: true,
      canDeleteExecutive: false,
      canManageOpportunities: false,
      canManageEvents: true,
      canSendInvitations: true,
      canManageUsers: false,
      canManageSettings: false,
      canExportDatabase: false,
      canImportDatabase: false,
      canEditHealthScores: false,
      canViewDatabaseHub: false,
      canViewRawStoreInspector: false,
      canViewOpportunityScore: false,
      canViewDealsTab: false,
      canViewSalesIntelligence: false,
      canViewAfterSalesTab: false,
      canViewFullReferralNetwork: false,
      canViewPhoneAndLinkedIn: false,
      canViewIndividualTelemetry: false,
      canViewPersonaProfiling: true,
      canUseSolutionFit: false,
      canUseEventAlignment: true,
      requiresLeadershipDrilldownAudit: false
    };
  }

  if (role === 'Sales') {
    return {
      canAddExecutive: true,
      canEditExecutive: true,
      canDeleteExecutive: false,
      canManageOpportunities: true,
      canManageEvents: false,
      canSendInvitations: true,
      canManageUsers: false,
      canManageSettings: false,
      canExportDatabase: false,
      canImportDatabase: false,
      canEditHealthScores: true,
      canViewDatabaseHub: false,
      canViewRawStoreInspector: false,
      canViewOpportunityScore: true,
      canViewDealsTab: true,
      canViewSalesIntelligence: true,
      canViewAfterSalesTab: false,
      canViewFullReferralNetwork: false,
      canViewPhoneAndLinkedIn: true,
      canViewIndividualTelemetry: true,
      canViewPersonaProfiling: true,
      canUseSolutionFit: true,
      canUseEventAlignment: true,
      requiresLeadershipDrilldownAudit: false
    };
  }

  if (role === 'Event Management') {
    return {
      canAddExecutive: true,
      canEditExecutive: true,
      canDeleteExecutive: false,
      canManageOpportunities: false,
      canManageEvents: true,
      canSendInvitations: true,
      canManageUsers: false,
      canManageSettings: false,
      canExportDatabase: false,
      canImportDatabase: false,
      canEditHealthScores: false,
      canViewDatabaseHub: false,
      canViewRawStoreInspector: false,
      canViewOpportunityScore: false,
      canViewDealsTab: false,
      canViewSalesIntelligence: false,
      canViewAfterSalesTab: false,
      canViewFullReferralNetwork: false,
      canViewPhoneAndLinkedIn: false,
      canViewIndividualTelemetry: false,
      canViewPersonaProfiling: false,
      canUseSolutionFit: false,
      canUseEventAlignment: true,
      requiresLeadershipDrilldownAudit: false
    };
  }

  if (role === 'Customer Success') {
    return {
      canAddExecutive: true,
      canEditExecutive: true,
      canDeleteExecutive: false,
      canManageOpportunities: true,
      canManageEvents: false,
      canSendInvitations: false,
      canManageUsers: false,
      canManageSettings: false,
      canExportDatabase: false,
      canImportDatabase: false,
      canEditHealthScores: true,
      canViewDatabaseHub: false,
      canViewRawStoreInspector: false,
      canViewOpportunityScore: false,
      canViewDealsTab: false,
      canViewSalesIntelligence: false,
      canViewAfterSalesTab: true,
      canViewFullReferralNetwork: false,
      canViewPhoneAndLinkedIn: true,
      canViewIndividualTelemetry: false,
      canViewPersonaProfiling: true,
      canUseSolutionFit: false,
      canUseEventAlignment: false,
      requiresLeadershipDrilldownAudit: false
    };
  }

  if (role === 'Leadership') {
    return {
      canAddExecutive: false,
      canEditExecutive: true,
      canDeleteExecutive: false,
      canManageOpportunities: true,
      canManageEvents: false,
      canSendInvitations: true,
      canManageUsers: false,
      canManageSettings: false,
      canExportDatabase: true,
      canImportDatabase: false,
      canEditHealthScores: true,
      canViewDatabaseHub: false,
      canViewRawStoreInspector: false,
      canViewOpportunityScore: true,
      canViewDealsTab: true,
      canViewSalesIntelligence: true,
      canViewAfterSalesTab: true,
      canViewFullReferralNetwork: true,
      canViewPhoneAndLinkedIn: false, // Default hidden unless logged drill-down
      canViewIndividualTelemetry: false,
      canViewPersonaProfiling: true,
      canUseSolutionFit: true,
      canUseEventAlignment: true,
      requiresLeadershipDrilldownAudit: true
    };
  }

  // Default fallback
  return {
    canAddExecutive: false,
    canEditExecutive: false,
    canDeleteExecutive: false,
    canManageOpportunities: false,
    canManageEvents: false,
    canSendInvitations: false,
    canManageUsers: false,
    canManageSettings: false,
    canExportDatabase: false,
    canImportDatabase: false,
    canEditHealthScores: false,
    canViewDatabaseHub: false,
    canViewRawStoreInspector: false,
    canViewOpportunityScore: false,
    canViewDealsTab: false,
    canViewSalesIntelligence: false,
    canViewAfterSalesTab: false,
    canViewFullReferralNetwork: false,
    canViewPhoneAndLinkedIn: false,
    canViewIndividualTelemetry: false,
    canViewPersonaProfiling: false,
    canUseSolutionFit: false,
    canUseEventAlignment: false,
    requiresLeadershipDrilldownAudit: false
  };
};
