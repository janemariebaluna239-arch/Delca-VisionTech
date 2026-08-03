import { BusinessOpportunity, BusinessOpportunityStage } from '../types';

export interface StageRules {
  assignedStaff: string;
  probability: number;
  daysToClose: number;
}

export const STAGE_DEFAULTS: Record<BusinessOpportunityStage, StageRules> = {
  'New Lead': {
    assignedStaff: 'Jane Marie Baluna',
    probability: 20,
    daysToClose: 60,
  },
  'Qualified': {
    assignedStaff: 'David Tan',
    probability: 35,
    daysToClose: 50,
  },
  'Discovery': {
    assignedStaff: 'Sophia Reyes',
    probability: 45,
    daysToClose: 40,
  },
  'Solution Presentation': {
    assignedStaff: 'Johnathan Vance',
    probability: 60,
    daysToClose: 30,
  },
  'Proposal Sent': {
    assignedStaff: 'Sophia Reyes',
    probability: 70,
    daysToClose: 20,
  },
  'Negotiation': {
    assignedStaff: 'Johnathan Vance',
    probability: 85,
    daysToClose: 14,
  },
  'Contract Review': {
    assignedStaff: 'Elena Rostova',
    probability: 95,
    daysToClose: 7,
  },
  'Won': {
    assignedStaff: 'Elena Rostova',
    probability: 100,
    daysToClose: 0,
  },
  'Lost': {
    assignedStaff: 'Jane Marie Baluna',
    probability: 0,
    daysToClose: 0,
  },
  'Closed': {
    assignedStaff: 'Marcus Thorne',
    probability: 100,
    daysToClose: 0,
  }
};

export function getUpdatedOpportunityForStage(
  opp: BusinessOpportunity,
  newStage: BusinessOpportunityStage,
  accountManagerName?: string
): { updatedOpp: BusinessOpportunity; logNote: string } {
  const rules = STAGE_DEFAULTS[newStage] || STAGE_DEFAULTS['New Lead'];
  
  const today = new Date();
  let targetDateStr = today.toISOString().split('T')[0];
  if (rules.daysToClose > 0) {
    const futureDate = new Date(today.getTime() + rules.daysToClose * 24 * 60 * 60 * 1000);
    targetDateStr = futureDate.toISOString().split('T')[0];
  }

  const assignedStaff = accountManagerName || rules.assignedStaff;
  const newProbability = rules.probability;
  const expectedRevenue = Math.round((opp.value || 0) * (newProbability / 100));

  const updatedOpp: BusinessOpportunity = {
    ...opp,
    stage: newStage,
    assignedTeamMember: assignedStaff,
    probability: newProbability,
    expectedCloseDate: targetDateStr,
    updatedAt: new Date().toISOString()
  };

  const logNote = `Opportunity "${opp.title}" transitioned to stage [${newStage}]. Assigned Staff: ${assignedStaff}. Win Probability: ${newProbability}% (Expected Revenue: $${expectedRevenue.toLocaleString()}). Target Close Date: ${targetDateStr}.`;

  return { updatedOpp, logNote };
}
