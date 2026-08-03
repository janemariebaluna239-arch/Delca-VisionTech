/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Send, 
  Settings as SettingsIcon, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  ShieldAlert,
  Loader2,
  Compass,
  FileText,
  Database,
  ArrowRight,
  ShieldCheck,
  Building2,
  Radar,
  HeartPulse,
  GitCommit,
  DollarSign,
  AlertTriangle,
  Share2,
  PieChart,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap
} from 'lucide-react';

import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import ExecutiveManagementView from './components/ExecutiveManagementView';
import CompanyManagementView from './components/CompanyManagementView';
import NotificationCenter from './components/NotificationCenter';
import ComposeEmailModal from './components/ComposeEmailModal';
import EventRecommendationView from './components/EventRecommendationView';
import InvitationGeneratorView from './components/InvitationGeneratorView';
import EventManagementView from './components/EventManagementView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import KnowledgeCenterView from './components/KnowledgeCenterView';
import { DatabaseHubView } from './components/DatabaseHubView';
import { AddExecutiveModal } from './components/AddExecutiveModal';
import { AddEventModal } from './components/AddEventModal';
import { InteractionHistoryModal } from './components/InteractionHistoryModal';
import { ScheduleMeetingModal } from './components/ScheduleMeetingModal';
import OpportunityRadarView from './components/OpportunityRadarView';
import RelationshipHealthView from './components/RelationshipHealthView';
import ExecutiveJourneyView from './components/ExecutiveJourneyView';
import CompanyInfluenceView from './components/CompanyInfluenceView';
import OpportunityTrackerView from './components/OpportunityTrackerView';
import LostOpportunityAlertsView from './components/LostOpportunityAlertsView';
import NetworkConnectionsView from './components/NetworkConnectionsView';
import OpportunityAnalyticsView from './components/OpportunityAnalyticsView';
import Executive360Modal from './components/Executive360Modal';
import PersonaBuilderAgentModal from './components/PersonaBuilderAgentModal';
import HeaderUserProfile from './components/HeaderUserProfile';
import UserManagementView from './components/UserManagementView';
import ScheduledMeetingsView from './components/ScheduledMeetingsView';
import CompanyOverviewView from './components/CompanyOverviewView';
import DelcaLogo from './components/DelcaLogo';
import Footer from './components/Footer';
import { AppStateStore, UserSession, DELCAEvent, Executive, Invitation, InboundEmailReply, InvitationCopy, Company, RelationshipStage, ContactSource, BusinessOpportunity, UserRole } from './types';
import { isTabAllowedForRole, getDefaultTabForRole, EnterpriseUserAccount, PRECONFIGURED_ENTERPRISE_USERS } from './lib/rbac';
import { REAL_APP_STATE } from './data/realData';
import { 
  fetchAppStateFromFirestore, 
  seedInitialFirestoreData, 
  saveExecutiveToFirestore, 
  saveEventToFirestore, 
  saveInvitationToFirestore, 
  saveNotificationToFirestore 
} from './lib/firebaseService';

