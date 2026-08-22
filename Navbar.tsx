import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Clock, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  Bell, 
  LogOut, 
  Bot, 
  CheckCircle2, 
  Users,
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  KeyRound,
  ShieldAlert,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onOpenAi: () => void;
  onOpenLeaveModal?: () => void;
  onOpenAuth?: () => void;
}

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  read: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAi, onOpenLeaveModal, onOpenAuth }) => {
  const { currentUser, role, isAdmin, demoUsers, switchUser, login, logout } = useAuth();
  const [time, setTime] = useState<string>('');
  const [showSwitchDropdown, setShowSwitchDropdown] = useState<boolean>(false);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  // Admin Elevation Password Verification State
  const [pendingAdminUser, setPendingAdminUser] = useState<typeof demoUsers[0] | null>(null);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 1, title: 'August Payroll Processed', desc: 'Itemized salary slips are available for download.', time: '2h ago', read: false },
    { id: 2, title: 'Leave Request Update', desc: 'Priya Sharma annual leave was approved by HR.', time: '4h ago', read: false },
    { id: 3, title: 'Office Townhall', desc: 'Scheduled for Friday 4:00 PM in Main Auditorium.', time: '1d ago', read: false }
  ]);

  const handleMarkAllRead = () => {
    setNotifications([]);
  };

  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Focus password input when modal opens
  useEffect(() => {
    if (pendingAdminUser) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [pendingAdminUser]);

  // Handle switching persona with security check for Employee -> Admin
  const handlePersonaClick = (targetUser: typeof demoUsers[0]) => {
    if (currentUser?.id === targetUser.id) {
      setShowSwitchDropdown(false);
      return;
    }

    // When switching from an employee account to an admin account, require password confirmation
    if (targetUser.role === 'admin' && currentUser?.role === 'employee') {
      setPendingAdminUser(targetUser);
      setAdminPassword('');
      setPasswordError(null);
      setShowSwitchDropdown(false);
      return;
    }

    // Otherwise switch normally
    switchUser(targetUser.id);
    setShowSwitchDropdown(false);
  };

  // Handle password verification submit
  const handleVerifyAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingAdminUser) return;
    
    if (!adminPassword.trim()) {
      setPasswordError('Please enter the administrator account password.');
      return;
    }

    setIsVerifying(true);
    setPasswordError(null);

    try {
      await login(pendingAdminUser.email, adminPassword.trim());
      // Successful login updates the currentUser in AuthContext
      setPendingAdminUser(null);
      setAdminPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Incorrect administrator password. Elevation authorization failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Live time ticker
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const hasUnread = notifications.length > 0;

  return (
    <header className="h-16 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between shadow-lg">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <CompanyLogo size="md" withContainer />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-manrope font-extrabold text-base tracking-tight text-white">
                DAYFLOW
              </span>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold">
                HRMS v3.2
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Every workday, perfectly aligned.
            </p>
          </div>
        </div>
      </div>

      {/* Center Live Telemetry Clock */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-white/15 text-xs font-mono-code text-slate-300 backdrop-blur-md">
        <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span className="text-slate-400">SYSTEM TIME:</span>
        <span className="text-white font-bold">{time || '09:00:00 AM'}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
      </div>

      {/* Right Controls: AI Trigger + Persona Switcher + Notifications + User Menu */}
      <div className="flex items-center gap-2.5">
        {/* Dayflow AI Assistant Button */}
        <button
          onClick={onOpenAi}
          className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-400/30 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 transition-all text-xs font-medium backdrop-blur-md cursor-pointer shadow-sm"
          title="Open Dayflow AI Workplace Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-semibold text-white">Ask Dayflow AI</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-mono-code bg-indigo-500/40 text-indigo-200 font-bold border border-indigo-400/30">
            Gemini 3.7
          </span>
        </button>

        {/* Demo Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSwitchDropdown(!showSwitchDropdown);
              setShowUserDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs text-slate-200 transition-colors backdrop-blur-md cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline text-slate-400">Role:</span>
            <span className="font-semibold text-white max-w-[100px] truncate">
              {currentUser?.name.split(' ')[0] || 'Select'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showSwitchDropdown && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900/90 border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-2xl">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-white/10 mb-1 flex items-center justify-between">
                <span>Select Demo Persona</span>
                <span className="text-[10px] text-indigo-400 font-mono-code">RBAC Switcher</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {demoUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handlePersonaClick(user)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors text-xs cursor-pointer ${
                      currentUser?.id === user.id ? 'bg-indigo-600/30 border border-indigo-400/40 text-white' : 'hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover border border-white/20" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono-code font-bold uppercase ${
                          user.role === 'admin' ? 'bg-orange-500/20 text-orange-300 border border-orange-400/30' : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{user.jobTitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSwitchDropdown(false);
              setShowUserDropdown(false);
            }}
            className="p-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors relative backdrop-blur-md cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900/95 border border-white/15 shadow-2xl p-3 z-50 backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Notifications</span>
                  {hasUnread && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/25 text-indigo-300 font-mono-code font-bold border border-indigo-400/30">
                      {notifications.length}
                    </span>
                  )}
                </div>
                {hasUnread && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.25 } }}
                      layout
                      className="group relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="font-semibold text-white leading-tight">{n.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono-code">{n.time}</span>
                          <button
                            onClick={() => handleDismissNotification(n.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-all p-0.5 rounded hover:bg-white/10 cursor-pointer"
                            title="Dismiss"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-snug">{n.desc}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="py-6 text-center text-slate-400 space-y-1.5"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1 opacity-90" />
                    <p className="text-xs font-semibold text-slate-200">All caught up!</p>
                    <p className="text-[11px] text-slate-400">No new or unread notifications.</p>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Card */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowSwitchDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-md cursor-pointer"
          >
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={currentUser?.name || 'User'}
              className="w-7 h-7 rounded-full object-cover border border-white/20"
            />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-white leading-tight">
                {currentUser?.name || 'Staff User'}
              </p>
              <div className="flex items-center gap-1">
                {isAdmin ? (
                  <span className="text-[9px] font-mono-code font-bold text-orange-400 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> HR ADMIN
                  </span>
                ) : (
                  <span className="text-[9px] font-mono-code font-bold text-indigo-400 flex items-center gap-0.5">
                    <User className="w-2.5 h-2.5" /> EMPLOYEE
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/90 border border-white/15 shadow-2xl p-2 z-50 backdrop-blur-2xl">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                <p className="text-[10px] text-indigo-400 font-mono-code mt-0.5">{currentUser?.id}</p>
              </div>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  if (onOpenAuth) onOpenAuth();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white rounded-xl text-left cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Account & Credentials</span>
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenAi();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 hover:text-white rounded-xl text-left cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Policy Assistant</span>
              </button>

              <div className="my-1 border-t border-white/10"></div>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                  if (onOpenAuth) onOpenAuth();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/20 rounded-xl text-left font-medium cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out / Switch</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin Elevation Password Verification Security Modal */}
      <AnimatePresence>
        {pendingAdminUser && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="glass-box w-full max-w-md rounded-2xl shadow-2xl border border-orange-500/30 p-6 space-y-4 text-slate-100 relative overflow-hidden"
            >
              {/* Background ambient security glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -mr-12 -mt-12"></div>
              
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-inner">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-manrope font-extrabold text-base text-white">
                        Admin Security Verification
                      </h3>
                      <span className="text-[9px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30">
                        RBAC GATE
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Elevated HR management permissions check
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPendingAdminUser(null);
                    setAdminPassword('');
                    setPasswordError(null);
                  }}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Cancel switch"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Target Admin Profile Info Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/10 space-y-2 relative z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={pendingAdminUser.avatarUrl}
                    alt={pendingAdminUser.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-orange-400/40 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">
                        {pendingAdminUser.name}
                      </h4>
                      <span className="text-[10px] font-mono-code font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40">
                        HR ADMIN
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{pendingAdminUser.jobTitle}</p>
                    <p className="text-[11px] text-indigo-300 font-mono-code truncate">{pendingAdminUser.email}</p>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 border-t border-white/10 pt-2 leading-relaxed">
                  You are switching from an Employee account to an HR Administrator. Enter the administrator password to confirm authorization.
                </p>
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <p className="leading-snug">{passwordError}</p>
                </div>
              )}

              {/* Password Form */}
              <form onSubmit={handleVerifyAdminPassword} className="space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-200">
                    Administrator Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      ref={passwordInputRef}
                      type={showPassword ? 'text' : 'password'}
                      value={adminPassword}
                      onChange={(e) => {
                        setAdminPassword(e.target.value);
                        if (passwordError) setPasswordError(null);
                      }}
                      placeholder={`Enter password for ${pendingAdminUser.name.split(' ')[0]}`}
                      className="glass-input w-full rounded-xl pl-10 pr-10 py-2.5 text-xs font-mono-code focus:outline-none focus:border-orange-400/60 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Security Requirement Notice */}
                <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-500/20 text-[11px] text-orange-200/90 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="leading-snug">
                    Enter the authorized administrator password to elevate access privileges.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingAdminUser(null);
                      setAdminPassword('');
                      setPasswordError(null);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 text-xs font-semibold transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-lg shadow-orange-600/30 border border-orange-400/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Switch to Admin</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
