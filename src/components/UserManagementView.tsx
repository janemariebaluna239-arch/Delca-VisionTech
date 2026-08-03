import React, { useState } from 'react';
import DelcaLogo from './DelcaLogo';
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Key, 
  AlertTriangle, 
  Activity, 
  Lock, 
  Edit3, 
  Trash2, 
  RefreshCw, 
  Shield, 
  Plus,
  Crown,
  TrendingUp,
  DollarSign,
  Calendar,
  HeartPulse,
  Database,
  Sliders,
  X
} from 'lucide-react';
import { UserRole, ActivityLog } from '../types';
import { PRECONFIGURED_ENTERPRISE_USERS, EnterpriseUserAccount, getRolePermissions } from '../lib/rbac';

interface UserManagementViewProps {
  activityLogs: ActivityLog[];
  onOpenSettings: () => void;
}

export default function UserManagementView({ activityLogs, onOpenSettings }: UserManagementViewProps) {
  const [users, setUsers] = useState<EnterpriseUserAccount[]>(PRECONFIGURED_ENTERPRISE_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');
  const [editingUser, setEditingUser] = useState<EnterpriseUserAccount | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    showToast(`Updated user role and permissions for ${users.find(u => u.id === userId)?.name}`);
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_1] pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* HEADER HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 p-6 md:p-8 border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
              <DelcaLogo badge={true} className="h-6" />
              <span>DELCA Enterprise Security & Role-Based Access Control (RBAC)</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              User & Access Permission Management
            </h1>

            <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
              Centralized platform security administration. Assign enterprise roles, configure granular permission policies across all 6 departments, monitor authentication logs, and manage enterprise user provisioning.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenSettings}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-xs font-bold border border-white/10 flex items-center space-x-2 transition-all"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Platform Settings</span>
            </button>

            <button
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-display font-bold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-400/20 transition-all hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision User</span>
            </button>
          </div>
        </div>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] text-cyan-400 uppercase block">Active Users</span>
            <span className="text-base font-bold text-white">{users.length} Users</span>
            <span className="text-[9px] text-emerald-400 block">100% Provisioned</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] text-purple-400 uppercase block">Enterprise Roles</span>
            <span className="text-base font-bold text-purple-300">6 Roles</span>
            <span className="text-[9px] text-slate-400 block">RBAC Configured</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] text-emerald-400 uppercase block">Database Sync</span>
            <span className="text-base font-bold text-emerald-300">1 Shared DB</span>
            <span className="text-[9px] text-slate-400 block">Synchronized</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] text-amber-400 uppercase block">Security Protocol</span>
            <span className="text-base font-bold text-amber-300">2FA / OAuth</span>
            <span className="text-[9px] text-slate-400 block">Enforced</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] text-sky-400 uppercase block">Audit Logs</span>
            <span className="text-base font-bold text-sky-300">{activityLogs.length || 28} Events</span>
            <span className="text-[9px] text-slate-400 block">Real-Time Logged</span>
          </div>

          <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[9px] text-cyan-400 uppercase block">System Status</span>
            <span className="text-base font-bold text-cyan-300">Healthy</span>
            <span className="text-[9px] text-emerald-400 block">0 Security Breaches</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="p-4 rounded-2xl glass-panel border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, department..."
            className="w-full bg-navy-950 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none font-mono"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar text-xs font-mono">
          <span className="text-slate-400 text-[10px] uppercase font-bold shrink-0">Role Filter:</span>
          {['All', 'Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                selectedRoleFilter === r
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                  : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* USER LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const perms = getRolePermissions(user.role);
          return (
            <div
              key={user.id}
              className="glass-panel p-5 rounded-2xl border-white/10 space-y-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400/50 shadow-md"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-white">{user.name}</h3>
                      <span className="text-[10px] font-mono text-cyan-400 block">{user.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{user.department}</span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
                    {user.role}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-white/5 space-y-1 font-mono text-xs">
                  <span className="text-[9px] text-slate-400 uppercase block">Email Address:</span>
                  <span className="text-slate-200 block truncate">{user.email}</span>
                </div>

                {/* ROLE ASSIGNMENT SELECTOR */}
                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-slate-400 block">Change Enterprise Role:</label>
                  <select
                    value={user.role}
                    onChange={(e) => handleUpdateRole(user.id, e.target.value as UserRole)}
                    className="w-full bg-navy-950 border border-white/10 rounded-xl py-2 px-3 text-xs font-mono text-cyan-300 focus:border-cyan-400 outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Event Management">Event Management</option>
                    <option value="Customer Success">Customer Success</option>
                    <option value="Leadership">Leadership</option>
                  </select>
                </div>

                {/* PERMISSIONS MATRIX CHECKLIST */}
                <div className="pt-2 border-t border-white/5 space-y-1.5 font-mono text-[10px]">
                  <span className="text-slate-400 uppercase font-bold block">Assigned Capability Scope:</span>
                  <div className="grid grid-cols-2 gap-1 text-slate-300">
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className={`w-3 h-3 ${perms.canAddExecutive ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={perms.canAddExecutive ? 'text-slate-200' : 'text-slate-500 line-through'}>Edit Directory</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className={`w-3 h-3 ${perms.canManageOpportunities ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={perms.canManageOpportunities ? 'text-slate-200' : 'text-slate-500 line-through'}>Sales Pipeline</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className={`w-3 h-3 ${perms.canManageEvents ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={perms.canManageEvents ? 'text-slate-200' : 'text-slate-500 line-through'}>Event Center</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle2 className={`w-3 h-3 ${perms.canManageUsers ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <span className={perms.canManageUsers ? 'text-slate-200' : 'text-slate-500 line-through'}>User RBAC</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 text-[10px] flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Access Granted</span>
                </span>

                <button
                  onClick={() => showToast(`Triggered security password reset link for ${user.email}`)}
                  className="text-cyan-400 hover:underline text-[10px] flex items-center space-x-1"
                >
                  <Key className="w-3 h-3" />
                  <span>Reset Security Key</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SYSTEM AUDIT & SECURITY LOGS TABLE */}
      <div className="glass-panel p-6 rounded-2xl border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-display font-bold text-base text-white">Platform System Audit & Access Logs</h3>
              <p className="text-[11px] text-slate-400">Real-time enterprise event logging, authentication events, and role actions</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
            Real-Time Stream Active
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User & Department</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action Event</th>
                <th className="py-2.5 px-3">Security Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {(activityLogs.length > 0 ? activityLogs : [
                { id: '1', timestamp: '2026-07-29 10:14:02', userName: 'Sarah Jenkins', userRole: 'Administrator' as UserRole, action: 'Updated security permissions for Marcus Vance (Marketing)' },
                { id: '2', timestamp: '2026-07-29 09:42:15', userName: 'David Chen', userRole: 'Sales' as UserRole, action: 'Logged $1.2M SMC ERP Modernization proposal update' },
                { id: '3', timestamp: '2026-07-29 08:30:00', userName: 'Elena Rostova', userRole: 'Event Management' as UserRole, action: 'Triggered AI Event Matching for ASEAN Banking Summit' },
                { id: '4', timestamp: '2026-07-28 16:20:11', userName: 'Carlos Mendez', userRole: 'Customer Success' as UserRole, action: 'Upgraded Ayala Corp Relationship Health Score to Thriving' },
                { id: '5', timestamp: '2026-07-28 14:10:44', userName: 'Victoria Sterling', userRole: 'Leadership' as UserRole, action: 'Generated C-Suite Executive Briefing PDF Report' }
              ]).map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-2.5 px-3 text-slate-400 text-[10px]">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-bold text-white">{log.userName}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[10px] border border-cyan-500/20">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">{log.action}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] text-emerald-400 font-bold">INFO / OK</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PROVISION USER MODAL */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[100] bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border-white/10 space-y-4 animate-[scaleUp_0.2s_ease-out_1]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-base text-white">Provision New Enterprise User</h3>
              </div>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const email = formData.get('email') as string;
                const role = formData.get('role') as UserRole;
                const department = formData.get('department') as string;
                const title = formData.get('title') as string;

                const newUser: EnterpriseUserAccount = {
                  id: `usr-${Date.now()}`,
                  name,
                  email,
                  role,
                  department,
                  title,
                  avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
                  bio: `Provisioned user for ${department}.`,
                  permissionsSummary: [`Assigned ${role} workspace privileges.`]
                };

                setUsers(prev => [...prev, newUser]);
                setIsAddUserModalOpen(false);
                showToast(`Successfully provisioned enterprise account for ${name}`);
              }}
              className="space-y-3 font-mono text-xs"
            >
              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Full Name</label>
                <input required name="name" placeholder="e.g. Rachel Adams" className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Enterprise Email</label>
                <input required type="email" name="email" placeholder="e.g. rachel.adams@delca.vision" className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Assign Enterprise Role</label>
                <select name="role" className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-cyan-300 outline-none focus:border-cyan-400">
                  <option value="Administrator">Administrator</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Event Management">Event Management</option>
                  <option value="Customer Success">Customer Success</option>
                  <option value="Leadership">Leadership</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Department</label>
                <input required name="department" placeholder="e.g. Global Accounts & Strategy" className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400" />
              </div>

              <div>
                <label className="text-[10px] uppercase text-slate-400 block mb-1">Job Title</label>
                <input required name="title" placeholder="e.g. Director of Business Intelligence" className="w-full bg-navy-950 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-cyan-400" />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