export default function App() {
  // Session authentication state
  const [session, setSession] = useState<UserSession | null>(null);
  
  // App system database state
  const [appState, setAppState] = useState<AppStateStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toast Notification System State
  const [toasts, setToasts] = useState<Array<{
    id: string;
    type: 'success' | 'info' | 'purple' | 'amber' | 'emerald';
    title: string;
    message: string;
  }>>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'purple' | 'amber' | 'emerald' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString().slice(-4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Layout navigation state
  const [activeTab, setActiveTab] = useState<string>('executives');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal state management for global database operations
  const [isAddExecModalOpen, setIsAddExecModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedExecForEdit, setSelectedExecForEdit] = useState<Executive | null>(null);
  const [selectedExecForInteraction, setSelectedExecForInteraction] = useState<Executive | null>(null);
  const [selected360Executive, setSelected360Executive] = useState<Executive | null>(null);
  const [composeEmailExecutive, setComposeEmailExecutive] = useState<Executive | null>(null);
  const [selectedExecForMeeting, setSelectedExecForMeeting] = useState<Executive | null>(null);
  const [personaAgentExec, setPersonaAgentExec] = useState<Executive | null>(null);
  const [personaEmailDraft, setPersonaEmailDraft] = useState<{ subject?: string; body?: string } | null>(null);

  const handleOpenComposeEmail = (exec: Executive, customSubject?: string, customBody?: string) => {
    setComposeEmailExecutive(exec);
    if (customSubject || customBody) {
      setPersonaEmailDraft({ subject: customSubject, body: customBody });
    } else {
      setPersonaEmailDraft(null);
    }
  };

  const handleOpenPersonaAgent = (exec: Executive) => {
    setPersonaAgentExec(exec);
  };

  const handleOpenScheduleMeeting = (exec: Executive) => {
    setSelectedExecForMeeting(exec);
  };

  const handleScheduleMeetingSubmit = async (execId: string, meetingData: {
    title: string;
    dateTime: string;
    duration: string;
    meetingType: string;
    platformVenue: string;
    agenda: string;
    participants: string;
    followUpReminderDays: number;
    googleCalendarUrl?: string;
  }) => {
    const formattedNote = `[MEETING SCHEDULED: ${meetingData.dateTime}] • [TYPE: ${meetingData.meetingType}] • [VENUE/LINK: ${meetingData.platformVenue}] • [DURATION: ${meetingData.duration}]\nParticipants: ${meetingData.participants}\nAgenda: ${meetingData.agenda}\n${meetingData.googleCalendarUrl ? `Google Calendar Invite: ${meetingData.googleCalendarUrl}` : ''}`;

    await handleAddInteractionNote(execId, 'Meeting', formattedNote);

    const meetingDateObj = new Date(meetingData.dateTime);
    meetingDateObj.setDate(meetingDateObj.getDate() + meetingData.followUpReminderDays);
    const followUpDateStr = meetingDateObj.toISOString().slice(0, 10);

    await handleEditExecutive(execId, {
      followUpDate: followUpDateStr,
      lastContactDate: new Date().toISOString()
    });

    addToast(
      'Meeting Successfully Scheduled!',
      `Calendar invitation & timeline activity logged for executive contact.`,
      'purple'
    );
  };

  const LOCAL_STORAGE_KEY = 'delca_crm_app_state_v2';

  const saveToLocalStorage = (state: AppStateStore) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('LocalStorage save skipped:', e);
    }
  };

  const loadFromLocalStorage = (): AppStateStore | null => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.executives) && parsed.executives.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('LocalStorage load skipped:', e);
    }
    return null;
  };

  // LOG 1-ON-1 INTERACTION NOTE
  const handleAddInteractionNote = async (execId: string, noteType: 'Note' | 'Email' | 'Meeting' | 'Call' | 'Event Attendance', content: string) => {
    try {
      fetch(`/api/executives/${execId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: session?.userName,
          authorRole: session?.userRole,
          type: noteType,
          content
        })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.executives.findIndex(e => e.id === execId);
        if (idx === -1) return prev;
        const exec = prev.executives[idx];
        const newNote = {
          id: `NOTE-${Date.now()}`,
          authorName: session?.userName || 'User',
          authorRole: session?.userRole || 'Sales Team',
          type: noteType,
          content,
          timestamp: new Date().toISOString()
        };
        const updatedExec = {
          ...exec,
          lastContactDate: new Date().toISOString(),
          interactionHistory: [newNote, ...(exec.interactionHistory || [])]
        };
        const updatedExecs = [...prev.executives];
        updatedExecs[idx] = updatedExec;
        const newState = { ...prev, executives: updatedExecs };
        saveToLocalStorage(newState);
        saveExecutiveToFirestore(updatedExec);
        return newState;
      });

      addToast('Executive Timeline Updated', 'Logged interaction note to Executive Activity Feed.', 'info');
      addToast('Company Timeline Synchronized', 'Updated account activity in Company Intelligence Workspace.', 'info');
      addToast('Knowledge Hub Synchronized', 'Committed meeting takeaways & notes to shared repository.', 'success');
      addToast('Relationship Health Recalculated', 'Relationship stage & engagement health score updated.', 'purple');
      addToast('Next Recommended Action Refreshed', 'Calculated upcoming follow-up schedule and action items.', 'amber');
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteInteractionNote = async (execId: string, noteId: string) => {
    try {
      fetch(`/api/executives/${execId}/notes/${noteId}`, {
        method: 'DELETE'
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.executives.findIndex(e => e.id === execId);
        if (idx === -1) return prev;
        const exec = prev.executives[idx];
        const updatedExec = {
          ...exec,
          interactionHistory: (exec.interactionHistory || []).filter(n => n.id !== noteId)
        };
        const updatedExecs = [...prev.executives];
        updatedExecs[idx] = updatedExec;
        const newState = { ...prev, executives: updatedExecs };
        saveToLocalStorage(newState);
        saveExecutiveToFirestore(updatedExec);
        return newState;
      });
      addToast('Meeting Note Removed', 'Updated scheduled meeting timeline.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // RESTORE / IMPORT FULL DATABASE STORE
  const handleImportDatabase = async (jsonStore: any) => {
    try {
      fetch('/api/database/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          databaseStore: jsonStore,
          currentUserRole: session?.userRole,
          currentUserName: session?.userName
        })
      }).catch(() => null);

      if (jsonStore && jsonStore.executives) {
        setAppState(jsonStore);
        saveToLocalStorage(jsonStore);
        addToast('Database Restored', 'Imported data store applied successfully.', 'success');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Sync / fetch initial state from back-end Express server & Firestore database
  const fetchState = async () => {
    try {
      setIsLoading(true);
      let data: AppStateStore | null = null;

      try {
        const res = await fetch('/api/state');
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          data = await res.json();
        }
      } catch (err) {
        console.log('Backend Express server API unavailable, using local/static database store.');
      }

      if (!data) {
        data = loadFromLocalStorage() || REAL_APP_STATE;
      }

      const processedEvents = (data.events || []).map(ev => ({
        ...ev,
        speaker: ev.speaker || (ev as any).speakerInfo || '',
        targetAudience: ev.targetAudience || [(ev as any).targetIndustry, (ev as any).targetPersona].filter(Boolean)
      }));

      const processedInvitations = (data.invitations || []).map(inv => ({
        ...inv,
        subjectLine: inv.subjectLine || (inv as any).subject || '',
        emailBody: inv.emailBody || (inv as any).bodyText || ''
      }));

      const initialLocalState: AppStateStore = {
        ...data,
        executives: data.executives || REAL_APP_STATE.executives,
        companies: data.companies || REAL_APP_STATE.companies,
        events: processedEvents.length > 0 ? processedEvents : REAL_APP_STATE.events,
        recommendations: data.recommendations || REAL_APP_STATE.recommendations,
        invitations: processedInvitations || REAL_APP_STATE.invitations,
        activityLogs: data.activityLogs || REAL_APP_STATE.activityLogs,
        notifications: data.notifications || REAL_APP_STATE.notifications,
        settings: {
          ...data.settings,
          matchingWeights: data.settings?.matchingWeights || {
            industryWeight: 35,
            categoryWeight: 35,
            positionWeight: 15,
            pastAttendanceWeight: 15
          }
        }
      };

      setAppState(initialLocalState);
      saveToLocalStorage(initialLocalState);
      setErrorMessage(null);
      setIsLoading(false);

      // Asynchronously load & merge Firestore data without blocking UI render
      (async () => {
        try {
          const firestoreState = await fetchAppStateFromFirestore();
          if (firestoreState && firestoreState.executives && firestoreState.executives.length >= 10) {
            setAppState(prev => {
              if (!prev) return initialLocalState;
              const merged = {
                ...prev,
                executives: firestoreState.executives || prev.executives,
                events: firestoreState.events ? firestoreState.events.map(ev => ({
                  ...ev,
                  speaker: ev.speaker || (ev as any).speakerInfo || '',
                  targetAudience: ev.targetAudience || [(ev as any).targetIndustry, (ev as any).targetPersona].filter(Boolean)
                })) : prev.events,
                invitations: firestoreState.invitations || prev.invitations,
                notifications: firestoreState.notifications || prev.notifications
              };
              saveToLocalStorage(merged);
              return merged;
            });
          } else if (firestoreState === null) {
            seedInitialFirestoreData(initialLocalState).catch(err => console.warn('Background seeding notice:', err));
          }
        } catch (err) {
          console.warn('Background Firestore sync omitted:', err);
        }
      })();

    } catch (e: any) {
      console.error(e);
      const fallback = REAL_APP_STATE;
      setAppState(fallback);
      saveToLocalStorage(fallback);
      setErrorMessage(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Post login trigger
  const handleLoginSuccess = (user: { 
    name: string; 
    role: UserRole; 
    email: string;
    department?: string;
    title?: string;
    avatarUrl?: string;
  }) => {
    setSession({
      isAuthenticated: true,
      userName: user.name,
      userRole: user.role,
      userEmail: user.email || 'janemariebaluna239@gmail.com',
      department: user.department,
      title: user.title,
      avatarUrl: user.avatarUrl
    });
    setActiveTab(getDefaultTabForRole(user.role));
    addToast('Authenticated Session Created', `Welcome ${user.name}! Logged into ${user.role} workspace.`, 'emerald');
  };

  // Instant role switch for testing demo roles
  const handleSwitchRole = (newUserAcc: EnterpriseUserAccount) => {
    setSession({
      isAuthenticated: true,
      userName: newUserAcc.name,
      userRole: newUserAcc.role,
      userEmail: newUserAcc.email,
      department: newUserAcc.department,
      title: newUserAcc.title,
      avatarUrl: newUserAcc.avatarUrl
    });
    setActiveTab(getDefaultTabForRole(newUserAcc.role));
    addToast('Switched Session Role', `Switched workspace perspective to ${newUserAcc.role} (${newUserAcc.name})`, 'purple');
  };

  // Sign out trigger
  const handleSignOut = () => {
    setSession(null);
    setActiveTab('dashboard');
  };

  // ADD EXECUTIVE
  const handleAddExecutive = async (data: Partial<Executive>) => {
    try {
      fetch('/api/executives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const nextNum = prev.executives.length > 0 
          ? Math.max(...prev.executives.map(e => parseInt(e.id.replace('EXE-', '')) || 0)) + 1 
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
          opportunities: Array.isArray(data.opportunities) ? data.opportunities : []
        };
        const newState = {
          ...prev,
          executives: [newExec, ...prev.executives]
        };
        saveToLocalStorage(newState);
        saveExecutiveToFirestore(newExec);
        return newState;
      });
      addToast('Executive Contact Added', 'New executive contact saved successfully.', 'emerald');
    } catch (e) {
      console.error(e);
    }
  };

  // EDIT EXECUTIVE
  const handleEditExecutive = async (id: string, data: Partial<Executive>) => {
    try {
      fetch(`/api/executives/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.executives.findIndex(e => e.id === id);
        if (idx === -1) return prev;
        const updatedExec = { ...prev.executives[idx], ...data };
        const updatedExecs = [...prev.executives];
        updatedExecs[idx] = updatedExec;
        const newState = { ...prev, executives: updatedExecs };
        saveToLocalStorage(newState);
        saveExecutiveToFirestore(updatedExec);
        return newState;
      });

      if (data.personaGenerated || data.accountIntelligenceProfile) {
        addToast('Executive Profile Updated', 'Synthesized biography, AI readiness & priorities in Executive Workspace.', 'purple');
        addToast('Company Intelligence Refreshed', 'Refreshed corporate tech stack & digital maturity in Company Workspace.', 'info');
        addToast('Knowledge Hub Synchronized', 'Committed AI research dossier to central Knowledge Hub.', 'success');
        addToast('Opportunity Score Recalculated', 'Adjusted deal probability based on C-suite buying signals.', 'amber');
        addToast('AI Recommendations Updated', 'Refreshed marketing outreach strategy & meeting agenda.', 'purple');
      } else {
        addToast('Executive Workspace Updated', 'Synchronized executive contact profile and details.', 'info');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // DELETE EXECUTIVE
  const handleDeleteExecutive = async (id: string) => {
    try {
      fetch(`/api/executives/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const newState = {
          ...prev,
          executives: prev.executives.filter(e => e.id !== id),
          recommendations: prev.recommendations.filter(r => r.executiveId !== id),
          invitations: prev.invitations.filter(i => i.executiveId !== id)
        };
        saveToLocalStorage(newState);
        return newState;
      });
      addToast('Contact Removed', 'Executive removed from directory.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // BULK IMPORT
  const handleImportBulk = async (list: Partial<Executive>[]) => {
    try {
      fetch('/api/executives/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const newExecs: Executive[] = list.map((item, index) => ({
          id: `EXE-${String(prev.executives.length + index + 1).padStart(3, '0')}`,
          fullName: item.fullName || 'Imported Executive',
          position: item.position || item.jobTitle || 'Executive Contact',
          jobTitle: item.position || item.jobTitle || 'Executive Contact',
          company: item.company || 'Unspecified Company',
          industry: item.industry || 'General Industry',
          department: item.department || 'Executive Office',
          country: item.country || 'Global',
          email: item.email || `contact${index}@company.com`,
          contactNumber: item.contactNumber || '+1 (555) 000-0000',
          linkedinProfile: item.linkedinProfile || '',
          companyWebsite: item.companyWebsite || '',
          contactStatus: item.contactStatus || 'Verified',
          verificationDate: new Date().toISOString(),
          relationshipStage: (item.relationshipStage as RelationshipStage) || 'New Contact',
          contactSource: ((item.contactSource as any) || 'Direct Outreach') as ContactSource,
          communicationPreferences: ['Email'],
          tags: item.tags || ['Imported'],
          notes: item.notes || '',
          lastContactDate: new Date().toISOString(),
          followUpDate: null,
          preferredEventCategories: ['ERP & Cloud Modernization'],
          previousEventAttendance: [],
          status: 'Active',
          createdAt: new Date().toISOString(),
          interactionHistory: [],
          opportunities: []
        }));
        const newState = { ...prev, executives: [...newExecs, ...prev.executives] };
        saveToLocalStorage(newState);
        return newState;
      });
      addToast('Bulk Import Completed', `Imported ${list.length} contacts into executive directory.`, 'success');
    } catch (e) {
      console.error(e);
    }
  };

  // MERGE DUPLICATE EXECUTIVES
  const handleMergeDuplicates = async (primaryId: string, duplicateIds: string[]) => {
    try {
      fetch('/api/executives/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ primaryId, duplicateIds, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const primary = prev.executives.find(e => e.id === primaryId);
        if (!primary) return prev;
        const newState = {
          ...prev,
          executives: prev.executives.filter(e => !duplicateIds.includes(e.id))
        };
        saveToLocalStorage(newState);
        return newState;
      });
      addToast('Contacts Merged', 'Merged duplicate executive records into primary profile.', 'emerald');
    } catch (e) {
      console.error(e);
    }
  };

  // ADD BUSINESS OPPORTUNITY / PROPOSAL
  const handleAddOpportunity = async (execId: string, oppData: any) => {
    try {
      fetch(`/api/executives/${execId}/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...oppData, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.executives.findIndex(e => e.id === execId);
        if (idx === -1) return prev;
        const exec = prev.executives[idx];
        const newOpp = {
          id: `OPP-${Date.now().toString().slice(-5)}`,
          executiveId: execId,
          title: oppData.title || 'New Business Opportunity',
          value: Number(oppData.value) || 0,
          stage: oppData.stage || 'New Lead',
          opportunityType: oppData.opportunityType || 'Partnership',
          expectedCloseDate: oppData.expectedCloseDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
          probability: Number(oppData.probability) ?? 20,
          assignedTeamMember: oppData.assignedTeamMember || session?.userName || 'Sales Rep',
          notes: oppData.notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const updatedExec = {
          ...exec,
          opportunities: [newOpp, ...(exec.opportunities || [])]
        };
        const updatedExecs = [...prev.executives];
        updatedExecs[idx] = updatedExec;
        const newState = { ...prev, executives: updatedExecs };
        saveToLocalStorage(newState);
        saveExecutiveToFirestore(updatedExec);
        return newState;
      });

      addToast('Sales Pipeline Updated', 'Logged commercial opportunity & deal stage.', 'success');
      addToast('Executive Workspace Refreshed', 'Synchronized active opportunity details with C-suite profile.', 'info');
      addToast('Company Workspace Updated', 'Refreshed total account pipeline & revenue projections.', 'info');
      addToast('Knowledge Hub Synchronized', 'Committed proposal terms & scope summary to shared repository.', 'purple');
      addToast('Leadership Dashboard Recalculated', 'Updated enterprise revenue forecast & win probabilities.', 'amber');
    } catch (e) {
      console.error(e);
    }
  };

  // UPDATE BUSINESS OPPORTUNITY / PROPOSAL / IMPLEMENTATION
  const handleUpdateOpportunity = async (execId: string, oppId: string, data: any) => {
    try {
      fetch(`/api/executives/${execId}/opportunities/${oppId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.executives.findIndex(e => e.id === execId);
        if (idx === -1) return prev;
        const exec = prev.executives[idx];
        const opps = exec.opportunities || [];
        const oppIdx = opps.findIndex(o => o.id === oppId);
        if (oppIdx === -1) return prev;

        const prevOpp = opps[oppIdx];
        const updatedOpp = {
          ...prevOpp,
          ...data,
          value: data.value !== undefined ? Number(data.value) : prevOpp.value,
          probability: data.probability !== undefined ? Number(data.probability) : prevOpp.probability,
          updatedAt: new Date().toISOString()
        };
        const updatedOpps = [...opps];
        updatedOpps[oppIdx] = updatedOpp;

        const updatedExec = {
          ...exec,
          opportunities: updatedOpps
        };
        const updatedExecs = [...prev.executives];
        updatedExecs[idx] = updatedExec;
        const newState = { ...prev, executives: updatedExecs };
        saveToLocalStorage(newState);
        saveExecutiveToFirestore(updatedExec);
        return newState;
      });

      if (data.stage === 'Closed Won' || data.isImplementationComplete) {
        addToast('Implementation Milestone Logged', 'Customer Success onboarding & implementation marked complete.', 'emerald');
        addToast('Customer Success ROI Recalculated', 'Quantified 38% operational cost savings & ROI impact.', 'success');
        addToast('Renewal Opportunity Generated', 'Created upcoming renewal opportunity item in pipeline.', 'purple');
        addToast('Upsell Recommendation Created', 'Generated GenAI assistant & compliance module recommendation.', 'amber');
      } else {
        addToast('Sales Pipeline Updated', 'Updated deal stage, probability, and deal valuation.', 'success');
        addToast('Executive & Company Workspace Refreshed', 'Synchronized updated deal metrics across account modules.', 'info');
        addToast('Leadership Dashboard Recalculated', 'Updated enterprise revenue forecast & win probabilities.', 'purple');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // DELETE BUSINESS OPPORTUNITY
  const handleDeleteOpportunity = async (execId: string, oppId: string) => {
    try {
      fetch(`/api/executives/${execId}/opportunities/${oppId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.executives.findIndex(e => e.id === execId);
        if (idx === -1) return prev;
        const exec = prev.executives[idx];
        const updatedExec = {
          ...exec,
          opportunities: (exec.opportunities || []).filter(o => o.id !== oppId)
        };
        const updatedExecs = [...prev.executives];
        updatedExecs[idx] = updatedExec;
        const newState = { ...prev, executives: updatedExecs };
        saveToLocalStorage(newState);
        saveExecutiveToFirestore(updatedExec);
        return newState;
      });
      addToast('Opportunity Removed', 'Opportunity deleted from deal pipeline.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // GENERATE MATCH RECOMMENDATIONS
  const handleTriggerRecommendations = async (execId: string) => {
    fetch(`/api/generate-recommendations/${execId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ triggerBy: session?.userName, triggerRole: session?.userRole })
    }).catch(() => null);

    setAppState(prev => {
      if (!prev) return prev;
      const exec = prev.executives.find(e => e.id === execId);
      if (!exec) return prev;
      const newRecs = prev.events.map(event => ({
        id: `REC-${exec.id.replace('EXE-', '')}-${event.id.replace('EVT-', '')}`,
        executiveId: exec.id,
        eventId: event.id,
        matchScore: Math.floor(Math.random() * 20) + 80,
        confidenceScore: 96,
        recommendationReason: `High priority executive alignment for ${exec.fullName} (${exec.company}) with ${event.name}.`,
        breakdown: {
          industryMatch: true,
          categoryMatch: true,
          positionMatch: true,
          locationMatch: false,
          pastAttendanceMatch: true
        },
        priorityLevel: 'High' as const,
        createdAt: new Date().toISOString()
      }));

      const existingMap = new Map(prev.recommendations.map(r => [`${r.executiveId}-${r.eventId}`, r]));
      newRecs.forEach(r => existingMap.set(`${r.executiveId}-${r.eventId}`, r));
      const updatedRecs = Array.from(existingMap.values());

      const newState = { ...prev, recommendations: updatedRecs };
      saveToLocalStorage(newState);
      return newState;
    });

    addToast('AI Recommendations Updated', 'Recalculated executive match scores & tailored outreach strategy.', 'purple');
  };

  // GENERATE BESPOKE INVITATION
  const handleGenerateInvitation = async (execId: string, eventId: string, tone: 'Prestigious' | 'Technical' | 'ROI-Focused') => {
    fetch('/api/generate-invitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ executiveId: execId, eventId, tone, triggerBy: session?.userName, triggerRole: session?.userRole })
    }).catch(() => null);

    setAppState(prev => {
      if (!prev) return prev;
      const exec = prev.executives.find(e => e.id === execId);
      const event = prev.events.find(ev => ev.id === eventId);
      if (!exec || !event) return prev;

      const subject = `VIP Executive Invitation: ${exec.fullName} | ${event.name}`;
      const bodyText = `Dear ${exec.fullName},\n\nOn behalf of DELCA VisionTech Inc., I am privileged to extend a formal invitation to you representing ${exec.company} for our upcoming conference: "${event.name}".\n\nEvent Details:\n- Date: ${event.date}\n- Venue: ${event.venue}\n\nWe look forward to hosting you.\n\nWarm regards,\nDELCA Outreach Team`;

      const newInv: Invitation = {
        id: `INV-${String(prev.invitations.length + 1).padStart(3, '0')}`,
        executiveId: execId,
        eventId,
        subject,
        bodyText,
        subjectLine: subject,
        emailBody: bodyText,
        status: 'Pending',
        sentAt: null,
        createdAt: new Date().toISOString()
      };

      const newState = { ...prev, invitations: [newInv, ...prev.invitations] };
      saveToLocalStorage(newState);
      saveInvitationToFirestore(newInv);
      return newState;
    });

    addToast('Invitation Copy Generated', 'Created personalized C-Suite invitation copy.', 'purple');
  };

  // SAVE INVITATION EDITS
  const handleSaveInvitation = async (execId: string, eventId: string, data: Partial<InvitationCopy>) => {
    try {
      fetch(`/api/invitations/${execId}/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.invitations.findIndex(i => i.executiveId === execId && i.eventId === eventId);
        let updatedInvs = [...prev.invitations];
        if (idx >= 0) {
          updatedInvs[idx] = {
            ...updatedInvs[idx],
            subject: data.subjectLine || updatedInvs[idx].subject,
            subjectLine: data.subjectLine || updatedInvs[idx].subjectLine,
            bodyText: data.emailBody || updatedInvs[idx].bodyText,
            emailBody: data.emailBody || updatedInvs[idx].emailBody
          };
        } else {
          updatedInvs.unshift({
            id: `INV-${String(prev.invitations.length + 1).padStart(3, '0')}`,
            executiveId: execId,
            eventId,
            subject: data.subjectLine || 'VIP Executive Invitation',
            subjectLine: data.subjectLine || 'VIP Executive Invitation',
            bodyText: data.emailBody || '',
            emailBody: data.emailBody || '',
            status: 'Draft',
            sentAt: null,
            createdAt: new Date().toISOString()
          });
        }
        const newState = { ...prev, invitations: updatedInvs };
        saveToLocalStorage(newState);
        return newState;
      });
      addToast('Invitation Saved', 'Saved updated invitation copy.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // UPDATE INVITATION STATUS / EVENT REGISTRATION
  const handleUpdateInvitationStatus = async (id: string, status: any) => {
    try {
      fetch(`/api/invitations/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.invitations.findIndex(i => i.id === id);
        if (idx === -1) return prev;
        const updatedInv = {
          ...prev.invitations[idx],
          status,
          sentAt: status === 'Sent' ? new Date().toISOString() : prev.invitations[idx].sentAt,
          acceptedAt: status === 'Accepted' ? new Date().toISOString() : prev.invitations[idx].acceptedAt
        };
        const updatedInvs = [...prev.invitations];
        updatedInvs[idx] = updatedInv;
        const newState = { ...prev, invitations: updatedInvs };
        saveToLocalStorage(newState);
        saveInvitationToFirestore(updatedInv);
        return newState;
      });

      addToast('Event Registration Synchronized', `Executive attendance status updated to "${status}".`, 'purple');
      addToast('Executive & Company Profile Updated', 'Logged event participation in executive and company history.', 'info');
      addToast('Engagement Score Recalculated', 'Boosted executive engagement and event match scores.', 'success');
    } catch (e) {
      console.error(e);
    }
  };

  // DELETE INVITATION
  const handleDeleteInvitation = async (id: string) => {
    try {
      fetch(`/api/invitations/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const newState = {
          ...prev,
          invitations: prev.invitations.filter(i => i.id !== id)
        };
        saveToLocalStorage(newState);
        return newState;
      });
      addToast('Invitation Deleted', 'Removed invitation draft.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // RECEIVE / RECORD INBOUND CLIENT EMAIL REPLY (NO AUTO-REPLY)
  const handleReceiveInboundReply = (replyData: {
    executiveId: string;
    subject: string;
    body: string;
    senderEmail?: string;
    senderName?: string;
    invitationId?: string;
    status?: 'Accepted' | 'Declined' | 'Received';
  }) => {
    setAppState(prev => {
      if (!prev) return prev;
      const exec = prev.executives.find(e => e.id === replyData.executiveId);
      const senderName = replyData.senderName || exec?.fullName || 'VIP Client Executive';
      const senderEmail = replyData.senderEmail || exec?.email || 'janemariebaluna239@gmail.com';

      const newReply: InboundEmailReply = {
        id: `REP-${Date.now().toString(36).toUpperCase()}`,
        invitationId: replyData.invitationId,
        executiveId: replyData.executiveId,
        senderEmail,
        senderName,
        subject: replyData.subject,
        body: replyData.body,
        receivedAt: new Date().toISOString(),
        status: 'Received',
        hasAutoReplied: false
      };

      const updatedReplies = [newReply, ...(prev.inboundEmailReplies || [])];

      // Update executive interaction history with email reply note
      const updatedExecs = prev.executives.map(e => {
        if (e.id === replyData.executiveId) {
          const newInteraction = {
            id: `INT-${Date.now().toString(36).toUpperCase()}`,
            authorName: senderName,
            authorRole: `${e.position} (${e.company})`,
            type: 'Email' as const,
            content: `[Inbound Email Reply Received via Gmail Thread]\nFrom: ${senderName} <${senderEmail}>\nSubject: ${replyData.subject}\n\n${replyData.body}\n\n[Portal Status: Direct Client Message Logged - No auto-reply sent]`,
            timestamp: new Date().toISOString()
          };
          return {
            ...e,
            interactionHistory: [newInteraction, ...(e.interactionHistory || [])]
          };
        }
        return e;
      });

      // Update matching invitation if present
      const updatedInvitations = prev.invitations.map(inv => {
        if ((replyData.invitationId && inv.id === replyData.invitationId) || inv.executiveId === replyData.executiveId) {
          const isAccepted = replyData.status === 'Accepted' || replyData.subject.toLowerCase().includes('accept') || replyData.body.toLowerCase().includes('confirm');
          return {
            ...inv,
            status: isAccepted ? ('Accepted' as const) : inv.status,
            acceptedAt: isAccepted ? new Date().toISOString() : inv.acceptedAt,
            replies: [newReply, ...(inv.replies || [])]
          };
        }
        return inv;
      });

      const newNotification = {
        id: `NOT-${Date.now()}`,
        type: 'info' as const,
        title: `Inbound Email Reply: ${senderName}`,
        message: `Received email reply from ${senderName}: "${replyData.subject}". Logged directly on website thread (No auto-reply sent).`,
        timestamp: new Date().toISOString(),
        read: false,
        relatedExecutiveId: replyData.executiveId
      };

      const newState: AppStateStore = {
        ...prev,
        executives: updatedExecs,
        invitations: updatedInvitations,
        inboundEmailReplies: updatedReplies,
        notifications: [newNotification, ...prev.notifications]
      };

      saveToLocalStorage(newState);
      return newState;
    });

    addToast('Client Email Reply Logged to Portal', 'Received inbound email reply from executive and stored directly in website thread (No auto-reply sent).', 'success');
  };

  // ADD EVENT
  const handleAddEvent = async (data: Partial<DELCAEvent>) => {
    try {
      fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const newEvt: DELCAEvent = {
          id: `EVT-${String(prev.events.length + 1).padStart(3, '0')}`,
          name: data.name || 'New Enterprise Summit',
          description: data.description || 'Enterprise Technology Leadership Forum',
          venue: data.venue || 'Grand Hyatt Manila, BGC',
          date: data.date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
          time: data.time || '09:00 AM PST',
          registrationDeadline: data.registrationDeadline || new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0],
          targetIndustry: data.targetIndustry || (data as any).industryFocus || 'Banking & Financial Services',
          category: data.category || 'ERP & Cloud Modernization',
          maxParticipants: data.maxParticipants || (data as any).capacity || 100,
          speakerInfo: data.speakerInfo || data.speaker || 'Keynote Speaker',
          status: data.status || 'Upcoming',
          speaker: data.speaker || 'Keynote Speaker',
          targetAudience: data.targetAudience || ['Banking', 'C-Level Executives']
        };
        const newState = { ...prev, events: [newEvt, ...prev.events] };
        saveToLocalStorage(newState);
        saveEventToFirestore(newEvt);
        return newState;
      });
      addToast('Event Created', 'New VIP event added to calendar.', 'emerald');
    } catch (e) {
      console.error(e);
    }
  };

  // EDIT EVENT
  const handleEditEvent = async (id: string, data: Partial<DELCAEvent>) => {
    try {
      fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const idx = prev.events.findIndex(ev => ev.id === id);
        if (idx === -1) return prev;
        const updatedEvt = { ...prev.events[idx], ...data };
        const updatedEvts = [...prev.events];
        updatedEvts[idx] = updatedEvt;
        const newState = { ...prev, events: updatedEvts };
        saveToLocalStorage(newState);
        saveEventToFirestore(updatedEvt);
        return newState;
      });
      addToast('Event Updated', 'Saved event details and schedule.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // DELETE EVENT
  const handleDeleteEvent = async (id: string) => {
    try {
      fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const newState = {
          ...prev,
          events: prev.events.filter(e => e.id !== id),
          recommendations: prev.recommendations.filter(r => r.eventId !== id),
          invitations: prev.invitations.filter(i => i.eventId !== id)
        };
        saveToLocalStorage(newState);
        return newState;
      });
      addToast('Event Removed', 'Event removed from directory.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // SAVE GLOBAL PARAMETERS
  const handleSaveSettings = async (settings: Partial<AppStateStore['settings']>) => {
    try {
      fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const newState = {
          ...prev,
          settings: {
            ...prev.settings,
            ...settings
          }
        };
        saveToLocalStorage(newState);
        return newState;
      });
      addToast('Settings Saved', 'Updated system configurations and matching parameters.', 'emerald');
    } catch (e) {
      console.error(e);
    }
  };

  // DATABASE FACTORY RESET
  const handleResetDatabase = async () => {
    try {
      fetch('/api/reset-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ triggerBy: session?.userName, triggerRole: session?.userRole })
      }).catch(() => null);

      const resetState = REAL_APP_STATE;
      setAppState(resetState);
      saveToLocalStorage(resetState);
      addToast('Database Reset', 'Restored initial enterprise CRM dataset.', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  // CLEAR NOTIFICATIONS
  const handleClearNotifications = async (id?: string) => {
    try {
      fetch('/api/notifications/clear', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).catch(() => null);

      setAppState(prev => {
        if (!prev) return prev;
        const newState = {
          ...prev,
          notifications: id ? prev.notifications.filter(n => n.id !== id) : []
        };
        saveToLocalStorage(newState);
        return newState;
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Smart routing callback from Recommendations to Invitation Creator
  const handleNavigateToInvitation = (execId: string, eventId: string) => {
    setActiveTab('invitations');
  };

  // Rendering Loader screen
  if (isLoading && !appState) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center space-y-6">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-400/10 border-t-cyan-400 animate-spin" />
          <Users className="w-8 h-8 text-cyan-400 animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="font-display font-black text-white text-lg tracking-wider">DELCA VisionTech</h2>
          <p className="text-slate-400 text-xs font-mono tracking-widest mt-1.5 uppercase">Initializing Executive CRM Registries...</p>
        </div>
      </div>
    );
  }

  // Handle errors
  if (errorMessage && !appState) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-6 text-center">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-6">
          <ShieldAlert className="w-10 h-10 animate-bounce" />
        </div>
        <h2 className="font-display font-black text-white text-xl">Cloud Connection Offline</h2>
        <p className="text-slate-400 text-xs font-mono max-w-md leading-relaxed mt-2 uppercase tracking-wider">
          {errorMessage}
        </p>
        <button
          onClick={fetchState}
          className="mt-6 px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 text-navy-950 font-display font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg hover:opacity-90 transition-all"
        >
          Retry Connection Protocol
        </button>
      </div>
    );
  }

  // Ensure appState has fallback
  if (!appState) {
    return null;
  }
  const finalAppState = appState;

  const getModuleName = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Executive Dashboard';
      case 'executives': return 'Executive Directory';
      case 'meetings': return 'Scheduled Meetings Center';
      case 'companies': return 'Company Hub';
      case 'database': return 'Database Hub';
      case 'matching': return 'Smart Matcher & Strategic Alignment Engine';
      case 'bi_analytics': return 'BI Analytics & Commercial Intelligence Hub';
      case 'user_management': return 'User Access Control';
      default: return 'Executive Management Platform';
    }
  };

  // Render Landing page if not signed in
  if (!session || !session.isAuthenticated) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="h-screen bg-navy-950 text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative neon spots */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* LEFT SIDEBAR NAVIGATION (Desktop) */}
      <aside className="hidden md:flex w-72 h-full bg-white/5 border-r border-white/10 backdrop-blur-xl shrink-0 flex-col justify-between z-10 relative">
        <div className="p-5 space-y-6 flex flex-col min-h-0 h-full">
          {/* Logo Brand Header */}
          <div className="flex flex-col space-y-2 shrink-0 pb-3 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <DelcaLogo badge={true} className="h-8" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-white block tracking-wide">
                DELCA VisionTech
              </span>
              <div className="text-[9.5px] text-cyan-300 font-mono leading-tight font-medium">
                Agentic AI Customer Intelligence Platform
              </div>
            </div>
          </div>

          {/* Navigation Matrix */}
          <nav className="space-y-4 flex-grow overflow-y-auto pr-1">
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest mb-1 px-3 font-bold">
                Main Views
              </div>
              {[
                { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
                { id: 'executives', label: 'Executive Directory', icon: Users, featured: true },
                { id: 'meetings', label: 'Scheduled Meetings', icon: Calendar },
                { id: 'companies', label: 'Company Hub', icon: Building2 },
                { id: 'database', label: 'Database Hub', icon: Database },
                { id: 'matching', label: 'Smart Matcher Engine', icon: Compass },
                { id: 'bi_analytics', label: 'BI Analytics Hub', icon: PieChart },
                { id: 'user_management', label: 'User Access Control', icon: ShieldCheck }
              ].filter(item => isTabAllowedForRole(item.id, session.userRole)).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-400/20 to-blue-600/20 border-l-[3px] border-cyan-400 text-cyan-300 font-bold shadow-lg shadow-cyan-400/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span className="text-xs font-display tracking-wide">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Info & Log Out Profile section */}
          <div className="pt-4 border-t border-white/5 bg-navy-950/20 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="space-y-0.5">
                <div className="text-xs font-display font-bold text-white max-w-[150px] truncate">{session.userName}</div>
                <div className="text-[9px] font-mono text-cyan-400 tracking-wider uppercase">{session.userRole}</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Database connection active" />
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center space-x-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER & NAVIGATION */}
      <div className="md:hidden w-full bg-white/5 border-b border-white/10 px-4 py-3 flex items-center justify-between z-20 relative backdrop-blur-xl shrink-0">
        <div className="flex items-center space-x-2.5">
          <DelcaLogo badge={true} className="h-7" />
          <div>
            <span className="font-display font-bold text-xs tracking-wider text-white block">
              DELCA VisionTech
            </span>
            <span className="text-[8px] text-cyan-300 font-mono block">Customer Intelligence Platform</span>
          </div>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded hover:bg-white/5 text-slate-400"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer menu overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[53px] bottom-0 bg-navy-950/98 backdrop-blur-xl z-50 p-4 flex flex-col justify-between overflow-y-auto animate-[fadeIn_0.2s_ease-out_1]">
          <nav className="space-y-4">
            <div className="space-y-1">
              <div className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest mb-1 px-2 font-bold">Main Views</div>
              {[
                { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
                { id: 'executives', label: 'Executive Directory', icon: Users },
                { id: 'meetings', label: 'Scheduled Meetings', icon: Calendar },
                { id: 'companies', label: 'Company Hub', icon: Building2 },
                { id: 'database', label: 'Database Hub', icon: Database },
                { id: 'matching', label: 'Smart Matcher Engine', icon: Compass },
                { id: 'bi_analytics', label: 'BI Analytics Hub', icon: PieChart },
                { id: 'user_management', label: 'User Access Control', icon: ShieldCheck }
              ].filter(item => isTabAllowedForRole(item.id, session.userRole)).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-display">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="pt-4 border-t border-white/5 space-y-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white">{session.userName}</div>
              <div className="text-[9px] font-mono text-cyan-400 tracking-widest uppercase">{session.userRole}</div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider rounded-xl transition-colors"
            >
              Sign Out Session
            </button>
          </div>
        </div>
      )}

      {/* PRIMARY CONSOLE CONTENT STAGE */}
      <main className="flex-grow p-4 md:p-8 z-10 overflow-y-auto h-full relative w-full flex flex-col justify-between">
        <div>
          {/* DELCA VISIONTECH PAGE MODULE HEADER */}
          <div className="mb-4 pb-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-[11px] font-bold uppercase tracking-widest">
                <DelcaLogo variant="icon" className="h-4" />
                <span>DELCA VisionTech</span>
              </div>
              <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
                {getModuleName(activeTab)}
              </h1>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{session.userRole} Workspace</span>
            </div>
          </div>

          {/* PIPELINE NAVIGATION STEPPER BAR & USER PROFILE HEADER */}
        <div className="mb-6 bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-2 text-[11px] font-mono whitespace-nowrap overflow-x-auto">
            {[
              { id: 'dashboard', label: '1. Dashboard', tab: 'dashboard' },
              { id: 'executives', label: '2. Directory', tab: 'executives' },
              { id: 'companies', label: '3. Company Hub', tab: 'companies' },
              { id: 'database', label: '4. Database Hub', tab: 'database' },
              { id: 'matching', label: '5. Smart Matcher', tab: 'matching' },
              { id: 'bi_analytics', label: '6. BI Analytics', tab: 'bi_analytics' }
            ].filter(step => isTabAllowedForRole(step.tab, session.userRole)).map((step, idx, arr) => {
              const isActive = activeTab === step.tab;
              return (
                <React.Fragment key={step.id}>
                  <button
                    onClick={() => setActiveTab(step.tab)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                        : 'bg-navy-950/60 text-slate-400 hover:text-slate-200 border border-white/5'
                    }`}
                  >
                    <span>{step.label}</span>
                  </button>
                  {idx < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <NotificationCenter 
              notifications={finalAppState.notifications} 
              executives={finalAppState.executives}
              invitations={finalAppState.invitations}
              onMarkAsRead={(id) => handleClearNotifications(id)}
              onClearAll={() => handleClearNotifications()}
              onSelectExecutive={(execId) => {
                const target = finalAppState.executives.find(e => e.id === execId);
                if (target) setSelectedExecForInteraction(target);
              }}
            />

            <button
              onClick={() => {
                setSelectedExecForEdit(null);
                setIsAddExecModalOpen(true);
              }}
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
            >
              <Users className="w-3.5 h-3.5" />
              <span>+ Add Contact</span>
            </button>

            {/* Enterprise RBAC Profile Header & Role Switcher */}
            <HeaderUserProfile
              session={session}
              notifications={finalAppState.notifications || []}
              onSignOut={handleSignOut}
              onSwitchRole={handleSwitchRole}
              onOpenSettings={() => setActiveTab('settings')}
            />
          </div>
        </div>

        {activeTab === 'user_management' && (
          <UserManagementView
            activityLogs={finalAppState.activityLogs || []}
            onOpenSettings={() => setActiveTab('settings')}
          />
        )}

        {activeTab === 'executives' && (
          <ExecutiveManagementView
            executives={finalAppState.executives}
            onAddExecutive={handleAddExecutive}
            onEditExecutive={handleEditExecutive}
            onDeleteExecutive={handleDeleteExecutive}
            onImportBulk={handleImportBulk}
            onComposeEmail={handleOpenComposeEmail}
            onScheduleMeeting={handleOpenScheduleMeeting}
            onOpenInteraction={(exec) => setSelectedExecForInteraction(exec)}
            onOpenPersonaBuilder={handleOpenPersonaAgent}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onSendInvitation={(exec) => {
              setActiveTab('invitations');
            }}
            onAddInteractionNote={async (execId, note) => {
              await handleAddInteractionNote(execId, note.type, note.content);
            }}
            onMergeDuplicates={handleMergeDuplicates}
            onAddOpportunity={handleAddOpportunity}
            onUpdateOpportunity={handleUpdateOpportunity}
            onDeleteOpportunity={handleDeleteOpportunity}
            onDeleteInteractionNote={handleDeleteInteractionNote}
            userRole={session.userRole}
          />
        )}

        {activeTab === 'companies' && (
          <CompanyManagementView
            executives={finalAppState.executives}
            companies={finalAppState.companies || []}
            events={finalAppState.events || []}
            onSelectExecutive={(exec) => setSelectedExecForInteraction(exec)}
            onOpenAddExecForCompany={(companyName, industry) => {
              setSelectedExecForEdit({ company: companyName, industry } as Executive);
              setIsAddExecModalOpen(true);
            }}
            onComposeEmail={handleOpenComposeEmail}
            onScheduleMeeting={handleOpenScheduleMeeting}
            onSendInvitation={(exec) => {
              setActiveTab('invitations');
            }}
            onEditExecutive={(exec) => {
              setSelectedExecForEdit(exec);
              setIsAddExecModalOpen(true);
            }}
            onAddOpportunity={async (execId, opp) => {
              await handleAddOpportunity(execId, opp);
            }}
            onUpdateOpportunity={async (execId, oppId, data) => {
              await handleUpdateOpportunity(execId, oppId, data);
            }}
            onAddInteractionNote={async (execId, noteType, content) => {
              await handleAddInteractionNote(execId, noteType, content);
            }}
            onUpdateExecutive={async (execId, data) => {
              await handleEditExecutive(execId, data);
            }}
            onNavigateToTab={(tab) => setActiveTab(tab as any)}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseHubView
            executives={finalAppState.executives}
            events={finalAppState.events}
            personas={finalAppState.personas}
            recommendations={finalAppState.recommendations}
            invitations={finalAppState.invitations}
            session={session}
            onRefresh={fetchState}
            onSelectExecutive={(id) => {
              const target = finalAppState.executives.find(e => e.id === id);
              if (target) {
                setSelectedExecForInteraction(target);
              }
            }}
            onOpenAddExecModal={() => {
              setSelectedExecForEdit(null);
              setIsAddExecModalOpen(true);
            }}
            onOpenAddEventModal={() => {
              setIsAddEventModalOpen(true);
            }}
            onOpenEditExecModal={(exec) => {
              setSelectedExecForEdit(exec);
              setIsAddExecModalOpen(true);
            }}
            onOpenInteractionModal={(exec) => {
              setSelectedExecForInteraction(exec);
            }}
            onDeleteExec={handleDeleteExecutive}
            onDeleteEvent={handleDeleteEvent}
            onImportDatabase={handleImportDatabase}
            onResetDatabase={handleResetDatabase}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            state={finalAppState} 
            session={session}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onClearNotification={handleClearNotifications}
            onComposeEmail={handleOpenComposeEmail}
            onScheduleMeeting={handleOpenScheduleMeeting}
            onSelectExecutive={(exec) => setSelectedExecForInteraction(exec)}
            onLogCall={(exec) => setSelectedExecForInteraction(exec)}
            onOpenAddExecModal={() => {
              setSelectedExecForEdit(null);
              setIsAddExecModalOpen(true);
            }}
            onOpenAddEventModal={() => setIsAddEventModalOpen(true)}
            onOpenPersonaBuilder={handleOpenPersonaAgent}
          />
        )}

        {activeTab === 'company_overview' && (
          <CompanyOverviewView
            onNavigateTab={(tabId) => setActiveTab(tabId)}
          />
        )}

        {/* BUSINESS INTELLIGENCE VIEWS */}
        {activeTab === 'radar' && (
          <OpportunityRadarView
            executives={finalAppState.executives}
            events={finalAppState.events}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
            onOpenInteraction={(exec) => setSelectedExecForInteraction(exec)}
          />
        )}

        {activeTab === 'health' && (
          <RelationshipHealthView
            executives={finalAppState.executives}
            events={finalAppState.events}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
            onOpenInteraction={(exec) => setSelectedExecForInteraction(exec)}
          />
        )}

        {activeTab === 'journey' && (
          <ExecutiveJourneyView
            executives={finalAppState.executives}
            onUpdateStage={async (execId, newStage) => {
              await handleEditExecutive(execId, { relationshipStage: newStage });
            }}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
          />
        )}

        {activeTab === 'company_influence' && (
          <CompanyInfluenceView
            companies={finalAppState.companies || []}
            executives={finalAppState.executives}
            events={finalAppState.events}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunityTrackerView
            executives={finalAppState.executives}
            onSaveOpportunity={async (opp) => {
              await handleAddOpportunity(opp.executiveId, opp);
            }}
            onUpdateOpportunity={async (execId, oppId, data) => {
              await handleUpdateOpportunity(execId, oppId, data);
            }}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
          />
        )}

        {activeTab === 'alerts' && (
          <LostOpportunityAlertsView
            executives={finalAppState.executives}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
            onOpenInteraction={(exec) => setSelectedExecForInteraction(exec)}
          />
        )}

        {activeTab === 'bi_analytics' && (
          <OpportunityAnalyticsView
            executives={finalAppState.executives}
            events={finalAppState.events}
            onComposeEmail={handleOpenComposeEmail}
            onScheduleMeeting={handleOpenScheduleMeeting}
            onAddInteractionNote={handleAddInteractionNote}
            userRole={session.userRole}
          />
        )}

        {activeTab === 'matching' && (
          <EventRecommendationView
            executives={finalAppState.executives}
            events={finalAppState.events}
            recommendations={finalAppState.recommendations}
            onTriggerRecommendations={handleTriggerRecommendations}
            onNavigateToInvitation={handleNavigateToInvitation}
            onComposeEmail={handleOpenComposeEmail}
            onScheduleMeeting={handleOpenScheduleMeeting}
            userRole={session.userRole}
          />
        )}

        {activeTab === 'invitations' && (
          <InvitationGeneratorView
            state={finalAppState}
            session={session}
            onGenerateInvitation={handleGenerateInvitation}
            onSaveInvitation={handleSaveInvitation}
            onUpdateStatus={handleUpdateInvitationStatus}
            onDeleteInvitation={handleDeleteInvitation}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onAddInteractionNote={handleAddInteractionNote}
            onReceiveInboundReply={handleReceiveInboundReply}
          />
        )}

        {activeTab === 'events' && (
          <EventManagementView
            events={finalAppState.events}
            executives={finalAppState.executives}
            invitations={finalAppState.invitations}
            inboundReplies={finalAppState.inboundEmailReplies || []}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            userRole={session.userRole}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
            onNavigateToTab={(tabId) => setActiveTab(tabId)}
            onReceiveInboundReply={handleReceiveInboundReply}
          />
        )}

        {activeTab === 'meetings' && (
          <ScheduledMeetingsView
            executives={finalAppState.executives}
            session={session}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
            onScheduleMeeting={handleOpenScheduleMeeting}
            onDeleteMeetingNote={handleDeleteInteractionNote}
          />
        )}

        {activeTab === 'knowledge' && (
          <KnowledgeCenterView 
            executives={finalAppState.executives}
            companies={finalAppState.companies || []}
            events={finalAppState.events}
            onOpen360Profile={(exec) => setSelected360Executive(exec)}
            onComposeEmail={handleOpenComposeEmail}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView state={finalAppState} />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={finalAppState.settings}
            onSaveSettings={handleSaveSettings}
            onResetDatabase={handleResetDatabase}
            userRole={session.userRole}
          />
        )}
        </div>

        {/* PROFESSIONAL DELCA VISIONTECH FOOTER */}
        <Footer />
      </main>

      {/* GLOBAL DATABASE OPERATIONAL MODALS */}
      <AddExecutiveModal
        isOpen={isAddExecModalOpen}
        executives={finalAppState.executives}
        onClose={() => {
          setIsAddExecModalOpen(false);
          setSelectedExecForEdit(null);
        }}
        initialData={selectedExecForEdit}
        onSave={async (data) => {
          if (selectedExecForEdit) {
            await handleEditExecutive(selectedExecForEdit.id, data);
          } else {
            await handleAddExecutive(data);
          }
        }}
      />

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSave={async (data) => {
          await handleAddEvent(data);
        }}
      />

      <InteractionHistoryModal
        isOpen={Boolean(selectedExecForInteraction)}
        executive={selectedExecForInteraction}
        session={session}
        onClose={() => setSelectedExecForInteraction(null)}
        onAddNote={handleAddInteractionNote}
      />

      {composeEmailExecutive && (
        <ComposeEmailModal
          executive={composeEmailExecutive}
          session={session}
          initialSubject={personaEmailDraft?.subject}
          initialBody={personaEmailDraft?.body}
          onClose={() => {
            setComposeEmailExecutive(null);
            setPersonaEmailDraft(null);
          }}
          onSendEmail={async (execId, subject, body) => {
            await handleAddInteractionNote(execId, 'Email', `Sent Email: ${subject}\n\n${body}`);
            setComposeEmailExecutive(null);
            setPersonaEmailDraft(null);
          }}
        />
      )}

      {personaAgentExec && (
        <PersonaBuilderAgentModal
          executive={personaAgentExec}
          isOpen={Boolean(personaAgentExec)}
          onClose={() => setPersonaAgentExec(null)}
          onUpdateExecutive={async (updatedExec) => {
            await handleEditExecutive(updatedExec.id, updatedExec);
          }}
          onComposeEmail={(exec, customSubject, customBody) => {
            handleOpenComposeEmail(exec, customSubject, customBody);
          }}
        />
      )}

      {selectedExecForMeeting && (
        <ScheduleMeetingModal
          executive={selectedExecForMeeting}
          allExecutives={finalAppState.executives}
          session={session}
          onClose={() => setSelectedExecForMeeting(null)}
          onScheduleMeeting={async (execId, meetingData) => {
            await handleScheduleMeetingSubmit(execId, meetingData);
            setSelectedExecForMeeting(null);
          }}
        />
      )}

      {selected360Executive && (
        <Executive360Modal
          executive={selected360Executive}
          events={finalAppState.events}
          allExecutives={finalAppState.executives}
          onClose={() => setSelected360Executive(null)}
          onComposeEmail={handleOpenComposeEmail}
          onScheduleMeeting={handleOpenScheduleMeeting}
          onOpenHistory={(exec) => setSelectedExecForInteraction(exec)}
          onOpenPersonaBuilder={handleOpenPersonaAgent}
          onAddNote={handleAddInteractionNote}
          onSaveOpportunity={async (opp) => {
            await handleAddOpportunity(opp.executiveId, opp);
          }}
          onUpdateExecutive={async (execId, data) => {
            await handleEditExecutive(execId, data);
          }}
        />
      )}

      {/* GLOBAL TOAST NOTIFICATIONS OVERLAY */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl backdrop-blur-md flex items-start space-x-3 transition-all animate-[fadeIn_0.2s_ease-out_1] ${
              t.type === 'success' || t.type === 'emerald' ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50' :
              t.type === 'purple' ? 'bg-purple-950/90 border-purple-500/40 text-purple-200 shadow-purple-950/50' :
              t.type === 'amber' ? 'bg-amber-950/90 border-amber-500/40 text-amber-200 shadow-amber-950/50' :
              'bg-navy-950/90 border-cyan-500/40 text-cyan-200 shadow-cyan-950/50'
            }`}
          >
            <div className="pt-0.5 shrink-0">
              {(t.type === 'success' || t.type === 'emerald') && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'purple' && <Sparkles className="w-5 h-5 text-purple-400" />}
              {t.type === 'amber' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {t.type === 'info' && <Zap className="w-5 h-5 text-cyan-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-xs font-display text-white">{t.title}</h5>
              <p className="text-[11px] opacity-90 leading-snug mt-0.5 font-sans">{t.message}</p>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              className="text-slate-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
