/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Executive, ContactHealth, RelationshipStage, ContactSource, DELCAEvent } from '../types';

export function calculateProfileCompleteness(exec: Executive): number {
  let score = 0;
  const total = 10;
  if (exec.fullName && exec.fullName.trim() !== '') score += 1;
  if ((exec.position || exec.jobTitle) && (exec.position || exec.jobTitle || '').trim() !== '') score += 1;
  if (exec.company && exec.company.trim() !== '') score += 1;
  if (exec.email && exec.email.trim() !== '') score += 1;
  if ((exec.contactNumber || exec.phoneNumber) && (exec.contactNumber || exec.phoneNumber || '').trim() !== '') score += 1;
  if (exec.linkedinProfile && exec.linkedinProfile.trim() !== '') score += 1;
  if (exec.companyWebsite && exec.companyWebsite.trim() !== '') score += 1;
  if (exec.country && exec.country.trim() !== '') score += 1;
  if (exec.avatarUrl && exec.avatarUrl.trim() !== '') score += 1;
  if (exec.notes && exec.notes.trim() !== '') score += 1;
  return Math.round((score / total) * 100);
}

export function getContactHealth(exec: Executive): ContactHealth {
  const today = new Date().toISOString().split('T')[0];
  if (exec.followUpDate && exec.followUpDate <= today) {
    return 'Needs Follow-Up';
  }
  if (exec.lastContactDate) {
    const daysSince = Math.floor((new Date().getTime() - new Date(exec.lastContactDate).getTime()) / (1000 * 3600 * 24));
    if (daysSince > 90) return 'At Risk';
  } else {
    return 'At Risk';
  }
  return 'Healthy';
}

export interface DuplicateGroup {
  primary: Executive;
  duplicates: Executive[];
  reason: string;
}

export function findDuplicateContacts(executives: Executive[]): DuplicateGroup[] {
  const result: DuplicateGroup[] = [];
  const visited = new Set<string>();

  for (let i = 0; i < executives.length; i++) {
    const e1 = executives[i];
    if (visited.has(e1.id)) continue;

    const dupes: Executive[] = [];
    let reason = '';

    for (let j = i + 1; j < executives.length; j++) {
      const e2 = executives[j];
      if (visited.has(e2.id)) continue;

      const p1Email = e1.email?.toLowerCase().trim();
      const p2Email = e2.email?.toLowerCase().trim();
      const sameEmail = Boolean(p1Email && p2Email && p1Email === p2Email);

      const p1Phone = (e1.contactNumber || e1.phoneNumber || '').replace(/\D/g, '');
      const p2Phone = (e2.contactNumber || e2.phoneNumber || '').replace(/\D/g, '');
      const samePhone = Boolean(p1Phone.length >= 7 && p1Phone === p2Phone);

      const p1LinkedIn = e1.linkedinProfile?.toLowerCase().trim();
      const p2LinkedIn = e2.linkedinProfile?.toLowerCase().trim();
      const sameLinkedIn = Boolean(p1LinkedIn && p2LinkedIn && p1LinkedIn.replace(/\/$/, '') === p2LinkedIn.replace(/\/$/, ''));

      const sameNameCompany = Boolean(
        e1.fullName && e2.fullName && e1.company && e2.company &&
        e1.fullName.toLowerCase().trim() === e2.fullName.toLowerCase().trim() &&
        e1.company.toLowerCase().trim() === e2.company.toLowerCase().trim()
      );

      if (sameEmail) {
        dupes.push(e2);
        reason = `Matching email address (${e1.email})`;
        visited.add(e2.id);
      } else if (samePhone) {
        dupes.push(e2);
        reason = `Matching phone number (${e1.contactNumber || e1.phoneNumber})`;
        visited.add(e2.id);
      } else if (sameLinkedIn) {
        dupes.push(e2);
        reason = `Matching LinkedIn profile URL`;
        visited.add(e2.id);
      } else if (sameNameCompany) {
        dupes.push(e2);
        reason = `Matching name & corporate account (${e1.fullName} @ ${e1.company})`;
        visited.add(e2.id);
      }
    }

    if (dupes.length > 0) {
      visited.add(e1.id);
      result.push({ primary: e1, duplicates: dupes, reason });
    }
  }

  return result;
}

// Executive Referral Chain Helper
export interface ReferralNode {
  exec: Executive;
  relationship: 'Self' | 'Referred By' | 'Referred Contact';
}

export function getReferralChain(execId: string, executives: Executive[]): ReferralNode[] {
  const current = executives.find(e => e.id === execId);
  if (!current) return [];

  const chain: ReferralNode[] = [];

  // Find direct referrer
  if (current.referredById) {
    const referrer = executives.find(e => e.id === current.referredById);
    if (referrer) {
      chain.push({ exec: referrer, relationship: 'Referred By' });
    }
  }

  // Current node
  chain.push({ exec: current, relationship: 'Self' });

  // Find contacts referred by current
  const refereeContacts = executives.filter(e => e.referredById === execId);
  refereeContacts.forEach(ref => {
    chain.push({ exec: ref, relationship: 'Referred Contact' });
  });

  return chain;
}

