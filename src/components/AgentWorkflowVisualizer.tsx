import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  BrainCircuit, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  UserCheck, 
  TrendingUp, 
  Database, 
  FileText, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  Activity
} from 'lucide-react';

export interface WorkflowStep {
  id: string;
  name: string;
  agentRole: string;
  description: string;
  status: 'completed' | 'running' | 'pending' | 'idle';
  outputSnippet?: string;
  updatedModules: string[];
}

interface AgentWorkflowVisualizerProps {
  onWorkflowComplete?: () => void;
  compact?: boolean;
  autoRun?: boolean;
}

export default function AgentWorkflowVisualizer({
  onWorkflowComplete,
  compact = false,
  autoRun = false
}: AgentWorkflowVisualizerProps) {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(autoRun ? 0 : 7); // Default completed if not autoRun

  const steps: WorkflowStep[] = [
    {
      id: 'step-1',
      name: 'Identity Research Agent',
      agentRole: 'Executive Profiling AI',
      description: 'Crawls C-Suite biography, leadership trajectory, decision-making style, and career history.',
      status: activeStepIndex > 0 ? 'completed' : activeStepIndex === 0 && isRunning ? 'running' : 'completed',
      outputSnippet: 'Verified C-Suite profile & background credentials.',
      updatedModules: ['Executive Workspace', 'Executive Persona']
    },
    {
      id: 'step-2',
      name: 'Company Research Agent',
      agentRole: 'Enterprise Architecture AI',
      description: 'Scans corporate revenue, employee count, tech stack, SAP S/4HANA ERP environment, and digital roadmap.',
      status: activeStepIndex > 1 ? 'completed' : activeStepIndex === 1 && isRunning ? 'running' : activeStepIndex > 0 ? 'pending' : 'completed',
      outputSnippet: 'Cataloged hybrid cloud infrastructure & ERP migration target.',
      updatedModules: ['Company Intelligence Workspace', 'AI Readiness']
    },
    {
      id: 'step-3',
      name: 'Industry Intelligence Agent',
      agentRole: 'Sector Compliance & Market AI',
      description: 'Analyzes ASEAN market trends, BSP Circular 1105 compliance mandates, and competitor AI adoption.',
      status: activeStepIndex > 2 ? 'completed' : activeStepIndex === 2 && isRunning ? 'running' : activeStepIndex > 1 ? 'pending' : 'completed',
      outputSnippet: 'Mapped BSP/SEC regulatory constraints & market opportunities.',
      updatedModules: ['Industry Intelligence', 'Leadership Analytics']
    },
    {
      id: 'step-4',
      name: 'Persona Builder Agent',
      agentRole: 'C-Suite Buying Signal Compiler',
      description: 'Synthesizes buying signals, pain points, ROI value proposition, and personalized outreach scripts.',
      status: activeStepIndex > 3 ? 'completed' : activeStepIndex === 3 && isRunning ? 'running' : activeStepIndex > 2 ? 'pending' : 'completed',
      outputSnippet: 'Generated executive sales pitch & tailored email copy.',
      updatedModules: ['Executive Persona', 'Opportunity Score']
    },
    {
      id: 'step-5',
      name: 'Knowledge Hub Updated',
      agentRole: 'Central Repository Engine',
      description: 'Commits AI research briefing document, tags, and strategic notes to company shared knowledge hub.',
      status: activeStepIndex > 4 ? 'completed' : activeStepIndex === 4 && isRunning ? 'running' : activeStepIndex > 3 ? 'pending' : 'completed',
      outputSnippet: 'Indexed research dossier in multi-department knowledge hub.',
      updatedModules: ['Knowledge Hub', 'Shared Knowledge']
    },
    {
      id: 'step-6',
      name: 'Executive Workspace Updated',
      agentRole: '360° Profile Sync Agent',
      description: 'Updates executive biography, AI readiness score (88/100), strategic priorities, and contact timeline.',
      status: activeStepIndex > 5 ? 'completed' : activeStepIndex === 5 && isRunning ? 'running' : activeStepIndex > 4 ? 'pending' : 'completed',
      outputSnippet: 'Refreshed 360° executive scorecard and relationship health.',
      updatedModules: ['Executive Workspace', 'Relationship Health']
    },
    {
      id: 'step-7',
      name: 'Company Workspace Updated',
      agentRole: 'Enterprise Account Sync Agent',
      description: 'Synchronizes corporate fundamentals, tech stack, active deals, and relationship activity timeline.',
      status: activeStepIndex > 6 ? 'completed' : activeStepIndex === 6 && isRunning ? 'running' : activeStepIndex > 5 ? 'pending' : 'completed',
      outputSnippet: 'Synchronized account roadmap and deal pipeline totals.',
      updatedModules: ['Company Workspace', 'Sales Pipeline']
    },
    {
      id: 'step-8',
      name: 'Marketing and Sales Recommendations Refreshed',
      agentRole: 'Strategy Orchestration Engine',
      description: 'Recalculates event match scores, sales opportunity probability, and explainable next action items.',
      status: activeStepIndex >= 7 ? 'completed' : activeStepIndex === 7 && isRunning ? 'running' : 'pending',
      outputSnippet: 'Updated next actions & VIP Summit invitation recommendation.',
      updatedModules: ['Sales Recommendations', 'Event Match Score']
    }
  ];

  const triggerPipeline = () => {
    setIsRunning(true);
    setActiveStepIndex(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setActiveStepIndex(step);
      if (step >= steps.length - 1) {
        clearInterval(interval);
        setIsRunning(false);
        if (onWorkflowComplete) onWorkflowComplete();
      }
    }, 600);
  };

  useEffect(() => {
    if (autoRun) {
      triggerPipeline();
    }
  }, [autoRun]);

  if (compact) {
    return (
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-purple-500/30 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-2">
          <span className="font-bold text-purple-300 flex items-center space-x-1.5">
            <Bot className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Agent Cross-Platform Collaboration Workflow</span>
          </span>
          <button
            onClick={triggerPipeline}
            disabled={isRunning}
            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-[10px] font-bold border border-purple-500/30 flex items-center space-x-1 transition-all"
          >
            <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Orchestrating Agents...' : 'Re-run Workflow'}</span>
          </button>
        </div>

        {/* Horizontal Chain Flow */}
        <div className="flex items-center overflow-x-auto custom-scrollbar pb-1 gap-1.5 text-[10px] font-mono">
          {steps.map((st, idx) => {
            const isDone = st.status === 'completed';
            const isCurrent = st.status === 'running';

            return (
              <React.Fragment key={st.id}>
                <div
                  className={`px-2.5 py-1.5 rounded-lg border whitespace-nowrap shrink-0 flex items-center space-x-1.5 transition-all ${
                    isDone 
                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
                      : isCurrent 
                      ? 'bg-purple-950/80 border-purple-500 text-purple-200 animate-pulse' 
                      : 'bg-white/5 border-white/10 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Sparkles className="w-3 h-3 text-purple-400 animate-spin shrink-0" />
                  ) : (
                    <span className="text-slate-600 font-bold">{idx + 1}</span>
                  )}
                  <span className="font-bold">{st.name}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-950 border border-purple-500/40 shadow-2xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-sm sm:text-base text-white flex items-center space-x-2">
              <span>AI Agent Collaborative Orchestration Workflow</span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                EVENT-DRIVEN ARCHITECTURE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Automatic cross-platform data synchronization across Marketing, Sales, Events & Leadership
            </p>
          </div>
        </div>

        <button
          onClick={triggerPipeline}
          disabled={isRunning}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-purple-200 text-xs font-bold font-mono border border-purple-500/40 flex items-center space-x-2 transition-all shadow-lg"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-purple-300 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Synchronizing Modules...' : 'Run Agent Research & Sync'}</span>
        </button>
      </div>

      {/* Visual Step Chain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((st, idx) => {
          const isDone = st.status === 'completed';
          const isCurrent = st.status === 'running';

          return (
            <div
              key={st.id}
              className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between space-y-2 transition-all ${
                isDone
                  ? 'bg-navy-900/90 border-emerald-500/40 text-slate-200'
                  : isCurrent
                  ? 'bg-purple-950/80 border-purple-500 text-purple-100 ring-2 ring-purple-500/30 animate-pulse'
                  : 'bg-navy-950/60 border-white/5 text-slate-500 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className={`px-2 py-0.5 rounded font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : isCurrent ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-400'}`}>
                    STEP {idx + 1}
                  </span>

                  {isDone ? (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Updated</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="text-purple-300 font-bold flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                      <span>Syncing...</span>
                    </span>
                  ) : (
                    <span className="text-slate-500">Pending</span>
                  )}
                </div>

                <h5 className="font-bold text-white text-xs font-display flex items-center space-x-1 mt-1">
                  <span>{st.name}</span>
                </h5>

                <p className="text-[10.5px] text-slate-400 leading-snug">
                  {st.description}
                </p>
              </div>

              {/* Updated Modules Tags */}
              <div className="pt-2 border-t border-white/5 space-y-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase block">Synchronized Modules:</span>
                <div className="flex flex-wrap gap-1">
                  {st.updatedModules.map((mod, mIdx) => (
                    <span key={mIdx} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 text-cyan-300 border border-white/10">
                      {mod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
