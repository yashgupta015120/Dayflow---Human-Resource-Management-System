import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  LogIn, 
  AlertCircle,
  UserPlus,
  Sparkles,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  Clock,
  Briefcase
} from 'lucide-react';
import { Department } from '../types';
import { NetworkParticleBackground } from './NetworkParticleBackground';
import { CompanyLogo } from './CompanyLogo';

export const SignInView: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  
  // Tab State
  const [activeMode, setActiveMode] = useState<'signin' | 'register'>('signin');

  // Form State (Default to empty for genuine security)
  const [emailOrId, setEmailOrId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register Form State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regRole, setRegRole] = useState<'employee' | 'admin'>('employee');
  const [regDept, setRegDept] = useState<Department>('Engineering');
  const [regJobTitle, setRegJobTitle] = useState<string>('Software Engineer');

  // Handle Sign In Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!emailOrId.trim()) {
      setErrorMessage('Please enter your Employee ID or Work Email address.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    try {
      await login(emailOrId.trim(), password.trim());
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please fill in your full name and work email.');
      return;
    }
    if (!regPassword.trim()) {
      setErrorMessage('Please specify an initial account password.');
      return;
    }

    try {
      await register({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        role: regRole,
        department: regDept,
        jobTitle: regJobTitle.trim() || (regRole === 'admin' ? 'HR Operations Specialist' : 'Software Engineer')
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen relative bg-slate-900 text-slate-100 flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-300 overflow-x-hidden">
      
      {/* Dynamic Animated Constellation Particle Network Background */}
      <NetworkParticleBackground intensity="standard" />

      {/* Content wrapper with relative positioning over the background */}
      <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col min-h-[92vh] justify-between">
        
        {/* Top Glass Header Bar */}
        <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 glass-box-subtle p-4 rounded-2xl mb-6">
          <div className="flex items-center gap-3">
            <CompanyLogo size="lg" withContainer />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-manrope font-extrabold text-lg text-white tracking-tight">
                  DAYFLOW
                </h1>
                <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                  ENTERPRISE SECURE HRMS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Every workday, perfectly aligned • Statutory Indian Payroll & RBAC Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-code text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              256-Bit SSL Encrypted Session
            </span>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>RBAC Gate Active</span>
            </div>
          </div>
        </div>

        {/* Main Grid Layout: Left Sign-in / Register Form + Right Platform & Security Architecture (7 cols) */}
        <div className="w-full my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Glass Box Sign In / Register Container (5 cols) */}
          <div className="lg:col-span-5 glass-box rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between">
            
            <div>
              {/* Card Header & Tab Switcher */}
              <div className="p-6 pb-4 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex p-1 rounded-xl bg-slate-950/70 border border-white/10">
                    <button
                      type="button"
                      onClick={() => { setActiveMode('signin'); setErrorMessage(null); }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeMode === 'signin' 
                          ? 'bg-indigo-600 text-white shadow-md font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveMode('register'); setErrorMessage(null); }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        activeMode === 'register' 
                          ? 'bg-indigo-600 text-white shadow-md font-bold' 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Onboard Account
                    </button>
                  </div>

                  <span className="text-[11px] font-mono-code text-indigo-300 flex items-center gap-1 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/60">
                    <Lock className="w-3 h-3 text-indigo-400" />
                    AUTH GATEWAY
                  </span>
                </div>

                <h2 className="text-xl font-manrope font-extrabold text-white">
                  {activeMode === 'signin' ? 'Sign In to Your Workplace' : 'Onboard New Employee'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {activeMode === 'signin' 
                    ? 'Enter your work email or employee ID and confidential password.' 
                    : 'Create an employee or HR admin profile with Indian payroll provisioning.'}
                </p>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200 backdrop-blur-md">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-rose-300">Authentication Failed</p>
                    <p className="text-[11px] text-rose-200/90 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* SIGN IN FORM */}
              {activeMode === 'signin' ? (
                <form onSubmit={handleSignIn} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Employee ID or Work Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="signin-email"
                        type="text"
                        required
                        value={emailOrId}
                        onChange={(e) => setEmailOrId(e.target.value)}
                        placeholder="Enter Employee ID (e.g. EMP-1001) or Work Email"
                        className="glass-input w-full rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-mono-code focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Account Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your confidential account password"
                        className="glass-input w-full rounded-xl pl-9 pr-10 py-2.5 text-xs font-mono-code focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-white/20 bg-slate-900 text-indigo-500 focus:ring-indigo-400 w-3.5 h-3.5"
                      />
                      <span>Keep me signed in</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Protected by RBAC</span>
                  </div>

                  <button
                    id="btn-submit-signin"
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 border border-indigo-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Sign In to Dayflow Workspace</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* ONBOARDING FORM */
                <form onSubmit={handleRegister} className="p-6 space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Full Employee Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Neha Sharma"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Work Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. neha.sharma@dayflow.internal"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs font-mono-code focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Department
                      </label>
                      <select
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value as Department)}
                        className="glass-input w-full rounded-xl px-3 py-2 text-xs focus:outline-none bg-slate-900"
                      >
                        <option value="Engineering" className="bg-slate-900 text-white">Engineering</option>
                        <option value="Product Design" className="bg-slate-900 text-white">Product Design</option>
                        <option value="Marketing" className="bg-slate-900 text-white">Marketing</option>
                        <option value="Human Resources" className="bg-slate-900 text-white">Human Resources</option>
                        <option value="Finance & Ops" className="bg-slate-900 text-white">Finance & Ops</option>
                        <option value="Sales" className="bg-slate-900 text-white">Sales</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        System Role
                      </label>
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as 'employee' | 'admin')}
                        className="glass-input w-full rounded-xl px-3 py-2 text-xs focus:outline-none bg-slate-900"
                      >
                        <option value="employee" className="bg-slate-900 text-white">Employee (Self-Service)</option>
                        <option value="admin" className="bg-slate-900 text-white">HR Admin (Full Control)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Designation / Job Title
                    </label>
                    <input
                      type="text"
                      value={regJobTitle}
                      onChange={(e) => setRegJobTitle(e.target.value)}
                      placeholder="e.g. Lead Frontend Architect"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Set Secure Password
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Choose a strong password"
                      className="glass-input w-full rounded-xl px-3 py-2 text-xs font-mono-code focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 border border-emerald-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create & Launch Workplace Profile</span>
                  </button>
                </form>
              )}
            </div>

            {/* Bottom Security Assurance */}
            <div className="p-4 bg-slate-950/60 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Knowledge Credential Handling</span>
              </div>
              <span className="font-mono-code text-[10px] text-slate-500">AES-GCM // 256</span>
            </div>

          </div>

          {/* RIGHT COLUMN: Enterprise Workplace Architecture & Security Portal (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            
            {/* Header Showcase Banner */}
            <div className="glass-box p-6 rounded-2xl relative overflow-hidden border border-white/15">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-5 pointer-events-none">
                <Building2 className="w-48 h-48 text-white" />
              </div>
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-mono-code font-bold uppercase">
                    Security & Governance
                  </span>
                  <span className="text-xs text-slate-400">Enterprise HRMS & Payroll</span>
                </div>
                
                <h3 className="text-xl font-manrope font-extrabold text-white">
                  Unified Workplace Portal for India Operations
                </h3>
                
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                  Dayflow delivers an integrated human capital management system engineered with strict role-based access control (RBAC), end-to-end statutory Indian payroll compliance, and automated self-service.
                </p>
              </div>
            </div>

            {/* 3 Key Platform Capabilities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Capability 1: RBAC */}
              <div className="glass-box-subtle p-4 rounded-xl border border-white/10 space-y-2.5">
                <div className="p-2 w-fit rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">
                  Role-Based Isolation
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Strict perimeter segregation between Employee Self-Service and HR Administrative operations.
                </p>
              </div>

              {/* Capability 2: Statutory Payroll */}
              <div className="glass-box-subtle p-4 rounded-xl border border-white/10 space-y-2.5">
                <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">
                  Indian Statutory Engine
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Automated EPF (12%), Professional Tax, ESI, and Section 192 TDS deductions with PDF salary slips.
                </p>
              </div>

              {/* Capability 3: Attendance & Leaves */}
              <div className="glass-box-subtle p-4 rounded-xl border border-white/10 space-y-2.5">
                <div className="p-2 w-fit rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white">
                  Real-time Operations
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Biometric attendance check-ins, leave balance tracking, holiday calendar, and AI HR assistance.
                </p>
              </div>

            </div>

            {/* Enterprise Security Standards Checklist Card */}
            <div className="glass-box p-5 rounded-xl border border-white/10 space-y-3">
              <h4 className="text-xs font-mono-code font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Enterprise Security & Access Standards
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Mandatory password-authenticated sessions</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Elevation challenge for Administrator roles</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Per-employee privacy on compensation records</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Audit-logged leave & attendance approvals</span>
                </div>
              </div>
            </div>

            {/* Help & IT Support Callout */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">Need employee workplace access?</p>
                  <p className="text-[11px] text-slate-400">Contact your organization's HR Admin or use the Onboard Account tab.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setActiveMode('register'); setErrorMessage(null); }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer shrink-0"
              >
                Onboard Now
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Footer */}
        <div className="w-full pt-6 mt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2026 Dayflow Technologies Pvt. Ltd. • Enterprise Statutory HRMS</p>
          <p className="font-mono-code text-[11px]">Role-Based Access Control • EPF & Tax Section 192 Compliant</p>
        </div>

      </div>

    </div>
  );
};