// Executive Network Connections Helper
export interface ConnectedExecutive {
  executive: Executive;
  connectionReasons: string[];
}

export function getNetworkConnections(
  targetExec: Executive, 
  allExecutives: Executive[], 
  events: DELCAEvent[] = []
): ConnectedExecutive[] {
  const connectionsMap = new Map<string, ConnectedExecutive>();

  allExecutives.forEach(other => {
    if (other.id === targetExec.id) return;

    const reasons: string[] = [];

    // 1. Same Company
    if (
      targetExec.company && other.company &&
      targetExec.company.trim().toLowerCase() === other.company.trim().toLowerCase()
    ) {
      reasons.push(`Corporate Colleague @ ${targetExec.company}`);
    }

    // 2. Industry Peer
    if (
      targetExec.industry && other.industry &&
      targetExec.industry.trim().toLowerCase() === other.industry.trim().toLowerCase() &&
      targetExec.company.trim().toLowerCase() !== other.company.trim().toLowerCase()
    ) {
      reasons.push(`Industry Peer (${targetExec.industry})`);
    }

    // 3. Referral Relationship
    if (other.referredById === targetExec.id) {
      reasons.push(`Directly Referred by ${targetExec.fullName}`);
    } else if (targetExec.referredById === other.id) {
      reasons.push(`Referred ${targetExec.fullName} into System`);
    }

    // 4. Shared Event Attendance
    if (targetExec.previousEventAttendance && other.previousEventAttendance) {
      const sharedEvents = targetExec.previousEventAttendance.filter(evtName => 
        other.previousEventAttendance.includes(evtName)
      );
      if (sharedEvents.length > 0) {
        reasons.push(`Co-Attended: ${sharedEvents.slice(0, 2).join(', ')}`);
      }
    }

    if (reasons.length > 0) {
      connectionsMap.set(other.id, {
        executive: other,
        connectionReasons: reasons
      });
    }
  });

  return Array.from(connectionsMap.values());
}

export interface HealthScoreResult {
  score: number;
  status: 'Thriving' | 'Moderate' | 'At Risk';
  factors: { label: string; points: number; positive: boolean }[];
}

export function calculateRelationshipHealthScore(exec: Executive): HealthScoreResult {
  let score = 50;
  const factors: { label: string; points: number; positive: boolean }[] = [];
  const today = new Date();

  // 1. Last Contact Recency
  if (exec.lastContactDate) {
    const daysSince = Math.floor((today.getTime() - new Date(exec.lastContactDate).getTime()) / (1000 * 3600 * 24));
    if (daysSince <= 14) {
      score += 20;
      factors.push({ label: `Recent Contact (${daysSince}d ago)`, points: 20, positive: true });
    } else if (daysSince <= 30) {
      score += 10;
      factors.push({ label: `Contact within 30d (${daysSince}d ago)`, points: 10, positive: true });
    } else if (daysSince > 60) {
      score -= 25;
      factors.push({ label: `Inactive for ${daysSince} days`, points: -25, positive: false });
    }
  } else {
    score -= 20;
    factors.push({ label: 'No recorded past contact', points: -20, positive: false });
  }

  // 2. Follow-Up Compliance
  if (exec.followUpDate) {
    const todayStr = today.toISOString().split('T')[0];
    if (exec.followUpDate < todayStr) {
      score -= 20;
      factors.push({ label: `Overdue Follow-Up (${exec.followUpDate})`, points: -20, positive: false });
    } else {
      score += 15;
      factors.push({ label: `Scheduled Follow-Up (${exec.followUpDate})`, points: 15, positive: true });
    }
  }

  // 3. Event Attendance
  const eventsAttended = exec.previousEventAttendance ? exec.previousEventAttendance.length : 0;
  if (eventsAttended > 0) {
    const points = Math.min(eventsAttended * 10, 30);
    score += points;
    factors.push({ label: `Attended ${eventsAttended} VIP Event(s)`, points, positive: true });
  }

  // 4. Active Business Opportunities
  const activeOpps = (exec.opportunities || []).filter(o => o.stage !== 'Closed' && o.stage !== 'Won');
  if (activeOpps.length > 0) {
    const points = activeOpps.length * 15;
    score += points;
    factors.push({ label: `${activeOpps.length} Active Business Opportunity(ies)`, points, positive: true });
  }

  // 5. Interaction Note Volume
  const notesCount = exec.interactionHistory ? exec.interactionHistory.length : 0;
  if (notesCount >= 3) {
    score += 10;
    factors.push({ label: `Rich Interaction History (${notesCount} logs)`, points: 10, positive: true });
  }

  const finalScore = Math.max(0, Math.min(100, score));
  let status: 'Thriving' | 'Moderate' | 'At Risk' = 'Moderate';
  if (finalScore >= 75) status = 'Thriving';
  else if (finalScore < 45) status = 'At Risk';

  return { score: finalScore, status, factors };
}

