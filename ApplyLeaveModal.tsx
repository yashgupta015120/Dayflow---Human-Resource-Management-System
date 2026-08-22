import React, { useState } from 'react';
import { 
  X, 
  CalendarDays, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LeaveType } from '../types';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  onOpenAiHelper: () => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
  onOpenAiHelper
}) => {
  const { currentUser, refreshUser } = useAuth();
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid');
  const [startDate, setStartDate] = useState<string>('2026-08-25');
  const [endDate, setEndDate] = useState<string>('2026-08-26');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  // Calculate total days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

  // Check balance
  let availableBalance = 0;
  if (leaveType === 'Paid') {
    availableBalance = currentUser.leaveBalance.paid.total - currentUser.leaveBalance.paid.used;
  } else if (leaveType === 'Sick') {
    availableBalance = currentUser.leaveBalance.sick.total - currentUser.leaveBalance.sick.used;
  } else if (leaveType === 'Casual') {
    availableBalance = currentUser.leaveBalance.casual.total - currentUser.leaveBalance.casual.used;
  } else if (leaveType === 'Parental') {
    availableBalance = currentUser.leaveBalance.parental.total - currentUser.leaveBalance.parental.used;
  } else {
    availableBalance = 99; // Unpaid
  }

  const isExceedingBalance = leaveType !== 'Unpaid' && totalDays > availableBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg('Start date cannot be after end date.');
      return;
    }

    if (!reason.trim()) {
      setErrorMsg('Please specify a reason or remarks for your leave request.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createLeave({
        employeeId: currentUser.id,
        leaveType,
        startDate,
        endDate,
        reason
      });

      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
      onSubmitted();
      await refreshUser();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit leave application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-slate-900/90 backdrop-blur-2xl max-w-lg w-full p-6 rounded-3xl border border-white/20 space-y-5 shadow-2xl relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center shadow-md">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-manrope font-bold text-white text-base">
                Apply for Leave
              </h2>
              <p className="text-[11px] text-slate-300">
                Submit time-off request for HR manager review & approval
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Leave Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200">Select Leave Category *</label>
              <span className="text-[11px] font-mono-code text-indigo-300 font-medium">
                Balance: {availableBalance} days available
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Paid', 'Sick', 'Casual', 'Unpaid', 'Parental'] as LeaveType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setLeaveType(t)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    leaveType === t
                      ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-950/60 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t} Leave
                </button>
              ))}
            </div>
          </div>

          {/* Date range pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-200 block mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-200 block mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950/70 border border-white/20 rounded-xl px-3 py-2 text-white font-mono-code text-xs focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* Days duration badge */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Total Requested Duration:</span>
            <span className={`font-mono-code font-bold ${
              isExceedingBalance ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {totalDays} Day{totalDays > 1 ? 's' : ''}
              {isExceedingBalance && ' (Exceeds Balance!)'}
            </span>
          </div>

          {/* Reason / Remarks */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-200">Reason / Remarks *</label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAiHelper();
                }}
                className="text-[11px] text-indigo-300 hover:text-indigo-200 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" /> Draft with AI
              </button>
            </div>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Attending a family wedding and will be traveling out of town. Work tasks handed off."
              className="w-full bg-slate-950/70 border border-white/20 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || isExceedingBalance}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 border border-indigo-400/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
