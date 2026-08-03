/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import DelcaLogo from './DelcaLogo';
import { 
  Users, 
  ShieldCheck, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Lock,
  Sparkles,
  Zap,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  HeartPulse,
  Crown,
  Layers,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';
import { PRECONFIGURED_ENTERPRISE_USERS, EnterpriseUserAccount } from '../lib/rbac';

interface LandingPageProps {
  onLoginSuccess: (user: { 
    name: string; 
    role: UserRole; 
    email: string;
    department?: string;
    title?: string;
    avatarUrl?: string;
  }) => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [authStep, setAuthStep] = useState<'select_role' | 'login_process'>('select_role');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Leadership');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Canvas ref for background animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active user matching the selected role
  const activeUser = PRECONFIGURED_ENTERPRISE_USERS.find(u => u.role === selectedRole) || PRECONFIGURED_ENTERPRISE_USERS[0];

  useEffect(() => {
    if (activeUser) {
      setEmail(activeUser.email);
      setPassword('delca•enterprise•2026');
    }
  }, [selectedRole]);

  const handleSelectRoleAndProceed = (role: UserRole) => {
    setSelectedRole(role);
    const matchedUser = PRECONFIGURED_ENTERPRISE_USERS.find(u => u.role === role);
    if (matchedUser) {
      setEmail(matchedUser.email);
      setPassword('delca•enterprise•2026');
    }
    setAuthStep('login_process');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Particle background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      glowColor: string;
    }> = [];

    const numParticles = Math.min(60, Math.floor((width * height) / 18000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        glowColor: Math.random() > 0.4 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(59, 130, 246, 0.4)',
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const radialGlow = ctx.createRadialGradient(width * 0.5, height * 0.5, 50, width * 0.5, height * 0.5, Math.max(width, height) * 0.6);
      radialGlow.addColorStop(0, '#050b18');
      radialGlow.addColorStop(1, '#02040c');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx = -p.vx;
        if (p.y < 0 || p.y > height) p.vy = -p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.glowColor;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.15;
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLoginUser = (userAcc: EnterpriseUserAccount) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess({
        name: userAcc.name,
        role: userAcc.role,
        email: userAcc.email,
        department: userAcc.department,
        title: userAcc.title,
        avatarUrl: userAcc.avatarUrl
      });
    }, 600);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeUser) {
      handleLoginUser(activeUser);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setResetEmailSent(true);
    }, 500);
  };

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

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-navy-950 text-slate-100">
      {/* Background canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Decorative Blurs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] pointer-events-none z-0" />

      {/* Header Bar */}
      <header className="relative w-full z-10 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-navy-900/60 backdrop-blur-md">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setAuthStep('select_role')}>
          <DelcaLogo badge={true} className="h-8" />
          <div className="hidden sm:block">
            <span className="font-display font-bold text-sm tracking-wider text-white block">
              DELCA VisionTech
            </span>
            <div className="text-[10px] text-cyan-300 tracking-wider font-mono">Agentic AI Customer Intelligence Platform</div>
          </div>
        </div>

        <button 
          onClick={() => setAuthStep(authStep === 'select_role' ? 'login_process' : 'select_role')}
          className="px-4 py-2 text-xs font-mono tracking-wider uppercase border border-cyan-400/30 text-cyan-400 rounded-xl hover:bg-cyan-400/10 transition-all duration-300 shadow-md shadow-cyan-400/5 hover:border-cyan-400 flex items-center space-x-2"
        >
          {authStep === 'login_process' ? (
            <>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Role Selection</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Proceed to Sign In Page</span>
            </>
          )}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative w-full z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-grow flex flex-col items-center justify-center space-y-12">
        
        {/* STEP 1: ROLE & ACCOUNT SELECTION VIEW */}
        {authStep === 'select_role' && (
          <div className="w-full space-y-10 text-center animate-[fadeIn_0.3s_ease-out]">
            
            {/* BRAND HERO HEADER */}
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex justify-center mb-2">
                <DelcaLogo badge={true} className="h-16" />
              </div>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-xs font-mono font-semibold">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Agentic AI Customer Intelligence Platform</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                DELCA VisionTech<br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                  Customer Intelligence Platform
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
                Centralized enterprise intelligence repository linking Executive 360 Profiles, Company Intelligence, AI Dossiers, Sales Pipeline, Event ROI, and Knowledge Base — protected by Role-Based Access Control (RBAC).
              </p>
            </div>

            {/* STEP 1 INSTRUCTION BANNER */}
            <div className="glass-panel p-4 rounded-2xl border-cyan-500/30 max-w-2xl mx-auto bg-cyan-500/5 flex items-center justify-between text-left space-x-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                  Step 1 of 2: Select Enterprise Role
                </span>
                <p className="text-xs text-white font-medium">
                  Choose a workspace profile below (e.g. <strong className="text-cyan-300">Administrator</strong>). It will automatically fill your sign-in details and open the Log In Process page.
                </p>
              </div>
              <button
                onClick={() => handleSelectRoleAndProceed('Administrator')}
                className="px-4 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 text-navy-950 font-display font-extrabold text-xs uppercase rounded-xl shadow-md shrink-0 hover:scale-105 transition-all flex items-center space-x-1.5"
              >
                <span>Select Administrator</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* SIX ENTERPRISE ROLE DIRECTORY CARDS */}
            <div className="w-full space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider block">
                  Enterprise Role Accounts Directory
                </span>
                <p className="text-xs text-slate-300">Click any role card to proceed to the log in process</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
                {PRECONFIGURED_ENTERPRISE_USERS.map((usr) => {
                  const Icon = getRoleIcon(usr.role);
                  const isSelectedRole = selectedRole === usr.role;

                  return (
                    <div
                      key={usr.id}
                      className={`glass-panel p-6 rounded-2xl transition-all duration-300 flex flex-col justify-between space-y-5 group hover:border-cyan-400/60 ${
                        isSelectedRole 
                          ? 'border-cyan-400 bg-cyan-500/10 shadow-xl shadow-cyan-400/10' 
                          : 'border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={usr.avatarUrl} 
                              alt={usr.name}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400/50 shadow-md"
                            />
                            <div>
                              <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">{usr.name}</h3>
                              <span className="text-xs font-mono text-cyan-400 block">{usr.title}</span>
                              <span className="text-[10px] font-mono text-slate-400">{usr.department}</span>
                            </div>
                          </div>

                          <span className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                            <Icon className="w-5 h-5" />
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                          {usr.bio}
                        </p>

                        <div className="space-y-1.5 pt-3 border-t border-white/10">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">Workspace Scope:</span>
                          <ul className="space-y-1">
                            {usr.permissionsSummary.slice(0, 2).map((perm, idx) => (
                              <li key={idx} className="text-xs font-mono text-slate-300 flex items-center space-x-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span className="truncate">{perm}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectRoleAndProceed(usr.role)}
                        className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-display font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-400/20 transition-all flex items-center justify-center space-x-2 group-hover:scale-[1.02]"
                      >
                        <span>Select {usr.role} & Fill Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: LOG IN PROCESS PAGE */}
        {authStep === 'login_process' && (
          <div className="w-full max-w-xl space-y-6 text-center animate-[fadeIn_0.3s_ease-out]">
            
            <button
              onClick={() => setAuthStep('select_role')}
              className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Role Account Selection</span>
            </button>

            {/* LOG IN PROCESS PORTAL CARD */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl relative border-white/15 text-left space-y-6">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-t-3xl" />

              <div className="text-center space-y-2 border-b border-white/10 pb-5">
                <div className="flex justify-center mb-1">
                  <DelcaLogo badge={true} className="h-12" />
                </div>
                <h2 className="font-display text-2xl font-black text-white tracking-wide">
                  DELCA VisionTech Log In
                </h2>
                <p className="text-xs text-cyan-300 font-mono font-medium">
                  Agentic AI Customer Intelligence Platform
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] tracking-wider uppercase font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Step 2 of 2: Log In Credentials Process</span>
                  </span>
                </div>
              </div>

              {/* ROLE SELECTOR ROW */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                    Selected Enterprise Workspace Role:
                  </label>
                  <button 
                    onClick={() => setAuthStep('select_role')}
                    className="text-[10px] font-mono text-cyan-400 hover:underline"
                  >
                    Change Role?
                  </button>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 rounded-xl bg-navy-950 border border-white/10">
                  {(['Administrator', 'Marketing', 'Sales', 'Event Management', 'Customer Success', 'Leadership'] as UserRole[]).map((r) => {
                    const isSelected = selectedRole === r;
                    const Icon = getRoleIcon(r);
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          setSelectedRole(r);
                          setIsForgotPassword(false);
                        }}
                        className={`py-2 px-1 rounded-lg text-[10px] font-mono font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                          isSelected 
                            ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-navy-950 shadow-md' 
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate w-full text-center">{r.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ACTIVE USER PROFILE DISPLAY */}
              {activeUser && (
                <div className="p-4 rounded-2xl bg-navy-950/90 border border-cyan-500/30 flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-3.5">
                    <img 
                      src={activeUser.avatarUrl} 
                      alt={activeUser.name} 
                      className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400 shadow-md"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-white">{activeUser.name}</h4>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-mono font-bold border border-cyan-500/30">
                          {activeUser.role}
                        </span>
                      </div>
                      <span className="text-xs text-slate-300 block">{activeUser.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{activeUser.department}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right text-[10px] font-mono text-emerald-400">
                    <span>Verified Account</span>
                    <span className="block text-slate-400 text-[9px]">Level 4 RBAC</span>
                  </div>
                </div>
              )}

              {/* AUTHENTICATION FORM */}
              {!isForgotPassword ? (
                <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
                      Enterprise Mail Address
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="user@delca.vision"
                        className="w-full bg-navy-950 border border-white/15 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition-all focus:ring-2 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                        Password / Access Key
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="text-[10px] text-cyan-400 hover:underline font-mono"
                      >
                        Reset Credentials?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-navy-950 border border-white/15 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:border-cyan-400 outline-none transition-all focus:ring-2 focus:ring-cyan-400/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded bg-navy-950 border-white/20 text-cyan-400 focus:ring-0" />
                      <span>Remember Enterprise Session</span>
                    </label>
                    <span className="font-mono text-[10px] text-slate-400">TLS 1.3 Encrypted</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 hover:from-cyan-300 hover:to-blue-400 text-navy-950 font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-cyan-400/20 transition-all flex items-center justify-center space-x-2 hover:scale-[1.01]"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Authenticate & Access Platform</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] font-mono text-center text-slate-400 pt-2 border-t border-white/5">
                    Strict Security Protocol: DELCA VisionTech RBAC Enforcement Active. All authentication attempts are logged under compliance audit trails.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 pt-2">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Enter your registered DELCA VisionTech enterprise mail address to dispatch password reset credentials.
                  </p>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@delca.vision"
                    className="w-full bg-navy-950 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none focus:border-cyan-400"
                  />
                  {resetEmailSent && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      Security reset link dispatched to {email}. Check your inbox.
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Back to Sign In
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs rounded-xl"
                    >
                      Send Password Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
