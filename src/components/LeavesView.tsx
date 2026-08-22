import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Filter, 
  UserCheck, 
  MessageSquare,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LeaveRequest, LeaveType, LeaveStatus } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface LeavesViewProps {
  onOpenApplyModal: () => void;
  onOpenAi: () => void;
}

export const LeavesView: React.FC<LeavesViewProps> = ({ onOpenApplyModal, onOpenAi }) => {
  const { currentUser, isAdmin, refreshUser } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Review modal state
  const [reviewingLeave, setReviewingLeave] = useState<LeaveRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Rejected'>('Approved');
  const [reviewComment, setReviewComment] = useState<string>('');

  const loadLeaves = async () => {
    try {
      const params: any = {};
      if (!isAdmin && currentUser) {
        params.employeeId = currentUser.id;
      }
      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

      const data = await api.getLeaves(params);
      setLeaves(data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, [currentUser, isAdmin, selectedStatus]);

  const handleDecision = async () => {
    if (!reviewingLeave || !currentUser) return;
    setIsProcessing(reviewingLeave.id);
    try {
      await api.updateLeaveStatus(
        reviewingLeave.id,
        reviewAction,
        currentUser.name,
        reviewComment || (reviewAction === 'Approved' ? 'Approved by HR Operations.' : 'Request could not be accommodated.')
      );

      if (reviewAction === 'Approved') {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      }

      setReviewingLeave(null);
      setReviewComment('');
      await loadLeaves();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to update leave');
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
      case 'Pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
      case 'Rejected':
        return 'bg-rose-500/20 text-rose-300 border-rose-400/30';
      default:
        return 'bg-slate-800/60 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            Leave & Time-Off Management
          </h1>
          <p className="text-xs text-slate-600 font-sans font-medium mt-0.5">
            {isAdmin
              ? 'HR Review Portal: Evaluate pending applications, balance accruals, and decision audit logs.'
              : 'Submit vacation or sick leave requests and track review lifecycles in real-time.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-xs font-semibold text-indigo-300 backdrop-blur-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Draft with AI</span>
          </button>

          <button
            onClick={onOpenApplyModal}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer border border-indigo-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Leave</span>
          </button>
        </div>
      </div>

      {/* BALANCES SUMMARY METERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-code uppercase tracking-wider text-slate-400 font-medium">Paid Leave (Annual)</span>
            <span className="text-xs font-mono-code font-bold text-indigo-300">
              {currentUser ? currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used : 14} Available
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-manrope text-3xl font-extrabold text-white">
              {currentUser?.leaveBalance.paid.total || 18}
            </span>
            <span className="text-xs text-slate-400 font-mono-code">total days/yr</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden border border-white/10">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{
                width: `${currentUser ? ((currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used) / currentUser.leaveBalance.paid.total) * 100 : 77}%`
              }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {currentUser?.leaveBalance.paid.used || 4} days consumed • Accrues quarterly
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-code uppercase tracking-wider text-slate-400 font-medium">Sick & Medical Leave</span>
            <span className="text-xs font-mono-code font-bold text-emerald-300">
              {currentUser ? currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used : 9} Available
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-manrope text-3xl font-extrabold text-white">
              {currentUser?.leaveBalance.sick.total || 10}
            </span>
            <span className="text-xs text-slate-400 font-mono-code">total days/yr</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden border border-white/10">
            <div
              className="h-full bg-emerald-400 rounded-full"
              style={{
                width: `${currentUser ? ((currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used) / currentUser.leaveBalance.sick.total) * 100 : 90}%`
              }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {currentUser?.leaveBalance.sick.used || 1} day consumed • Medical cert required &gt; 2 days
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono-code uppercase tracking-wider text-slate-400 font-medium">Casual & Personal Leave</span>
            <span className="text-xs font-mono-code font-bold text-amber-300">
              {currentUser ? currentUser.leaveBalance.casual.total - currentUser.leaveBalance.casual.used : 5} Available
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-manrope text-3xl font-extrabold text-white">
              {currentUser?.leaveBalance.casual.total || 6}
            </span>
            <span className="text-xs text-slate-400 font-mono-code">total days/yr</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950/60 overflow-hidden border border-white/10">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{
                width: `${currentUser ? ((currentUser.leaveBalance.casual.total - currentUser.leaveBalance.casual.used) / currentUser.leaveBalance.casual.total) * 100 : 83}%`
              }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">
            {currentUser?.leaveBalance.casual.used || 1} day consumed • Short notice personal emergency
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-1.5">
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {st === 'All' ? 'All Requests' : st}
              {st === 'Pending' && leaves.filter(l => l.status === 'Pending').length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-mono-code font-bold">
                  {leaves.filter(l => l.status === 'Pending').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <span className="text-xs text-indigo-300 font-mono-code hidden sm:inline px-3">
          Showing {leaves.length} records
        </span>
      </div>

      {/* LEAVES LIST / CARDS */}
      <div className="space-y-3">
        {leaves.length === 0 ? (
          <div className="bg-slate-900/60 backdrop-blur-xl p-12 rounded-2xl text-center text-slate-400 space-y-3 border border-white/15 shadow-xl">
            <CalendarDays className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-semibold text-white">No Leave Requests Found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              There are no records matching the selected status filter. Click "Apply for Leave" above to submit a new time-off application.
            </p>
          </div>
        ) : (
          leaves.map((leave) => (
            <div
              key={leave.id}
              className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl hover:border-white/25 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <img
                  src={leave.employeeAvatar}
                  alt={leave.employeeName}
                  className="w-11 h-11 rounded-full object-cover border border-white/20 shrink-0"
                />

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-manrope font-bold text-white text-base">
                      {leave.employeeName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-code">
                      {leave.employeeId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono-code bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-400/30">
                      {leave.leaveType} Leave
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      • {leave.totalDays} day{leave.totalDays > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span>
                      📅 <strong className="text-slate-200">{leave.startDate}</strong> to <strong className="text-slate-200">{leave.endDate}</strong>
                    </span>
                    <span>•</span>
                    <span>Applied on: {leave.appliedDate}</span>
                    <span>•</span>
                    <span>Dept: {leave.department}</span>
                  </div>

                  <p className="text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-white/10 max-w-2xl">
                    <span className="text-slate-400 font-medium">Reason: </span>
                    "{leave.reason}"
                  </p>

                  {/* Review Audit Trail if Reviewed */}
                  {leave.reviewedBy && (
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Reviewed by <strong className="text-slate-200">{leave.reviewedBy}</strong> on {leave.reviewDate}</span>
                      {leave.reviewComment && (
                        <span className="text-slate-300 italic">— "{leave.reviewComment}"</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Review Actions */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0 self-end md:self-center">
                <span className={`px-3 py-1 rounded-full text-xs font-mono-code font-bold border ${getStatusBadge(leave.status)}`}>
                  {leave.status.toUpperCase()}
                </span>

                {isAdmin && leave.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setReviewingLeave(leave);
                        setReviewAction('Rejected');
                        setReviewComment('Workload conflict with ongoing project milestone.');
                      }}
                      className="px-3 py-2 rounded-xl border border-rose-400/30 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>

                    <button
                      onClick={() => {
                        setReviewingLeave(leave);
                        setReviewAction('Approved');
                        setReviewComment('Approved. Have a great time-off!');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-lg shadow-emerald-600/30 cursor-pointer border border-emerald-400/30"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* HR Decision Review Modal */}
      {reviewingLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900/90 backdrop-blur-2xl max-w-md w-full p-6 rounded-2xl border border-white/20 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-manrope font-bold text-white text-base">
                {reviewAction === 'Approved' ? 'Approve Leave Request' : 'Reject Leave Request'}
              </h2>
              <span className={`text-xs font-mono-code px-2.5 py-0.5 rounded-full font-bold ${
                reviewAction === 'Approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
              }`}>
                {reviewAction}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-300">
                Employee: <strong className="text-white">{reviewingLeave.employeeName}</strong> ({reviewingLeave.employeeId})
              </p>
              <p className="text-slate-300">
                Duration: <strong className="text-white">{reviewingLeave.startDate} to {reviewingLeave.endDate}</strong> ({reviewingLeave.totalDays} days)
              </p>
              <p className="text-slate-200 bg-slate-950/70 p-3 rounded-xl border border-white/10 italic">
                "{reviewingLeave.reason}"
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                HR Review Note / Comments
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                placeholder="Enter feedback or instructions for the employee..."
                className="w-full bg-slate-950/70 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                onClick={() => setReviewingLeave(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDecision}
                disabled={!!isProcessing}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                  reviewAction === 'Approved'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 border border-emerald-400/30'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 border border-rose-400/30'
                }`}
              >
                {isProcessing ? 'Processing...' : `Confirm ${reviewAction}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
