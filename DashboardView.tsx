import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  CalendarDays, 
  CircleDollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Play, 
  Square, 
  Sparkles, 
  MapPin, 
  Building2, 
  UserCheck, 
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SystemStats, AttendanceRecord, LeaveRequest, Employee } from '../types';
import { api } from '../services/api';
import { formatINR, formatINRCompact } from '../utils/formatCurrency';
import confetti from 'canvas-confetti';

interface DashboardViewProps {
  onNavigate: (tab: 'dashboard' | 'directory' | 'attendance' | 'leaves' | 'payroll' | 'ai-assistant') => void;
  onOpenLeaveModal: () => void;
  onOpenAi: () => void;
  onViewEmployee: (emp: Employee) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenLeaveModal,
  onOpenAi,
  onViewEmployee
}) => {
  const { currentUser, isAdmin, role, refreshUser } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<{ isClockedIn: boolean; record: AttendanceRecord | null }>({
    isClockedIn: false,
    record: null
  });
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isClocking, setIsClocking] = useState<boolean>(false);
  const [locationType, setLocationType] = useState<string>('Office HQ - 4th Floor');

  // Load dashboard data
  const loadData = async () => {
    try {
      const [sysStats, todayStatus, leaves, attList, emps] = await Promise.all([
        api.getStats(),
        currentUser ? api.getTodayAttendanceStatus(currentUser.id) : Promise.resolve({ isClockedIn: false, record: null }),
        api.getLeaves({ status: 'Pending' }),
        api.getAttendance(),
        api.getEmployees()
      ]);

      setStats(sysStats);
      setTodayAttendance(todayStatus);
      setPendingLeaves(leaves);
      setRecentAttendance(attList.slice(0, 5));
      setRecentEmployees(emps.slice(0, 5));

      // Calculate elapsed time if clocked in
      if (todayStatus.record && !todayStatus.record.clockOutTime) {
        const [inH, inM, inS] = todayStatus.record.clockInTime.split(':').map(Number);
        const now = new Date();
        const inTime = new Date();
        inTime.setHours(inH || 0, inM || 0, inS || 0);
        const diffSec = Math.max(0, Math.floor((now.getTime() - inTime.getTime()) / 1000));
        setElapsedSeconds(diffSec);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser]);

  // Live timer for clocked in state
  useEffect(() => {
    if (!todayAttendance.isClockedIn) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [todayAttendance.isClockedIn]);

  // Format seconds to HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Clock In handler
  const handleClockIn = async () => {
    if (!currentUser) return;
    setIsClocking(true);
    try {
      await api.clockIn(currentUser.id, locationType);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
      await loadData();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Clock in failed');
    } finally {
      setIsClocking(false);
    }
  };

  // Clock Out handler
  const handleClockOut = async () => {
    if (!currentUser) return;
    setIsClocking(true);
    try {
      await api.clockOut(currentUser.id, 'Shift finished successfully');
      await loadData();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Clock out failed');
    } finally {
      setIsClocking(false);
    }
  };

  // Quick Approve Leave handler for HR
  const handleQuickApproveLeave = async (leaveId: string) => {
    if (!currentUser) return;
    try {
      await api.updateLeaveStatus(leaveId, 'Approved', currentUser.name, 'Approved via HR Quick Review');
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleQuickRejectLeave = async (leaveId: string) => {
    if (!currentUser) return;
    const reason = prompt('Enter rejection reason:') || 'Workload constraints';
    try {
      await api.updateLeaveStatus(leaveId, 'Rejected', currentUser.name, reason);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Rejection failed');
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white/85 backdrop-blur-xl p-6 lg:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs text-indigo-700 font-mono-code backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Dayflow Enterprise System • Active Matrix</span>
            </div>

            <h1 className="font-manrope text-2xl lg:text-3xl font-extrabold text-slate-950 tracking-tight">
              Welcome back,{' '}
              <span className="text-indigo-600">
                {currentUser?.name || 'Valued Team Member'}
              </span>
            </h1>

            <p className="text-slate-600 text-sm max-w-2xl font-medium">
              {isAdmin
                ? 'Organization command center: Monitor live attendance telemetry, review pending leave requests, and oversee compensation structures.'
                : 'Your personal workspace: Log daily attendance, request time-off, and review your monthly compensation breakdowns.'}
            </p>
          </div>

          {/* Action trigger buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenLeaveModal}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <span>Apply for Leave</span>
            </button>

            <button
              onClick={onOpenAi}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer border border-indigo-400/40"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Dayflow AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN KPI TELEMETRY METRICS OR EMPLOYEE SELF-SERVICE CARDS */}
      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Staff */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl relative overflow-hidden group hover:border-indigo-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono-code uppercase tracking-wider font-semibold">Total Headcount</span>
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-white">
                {stats?.totalEmployees || 7}
              </span>
              <span className="text-xs text-emerald-400 font-mono-code font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 100% active
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>5 Departments</span>
              <button onClick={() => onNavigate('directory')} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer">
                Directory <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 2: Today's Present & Rate */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl relative overflow-hidden group hover:border-emerald-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono-code uppercase tracking-wider font-semibold">Today Present</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-white">
                {stats?.todayPresent || 5}
              </span>
              <span className="text-xs text-emerald-400 font-mono-code font-bold">
                {stats?.attendanceRate || 86}% rate
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>{stats?.todayHalfDay || 1} Half-day • {stats?.todayOnLeave || 1} Leave</span>
              <button onClick={() => onNavigate('attendance')} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer">
                Matrix <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 3: Pending Leave Approvals */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl relative overflow-hidden group hover:border-orange-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono-code uppercase tracking-wider font-semibold">Pending Leaves</span>
              <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-400/30 text-orange-300">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-3xl font-extrabold text-orange-400">
                {stats?.pendingLeavesCount || pendingLeaves.length}
              </span>
              <span className="text-xs text-orange-400 font-mono-code font-semibold">
                Needs review
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Fast 1-click decision</span>
              <button onClick={() => onNavigate('leaves')} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer">
                Review <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Card 4: Monthly Payroll Volume */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl relative overflow-hidden group hover:border-indigo-400/40 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-3">
              <span className="text-xs font-mono-code uppercase tracking-wider font-semibold">Monthly Payroll (INR)</span>
              <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <CircleDollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-manrope text-2xl lg:text-3xl font-extrabold text-white">
                {formatINRCompact(stats?.monthlyPayrollTotal || 845000)}
              </span>
              <span className="text-xs text-emerald-400 font-mono-code font-bold">
                Net/mo
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>NEFT Direct Disburse</span>
              <button onClick={() => onNavigate('payroll')} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer">
                Runs <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* EMPLOYEE DASHBOARD TOP CARDS */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Live Clock-in Station */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <h3 className="font-manrope font-bold text-white text-base">
                  Daily Attendance Tracker
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-mono-code font-bold ${
                todayAttendance.isClockedIn ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/10 text-slate-300 border border-white/15'
              }`}>
                {todayAttendance.isClockedIn ? '● CLOCKED IN (ACTIVE)' : '○ NOT CLOCKED IN'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <p className="text-xs font-mono-code text-slate-400 uppercase font-semibold">Elapsed Work Duration</p>
                <div className="text-3xl lg:text-4xl font-mono-code font-extrabold text-white tracking-wider">
                  {formatTimer(elapsedSeconds)}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Location: </span>
                  <span className="text-slate-200 font-medium">{todayAttendance.record?.location || locationType}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {!todayAttendance.isClockedIn ? (
                  <>
                    <div className="flex gap-2">
                      <select
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value)}
                        className="w-full text-xs bg-slate-950/70 border border-white/20 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-indigo-400"
                      >
                        <option value="Bengaluru Tech Hub - 4th Floor" className="bg-slate-900 text-white">Bengaluru Tech Hub - 4th Floor</option>
                        <option value="Mumbai BKC Office - Level 9" className="bg-slate-900 text-white">Mumbai BKC Office - Level 9</option>
                        <option value="Hyderabad Cyber Gateway - Wing B" className="bg-slate-900 text-white">Hyderabad Cyber Gateway - Wing B</option>
                        <option value="Remote India (Work from Home)" className="bg-slate-900 text-white">Remote India (Work from Home)</option>
                        <option value="Client Site / Field Visit" className="bg-slate-900 text-white">Client Site / Field Visit</option>
                      </select>
                    </div>

                    <button
                      onClick={handleClockIn}
                      disabled={isClocking}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer border border-emerald-400/40"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{isClocking ? 'Clocking in...' : 'Clock In Now'}</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleClockOut}
                    disabled={isClocking}
                    className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer border border-rose-400/40"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>{isClocking ? 'Clocking out...' : 'Clock Out (Finish Day)'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Personal Leave Balances */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-manrope font-bold text-white text-sm flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-indigo-400" />
                Leave Balances
              </h3>
              <button
                onClick={onOpenLeaveModal}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                + Request
              </button>
            </div>

            <div className="space-y-3">
              {/* Paid Leave */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Paid Leave (Annual)</span>
                  <span className="font-mono-code font-bold text-white">
                    {currentUser ? (currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used) : 13} / {currentUser?.leaveBalance.paid.total || 18} days
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950/80 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${currentUser ? ((currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used) / currentUser.leaveBalance.paid.total) * 100 : 70}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Sick Leave */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Sick Leave</span>
                  <span className="font-mono-code font-bold text-white">
                    {currentUser ? (currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used) : 8} / {currentUser?.leaveBalance.sick.total || 10} days
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950/80 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width: `${currentUser ? ((currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used) / currentUser.leaveBalance.sick.total) * 100 : 80}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Casual Leave */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Casual Leave</span>
                  <span className="font-mono-code font-bold text-white">
                    {currentUser ? (currentUser.leaveBalance.casual.total - currentUser.leaveBalance.casual.used) : 5} / {currentUser?.leaveBalance.casual.total || 6} days
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950/80 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{
                      width: `${currentUser ? ((currentUser.leaveBalance.casual.total - currentUser.leaveBalance.casual.used) / currentUser.leaveBalance.casual.total) * 100 : 83}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Refreshes annually</span>
              <button onClick={() => onNavigate('leaves')} className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 cursor-pointer">
                History <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT SECTION: HR PENDING APPROVALS / ACTIVITY & ATTENDANCE STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Pending Approvals for HR or Recent Personal Activity */}
        <div className="lg:col-span-2 space-y-4">
          {isAdmin ? (
            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                  <h3 className="font-manrope font-bold text-white text-base">
                    Pending Leave Approvals Queue
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-400/30 text-xs font-mono-code font-bold">
                    {pendingLeaves.length}
                  </span>
                </div>

                <button
                  onClick={() => onNavigate('leaves')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  View All Requests <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {pendingLeaves.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-white">All Clear!</p>
                  <p className="text-xs text-slate-400">No pending employee leave requests requiring HR review.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLeaves.slice(0, 3).map((leave) => (
                    <div
                      key={leave.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={leave.employeeAvatar}
                          alt={leave.employeeName}
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{leave.employeeName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono-code bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold">
                              {leave.leaveType} Leave
                            </span>
                            <span className="text-xs text-slate-400">({leave.totalDays} day{leave.totalDays > 1 ? 's' : ''})</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {leave.startDate} to {leave.endDate} • {leave.department}
                          </p>
                          <p className="text-xs text-slate-300 italic mt-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                            "{leave.reason}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleQuickRejectLeave(leave.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-400/30 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleQuickApproveLeave(leave.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-md shadow-emerald-600/30 cursor-pointer border border-emerald-400/40"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-manrope font-bold text-white text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Your Recent Attendance Logs
                </h3>
                <button
                  onClick={() => onNavigate('attendance')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                >
                  View Calendar
                </button>
              </div>

              <div className="space-y-2">
                {recentAttendance.filter(r => r.employeeId === currentUser?.id).length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No recent records found.</p>
                ) : (
                  recentAttendance
                    .filter(r => r.employeeId === currentUser?.id)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          <div>
                            <p className="font-semibold text-white">{rec.date}</p>
                            <p className="text-[11px] text-slate-400 font-mono-code">
                              In: {rec.clockInTime} {rec.clockOutTime ? `• Out: ${rec.clockOutTime}` : '• Active'}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded font-mono-code font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            {rec.totalWorkHours > 0 ? `${rec.totalWorkHours} hrs` : 'In Progress'}
                          </span>
                          <p className="text-[10px] text-slate-400 mt-0.5">{rec.location}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* Quick Staff Directory Spotlight */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-manrope font-bold text-white text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Team Directory Spotlight
              </h3>
              <button
                onClick={() => onNavigate('directory')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
              >
                Browse All ({stats?.totalEmployees || 7})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recentEmployees.slice(0, 4).map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => onViewEmployee(emp)}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-400/40 hover:bg-white/10 transition-all flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={emp.avatarUrl}
                    alt={emp.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20 group-hover:border-indigo-400"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-xs truncate group-hover:text-indigo-300">
                      {emp.name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">{emp.jobTitle}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono-code bg-white/10 border border-white/15 text-slate-300">
                        {emp.department}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono-code font-bold ${
                        emp.status === 'Active' ? 'text-emerald-300 bg-emerald-500/20 border border-emerald-400/30' : 'text-amber-300 bg-amber-500/20 border border-amber-400/30'
                      }`}>
                        {emp.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Stream & HR Announcements */}
        <div className="space-y-4">
          {/* Live Check-in Activity Stream */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <h3 className="font-manrope font-bold text-white text-sm">
                  Live Attendance Feed
                </h3>
              </div>
              <span className="text-[10px] font-mono-code text-slate-400">Real-time</span>
            </div>

            <div className="space-y-3">
              {recentAttendance.slice(0, 5).map((att) => (
                <div key={att.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    {att.employeeName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 font-medium">
                      <span className="font-semibold text-white">{att.employeeName}</span>{' '}
                      {att.clockOutTime ? 'clocked out' : 'clocked in'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono-code">
                      {att.clockInTime} • {att.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Calendar & Upcoming Highlights */}
          <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-manrope font-bold text-white text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                Workplace Highlights
              </h3>
              <span className="text-[10px] font-mono-code text-slate-400">Q3 2026</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>Labor Day Holiday</span>
                  <span className="text-[10px] font-mono-code text-indigo-300 font-bold">Sept 07</span>
                </div>
                <p className="text-[11px] text-slate-300">Paid company-wide holiday. All offices closed.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center justify-between font-semibold text-white">
                  <span>Q3 Performance Reviews</span>
                  <span className="text-[10px] font-mono-code text-indigo-300 font-bold">Sept 15-20</span>
                </div>
                <p className="text-[11px] text-slate-300">Manager 1-on-1 check-ins and merit compensation discussions.</p>
              </div>
            </div>

            <button
              onClick={onOpenAi}
              className="w-full mt-2 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask AI About HR Policies</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
