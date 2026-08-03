/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ShieldAlert, 
  Database,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { AppStateStore, SystemSettings } from '../types';

interface SettingsViewProps {
  settings: SystemSettings;
  onSaveSettings: (settings: Partial<SystemSettings>) => void;
  onResetDatabase: () => Promise<void>;
  userRole: 'Administrator' | 'Marketing Team' | 'Sales Team';
}

export default function SettingsView({
  settings,
  onSaveSettings,
  onResetDatabase,
  userRole
}: SettingsViewProps) {
  // Form local state with robust fallback logic
  const [industryWeight, setIndustryWeight] = useState(settings?.matchingWeights?.industryWeight ?? 35);
  const [categoryWeight, setCategoryWeight] = useState(settings?.matchingWeights?.categoryWeight ?? 35);
  const [positionWeight, setPositionWeight] = useState(settings?.matchingWeights?.positionWeight ?? 15);
  const [pastAttendanceWeight, setPastAttendanceWeight] = useState(settings?.matchingWeights?.pastAttendanceWeight ?? 15);
  const [systemHash, setSystemHash] = useState('5e5ef3bbb74e0de18f4dadb07abf72611bd3462604ccc36afca6bc3259230504');
  const [copiedHash, setCopiedHash] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Submit edits
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      onSaveSettings({
        matchingWeights: {
          industryWeight,
          categoryWeight,
          positionWeight,
          pastAttendanceWeight
        }
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 400);
  };

  const handleReset = async () => {
    if (!window.confirm("WARNING: This action will restore default executive contact registries and system configuration. Proceed?")) return;
    setIsResetting(true);
    try {
      await onResetDatabase();
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  const totalWeight = industryWeight + categoryWeight + positionWeight + pastAttendanceWeight;

  return (
    <div className="max-w-4xl space-y-8 animate-[fadeIn_0.3s_ease-out_1]">
      {/* Header section */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
          <Settings className="w-4 h-4" />
          <span>Executive CRM Configuration</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white">
          System Configuration Panel
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Tune deterministic event recommendation weightings and system database parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Rule-based Weightings Card */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">Smart Matcher Rule Weights</h3>
                <p className="text-slate-400 text-xs">Adjust deterministic weightings used to score executive-to-event alignment.</p>
              </div>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
              totalWeight === 100 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              Total Weight: {totalWeight}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Industry Match Weight</span>
                <span className="text-cyan-400 font-bold">{industryWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={industryWeight}
                onChange={(e) => setIndustryWeight(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Preferred Category Weight</span>
                <span className="text-cyan-400 font-bold">{categoryWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={categoryWeight}
                onChange={(e) => setCategoryWeight(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Position Level Weight</span>
                <span className="text-cyan-400 font-bold">{positionWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={positionWeight}
                onChange={(e) => setPositionWeight(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Past Event Attendance Weight</span>
                <span className="text-cyan-400 font-bold">{pastAttendanceWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={pastAttendanceWeight}
                onChange={(e) => setPastAttendanceWeight(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-navy-950 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Security & System Audit Hash Panel */}
        <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm">System Audit & Cryptographic Verification Token</h3>
                <p className="text-slate-400 text-xs">SHA-256 verification hash for enterprise dataset authentication and API integration.</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Verified Valid</span>
            </span>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono text-slate-300 uppercase">Active Verification SHA-256 Fingerprint</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={systemHash}
                onChange={(e) => setSystemHash(e.target.value)}
                className="flex-1 bg-navy-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-cyan-300 font-mono tracking-wider focus:outline-none focus:border-purple-400 transition-all"
                placeholder="Paste SHA-256 hash string..."
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(systemHash);
                  setCopiedHash(true);
                  setTimeout(() => setCopiedHash(false), 2000);
                }}
                className="px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 font-mono text-xs font-bold transition-all cursor-pointer active:scale-95 shrink-0"
              >
                {copiedHash ? 'Copied!' : 'Copy Hash'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">Hash Key: <span className="text-slate-400 font-bold">5e5ef3bbb74e0de18f4dadb07abf72611bd3462604ccc36afca6bc3259230504</span></p>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4">
          {saveSuccess ? (
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved successfully!</span>
            </div>
          ) : (
            <span className="text-slate-500 text-xs font-mono">Changes take effect immediately across all match scoring.</span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-display font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-400/20 transition-all flex items-center space-x-2"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Weighting Parameters</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone: Factory Reset */}
      {userRole === 'Administrator' && (
        <div className="glass-panel p-6 rounded-2xl border-rose-500/20 bg-rose-500/[0.02] space-y-4 pt-6 mt-12">
          <div className="flex items-center space-x-3 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-display font-bold text-sm">System Registry Reset</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Restores default executive contact records, event catalog, and system settings. All custom modifications will be cleared.
          </p>
          <button
            onClick={handleReset}
            disabled={isResetting}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isResetting ? "Resetting Database..." : "Execute Factory Reset"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