export interface LostOpportunityAlert {
  id: string;
  type: 'Overdue Follow-Up' | 'Stalled Opportunity' | 'Stale Contact' | 'Uninvited VIP';
  severity: 'Critical' | 'High' | 'Medium';
  executive: Executive;
  title: string;
  description: string;
  recommendedAction: string;
}

export function getLostOpportunityAlerts(executives: Executive[]): LostOpportunityAlert[] {
  const alerts: LostOpportunityAlert[] = [];
  const todayStr = new Date().toISOString().split('T')[0];
  const nowMs = new Date().getTime();

  executives.forEach(exec => {
    // 1. Overdue Follow-up
    if (exec.followUpDate && exec.followUpDate < todayStr) {
      alerts.push({
        id: `ALERT-FW-${exec.id}`,
        type: 'Overdue Follow-Up',
        severity: 'Critical',
        executive: exec,
        title: `Overdue Follow-Up with ${exec.fullName}`,
        description: `Scheduled follow-up date was ${exec.followUpDate}. Action is required to maintain relationship momentum.`,
        recommendedAction: 'Schedule Call or Send Direct Email'
      });
    }

    // 2. Stale Contact (>30 days)
    if (exec.lastContactDate) {
      const daysSince = Math.floor((nowMs - new Date(exec.lastContactDate).getTime()) / (1000 * 3600 * 24));
      if (daysSince > 30) {
        alerts.push({
          id: `ALERT-STALE-${exec.id}`,
          type: 'Stale Contact',
          severity: daysSince > 60 ? 'Critical' : 'High',
          executive: exec,
          title: `No Contact for ${daysSince} Days (${exec.fullName})`,
          description: `Last activity recorded on ${new Date(exec.lastContactDate).toLocaleDateString()}. Executive relationship is fading.`,
          recommendedAction: 'Send Re-engagement VIP Briefing'
        });
      }
    }

    // 3. Stalled Opportunity (>14 days without update)
    (exec.opportunities || []).forEach(opp => {
      if (opp.stage !== 'Closed' && opp.stage !== 'Won') {
        const updatedMs = new Date(opp.updatedAt || opp.createdAt).getTime();
        const daysInactive = Math.floor((nowMs - updatedMs) / (1000 * 3600 * 24));
        if (daysInactive > 14) {
          alerts.push({
            id: `ALERT-OPP-${opp.id}`,
            type: 'Stalled Opportunity',
            severity: opp.value > 100000 ? 'Critical' : 'High',
            executive: exec,
            title: `Inactive Deal: ${opp.title} ($${opp.value.toLocaleString()})`,
            description: `Opportunity stage '${opp.stage}' unchanged for ${daysInactive} days. Risk of deal drop-off.`,
            recommendedAction: 'Follow up on Proposal Status'
          });
        }
      }
    });
  });

  return alerts.sort((a, b) => (a.severity === 'Critical' ? -1 : 1));
}

export function mergeDuplicateContacts(primary: Executive, duplicates: Executive[]): Executive {
  const merged: Executive = { ...primary };

  // Combine interaction histories
  const allHistory = [...(primary.interactionHistory || [])];
  duplicates.forEach(d => {
    (d.interactionHistory || []).forEach(note => {
      if (!allHistory.some(h => h.id === note.id)) {
        allHistory.push(note);
      }
    });
  });
  merged.interactionHistory = allHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Combine tags
  const tagSet = new Set([...(primary.tags || [])]);
  duplicates.forEach(d => (d.tags || []).forEach(t => tagSet.add(t)));
  merged.tags = Array.from(tagSet);

  // Combine event attendance
  const eventSet = new Set([...(primary.previousEventAttendance || [])]);
  duplicates.forEach(d => (d.previousEventAttendance || []).forEach(e => eventSet.add(e)));
  merged.previousEventAttendance = Array.from(eventSet);

  // Combine opportunities
  const allOpps = [...(primary.opportunities || [])];
  duplicates.forEach(d => {
    (d.opportunities || []).forEach(opp => {
      if (!allOpps.some(o => o.id === opp.id)) {
        allOpps.push(opp);
      }
    });
  });
  merged.opportunities = allOpps;

  // Combine notes
  const extraNotes = duplicates.map(d => d.notes).filter(Boolean).join(' | ');
  if (extraNotes) {
    merged.notes = `${primary.notes || ''}\n[Merged Duplicate Records Notes: ${extraNotes}]`.trim();
  }

  return merged;
}

export const RELATIONSHIP_STAGES: RelationshipStage[] = [
  'New Contact',
  'Qualified Lead',
  'Invited',
  'Event Attendee',
  'Meeting Held',
  'Proposal Sent',
  'Partnership',
  'Active Client'
];

export const CONTACT_SOURCES: ContactSource[] = [
  'LinkedIn',
  'Company Website',
  'Referral',
  'Conference',
  'Webinar',
  'Networking Event',
  'Direct Outreach'
];
