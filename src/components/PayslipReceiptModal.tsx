import React, { useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode,
  IndianRupee,
  BadgeCheck,
  ArrowLeft
} from 'lucide-react';
import { Payslip } from '../types';
import { formatINR, numberToWordsINR } from '../utils/formatCurrency';
import { CompanyLogo } from './CompanyLogo';

interface PayslipReceiptModalProps {
  payslip: Payslip;
  onClose: () => void;
}

export const PayslipReceiptModal: React.FC<PayslipReceiptModalProps> = ({ payslip, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const { salary } = payslip;
  const basicPay = salary.basicSalary || salary.baseSalary || 0;
  const epfDed = salary.epfDeduction || salary.pfDeduction || 0;
  const ptDed = salary.professionalTax || 200;
  const tdsDed = salary.taxDeduction || 0;
  const totDed = salary.totalDeductions || (epfDed + ptDed + tdsDed);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="max-w-2xl w-full my-6 space-y-3 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky/Fixed Modal Controls Topbar with prominent Back & Close Buttons */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-white/20 text-xs shadow-xl text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95 border border-indigo-400/30"
              title="Return to Payroll (Esc)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Payroll</span>
            </button>
            <span className="text-slate-300 font-mono-code hidden sm:flex items-center gap-1.5 pl-2 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              INDIAN STATUTORY SALARY SLIP • FORM 16
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer border border-white/15"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-105 active:scale-95"
              title="Close Payslip (Esc)"
              aria-label="Close Payslip"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* The Superlinked/Linear Clean Indian Payslip Card */}
        <div
          id="printable-payslip-receipt"
          className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden font-sans border border-slate-200"
        >
          {/* Header watermark & Brand */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-900 pb-4 mb-5 gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <CompanyLogo size="md" withContainer />
                <div>
                  <span className="font-manrope font-extrabold text-lg tracking-tight text-slate-900">
                    DAYFLOW TECHNOLOGIES INDIA PVT. LTD.
                  </span>
                  <div className="text-[10px] text-slate-500 font-mono-code">
                    CIN: U72200KA2023PTC174829 • GSTIN: 29AABCD1234F1Z5 • Bengaluru, KA 560103
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:text-right">
              <span className="font-manrope text-base font-bold text-slate-900 block">
                PAYSLIP FOR {payslip.payrollMonth.toUpperCase()}
              </span>
              <span className="text-[11px] font-mono-code font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                SLIP REF: {payslip.id}
              </span>
            </div>
          </div>

          {/* Employee, Statutory & Bank Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-5 font-mono-code">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Employee Name</span>
              <span className="font-bold text-slate-900 font-sans">{payslip.employeeName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Employee ID</span>
              <span className="font-bold text-slate-900">{payslip.employeeId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">PAN Number</span>
              <span className="font-bold text-slate-900">{payslip.panNumber || 'BPMMA4519L'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">UAN (EPFO)</span>
              <span className="font-bold text-slate-900">{payslip.uanNumber || '101938472910'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Department</span>
              <span className="font-semibold text-slate-800">{payslip.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Designation</span>
              <span className="font-semibold text-slate-800">{payslip.jobTitle}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Bank Name</span>
              <span className="font-semibold text-slate-800">{payslip.bankName || 'HDFC Bank'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Bank A/C & IFSC</span>
              <span className="font-semibold text-slate-800">
                {payslip.bankAccountNumber ? `••••${payslip.bankAccountNumber.slice(-4)}` : '••••7263'} ({payslip.ifscCode || 'HDFC0000128'})
              </span>
            </div>
          </div>

          {/* Attendance Stats for the Month */}
          <div className="grid grid-cols-4 text-center py-2 px-3 bg-slate-100/70 rounded-lg text-xs mb-5 text-slate-700 font-mono-code border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Working Days</span>
              <span className="font-bold text-slate-900">{payslip.workedDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Paid Leaves</span>
              <span className="font-bold text-slate-900">{payslip.paidLeaveDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Loss of Pay (LOP)</span>
              <span className="font-bold text-slate-900">{payslip.lossOfPayDays || 0} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Payment Mode</span>
              <span className="font-bold text-emerald-700">NEFT Transfer</span>
            </div>
          </div>

          {/* Itemized Earnings & Deductions Table (Side-by-Side 2 Column layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 text-xs">
            {/* Earnings Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-slate-900 text-white font-mono-code uppercase tracking-wider py-2 px-3 font-bold text-[11px] flex justify-between">
                  <span>Earnings Component</span>
                  <span>Amount (₹)</span>
                </div>
                <div className="divide-y divide-slate-100 p-2 text-slate-700">
                  <div className="flex justify-between py-1.5 px-2">
                    <span>Basic Pay (50% of CTC)</span>
                    <span className="font-mono-code font-semibold text-slate-900">{formatINR(basicPay)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2">
                    <span>House Rent Allowance (HRA)</span>
                    <span className="font-mono-code font-semibold text-slate-900">{formatINR(salary.hra)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2">
                    <span>Conveyance Allowance</span>
                    <span className="font-mono-code font-semibold text-slate-900">{formatINR(salary.conveyanceAllowance || 1600)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2">
                    <span>Medical Allowance</span>
                    <span className="font-mono-code font-semibold text-slate-900">{formatINR(salary.medicalAllowance || 1250)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2">
                    <span>Special Allowance</span>
                    <span className="font-mono-code font-semibold text-slate-900">{formatINR(salary.specialAllowance)}</span>
                  </div>
                  {salary.performanceBonus > 0 && (
                    <div className="flex justify-between py-1.5 px-2 text-emerald-700 font-medium">
                      <span>Performance Incentive</span>
                      <span className="font-mono-code font-semibold">{formatINR(salary.performanceBonus)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-between py-2.5 px-4 bg-slate-50 font-bold border-t border-slate-200">
                <span className="text-slate-900 font-mono-code">Gross Earnings Total</span>
                <span className="font-mono-code text-slate-900">{formatINR(salary.grossSalary)}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="bg-slate-900 text-white font-mono-code uppercase tracking-wider py-2 px-3 font-bold text-[11px] flex justify-between">
                  <span>Statutory Deductions</span>
                  <span>Deducted (₹)</span>
                </div>
                <div className="divide-y divide-slate-100 p-2 text-slate-700">
                  <div className="flex justify-between py-1.5 px-2 text-rose-700">
                    <div>
                      <span>Employee Provident Fund (EPF)</span>
                      <span className="block text-[9px] text-slate-400 font-mono-code">12% under EPFO Act</span>
                    </div>
                    <span className="font-mono-code font-semibold">-{formatINR(epfDed)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2 text-rose-700">
                    <div>
                      <span>Professional Tax (PT)</span>
                      <span className="block text-[9px] text-slate-400 font-mono-code">State Statutory Tax</span>
                    </div>
                    <span className="font-mono-code font-semibold">-{formatINR(ptDed)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 px-2 text-rose-700">
                    <div>
                      <span>Income Tax (TDS)</span>
                      <span className="block text-[9px] text-slate-400 font-mono-code">Under Section 192</span>
                    </div>
                    <span className="font-mono-code font-semibold">-{formatINR(tdsDed)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between py-2.5 px-4 bg-rose-50 font-bold text-rose-900 border-t border-rose-100">
                <span className="font-mono-code">Total Deductions</span>
                <span className="font-mono-code">-{formatINR(totDed)}</span>
              </div>
            </div>
          </div>

          {/* NET TAKE-HOME SALARY HIGHLIGHT */}
          <div className="p-4 rounded-xl bg-slate-900 text-white mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-slate-400 block">
                  Net Disbursed Take-Home Salary
                </span>
                <span className="font-manrope text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {formatINR(salary.netSalary)}
                </span>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-mono-code text-slate-400 block">NEFT / Bank Ref Number</span>
                <span className="text-xs font-mono-code font-bold text-white bg-slate-800 px-2 py-1 rounded">
                  {payslip.paymentReference}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-300 font-sans italic">
              <span className="text-slate-400 not-italic font-mono-code text-[10px] uppercase block mb-0.5">Amount in Words:</span>
              {numberToWordsINR(salary.netSalary)}
            </div>
          </div>

          {/* Employer Contributions Note & Form 16 Disclaimer */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[10px] text-slate-500 mb-4 font-mono-code space-y-1">
            <div className="flex justify-between text-slate-700 font-medium">
              <span>Employer EPF Contribution (12%): {formatINR(salary.employerEpf || epfDed)}</span>
              <span>Employer Gratuity Accrual (4.81%): {formatINR(salary.gratuity || Math.round(basicPay * 0.0481))}</span>
            </div>
            <p className="text-[9px] text-slate-400 italic">
              Note: This is a system generated salary slip under Dayflow HRMS complying with the Indian Payment of Wages Act and Income Tax Rules.
            </p>
          </div>

          {/* Footer Barcode and Security Seal & Bottom Close button */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-dashed border-slate-300 text-slate-500 text-[10px] font-mono-code gap-3">
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <BadgeCheck className="w-4 h-4" />
              <span>DIGITALLY SIGNED & VERIFIED BY DAYFLOW HR INDIA</span>
            </div>
            <div className="flex items-center gap-3">
              <span>DISBURSEMENT: {payslip.issueDate}</span>
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-sans font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back / Done</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
