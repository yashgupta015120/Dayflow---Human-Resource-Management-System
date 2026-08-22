import React, { useState, useEffect } from 'react';
import { 
  CircleDollarSign, 
  Download, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Printer, 
  CheckCircle2, 
  Play, 
  AlertCircle,
  Eye,
  Building2,
  Lock,
  IndianRupee,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Payslip } from '../types';
import { api } from '../services/api';
import { PayslipReceiptModal } from './PayslipReceiptModal';
import { formatINR, formatINRCompact } from '../utils/formatCurrency';
import confetti from 'canvas-confetti';

interface PayrollViewProps {
  onOpenAi: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({ onOpenAi }) => {
  const { currentUser, isAdmin } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
  const [isProcessingRun, setIsProcessingRun] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>('August 2026');

  const loadPayslips = async () => {
    try {
      const params: any = {};
      if (!isAdmin && currentUser) {
        params.employeeId = currentUser.id;
      }
      const data = await api.getPayslips(params);
      setPayslips(data);
    } catch (err) {
      console.error('Failed to load payslips:', err);
    }
  };

  useEffect(() => {
    loadPayslips();
  }, [currentUser, isAdmin]);

  // Handle HR Payroll Run Generation
  const handleRunPayroll = async () => {
    setIsProcessingRun(true);
    try {
      const res = await api.runPayroll(selectedMonth);
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.5 } });
      alert(`Successfully processed monthly Indian payroll for ${res.generatedCount} employees for ${selectedMonth}! NEFT batch generated.`);
      await loadPayslips();
    } catch (err: any) {
      alert(err.message || 'Payroll processing failed');
    } finally {
      setIsProcessingRun(false);
    }
  };

  // Export CSV in Indian Statutory Format
  const handleExportCsv = () => {
    if (payslips.length === 0) return;
    const headers = ['Payroll Month', 'Staff ID', 'Employee Name', 'PAN', 'UAN', 'Bank Name', 'Account No', 'IFSC', 'Basic Pay', 'HRA', 'Special Allowance', 'Gross Salary', 'Employee EPF (12%)', 'Professional Tax', 'Income Tax TDS', 'Total Deductions', 'Net Take Home', 'NEFT Reference'];
    const rows = payslips.map(p => [
      p.payrollMonth,
      p.employeeId,
      `"${p.employeeName}"`,
      p.panNumber || '',
      p.uanNumber || '',
      `"${p.bankName || 'HDFC Bank'}"`,
      p.bankAccountNumber || '',
      p.ifscCode || '',
      p.salary.basicSalary || p.salary.baseSalary,
      p.salary.hra,
      p.salary.specialAllowance,
      p.salary.grossSalary,
      p.salary.epfDeduction || p.salary.pfDeduction,
      p.salary.professionalTax || 200,
      p.salary.taxDeduction,
      p.salary.totalDeductions,
      p.salary.netSalary,
      p.paymentReference
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dayflow_Payroll_Statutory_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Aggregated totals
  const totalNet = payslips.reduce((acc, p) => acc + p.salary.netSalary, 0);
  const totalGross = payslips.reduce((acc, p) => acc + p.salary.grossSalary, 0);
  const totalEpf = payslips.reduce((acc, p) => acc + (p.salary.epfDeduction || p.salary.pfDeduction || 0), 0);
  const totalTds = payslips.reduce((acc, p) => acc + (p.salary.taxDeduction || 0), 0);
  const totalPt = payslips.reduce((acc, p) => acc + (p.salary.professionalTax || 200), 0);
  const totalDeductions = payslips.reduce((acc, p) => acc + (p.salary.totalDeductions || (p.salary.pfDeduction + p.salary.taxDeduction)), 0);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 backdrop-blur-md">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              Indian Statutory Labor Code & Wage Act Compliant
            </span>
          </div>
          <h1 className="font-manrope text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2.5">
            <CircleDollarSign className="w-6 h-6 text-indigo-600" />
            Payroll & Indian Statutory Compensation
          </h1>
          <p className="text-xs text-slate-600 font-sans font-medium mt-0.5">
            {isAdmin
              ? 'Execute monthly salary runs in INR (₹), manage EPF (12%), Professional Tax, Section 192 TDS, and issue compliant Form 16 / Pay slips.'
              : 'Your verified compensation advice, itemized EPF/PT deductions, and downloadable official INR payslips.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/15 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-lg transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Statutory CSV</span>
          </button>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-xs font-semibold text-indigo-300 backdrop-blur-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tax & Comp Advisor</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleRunPayroll}
              disabled={isProcessingRun}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer border border-emerald-400/30"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isProcessingRun ? 'Disbursing Batch...' : 'Execute Monthly Payroll'}</span>
            </button>
          )}
        </div>
      </div>

      {/* STATS METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl">
          <span className="text-xs font-mono-code text-slate-400 uppercase tracking-wider block mb-1 font-medium">
            {isAdmin ? 'Total Net Disbursement' : 'Your Net Take-Home'}
          </span>
          <div className="font-manrope text-2xl font-extrabold text-white">
            {isAdmin ? formatINR(totalNet) : formatINR(currentUser?.salary.netSalary || 0)}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono-code mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Direct NEFT Bank Transfer
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl">
          <span className="text-xs font-mono-code text-slate-400 uppercase tracking-wider block mb-1 font-medium">
            {isAdmin ? 'Total Monthly CTC Gross' : 'Your Monthly Gross'}
          </span>
          <div className="font-manrope text-2xl font-extrabold text-white">
            {isAdmin ? formatINR(totalGross) : formatINR(currentUser?.salary.grossSalary || 0)}
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-2">
            Basic (50%) + HRA (40%) + Allowances
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl">
          <span className="text-xs font-mono-code text-slate-400 uppercase tracking-wider block mb-1 font-medium">
            {isAdmin ? 'EPFO Remittance (12%)' : 'Your EPF Contribution'}
          </span>
          <div className="font-manrope text-2xl font-extrabold text-indigo-300">
            {isAdmin ? formatINR(totalEpf) : formatINR(currentUser?.salary.epfDeduction || currentUser?.salary.pfDeduction || 0)}
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-2">
            Credited to UAN monthly
          </p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-5 rounded-2xl border border-white/15 shadow-xl">
          <span className="text-xs font-mono-code text-slate-400 uppercase tracking-wider block mb-1 font-medium">
            {isAdmin ? 'Income Tax TDS (Sec 192)' : 'Your TDS & PT Withheld'}
          </span>
          <div className="font-manrope text-2xl font-extrabold text-rose-400">
            {isAdmin ? formatINR(totalTds + totalPt) : formatINR((currentUser?.salary.taxDeduction || 0) + (currentUser?.salary.professionalTax || 200))}
          </div>
          <p className="text-[11px] text-slate-400 font-sans mt-2">
            TDS + PT (₹200/mo)
          </p>
        </div>
      </div>

      {/* STATUTORY RULES NOTICE BANNER */}
      <div className="p-4 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/15 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/10 text-emerald-400 border border-white/10">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold font-manrope text-sm text-white">Indian Payroll Configuration Active</div>
            <div className="text-slate-300 text-[11px]">
              EPFO Rate: 12% Basic • State PT: ₹200/mo • TDS: IT Section 192 New Regime • HRA Sec 10(13A)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono-code font-bold text-[10px] border border-emerald-400/30">
            INR (₹) CURRENCY
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono-code font-bold text-[10px] border border-indigo-400/30">
            FORM 16 READY
          </span>
        </div>
      </div>

      {/* PAYSLIPS ARCHIVE TABLE */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/15 shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h2 className="font-manrope font-bold text-white text-sm">
              Issued Salary Slips & Statutory Pay Advices
            </h2>
          </div>
          <span className="text-xs font-mono-code text-indigo-300 font-medium">
            {payslips.length} Disbursed Slips
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-mono-code uppercase tracking-wider border-b border-white/10 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Pay Period</th>
                <th className="py-3.5 px-4">Employee / ID</th>
                <th className="py-3.5 px-4">PAN / UAN</th>
                <th className="py-3.5 px-4">Basic Pay</th>
                <th className="py-3.5 px-4">Gross Earnings</th>
                <th className="py-3.5 px-4">Deductions (EPF+PT+TDS)</th>
                <th className="py-3.5 px-4">Net Disbursed</th>
                <th className="py-3.5 px-4">NEFT Reference</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {payslips.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No payslips available yet.
                  </td>
                </tr>
              ) : (
                payslips.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                      {p.payrollMonth}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{p.employeeName}</div>
                      <div className="text-[10px] text-slate-400 font-mono-code">{p.employeeId} • {p.department}</div>
                    </td>
                    <td className="py-3 px-4 font-mono-code text-slate-300 text-[11px]">
                      <div>PAN: <span className="font-semibold text-white">{p.panNumber || 'BPMMA4519L'}</span></div>
                      <div className="text-[10px] text-slate-400">UAN: {p.uanNumber || '101938472910'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono-code text-slate-200 font-medium">
                      {formatINR(p.salary.basicSalary || p.salary.baseSalary)}
                    </td>
                    <td className="py-3 px-4 font-mono-code text-slate-200 font-medium">
                      {formatINR(p.salary.grossSalary)}
                    </td>
                    <td className="py-3 px-4 font-mono-code text-rose-400 font-medium">
                      -{formatINR(p.salary.totalDeductions || ((p.salary.epfDeduction || p.salary.pfDeduction) + p.salary.taxDeduction + (p.salary.professionalTax || 200)))}
                    </td>
                    <td className="py-3 px-4 font-mono-code font-bold text-emerald-400 text-sm whitespace-nowrap">
                      {formatINR(p.salary.netSalary)}
                    </td>
                    <td className="py-3 px-4 font-mono-code text-slate-400 text-[11px] whitespace-nowrap">
                      {p.paymentReference}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPayslip(p)}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-indigo-600/30 text-white hover:text-indigo-200 border border-white/15 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Payslip</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SELECTED PAYSLIP MODAL */}
      {selectedPayslip && (
        <PayslipReceiptModal
          payslip={selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
        />
      )}
    </div>
  );
};

