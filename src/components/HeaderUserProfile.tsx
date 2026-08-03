import React, { useState } from 'react';
import DelcaLogo from './DelcaLogo';
import { 
  User, 
  ShieldCheck, 
  LogOut, 
  Bell, 
  Settings, 
  ChevronDown, 
  Users, 
  Sparkles, 
  X, 
  CheckCircle2, 
  RefreshCw, 
  Crown, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  HeartPulse, 
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { UserSession, UserRole, NotificationItem } from '../types';
import { PRECONFIGURED_ENTERPRISE_USERS, getRolePermissions, EnterpriseUserAccount } from '../lib/rbac';

interface HeaderUserProfileProps {
  session: UserSession;
  notifications?: NotificationItem[];
  onSignOut: () => void;
  onSwitchRole: (newRoleUser: EnterpriseUserAccount) => void;
  onOpenSettings?: () => void;
  onClearNotification?: (id?: string) => void;
}

export default function HeaderUserProfile({
  session,
  notifications = [],
  onSignOut,
  onSwitchRole,
  onOpenSettings,
  onClearNotification
}: HeaderUserProfileProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);
  const userPermissions = getRolePermissions(session.userRole);

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'Administrator': return ShieldCheck;
      case 'Marketing': return TrendingUp;
      case 'Sales': return DollarSign;
      case 'Event Management': return Calendar;
      case 'Customer Success': return HeartPulse;
      case 'Leadership': return Crown;
      default: return Users;
    }
  };

  const RoleIcon = getRoleIcon(session.userRole);

  return (
    <div className="relative flex items-center space-x-2">
      {/* ROLE BADGE DISPLAY */}
      <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono font-bold">
        <RoleIcon className="w-3.5 h-3.5 text-cyan-400" />
        <span>{session.userRole}</span>
      </div>

      {/* VISIBLE NOTIFICATION BELL TRIGGER */}
      <button
        onClick={() => setIsNotificationsOpen(true)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all focus:outline-none"
        title="Notifications & System Alerts"
      >
        <Bell className="w-4 h-4 text-amber-400" />
        {unreadNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-navy-950 font-extrabold text-[10px] flex items-center justify-center animate-pulse border-2 border-navy-950">
            {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
          </span>
        )}
      </button>

      {/* USER PROFILE AVATAR BUTTON */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          {session.avatarUrl ? (
            <img 
              src={session.avatarUrl} 
              alt={session.userName}
              className="w-8 h-8 rounded-lg object-cover border border-cyan-400/50 shadow-md"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-bold font-mono text-xs">
              {session.userName.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="text-left hidden sm:block">
            <span className="text-xs font-bold text-white block leading-tight">{session.userName}</span>
            <span className="text-[9px] font-mono text-slate-400 block leading-tight">{session.department || 'Enterprise User'}</span>
          </div>

          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* PROFILE DROPDOWN MENU */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-3 w-64 glass-panel rounded-2xl shadow-2xl border-white/10 z-50 p-2 space-y-1 animate-[fadeIn_0.2s_ease-out_1]">
            <div className="p-3 border-b border-white/10 space-y-1">
              <div className="font-bold text-sm text-white">{session.userName}</div>
              <div className="text-[10px] font-mono text-cyan-400">{session.title || session.userRole}</div>
              <div className="text-[10px] font-mono text-slate-400 truncate">{session.userEmail}</div>
            </div>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 flex items-center space-x-2.5 transition-all"
            >
              <User className="w-4 h-4 text-cyan-400" />
              <span>My Enterprise Profile</span>
            </button>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                setIsRoleSwitcherOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-purple-300 hover:bg-purple-500/10 flex items-center space-x-2.5 transition-all"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span>Role Switcher (Demo)</span>
            </button>

            <button
              onClick={() => {
                setIsDropdownOpen(false);
                setIsNotificationsOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 flex items-center space-x-2.5 transition-all"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notifications ({unreadNotifications.length})</span>
            </button>

            {onOpenSettings && (
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onOpenSettings();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 flex items-center space-x-2.5 transition-all"
              >
                <Settings className="w-4 h-4 text-sky-400" />
                <span>Preferences</span>
              </button>
            )}

            <div className="pt-1 border-t border-white/10">
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onSignOut();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-mono text-rose-300 hover:bg-rose-500/10 flex items-center space-x-2.5 transition-all"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MY PROFILE MODAL */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border-white/10 space-y-5 animate-[scaleUp_0.2s_ease-out_1]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <DelcaLogo badge={true} className="h-6" />
                <h3 className="font-display font-bold text-base text-white">DELCA Enterprise Profile</h3>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {session.avatarUrl ? (
                <img src={session.avatarUrl} alt={session.userName} className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-xl" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold font-mono text-xl">
                  {session.userName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="space-y-0.5">
                <h4 className="font-bold text-lg text-white">{session.userName}</h4>
                <div className="text-xs font-mono text-cyan-300">{session.title || session.userRole}</div>
                <div className="text-xs font-mono text-slate-400">{session.department}</div>
                <div className="text-xs font-mono text-slate-400">{session.userEmail}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-white/10 space-y-3 font-mono text-xs">
              <h5 className="font-bold text-white text-xs uppercase flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Role Permission Capabilities ({session.userRole})</span>
              </h5>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${userPermissions.canAddExecutive ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={userPermissions.canAddExecutive ? 'text-slate-200' : 'text-slate-500 line-through'}>Add Executive Profiles</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${userPermissions.canManageOpportunities ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={userPermissions.canManageOpportunities ? 'text-slate-200' : 'text-slate-500 line-through'}>Manage Sales Pipeline</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${userPermissions.canManageEvents ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={userPermissions.canManageEvents ? 'text-slate-200' : 'text-slate-500 line-through'}>Create & Manage Events</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${userPermissions.canSendInvitations ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={userPermissions.canSendInvitations ? 'text-slate-200' : 'text-slate-500 line-through'}>Send VIP Invitations</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${userPermissions.canManageUsers ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={userPermissions.canManageUsers ? 'text-slate-200' : 'text-slate-500 line-through'}>User & Access Control</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${userPermissions.canManageSettings ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={userPermissions.canManageSettings ? 'text-slate-200' : 'text-slate-500 line-through'}>System Platform Settings</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-mono font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS MODAL */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-[100] bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border-white/10 space-y-4 animate-[scaleUp_0.2s_ease-out_1]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-base text-white">System Notifications ({notifications.length})</h3>
              </div>
              <div className="flex items-center space-x-2">
                {onClearNotification && notifications.length > 0 && (
                  <button
                    onClick={() => onClearNotification()}
                    className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
                  >
                    Clear All
                  </button>
                )}
                <button onClick={() => setIsNotificationsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No active notifications or system alerts.
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 transition-all ${
                      notif.read ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-amber-500/10 border-amber-500/30 text-white font-semibold'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300">{notif.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{notif.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{notif.message}</p>
                    {onClearNotification && !notif.read && (
                      <button
                        onClick={() => onClearNotification(notif.id)}
                        className="text-[10px] font-mono text-cyan-400 hover:underline pt-1 block"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ROLE SWITCHER MODAL */}
      {isRoleSwitcherOpen && (
        <div className="fixed inset-0 z-[100] bg-navy-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-2xl border-white/10 space-y-4 animate-[scaleUp_0.2s_ease-out_1]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5 text-purple-400" />
                <h3 className="font-display font-bold text-base text-white">Switch Enterprise Role (Demo Tester)</h3>
              </div>
              <button onClick={() => setIsRoleSwitcherOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Select any of the 6 enterprise roles below to instantly switch your active user session and experience their tailored dashboard layout and RBAC permissions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {PRECONFIGURED_ENTERPRISE_USERS.map((usr) => {
                const isCurrent = session.userRole === usr.role;
                return (
                  <div
                    key={usr.id}
                    onClick={() => {
                      onSwitchRole(usr);
                      setIsRoleSwitcherOpen(false);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between space-x-3 ${
                      isCurrent
                        ? 'bg-purple-500/20 border-purple-500/50 text-white'
                        : 'bg-white/5 border-white/5 hover:border-cyan-500/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={usr.avatarUrl} alt={usr.name} className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40" />
                      <div>
                        <h4 className="font-bold text-xs text-white">{usr.name}</h4>
                        <span className="text-[10px] font-mono text-cyan-300 block">{usr.role}</span>
                        <span className="text-[9px] font-mono text-slate-400">{usr.department}</span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsRoleSwitcherOpen(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
